# AGENDS.md - Proje Gündemi & Görev Listesi

## 1. Netleştirilmesi Gerekenler (Onay Bekleyen)
- [ ] Sayfa listesi kesinleştirilecek (öneri: Anasayfa, Hakkımızda, Hizmetler, İletişim — ihtiyaca göre "Referanslar", "Blog/Duyurular" eklenebilir)
- [ ] İçerik (metinler) hazır mı, yoksa birlikte mi yazılacak?
- [ ] Tasarım referansı / marka renkleri / logo var mı?
- [ ] Tailwind CSS kullanımı onaylanıyor mu, yoksa başka bir stil çözümü mü tercih ediliyor?
- [ ] İletişim formu olacak mı? Olacaksa hangi servis üzerinden gönderilecek (e-posta API, form servisi vb.)?
- [ ] Çoklu dil desteği gerekiyor mu (TR/EN)?

## 2. Kurulum Aşaması
- [ ] `create-next-app` ile proje iskeletinin oluşturulması (TypeScript + App Router)
- [ ] `next.config.js` içinde `output: 'export'` ayarının yapılması
- [ ] Temel klasör yapısının kurulması (`app/`, `components/`, `public/`)
- [ ] Git deposu oluşturulması (`.gitignore`, ilk commit)

## 3. Tasarım & Geliştirme
- [ ] Header / Footer / Navigasyon bileşenlerinin oluşturulması
- [ ] Anasayfa tasarımı ve geliştirmesi
- [ ] Hakkımızda sayfası
- [ ] Hizmetler sayfası (gümrük müşavirliği hizmetleri listesi)
- [ ] İletişim sayfası (harita, adres, telefon, form)
- [ ] Responsive (mobil uyumlu) tasarım kontrolü
- [ ] SEO temel ayarları (meta tag, title, description, sitemap.xml, robots.txt)

## 4. İçerik Aktarımı
- [ ] Mevcut sitedeki (ortunc.com.tr) metin içeriklerinin gözden geçirilip yeni siteye uyarlanması
- [ ] Görsellerin (logo, fotoğraflar) optimize edilip `public/images/` altına yerleştirilmesi
- [ ] Telefon, adres, e-posta gibi iletişim bilgilerinin doğrulanması

## 5. Test & Optimizasyon
- [ ] `next build` ile statik export testi
- [ ] Lighthouse performans/SEO skorlarının kontrolü
- [ ] Farklı tarayıcı ve cihazlarda görsel test
- [ ] Kırık link kontrolü

## 6. Deploy
- [ ] Hedef hosting ortamının netleştirilmesi (Nginx sunucu / Netlify / Cloudflare Pages vb.)
- [ ] `/out` klasörünün ilgili sunucuya aktarılması
- [ ] Domain/DNS yönlendirmesinin yapılması
- [ ] SSL sertifikası kontrolü

## Notlar
- Bu proje statik export tabanlı olacağı için sunucu tarafı (backend/API) ihtiyacı minimumda tutulacak.
- Taşınabilirlik önceliği: build çıktısı herhangi bir ortama kolayca deploy edilebilecek şekilde tasarlanacak.
