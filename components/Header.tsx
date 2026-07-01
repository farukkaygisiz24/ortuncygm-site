"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { siteInfo } from "@/content/site-content";
import { CloseIcon, MailIcon, MenuIcon, PhoneIcon } from "@/components/icons";

const navLinks = [
  { label: "Ana Sayfa", href: "/" },
  { label: "Hizmetlerimiz", href: "/hizmetler" },
  { label: "Hakkımızda", href: "/hakkimizda" },
  { label: "Mevzuat", href: "/mevzuat" },
];
const navAll = [...navLinks, { label: "İletişim", href: "/iletisim" }];

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const mobileLinkClass = (href: string) =>
    `block border-b border-brand-line py-4 text-base font-semibold transition-colors hover:text-brand-blue ${
      pathname === href ? "text-brand-blue" : "text-brand-ink"
    }`;

  const linkClass = (href: string) =>
    `text-sm font-semibold transition-colors hover:text-brand-blue ${
      pathname === href ? "text-brand-blue" : "text-brand-ink"
    }`;

  return (
    <header className="sticky top-0 z-50 bg-white">
      <div className="border-b border-brand-line">
        <div className="mx-auto hidden max-w-6xl items-center justify-between gap-6 px-10 py-5 lg:flex lg:py-6">
          <Link href="/" className="flex shrink-0">
            <Image src="/images/logo.png" alt={siteInfo.name} width={220} height={54} priority className="h-[52px] w-auto" />
          </Link>
          <div className="flex items-center gap-8">
            <nav className="flex gap-8">
              {navLinks.map((item) => (
                <Link key={item.href} href={item.href} className={linkClass(item.href)}>
                  {item.label}
                </Link>
              ))}
            </nav>
            <Link href="/iletisim" className="whitespace-nowrap rounded-lg bg-brand-blue px-6 py-2.5 text-sm font-bold text-white hover:bg-brand-blue-dark">
              İletişim
            </Link>
          </div>
        </div>

        <div className="flex items-center justify-between px-5 py-4 sm:px-6 lg:hidden">
          <Link href="/" className="flex" onClick={() => setOpen(false)}>
            <Image src="/images/logo.png" alt={siteInfo.name} width={180} height={44} priority className="h-10 w-auto" />
          </Link>
          <button
            aria-label="Menüyü aç/kapat"
            aria-expanded={open}
            className="p-1.5 text-brand-ink"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <CloseIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
          </button>
        </div>
      </div>

      <div
        aria-hidden={!open}
        className={`fixed inset-0 z-[60] bg-brand-ink/50 transition-opacity duration-300 lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setOpen(false)}
      />
      <aside
        aria-hidden={!open}
        className={`fixed top-0 right-0 z-[70] flex h-full w-[min(300px,88vw)] flex-col border-l border-brand-line bg-white shadow-[-12px_0_40px_rgba(28,28,30,0.12)] transition-transform duration-300 ease-out lg:hidden ${
          open ? "translate-x-0" : "pointer-events-none translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-brand-line px-5 py-4">
          <span className="text-sm font-bold text-brand-ink">Menü</span>
          <button aria-label="Menüyü kapat" className="p-1.5 text-brand-ink" onClick={() => setOpen(false)}>
            <CloseIcon className="h-6 w-6" />
          </button>
        </div>
        <nav className="flex flex-1 flex-col px-5 pt-2">
          {navAll.map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className={mobileLinkClass(item.href)}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex flex-col gap-2.5 border-t border-brand-line px-5 py-5">
          <a href="tel:02163176020" className="flex items-center gap-2 text-sm text-brand-muted hover:text-brand-blue">
            <PhoneIcon className="h-4 w-4" />
            +90 216 317 60 20
          </a>
          <a href="mailto:info@ortunc.com.tr" className="flex items-center gap-2 text-sm text-brand-muted hover:text-brand-blue">
            <MailIcon className="h-4 w-4" />
            info@ortunc.com.tr
          </a>
        </div>
      </aside>
    </header>
  );
}
