import fs from "node:fs/promises";
import path from "node:path";
import { parse } from "acorn";
import {
  buildLocalizedSource,
  extractSourceVersion,
  extractTranslatableKeys,
  findMissingTranslations,
  validatePlaceholders,
} from "./lib.mjs";

const root = path.resolve(import.meta.dirname, "../..");
const [source, catalogText, metaText] = await Promise.all([
  fs.readFile(path.join(root, "chatgpt-checker-next.user.js"), "utf8"),
  fs.readFile(path.join(root, "locales", "ko-KR.json"), "utf8"),
  fs.readFile(path.join(root, "locales", "meta.json"), "utf8"),
]);
const catalog = JSON.parse(catalogText);
const meta = JSON.parse(metaText);
const keys = extractTranslatableKeys(source);
const missing = findMissingTranslations(keys, catalog);

if (missing.length > 0) {
  console.error(`Missing ${missing.length} Korean translations:`);
  for (const key of missing) console.error(`- ${key}`);
  process.exit(1);
}

for (const key of keys) validatePlaceholders(key, catalog[key]);

const upstreamVersion = extractSourceVersion(source);
if (meta.upstreamVersion !== upstreamVersion) {
  throw new Error(
    `Localization metadata version ${meta.upstreamVersion} does not match upstream ${upstreamVersion}. Run sync first.`,
  );
}

const built = buildLocalizedSource(source, catalog, {
  repository: "hypn4/chatgpt-checker-next",
  revision: meta.revision,
});
parse(built, {
  ecmaVersion: "latest",
  sourceType: "script",
  allowHashBang: true,
});

console.log(`Localization check passed: ${keys.length} active translations.`);
