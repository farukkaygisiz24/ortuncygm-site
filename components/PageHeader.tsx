import Link from "next/link";

export default function PageHeader({
  breadcrumb,
  title,
  subtitle,
}: {
  breadcrumb: string;
  title: string;
  subtitle?: React.ReactNode;
}) {
  return (
    <section className="border-b border-brand-line bg-white px-6 pb-8 pt-14 sm:px-10 lg:pt-16">
      <div className="mx-auto max-w-6xl">
        <p className="mb-3.5 text-[13px] text-brand-muted">
          <Link href="/" className="hover:text-brand-ink">
            Ana Sayfa
          </Link>
          <span className="mx-2">/</span>
          <span className="font-semibold text-brand-ink">{breadcrumb}</span>
        </p>
        <h1 className="text-3xl font-extrabold leading-tight text-brand-ink sm:text-4xl">{title}</h1>
        {subtitle ? <p className="mt-3 text-sm text-brand-muted">{subtitle}</p> : null}
      </div>
    </section>
  );
}
