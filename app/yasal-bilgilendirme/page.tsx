import type { Metadata } from "next";
import { legalNotice } from "@/content/site-content";
import PageHeader from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "Yasal Bilgilendirme | ORTUNÇ YGM",
  description: "ORTUNÇ Yetkilendirilmiş Gümrük Müşavirliği A.Ş. yasal uyarı metni.",
};

export default function YasalBilgilendirmePage() {
  return (
    <>
      <PageHeader breadcrumb="Yasal Bilgilendirme" title="Yasal Uyarı" />
      <section className="bg-white px-6 py-14 sm:px-10 lg:py-16">
        <div className="mx-auto flex max-w-3xl flex-col gap-4">
          {legalNotice.map((paragraph, i) => (
            <p key={i} className="text-[15px] leading-relaxed text-[#3a3b42]">
              {paragraph}
            </p>
          ))}
        </div>
      </section>
    </>
  );
}
