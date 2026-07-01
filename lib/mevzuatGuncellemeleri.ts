export type MevzuatGuncellemeOzet = {
  slug: string;
  reference: string;
  gazette: string;
  title: string;
  date: string;
};

export type MevzuatGuncellemeDetay = MevzuatGuncellemeOzet & {
  bodyHtml: string;
};

export type MevzuatGuncellemeleriIndex = {
  fetchedAt: string;
  total: number;
  pageCount: number;
  items: MevzuatGuncellemeOzet[];
};

export const MEVZUAT_GUNCELLEMELERI_LIST_PATH = "/mevzuat-guncellemeleri";
export const MEVZUAT_GUNCELLEMELERI_INDEX_PUBLIC = "/data/mevzuat-guncellemeleri/index.json";
export const MEVZUAT_GUNCELLEMELERI_DETAIL_PUBLIC = "/data/mevzuat-guncellemeleri/details";

/** `sirkuler-26-0372` → `26-0372` */
export function mevzuatGuncellemeUrlSlug(slug: string): string {
  return slug.replace(/^(?:sirkuler|mevzuat)-/i, "");
}

export function resolveMevzuatGuncellemeDataSlug(
  urlSlug: string,
  items: readonly { slug: string }[],
): string | null {
  const direct = items.find((item) => item.slug === urlSlug);
  if (direct) return direct.slug;

  const matched = items.find((item) => mevzuatGuncellemeUrlSlug(item.slug) === urlSlug);
  return matched?.slug ?? null;
}

export function mevzuatGuncellemeDetayUrl(dataSlug: string): string {
  return `${MEVZUAT_GUNCELLEMELERI_LIST_PATH}/${encodeURIComponent(mevzuatGuncellemeUrlSlug(dataSlug))}`;
}

/** UGM `Sirkuler_26_0363` veya slug `sirkuler-26-0363` → `2026-0363` sirkü numarası. */
export function formatMevzuatGuncellemeNo(reference: string, slug?: string): string {
  const fromRef = reference.match(/^(?:Sirkuler|Sirküler|MevzuatGuncellemesi?)_(\d{2})_(\d+)$/i);
  if (fromRef) {
    return `${2000 + Number(fromRef[1])}-${fromRef[2].padStart(4, "0")}`;
  }

  const fromSlug = slug?.match(/(?:sirkuler|mevzuat)-(\d{2})-(\d+)/i);
  if (fromSlug) {
    return `${2000 + Number(fromSlug[1])}-${fromSlug[2].padStart(4, "0")}`;
  }

  return reference;
}

/** HTML entity'lerini düz metne çevirir (`&#039;`, `&amp;` vb.). */
export function decodeHtmlEntities(text: string): string {
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

function decodeHtml(text: string): string {
  return decodeHtmlEntities(text);
}

/** UGM gümrük sirküleri liste sayfası tablosunu parse eder. */
export function parseMevzuatListPage(html: string): MevzuatGuncellemeOzet[] {
  const rowPattern =
    /<tr[^>]*class="tableitem"[^>]*data-href="([^"]+)"[\s\S]*?<th[^>]*class="col1">([\s\S]*?)<\/th>[\s\S]*?<td[^>]*class="col2">([\s\S]*?)<\/td>[\s\S]*?<td[^>]*class="col3">([\s\S]*?)<\/td>[\s\S]*?<td[^>]*class="col4">([\s\S]*?)<\/td>/gi;

  const items: MevzuatGuncellemeOzet[] = [];
  let match: RegExpExecArray | null;

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

export function parseMevzuatListPageCount(html: string): number {
  const match = html.match(/gumruk-sirkulerleri\?page=(\d+)">\s*\d+\s*<\/a>/gi);
  if (!match?.length) return 1;

  const pages = match
    .map((item) => Number(item.match(/page=(\d+)/)?.[1] ?? "0"))
    .filter((page) => page > 0);

  return pages.length ? Math.max(...pages) : 1;
}

/** UGM sirküler detay sayfasındaki gövde HTML'ini parse eder. */
export function parseMevzuatDetailPage(html: string): { title: string; bodyHtml: string } | null {
  const titleMatch = html.match(/Kısa Konu[\s\S]*?<b[^>]*>([\s\S]*?)<\/b>/i);
  const bodyMatch = html.match(/<div class="p-4" style="min-height: 340px">([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>/i);

  if (!bodyMatch) return null;

  return {
    title: titleMatch ? decodeHtml(titleMatch[1].replace(/<[^>]+>/g, "")) : "",
    bodyHtml: bodyMatch[1].trim(),
  };
}
