export const siteInfo = {
  name: "ORTUNÇ Yetkilendirilmiş Gümrük Müşavirliği A.Ş.",
  shortName: "ORTUNÇ YGM",
  description: "Yetkilendirilmiş gümrük müşavirliği ve danışmanlık hizmetleri.",
};

export type NavLink = { label: string; href: string };

export type NavMegaGroup = {
  title: string;
  href: string;
  links: NavLink[];
};

export type NavItem =
  | NavLink
  | {
      label: string;
      children: NavLink[];
    }
  | {
      label: string;
      href: string;
      groups: NavMegaGroup[];
    };

export function isMegaMenu(
  item: NavItem,
): item is { label: string; href: string; groups: NavMegaGroup[] } {
  return "groups" in item;
}

export function isNavGroup(
  item: NavItem,
): item is { label: string; children: NavLink[] } {
  return "children" in item;
}

export const hero = {
  title: "ORTUNÇ Yetkilendirilmiş Gümrük Müşavirliği A.Ş.",
  subtitle:
    "Antrepo, geçici ithalat, dahilde işleme ve onaylanmış kişi statüsü tespit işlemlerinde uzman kadromuzla yanınızdayız.",
};

// Figures pulled directly from the "about" copy below (founding year, service
// regions, office count) — not invented data.
export const stats = [
  { value: "2008", label: "Faaliyet yılımız" },
  { value: "6", label: "Hizmet bölgesi — İstanbul, Kocaeli, Bursa, Balıkesir, Manisa, İzmir" },
  { value: "3", label: "Merkez, şube ve ofis" },
];

export type ServiceCategoryKey = "gumruk" | "lojistik" | "danismanlik";

export type ServiceCategory = {
  key: ServiceCategoryKey;
  slug: string;
  title: string;
  href: string;
  description: string;
};

export const serviceCategories: ServiceCategory[] = [
  {
    key: "gumruk",
    slug: "gumruk-hizmetleri",
    title: "Gümrük Hizmetleri",
    href: "/hizmetler/gumruk-hizmetleri",
    description:
      "Gümrük müşavirliği, ithalat-ihracat gümrükleme, dijital gümrük ve YGM kapsamındaki tespit işlemleriyle dış ticaret operasyonlarınızı uçtan uca destekliyoruz.",
  },
  {
    key: "lojistik",
    slug: "lojistik-hizmetleri",
    title: "Lojistik Hizmetleri",
    href: "/hizmetler/lojistik-hizmetleri",
    description:
      "Antrepo, depo ve sevkiyat yönetimi ile dış ticarette kurye hizmetleri dahil gümrük süreçlerinizle entegre lojistik koordinasyon sunuyoruz.",
  },
  {
    key: "danismanlik",
    slug: "danismanlik-hizmetleri",
    title: "Danışmanlık Hizmetleri",
    href: "/hizmetler/danismanlik-hizmetleri",
    description:
      "Mevzuat, teşvik, teminat, YYS, sonradan kontrol ve damping başta olmak üzere dış ticaret danışmanlığının tüm alanlarında uzman destek veriyoruz.",
  },
];

export function getServiceCategory(slug: string): ServiceCategory | undefined {
  return serviceCategories.find((category) => category.slug === slug);
}

export { services, getServicesByCategory, homepageCarouselServices, getServiceHref } from "@/content/services";
export type { ServiceItem } from "@/content/services";

import { getServiceHref, getServicesByCategory } from "@/content/services";

/** Header mega menü — UGM tarzı gruplu hizmet listesi */
export function buildServicesNavGroups(): NavMegaGroup[] {
  const gumrukHref = "/hizmetler/gumruk-hizmetleri";
  const lojistikHref = "/hizmetler/lojistik-hizmetleri";
  const danismanlikHref = "/hizmetler/danismanlik-hizmetleri";

  const gumruk = getServicesByCategory("gumruk");
  const gumrukOperational = gumruk.slice(0, 7);
  const ygmTespit = gumruk.slice(7);

  const toLinks = (items: ReturnType<typeof getServicesByCategory>, categoryHref: string) =>
    items.map((s) => ({
      label: s.title,
      href: getServiceHref(categoryHref, s.slug),
    }));

  return [
    {
      title: "Gümrük Hizmetleri",
      href: gumrukHref,
      links: toLinks(gumrukOperational, gumrukHref),
    },
    {
      title: "YGM Tespit İşlemleri",
      href: `${gumrukHref}#ygm-tespit`,
      links: toLinks(ygmTespit, gumrukHref),
    },
    {
      title: "Lojistik Hizmetleri",
      href: lojistikHref,
      links: toLinks(getServicesByCategory("lojistik"), lojistikHref),
    },
    {
      title: "Danışmanlık Hizmetleri",
      href: danismanlikHref,
      links: toLinks(getServicesByCategory("danismanlik"), danismanlikHref),
    },
  ];
}

