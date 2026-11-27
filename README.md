# ChatGPT Checker Next 한국어판

[ChatGPT Checker Next](https://github.com/zetaloop/chatgpt-checker-next)의 한국어 번역판입니다.

ChatGPT와 Codex의 계정 정보, 사용량, 서비스 상태를 확인하고 몇 가지 편의 기능을 추가하는 Tampermonkey 스크립트입니다.

[한국어판 설치](https://github.com/hypn4/chatgpt-checker-next/raw/refs/heads/main/dist/chatgpt-checker-next.ko.user.js) | [원본 저장소](https://github.com/zetaloop/chatgpt-checker-next)

## 설치

1. [Tampermonkey](https://www.tampermonkey.net)를 설치합니다.
2. [chatgpt-checker-next.ko.user.js](https://github.com/hypn4/chatgpt-checker-next/raw/refs/heads/main/dist/chatgpt-checker-next.ko.user.js)를 엽니다.
3. Tampermonkey에서 스크립트 설치를 확인합니다.
4. ChatGPT 또는 Codex를 열고 페이지 오른쪽의 원형 버튼에 마우스를 올려 정보를 확인합니다.

설치 후 업데이트도 이 저장소의 한국어판 스크립트에서 받습니다.

## 기능

- ChatGPT 서비스 상태와 PoW 난이도 확인 (10진수, 16진수 전환)
- Chat, Work 모드와 모델, 추론 강도 변경
- 계정 지역, 결제 통화, 시간대, 언어 정보 확인
- 심층 리서치, 이미지 생성, 파일 업로드 등의 남은 사용량과 초기화 시각 확인
- Codex, Work, ChatPass 사용량과 크레딧 확인
- 전체 대화 및 개별 메시지 복사, 원본 형식과 추론 내용 포함 옵션
- 텍스트 붙여넣기 방식 선택 (텍스트 우선, 텍스트만, 첨부파일만, 기존 방식)
- 메시지 시간과 응답 모델 표시, 추론 중 메시지 하단 액션 바 미리 표시
- 사이드바와 메뉴에서 가운데 클릭 또는 Ctrl+클릭으로 새 탭 열기
- 분석 코드 블록 자동 접기
- 도구 요청 자동 승인
- 텍스트 선택 팝오버 비활성화, 화면에 표시되는 플랜 변경

PoW 난이도는 참고 지표이며, 실제 응답 품질이나 서비스 제한을 단독으로 판단할 수 있는 기준은 아닙니다. 화면의 플랜 표시를 변경해도 실제 구독이나 사용 한도는 바뀌지 않습니다.

## 업데이트

원본 저장소의 새 커밋은 GitHub Actions에서 정기적으로 확인합니다.

변경 사항이 있으면 이 저장소에 동기화 PR을 만듭니다. 필요한 문구를 번역하고 스크립트를 빌드한 뒤 검증을 거쳐 `main`에 병합합니다.

원본 저장소에는 이 저장소의 커밋이나 PR을 보내지 않습니다.

## 개발

원본 `chatgpt-checker-next.user.js`는 직접 번역하지 않습니다. 한국어 문구는 `locales/ko-KR.json`에서 관리하며, 배포 파일은 `dist/chatgpt-checker-next.ko.user.js`에 생성됩니다.

동기화, 번역, 빌드 방법은 [한국어판 관리 문서](README.ko.md)를 참고하세요.

## 원본 프로젝트

- [zetaloop/chatgpt-checker-next](https://github.com/zetaloop/chatgpt-checker-next)
- [KoriIku/chatgpt-degrade-checker](https://github.com/KoriIku/chatgpt-degrade-checker)

원본 프로젝트의 라이선스는 [AGPL-3.0](LICENSE)입니다.
