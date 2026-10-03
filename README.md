> 한국어 현지화 fork입니다. 원본 프로젝트: [zetaloop/chatgpt-checker-next](https://github.com/zetaloop/chatgpt-checker-next)

# ChatGPT Checker Next — 한국어판

ChatGPT와 Codex의 계정, 사용량, 서비스 상태를 확인하고 편의 기능을 추가하는 Tampermonkey userscript의 한국어판입니다.

**[한국어판 설치](https://github.com/hypn4/chatgpt-checker-next/raw/refs/heads/main/dist/chatgpt-checker-next.ko.user.js)** · [한국어 문서](README.ko.md) · [Upstream](https://github.com/zetaloop/chatgpt-checker-next)

## 한국어판 설치

1. [Tampermonkey](https://www.tampermonkey.net)를 설치합니다.
2. **[chatgpt-checker-next.ko.user.js 설치](https://github.com/hypn4/chatgpt-checker-next/raw/refs/heads/main/dist/chatgpt-checker-next.ko.user.js)** 를 엽니다.
3. Tampermonkey 설치 화면에서 확인한 뒤 ChatGPT 또는 Codex를 엽니다.
4. 페이지 오른쪽의 원형 표시 위에 마우스를 올리면 모델, 사용량, 서비스 상태 등을 확인할 수 있습니다.

한국어판은 `dist/chatgpt-checker-next.ko.user.js`에서 배포되며 Tampermonkey의 자동 업데이트도 이 fork에서 받습니다.

## 이 fork에 대해

- upstream 코드는 가능한 그대로 유지합니다.
- 한국어 번역은 `locales/ko-KR.json`에서 별도로 관리합니다.
- GitHub Actions는 upstream의 새 커밋을 감지하고 **이 fork 내부에만** 동기화 PR을 만듭니다.
- 번역에는 GitHub Actions의 AI를 사용하지 않습니다. 필요한 번역은 로컬 AI 코딩 에이전트로 수행합니다.
- `upstream` remote는 fetch 전용이며 upstream 저장소로 push하거나 PR을 보내지 않습니다.

자세한 구조와 번역/동기화 방법은 [README.ko.md](README.ko.md)를 참고하세요.

---

## Upstream README

> Forked from [KoriIku/chatgpt-degrade-checker](https://github.com/KoriIku/chatgpt-degrade-checker).

# ChatGPT Checker Next

查看 ChatGPT 和 Codex 的账号、用量与服务信息，并启用一些有趣的功能。

## 安装

1. 首先需要装有 [Tampermonkey](https://www.tampermonkey.net)
2. 然后点击链接安装脚本 [chatgpt-checker-next.user.js](https://github.com/zetaloop/chatgpt-checker-next/raw/refs/heads/main/chatgpt-checker-next.user.js)
3. 打开 ChatGPT / Codex，页面右侧有一个圆圈，将鼠标光标放上去即可查看模型、额度、服务质量等信息。

## 功能

#### ChatGPT
- **服务质量**：网站的 Proof Of Work 挑战难度值，数值越大通常代表风控越轻，但并不是唯一的判断标准。
- **模型**：为当前会话切换 Chat 和 Work 模式、模型与思考强度，也可输入自定义值。
- **地区信息**：当前账号所在的国家/地区、计费币种、时区、语言等。
- **剩余次数**：深度研究、图片生成、文件上传、粘贴文本为文件的剩余次数与重置时间。
- **套餐用量**：Codex/Work、ChatPass 等用量进度条与重置时间，以及积分和重置机会。
- **复制全文**：添加一个复制整个对话内容的按钮。
- **显示消息时间**：在消息末尾显示时间与模型信息。
- **其他小功能**：假装自己是会员、禁用划词悬浮窗、自动批准工具请求等。

#### 更多好玩的功能敬请期待 uwu
