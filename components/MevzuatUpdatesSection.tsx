import Link from "next/link";
import MevzuatUpdatesCarousel from "@/components/MevzuatUpdatesCarousel";
import mevzuatIndex from "@/public/data/mevzuat-guncellemeleri/index.json";
import { MEVZUAT_GUNCELLEMELERI_LIST_PATH, decodeHtmlEntities } from "@/lib/mevzuatGuncellemeleri";
import { filterRecentMevzuatUpdates } from "@/lib/mevzuatDate";
import type { MevzuatUpdate } from "@/lib/mevzuatUpdates";

function toCarouselItem(item: (typeof mevzuatIndex.items)[number]): MevzuatUpdate {
  return {
    id: item.slug,
    slug: item.slug,
    reference: item.reference,
    date: item.date,
    title: decodeHtmlEntities(item.title),
  };
}

export default function MevzuatUpdatesSection() {
  const recentItems = filterRecentMevzuatUpdates(mevzuatIndex.items).map(toCarouselItem);

  return (
    <section id="mevzuat-updates" className="overflow-hidden bg-brand-mist py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-6 sm:px-10">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-16">
          <div className="shrink-0 lg:max-w-[32rem] lg:pr-4">
            <h2 className="text-[28px] font-extrabold leading-tight text-brand-ink sm:text-[32px]">
              MEVZUAT
              <br />
              GÜNCELLEMELERİ
            </h2>
            <Link
              href={MEVZUAT_GUNCELLEMELERI_LIST_PATH}
              className="mt-6 inline-block rounded-[10px] bg-brand-blue px-7 py-3.5 text-[15px] font-bold text-white transition hover:bg-brand-blue-dark"
            >
              Tüm Güncellemeler
            </Link>
          </div>

          <div className="mevzuat-updates-carousel-bleed min-w-0 flex-1">
            <MevzuatUpdatesCarousel items={recentItems} variant="marquee" />
          </div>
        </div>
      </div>
    </section>
  );
}