export const nav: NavItem[] = [
  { label: "Ana Sayfa", href: "/" },
  {
    label: "Hizmetlerimiz",
    href: "/hizmetler",
    groups: buildServicesNavGroups(),
  },
  { label: "Hakkımızda", href: "/hakkimizda" },
  {
    label: "Mevzuat",
    children: [
      { label: "Mevzuat", href: "/mevzuat" },
      { label: "Mevzuat Güncellemeleri", href: "/mevzuat-guncellemeleri" },
    ],
  },
  { label: "İletişim", href: "/iletisim" },
];

export const headerNav = nav.filter((item) => !("href" in item) || item.href !== "/iletisim");

export const servicesSlogan =
  "2008'den bu yana uzman YGM kadromuzla antrepo, rejim ve statü tespit süreçlerinizi mevzuata uygun, hızlı ve çözüm odaklı yürütüyor; dış ticaret operasyonlarınıza güven katıyoruz.";

export const faq = [
  {
    question: "YGM Nedir?",
    answer:
      "YGM, “Yetkilendirilmiş Gümrük Müşaviri”nin kısaltması olup, Gümrük Yönetmeliğinin 574–578. Maddelerinde belirtilen şartları taşıyan ve Bakanlıkça yetki belgesi verilen gümrük müşavirleridir.",
  },
  {
    question: "YGM Yetkileri Nelerdir?",
    answer:
      "Antrepo açılışı, antrepoda genişletme/daraltma, devir, adres değişikliği ve eşya giriş/çıkış işlemleri başta olmak üzere, geçici ithalat ve dahilde işleme rejimi kapsamında geçici ithal edilen eşyaya ek süre verilmesi, onaylanmış kişi statü belgesi müracaatlarının ön incelemesinin yapılması, ihraç edilen eşyanın menşeinin tespitine ilişkin sonradan kontrol yapılması, nihai kullanım kapsamında ithal edilen eşyanın nihai kullanıma tahsis edilip edilmediğinin tespiti ve Bakanlık tarafından Tebliğ ile belirlenen diğer konularda firmanın mali kayıtları da dahil olmak üzere inceleme ve araştırma yapmak suretiyle rapor düzenlerler.",
  },
  {
    question: "YGM Ücretleri Nasıl Tespit Edilir?",
    answer:
      "YGM’nin yapacağı işlemler karşılığında alacağı asgari ücret, Gümrük Kanununun Geçici 6. Maddesine istinaden takvim yılı itibariyle Ticaret Bakanlığı tarafından belirlenerek Tebliğ ile Resmi Gazetede ilan edilir.",
  },
  {
    question: "YGM ve Gümrük Müşaviri Arasındaki Fark Nedir?",
    answer:
      "Genel hatları itibariyle, Gümrük Müşaviri firmalar tarafından verilen vekaletnameye istinaden dolaylı temsil suretiyle gümrük işlemlerini takip eden serbest meslek erbabı olup, YGM ise antrepolara ilişkin tüm işlemler ile Bakanlıkça belirlenen diğer işlemlere ilişkin inceleme ve araştırma yaparak tespit ettiği duruma ilişkin rapor tanzim eden serbest meslek sahibi kişidir.",
  },
];

