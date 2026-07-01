"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { headerNav, isMegaMenu, isNavGroup, siteInfo, type NavItem, type NavLink, type NavMegaGroup } from "@/content/site-content";
import { CloseIcon, MailIcon, MenuIcon, PhoneIcon } from "@/components/icons";

function isLink(item: NavItem): item is NavLink {
  return "href" in item;
}

function isHrefActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function isNavItemActive(item: NavItem, pathname: string): boolean {
  if (isLink(item)) return isHrefActive(pathname, item.href);
  if (isMegaMenu(item)) {
    return (
      isHrefActive(pathname, item.href) ||
      item.groups.some(
        (group) =>
          isHrefActive(pathname, group.href) ||
          group.links.some((child) => isHrefActive(pathname, child.href)),
      )
    );
  }
  return item.children.some((child) => isHrefActive(pathname, child.href));
}

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={className} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M5 7.5L10 12.5L15 7.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DesktopNavMegaMenu({
  label,
  href,
  groups,
  pathname,
}: {
  label: string;
  href: string;
  groups: NavMegaGroup[];
  pathname: string;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const active = isHrefActive(pathname, href) || groups.some(
    (g) =>
      isHrefActive(pathname, g.href) ||
      g.links.some((child) => isHrefActive(pathname, child.href)),
  );

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  const triggerClass = `inline-flex items-center gap-1 rounded-[10px] px-4 py-2.5 text-sm font-semibold transition-colors ${
    active
      ? "bg-brand-blue font-bold text-white hover:bg-brand-blue-dark"
      : "text-brand-ink hover:text-brand-blue"
  }`;

  return (
    <div
      ref={rootRef}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        className={triggerClass}
        onClick={() => setOpen((value) => !value)}
      >
        {label}
        <ChevronDownIcon className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      <div
        role="menu"
        className={`absolute top-full left-1/2 z-50 w-[min(56rem,calc(100vw-2.5rem))] -translate-x-1/2 pt-2 transition-all duration-200 ${
          open ? "visible translate-y-0 opacity-100" : "invisible -translate-y-1 opacity-0 pointer-events-none"
        }`}
      >
        <div className="overflow-hidden rounded-xl border border-brand-line bg-white shadow-[0_12px_32px_rgba(28,28,30,0.12)]">
          <div className="grid grid-cols-2 gap-x-6 gap-y-5 p-5 lg:grid-cols-4">
            {groups.map((group) => (
              <div key={group.title} className="min-w-0">
                <Link
                  href={group.href}
                  role="menuitem"
                  onClick={() => setOpen(false)}
                  className="text-[11px] font-bold uppercase tracking-[.12em] text-brand-blue hover:underline"
                >
                  {group.title}
                </Link>
                <ul className="mt-2 max-h-[14.5rem] space-y-0.5 overflow-y-auto pr-1">
                  {group.links.map((child) => {
                    const childActive = isHrefActive(pathname, child.href);
                    return (
                      <li key={child.href}>
                        <Link
                          href={child.href}
                          role="menuitem"
                          onClick={() => setOpen(false)}
                          className={`block rounded-lg px-2 py-1.5 text-[13px] font-medium leading-snug transition-colors ${
                            childActive
                              ? "bg-brand-mist text-brand-blue"
                              : "text-brand-ink hover:bg-brand-mist hover:text-brand-blue"
                          }`}
                        >
                          {child.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-brand-line bg-brand-mist/40 px-5 py-3">
            <Link
              href={href}
              onClick={() => setOpen(false)}
              className="text-[13px] font-bold text-brand-blue hover:underline"
            >
              Tüm hizmetlerimiz →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function DesktopNavDropdown({
  label,
  links,
  pathname,
}: {
  label: string;
  links: NavLink[];
  pathname: string;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const active = links.some((child) => isHrefActive(pathname, child.href));

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  const triggerClass = `inline-flex items-center gap-1 rounded-[10px] px-4 py-2.5 text-sm font-semibold transition-colors ${
    active
      ? "bg-brand-blue font-bold text-white hover:bg-brand-blue-dark"
      : "text-brand-ink hover:text-brand-blue"
  }`;

  return (
    <div
      ref={rootRef}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        className={triggerClass}
        onClick={() => setOpen((value) => !value)}
      >
        {label}
        <ChevronDownIcon className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      <div
        role="menu"
        className={`absolute top-full left-0 z-50 min-w-[15rem] pt-2 transition-all duration-200 ${
          open ? "visible translate-y-0 opacity-100" : "invisible -translate-y-1 opacity-0 pointer-events-none"
        }`}
      >
        <div className="overflow-hidden rounded-xl border border-brand-line bg-white py-1.5 shadow-[0_12px_32px_rgba(28,28,30,0.12)]">
          {links.map((child) => {
            const childActive = isHrefActive(pathname, child.href);
            return (
              <Link
                key={child.href}
                href={child.href}
                role="menuitem"
                onClick={() => setOpen(false)}
                className={`block px-4 py-2.5 text-sm font-semibold transition-colors ${
                  childActive
                    ? "bg-brand-mist text-brand-blue"
                    : "text-brand-ink hover:bg-brand-mist hover:text-brand-blue"
                }`}
              >
                {child.label}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const [openMobileGroups, setOpenMobileGroups] = useState<Record<string, boolean>>({});
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    const next: Record<string, boolean> = {};
    for (const item of headerNav) {
      if (!isLink(item) && isNavItemActive(item, pathname)) {
        next[item.label] = true;
      }
    }
    setOpenMobileGroups(next);
  }, [pathname]);

  const mobileLinkClass = (href: string) =>
    `block rounded-[10px] px-4 py-3.5 text-base font-semibold transition-colors ${
      isHrefActive(pathname, href)
        ? "bg-brand-blue font-bold text-white"
        : "text-brand-ink hover:bg-white/30 hover:text-brand-blue"
    }`;

  const linkClass = (href: string) =>
    `rounded-[10px] px-4 py-2.5 text-sm font-semibold transition-colors ${
      isHrefActive(pathname, href)
        ? "bg-brand-blue font-bold text-white hover:bg-brand-blue-dark"
        : "text-brand-ink hover:text-brand-blue"
    }`;

  const renderMobileNavItem = (item: NavItem) => {
    if (isLink(item)) {
      return (
        <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className={mobileLinkClass(item.href)}>
          {item.label}
        </Link>
      );
    }

    if (isMegaMenu(item)) {
      const groupActive = isNavItemActive(item, pathname);
      const isGroupOpen = openMobileGroups[item.label] ?? false;

      return (
        <div key={item.label} className="flex flex-col gap-1">
          <button
            type="button"
            aria-expanded={isGroupOpen}
            onClick={() =>
              setOpenMobileGroups((prev) => ({
                ...prev,
                [item.label]: !prev[item.label],
              }))
            }
            className={`flex w-full items-center justify-between rounded-[10px] px-4 py-3.5 text-base font-semibold transition-colors ${
              groupActive
                ? "bg-brand-blue font-bold text-white"
                : "text-brand-ink hover:bg-white/30 hover:text-brand-blue"
            }`}
          >
            {item.label}
            <ChevronDownIcon className={`h-4 w-4 transition-transform ${isGroupOpen ? "rotate-180" : ""}`} />
          </button>
          {isGroupOpen ? (
            <div className="ml-3 flex flex-col gap-2 border-l-2 border-white/40 pl-3">
              <Link href={item.href} onClick={() => setOpen(false)} className={mobileLinkClass(item.href)}>
                Tüm hizmetler
              </Link>
              {item.groups.map((group) => (
                <div key={group.title} className="flex flex-col gap-1">
                  <Link
                    href={group.href}
                    onClick={() => setOpen(false)}
                    className="px-4 py-2 text-[13px] font-bold uppercase tracking-wide text-brand-blue"
                  >
                    {group.title}
                  </Link>
                  {group.links.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      onClick={() => setOpen(false)}
                      className={mobileLinkClass(child.href)}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          ) : null}
        </div>
      );
    }

    if (!isNavGroup(item)) return null;

    const groupActive = isNavItemActive(item, pathname);
    const isGroupOpen = openMobileGroups[item.label] ?? false;

    return (
      <div key={item.label} className="flex flex-col gap-1">
        <button
          type="button"
          aria-expanded={isGroupOpen}
          onClick={() =>
            setOpenMobileGroups((prev) => ({
              ...prev,
              [item.label]: !prev[item.label],
            }))
          }
          className={`flex w-full items-center justify-between rounded-[10px] px-4 py-3.5 text-base font-semibold transition-colors ${
            groupActive
              ? "bg-brand-blue font-bold text-white"
              : "text-brand-ink hover:bg-white/30 hover:text-brand-blue"
          }`}
        >
          {item.label}
          <ChevronDownIcon className={`h-4 w-4 transition-transform ${isGroupOpen ? "rotate-180" : ""}`} />
        </button>
        {isGroupOpen ? (
          <div className="ml-3 flex flex-col gap-1 border-l-2 border-white/40 pl-3">
            {item.children.map((child) => (
              <Link
                key={child.href}
                href={child.href}
                onClick={() => setOpen(false)}
                className={mobileLinkClass(child.href)}
              >
                {child.label}
              </Link>
            ))}
          </div>
        ) : null}
      </div>
    );
  };

  return (
    <>
      <header
        className={`header-glass-pane sticky top-0 z-50 w-full transition-all duration-300 ${scrolled ? "header-glass-pane--scrolled" : ""}`}
      >
        <div className="relative mx-auto hidden max-w-6xl items-center justify-between gap-6 px-10 py-5 lg:flex lg:py-6">
          <Link href="/" className="flex shrink-0">
            <Image src="/images/logo-horizontal.png" alt={siteInfo.name} width={376} height={104} priority className="h-[52px] w-auto" />
          </Link>
          <div className="flex items-center gap-8">
            <nav className="flex gap-8">
              {headerNav.map((item) => {
                if (isLink(item)) {
                  return (
                    <Link key={item.href} href={item.href} className={linkClass(item.href)}>
                      {item.label}
                    </Link>
                  );
                }
                if (isMegaMenu(item)) {
                  return (
                    <DesktopNavMegaMenu
                      key={item.label}
                      label={item.label}
                      href={item.href}
                      groups={item.groups}
                      pathname={pathname}
                    />
                  );
                }
                return (
                  <DesktopNavDropdown key={item.label} label={item.label} links={item.children} pathname={pathname} />
                );
              })}
            </nav>
            <Link href="/iletisim" className="whitespace-nowrap rounded-lg bg-brand-blue px-6 py-2.5 text-sm font-bold text-white hover:bg-brand-blue-dark">
              İletişim
            </Link>
          </div>
        </div>

        <div className="relative flex items-center justify-between px-5 py-4 sm:px-6 lg:hidden">
          <Link href="/" className="flex" onClick={() => setOpen(false)}>
            <Image src="/images/logo-horizontal.png" alt={siteInfo.name} width={290} height={80} priority className="h-10 w-auto" />
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
      </header>

      <div
        aria-hidden={!open}
        className={`mobile-drawer-backdrop fixed inset-0 z-[60] transition-opacity duration-300 lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setOpen(false)}
      />
      <aside
        aria-hidden={!open}
        aria-modal={open}
        role="dialog"
        className={`fixed top-0 right-0 z-[70] h-dvh w-[min(300px,88vw)] overflow-hidden shadow-[-12px_0_40px_rgba(28,28,30,0.14)] transition-transform duration-300 ease-out lg:hidden ${
          open ? "translate-x-0" : "pointer-events-none translate-x-full"
        }`}
      >
        <div aria-hidden className="mobile-drawer-glass-pane pointer-events-none absolute inset-0" />
        <div className="relative z-10 flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-white/35 px-5 py-4">
            <span className="text-sm font-bold text-brand-ink">Menü</span>
            <button aria-label="Menüyü kapat" className="p-1.5 text-brand-ink" onClick={() => setOpen(false)}>
              <CloseIcon className="h-6 w-6" />
            </button>
          </div>
          <nav className="flex flex-1 flex-col gap-1.5 overflow-y-auto px-5 py-4">
            {headerNav.map((item) => renderMobileNavItem(item))}
            <Link href="/iletisim" onClick={() => setOpen(false)} className={mobileLinkClass("/iletisim")}>
              İletişim
            </Link>
          </nav>
          <div className="flex flex-col gap-2.5 border-t border-white/35 px-5 py-5">
            <a href="tel:02163176020" className="flex items-center gap-2 text-sm text-brand-muted hover:text-brand-blue">
              <PhoneIcon className="h-4 w-4" />
              +90 216 317 60 20
            </a>
            <a href="mailto:info@ortunc.com.tr" className="flex items-center gap-2 text-sm text-brand-muted hover:text-brand-blue">
              <MailIcon className="h-4 w-4" />
              info@ortunc.com.tr
            </a>
          </div>
        </div>
      </aside>
    </>
  );
}
