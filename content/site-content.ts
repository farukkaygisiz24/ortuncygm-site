import { isMevzuatGuncellemeleriEnabled } from "@/lib/featureFlags";

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
    "Yetkilendirilmiş Gümrük Müşavirliği hizmetlerimizde; mevzuata uygun, hızlı ve şeffaf denetim anlayışıyla işletmelerinizin dış ticaret süreçlerine değer katıyoruz.",
};

// Figures pulled directly from the "about" copy below (founding year, service
// regions, office count) — not invented data.
export const stats = [
  { value: "2008", label: "Kuruluş yılı" },
  { value: "Türkiye Geneli", label: "Hizmet ağı" },
  { value: "3", label: "Stratejik Lokasyon" },
  { value: "6", label: "Yerleşik Operasyon Bölgesi" },
];

export type ServiceCategoryKey = "gumruk" | "danismanlik";

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
    title: "YGM Hizmetleri",
    href: "/hizmetler/gumruk-hizmetleri",
    description:
      "Antrepo, onaylanmış kişi statüsü, dahilde işleme, geçici ithalat ve menşe kontrolü başta olmak üzere YGM kapsamındaki tespit ve raporlama hizmetlerini mevzuata uygun şekilde sunuyoruz.",
  },
  {
    key: "danismanlik",
    slug: "danismanlik-hizmetleri",
    title: "Danışmanlık Hizmetleri",
    href: "/hizmetler/danismanlik-hizmetleri",
    description:
      "YYS denetim ve raporlama, yetkilendirilmiş yükümlü statüsü danışmanlığı ile sonradan kontrol süreçlerinde uzman destek sunuyoruz.",
  },
];

export function getServiceCategory(slug: string): ServiceCategory | undefined {
  return serviceCategories.find((category) => category.slug === slug);
}

export { services, getServicesByCategory, homepageCarouselServices, getServiceHref, getYgmFeaturedServices, getYgmFeaturedHref } from "@/content/services";
export type { ServiceItem } from "@/content/services";

import { getServiceHref, getServicesByCategory, getYgmFeaturedServices, getYgmFeaturedHref } from "@/content/services";

const CATEGORY_HREFS = {
  gumruk: "/hizmetler/gumruk-hizmetleri",
  danismanlik: "/hizmetler/danismanlik-hizmetleri",
} as const;

