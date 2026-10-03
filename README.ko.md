# ChatGPT Checker Next 한국어판

이 저장소는 [zetaloop/chatgpt-checker-next](https://github.com/zetaloop/chatgpt-checker-next)의 fork이며, upstream 코드는 가능한 그대로 유지하고 한국어 현지화 레이어만 별도로 관리합니다.

- upstream: `zetaloop/chatgpt-checker-next` — 읽기/동기화 전용
- fork: `hypn4/chatgpt-checker-next` — 한국어 번역, 배포, PR 대상
- 한국어 userscript: `dist/chatgpt-checker-next.ko.user.js`

## 로컬 번역

```bash
git fetch upstream
git merge upstream/main
bun install --cwd .localization
bun run --cwd .localization sync
```

`locales/ko-KR.json`에서 값이 `null`인 항목만 번역한 뒤:

```bash
bun run --cwd .localization bump
bun run --cwd .localization build
bun run --cwd .localization verify
```

upstream 원본 파일은 번역을 위해 직접 수정하지 않습니다.
