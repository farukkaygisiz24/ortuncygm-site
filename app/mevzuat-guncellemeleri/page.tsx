import type { Metadata } from "next";
import Link from "next/link";
import MevzuatGuncellemeleriList from "@/components/MevzuatGuncellemeleriList";
import PageHeader from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "Mevzuat Güncellemeleri | ORTUNÇ YGM",
  description: "Gümrük ve dış ticaret mevzuat güncellemeleri arşivi",
};

export default function MevzuatGuncellemeleriPage() {
  return (
    <>
      <PageHeader
        breadcrumb="Mevzuat Güncellemeleri"
        title="Mevzuat Güncellemeleri"
        subtitle="Gümrük ve dış ticaret mevzuatına ilişkin güncellemeler arşivi"
      />
      <section className="bg-white px-6 py-14 sm:px-10 lg:py-16">
        <div className="mx-auto max-w-6xl">
          <MevzuatGuncellemeleriList />
        </div>
      </section>
    </>
  );
}
