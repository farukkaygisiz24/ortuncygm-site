import type { ServiceCategoryKey } from "@/content/site-content";
import type { IconKey } from "@/components/ServiceIcon";

export type ServiceItem = {
  icon: IconKey;
  category: ServiceCategoryKey;
  title: string;
  slug: string;
  image: string;
  description: string;
};

export function slugifyService(title: string): string {
  return title
    .toLocaleLowerCase("tr-TR")
    .replace(/ı/g, "i")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function withSlugs(
  items: Omit<ServiceItem, "slug">[],
): ServiceItem[] {
  return items.map((item) => ({ ...item, slug: slugifyService(item.title) }));
}

/** Yerel hizmet görselleri (Unsplash kaynaklı, static export için indirildi) */
const U = {
  customsOffice: "/images/services/customs-office.jpg",
  importPort: "/images/services/import-port.jpg",
  exportShip: "/images/services/export-ship.jpg",
  globalTrade: "/images/services/global-trade.jpg",
  digital: "/images/services/digital.jpg",
  documents: "/images/services/documents.jpg",
  laboratory: "/images/services/laboratory.jpg",
  warehouse: "/images/services/warehouse.jpg",
  cargoBoxes: "/images/services/cargo-boxes.jpg",
  certificate: "/images/services/certificate.jpg",
  corporate: "/images/services/corporate.jpg",
  factory: "/images/services/factory.jpg",
  trucking: "/images/services/trucking.jpg",
  courier: "/images/services/courier.jpg",
  teamMeeting: "/images/services/team-meeting.jpg",
  legislation: "/images/services/legislation.jpg",
  finance: "/images/services/finance.jpg",
  growth: "/images/services/growth.jpg",
  security: "/images/services/security.jpg",
  officeTeam: "/images/services/office-team.jpg",
  inspection: "/images/services/inspection.jpg",
  market: "/images/services/market.jpg",
  engineering: "/images/services/engineering.jpg",
  handshake: "/images/services/handshake.jpg",
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
    title: "Genel ve Özel Antrepolara İlişkin Tespit İşlemleri",
    image: U.warehouse,
    description:
      "Antrepoya eşya giriş-çıkış işlemlerinin yapılması, antreponun açılması, genişletme/daraltma, tadilat, adres değişikliği ve devir işlemlerine ilişkin başvuru dosyalarının ön incelemesi ve rapor hazırlanması (AN1–AN8).",
  },
  {
    icon: "truck",
    category: "gumruk",
    title: "Geçici İthalat Rejimine İlişkin Tespit İşlemleri",
    image: U.cargoBoxes,
    description:
      "Kısmi ve tam muafiyet suretiyle geçici ithalatı yapılan eşyaya ek süre talebine ilişkin tespit işlemleri (GC1, GC2).",
  },
  {
    icon: "certificate",
    category: "gumruk",
    title: "Menşe Belgelerinin Sonradan Kontrol Edilmesi",
    image: U.certificate,
    description:
      "Sonradan kontrol için gönderilen EUR.1 ve benzeri menşe belgelerinin şekil şartları ile belge kapsamı eşyanın menşeine ilişkin tespit raporu düzenlenmesi (SK1).",
  },
  {
    icon: "badge",
    category: "gumruk",
    title: "Onaylanmış Kişi Statü Belgesi Alınmasına İlişkin Tespit İşlemleri",
    image: U.corporate,
    description:
      "Onaylanmış kişi statü belgesi müracaatına ilişkin ön inceleme ve tespit işlemleri (OK1).",
  },
  {
    icon: "layers",
    category: "gumruk",
    title: "Dahilde İşleme Rejimine İlişkin Tespit İşlemleri",
    image: U.factory,
    description:
      "Dahilde işleme rejimi kapsamında geçici ithal edilen eşyaya ek süre talebine ilişkin tespit işlemleri (DR1, DR2).",
  },

  // —— Lojistik Hizmetleri ——
  {
    icon: "warehouse",
    category: "lojistik",
    title: "Lojistik Hizmetler",
    image: U.trucking,
    description:
      "Antrepo ve depo yönetimi, sevkiyat planlaması ile yurt içi ve yurt dışı taşımacılık süreçlerinde gümrük operasyonlarınızla entegre lojistik koordinasyon hizmeti sunuyoruz.",
  },
  {
    icon: "truck",
    category: "lojistik",
    title: "Dış Ticarette Kurye Hizmetleri",
    image: U.courier,
    description:
      "Dış ticaret süreçlerinizde gerekli doküman ve numunelerin hızlı, güvenli ve ekonomik şekilde ulaştırılması için kurye ve evrak lojistiği desteği sağlıyoruz.",
  },

  // —— Danışmanlık Hizmetleri ——
  {
    icon: "clipboard",
    category: "danismanlik",
    title: "Danışmanlık ve Denetim Hizmetleri",
    image: U.teamMeeting,
    description:
      "YYS sahibi firmaların dış ticaret işlemlerinin incelenerek yıllık faaliyet raporlarının düzenlenmesi; ithalat ve ihracat işlemlerinde tarife, rejim, vergi, kıymet ve belge uyumunun denetlenmesi.",
  },
  {
    icon: "clipboard",
    category: "danismanlik",
    title: "Mevzuat Danışmanlığı",
    image: U.legislation,
    description:
      "Gümrük ve dış ticaret mevzuatındaki güncellemeleri takip ederek firmalarınızın operasyonlarını yasal çerçeveye uygun şekilde planlamanıza yardımcı oluyoruz.",
  },
  {
    icon: "certificate",
    category: "danismanlik",
    title: "Tarife Cetveli IRK ve İGV Kararına İlişkin Başvurular",
    image: U.finance,
    description:
      "İthalat rejimi kapsamında tarife cetveli, menşe ve vergi uygulamalarına ilişkin başvuru süreçlerinde mevzuat analizi ve dosya hazırlığı danışmanlığı veriyoruz.",
  },
  {
    icon: "badge",
    category: "danismanlik",
    title: "Teşvik Danışmanlığı",
    image: U.growth,
    description:
      "Yatırım ve ihracat teşviklerinden azami düzeyde ve doğru şekilde yararlanmanız için mevzuata hakim uzman kadromuzla başvuru ve izleme danışmanlığı sunuyoruz.",
  },
  {
    icon: "layers",
    category: "danismanlik",
    title: "Teminat Danışmanlığı",
    image: U.security,
    description:
      "Gümrük ve dış ticaret işlemlerinizde kullanılan teminat mektupları, ithalat-ihracat bakiyeleri ve belge kullanım süreçlerinin takibi konusunda danışmanlık hizmeti veriyoruz.",
  },
  {
    icon: "badge",
    category: "danismanlik",
    title: "Yetkilendirilmiş Yükümlü Statüsü (YYS) Danışmanlığı",
    image: U.officeTeam,
    description:
      "YYS belgesi başvuru şartları, süreç yönetimi ve belge sonrası uyum faaliyetleri konusunda AEO/YYS kapsamında danışmanlık desteği sağlıyoruz.",
  },
  {
    icon: "clipboard",
    category: "danismanlik",
    title: "Sonradan Kontrol Danışmanlığı",
    image: U.inspection,
    description:
      "Gümrük idaresi nezdinde yürütülen sonradan kontrol denetimlerine hazırlık sürecinde bilgi ve belge yönetimi, mevzuat uyumu ve süreç danışmanlığı sunuyoruz.",
  },
  {
    icon: "certificate",
    category: "danismanlik",
    title: "Damping Soruşturmaları Danışmanlığı",
    image: U.market,
    description:
      "Anti-damping, telafi edici ve korunma önlemleri kapsamındaki soruşturma ve uygulamalara ilişkin mevzuat analizi ve süreç danışmanlığı hizmeti veriyoruz.",
  },
  {
    icon: "layers",
    category: "danismanlik",
    title: "Dış Ticarette Teknik Düzenlemeler ve Standardizasyon",
    image: U.engineering,
    description:
      "Ürün güvenliği, teknik düzenlemeler ve standardizasyon gereklilikleri açısından dış ticaret operasyonlarınızın uygunluk değerlendirmesi konusunda danışmanlık sağlıyoruz.",
  },
  {
    icon: "clipboard",
    category: "danismanlik",
    title: "Diğer Danışmanlık Hizmetleri",
    image: U.handshake,
    description:
      "Gümrük, dış ticaret ve lojistik alanlarında ihtiyaç duyduğunuz özel konularda proje bazlı danışmanlık ve iş takibi hizmeti sunuyoruz.",
  },
];

export const services: ServiceItem[] = withSlugs(serviceCatalog);

export function getServiceHref(categoryHref: string, slug: string): string {
  return `${categoryHref}#${slug}`;
}

export function getServicesByCategory(category: ServiceCategoryKey): ServiceItem[] {
  return services.filter((service) => service.category === category);
}

/** Ana sayfa kart yığını — kategori başına öne çıkan hizmetler (6 kart). */
const HOMEPAGE_CAROUSEL_TITLES = [
  "Gümrük Müşavirliği",
  "İthalat Gümrükleme",
  "İhracat Gümrükleme",
  "Yurt Dışı Gümrükleme Hizmeti",
  "Lojistik Hizmetler",
  "Danışmanlık ve Denetim Hizmetleri",
] as const;

export const homepageCarouselServices: ServiceItem[] = HOMEPAGE_CAROUSEL_TITLES.map(
  (title) => services.find((s) => s.title === title)!,
);
