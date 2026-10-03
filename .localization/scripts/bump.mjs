import fs from "node:fs/promises";
import path from "node:path";
import { bumpLocalizationRevision } from "./lib.mjs";

const root = path.resolve(import.meta.dirname, "../..");
const metaPath = path.join(root, "locales", "meta.json");
const meta = JSON.parse(await fs.readFile(metaPath, "utf8"));
const next = bumpLocalizationRevision(meta);
await fs.writeFile(metaPath, `${JSON.stringify(next, null, 2)}\n`);
console.log(`Localization revision: ${meta.revision} -> ${next.revision}`);
