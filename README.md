# behindy
Web text adventure shifting from everyday subway life to a surreal world of urban legends

<hr>

## Project Milestone

1. docker, Git Actions 사용해서 개발 환경 구축하기
  nignx, next.js, springboot, fastApi

2. 각 컨테이너간의 통신 확인

3. springboot 1차 작업
  - 기본 api(인증, 게시글, 지하철 노선도) 

4. next.js 1차 작업
  - 기본기능 (인증, 게시글, 지하철 노선도)

5. 컨테이너간 통신 재확인, 배포환경에서의 통신 확인 cors 해결 

6. fastAPI 1차 작업
  - llmAPI 와의 통신, 프롬프트 작성
  - 스토리 검토, 포매팅 로직
  - 컨테이너 간 통신 확인

7. springboot 2차 작업
  - 게임 로직 구체화

8. next.js 2차 작업
  - 게임 프론트엔드 구체화

9. springboot 3차 작업
  - 운영 기능 구체화(로깅, 통계, 보안)

<hr>

## Conventional Commits

pj : nginx          (project)
sb : SpringBoot
nx : next.js
fa : fastApi

feat:       새로운 기능 추가

fix:        버그 수정 / 오타 수정/ 리팩토링 등 기존 작업물의 변화

docs:       문서 수정 (README 등)

chore:      기타 변경사항 ( 설정, 패키지 등)

build:      빌드 관련 작업 / CI 설정 관련 변경


ex) sb-fix : entity 내용 수정

<hr>

## License

This project is licensed under the MIT License.  
See the [LICENSE](./LICENSE) file for details.
