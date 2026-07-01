import type { Metadata } from "next";
import type { ReactNode } from "react";
import { contact } from "@/content/site-content";
import PageHeader from "@/components/PageHeader";
import { FaxIcon, MailIcon, PhoneIcon, PinIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "İletişim | ORTUNÇ YGM",
  description: "ORTUNÇ Yetkilendirilmiş Gümrük Müşavirliği A.Ş. iletişim bilgileri.",
};

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
  return (
    <>
      <PageHeader breadcrumb="İletişim" title="İletişim" />
      <section className="bg-white px-6 py-14 sm:px-10 lg:py-20">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-11 lg:grid-cols-2">
          <div className="flex flex-col gap-7">
            <ContactRow icon={<PhoneIcon className="h-5 w-5" />} label="Telefon">
              <a href={contact.phoneHref} className="hover:text-brand-blue">
                {contact.phone}
              </a>
            </ContactRow>
            <ContactRow icon={<FaxIcon className="h-5 w-5" />} label="Faks">
              {contact.fax}
            </ContactRow>
            <ContactRow icon={<MailIcon className="h-5 w-5" />} label="E-Posta">
              <a href={`mailto:${contact.email}`} className="hover:text-brand-blue">
                {contact.email}
              </a>
            </ContactRow>
            {contact.addresses.map((address) => (
              <ContactRow key={address.label} icon={<PinIcon className="h-5 w-5" />} label={address.label}>
                <span className="leading-relaxed">{address.value}</span>
              </ContactRow>
            ))}
          </div>
          <div className="overflow-hidden rounded-2xl border border-brand-line">
            <iframe
              src={contact.mapEmbedUrl}
              width="100%"
              height="420"
              style={{ border: 0, display: "block" }}
              loading="lazy"
              title="ORTUNÇ YGM Konum"
            />
          </div>
        </div>
      </section>
    </>
  );
}
