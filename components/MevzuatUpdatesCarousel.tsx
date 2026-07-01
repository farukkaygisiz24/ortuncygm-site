"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, type ComponentProps } from "react";
import type { MevzuatUpdate } from "@/lib/mevzuatUpdates";
import { MEVZUAT_GUNCELLEMELERI_LIST_PATH, formatMevzuatGuncellemeNo, mevzuatGuncellemeDetayUrl, decodeHtmlEntities } from "@/lib/mevzuatGuncellemeleri";

const CARD_GAP = 10;
const LOOP_COPIES = 3;
const SCROLL_END_FALLBACK_MS = 450;

function NavArrow({ direction }: { direction: "prev" | "next" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {direction === "prev" ? <path d="M15 18l-6-6 6-6" /> : <path d="M9 6l6 6-6 6" />}
    </svg>
  );
}

function PencilIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4 shrink-0 text-brand-blue" fill="currentColor" aria-hidden>
      <path d="M13.5 2.5a2.12 2.12 0 0 1 3 3L7.2 14.8l-3.3.9.9-3.3L13.5 2.5z" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4 shrink-0 text-brand-muted" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <rect x="3" y="4.5" width="14" height="12.5" rx="2" />
      <path d="M3 8.5h14M7 2.5v3M13 2.5v3" />
    </svg>
  );
}

function MevzuatUpdateCard({
  item,
  cardProps,
  dataUpdateCard,
}: {
  item: MevzuatUpdate;
  cardProps: ComponentProps<typeof Link>;
  dataUpdateCard?: boolean;
}) {
  return (
    <Link
      {...cardProps}
      data-update-card={dataUpdateCard ? true : undefined}
      className={`circulars-carousel__card group shrink-0 ${cardProps.className ?? ""}`}
    >
      <div className="circulars-carousel__top">
        <div className="circulars-carousel__header flex min-w-0 items-center gap-2">
          <PencilIcon />
          <span className="min-w-0 truncate text-[14px] font-bold text-brand-ink">
            {formatMevzuatGuncellemeNo(item.reference, item.slug)}
          </span>
        </div>
        {item.date ? (
          <div className="circulars-carousel__date flex shrink-0 items-center gap-1.5">
            <CalendarIcon />
            <span className="whitespace-nowrap text-[13px] text-brand-muted">{item.date}</span>
          </div>
        ) : null}
      </div>
      <p className="circulars-carousel__content">{decodeHtmlEntities(item.title)}</p>
    </Link>
  );
}

export default function MevzuatUpdatesCarousel({
  items,
  variant = "default",
}: {
  items: MevzuatUpdate[];
  variant?: "default" | "marquee";
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const isAnimatingRef = useRef(false);
  const isAdjustingRef = useRef(false);
  const scrollEndTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const loopItems = items.length > 0 ? Array.from({ length: LOOP_COPIES }, () => items).flat() : [];

  const getMetrics = useCallback(() => {
    const track = trackRef.current;
    const count = items.length;
    if (!track || count === 0) {
      return { step: 382, setWidth: 382 * count, count };
    }

    const card = track.querySelector<HTMLElement>("[data-update-card]");
    const gap = Number.parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap || "10") || CARD_GAP;
    const step = (card?.offsetWidth ?? 360) + gap;
    return { step, setWidth: step * count, count };
  }, [items.length]);

  const normalizeScroll = useCallback(() => {
    const track = trackRef.current;
    if (!track || isAdjustingRef.current) return;

    const { setWidth } = getMetrics();
    if (setWidth <= 0) return;

    if (track.scrollLeft >= setWidth * 2 - 1) {
      isAdjustingRef.current = true;
      track.scrollLeft -= setWidth;
      isAdjustingRef.current = false;
    } else if (track.scrollLeft < setWidth - 1) {
      isAdjustingRef.current = true;
      track.scrollLeft += setWidth;
      isAdjustingRef.current = false;
    }
  }, [getMetrics]);

  const afterScrollSettles = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;

      if (scrollEndTimerRef.current) {
        clearTimeout(scrollEndTimerRef.current);
        scrollEndTimerRef.current = null;
      }

      isAnimatingRef.current = false;
      normalizeScroll();
    };

    if ("onscrollend" in track) {
      track.addEventListener("scrollend", finish, { once: true });
    }

    scrollEndTimerRef.current = setTimeout(finish, SCROLL_END_FALLBACK_MS);
  }, [normalizeScroll]);

  const scrollToMiddle = useCallback(() => {
    const track = trackRef.current;
    if (!track || items.length === 0) return;
    const { setWidth } = getMetrics();
    track.scrollLeft = setWidth;
  }, [getMetrics, items.length]);

  useEffect(() => {
    if (items.length === 0) return;
    scrollToMiddle();

    const track = trackRef.current;
    if (!track) return;

    const onScrollEnd = () => {
      if (isAnimatingRef.current || isAdjustingRef.current) return;
      normalizeScroll();
    };

    track.addEventListener("scrollend", onScrollEnd);
    return () => {
      track.removeEventListener("scrollend", onScrollEnd);
      if (scrollEndTimerRef.current) clearTimeout(scrollEndTimerRef.current);
    };
  }, [items.length, normalizeScroll, scrollToMiddle]);

  useEffect(() => {
    const onResize = () => scrollToMiddle();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [scrollToMiddle]);

  const scroll = (direction: "prev" | "next") => {
    const track = trackRef.current;
    if (!track || isAnimatingRef.current || items.length === 0) return;

    const { step } = getMetrics();
    isAnimatingRef.current = true;
    track.scrollBy({ left: direction === "next" ? step : -step, behavior: "smooth" });
    afterScrollSettles();
  };

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-brand-line bg-white p-8 text-center text-[15px] text-brand-muted">
        Son 15 gün içinde yeni mevzuat güncellemesi bulunmuyor.{" "}
        <Link href={MEVZUAT_GUNCELLEMELERI_LIST_PATH} className="font-bold text-brand-blue hover:underline">
          Tüm arşive göz atın
        </Link>
        .
      </div>
    );
  }

  if (variant === "marquee") {
    const marqueeItems = [...items, ...items];

    return (
      <div className="mevzuat-updates-marquee group">
        <div className="mevzuat-updates-marquee__fade-left" aria-hidden />
        <div
          className="mevzuat-updates-marquee__inner flex"
          style={{ animationDuration: `${Math.max(items.length * 5, 24)}s` }}
        >
          {marqueeItems.map((item, index) => (
            <MevzuatUpdateCard
              key={`${item.id}-marquee-${index}`}
              item={item}
              cardProps={{ href: mevzuatGuncellemeDetayUrl(item.slug) }}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div
        ref={trackRef}
        className="circulars-carousel__track flex overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {loopItems.map((item, index) => (
          <MevzuatUpdateCard
            key={`${item.id}-${index}`}
            item={item}
            dataUpdateCard
            cardProps={{
              href: mevzuatGuncellemeDetayUrl(item.slug),
            }}
          />
        ))}
      </div>

      <div className="mt-5 flex justify-center gap-3">
        <button
          type="button"
          aria-label="Önceki güncelleme"
          onClick={() => scroll("prev")}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-brand-line bg-white text-brand-ink shadow-sm transition hover:border-brand-blue hover:text-brand-blue"
        >
          <NavArrow direction="prev" />
        </button>
        <button
          type="button"
          aria-label="Sonraki güncelleme"
          onClick={() => scroll("next")}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-brand-line bg-white text-brand-ink shadow-sm transition hover:border-brand-blue hover:text-brand-blue"
        >
          <NavArrow direction="next" />
        </button>
      </div>
    </div>
  );
}
