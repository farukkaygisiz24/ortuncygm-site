import type { Metadata } from "next";
import { services } from "@/content/site-content";
import ServiceCard from "@/components/ServiceCard";
import PageHeader from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "Hizmetlerimiz | ORTUNÇ YGM",
  description:
    "ORTUNÇ Yetkilendirilmiş Gümrük Müşavirliği A.Ş. hizmetleri: antrepo, geçici ithalat, dahilde işleme, onaylanmış kişi statüsü tespit işlemleri ve daha fazlası.",
};

export default function HizmetlerPage() {
  return (
    <>
      <PageHeader breadcrumb="Hizmetlerimiz" title="Hizmetlerimiz" />
      <section className="bg-brand-mist px-6 py-14 sm:px-10 lg:py-20">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <ServiceCard key={service.title} service={service} />
          ))}
        </div>
      </section>
    </>
  );
}
