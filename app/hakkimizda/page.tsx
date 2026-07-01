import type { Metadata } from "next";
import { about } from "@/content/site-content";
import PageHeader from "@/components/PageHeader";
import StatsStrip from "@/components/StatsStrip";

export const metadata: Metadata = {
  title: "Hakkımızda | ORTUNÇ YGM",
  description: "ORTUNÇ Yetkilendirilmiş Gümrük Müşavirliği A.Ş. hakkında bilgi edinin.",
};

export default function HakkimizdaPage() {
  return (
    <>
      <PageHeader breadcrumb="Hakkımızda" title="Hakkımızda" />
      <section className="bg-white px-6 py-14 sm:px-10 lg:py-20">
        <div className="mx-auto flex max-w-3xl flex-col gap-5">
          {about.map((paragraph, i) => (
            <p
              key={i}
              className={
                i === 0
                  ? "text-[19px] font-semibold leading-relaxed text-brand-ink"
                  : "text-base leading-loose text-[#3a3b42]"
              }
            >
              {paragraph}
            </p>
          ))}
        </div>
        <div className="mx-auto mt-14 max-w-6xl border-t border-brand-line pt-12">
          <StatsStrip />
        </div>
      </section>
    </>
  );
}
