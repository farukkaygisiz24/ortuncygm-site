"use client";

import { useId, useRef, useState } from "react";
import { faq } from "@/content/site-content";

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  const itemRef = useRef<HTMLDivElement>(null);
  const contentId = useId();

  const toggle = () => {
    const next = !open;
    setOpen(next);

    if (next) {
      window.setTimeout(() => {
        itemRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }, 280);
    }
  };

  return (
    <div
      ref={itemRef}
      className={`scroll-mt-6 rounded-2xl border bg-white p-5 transition-[border-color,box-shadow,transform] duration-300 ease-out sm:p-6 ${
        open
          ? "border-brand-blue/35 shadow-[0_10px_28px_rgba(38,38,188,0.12)]"
          : "border-brand-line hover:border-brand-blue/20"
      }`}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls={contentId}
        onClick={toggle}
        className="flex w-full cursor-pointer items-center justify-between gap-4 text-left text-base font-bold text-brand-ink"
      >
        {question}
        <span
          className={`flex h-[26px] w-[26px] flex-none items-center justify-center rounded-full text-sm font-bold transition-all duration-300 ${
            open
              ? "rotate-180 bg-brand-blue text-white"
              : "bg-brand-blue-tint text-brand-blue"
          }`}
        >
          {open ? "−" : "+"}
        </span>
      </button>

      <div
        id={contentId}
        className="grid transition-[grid-template-rows] duration-300 ease-out"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <p
            className={`pt-4 text-[14.5px] leading-relaxed text-[#4b4c54] transition-[opacity,transform] duration-300 ease-out ${
              open ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
            }`}
          >
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function FaqAccordion() {
  return (
    <div className="mt-9 flex flex-col gap-3.5">
      {faq.map((item) => (
        <FaqItem key={item.question} question={item.question} answer={item.answer} />
      ))}
    </div>
  );
}
