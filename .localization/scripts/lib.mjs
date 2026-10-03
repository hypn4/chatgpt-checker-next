import { parse } from "acorn";

const HAN_RE = /\p{Script=Han}/u;
const METADATA_RE = /^\/\/ @(\S+)\s+(.*)$/gm;

function parseSource(source) {
  return parse(source, {
    ecmaVersion: "latest",
    sourceType: "script",
    allowHashBang: true,
  });
}

function visit(node, callback) {
  if (!node || typeof node !== "object") return;
  if (typeof node.type === "string") callback(node);
  for (const value of Object.values(node)) {
    if (Array.isArray(value)) {
      for (const child of value) visit(child, callback);
    } else if (value && typeof value === "object" && typeof value.type === "string") {
      visit(value, callback);
    }
  }
}

function trimBoundaries(text, offset = 0) {
  let start = 0;
  let end = text.length;
  const boundaryStart = /^(?:(?:\\[nrt])|\s)+/;
  const boundaryEnd = /(?:(?:\\[nrt])|\s)+$/;
  const leading = text.match(boundaryStart)?.[0] ?? "";
  const trailing = text.match(boundaryEnd)?.[0] ?? "";
  start += leading.length;
  end -= trailing.length;
  if (start >= end) return null;
  const key = text.slice(start, end);
  if (!HAN_RE.test(key)) return null;
  return { start: offset + start, end: offset + end, key };
}

function segmentsForText(text) {
  if (!HAN_RE.test(text)) return [];

  if (text.includes("<") && text.includes(">")) {
    const segments = [];
    const re = /(?:^|>)([^<>]+)(?=<|$)/g;
    for (const match of text.matchAll(re)) {
      const chunk = match[1];
      const chunkStart = match.index + match[0].length - chunk.length;
      const segment = trimBoundaries(chunk, chunkStart);
      if (segment) segments.push(segment);
    }
    return segments;
  }

  const segment = trimBoundaries(text);
  return segment ? [segment] : [];
}

function metadataEntries(source) {
  const entries = [];
  for (const match of source.matchAll(METADATA_RE)) {
    entries.push({
      name: match[1],
      value: match[2],
      start: match.index,
    });
  }
  return entries;
}

function collectUnits(source) {
  const ast = parseSource(source);
  const units = [];

  for (const entry of metadataEntries(source)) {
    if (entry.name === "description" && HAN_RE.test(entry.value)) {
      units.push({
        kind: "metadata",
        key: entry.value.trim(),
        pos: entry.start,
      });
    }
  }

  visit(ast, (node) => {
    if (node.type === "Literal" && typeof node.value === "string" && HAN_RE.test(node.value)) {
      const segments = segmentsForText(node.value);
      for (const [index, segment] of segments.entries()) {
        units.push({
          kind: "literal",
          key: segment.key,
          pos: node.start + index / 1000,
          node,
          segment,
        });
      }
      return;
    }

    if (node.type === "TemplateElement") {
      const raw = source.slice(node.start, node.end);
      if (!HAN_RE.test(raw)) return;
      const segments = segmentsForText(raw);
      for (const segment of segments) {
        units.push({
          kind: "template",
          key: segment.key,
          pos: node.start + segment.start,
          node,
          segment,
        });
      }
    }
  });

  units.sort((a, b) => a.pos - b.pos);
  return units;
}

function replaceSegments(text, segments, translations) {
  const replacements = [];
  for (const segment of segments) {
    const translated = translations[segment.key];
    if (typeof translated !== "string" || translated.length === 0) continue;
    validatePlaceholders(segment.key, translated);
    replacements.push({
      start: segment.start,
      end: segment.end,
      text: translated,
    });
  }

  let result = text;
  for (const replacement of replacements.sort((a, b) => b.start - a.start)) {
    result =
      result.slice(0, replacement.start) +
      replacement.text +
      result.slice(replacement.end);
  }
  return result;
}

function replaceMetadata(source, name, value) {
  const re = new RegExp(`^// @${name}\\s+.*$`, "m");
  if (!re.test(source)) return source;
  return source.replace(re, `// @${name.padEnd(12)} ${value}`);
}

