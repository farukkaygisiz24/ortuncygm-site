import ServiceIcon, { type IconKey } from "@/components/ServiceIcon";
import type { services } from "@/content/site-content";

type Service = (typeof services)[number];

export default function ServiceCard({ service }: { service: Service }) {
  return (
    <div className="rounded-2xl border border-brand-line bg-white p-7 transition hover:-translate-y-0.5 hover:shadow-[0_16px_32px_rgba(28,28,30,.09)]">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-blue-tint text-brand-blue">
        <ServiceIcon icon={service.icon as IconKey} className="h-6 w-6" />
      </div>
      <h3 className="mt-5 text-[17px] font-bold leading-snug text-brand-ink">{service.title}</h3>
      <p className="mt-2.5 text-[14.5px] leading-relaxed text-brand-muted">{service.description}</p>
    </div>
  );
}
