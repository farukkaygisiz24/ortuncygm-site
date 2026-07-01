"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import CardSwap, { Card } from "@/components/CardSwap";
import type { ServiceItem } from "@/content/services";
import { servicesSlogan, type ServiceCategoryKey } from "@/content/site-content";

const CATEGORY_HREFS: Record<ServiceCategoryKey, string> = {
  gumruk: "/hizmetler/gumruk-hizmetleri",
  lojistik: "/hizmetler/lojistik-hizmetleri",
  danismanlik: "/hizmetler/danismanlik-hizmetleri",
};

/** 16:9 yatay kart — varsayılan; alan ölçümüyle büyütülür */
const CARD_WIDTH = 440;
const CARD_HEIGHT = Math.round((CARD_WIDTH * 9) / 16);
const SWAP_CARD_LIMIT = 6;

/** Sağ-alt köşede ~yarısı görünür (React Bits peek) */
const CARD_PEEK_RATIO = 0.52;
/** Arka kart başlıklarının üst üste okunması için minimum dikey aralık */
const CARD_HEADER_STACK_GAP = 46;

/** lg grid’de sağ sütun ~%46; kart boyutu buna göre, görünür alan tüm section */
const RIGHT_COLUMN_WIDTH_RATIO = 0.46;

function fitCardSize(columnWidth: number, stageHeight: number, isDesktopSplit: boolean) {
  let width = isDesktopSplit
    ? Math.round(columnWidth / CARD_PEEK_RATIO)
    : Math.min(Math.round(columnWidth * 0.9), 340);

  let height = Math.round((width * 9) / 16);

  if (isDesktopSplit) {
    const maxHeight = Math.round(stageHeight * 0.96);
    if (height > maxHeight) {
      height = maxHeight;
      width = Math.round((height * 16) / 9);
    }
  }

  width = Math.max(width, isDesktopSplit ? 300 : 260);
  height = Math.round((width * 9) / 16);

  return { width, height };
}

const CARD_SKEW = 2;

export default function ServicesCarousel({ items }: { items: readonly ServiceItem[] }) {
  const router = useRouter();
  const sectionRef = useRef<HTMLElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const layoutRef = useRef<HTMLDivElement>(null);
  const [cardSize, setCardSize] = useState({ width: CARD_WIDTH, height: CARD_HEIGHT });
  const [isDesktopSplit, setIsDesktopSplit] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  const swapItems = useMemo(() => items.slice(0, SWAP_CARD_LIMIT), [items]);

  useEffect(() => {
    const section = sectionRef.current;
    const inner = innerRef.current;
    const layout = layoutRef.current;
    if (!section || !inner || !layout) return;

    const updateSize = () => {
      const sectionRect = section.getBoundingClientRect();
      const innerRect = inner.getBoundingClientRect();
      const layoutRect = layout.getBoundingClientRect();
      if (sectionRect.width > 0 && layoutRect.height > 0) {
        const desktopSplit = sectionRect.width >= 1024;
        const columnWidth = desktopSplit
          ? innerRect.width * RIGHT_COLUMN_WIDTH_RATIO
          : innerRect.width;
        setIsDesktopSplit(desktopSplit);
        setCardSize(fitCardSize(columnWidth, layoutRect.height, desktopSplit));
      }
    };

    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(section);
    observer.observe(inner);
    observer.observe(layout);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduceMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  const stackGap = isDesktopSplit
    ? Math.max(CARD_HEADER_STACK_GAP, Math.round(cardSize.height * 0.12))
    : 24;
  const stackTopPad = reduceMotion ? 0 : Math.max(0, (swapItems.length - 1) * stackGap);

  return (
    <section
      ref={sectionRef}
      className="services-carousel relative isolate bg-white py-12 pt-10 sm:py-16 sm:pt-12 lg:py-20 lg:pt-16"
    >
      <div
        ref={innerRef}
        className="services-carousel__inner relative z-10 mx-auto max-w-6xl px-6 sm:px-10"
      >
        <div
          ref={layoutRef}
          className="services-carousel__layout grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-center lg:gap-16"
        >
          <div className="services-carousel__content flex flex-col justify-center bg-white lg:max-w-[32rem] lg:pr-4">
            <p className="text-[13px] font-bold uppercase tracking-[.14em] text-brand-blue">Hizmetlerimiz</p>
            <h2 className="mt-3 text-[26px] font-extrabold leading-tight text-brand-ink sm:text-[32px]">
              Dış ticaretiniz için uçtan uca çözüm
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-brand-muted sm:text-[16px] sm:leading-loose">
              {servicesSlogan}
            </p>
          </div>
          <div
            className="services-carousel__swap-spacer hidden min-h-[19rem] lg:block xl:min-h-[21rem]"
            aria-hidden
          />
        </div>

        <div
          className="services-carousel__swap-stage"
          style={
            {
              "--swap-card-height": `${cardSize.height}px`,
              "--swap-stack-gap": `${stackGap}px`,
              "--swap-stack-pad": `${stackTopPad}px`,
            } as CSSProperties
          }
        >
          {reduceMotion ? (
            <div className="services-carousel__static-grid">
              {swapItems.map((service) => (
                <Link
                  key={service.title}
                  href={CATEGORY_HREFS[service.category]}
                  className="services-card-swap__card services-carousel__static-card group"
                >
                  <div className="services-card-swap__header">
                    <span className="services-card-swap__header-text">{service.title}</span>
                  </div>
                  <div className="services-card-swap__body">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      className="services-card-swap__image object-cover"
                      sizes="200px"
                    />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <CardSwap
              key={`${cardSize.width}-${cardSize.height}`}
              className="services-carousel__swap"
              width={cardSize.width}
              height={cardSize.height}
              cardDistance={Math.round(cardSize.width * 0.045)}
              verticalDistance={stackGap}
              delay={5000}
              pauseOnHover={false}
              skewAmount={CARD_SKEW}
              easing="linear"
              onCardClick={(idx) => {
                const service = swapItems[idx];
                if (service) router.push(CATEGORY_HREFS[service.category]);
              }}
            >
              {swapItems.map((service) => (
                <Card key={service.title} customClass="services-card-swap__card">
                  <div className="services-card-swap__header">
                    <span className="services-card-swap__header-text">{service.title}</span>
                  </div>
                  <div className="services-card-swap__body">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      className="services-card-swap__image object-cover"
                      sizes={`${cardSize.width}px`}
                    />
                  </div>
                </Card>
              ))}
            </CardSwap>
          )}
        </div>
      </div>
    </section>
  );
}
