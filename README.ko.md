# ChatGPT Checker Next 한국어판

[zetaloop/chatgpt-checker-next](https://github.com/zetaloop/chatgpt-checker-next)의 한국어 현지화 fork입니다. 원본 기능과 upstream 변경을 최대한 그대로 따라가면서, 한국어 번역과 배포 계층만 이 저장소에서 별도로 관리합니다.

**[한국어판 Tampermonkey 스크립트 설치](https://github.com/hypn4/chatgpt-checker-next/raw/refs/heads/main/dist/chatgpt-checker-next.ko.user.js)**

## 주요 기능

원본 ChatGPT Checker Next의 기능을 그대로 제공하면서 UI와 진단 문구를 한국어로 표시합니다.

- ChatGPT 서비스 상태와 PoW 난이도 확인
- Chat / Work 모드, 모델 및 추론 강도 전환
- 계정 지역, 결제 통화, 시간대 및 언어 정보
- 심층 리서치, 이미지 생성, 파일 업로드 등 사용량 확인
- Codex / Work / ChatPass 사용량 및 크레딧 확인
- 전체 대화 복사
- 메시지 시간 및 응답 모델 표시
- 도구 요청 자동 승인, 텍스트 선택 팝오버 비활성화 등 편의 기능

## 설치

1. [Tampermonkey](https://www.tampermonkey.net)를 설치합니다.
2. **[한국어판 userscript 설치](https://github.com/hypn4/chatgpt-checker-next/raw/refs/heads/main/dist/chatgpt-checker-next.ko.user.js)** 를 클릭합니다.
3. Tampermonkey 설치 화면에서 스크립트를 설치합니다.
4. ChatGPT 또는 Codex를 열고 페이지 오른쪽의 원형 표시 위에 마우스를 올립니다.

배포 파일:

```text
dist/chatgpt-checker-next.ko.user.js
```

Tampermonkey의 `@downloadURL`과 `@updateURL`도 위 한국어판 배포 파일을 가리키므로, 설치 이후 업데이트는 이 fork에서 받습니다.

## Upstream과의 관계

이 저장소는 GitHub fork이지만 upstream에는 어떠한 변경도 보내지 않습니다.

```text
zetaloop/chatgpt-checker-next
        │
        │ fetch only
        ▼
hypn4/chatgpt-checker-next
        │
        ├─ locales/   한국어 번역
        ├─ dist/      한국어 userscript
        └─ Actions    upstream 동기화 및 검증
```

로컬 remote는 다음과 같이 구성됩니다.

```text
origin    https://github.com/hypn4/chatgpt-checker-next.git     fetch / push
upstream  https://github.com/zetaloop/chatgpt-checker-next.git  fetch only
upstream  DISABLED                                               push
```

따라서 이 저장소의 커밋, 브랜치 및 PR은 `hypn4/chatgpt-checker-next` 안에서만 관리합니다.

## 자동 upstream 동기화

`Sync upstream` GitHub Actions workflow가 정기적으로 upstream의 `main`을 확인합니다.

새 upstream 커밋이 있으면:

1. upstream 최신 커밋을 fetch합니다.
2. 이 fork에 `sync/upstream-<sha>` 브랜치를 만듭니다.
3. upstream 변경을 merge합니다.
4. 새로운 중국어 문자열을 `locales/ko-KR.json`에 `null` 값으로 추가합니다.
5. 이 fork 내부에만 PR을 만듭니다.

GitHub Actions는 번역에 AI를 사용하지 않습니다.

## 로컬 번역

upstream sync PR에 번역이 필요한 문자열이 추가되면 해당 브랜치를 로컬에서 가져옵니다.

```bash
gh pr checkout <PR 번호>
bun install --cwd .localization --frozen-lockfile
```

그 다음 로컬 AI 코딩 에이전트나 직접 편집으로 `locales/ko-KR.json`에서 값이 `null`인 항목만 번역합니다.

번역 규칙은 `AGENTS.md`와 `locales/glossary.ko.json`에 정의되어 있습니다.

번역 후:

```bash
bun run --cwd .localization bump
bun run --cwd .localization build
bun run --cwd .localization verify
```

검증이 끝나면 같은 sync PR 브랜치에 push하면 됩니다.

## 현지화 구조

```text
chatgpt-checker-next.user.js       upstream 원본

locales/
├── ko-KR.json                    번역 카탈로그
├── glossary.ko.json              용어집
└── meta.json                     upstream SHA / 버전 / 현지화 revision

.localization/
├── scripts/
│   ├── sync.mjs                  문자열 추출 및 카탈로그 동기화
│   ├── bump.mjs                  현지화 revision 증가
│   ├── build.mjs                 한국어 userscript 생성
│   ├── check.mjs                 번역/구조 검증
│   └── lib.mjs
└── tests/

dist/
└── chatgpt-checker-next.ko.user.js
```

upstream 원본 파일은 한국어 번역을 위해 직접 수정하지 않습니다. 한국어 userscript는 upstream 원본과 번역 카탈로그를 조합하여 생성합니다.

## 개발 및 검증

```bash
bun install --cwd .localization
bun run --cwd .localization sync
bun run --cwd .localization build
bun run --cwd .localization verify
```

`verify`는 테스트, 누락 번역, placeholder 보존, JavaScript 파싱 및 생성물 최신 여부를 검사합니다.

## Upstream

원본 프로젝트와 기능 설명은 다음 저장소를 참고하세요.

- [zetaloop/chatgpt-checker-next](https://github.com/zetaloop/chatgpt-checker-next)

이 fork는 upstream 프로젝트와 별도로 운영되는 한국어 현지화판입니다.
