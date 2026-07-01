"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { MEVZUAT_GUNCELLEMELERI_LIST_PATH, mevzuatGuncellemeDetayUrl, resolveMevzuatGuncellemeDataSlug } from "@/lib/mevzuatGuncellemeleri";
import mevzuatIndex from "@/public/data/mevzuat-guncellemeleri/index.json";

function LegacyRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug");

  useEffect(() => {
    if (slug && /^[a-z0-9-]+$/i.test(slug)) {
      const dataSlug = resolveMevzuatGuncellemeDataSlug(slug, mevzuatIndex.items);
      if (dataSlug) {
        router.replace(mevzuatGuncellemeDetayUrl(dataSlug));
        return;
      }
    }

    router.replace(MEVZUAT_GUNCELLEMELERI_LIST_PATH);
  }, [router, slug]);

  return <div className="py-16 text-center text-brand-muted">Yönlendiriliyor…</div>;
}

export default function LegacyMevzuatGuncellemeDetayRedirect() {
  return (
    <Suspense fallback={<div className="py-16 text-center text-brand-muted">Yönlendiriliyor…</div>}>
      <LegacyRedirect />
    </Suspense>
  );
}
