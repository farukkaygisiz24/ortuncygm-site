#!/usr/bin/env node
/** Hızlı durum: node scripts/mevzuat-sync-status.mjs */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const INDEX_PATH = path.join(ROOT, "public/data/mevzuat-guncellemeleri/index.json");
const DETAILS_DIR = path.join(ROOT, "public/data/mevzuat-guncellemeleri/details");
const LOG_PATH = path.join(ROOT, ".cache/mevzuat-full-sync.log");

const index = JSON.parse(fs.readFileSync(INDEX_PATH, "utf8"));
const total = index.items.length;
let existing = 0;
const missing = [];

for (const item of index.items) {
  if (fs.existsSync(path.join(DETAILS_DIR, `${item.slug}.json`))) {
    existing += 1;
  } else if (missing.length < 8) {
    missing.push(item.slug);
  }
}

const pct = ((existing / total) * 100).toFixed(1);
console.log(`Detay: ${existing}/${total} (%${pct}) — eksik: ${total - existing}`);
if (missing.length) console.log(`Örnek eksik: ${missing.join(", ")}${total - existing > 8 ? " …" : ""}`);

if (fs.existsSync(LOG_PATH)) {
  const lines = fs.readFileSync(LOG_PATH, "utf8").trim().split("\n");
  console.log(`Son log: ${lines.at(-1)}`);
}
