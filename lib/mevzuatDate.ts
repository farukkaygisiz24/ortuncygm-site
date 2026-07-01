const TR_MONTHS: Record<string, number> = {
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

export const HOMEPAGE_MEVZUAT_DAYS = 15;

export function parseMevzuatDate(dateText: string): Date | null {
  const text = dateText.trim();
  if (!text) return null;

  const dotted = text.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
  if (dotted) {
    const [, day, month, year] = dotted;
    return new Date(Number(year), Number(month) - 1, Number(day));
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

export function isWithinLastDays(dateText: string, days: number, now = new Date()): boolean {
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

export function filterRecentMevzuatUpdates<T extends { date: string }>(
  items: T[],
  days = HOMEPAGE_MEVZUAT_DAYS,
  now = new Date(),
): T[] {
  return items.filter((item) => isWithinLastDays(item.date, days, now));
}
