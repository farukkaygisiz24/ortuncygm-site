import type { ServiceCategoryKey } from "@/content/site-content";
import type { IconKey } from "@/components/ServiceIcon";

export type ServiceItem = {
  icon: IconKey;
  category: ServiceCategoryKey;
  /** Kurumsal / hizmet sayfası başlığı */
  title: string;
  /** Ana sayfa kart yığını kısa başlığı */
  carouselTitle?: string;
  slug: string;
  image: string;
  description: string;
};

export function slugifyService(title: string): string {
  return title
    .toLocaleLowerCase("tr-TR")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function withSlugs(
  items: Omit<ServiceItem, "slug">[],
): ServiceItem[] {
  return items.map((item) => ({ ...item, slug: slugifyService(item.title) }));
}

/** Yerel hizmet görselleri */
const U = {
  customsOffice: "/images/services/customs-office.jpg",
  importPort: "/images/services/import-port.jpg",
  exportShip: "/images/services/export-ship.jpg",
  globalTrade: "/images/services/global-trade.jpg",
  digital: "/images/services/digital.jpg",
  documents: "/images/services/documents.jpg",
  laboratory: "/images/services/laboratory.jpg",
  antrepoTespit: "/images/services/antrepo-tespit.jpg",
  oksbOnInceleme: "/images/services/oksb-on-inceleme.jpg",
  yysDanismanligi: "/images/services/yys-danismanligi.jpg",
  dirTespit: "/images/services/dir-tespit.jpg",
  geciciIthalat: "/images/services/gecici-ithalat.jpg",
  menseKontrol: "/images/services/mense-kontrol.jpg",
  teamMeeting: "/images/services/team-meeting.jpg",
  inspection: "/images/services/inspection.jpg",
} as const;

/** UGM hizmet yapısına paralel, ORTUNÇ ifadesiyle hazırlanmış hizmet kataloğu. */
const serviceCatalog: Omit<ServiceItem, "slug">[] = [
  // —— Gümrük Hizmetleri ——
  {
    icon: "badge",
    category: "gumruk",
    title: "Gümrük Müşavirliği",
    image: U.customsOffice,
    description:
      "Dış ticaret işlemlerinizde gümrük mevzuatına uygun temsil ve takip hizmeti sunuyoruz. İthalat ve ihracat süreçlerinizin beyan, vergi ve rejim boyutlarında doğru yönetilmesi için uzman kadromuzla yanınızdayız.",
  },
  {
    icon: "warehouse",
    category: "gumruk",
    title: "İthalat Gümrükleme",
    image: U.importPort,
    description:
      "İthalat operasyonlarınızda sektörel gereklilikleri dikkate alarak beyanname, ek belge ve vergi süreçlerini uçtan uca yönetiyor; işlemlerinizin hızlı ve mevzuata uygun tamamlanmasını sağlıyoruz.",
  },
  {
    icon: "truck",
    category: "gumruk",
    title: "İhracat Gümrükleme",
    image: U.exportShip,
    description:
      "İhracat beyannamelerinizin hazırlanması, rejim ve belge uyumunun sağlanması ve gümrük idaresi nezdindeki işlemlerin takibi konusunda deneyimli ekibimizle hizmet veriyoruz.",
  },
  {
    icon: "certificate",
    category: "gumruk",
    title: "Yurt Dışı Gümrükleme Hizmeti",
    image: U.globalTrade,
    description:
      "Uluslararası ticaret ağınızdaki yurt dışı gümrükleme ihtiyaçlarınız için iş ortaklarımız ve süreç bilgimizle koordinasyon sağlıyor; sevkiyatlarınızın hedef ülkede sorunsuz tamamlanmasına destek oluyoruz.",
  },
  {
    icon: "layers",
    category: "gumruk",
    title: "Dijital Gümrük Hizmetleri",
    image: U.digital,
    description:
      "Gümrük operasyonlarınızın başlangıcından sonuçlanmasına kadar tüm aşamaları dijital altyapımız üzerinden izlenebilir şekilde yönetiyor; şeffaf ve hızlı bilgi akışı sunuyoruz.",
  },
  {
    icon: "clipboard",
    category: "gumruk",
    title: "Gümrük ve Dış Ticaret Tercüme Hizmetleri",
    image: U.documents,
    description:
      "Gümrük ve dış ticaret belgelerinizin İngilizce, Almanca, Fransızca, Rusça, Arapça ve diğer dillerde tercümesini; mevzuat terminolojisine hâkim ekibimizle gerçekleştiriyoruz.",
  },
  {
    icon: "certificate",
    category: "gumruk",
    title: "Gümrükte Laboratuvar Analiz Hizmetleri",
    image: U.laboratory,
    description:
      "Gümrük süreçlerinde talep edilen laboratuvar analiz ve test işlemlerinin koordinasyonunu sağlayarak ürünlerinizin mevzuata uygun şekilde tescil edilmesine destek veriyoruz.",
  },
  {
    icon: "warehouse",
    category: "gumruk",
    carouselTitle: "Antrepo Tespit İşlemleri (AN1 – AN8)",
    title: "Antrepo Tespit İşlemleri (AN1 – AN8)",
    image: U.antrepoTespit,
    description:
      "Gümrük antrepolarının açılış, genişletme, daraltma, devir ve adres değişikliği işlemleri ile antrepolara eşya giriş-çıkış süreçlerinin mevzuata uygunluğunu tespit ediyor ve raporlarını eksiksiz tanzim ediyoruz.",
  },
  {
    icon: "truck",
    category: "gumruk",
    carouselTitle: "Geçici İthalat Rejimi Tespitleri (GC1 - GC2)",
    title: "Geçici İthalat Rejimine İlişkin Tespit İşlemleri (GC1, GC2)",
    image: U.geciciIthalat,
    description:
      "Geçici ithalat rejimi kapsamında Türkiye gümrük bölgesine getirilen eşyaların yasal durum ve kullanım amaçlarına uygunluğunu denetliyor, süre uzatım taleplerine esas teşkil eden raporları uzmanlıkla hazırlıyoruz.",
  },
  {
    icon: "certificate",
    category: "gumruk",
    carouselTitle: "Menşe Belgelerinin Sonradan Kontrolü (SK1)",
    title: "Menşe Belgelerinin Sonradan Kontrol Edilmesi (SK1)",
    image: U.menseKontrol,
    description:
      "İhraç edilen eşyaların menşe kurallarına uygunluğunu ve menşe ispat belgelerinin doğruluğunu mevzuat çerçevesinde inceliyor, sonradan kontrol işlemlerine esas teşkil eden raporlama süreçlerini eksiksiz yönetiyoruz.",
  },
  {
    icon: "badge",
    category: "gumruk",
    carouselTitle: "Onaylanmış Kişi Statüsü (OKSB)",
    title: "Onaylanmış Kişi Statü Belgesi (OKSB) Ön İncelemesi",
    image: U.oksbOnInceleme,
    description:
      "Dış ticaret işlemlerinde büyük kolaylıklar sağlayan OKSB müracaatlarının ön inceleme süreçlerini gerçekleştiriyor; aranan kurumsal ve mali şartları titizlikle inceleyerek gerekli tespit raporlarını hazırlıyoruz.",
  },
  {
    icon: "layers",
    category: "gumruk",
    carouselTitle: "Dahilde İşleme Rejimi (DİR) Tespit İşlemleri",
    title: "Dahilde İşleme Rejimi DR1 ve DR2 Tespit Raporları",
    image: U.dirTespit,
    description:
      "Dahilde İşleme İzin Belgesi (DİİB) kapsamındaki tüm girdi, malzeme ve bileşenlerin üretimde kullanım durumlarını tespit ediyor, ithal eşyalarının rejim şartlarına uygunluğunu inceliyor ve DR1-DR2 raporlarınızı güvenle hazırlıyoruz.",
  },

  // —— Danışmanlık Hizmetleri ——
  {
    icon: "clipboard",
    category: "danismanlik",
    title: "Danışmanlık ve Denetim Hizmetleri",
    image: U.teamMeeting,
    description:
      "Firmaların dış ticaret işlemlerinin incelenerek yıllık faaliyet raporlarının düzenlenmesi; ithalat ve ihracat işlemlerinde tarife, rejim, vergi, kıymet ve belge uyumunun denetlenmesine yardımcı oluyoruz.",
  },
  {
    icon: "badge",
    category: "danismanlik",
    title: "Yetkilendirilmiş Yükümlü Statü (YYS) Danışmanlığı",
    image: U.yysDanismanligi,
    description:
      "Global ticarette en üst düzey prestij ve kolaylık sağlayan Yetkilendirilmiş Yükümlü Statüsü (YYS) belgelendirme süreçlerinizi yönetiyor; kurumsal dış ticaret risk analizleri ve önleyici iç denetim hizmetleriyle firmanızı geleceğe hazırlıyoruz.",
  },
  {
    icon: "clipboard",
    category: "danismanlik",
    title: "Sonradan Kontrol Danışmanlığı",
    image: U.inspection,
    description:
      "Gümrük idaresi nezdinde yürütülen sonradan kontrol denetimlerine hazırlık sürecinde bilgi ve belge yönetimi, mevzuat uyumu ve süreç danışmanlığı sunuyoruz.",
  },
];

export const services: ServiceItem[] = withSlugs(serviceCatalog);

export function getServiceHref(categoryHref: string, slug: string): string {
  return `${categoryHref}#${slug}`;
}

export function getServicesByCategory(category: ServiceCategoryKey): ServiceItem[] {
  return services.filter((service) => service.category === category);
}

/** Ana sayfa kart yığını ve YGM öne çıkan hizmetler (sıralı). */
const YGM_FEATURED_SLUGS = [
  "antrepo-tespit-islemleri-an1-an8",
  "onaylanmis-kisi-statu-belgesi-oksb-on-incelemesi",
  "yetkilendirilmis-yukumlu-statu-yys-danismanligi",
  "dahilde-isleme-rejimi-dr1-ve-dr2-tespit-raporlari",
  "gecici-ithalat-rejimine-iliskin-tespit-islemleri-gc1-gc2",
  "mense-belgelerinin-sonradan-kontrol-edilmesi-sk1",
] as const;

export function getYgmFeaturedHref(service: ServiceItem): string {
  return `/hizmetler/gumruk-hizmetleri#${service.slug}`;
}

export function getYgmFeaturedServices(): ServiceItem[] {
  return YGM_FEATURED_SLUGS.map((slug) => services.find((s) => s.slug === slug)!);
}

export const homepageCarouselServices: ServiceItem[] = getYgmFeaturedServices();
