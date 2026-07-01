import type { Metadata } from "next";
import Link from "next/link";
import {
  buildServicesNavGroups,
  getServicesByCategory,
  serviceCategories,
} from "@/content/site-content";
import PageHeader from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "Hizmetlerimiz | ORTUNÇ YGM",
  description:
    "ORTUNÇ Yetkilendirilmiş Gümrük Müşavirliği A.Ş. gümrük, lojistik ve danışmanlık hizmetleri: antrepo, geçici ithalat, dahilde işleme, onaylanmış kişi statüsü tespit işlemleri ve daha fazlası.",
};

export default function HizmetlerPage() {
  const navGroups = buildServicesNavGroups();

  return (
    <>
      <PageHeader breadcrumb="Hizmetlerimiz" title="Hizmetlerimiz" />
      <section className="bg-brand-mist px-6 py-14 sm:px-10 lg:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {serviceCategories.map((category) => {
              const count = getServicesByCategory(category.key).length;
              return (
                <Link
                  key={category.slug}
                  href={category.href}
                  className="group rounded-2xl border border-brand-line bg-white p-7 transition hover:-translate-y-0.5 hover:border-brand-blue/30 hover:shadow-[0_16px_32px_rgba(28,28,30,.08)]"
                >
                  <h2 className="text-[20px] font-extrabold text-brand-ink group-hover:text-brand-blue">
                    {category.title}
                  </h2>
                  <p className="mt-1 text-[13px] font-semibold text-brand-blue">{count} hizmet</p>
                  <p className="mt-3 text-[14.5px] leading-relaxed text-brand-muted">{category.description}</p>
                  <span className="mt-5 inline-block text-[14px] font-bold text-brand-blue group-hover:underline">
                    Detayları incele →
                  </span>
                </Link>
              );
            })}
          </div>

          <div className="mt-14 rounded-2xl border border-brand-line bg-white p-7 sm:p-10">
            <h2 className="text-[22px] font-extrabold text-brand-ink">Tüm hizmetlerimiz</h2>
            <p className="mt-2 text-[15px] leading-relaxed text-brand-muted">
              Gümrük, lojistik ve danışmanlık alanlarında sunduğumuz {navGroups.reduce((n, g) => n + g.links.length, 0)}{" "}
              hizmete aşağıdan ulaşabilirsiniz.
            </p>
            <div className="mt-8 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
              {navGroups.map((group) => (
                <div key={group.title}>
                  <Link
                    href={group.href}
                    className="text-[12px] font-bold uppercase tracking-[.12em] text-brand-blue hover:underline"
                  >
                    {group.title}
                  </Link>
                  <ul className="mt-3 space-y-2">
                    {group.links.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className="text-[14px] font-medium leading-snug text-brand-ink hover:text-brand-blue hover:underline"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