export const about = [
  "YGM uygulamasının başladığı 2008 yılından itibaren faaliyetine devam etmekte olan Şirketimiz, isim ve statü değiştirerek Anonim Şirket statüsünde, Ticaret Bakanlığı tarafından belirlenen görevleri ifa etmektedir.",
  "Şirketimiz gerek altyapı ve gerekse bilgi ve iletişim teknolojileri açısından tam donanımlı olup, Şube ve ofisleri arasında online bağlantıları mevcuttur.",
  "Şirketimiz teknolojik alt yapısı ve uzman kadrosuyla İstanbul, Kocaeli, Bursa, Balıkesir, Manisa ve İzmir bölgelerinde hizmet vermektedir.",
  "Şirketimiz Yetkilendirilmiş Gümrük Müşavirleri, gümrük teşkilatında görev yapmış bürokratlar ve uzun yıllar kurumsal firmalarda hizmet vermiş gümrük müşavirlerinden oluşmaktadır.",
  "Şirket personelimizin tamamı üniversite mezunu olup, Bakanlık tarafından açılan sınavı kazanarak belge almaya hak kazanmış Gümrük Müşavir Yardımcılarından oluşmaktadır.",
  "Şirket merkezimiz İstanbul’da olup, Bursa’da Şube Müdürlüğü, İzmir’de ise ofis olarak hizmet vermekteyiz.",
  "Kamu adına hizmet vermenin bilincinde olarak gerçekleştirilen iş ve işlemlerin gümrük mevzuatına uygun olmasının yanısıra, müşterilerimizin talep ve menfaatleri de gözetilerek çözüm odaklı, hızlı ve kaliteli hizmet sunulması temel felsefemizdir.",
];

export const aboutHomeSummary =
  "2008 yılından bu yana Anonim Şirket statüsünde faaliyet gösteren ORTUNÇ YGM; tam donanımlı teknolojik altyapısı, gümrük teşkilatı ve kurumsal firmalarda deneyim kazanmış uzman kadrosuyla İstanbul, Kocaeli, Bursa, Balıkesir, Manisa ve İzmir bölgelerinde hizmet vermektedir. Merkezimiz İstanbul’da, Bursa’da şubemiz ve İzmir’de ofisimiz bulunmaktadır. Kamu adına yürüttüğümüz tespit işlemlerinde mevzuata uygunluk ile müşteri menfaatini birlikte gözeten çözüm odaklı yaklaşım temel felsefemizdir.";

export const contact = {
  phone: "+90 216 317 60 20",
  phoneHref: "tel:02163176020",
  fax: "+90 216 317 11 33",
  faxHref: "tel:02163171133",
  email: "info@ortunc.com.tr",
  addresses: [
    {
      label: "Merkez",
      value:
        "Fetih Mah. Tahralı Sk. Kavakyeli İş Merkezi A Blok No:7 / 14 Ataşehir / İSTANBUL",
      mapEmbedUrl:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3011.0897511050966!2d29.07331711566177!3d41.00140872779589!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cacf5b9b964299%3A0x3552ddc9bf25ea4a!2zT1JUVU7DhyBZRVRLxLBMRU5ExLBSxLBMTcSwxZ4gR8OcTVLDnEsgTcOcxZ5BVsSwUkzEsMSexLAgQS7Fni4!5e0!3m2!1str!2str!4v1646393249527!5m2!1str!2str",
    },
    {
      label: "Şube",
      value:
        "Bağlarbaşı Mh. 1. Eda Sk. Fevzi Bey İş Merkezi No: 4 / 1 Osmangazi / BURSA",
      mapEmbedUrl:
        "https://maps.google.com/maps?hl=tr&q=Ortun%C3%A7+Yetkilendirilmi%C5%9F+G%C3%BCmruk+M%C3%BC%C5%9Favirli%C4%9Fi+Bursa&z=16&output=embed",
    },
  ],
};

