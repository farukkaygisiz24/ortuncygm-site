"use client";

import NumberFlow from "@number-flow/react";
import { useEffect, useRef, useState } from "react";
import { stats } from "@/content/site-content";

function AnimatedStat({ value, label }: { value: number; label: string }) {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          setDisplayValue(value);
        }
      },
      { threshold: 0.3 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [value]);

  return (
    <div ref={ref} className="px-2 text-center">
      <NumberFlow
        value={displayValue}
        format={{ useGrouping: false }}
        className="text-3xl font-extrabold leading-none text-brand-blue sm:text-[2rem]"
        spinTiming={{ duration: 900, easing: "cubic-bezier(0.34, 1.2, 0.64, 1)" }}
        transformTiming={{ duration: 600, easing: "cubic-bezier(0.16, 1, 0.3, 1)" }}
      />
      <div className="mx-auto mt-1.5 max-w-[13rem] text-xs leading-snug text-brand-muted sm:max-w-none sm:text-[13px] sm:leading-relaxed">
        {label}
      </div>
    </div>
  );
}

export default function StatsStrip() {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 sm:gap-4">
      {stats.map((stat) => (
        <AnimatedStat key={stat.label} value={Number(stat.value)} label={stat.label} />
      ))}
    </div>
  );
}