function placeholderTokens(value) {
  const patterns = [
    /%(?:\d+\$)?[sdif]/g,
    /\{\{[^{}]+\}\}/g,
    /\{[A-Za-z_][\w.]*\}/g,
    /https?:\/\/[^\s<>"']+/g,
  ];
  return patterns
    .flatMap((pattern) => value.match(pattern) ?? [])
    .sort();
}

export function validatePlaceholders(sourceText, translatedText) {
  const before = placeholderTokens(sourceText);
  const after = placeholderTokens(translatedText);
  if (before.length !== after.length || before.some((token, index) => token !== after[index])) {
    throw new Error(
      `Placeholder mismatch for "${sourceText}": ${JSON.stringify(before)} != ${JSON.stringify(after)}`,
    );
  }
}

export function extractSourceVersion(source) {
  const match = source.match(/^\/\/ @version\s+(.+)$/m);
  if (!match) throw new Error("Userscript @version metadata was not found");
  return match[1].trim();
}

export function extractTranslatableKeys(source) {
  const seen = new Set();
  const keys = [];
  for (const unit of collectUnits(source)) {
    if (seen.has(unit.key)) continue;
    seen.add(unit.key);
    keys.push(unit.key);
  }
  return keys;
}

export function mergeTranslationCatalog(keys, current = {}) {
  const merged = { ...current };
  for (const key of keys) {
    if (!Object.hasOwn(merged, key)) merged[key] = null;
  }
  return merged;
}

export function findMissingTranslations(keys, catalog) {
  return keys.filter((key) => {
    const value = catalog[key];
    return typeof value !== "string" || value.length === 0;
  });
}

export function nextLocalizationMeta(
  current,
  { upstreamVersion, upstreamSha },
) {
  if (!current) {
    return { upstreamVersion, upstreamSha, revision: 1 };
  }
  if (current.upstreamSha === upstreamSha) return { ...current };
  return {
    upstreamVersion,
    upstreamSha,
    revision:
      current.upstreamVersion === upstreamVersion
        ? current.revision + 1
        : 0,
  };
}

export function bumpLocalizationRevision(meta) {
  return { ...meta, revision: meta.revision + 1 };
}

export function applyTranslations(source, translations) {
  const ast = parseSource(source);
  const replacements = [];

  visit(ast, (node) => {
    if (node.type === "Literal" && typeof node.value === "string" && HAN_RE.test(node.value)) {
      const segments = segmentsForText(node.value);
      const translated = replaceSegments(node.value, segments, translations);
      if (translated !== node.value) {
        replacements.push({
          start: node.start,
          end: node.end,
          text: JSON.stringify(translated),
        });
      }
      return;
    }

    if (node.type === "TemplateElement") {
      const raw = source.slice(node.start, node.end);
      if (!HAN_RE.test(raw)) return;
      const translated = replaceSegments(raw, segmentsForText(raw), translations);
      if (translated !== raw) {
        replacements.push({
          start: node.start,
          end: node.end,
          text: translated,
        });
      }
    }
  });

  let result = source;
  for (const replacement of replacements.sort((a, b) => b.start - a.start)) {
    result =
      result.slice(0, replacement.start) +
      replacement.text +
      result.slice(replacement.end);
  }
  return result;
}

export function buildLocalizedSource(
  source,
  translations,
  { repository, revision },
) {
  if (!repository) throw new Error("repository is required");
  if (!Number.isInteger(revision) || revision < 0) {
    throw new Error("revision must be a non-negative integer");
  }

  const upstreamVersion = extractSourceVersion(source);
  const description =
    metadataEntries(source).find((entry) => entry.name === "description")?.value.trim() ?? "";
  const translatedDescription =
    typeof translations[description] === "string" && translations[description].length > 0
      ? translations[description]
      : description;

  let result = applyTranslations(source, translations);
  const rawUrl = `https://github.com/${repository}/raw/refs/heads/main/dist/chatgpt-checker-next.ko.user.js`;
  const owner = repository.split("/")[0];

  result = replaceMetadata(result, "name", "ChatGPT Checker Next (한국어)");
  result = replaceMetadata(result, "namespace", `https://github.com/${repository}`);
  result = replaceMetadata(result, "homepage", `https://github.com/${repository}`);
  result = replaceMetadata(result, "author", `zetaloop, ${owner} (한국어 현지화)`);
  result = replaceMetadata(result, "version", `${upstreamVersion}.${revision}`);
  result = replaceMetadata(result, "description", translatedDescription);
  result = replaceMetadata(result, "downloadURL", rawUrl);
  result = replaceMetadata(result, "updateURL", rawUrl);

  return result;
}