export const legalNotice = [
  "Bu sitede yer alan ve bu site üzerinden erişilen bilgiler (“Site”), Sitenin sahibi (“Ortunç Yetkilendirilmiş Gümrük Müşavirliği A.Ş.”) olarak ana sayfa üzerinde belirtilen Ortunç Yetkilendirilmiş Gümrük Müşavirliği kuruluşu tarafından genel rehberlik amacıyla sağlanmaktadır ve kullanıcılara genel bilgiler sunmaya yöneliktir.",
  "Ortunç Yetkilendirilmiş Gümrük Müşavirliği, elektronik iletişim süreçlerinin doğası gereği, sitenin sürekliliğini, gecikmesiz, hatasız, eksiksiz veya virüslerden arındırılmış hizmet vereceğini garanti veya taahhüt etmemektedir. Bu nedenle bilgiler, açıkça veya ima yoluyla hiçbir şekilde doğru, güncel veya tam olduğu yönünde bir garanti içermeksizin, oldukları gibi sunulmaktadır. Ortunç Yetkilendirilmiş Gümrük Müşavirliği, ilgili ortakları, idari yöneticileri, başkanları veya çalışanları bu Sitenin kullanımı, herhangi bir biçimde kopyalanması, görüntülenmesi veya başka bir şekilde kullanımından ortaya çıkan doğrudan, dolaylı, kazara, özel, örnek niteliğindeki, cezalandırıcı, dolaylı veya diğer zararlardan hiçbir şekilde sorumlu olmayacaktır.",
  "Bu site üzerinde yer alan içeriğin telif hakkıyla korunması ve tescilli olması sebebiyle, Site üzerindeki tüm materyallerin yetkisiz kullanımı, telif hakkı, ticari marka yasaları ve diğer yasaları ihlal edebilir. Kullanıcıların aşağıdaki şartlarda içeriği basmaları veya dağıtmaları mümkündür (örneğin, bir sosyal ağ üzerinden bağlantı yoluyla):",
  "İçeriğin ticari olmayan şahsi amaçlarla kullanılması",
  "Tüm telif hakkı, tescilli marka ve benzeri diğer ibarelerin korunması",
  "Söz konusu içeriğin açıkça ya da ima yoluyla Ortunç Yetkilendirilmiş Gümrük Müşavirliği tarafından hazırlanan bağlayıcı bir beyanname olarak kullanılmaması veya bir işletme ya da onun ürün ve hizmetleri hakkında onay veya destek verilmesi anlamına gelecek şekilde kullanılmaması",
  "Bu site üzerinde yer alan materyaller, içerik veya materyal sağlayıcının (üçüncü taraf bağlantıları dâhil) gerekli ve açık yazılı izni olmaksızın değiştirilemez, yeniden üretilemez, halka açık biçimde görüntülenemez, dağıtılamaz veya hiçbir kamusal veya ticari amaçla kullanılamaz. Ortunç Yetkilendirilmiş Gümrük Müşavirliği, bir kullanıcının Ortunç Yetkilendirilmiş Gümrük Müşavirliği tarafından tavsiye edilen bu açık yazılı izni almamasından kaynaklanan hiçbir risk, sorumluluk veya yükümlülüğü üstlenmemektedir.",
  "Ortunç Yetkilendirilmiş Gümrük Müşavirliği A.Ş. adı, logosu tescilli markadır. Bu markanın kullanımı, Ortunç Yetkilendirilmiş Gümrük Müşavirliği firmasının açık iznini ve bir lisans anlaşmasını gerektirir. Ortunç Yetkilendirilmiş Gümrük Müşavirliğinin diğer tüm ticari markalar portföyünün yetkisiz kullanımı, yasaların izin verdiği tüm kapsam dâhilinde dava edilecektir. Bu yazılı onayı talep etmek için, Webmaster ile irtibata geçin veya “Bize Ulaşın” özelliğini kullanın.",
  "Üçüncü taraf bağlantıları, kullanıcılara kolaylık sağlaması amacıyla sunulmaktadır. Ortunç Yetkilendirilmiş Gümrük Müşavirliği, bu siteleri veya içeriklerini denetlemez ve bunlardan sorumlu değildir. Ortunç Yetkilendirilmiş Gümrük Müşavirliği kendi itibarını ve ticari markasını korumak zorundadır ve Ortunç Yetkilendirilmiş Gümrük Müşavirliği web sitemize yönelik herhangi bir bağlantının kaldırılmasını talep etme hakkını saklı tutar.",
  "Aşağıdaki Web bağlantısı etkinlikleri, Ortunç Yetkilendirilmiş Gümrük Müşavirliği tarafından açıkça yasaklanmış olup, ticari marka ve tescilli marka ihlali sorunları teşkil edebilir:",
  "- Logomuzun yetkisiz kullanımını içeren bağlantılar.",
  "- Kuruluşun tescil hakkını, yasal sorumluluk reddini veya çevrimiçi ilkelerini içeren sayfaların URL'sini gizleyen ve/veya atlayan bir bağlantı biçimi.",
];
