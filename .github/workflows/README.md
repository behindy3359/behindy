# GitHub Actions 워크플로우

## 활성화된 워크플로우

### CI 워크플로우
- `frontend-test.yml`: Frontend 테스트 (`frontend/**` 변경 시 실행)
- `backend-test.yml`: Backend 테스트 (`backend/**` 변경 시 실행)

## 비활성화된 워크플로우

### ci.yml.disabled (통합 CI/CD)
**비활성화 사유**: 중복 job으로 인한 "skipped" 상태 발생
- 4개의 job (frontend-test, backend-test, build-frontend, build-backend)이 조건부 실행으로 항상 skip됨
- `frontend-test.yml`과 `backend-test.yml`이 이미 동일한 테스트 기능 수행 중
- **비활성화 날짜**: 2025-01-21

### deploy.yml.disabled (배포)
**비활성화 사유**: 배포 프로세스를 `behindy-build` Repository로 이전

#### 이전 배포 방식 (비활성화됨)
```
behindy (main push)
  ↓
  GitHub Actions → EC2에서 직접 빌드 & 배포

문제점:
- EC2 t3.micro (2GB RAM)에서 빌드 시 메모리 부족
- 빌드 시간 6분 소요
- 높은 배포 실패율
```

#### 새로운 배포 방식 (현재)
```
behindy (소스 코드 수정)
  ↓
  로컬에서 빌드 (고성능 환경)
  ↓
  build-and-deploy.sh 실행
  ↓
  behindy-build Repository에 push
  ↓
  GitHub Actions → EC2에서 빌드 없이 배포

장점:
- 배포 시간 2분
- 메모리 안정적
- Rolling Update로 무중단 배포
- 데이터 영속성 보장
```

## 배포 방법

### 1. 소스 코드 수정 후 배포

```bash
# 1. behindy 프로젝트에서 코드 수정
cd ~/projects/behindy
git add .
git commit -m "feat: 새로운 기능 추가"
git push origin main

# 2. 빌드 및 배포 스크립트 실행
cd ~/projects/behindy-build
./build-and-deploy.sh
```

### 2. deploy.yml을 다시 활성화하려면

```bash
# 파일명 변경
mv .github/workflows/deploy.yml.disabled .github/workflows/deploy.yml

# ⚠️ 주의: behindy-build 배포와 충돌할 수 있음
# 두 배포 시스템을 동시에 사용하지 마세요!
```

## 관련 문서

- [behindy-build Repository](https://github.com/behindy3359/behindy-build)
- [CI/CD 개선 문서](../../document/A07_cicd_improvement.md)
