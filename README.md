# Ortunç Gümrük Müşavirliği - Yeni Kurumsal Web Sitesi

## Proje Özeti
ORTUNÇ Yetkilendirilmiş Gümrük Müşavirliği A.Ş. için mevcut `ortunc.com.tr` sitesinin yerine geçecek, modern, statik ve taşınabilir bir kurumsal web sitesi geliştirme projesi.

## Amaç
- Mevcut siteyi teknik ve tasarım olarak yenilemek
- Tek bir sunucuya (VDS) bağımlı olmayan, taşınabilir bir yapı kurmak
- Modern, hızlı ve SEO uyumlu bir statik site oluşturmak

## Teknoloji Seçimleri

| Katman | Teknoloji |
|---|---|
| Framework | Next.js (App Router) |
| Render Modu | Static Export (`output: 'export'`) |
| Dil | TypeScript |
| Stil | Tailwind CSS (önerilir, teyit bekleniyor) |
| Hosting | Herhangi bir statik hosting / Nginx / Netlify / Cloudflare Pages |

## Neden Static Export?
- Site içeriği ağırlıklı olarak statik (kurumsal tanıtım, hizmetler, iletişim)
- Belirli bir sunucuya bağımlı kalınmıyor — `next build` çıktısı (`/out` klasörü) herhangi bir web sunucusuna veya statik hosting servisine taşınabilir
- Form/dinamik özellik gerekirse üçüncü parti servisler (Formspree, Resend API vb.) ile entegre edilebilir; sunucu tarafı kod gerekmez

## Proje Yapısı (Planlanan)
```
ortunc-site-main/
├── app/
│   ├── page.tsx              → Anasayfa
│   ├── hakkimizda/page.tsx   → Hakkımızda
│   ├── hizmetler/page.tsx    → Hizmetler
│   └── iletisim/page.tsx     → İletişim
├── components/
├── public/
│   └── images/
├── next.config.js
├── AGENDS.md                 → Proje gündemi / yapılacaklar listesi
└── README.md                 → Bu dosya
```

## Referans Kaynak
Mevcut sitenin (`ortunc.com.tr`) sahibi/yetkilisi olan ekip tarafından yürütülen bir yenileme projesidir. Mevcut site içerik ve yapı referansı olarak kullanılacak, ancak tasarım ve kod sıfırdan, modern standartlara uygun şekilde yeniden kurgulanacaktır (birebir kopyalama yapılmayacaktır).

## Durum
🟡 Planlama aşaması — içerik ve tasarım detayları netleştiriliyor.

## Sonraki Adımlar
Bkz. `AGENDS.md`
