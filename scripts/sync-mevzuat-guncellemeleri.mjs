#!/usr/bin/env node
/**
 * UGM gümrük sirkülerlerini ORTUNÇ sitesine senkronize eder.
 *
 * Kullanım:
 *   node scripts/sync-mevzuat-guncellemeleri.mjs           # liste + eksik detaylar
 *   node scripts/sync-mevzuat-guncellemeleri.mjs --list-only
 *   node scripts/sync-mevzuat-guncellemeleri.mjs --details-only
 *   node scripts/sync-mevzuat-guncellemeleri.mjs --limit-details 50
 *   node scripts/sync-mevzuat-guncellemeleri.mjs --details-only --fast
 *   node scripts/sync-mevzuat-guncellemeleri.mjs --details-only --concurrency=24 --delay=40 --shard=0/4
 *   node scripts/sync-mevzuat-parallel.mjs
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const INDEX_PATH = path.join(ROOT, "public/data/mevzuat-guncellemeleri/index.json");
const DETAILS_DIR = path.join(ROOT, "public/data/mevzuat-guncellemeleri/details");
const STATE_PATH = path.join(ROOT, ".cache/mevzuat-sync-state.json");
const HOMEPAGE_PATH = path.join(ROOT, "content/mevzuat-updates.json");

const LIST_BASE = "https://ugm.com.tr/gumruk-sirkulerleri";
const FETCH_HEADERS = { "User-Agent": "ORTUNC-Site/1.0", Accept: "text/html" };
const DEFAULT_DETAIL_CONCURRENCY = 6;
const DEFAULT_REQUEST_DELAY_MS = 120;
const DEFAULT_LIST_CONCURRENCY = 4;

const args = process.argv.slice(2);
const listOnly = args.includes("--list-only");
const detailsOnly = args.includes("--details-only");
const force = args.includes("--force");
const fast = args.includes("--fast");
const limitDetailsArg = args.find((a) => a.startsWith("--limit-details"));
const limitDetails = limitDetailsArg ? Number(limitDetailsArg.split("=")[1] ?? args[args.indexOf("--limit-details") + 1]) : 0;
const maxPagesArg = args.find((a) => a.startsWith("--max-pages"));
const maxPages = maxPagesArg ? Number(maxPagesArg.split("=")[1] ?? args[args.indexOf("--max-pages") + 1]) : 0;

function readArgValue(name) {
  const eq = args.find((a) => a.startsWith(`${name}=`));
  if (eq) return eq.split("=")[1];
  const idx = args.indexOf(name);
  if (idx >= 0 && args[idx + 1] && !args[idx + 1].startsWith("--")) return args[idx + 1];
  return undefined;
}

function parseShard(value) {
  const [index, total] = String(value).split("/").map(Number);
  if (!Number.isInteger(index) || !Number.isInteger(total) || total < 1 || index < 0 || index >= total) {
    throw new Error(`Geçersiz --shard değeri: ${value} (ör. 0/4)`);
  }
  return { index, total };
}

const shard = (() => {
  const value = readArgValue("--shard");
  return value ? parseShard(value) : null;
})();

const detailConcurrency = Number(readArgValue("--concurrency")) || (fast ? 24 : DEFAULT_DETAIL_CONCURRENCY);
const requestDelayMs = Number(readArgValue("--delay")) || (fast ? 40 : DEFAULT_REQUEST_DELAY_MS);
const listConcurrency = Number(readArgValue("--list-concurrency")) || (fast ? 16 : DEFAULT_LIST_CONCURRENCY);
const logPrefix = shard ? `[shard ${shard.index + 1}/${shard.total}] ` : "";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function decodeHtml(text) {
  return text
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, num) => String.fromCodePoint(Number(num)))
    .replace(/&nbsp;/g, "\u00a0")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function parseListPage(html) {
  const rowPattern =
    /<tr[^>]*class="tableitem"[^>]*data-href="([^"]+)"[\s\S]*?<th[^>]*class="col1">([\s\S]*?)<\/th>[\s\S]*?<td[^>]*class="col2">([\s\S]*?)<\/td>[\s\S]*?<td[^>]*class="col3">([\s\S]*?)<\/td>[\s\S]*?<td[^>]*class="col4">([\s\S]*?)<\/td>/gi;

  const items = [];
  let match;
  while ((match = rowPattern.exec(html)) !== null) {
    const href = match[1].startsWith("http") ? match[1] : `https://ugm.com.tr/${match[1].replace(/^\//, "")}`;
    const slug = href.split("/").pop() ?? "";
    if (!slug) continue;
    items.push({
      slug,
      reference: decodeHtml(match[2].replace(/<[^>]+>/g, "")),
      gazette: decodeHtml(match[3].replace(/<[^>]+>/g, "")),
      title: decodeHtml(match[4].replace(/<[^>]+>/g, "")),
      date: decodeHtml(match[5].replace(/<[^>]+>/g, "")),
    });
  }
  return items;
}

function parsePageCount(html) {
  const matches = [...html.matchAll(/gumruk-sirkulerleri\?page=(\d+)"/gi)];
  const pages = matches.map((m) => Number(m[1])).filter((n) => n > 0);
  return pages.length ? Math.max(...pages) : 1;
}

function parseDetailPage(html) {
  const titleMatch = html.match(/Kısa Konu[\s\S]*?<b[^>]*>([\s\S]*?)<\/b>/i);
  const bodyMatch = html.match(/<div class="p-4" style="min-height: 340px">([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>/i);
  if (!bodyMatch) return null;
  return {
    title: titleMatch ? decodeHtml(titleMatch[1].replace(/<[^>]+>/g, "")) : "",
    bodyHtml: bodyMatch[1].trim(),
  };
}

async function fetchHtml(url) {
  const response = await fetch(url, {
    headers: FETCH_HEADERS,
    signal: AbortSignal.timeout(30000),
  });
  if (!response.ok) throw new Error(`${response.status} ${url}`);
  return response.text();
}

async function syncList() {
  if (!force && fs.existsSync(INDEX_PATH)) {
    try {
      const existing = JSON.parse(fs.readFileSync(INDEX_PATH, "utf8"));
      const ageHours = (Date.now() - new Date(existing.fetchedAt).getTime()) / 3_600_000;
      if (existing.items?.length > 0 && ageHours < 24) {
        console.log(`Index güncel (${existing.items.length} kayıt, ${ageHours.toFixed(1)}s önce). Atlanıyor.`);
        writeHomepageFeed(existing.items);
        return existing;
      }
    } catch {
      // continue with fresh sync
    }
  }

  console.log(`${logPrefix}Liste sayfaları çekiliyor (${listConcurrency} paralel)…`);
  const firstHtml = await fetchHtml(LIST_BASE);
  const pageCount = maxPages > 0 ? Math.min(parsePageCount(firstHtml), maxPages) : parsePageCount(firstHtml);
  const allItems = [];
  const seen = new Set();

  for (let batchStart = 1; batchStart <= pageCount; batchStart += listConcurrency) {
    const pages = [];
    for (let page = batchStart; page < batchStart + listConcurrency && page <= pageCount; page += 1) {
      pages.push(page);
    }

    const htmlByPage = await Promise.all(
      pages.map(async (page) => {
        if (page === 1) return firstHtml;
        const url = `${LIST_BASE}?page=${page}`;
        return fetchHtml(url);
      }),
    );

    for (let i = 0; i < pages.length; i += 1) {
      const items = parseListPage(htmlByPage[i]);
      for (const item of items) {
        if (seen.has(item.slug)) continue;
        seen.add(item.slug);
        allItems.push(item);
      }
    }

    const lastPage = pages[pages.length - 1];
    if (lastPage % 10 === 0 || lastPage === pageCount) {
      console.log(`${logPrefix}  sayfa ${lastPage}/${pageCount} — toplam ${allItems.length} kayıt`);
    }

    if (batchStart + listConcurrency <= pageCount) {
      await sleep(requestDelayMs);
    }
  }

  const payload = {
    fetchedAt: new Date().toISOString(),
    total: allItems.length,
    pageCount,
    items: allItems,
  };

  fs.mkdirSync(path.dirname(INDEX_PATH), { recursive: true });
  fs.writeFileSync(INDEX_PATH, `${JSON.stringify(payload)}\n`, "utf8");
  console.log(`Index yazıldı: ${allItems.length} kayıt → ${INDEX_PATH}`);

  writeHomepageFeed(allItems);
  return payload;
}

const HOMEPAGE_DAYS = 15;

const TR_MONTHS = {
  ocak: 0,
  subat: 1,
  şubat: 1,
  mart: 2,
  nisan: 3,
  mayis: 4,
  mayıs: 4,
  haziran: 5,
  temmuz: 6,
  agustos: 7,
  ağustos: 7,
  eylul: 8,
  eylül: 8,
  ekim: 9,
  kasim: 10,
  kasım: 10,
  aralik: 11,
  aralık: 11,
};

function parseMevzuatDate(dateText) {
  const text = dateText.trim();
  const dotted = text.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
  if (dotted) {
    return new Date(Number(dotted[3]), Number(dotted[2]) - 1, Number(dotted[1]));
  }

  const words = text.split(/\s+/);
  if (words.length >= 3) {
    const day = Number(words[0]);
    const year = Number(words[words.length - 1]);
    const monthKey = words
      .slice(1, -1)
      .join(" ")
      .toLocaleLowerCase("tr")
      .normalize("NFD")
      .replace(/\p{M}/gu, "");
    const month = TR_MONTHS[monthKey];
    if (!Number.isNaN(day) && !Number.isNaN(year) && month !== undefined) {
      return new Date(year, month, day);
    }
  }

  const parsed = new Date(text);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function isWithinLastDays(dateText, days, now = new Date()) {
  const date = parseMevzuatDate(dateText);
  if (!date) return false;

  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - days);

  const end = new Date(now);
  end.setHours(23, 59, 59, 999);

  const value = new Date(date);
  value.setHours(12, 0, 0, 0);

  return value >= start && value <= end;
}

function writeHomepageFeed(items) {
  const recent = items.filter((item) => isWithinLastDays(item.date, HOMEPAGE_DAYS));
  const feed = {
    fetchedAt: new Date().toISOString(),
    days: HOMEPAGE_DAYS,
    items: recent.map((item) => ({
      id: item.slug,
      slug: item.slug,
      reference: item.reference,
      date: item.date,
      title: item.title,
    })),
  };
  fs.mkdirSync(path.dirname(HOMEPAGE_PATH), { recursive: true });
  fs.writeFileSync(HOMEPAGE_PATH, `${JSON.stringify(feed, null, 2)}\n`, "utf8");
}

async function syncDetails(index) {
  fs.mkdirSync(DETAILS_DIR, { recursive: true });

  const useSharedState = !shard;
  let completed = new Set();

  if (useSharedState && fs.existsSync(STATE_PATH)) {
    try {
      const state = JSON.parse(fs.readFileSync(STATE_PATH, "utf8"));
      completed = new Set(state.completed ?? []);
    } catch {
      // ignore
    }
  }

  let pending = index.items.filter((item, itemIndex) => {
    if (shard && itemIndex % shard.total !== shard.index) return false;
    const file = path.join(DETAILS_DIR, `${item.slug}.json`);
    return !completed.has(item.slug) && !fs.existsSync(file);
  });

  if (limitDetails > 0) pending = pending.slice(0, limitDetails);

  console.log(
    `${logPrefix}Detay senkronu: ${pending.length} kayıt (eşzamanlı: ${detailConcurrency}, gecikme: ${requestDelayMs}ms)`,
  );

  let done = 0;
  let cursor = 0;

  async function worker() {
    while (cursor < pending.length) {
      const i = cursor;
      cursor += 1;
      const item = pending[i];
      const outFile = path.join(DETAILS_DIR, `${item.slug}.json`);

      if (fs.existsSync(outFile)) continue;

      try {
        const html = await fetchHtml(`${LIST_BASE}/${item.slug}`);
        const detail = parseDetailPage(html);

        const payload = {
          ...item,
          title: detail?.title || item.title,
          bodyHtml: detail?.bodyHtml ?? "",
        };

        fs.writeFileSync(outFile, `${JSON.stringify(payload)}\n`, "utf8");
        if (useSharedState) completed.add(item.slug);
        done += 1;

        if (done % 50 === 0 || done === pending.length) {
          console.log(`${logPrefix}  detay ${done}/${pending.length}`);
          if (useSharedState) {
            fs.mkdirSync(path.dirname(STATE_PATH), { recursive: true });
            fs.writeFileSync(STATE_PATH, `${JSON.stringify({ completed: [...completed] })}\n`, "utf8");
          }
        }

        if (requestDelayMs > 0) await sleep(requestDelayMs);
      } catch (error) {
        console.warn(`${logPrefix}  detay hatası (${item.slug}):`, error.message);
        if (requestDelayMs > 0) await sleep(requestDelayMs * 2);
      }
    }
  }

  await Promise.all(Array.from({ length: detailConcurrency }, () => worker()));

  if (useSharedState) {
    fs.mkdirSync(path.dirname(STATE_PATH), { recursive: true });
    fs.writeFileSync(STATE_PATH, `${JSON.stringify({ completed: [...completed] })}\n`, "utf8");
  }

  console.log(`${logPrefix}Detay senkronu tamamlandı: ${done} yeni kayıt`);
}

async function main() {
  let index = null;

  if (!detailsOnly) {
    index = await syncList();
  } else if (fs.existsSync(INDEX_PATH)) {
    index = JSON.parse(fs.readFileSync(INDEX_PATH, "utf8"));
  } else {
    console.error("Index bulunamadı. Önce --list-only olmadan veya liste senkronu çalıştırın.");
    process.exit(1);
  }

  if (!listOnly && index) {
    await syncDetails(index);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
