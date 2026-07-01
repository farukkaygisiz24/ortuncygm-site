import Image from "next/image";
import Link from "next/link";
import { about, hero, services } from "@/content/site-content";
import FaqAccordion from "@/components/FaqAccordion";
import ServiceCard from "@/components/ServiceCard";
import StatsStrip from "@/components/StatsStrip";

export default function Home() {
  return (
    <>
      <section className="relative grid grid-cols-1 overflow-hidden lg:grid-cols-2">
        <Image
          src="/images/hero-text-bg.png"
          alt=""
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-ink/92 via-brand-ink/72 to-brand-ink/35" aria-hidden="true" />
        <div className="relative z-10 flex flex-col justify-center gap-6 px-6 py-16 sm:px-10 lg:px-16 lg:py-24">
          <div>
            <h1 className="text-[32px] font-extrabold leading-[1.15] text-white sm:text-[42px] lg:text-[50px]">
              {hero.title}
            </h1>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-[#b7b8c2] sm:text-lg">{hero.subtitle}</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/hizmetler" className="rounded-[10px] bg-brand-blue px-7 py-3.5 text-[15px] font-bold text-white hover:bg-brand-blue-dark">
                Hizmetlerimiz
              </Link>
              <Link href="/iletisim" className="rounded-[10px] border-[1.5px] border-white/50 px-7 py-3.5 text-[15px] font-bold text-white hover:bg-white/10">
                Bize Ulaşın
              </Link>
            </div>
          </div>
        </div>
        <div className="relative z-10 flex items-center justify-center p-8 lg:p-14">
          <div className="relative w-full max-w-[440px]">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[20px]">
              <Image
                src="/images/hero-corporate.png"
                alt="Modern lojistik merkezi ve antrepo tesisi — uluslararası ticaret"
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 440px"
              />
            </div>
            <div
              className="pointer-events-none absolute -right-5 top-5 bottom-[-20px] left-5 z-20 rounded-[20px] border-2 border-brand-blue"
              aria-hidden="true"
            />
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-11 sm:px-10">
        <div className="mx-auto max-w-6xl">
          <StatsStrip />
        </div>
      </section>

      <section className="bg-brand-mist px-6 py-16 sm:px-10 lg:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-xl">
            <p className="mb-3 text-[13px] font-bold uppercase tracking-[.14em] text-brand-blue">Neler Sunuyoruz</p>
            <h2 className="text-[28px] font-extrabold text-brand-ink sm:text-[36px]">Hizmetlerimiz</h2>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <ServiceCard key={service.title} service={service} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-16 sm:px-10 lg:py-28">
        <div className="mx-auto max-w-6xl">
          <p className="mb-3 text-[13px] font-bold uppercase tracking-[.14em] text-brand-blue">Kurumsal</p>
          <h2 className="mb-8 max-w-2xl text-[28px] font-extrabold text-brand-ink sm:text-[36px]">Hakkımızda</h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {about.slice(0, 3).map((paragraph, i) => (
              <div key={i} className="flex flex-col gap-3">
                <span className="text-[13px] font-extrabold tracking-[.08em] text-[#c7c9e6]">0{i + 1}</span>
                <p className="text-[15px] leading-relaxed text-[#3a3b42]">{paragraph}</p>
              </div>
            ))}
          </div>
          <Link href="/hakkimizda" className="mt-8 inline-block text-[15px] font-bold text-brand-blue hover:underline">
            Devamını Oku →
          </Link>
        </div>
      </section>

      <section className="bg-brand-mist px-6 py-16 sm:px-10 lg:py-28">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <p className="mb-3 text-[13px] font-bold uppercase tracking-[.14em] text-brand-blue">SSS</p>
            <h2 className="text-[28px] font-extrabold text-brand-ink sm:text-[36px]">Sık Sorulan Sorular</h2>
            <p className="mx-auto mt-3.5 max-w-md text-[15px] leading-relaxed text-brand-muted">
              Yetkilendirilmiş Gümrük Müşavirliği sektörünü bilmeyenler için bize sorulan en sık soruları
              cevaplamaya çalıştık.
            </p>
          </div>
          <FaqAccordion />
        </div>
      </section>
    </>
  );
}
