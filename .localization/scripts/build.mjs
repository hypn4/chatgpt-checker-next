import fs from "node:fs/promises";
import path from "node:path";
import { parse } from "acorn";
import { buildLocalizedSource } from "./lib.mjs";

const root = path.resolve(import.meta.dirname, "../..");
const sourcePath = path.join(root, "chatgpt-checker-next.user.js");
const catalogPath = path.join(root, "locales", "ko-KR.json");
const metaPath = path.join(root, "locales", "meta.json");
const distPath = path.join(root, "dist", "chatgpt-checker-next.ko.user.js");

const [source, catalogText, metaText] = await Promise.all([
  fs.readFile(sourcePath, "utf8"),
  fs.readFile(catalogPath, "utf8"),
  fs.readFile(metaPath, "utf8"),
]);
const catalog = JSON.parse(catalogText);
const meta = JSON.parse(metaText);
const built = buildLocalizedSource(source, catalog, {
  repository: "hypn4/chatgpt-checker-next",
  revision: meta.revision,
});

parse(built, {
  ecmaVersion: "latest",
  sourceType: "script",
  allowHashBang: true,
});

if (process.argv.includes("--check")) {
  let current = null;
  try {
    current = await fs.readFile(distPath, "utf8");
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
  if (current !== built) {
    throw new Error(
      "Generated Korean userscript is stale. Run: bun run --cwd .localization build",
    );
  }
  console.log("Generated Korean userscript is current.");
} else {
  await fs.mkdir(path.dirname(distPath), { recursive: true });
  await fs.writeFile(distPath, built);
  console.log(`Wrote ${path.relative(root, distPath)}`);
}
