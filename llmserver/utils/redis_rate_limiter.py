"""
Redis 기반 분산 Rate Limiter
"""

import time
import logging
from typing import Optional
from fastapi import HTTPException

logger = logging.getLogger(__name__)

try:
    import redis
    REDIS_AVAILABLE = True
except ImportError:
    REDIS_AVAILABLE = False
    logger.warning("Redis 모듈을 찾을 수 없습니다. 메모리 기반 Rate Limiter를 사용합니다.")


class RedisRateLimiter:
    """Redis 기반 분산 Rate Limiter"""

    def __init__(self, redis_url: str = "redis://localhost:6379",
                 requests_per_hour: int = 100,
                 requests_per_day: int = 1000):
        self.requests_per_hour = requests_per_hour
        self.requests_per_day = requests_per_day
        self.redis_client: Optional[redis.Redis] = None
        self._fallback_requests = {}  # Redis 실패시 폴백
        self._total_requests = 0

        if REDIS_AVAILABLE:
            try:
                self.redis_client = redis.from_url(redis_url, decode_responses=True)
                self.redis_client.ping()
                logger.info(f"✅ Redis 연결 성공: {redis_url}")
            except Exception as e:
                logger.error(f"❌ Redis 연결 실패: {e}")
                logger.warning("메모리 기반 Rate Limiter로 폴백합니다.")
                self.redis_client = None
        else:
            logger.warning("Redis 모듈이 설치되지 않았습니다. 메모리 기반으로 동작합니다.")

    def check_rate_limit(self, client_ip: str) -> bool:
        """
        Rate Limit 체크

        Args:
            client_ip: 클라이언트 IP

        Returns:
            True if allowed

        Raises:
            HTTPException: Rate limit 초과시
        """
        if self.redis_client:
            return self._check_redis_rate_limit(client_ip)
        else:
            return self._check_memory_rate_limit(client_ip)

    def _check_redis_rate_limit(self, client_ip: str) -> bool:
        """Redis 기반 Rate Limit"""
        try:
            current_time = int(time.time())
            hour_key = f"ratelimit:hour:{client_ip}:{current_time // 3600}"
            day_key = f"ratelimit:day:{client_ip}:{current_time // 86400}"

            # 시간당 체크
            hour_count = self.redis_client.incr(hour_key)
            if hour_count == 1:
                self.redis_client.expire(hour_key, 3600)  # 1시간 TTL

            if hour_count > self.requests_per_hour:
                logger.warning(f"시간당 Rate limit 초과: {client_ip} ({hour_count}/{self.requests_per_hour})")
                raise HTTPException(
                    status_code=429,
                    detail=f"시간당 요청 제한을 초과했습니다. ({self.requests_per_hour}회/시간)"
                )

            # 일일 체크
            day_count = self.redis_client.incr(day_key)
            if day_count == 1:
                self.redis_client.expire(day_key, 86400)  # 24시간 TTL

            if day_count > self.requests_per_day:
                logger.warning(f"일일 Rate limit 초과: {client_ip} ({day_count}/{self.requests_per_day})")
                raise HTTPException(
                    status_code=429,
                    detail=f"일일 요청 제한을 초과했습니다. ({self.requests_per_day}회/일)"
                )

            # 전체 요청 수 증가
            self.redis_client.incr("ratelimit:total")
            self._total_requests = int(self.redis_client.get("ratelimit:total") or 0)

            logger.info(f"✅ Rate limit 통과: {client_ip} (시간: {hour_count}, 일일: {day_count})")
            return True

        except redis.RedisError as e:
            logger.error(f"Redis 오류 발생: {e}, 메모리 폴백으로 전환")
            return self._check_memory_rate_limit(client_ip)

    def _check_memory_rate_limit(self, client_ip: str) -> bool:
        """메모리 기반 Rate Limit (폴백)"""
        current_time = time.time()
        hour_ago = current_time - 3600

        # 오래된 기록 정리
        if client_ip in self._fallback_requests:
            self._fallback_requests[client_ip] = [
                req_time for req_time in self._fallback_requests[client_ip]
                if req_time > hour_ago
            ]
        else:
            self._fallback_requests[client_ip] = []

        # 시간당 제한 체크
        if len(self._fallback_requests[client_ip]) >= self.requests_per_hour:
            logger.warning(f"메모리 기반 Rate limit 초과: {client_ip}")
            raise HTTPException(
                status_code=429,
                detail=f"시간당 요청 제한을 초과했습니다. ({self.requests_per_hour}회/시간)"
            )

        # 요청 기록
        self._fallback_requests[client_ip].append(current_time)
        self._total_requests += 1

        return True

    def get_total_requests(self) -> int:
        """전체 요청 수 반환"""
        if self.redis_client:
            try:
                return int(self.redis_client.get("ratelimit:total") or 0)
            except redis.RedisError:
                return self._total_requests
        return self._total_requests

    def get_client_status(self, client_ip: str) -> dict:
        """특정 클라이언트의 Rate Limit 상태"""
        if self.redis_client:
            try:
                current_time = int(time.time())
                hour_key = f"ratelimit:hour:{client_ip}:{current_time // 3600}"
                day_key = f"ratelimit:day:{client_ip}:{current_time // 86400}"

                hour_count = int(self.redis_client.get(hour_key) or 0)
                day_count = int(self.redis_client.get(day_key) or 0)

                return {
                    "client_ip": client_ip,
                    "hour_requests": hour_count,
                    "hour_limit": self.requests_per_hour,
                    "day_requests": day_count,
                    "day_limit": self.requests_per_day,
                    "hour_remaining": max(0, self.requests_per_hour - hour_count),
                    "day_remaining": max(0, self.requests_per_day - day_count)
                }
            except redis.RedisError:
                pass

        # 메모리 기반 폴백
        count = len(self._fallback_requests.get(client_ip, []))
        return {
            "client_ip": client_ip,
            "hour_requests": count,
            "hour_limit": self.requests_per_hour,
            "hour_remaining": max(0, self.requests_per_hour - count)
        }

    def reset_client(self, client_ip: str):
        """특정 클라이언트의 Rate Limit 초기화 (관리용)"""
        if self.redis_client:
            try:
                current_time = int(time.time())
                hour_key = f"ratelimit:hour:{client_ip}:{current_time // 3600}"
                day_key = f"ratelimit:day:{client_ip}:{current_time // 86400}"
                self.redis_client.delete(hour_key, day_key)
                logger.info(f"Redis Rate Limit 초기화: {client_ip}")
            except redis.RedisError as e:
                logger.error(f"Redis 초기화 실패: {e}")

        # 메모리도 초기화
        if client_ip in self._fallback_requests:
            del self._fallback_requests[client_ip]
