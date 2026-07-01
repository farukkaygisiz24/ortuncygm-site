"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { MevzuatGuncellemeOzet, MevzuatGuncellemeleriIndex } from "@/lib/mevzuatGuncellemeleri";
import {
  MEVZUAT_GUNCELLEMELERI_INDEX_PUBLIC,
  decodeHtmlEntities,
  formatMevzuatGuncellemeNo,
  mevzuatGuncellemeDetayUrl,
} from "@/lib/mevzuatGuncellemeleri";

const PAGE_SIZE = 50;
const PAGINATION_SIBLING_COUNT = 1;

type PaginationItem = number | "ellipsis";

function normalize(text: string): string {
  return text
    .toLocaleLowerCase("tr")
    .normalize("NFD")
    .replace(/\p{M}/gu, "");
}

function getPaginationItems(current: number, total: number): PaginationItem[] {
  if (total <= 1) return [1];

  const maxVisible = PAGINATION_SIBLING_COUNT * 2 + 5;
  if (total <= maxVisible) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const rangeStart = Math.max(2, current - PAGINATION_SIBLING_COUNT);
  const rangeEnd = Math.min(total - 1, current + PAGINATION_SIBLING_COUNT);
  const items: PaginationItem[] = [1];

  if (rangeStart > 2) items.push("ellipsis");

  for (let page = rangeStart; page <= rangeEnd; page += 1) {
    items.push(page);
  }

  if (rangeEnd < total - 1) items.push("ellipsis");

  items.push(total);
  return items;
}

export default function MevzuatGuncellemeleriList() {
  const [index, setIndex] = useState<MevzuatGuncellemeleriIndex | null>(null);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(MEVZUAT_GUNCELLEMELERI_INDEX_PUBLIC)
      .then((res) => {
        if (!res.ok) throw new Error("Index yüklenemedi");
        return res.json() as Promise<MevzuatGuncellemeleriIndex>;
      })
      .then(setIndex)
      .catch((err: Error) => setError(err.message));
  }, []);

  const filtered = useMemo(() => {
    if (!index) return [];
    const q = normalize(query.trim());
    if (!q) return index.items;

    return index.items.filter((item) => {
      const sirküNo = formatMevzuatGuncellemeNo(item.reference, item.slug);
      const title = decodeHtmlEntities(item.title);
      const haystack = normalize(`${item.reference} ${sirküNo} ${title} ${item.gazette} ${item.date}`);
      return haystack.includes(q);
    });
  }, [index, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const paginationItems = useMemo(
    () => getPaginationItems(currentPage, totalPages),
    [currentPage, totalPages],
  );

  const goPage = useCallback(
    (next: number) => {
      setPage(Math.min(Math.max(1, next), totalPages));
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [totalPages],
  );

  if (error) {
    return (
      <div className="rounded-2xl border border-brand-line bg-white p-8 text-center text-brand-muted">
        {error}. Veri henüz senkronize edilmemiş olabilir.
      </div>
    );
  }

  if (!index) {
    return <div className="py-16 text-center text-brand-muted">Mevzuat güncellemeleri yükleniyor…</div>;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[14px] text-brand-muted">
            Toplam <strong className="text-brand-ink">{index.total.toLocaleString("tr-TR")}</strong> kayıt
            {query ? (
              <>
                {" "}
                · <strong className="text-brand-ink">{filtered.length.toLocaleString("tr-TR")}</strong> sonuç
              </>
            ) : null}
          </p>
          <p className="mt-1 text-[13px] text-brand-muted">
            Son senkron: {new Date(index.fetchedAt).toLocaleString("tr-TR")}
          </p>
        </div>
        <label className="w-full sm:max-w-md">
          <span className="mb-2 block text-[13px] font-bold uppercase tracking-[.08em] text-brand-blue">Ara</span>
          <input
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Referans, konu veya tarih"
            className="w-full rounded-[10px] border border-brand-line bg-white px-4 py-3 text-[15px] outline-none ring-brand-blue/20 focus:border-brand-blue focus:ring-2"
          />
        </label>
      </div>

      <div className="overflow-hidden rounded-2xl border border-brand-line bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-[14px]">
            <thead className="bg-brand-mist text-[12px] font-bold uppercase tracking-[.08em] text-brand-muted">
              <tr>
                <th className="px-4 py-3">Sirkü No</th>
                <th className="px-4 py-3">Tarih</th>
                <th className="px-4 py-3">Konu</th>
                <th className="hidden px-4 py-3 lg:table-cell">Resmî Gazete</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.map((item) => (
                <MevzuatRow key={item.slug} item={item} />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-[14px] text-brand-muted">
          Sayfa {currentPage} / {totalPages}
        </p>
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => goPage(currentPage - 1)}
            className="rounded-[10px] border border-brand-line bg-white px-4 py-2 text-[14px] font-bold text-brand-ink disabled:opacity-40"
          >
            Önceki
          </button>

          {paginationItems.map((item, index) =>
            item === "ellipsis" ? (
              <span
                key={`ellipsis-${index}`}
                className="px-1 text-[14px] font-bold text-brand-muted select-none"
                aria-hidden
              >
                …
              </span>
            ) : (
              <button
                key={item}
                type="button"
                onClick={() => goPage(item)}
                aria-label={`Sayfa ${item}`}
                aria-current={item === currentPage ? "page" : undefined}
                className={`min-w-[2.5rem] rounded-[10px] border px-3 py-2 text-[14px] font-bold transition-colors ${
                  item === currentPage
                    ? "border-brand-blue bg-brand-blue text-white"
                    : "border-brand-line bg-white text-brand-ink hover:border-brand-blue/40 hover:text-brand-blue"
                }`}
              >
                {item}
              </button>
            ),
          )}

          <button
            type="button"
            disabled={currentPage >= totalPages}
            onClick={() => goPage(currentPage + 1)}
            className="rounded-[10px] border border-brand-line bg-white px-4 py-2 text-[14px] font-bold text-brand-ink disabled:opacity-40"
          >
            Sonraki
          </button>
        </div>
      </div>
    </div>
  );
}

function MevzuatRow({ item }: { item: MevzuatGuncellemeOzet }) {
  return (
    <tr className="border-t border-brand-line transition hover:bg-brand-mist/60">
      <td className="px-4 py-3 font-bold whitespace-nowrap text-brand-blue">
        <Link href={mevzuatGuncellemeDetayUrl(item.slug)} className="hover:underline">
          {formatMevzuatGuncellemeNo(item.reference, item.slug)}
        </Link>
      </td>
      <td className="px-4 py-3 whitespace-nowrap text-brand-muted">{item.date}</td>
      <td className="px-4 py-3 text-brand-ink">
        <Link href={mevzuatGuncellemeDetayUrl(item.slug)} className="hover:text-brand-blue">
          {decodeHtmlEntities(item.title)}
        </Link>
      </td>
      <td className="hidden px-4 py-3 text-brand-muted lg:table-cell">{item.gazette}</td>
    </tr>
  );
}
