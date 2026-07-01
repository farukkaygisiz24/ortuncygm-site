import type { Metadata } from "next";
import type { ReactNode } from "react";
import { contact } from "@/content/site-content";
import PageHeader from "@/components/PageHeader";
import { FaxIcon, MailIcon, PhoneIcon, PinIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "İletişim | ORTUNÇ YGM",
  description: "ORTUNÇ Yetkilendirilmiş Gümrük Müşavirliği A.Ş. iletişim bilgileri.",
};

const contactPad = "px-5 sm:px-6";

function ContactRow({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex h-11 w-11 flex-none items-center justify-center rounded-[10px] bg-brand-blue-tint text-brand-blue">
        {icon}
      </div>
      <div>
        <p className="mb-1 text-[13px] font-bold text-brand-ink">{label}</p>
        <div className="text-[15px] text-brand-muted">{children}</div>
      </div>
    </div>
  );
}

export default function IletisimPage() {
  const [istanbul, bursa] = contact.addresses;

  return (
    <>
      <PageHeader breadcrumb="İletişim" title="İletişim" />
      <section className="bg-white px-6 py-14 sm:px-10 lg:py-20">
        <div className="mx-auto flex max-w-6xl flex-col gap-8">
          <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:gap-x-8">
            <div className={contactPad}>
              <ContactRow icon={<PhoneIcon className="h-5 w-5" />} label="Telefon">
                <a href={contact.phoneHref} className="hover:text-brand-blue">
                  {contact.phone}
                </a>
              </ContactRow>
            </div>

            <div className={contactPad}>
              <ContactRow icon={<FaxIcon className="h-5 w-5" />} label="Faks">
                <a href={contact.faxHref} className="hover:text-brand-blue">
                  {contact.fax}
                </a>
              </ContactRow>
            </div>

            <div className={contactPad}>
              <ContactRow icon={<MailIcon className="h-5 w-5" />} label="E-Posta">
                <a href={`mailto:${contact.email}`} className="hover:text-brand-blue">
                  {contact.email}
                </a>
              </ContactRow>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-stretch lg:gap-x-8">
            {[istanbul, bursa].map((address) => (
              <div
                key={address.label}
                className="flex h-full flex-col gap-4 rounded-2xl border border-brand-line bg-brand-mist/40 p-5 sm:p-6"
              >
                <div className="min-h-[104px]">
                  <ContactRow icon={<PinIcon className="h-5 w-5" />} label={address.label}>
                    <span className="leading-relaxed">{address.value}</span>
                  </ContactRow>
                </div>
                <div className="relative min-h-[240px] flex-1 overflow-hidden rounded-xl border border-brand-line bg-white">
                  <iframe
                    src={address.mapEmbedUrl}
                    className="absolute inset-0 h-full w-full"
                    style={{ border: 0 }}
                    loading="lazy"
                    title={`${address.label} — ORTUNÇ YGM`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
