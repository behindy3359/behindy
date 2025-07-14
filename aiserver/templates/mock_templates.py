"""
AI 서버 간단한 Mock 템플릿 시스템
Spring Boot 호환 + 첫 페이지 + 선택지 분화 2페이지만
"""

import random
from typing import Dict, List, Any
from enum import Enum

class StationTheme(Enum):
    MYSTERY = "미스터리"
    HORROR = "공포"
    ROMANCE = "로맨스"
    ADVENTURE = "모험"
    COMEDY = "코미디"
    THRILLER = "스릴러"

# 핵심 역만 포함
STATION_CONFIG = {
    "종각": {"line": 1, "theme": StationTheme.MYSTERY},
    "시청": {"line": 1, "theme": StationTheme.THRILLER},
    "서울역": {"line": 1, "theme": StationTheme.ADVENTURE},
    "강남": {"line": 2, "theme": StationTheme.ROMANCE},
    "홍대입구": {"line": 2, "theme": StationTheme.COMEDY},
    "잠실": {"line": 2, "theme": StationTheme.ADVENTURE},
    "압구정": {"line": 3, "theme": StationTheme.ROMANCE},
    "교대": {"line": 3, "theme": StationTheme.MYSTERY},
    "옥수": {"line": 3, "theme": StationTheme.MYSTERY},
    "명동": {"line": 4, "theme": StationTheme.ADVENTURE},
    "혜화": {"line": 4, "theme": StationTheme.ROMANCE},
    "사당": {"line": 4, "theme": StationTheme.HORROR}
}

class MockStoryGenerator:
    """간단한 Mock 스토리 생성기"""
    
    def generate_story(self, station_name: str, character_health: int, character_sanity: int) -> Dict[str, Any]:
        """첫 페이지 스토리 생성"""
        config = STATION_CONFIG.get(station_name, {"line": 1, "theme": StationTheme.MYSTERY})
        theme = config["theme"]
        line_number = config["line"]
        
        # 간단한 스토리 내용
        story_content = f"{station_name}역에서 {theme.value} 이야기가 시작됩니다.\n\n" \
                       f"당신의 현재 상태 - 체력: {character_health}, 정신력: {character_sanity}\n\n" \
                       f"어떤 선택을 하시겠습니까?"
        
        # 고정 3개 선택지
        options = [
            {
                "content": "적극적으로 행동한다",
                "effect": "health",
                "amount": -5,
                "effect_preview": "체력 -5"
            },
            {
                "content": "신중하게 관찰한다",
                "effect": "sanity",
                "amount": 3,
                "effect_preview": "정신력 +3"
            },
            {
                "content": "안전하게 피한다",
                "effect": "none",
                "amount": 0,
                "effect_preview": "변화 없음"
            }
        ]
        
        return {
            "story_title": f"{station_name}역의 {theme.value}",
            "page_content": story_content,
            "options": options,
            "estimated_length": 6,
            "difficulty": "보통",
            "theme": theme.value,
            "station_name": station_name,
            "line_number": line_number
        }
    
    def continue_story(self, previous_choice: str, station_name: str, 
                      character_health: int, character_sanity: int) -> Dict[str, Any]:
        """선택지에 따른 다음 페이지"""
        
        # 선택지에 따른 간단한 분기
        if "적극적으로" in previous_choice:
            content = f"적극적인 행동의 결과... 상황이 복잡해졌습니다.\n체력이 소모되었지만 중요한 정보를 얻었습니다."
            options = [
                {"content": "계속 추진한다", "effect": "health", "amount": -3, "effect_preview": "체력 -3"},
                {"content": "전략을 바꾼다", "effect": "sanity", "amount": 5, "effect_preview": "정신력 +5"}
            ]
        elif "신중하게" in previous_choice:
            content = f"신중한 관찰의 결과... 상황을 더 잘 이해하게 되었습니다.\n정신력이 회복되고 새로운 기회를 발견했습니다."
            options = [
                {"content": "기회를 활용한다", "effect": "health", "amount": 5, "effect_preview": "체력 +5"},
                {"content": "더 지켜본다", "effect": "sanity", "amount": 2, "effect_preview": "정신력 +2"}
            ]
        else:  # 안전하게 피한다
            content = f"안전한 선택의 결과... 위험을 피했지만 기회도 놓쳤습니다.\n하지만 안전한 상태를 유지했습니다."
            options = [
                {"content": "다른 방법을 찾는다", "effect": "sanity", "amount": 3, "effect_preview": "정신력 +3"},
                {"content": "포기하고 떠난다", "effect": "none", "amount": 0, "effect_preview": "변화 없음"}
            ]
        
        return {
            "page_content": content,
            "options": options,
            "is_last_page": len(options) < 2  # 옵션이 1개면 마지막 페이지로 간주
        }


# ===== 테스트 함수 =====

def test_basic_generation():
    """기본 생성 테스트"""
    print("=== 기본 Mock 데이터 테스트 ===")
    generator = MockStoryGenerator()
    
    # 첫 페이지 테스트
    story = generator.generate_story("강남", 80, 70)
    print(f"✅ 첫 페이지: {story['story_title']}")
    print(f"   테마: {story['theme']}")
    print(f"   선택지: {len(story['options'])}개")
    
    # 선택지 분기 테스트
    for i, option in enumerate(story['options']):
        print(f"\n--- 선택지 {i+1}: {option['content']} ---")
        continuation = generator.continue_story(option['content'], "강남", 75, 73)
        print(f"결과: {continuation['page_content'][:50]}...")
        print(f"다음 선택지: {len(continuation['options'])}개")
    
    return True

def validate_spring_boot_format(data: Dict[str, Any]) -> bool:
    """Spring Boot 형식 검증"""
    required_fields = ["story_title", "page_content", "options", "estimated_length", 
                      "difficulty", "theme", "station_name", "line_number"]
    
    for field in required_fields:
        if field not in data:
            print(f"❌ 누락된 필드: {field}")
            return False
    
    if len(data["options"]) != 3:
        print(f"❌ 선택지 개수 오류: {len(data['options'])}")
        return False
    
    print("✅ Spring Boot DTO 형식 검증 통과")
    return True

# 실행 테스트
if __name__ == "__main__":
    success = test_basic_generation()
    print(f"\n테스트 결과: {'✅ 성공' if success else '❌ 실패'}")
    
    # 형식 검증
    generator = MockStoryGenerator()
    test_data = generator.generate_story("강남", 80, 80)
    validate_spring_boot_format(test_data)