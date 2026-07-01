"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
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

  const linkClass = (href: string) =>
    `text-sm font-semibold transition-colors hover:text-brand-blue ${
      pathname === href ? "text-brand-blue" : "text-brand-ink"
    }`;

  return (
    <header className="sticky top-0 z-50 bg-white">
      <div className="hidden bg-brand-ink lg:block">
        <div className="mx-auto flex max-w-6xl justify-end gap-7 px-10 py-2.5">
          <a href="tel:02163176020" className="flex items-center gap-1.5 text-[12.5px] text-[#c9cad1] hover:text-white">
            <PhoneIcon className="h-3.5 w-3.5" />
            +90 216 317 60 20
          </a>
          <a href="mailto:info@ortunc.com.tr" className="flex items-center gap-1.5 text-[12.5px] text-[#c9cad1] hover:text-white">
            <MailIcon className="h-3.5 w-3.5" />
            info@ortunc.com.tr
          </a>
        </div>
      </div>

      <div className="border-b border-brand-line">
        <div className="mx-auto hidden max-w-6xl items-center justify-between gap-6 px-10 py-4 lg:flex">
          <Link href="/" className="flex shrink-0">
            <Image src="/images/logo.png" alt={siteInfo.name} width={180} height={44} priority className="h-10 w-auto" />
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

        <div className="flex items-center justify-between px-5 py-3.5 lg:hidden">
          <Link href="/" className="flex" onClick={() => setOpen(false)}>
            <Image src="/images/logo.png" alt={siteInfo.name} width={140} height={34} priority className="h-8 w-auto" />
          </Link>
          <button
            aria-label="Menüyü aç/kapat"
            className="p-1.5 text-brand-ink"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <CloseIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {open ? (
        <div className="fixed inset-0 z-[60] flex flex-col bg-brand-ink p-5 lg:hidden">
          <div className="flex justify-end">
            <button aria-label="Menüyü kapat" className="p-2 text-white" onClick={() => setOpen(false)}>
              <CloseIcon className="h-7 w-7" />
            </button>
          </div>
          <nav className="mt-6 flex flex-col gap-1">
            {navAll.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="border-b border-[#303136] py-4 text-xl font-bold text-white last:border-0"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-auto flex flex-col gap-2.5 border-t border-[#303136] pt-6">
            <a href="tel:02163176020" className="text-[15px] text-[#c9cad1]">
              +90 216 317 60 20
            </a>
            <a href="mailto:info@ortunc.com.tr" className="text-[15px] text-[#c9cad1]">
              info@ortunc.com.tr
            </a>
          </div>
        </div>
      ) : null}
    </header>
  );
}
