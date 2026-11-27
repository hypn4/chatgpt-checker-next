# 한국어판 관리

한국어판을 업데이트할 때 사용하는 절차입니다. 설치 및 기능 안내는 [README.md](README.md)를 참고하세요.

## 저장소 구성

```text
chatgpt-checker-next.user.js
    원본 스크립트

locales/
├── ko-KR.json
├── glossary.ko.json
└── meta.json

.localization/
├── scripts/
└── tests/

dist/
└── chatgpt-checker-next.ko.user.js
```

`chatgpt-checker-next.user.js`는 원본 저장소에서 가져온 파일입니다. 한국어 문구는 `locales/ko-KR.json`에서, 원본 버전과 커밋 및 번역 revision은 `locales/meta.json`에서 관리합니다.

## Git remote

```text
origin    https://github.com/hypn4/chatgpt-checker-next.git
upstream  https://github.com/zetaloop/chatgpt-checker-next.git
```

`upstream`은 가져오기 전용입니다. 로컬에서 처음 설정할 때는 다음 명령을 사용합니다.

```bash
git remote add upstream https://github.com/zetaloop/chatgpt-checker-next.git
git remote set-url --push upstream DISABLED
```

## 원본 동기화

GitHub Actions의 `Sync upstream` 워크플로가 원본 변경을 정기적으로 확인하고 `sync/upstream-<sha>` 브랜치와 PR을 만듭니다. 열린 동기화 PR이 있으면 최신 원본 커밋을 포함하는 PR부터 작업합니다.

```bash
git fetch upstream main
gh pr list --repo hypn4/chatgpt-checker-next
gh pr checkout PR_NUMBER --repo hypn4/chatgpt-checker-next
bun install --cwd .localization --frozen-lockfile
```

`PR_NUMBER`는 작업할 PR 번호로 바꿉니다. PR이 최신 원본보다 뒤처졌다면 `upstream/main`을 먼저 병합합니다. 원본 README가 함께 변경됐더라도 한국어판 README는 유지하고, 다른 충돌은 직접 해결합니다.

자동 동기화 PR이 없으면 최신 `main`에서 별도 동기화 브랜치를 만든 뒤 원본 변경을 병합합니다. 기존 PR과 새 브랜치 모두 다음 명령으로 번역 목록을 갱신합니다.

```bash
bun run --cwd .localization sync
```

`sync`는 현재 원본에서 번역할 문구를 찾습니다. 기존 번역은 유지하고 새 문구만 `null`로 추가합니다.

## 번역

`bun run --cwd .localization check`로 현재 원본에서 누락된 번역을 확인합니다. `locales/ko-KR.json`의 활성 항목 중 값이 `null`인 문구만 번역합니다. 더 이상 사용되지 않는 문구는 남겨 둡니다.

용어는 `locales/glossary.ko.json`을 기준으로 맞춥니다. 변수, URL, 모델 이름, slug, HTML 구조는 원문 그대로 유지합니다.

번역을 변경했다면 `bump`를 한 번 실행합니다. 번역할 문구가 없다면 `bump`는 생략합니다.

```bash
bun run --cwd .localization bump
bun run --cwd .localization build
bun run --cwd .localization verify
```

`verify`는 테스트, 활성 번역 누락, placeholder 보존, 원본 버전 일치, JavaScript 파싱, 생성 파일의 최신 상태를 검사합니다.

검증을 마친 번역과 배포 파일을 동기화 PR에 커밋하고 push합니다. GitHub CI가 성공하면 원본 커밋 이력을 유지하도록 merge commit으로 `main`에 병합합니다. 최신 PR에 이전 PR의 변경이 포함됐으면 중복 PR은 종료합니다.

한국어판 버전은 `원본 버전.revision` 형식입니다. 원본 버전이 바뀌면 revision은 0부터 시작하고, 같은 버전의 원본 커밋이 추가되거나 한국어 번역을 수정하면 revision이 증가합니다.

## 배포 파일

Tampermonkey에서 설치하는 파일은 다음과 같습니다.

[dist/chatgpt-checker-next.ko.user.js](https://github.com/hypn4/chatgpt-checker-next/raw/refs/heads/main/dist/chatgpt-checker-next.ko.user.js)

생성된 스크립트의 `@downloadURL`과 `@updateURL`도 같은 주소를 사용합니다.

`dist/chatgpt-checker-next.ko.user.js`는 직접 수정하지 않습니다.

## 동기화 원칙

`README.md`와 한국어판 관리 파일은 이 저장소에서 관리합니다. 원본 저장소의 README가 바뀌더라도 한국어 README는 유지됩니다.

원본에서 삭제된 파일은 그대로 제거합니다. 한국어판을 위해 삭제된 구형 스크립트를 별도로 보존하지 않습니다.

다른 원본 코드에서 merge 충돌이 발생하면 자동 동기화를 중단하고 직접 확인합니다. push와 PR은 항상 `hypn4/chatgpt-checker-next`에만 진행합니다.
