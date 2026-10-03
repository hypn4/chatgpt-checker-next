import { execFileSync } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import {
  extractSourceVersion,
  extractTranslatableKeys,
  mergeTranslationCatalog,
  nextLocalizationMeta,
} from "./lib.mjs";

const root = path.resolve(import.meta.dirname, "../..");
const sourcePath = path.join(root, "chatgpt-checker-next.user.js");
const localeDir = path.join(root, "locales");
const catalogPath = path.join(localeDir, "ko-KR.json");
const metaPath = path.join(localeDir, "meta.json");

const source = await fs.readFile(sourcePath, "utf8");
const keys = extractTranslatableKeys(source);
const upstreamVersion = extractSourceVersion(source);

let catalog = {};
try {
  catalog = JSON.parse(await fs.readFile(catalogPath, "utf8"));
} catch (error) {
  if (error.code !== "ENOENT") throw error;
}

let currentMeta = null;
try {
  currentMeta = JSON.parse(await fs.readFile(metaPath, "utf8"));
} catch (error) {
  if (error.code !== "ENOENT") throw error;
}

let upstreamSha = process.env.UPSTREAM_SHA?.trim();
if (!upstreamSha) {
  upstreamSha = execFileSync("git", ["rev-parse", "upstream/main"], {
    cwd: root,
    encoding: "utf8",
  }).trim();
}

const nextCatalog = mergeTranslationCatalog(keys, catalog);
const nextMeta = nextLocalizationMeta(currentMeta, {
  upstreamVersion,
  upstreamSha,
});

await fs.mkdir(localeDir, { recursive: true });
await fs.writeFile(catalogPath, `${JSON.stringify(nextCatalog, null, 2)}\n`);
await fs.writeFile(metaPath, `${JSON.stringify(nextMeta, null, 2)}\n`);

const missing = keys.filter((key) => {
  const value = nextCatalog[key];
  return typeof value !== "string" || value.length === 0;
});

console.log(`Upstream: ${upstreamVersion} @ ${upstreamSha.slice(0, 12)}`);
console.log(`Active translation keys: ${keys.length}`);
console.log(`Missing translations: ${missing.length}`);
