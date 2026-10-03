# Korean localization rules

This fork follows `zetaloop/chatgpt-checker-next` as a read-only upstream and publishes a Korean-localized userscript.

## Repository ownership boundaries

- `chatgpt-checker-next.user.js` and other upstream application files are upstream-owned. Do not edit them for localization.
- `README.md`, `README.ko.md`, `locales/`, `.localization/`, `dist/`, `.github/workflows/`, and `AGENTS.md` are fork-owned localization assets.
- Never push to the `upstream` remote and never open a pull request against `zetaloop/chatgpt-checker-next`.
- All pushes and pull requests must target `hypn4/chatgpt-checker-next` only.

## Translation workflow

1. Fetch/merge the latest `upstream/main`.
2. Run `bun run --cwd .localization sync`.
3. Translate only active entries whose value is `null` in `locales/ko-KR.json`.
4. Follow `locales/glossary.ko.json` and prefer natural Korean UI wording over literal translation.
5. Preserve placeholders, URLs, format tokens, product names, model slugs, identifiers, and HTML structure exactly.
6. Do not change application logic as part of translation.
7. After translation changes, run `bun run --cwd .localization bump` once.
8. Run `bun run --cwd .localization build` and `bun run --cwd .localization verify`.

Do not manually edit `dist/chatgpt-checker-next.ko.user.js`; it is generated.
