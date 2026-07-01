import fs from "node:fs";
import path from "node:path";
import type { MevzuatGuncellemeDetay, MevzuatGuncellemeleriIndex } from "@/lib/mevzuatGuncellemeleri";

const LIST_BASE = "https://ugm.com.tr/gumruk-sirkulerleri";
const FETCH_HEADERS = { "User-Agent": "ORTUNC-Site/1.0", Accept: "text/html" };

export const MEVZUAT_DATA_DIR = path.join(process.cwd(), "public/data/mevzuat-guncellemeleri");
export const MEVZUAT_INDEX_PATH = path.join(MEVZUAT_DATA_DIR, "index.json");
export const MEVZUAT_DETAILS_DIR = path.join(MEVZUAT_DATA_DIR, "details");

function decodeHtml(text: string): string {
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

export function parseUgmDetailPage(html: string) {
  const titleMatch = html.match(/Kısa Konu[\s\S]*?<b[^>]*>([\s\S]*?)<\/b>/i);
  const bodyMatch = html.match(/<div class="p-4" style="min-height: 340px">([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>/i);
  if (!bodyMatch) return null;

  return {
    title: titleMatch ? decodeHtml(titleMatch[1].replace(/<[^>]+>/g, "")) : "",
    bodyHtml: bodyMatch[1].trim(),
  };
}

export async function fetchUgmDetailHtml(slug: string): Promise<string> {
  const response = await fetch(`${LIST_BASE}/${slug}`, {
    headers: FETCH_HEADERS,
    signal: AbortSignal.timeout(45_000),
    next: { revalidate: 0 },
  });

  if (!response.ok) {
    throw new Error(`UGM ${response.status}: ${slug}`);
  }

  return response.text();
}

export function readMevzuatIndex(): MevzuatGuncellemeleriIndex | null {
  if (!fs.existsSync(MEVZUAT_INDEX_PATH)) return null;
  return JSON.parse(fs.readFileSync(MEVZUAT_INDEX_PATH, "utf8")) as MevzuatGuncellemeleriIndex;
}

export function readCachedMevzuatDetail(slug: string): MevzuatGuncellemeDetay | null {
  const file = path.join(MEVZUAT_DETAILS_DIR, `${slug}.json`);
  if (!fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file, "utf8")) as MevzuatGuncellemeDetay;
}

export function writeCachedMevzuatDetail(detail: MevzuatGuncellemeDetay) {
  fs.mkdirSync(MEVZUAT_DETAILS_DIR, { recursive: true });
  const file = path.join(MEVZUAT_DETAILS_DIR, `${detail.slug}.json`);
  fs.writeFileSync(file, `${JSON.stringify(detail)}\n`, "utf8");
}

export async function getOrFetchMevzuatDetail(slug: string): Promise<MevzuatGuncellemeDetay | null> {
  const cached = readCachedMevzuatDetail(slug);
  if (cached?.bodyHtml) return cached;

  const index = readMevzuatIndex();
  const summary = index?.items.find((item) => item.slug === slug);
  if (!summary) return null;

  const html = await fetchUgmDetailHtml(slug);
  const parsed = parseUgmDetailPage(html);

  const detail: MevzuatGuncellemeDetay = {
    ...summary,
    title: parsed?.title || summary.title,
    bodyHtml: parsed?.bodyHtml ?? "",
  };

  if (canPersistCache()) {
    writeCachedMevzuatDetail(detail);
  }

  return detail;
}

function canPersistCache(): boolean {
  return !process.env.VERCEL;
}
