import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import MevzuatGuncellemeDetayView from "@/components/MevzuatGuncellemeDetayView";
import PageHeader from "@/components/PageHeader";
import {
  MEVZUAT_GUNCELLEMELERI_LIST_PATH,
  mevzuatGuncellemeDetayUrl,
  mevzuatGuncellemeUrlSlug,
  resolveMevzuatGuncellemeDataSlug,
} from "@/lib/mevzuatGuncellemeleri";
import mevzuatIndex from "@/public/data/mevzuat-guncellemeleri/index.json";

type PageProps = {
  params: Promise<{ slug: string }>;
};

function isValidUrlSlug(slug: string): boolean {
  return /^[a-z0-9-]+$/i.test(slug);
}

export function generateStaticParams() {
  if (process.env.VERCEL_DEPLOY === "1") {
    return [];
  }

  return mevzuatIndex.items.flatMap((item) => [
    { slug: mevzuatGuncellemeUrlSlug(item.slug) },
    { slug: item.slug },
  ]);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug: urlSlug } = await params;
  if (!isValidUrlSlug(urlSlug)) {
    return { title: "Mevzuat Güncelleme Detayı | ORTUNÇ YGM" };
  }

  const dataSlug = resolveMevzuatGuncellemeDataSlug(urlSlug, mevzuatIndex.items);
  const item = dataSlug ? mevzuatIndex.items.find((entry) => entry.slug === dataSlug) : undefined;

  return {
    title: item ? `${item.title} | ORTUNÇ YGM` : "Mevzuat Güncelleme Detayı | ORTUNÇ YGM",
  };
}

export default async function MevzuatGuncellemeDetayPage({ params }: PageProps) {
  const { slug: urlSlug } = await params;
  if (!isValidUrlSlug(urlSlug)) notFound();

  const dataSlug = resolveMevzuatGuncellemeDataSlug(urlSlug, mevzuatIndex.items);
  if (!dataSlug) notFound();

  if (urlSlug !== mevzuatGuncellemeUrlSlug(dataSlug)) {
    redirect(mevzuatGuncellemeDetayUrl(dataSlug));
  }

  return (
    <>
      <PageHeader
        breadcrumb="Mevzuat Güncellemeleri"
        title="Güncelleme Detayı"
        subtitle={
          <Link href={MEVZUAT_GUNCELLEMELERI_LIST_PATH} className="text-brand-blue hover:underline">
            ← Tüm güncellemelere dön
          </Link>
        }
      />
      <section className="bg-white px-6 py-14 sm:px-10 lg:py-16">
        <div className="mx-auto max-w-4xl">
          <MevzuatGuncellemeDetayView slug={dataSlug} />
        </div>
      </section>
    </>
  );
}
