import Image from "next/image";
import Link from "next/link";
import MevzuatUpdatesSection from "@/components/MevzuatUpdatesSection";
import { aboutHomeSummary, hero, homepageCarouselServices, siteInfo } from "@/content/site-content";
import FaqAccordion from "@/components/FaqAccordion";
import ServicesCarousel from "@/components/ServicesCarousel";
import StatsStrip from "@/components/StatsStrip";

export default function Home() {
  return (
    <>
      <section className="relative -mt-[var(--header-height)] overflow-hidden pt-[var(--header-height)] lg:min-h-[min(72svh,36rem)]">
        <Image
          src="/images/hero-text-bg.png"
          alt=""
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-ink/92 via-brand-ink/72 to-brand-ink/35" aria-hidden="true" />
        <div className="relative z-10 mx-auto grid max-w-6xl grid-cols-1 gap-8 px-6 py-10 sm:px-10 sm:py-16 lg:grid-cols-2 lg:items-center lg:gap-16 lg:py-12">
          <div className="flex flex-col justify-center lg:max-w-[32rem] lg:pr-4">
            <h1 className="text-[26px] font-extrabold leading-tight text-white sm:text-[32px]">
              {hero.title}
            </h1>
            <p className="mt-4 text-[15px] leading-relaxed text-[#b7b8c2] sm:text-[16px] sm:leading-loose">
              {hero.subtitle}
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link href="/hizmetler" className="rounded-[10px] bg-brand-blue px-6 py-3 text-[14px] font-bold text-white hover:bg-brand-blue-dark">
                Hizmetlerimiz
              </Link>
              <Link href="/iletisim" className="rounded-[10px] border-[1.5px] border-white/50 px-6 py-3 text-[14px] font-bold text-white hover:bg-white/10">
                Bize Ulaşın
              </Link>
            </div>
          </div>
          <div className="relative z-10 flex items-center justify-center">
            <div className="relative w-full max-w-[340px] lg:max-w-[360px]">
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[20px]">
                <Image
                  src="/images/hero-corporate.png"
                  alt="Modern lojistik merkezi ve antrepo tesisi — uluslararası ticaret"
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 360px"
                />
              </div>
              <div
                className="pointer-events-none absolute -right-5 top-5 bottom-[-20px] left-5 z-20 rounded-[20px] border-2 border-brand-blue"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 border-b border-brand-line bg-brand-mist py-6 sm:py-7">
        <div className="mx-auto max-w-6xl px-6 sm:px-10">
          <StatsStrip />
        </div>
      </section>

      <ServicesCarousel items={homepageCarouselServices} />

      <MevzuatUpdatesSection />

      <section className="bg-white py-12 lg:py-20">
        <div className="mx-auto max-w-6xl px-6 sm:px-10">
          <p className="mb-3 text-[13px] font-bold uppercase tracking-[.14em] text-brand-blue">Kurumsal</p>
          <h3 className="text-[22px] font-extrabold text-brand-ink sm:text-[26px]">Hakkımızda</h3>

          <div className="mt-6 flex flex-col gap-6 lg:mt-8">
            <div className="flex flex-col items-center gap-8 lg:flex-row lg:items-stretch lg:gap-12">
              <div className="flex w-full items-center justify-center lg:w-1/2 lg:justify-start">
                <Image
                  src="/images/logo-horizontal.png"
                  alt={siteInfo.name}
                  width={320}
                  height={88}
                  className="h-[clamp(3.25rem,7.5vw,7.5rem)] w-auto max-w-full object-contain object-left lg:h-full lg:max-h-none"
                  sizes="(max-width: 1024px) 70vw, 28rem"
                />
              </div>
              <p className="w-full text-[15px] leading-relaxed text-[#3a3b42] sm:text-[16px] sm:leading-loose lg:w-1/2 lg:flex-1">
                {aboutHomeSummary}
              </p>
            </div>
            <div className="flex justify-end">
              <Link href="/hakkimizda" className="text-[15px] font-bold text-brand-blue hover:underline">
                Devamını Oku →
              </Link>
            </div>
          </div>
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
