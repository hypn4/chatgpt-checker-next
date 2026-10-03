import { describe, expect, test } from "bun:test";
import {
  applyTranslations,
  buildLocalizedSource,
  bumpLocalizationRevision,
  extractSourceVersion,
  extractTranslatableKeys,
  findMissingTranslations,
  mergeTranslationCatalog,
  nextLocalizationMeta,
  validatePlaceholders,
} from "../scripts/lib.mjs";

const header = `// ==UserScript==
// @name         ChatGPT Checker Next
// @namespace    https://github.com/zetaloop/chatgpt-checker-next
// @homepage     https://github.com/zetaloop/chatgpt-checker-next
// @author       zetaloop
// @version      5.1.3
// @description  查看 ChatGPT 和 Codex 的账号、用量与服务信息。
// @downloadURL  https://github.com/zetaloop/chatgpt-checker-next/raw/refs/heads/main/chatgpt-checker-next.user.js
// @updateURL    https://github.com/zetaloop/chatgpt-checker-next/raw/refs/heads/main/chatgpt-checker-next.user.js
// ==/UserScript==
`;

describe("extractSourceVersion", () => {
  test("reads the upstream userscript version", () => {
    expect(extractSourceVersion(header)).toBe("5.1.3");
  });
});

describe("extractTranslatableKeys", () => {
  test("extracts Chinese user-facing strings while ignoring comments", () => {
    const source = `${header}
// 中文注释不应该进入翻译表
const label = "读取中…";
const mixed = "ChatGPT 运行时模型返回了无效状态。";
`;
    expect(extractTranslatableKeys(source)).toEqual([
      "查看 ChatGPT 和 Codex 的账号、用量与服务信息。",
      "读取中…",
      "ChatGPT 运行时模型返回了无效状态。",
    ]);
  });

  test("extracts HTML text nodes and template fragments without markup", () => {
    const source = `${header}
const html = \`<div><strong>深度研究</strong>剩余次数：<span>...</span></div>\`;
const error = \`刷新页面后启用模块注入：\\n\${items}\`;
`;
    expect(extractTranslatableKeys(source)).toEqual([
      "查看 ChatGPT 和 Codex 的账号、用量与服务信息。",
      "深度研究",
      "剩余次数：",
      "刷新页面后启用模块注入：",
    ]);
  });
});

describe("applyTranslations", () => {
  test("replaces literals and template text without touching expressions or markup", () => {
    const source = `const label = "读取中…";
const html = \`<strong>深度研究</strong>剩余次数：<span>\${remaining}</span>\`;
const error = \`ChatGPT \${origin} 模型列表格式无效。\`;
`;
    const translated = applyTranslations(source, {
      "读取中…": "불러오는 중…",
      "深度研究": "심층 리서치",
      "剩余次数：": "남은 횟수:",
      "模型列表格式无效。": "모델 목록 형식이 올바르지 않습니다.",
    });

    expect(translated).toContain('const label = "불러오는 중…";');
    expect(translated).toContain("<strong>심층 리서치</strong>남은 횟수:<span>${remaining}</span>");
    expect(translated).toContain("ChatGPT ${origin} 모델 목록 형식이 올바르지 않습니다.");
  });
});

describe("validatePlaceholders", () => {
  test("accepts preserved printf and brace placeholders", () => {
    expect(() =>
      validatePlaceholders("剩余 %s / {count}", "남음 %s / {count}"),
    ).not.toThrow();
  });

  test("rejects dropped placeholders", () => {
    expect(() =>
      validatePlaceholders("剩余 %s / {count}", "남음 {count}"),
    ).toThrow();
  });
});

describe("buildLocalizedSource", () => {
  test("rewrites metadata only for the Korean distribution", () => {
    const source = `${header}
const label = "读取中…";
`;
    const built = buildLocalizedSource(
      source,
      {
        "查看 ChatGPT 和 Codex 的账号、用量与服务信息。":
          "ChatGPT와 Codex의 계정, 사용량 및 서비스 정보를 확인합니다.",
        "读取中…": "불러오는 중…",
      },
      {
        repository: "hypn4/chatgpt-checker-next",
        revision: 2,
      },
    );

    expect(built).toContain("// @name         ChatGPT Checker Next (한국어)");
    expect(built).toContain("// @version      5.1.3.2");
    expect(built).toContain(
      "// @namespace    https://github.com/hypn4/chatgpt-checker-next",
    );
    expect(built).toContain(
      "// @downloadURL  https://github.com/hypn4/chatgpt-checker-next/raw/refs/heads/main/dist/chatgpt-checker-next.ko.user.js",
    );
    expect(built).toContain(
      "// @updateURL    https://github.com/hypn4/chatgpt-checker-next/raw/refs/heads/main/dist/chatgpt-checker-next.ko.user.js",
    );
    expect(built).toContain('const label = "불러오는 중…";');
  });
});

describe("translation catalog", () => {
  test("preserves existing translations and appends only new keys", () => {
    expect(
      mergeTranslationCatalog(
        ["读取中…", "新字符串"],
        {
          "旧字符串": "예전 문자열",
          "读取中…": "불러오는 중…",
        },
      ),
    ).toEqual({
      "旧字符串": "예전 문자열",
      "读取中…": "불러오는 중…",
      "新字符串": null,
    });
  });

  test("reports only active untranslated keys", () => {
    expect(
      findMissingTranslations(
        ["读取中…", "新字符串"],
        {
          "读取中…": "불러오는 중…",
          "新字符串": null,
          "旧字符串": null,
        },
      ),
    ).toEqual(["新字符串"]);
  });
});

describe("localization revision metadata", () => {
  test("starts at revision 1 for the first tracked upstream commit", () => {
    expect(
      nextLocalizationMeta(null, {
        upstreamVersion: "5.1.3",
        upstreamSha: "aaa",
      }),
    ).toEqual({
      upstreamVersion: "5.1.3",
      upstreamSha: "aaa",
      revision: 1,
    });
  });

  test("increments revision when upstream changes without a version bump", () => {
    expect(
      nextLocalizationMeta(
        {
          upstreamVersion: "5.1.3",
          upstreamSha: "aaa",
          revision: 4,
        },
        {
          upstreamVersion: "5.1.3",
          upstreamSha: "bbb",
        },
      ),
    ).toEqual({
      upstreamVersion: "5.1.3",
      upstreamSha: "bbb",
      revision: 5,
    });
  });

  test("resets revision when upstream version increases", () => {
    expect(
      nextLocalizationMeta(
        {
          upstreamVersion: "5.1.3",
          upstreamSha: "aaa",
          revision: 9,
        },
        {
          upstreamVersion: "5.1.4",
          upstreamSha: "bbb",
        },
      ),
    ).toEqual({
      upstreamVersion: "5.1.4",
      upstreamSha: "bbb",
      revision: 0,
    });
  });

  test("does not bump twice for the same upstream SHA", () => {
    expect(
      nextLocalizationMeta(
        {
          upstreamVersion: "5.1.3",
          upstreamSha: "aaa",
          revision: 4,
        },
        {
          upstreamVersion: "5.1.3",
          upstreamSha: "aaa",
        },
      ).revision,
    ).toBe(4);
  });

  test("supports an explicit local translation revision bump", () => {
    expect(
      bumpLocalizationRevision({
        upstreamVersion: "5.1.3",
        upstreamSha: "aaa",
        revision: 4,
      }).revision,
    ).toBe(5);
  });
});
