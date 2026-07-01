import type { Metadata } from "next";
import { mevzuatCitation, mevzuatParagraphs, mevzuatTitle } from "@/content/mevzuat";
import { classifyMevzuat } from "@/lib/classifyMevzuat";
import PageHeader from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "Mevzuat | ORTUNÇ YGM",
  description: "Yetkilendirilmiş Gümrük Müşavirliği Tebliği",
};

export default function MevzuatPage() {
  const items = classifyMevzuat(mevzuatParagraphs);

  return (
    <>
      <PageHeader breadcrumb="Mevzuat" title={mevzuatTitle} subtitle={mevzuatCitation} />
      <section className="bg-white px-6 py-14 sm:px-10 lg:py-16">
        <div className="mx-auto flex max-w-3xl flex-col">
          {items.map((item, i) => {
            if (item.isChapter) {
              return (
                <h2
                  key={i}
                  className="mt-12 border-t-2 border-brand-blue pt-5 text-[13px] font-extrabold uppercase tracking-[.12em] text-brand-blue"
                >
                  {item.text}
                </h2>
              );
            }
            if (item.isChapterSubtitle) {
              return (
                <h3 key={i} className="mb-6 text-xl font-extrabold text-brand-ink">
                  {item.text}
                </h3>
              );
            }
            if (item.isArticleTitle) {
              return (
                <h4 key={i} className="mt-7 text-base font-bold text-brand-ink">
                  {item.text}
                </h4>
              );
            }
            if (item.isArticleNumber) {
              return (
                <p
                  key={i}
                  className="mb-2.5 inline-block w-fit rounded-md bg-brand-blue px-2.5 py-0.5 text-[12.5px] font-bold tracking-wide text-white"
                >
                  {item.text}
                </p>
              );
            }
            return (
              <p key={i} className={`mb-3 text-[15px] leading-relaxed text-[#3a3b42] ${item.isListItem ? "pl-5" : ""}`}>
                {item.text}
              </p>
            );
          })}
        </div>
      </section>
    </>
  );
}
