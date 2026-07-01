#!/usr/bin/env node
/**
 * Eksik mevzuat detaylarını tur tur indirir; her tur sonunda durum raporu verir.
 * Başarısız kayıtlar dosyaya yazılmadığı için sonraki turda otomatik yeniden denenir.
 *
 *   node scripts/sync-mevzuat-until-complete.mjs
 *   WORKERS=4 CONCURRENCY=8 DELAY=100 MAX_ROUNDS=50 node scripts/sync-mevzuat-until-complete.mjs
 */

import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const INDEX_PATH = path.join(ROOT, "public/data/mevzuat-guncellemeleri/index.json");
const DETAILS_DIR = path.join(ROOT, "public/data/mevzuat-guncellemeleri/details");
const LOG_PATH = path.join(ROOT, ".cache/mevzuat-full-sync.log");

const workers = Number(process.env.WORKERS ?? 4);
const concurrency = Number(process.env.CONCURRENCY ?? 8);
const delay = Number(process.env.DELAY ?? 100);
const maxRounds = Number(process.env.MAX_ROUNDS ?? 100);
const pauseBetweenRoundsMs = Number(process.env.PAUSE_MS ?? 90_000);

function log(message) {
  const line = `[${new Date().toISOString()}] ${message}`;
  console.log(line);
  fs.mkdirSync(path.dirname(LOG_PATH), { recursive: true });
  fs.appendFileSync(LOG_PATH, `${line}\n`, "utf8");
}

function countStatus() {
  const index = JSON.parse(fs.readFileSync(INDEX_PATH, "utf8"));
  const total = index.items.length;
  let existing = 0;
  for (const item of index.items) {
    if (fs.existsSync(path.join(DETAILS_DIR, `${item.slug}.json`))) existing += 1;
  }
  return { total, existing, missing: total - existing };
}

function runParallelRound(round) {
  return new Promise((resolve, reject) => {
    log(`Tur ${round} başlıyor (${workers} işçi × ${concurrency} eşzamanlı, gecikme ${delay}ms)`);

    const child = spawn(
      process.execPath,
      [path.join(__dirname, "sync-mevzuat-parallel.mjs")],
      {
        cwd: ROOT,
        env: { ...process.env, WORKERS: String(workers), CONCURRENCY: String(concurrency), DELAY: String(delay) },
        stdio: ["ignore", "pipe", "pipe"],
      },
    );

    let lastProgress = "";
    const onData = (chunk) => {
      const text = chunk.toString();
      process.stdout.write(text);
      for (const line of text.split("\n")) {
        if (line.includes("detay ") && line.includes("/")) lastProgress = line.trim();
        if (line.includes("Detay senkronu tamamlandı")) lastProgress = line.trim();
      }
    };

    child.stdout.on("data", onData);
    child.stderr.on("data", onData);

    child.on("error", reject);
    child.on("exit", (code) => {
      if (code !== 0) {
        log(`Tur ${round} uyarı: çıkış kodu ${code}${lastProgress ? ` — son: ${lastProgress}` : ""}`);
      }
      resolve(code ?? 0);
    });
  });
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  if (!fs.existsSync(INDEX_PATH)) {
    console.error("index.json yok. Önce: npm run sync:mevzuat:list");
    process.exit(1);
  }

  const start = countStatus();
  log(`Tam senkron başladı — mevcut: ${start.existing}/${start.total}, eksik: ${start.missing}`);

  if (start.missing === 0) {
    log("Tüm detaylar zaten mevcut.");
    return;
  }

  for (let round = 1; round <= maxRounds; round += 1) {
    const before = countStatus();
    if (before.missing === 0) {
      log(`Tamamlandı: ${before.existing}/${before.total} detay dosyası.`);
      return;
    }

    await runParallelRound(round);

    const after = countStatus();
    const downloaded = after.existing - before.existing;
    const pct = ((after.existing / after.total) * 100).toFixed(1);
    log(
      `Tur ${round} bitti — +${downloaded} kayıt | ${after.existing}/${after.total} (%${pct}) | kalan: ${after.missing}`,
    );

    if (after.missing === 0) {
      log("Tüm detaylar indirildi.");
      return;
    }

    if (downloaded === 0) {
      log(`İlerleme yok; ${pauseBetweenRoundsMs / 1000}s bekleniyor (UGM rate-limit olabilir)…`);
    } else {
      log(`${pauseBetweenRoundsMs / 1000}s mola…`);
    }

    await sleep(pauseBetweenRoundsMs);
  }

  const final = countStatus();
  log(`MAX_ROUNDS (${maxRounds}) doldu — ${final.existing}/${final.total}, kalan: ${final.missing}`);
  process.exit(final.missing > 0 ? 1 : 0);
}

main().catch((err) => {
  log(`Hata: ${err.message}`);
  process.exit(1);
});