/** Header mega menü — UGM tarzı gruplu hizmet listesi */
export function buildServicesNavGroups(): NavMegaGroup[] {
  const gumrukHref = CATEGORY_HREFS.gumruk;
  const danismanlikHref = CATEGORY_HREFS.danismanlik;

  const ygmTespit = getYgmFeaturedServices();

  const toLinks = (items: ReturnType<typeof getServicesByCategory>, categoryHref: string) =>
    items.map((s) => ({
      label: s.title,
      href: getServiceHref(categoryHref, s.slug),
    }));

  const toFeaturedLinks = (items: ReturnType<typeof getYgmFeaturedServices>) =>
    items.map((s) => ({
      label: s.title,
      href: getYgmFeaturedHref(s),
    }));

  return [
    {
      title: serviceCategories.find((c) => c.key === "gumruk")!.title,
      href: gumrukHref,
      links: toFeaturedLinks(ygmTespit),
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
  isMevzuatGuncellemeleriEnabled()
    ? {
        label: "Mevzuat",
        children: [
          { label: "Mevzuat", href: "/mevzuat" },
          { label: "Mevzuat Güncellemeleri", href: "/mevzuat-guncellemeleri" },
        ],
      }
    : { label: "Mevzuat", href: "/mevzuat" },
  { label: "İletişim", href: "/iletisim" },
];

export const headerNav = nav.filter((item) => !("href" in item) || item.href !== "/iletisim");

export const servicesSlogan =
  "2008 yılından bu yana, uzman YGM kadromuzla antrepo, rejim ve statü tespit süreçlerinizi gümrük mevzuatına tam uyumlu, hızlı ve şeffaf bir şekilde yönetiyoruz. Bağımsız denetim yaklaşımımızla, riskleri minimize ederek dış ticaret işlemlerinize kurumsal güvence katıyoruz.";

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
  "ORTUNÇ Yetkilendirilmiş Gümrük Müşavirliği A.Ş., Yetkilendirilmiş Gümrük Müşavirliği uygulamasının hayata geçirildiği 2008 yılından bu yana faaliyetlerini kesintisiz olarak sürdürmektedir. Anonim şirket yapısıyla faaliyet gösteren şirketimiz, Ticaret Bakanlığı tarafından verilen görev ve yetkileri 4458 sayılı Gümrük Kanunu ve ilgili mevzuat hükümleri doğrultusunda bağımsızlık, tarafsızlık ve güvenilirlik ilkeleri çerçevesinde yerine getirmektedir.",
];

export type AboutSubsection = {
  title: string;
  paragraphs: string[];
};

export type AboutValue = {
  title: string;
  description: string;
};

export const aboutPage = {
  intro: about,
  subsections: [
    {
      title: "Güçlü Organizasyon Yapısı ve Yaygın Hizmet Ağı",
      paragraphs: [
        "Merkez ofisimiz İstanbul'da, Bursa Şube Müdürlüğümüz ve İzmir Ofisimiz ile birlikte faaliyet göstermekteyiz. İstanbul, Kocaeli, Bursa, Balıkesir, Manisa ve İzmir başta olmak üzere hizmet verdiğimiz bölgelerde Yetkilendirilmiş Gümrük Müşavirliği hizmetlerini etkin ve koordineli bir organizasyon yapısıyla sunuyoruz.",
        "Gelişmiş teknolojik altyapımız ve entegre bilgi sistemlerimiz sayesinde merkez, şube ve ofislerimiz arasında kesintisiz bilgi akışı sağlıyor; denetim, tespit ve raporlama faaliyetlerini mevzuata uygun, güvenilir ve etkin bir anlayışla yürütüyoruz.",
      ],
    },
    {
      title: "Uzman ve Deneyimli Kadro",
      paragraphs: [
        "Kadromuz; Yetkilendirilmiş Gümrük Müşavirleri, gümrük idaresinde görev yapmış deneyimli yöneticiler, dış ticaret ve gümrük uygulamalarında uzun yıllar görev almış gümrük müşavirleri ile alanında uzman teknik personelden oluşmaktadır.",
        "Operasyon ekibimiz ise üniversite mezunu, Ticaret Bakanlığı tarafından düzenlenen sınavlarda başarılı olarak Gümrük Müşavir Yardımcısı belgesi almaya hak kazanmış uzman personelden oluşmaktadır. Mesleki gelişimi esas alan anlayışımız doğrultusunda ekibimizin bilgi ve yetkinliğini sürekli geliştirmeye önem veriyoruz.",
      ],
    },
    {
      title: "Kurumsal Yaklaşımımız",
      paragraphs: [
        "Yetkilendirilmiş Gümrük Müşavirliği, kamu adına yürütülen önemli bir denetim ve tespit faaliyetidir. Bu sorumluluğun bilinciyle tüm hizmetlerimizi; bağımsızlık, tarafsızlık, şeffaflık, güvenilirlik ve mevzuata tam uyum ilkeleri doğrultusunda yürütüyoruz.",
        "Amacımız yalnızca yasal yükümlülüklerin yerine getirilmesini sağlamak değil; dış ticaret süreçlerinde doğruluk, sürdürülebilirlik ve güven esasına dayalı bir hizmet anlayışıyla kamu otoritesi ile yükümlüler arasındaki denetim ve raporlama süreçlerine değer katmaktır.",
        "Kurumsal yapımız, uzman insan kaynağımız ve güçlü teknolojik altyapımızla; güvenilir, şeffaf ve sürdürülebilir Yetkilendirilmiş Gümrük Müşavirliği hizmeti sunmaya devam ediyoruz.",
      ],
    },
  ] satisfies AboutSubsection[],
  mission: {
    title: "Misyonumuz",
    text: "Ticaret Bakanlığı tarafından verilen görev ve yetkiler kapsamında, gümrük mevzuatına tam uyum esasına bağlı kalarak bağımsız, tarafsız ve güvenilir denetim, tespit ve raporlama hizmetleri sunmak; uzman kadromuz ve güçlü teknolojik altyapımızla dış ticaret süreçlerinin güvenli, şeffaf ve sürdürülebilir şekilde yürütülmesine katkı sağlamaktır.",
  },
  vision: {
    title: "Vizyonumuz",
    text: "Yetkilendirilmiş Gümrük Müşavirliği alanında; etik değerlere bağlılığı, uzman insan kaynağı, güçlü kurumsal yapısı ve teknolojik altyapısıyla güven duyulan, tercih edilen ve örnek gösterilen kuruluşlar arasında yer almaktır.",
  },
  values: {
    title: "Temel Değerlerimiz",
    items: [
      {
        title: "Bağımsızlık",
        description:
          "Denetim ve tespit faaliyetlerini objektif, tarafsız ve mesleki etik kurallara bağlı şekilde yürütürüz.",
      },
      {
        title: "Tarafsızlık",
        description: "Tüm süreçlerde mevzuata, etik değerlere ve kamu yararına uygun hareket ederiz.",
      },
      {
        title: "Güvenilirlik",
        description: "Doğru, eksiksiz ve zamanında raporlama anlayışıyla hizmet sunarız.",
      },
      {
        title: "Mevzuata Uyum",
        description:
          "Faaliyetlerimizi 4458 sayılı Gümrük Kanunu ve ilgili tüm yasal düzenlemeler doğrultusunda gerçekleştiririz.",
      },
      {
        title: "Uzmanlık",
        description:
          "Alanında deneyimli, sürekli gelişimi benimseyen uzman kadromuzla yüksek standartlarda hizmet sunarız.",
      },
      {
        title: "Teknolojik Yetkinlik",
        description:
          "Çağdaş bilgi teknolojileri ve dijital altyapımızla süreçlerimizi güvenli, verimli ve etkin şekilde yönetiriz.",
      },
      {
        title: "Şeffaflık",
        description:
          "Tüm denetim ve raporlama faaliyetlerimizi açık, izlenebilir ve hesap verebilir bir anlayışla yürütürüz.",
      },
      {
        title: "Sürekli Gelişim",
        description:
          "Değişen mevzuatı, teknolojiyi ve sektörel gelişmeleri yakından takip ederek hizmet kalitemizi sürekli geliştiririz.",
      },
    ] satisfies AboutValue[],
  },
};

export const aboutHomeSummary =
  "ORTUNÇ Yetkilendirilmiş Gümrük Müşavirliği A.Ş., 2008 yılından bu yana 4458 sayılı Gümrük Kanunu ve ilgili mevzuat çerçevesinde Yetkilendirilmiş Gümrük Müşavirliği hizmetleri sunmaktadır. Bağımsızlık, tarafsızlık, şeffaflık ve mevzuata tam uyum ilkeleri doğrultusunda faaliyet gösteren şirketimiz; güçlü teknolojik altyapısı, deneyimli kadrosu ve kurumsal yaklaşımıyla denetim, tespit ve raporlama süreçlerini güvenilir ve etkin bir anlayışla yürütmektedir. İstanbul merkez ofisimiz, Bursa Şube Müdürlüğümüz ve İzmir Ofisimiz ile Türkiye genelinde hizmet sunarak dış ticaret süreçlerinin güvenilir ve mevzuata uygun şekilde yürütülmesine katkı sağlamaktayız.";

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
