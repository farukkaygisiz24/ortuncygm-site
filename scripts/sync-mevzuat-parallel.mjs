#!/usr/bin/env node
/**
 * Detay senkronunu birden fazla işçiyle paralel çalıştırır.
 *
 *   node scripts/sync-mevzuat-parallel.mjs
 *   WORKERS=6 CONCURRENCY=24 DELAY=30 node scripts/sync-mevzuat-parallel.mjs
 */

import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const SCRIPT = path.join(__dirname, "sync-mevzuat-guncellemeleri.mjs");

const workers = Number(process.env.WORKERS ?? 4);
const concurrency = Number(process.env.CONCURRENCY ?? 20);
const delay = Number(process.env.DELAY ?? 40);

if (!Number.isInteger(workers) || workers < 1 || workers > 16) {
  console.error("WORKERS 1–16 arasında olmalı.");
  process.exit(1);
}

console.log(
  `Paralel detay senkronu: ${workers} işçi × ${concurrency} eşzamanlı istek, gecikme ${delay}ms`,
);

const children = [];

for (let shard = 0; shard < workers; shard += 1) {
  const child = spawn(
    process.execPath,
    [
      SCRIPT,
      "--details-only",
      `--concurrency=${concurrency}`,
      `--delay=${delay}`,
      `--shard=${shard}/${workers}`,
    ],
    { cwd: ROOT },
  );

  const prefix = `[işçi ${shard + 1}/${workers}] `;
  child.stdout.on("data", (chunk) => {
    for (const line of chunk.toString().split("\n")) {
      if (line.trim()) process.stdout.write(`${prefix}${line}\n`);
    }
  });
  child.stderr.on("data", (chunk) => {
    for (const line of chunk.toString().split("\n")) {
      if (line.trim()) process.stderr.write(`${prefix}${line}\n`);
    }
  });

  child.on("exit", (code) => {
    if (code !== 0) {
      console.error(`${prefix}çıkış kodu ${code}`);
    }
  });

  children.push(child);
}

let exited = 0;
for (const child of children) {
  child.on("exit", () => {
    exited += 1;
    if (exited === children.length) {
      console.log("Tüm işçiler tamamlandı.");
    }
  });
}

process.on("SIGINT", () => {
  console.log("\nDurduruluyor…");
  for (const child of children) child.kill("SIGINT");
});
