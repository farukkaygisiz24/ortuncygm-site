import Image from "next/image";
import Link from "next/link";
import { contact, siteInfo } from "@/content/site-content";

export default function Footer() {
  return (
    <footer className="relative mt-auto overflow-hidden bg-brand-ink text-[#c9cad1]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-blue/70 to-transparent" aria-hidden="true" />
      <div
        className="pointer-events-none absolute -top-32 left-1/2 h-64 w-[min(900px,90%)] -translate-x-1/2 rounded-full bg-brand-blue/25 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-brand-blue/20 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-16 bottom-8 h-56 w-56 rounded-full bg-brand-blue-dark/25 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(38,38,188,0.12),transparent_55%)]"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 py-16 sm:grid-cols-2 sm:px-10 lg:grid-cols-6">
        <div>
          <Image
            src="/images/logo.png"
            alt={siteInfo.name}
            width={160}
            height={36}
            className="h-9 w-auto opacity-95 brightness-0 invert"
          />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-[#9d9ea8]">{siteInfo.description}</p>
        </div>
        <div>
          <p className="mb-4 text-xs font-bold uppercase tracking-widest text-white">Hızlı Erişim</p>
          <div className="flex flex-col gap-3 text-[14.5px]">
            <Link href="/" className="hover:text-white">
              Ana Sayfa
            </Link>
            <Link href="/hizmetler" className="hover:text-white">
              Hizmetlerimiz
            </Link>
            <Link href="/iletisim" className="hover:text-white">
              İletişim
            </Link>
          </div>
        </div>
        <div>
          <p className="mb-4 text-xs font-bold uppercase tracking-widest text-white">Kurumsal</p>
          <div className="flex flex-col gap-3 text-[14.5px]">
            <Link href="/hakkimizda" className="hover:text-white">
              Hakkımızda
            </Link>
            <Link href="/mevzuat" className="hover:text-white">
              Mevzuat
            </Link>
            <Link href="/yasal-bilgilendirme" className="hover:text-white">
              Yasal Bilgilendirme
            </Link>
          </div>
        </div>
        <div>
          <p className="mb-4 text-xs font-bold uppercase tracking-widest text-white">İletişim</p>
          <div className="flex flex-col gap-3 text-[14.5px]">
            <a href={contact.phoneHref} className="hover:text-white">
              {contact.phone}
            </a>
            <a href={`mailto:${contact.email}`} className="hover:text-white">
              {contact.email}
            </a>
          </div>
        </div>
        <div className="sm:col-span-2 lg:col-span-2">
          <p className="mb-4 text-xs font-bold uppercase tracking-widest text-white">Adres</p>
          <div className="grid grid-cols-1 gap-6 text-[14.5px] sm:grid-cols-2 sm:gap-5">
            {contact.addresses.map((address) => (
              <div key={address.label} className="leading-relaxed text-[#9d9ea8]">
                <span className="mb-1 block text-[12px] font-semibold uppercase tracking-wide text-[#b8b9c2]">
                  {address.label}
                </span>
                <span>{address.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="relative z-10 border-t border-[#303136]/80">
        <div className="mx-auto max-w-6xl px-6 py-5 text-[13px] text-[#8a8b95] sm:px-10">
          Copyright &copy; {new Date().getFullYear()} {siteInfo.name}. Tüm hakları saklıdır.
        </div>
      </div>
    </footer>
  );
}
