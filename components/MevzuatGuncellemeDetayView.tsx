"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { MevzuatGuncellemeDetay } from "@/lib/mevzuatGuncellemeleri";
import {
  MEVZUAT_GUNCELLEMELERI_DETAIL_PUBLIC,
  MEVZUAT_GUNCELLEMELERI_LIST_PATH,
  decodeHtmlEntities,
  formatMevzuatGuncellemeNo,
} from "@/lib/mevzuatGuncellemeleri";

export default function MevzuatGuncellemeDetayView({ slug }: { slug: string }) {
  const [detail, setDetail] = useState<MevzuatGuncellemeDetay | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const staticUrl = `${MEVZUAT_GUNCELLEMELERI_DETAIL_PUBLIC}/${encodeURIComponent(slug)}.json`;
    const apiUrl = `/api/mevzuat-guncellemeleri/${encodeURIComponent(slug)}`;

    async function loadDetail() {
      const staticRes = await fetch(staticUrl);
      if (staticRes.ok) {
        return staticRes.json() as Promise<MevzuatGuncellemeDetay>;
      }

      const apiRes = await fetch(apiUrl);
      if (apiRes.ok) {
        return apiRes.json() as Promise<MevzuatGuncellemeDetay>;
      }

      const phpRes = await fetch(`/mevzuat-detail.php?slug=${encodeURIComponent(slug)}`);
      if (!phpRes.ok) {
        throw new Error("Detay bulunamadı");
      }

      return phpRes.json() as Promise<MevzuatGuncellemeDetay>;
    }

    loadDetail().then(setDetail).catch((err: Error) => setError(err.message));
  }, [slug]);

  if (error) {
    return (
      <div className="rounded-2xl border border-brand-line bg-white p-8 text-center text-brand-muted">
        {error}.{" "}
        <Link href={MEVZUAT_GUNCELLEMELERI_LIST_PATH} className="font-bold text-brand-blue hover:underline">
          Listeye dön
        </Link>
      </div>
    );
  }

  if (!detail) {
    return <div className="py-16 text-center text-brand-muted">İçerik yükleniyor…</div>;
  }

  return (
    <article className="rounded-2xl border border-brand-line bg-white p-6 sm:p-8">
      <div className="mb-6 flex flex-wrap items-start gap-x-6 gap-y-4 border-b border-brand-line pb-6">
        <div>
          <p className="text-[12px] font-bold uppercase tracking-[.08em] text-brand-muted">Mevzuat Güncellemesi Numarası</p>
          <p className="mt-1 text-[18px] font-extrabold text-brand-ink">
            {formatMevzuatGuncellemeNo(detail.reference, detail.slug)}
          </p>
        </div>
        <div className="ml-auto text-right">
          <p className="text-[12px] font-bold uppercase tracking-[.08em] text-brand-muted">Yayınlanma Tarihi</p>
          <p className="mt-1 text-[16px] font-semibold text-brand-ink">{detail.date}</p>
        </div>
      </div>

      <h1 className="mb-3 text-[24px] font-extrabold leading-snug text-brand-ink sm:text-[28px]">
        {decodeHtmlEntities(detail.title)}
      </h1>
      {detail.gazette ? <p className="mb-8 text-[15px] text-brand-muted">{detail.gazette}</p> : null}

      {detail.bodyHtml ? (
        <div className="mevzuat-update-body" dangerouslySetInnerHTML={{ __html: detail.bodyHtml }} />
      ) : (
        <p className="text-[15px] text-brand-muted">Bu kayıt için detay metni henüz senkronize edilmedi.</p>
      )}
    </article>
  );
}
