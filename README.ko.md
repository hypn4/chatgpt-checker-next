# 한국어판 관리

이 문서는 한국어판을 업데이트하거나 번역할 때 필요한 내용만 정리합니다.

일반 사용자는 [README.md](README.md)의 설치 안내를 참고하면 됩니다.

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

`chatgpt-checker-next.user.js`는 원본 저장소에서 가져온 파일입니다. 한국어 문구는 원본 파일에 직접 넣지 않고 `locales/ko-KR.json`에서 관리합니다.

## Git remote

```text
origin    https://github.com/hypn4/chatgpt-checker-next.git
upstream  https://github.com/zetaloop/chatgpt-checker-next.git
```

`upstream`은 가져오기 전용입니다. push URL은 비활성화되어 있습니다.

## 원본 업데이트 가져오기

직접 동기화할 때는 다음 순서로 진행합니다.

```bash
git fetch upstream
git merge upstream/main
bun run --cwd .localization sync
```

`sync`는 현재 원본에서 번역 대상 문구를 다시 찾습니다. 기존 번역은 유지하고 새 문구만 `null`로 추가합니다.

GitHub의 `Sync upstream` workflow도 같은 작업을 정기적으로 수행합니다. 새 커밋이 있으면 `sync/upstream-<sha>` 브랜치와 PR을 만듭니다.

## 번역

`locales/ko-KR.json`에서 값이 `null`인 항목만 번역합니다.

용어는 `locales/glossary.ko.json`을 기준으로 맞춥니다. 변수, URL, 모델 이름, slug, HTML 구조는 원문 그대로 유지합니다.

번역이 끝나면 revision을 올리고 스크립트를 다시 생성합니다.

```bash
bun run --cwd .localization bump
bun run --cwd .localization build
bun run --cwd .localization verify
```

`verify`에서는 다음 항목을 확인합니다.

- 테스트
- 누락된 번역
- placeholder 보존
- JavaScript 파싱
- 생성 파일이 최신 상태인지 여부

## 배포 파일

Tampermonkey에서 설치하는 파일은 다음과 같습니다.

[dist/chatgpt-checker-next.ko.user.js](https://github.com/hypn4/chatgpt-checker-next/raw/refs/heads/main/dist/chatgpt-checker-next.ko.user.js)

생성된 스크립트의 `@downloadURL`과 `@updateURL`도 같은 주소를 사용합니다.

`dist/chatgpt-checker-next.ko.user.js`는 직접 수정하지 않습니다.

## 동기화 원칙

`README.md`와 한국어판 관리 파일은 이 저장소에서 관리합니다. 원본 저장소의 README가 바뀌더라도 한국어 README는 유지됩니다.

그 외 원본 코드에서 merge 충돌이 발생하면 자동 동기화를 중단하고 직접 확인합니다.
