# ChatGPT Checker Next 한국어판

[ChatGPT Checker Next](https://github.com/zetaloop/chatgpt-checker-next)의 한국어 번역판입니다.

ChatGPT와 Codex의 계정 정보, 사용량, 서비스 상태를 확인하고 몇 가지 편의 기능을 추가하는 Tampermonkey 스크립트입니다.

[한국어판 설치](https://github.com/hypn4/chatgpt-checker-next/raw/refs/heads/main/dist/chatgpt-checker-next.ko.user.js) | [원본 저장소](https://github.com/zetaloop/chatgpt-checker-next)

## 설치

1. [Tampermonkey](https://www.tampermonkey.net)를 설치합니다.
2. [chatgpt-checker-next.ko.user.js](https://github.com/hypn4/chatgpt-checker-next/raw/refs/heads/main/dist/chatgpt-checker-next.ko.user.js)를 엽니다.
3. Tampermonkey에서 스크립트 설치를 확인합니다.
4. ChatGPT 또는 Codex를 열면 페이지 오른쪽에 표시되는 원형 버튼에서 정보를 확인할 수 있습니다.

설치 후 업데이트도 이 저장소의 한국어판 스크립트에서 받습니다.

## 기능

- ChatGPT 서비스 상태와 PoW 난이도 확인
- Chat, Work 모드와 모델, 추론 강도 변경
- 계정 지역, 결제 통화, 시간대, 언어 정보 확인
- 심층 리서치, 이미지 생성, 파일 업로드 등의 남은 사용량 확인
- Codex, Work, ChatPass 사용량과 크레딧 확인
- 전체 대화 복사
- 메시지 시간과 응답 모델 표시
- 도구 요청 자동 승인
- 텍스트 선택 팝오버 비활성화

## 업데이트

원본 저장소의 새 커밋은 GitHub Actions에서 정기적으로 확인합니다.

변경 사항이 있으면 이 저장소에 동기화 브랜치와 PR을 만들고, 새로 추가된 문구를 번역한 뒤 한국어판 스크립트를 다시 생성합니다.

원본 저장소에는 이 저장소의 커밋이나 PR을 보내지 않습니다.

## 개발

번역은 `locales/ko-KR.json`에서 관리합니다.

```bash
git fetch upstream
git merge upstream/main

bun install --cwd .localization --frozen-lockfile
bun run --cwd .localization sync
```

새로 추가된 `null` 값을 번역한 뒤 다음 명령으로 빌드하고 확인합니다.

```bash
bun run --cwd .localization bump
bun run --cwd .localization build
bun run --cwd .localization verify
```

생성된 파일은 다음 위치에 저장됩니다.

```text
dist/chatgpt-checker-next.ko.user.js
```

원본 `chatgpt-checker-next.user.js`는 번역을 위해 직접 수정하지 않습니다.

자세한 관리 방식은 [README.ko.md](README.ko.md)를 참고하세요.

## 원본 프로젝트

- [zetaloop/chatgpt-checker-next](https://github.com/zetaloop/chatgpt-checker-next)
- [KoriIku/chatgpt-degrade-checker](https://github.com/KoriIku/chatgpt-degrade-checker)

원본 프로젝트의 라이선스는 [AGPL-3.0](LICENSE)입니다.
