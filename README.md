# Sigorta Poliçe Yöneticisi

Modern bir masaüstü uygulaması ile sigorta poliçelerinizi kolayca yönetin, takip edin ve raporlayın.

## Özellikler

### 📋 Temel İşlevler
- ✅ Poliçe ekleme, düzenleme ve silme
- 🔍 Ad, soyad, telefon, poliçe türü ile arama
- 📊 Tüm poliçeleri tablo halinde görüntüleme
- 🗂️ Sütunlara göre sıralama

### ⏰ Süre Takibi
- 📅 Yaklaşan poliçe bitiş tarihlerini görüntüleme
- 🔔 Masaüstü bildirimleri (7, 30 gün önceden uyarı)
- 🎨 Renk kodlu durum göstergeleri (yeşil, sarı, kırmızı)

### 📤 Dışa Aktarma
- 📊 Excel (.xlsx) formatında dışa aktarma
- 📄 PDF formatında dışa aktarma
- 🔎 Filtrelenmiş sonuçları dışa aktarma

### 💾 Yedekleme
- 🔄 Otomatik yedekleme (uygulama kapatıldığında)
- 📦 Manuel yedekleme
- ⚡ Yedekten geri yükleme

## Kurulum

### Gereksinimler
- Node.js (v16 veya üzeri)
- npm

### Adımlar

1. Bağımlılıkları yükleyin:
```bash
npm install
```

## Kullanım

### Geliştirme Modu

Uygulamayı geliştirme modunda çalıştırmak için:

```bash
npm run dev
```

Bu komut hem Vite dev server'ını hem de Electron penceresini başlatır.

### Production Build

Uygulamayı Windows için derlemek:

```bash
npm run build:windows
```

Derlenmiş uygulama `dist/` klasöründe oluşturulur.

## Proje Yapısı

```
policy-manager/
├── src/
│   ├── main/               # Electron ana süreç
│   │   ├── index.js        # Ana giriş noktası
│   │   ├── database.js     # JSON dosya işlemleri
│   │   ├── notifications.js # Bildirim yönetimi
│   │   ├── export.js       # Excel/PDF dışa aktarma
│   │   └── preload.js      # IPC köprüsü
│   ├── renderer/           # React UI
│   │   ├── App.jsx         # Ana uygulama
│   │   ├── components/     # UI bileşenleri
│   │   ├── pages/          # Sayfa bileşenleri
│   │   └── utils/          # Yardımcı fonksiyonlar
│   └── data/
│       └── insurances.json # Veri dosyası
├── old/                    # Eski versiyon yedekleri
└── package.json
```

## Teknolojiler

- **Electron** - Masaüstü uygulama framework'ü
- **React** - UI framework'ü
- **Vite** - Build aracı
- **Tailwind CSS** - Stil framework'ü
- **ExcelJS** - Excel dosya oluşturma
- **PDFKit** - PDF dosya oluşturma
- **date-fns** - Tarih işlemleri

## Veri Saklama

Uygulama tüm verileri **tek bir JSON dosyasında** saklar (`src/data/insurances.json`). Bu yaklaşım:
- ✅ Native bağımlılık gerektirmez
- ✅ Platform bağımsızdır
- ✅ Kolay yedekleme ve taşıma
- ✅ 100-1000 kayıt için yeterli performans
- ✅ Dosyayı manuel olarak düzenleyebilme

## Bildirimler

Uygulama arka planda her 6 saatte bir poliçeleri kontrol eder ve yaklaşan bitiş tarihleri için Windows bildirimleri gönderir. Bildirim zamanlaması Ayarlar sayfasından özelleştirilebilir.

## Yedekleme

Verilerinizin güvenliği için düzenli yedekleme önerilir:
1. Ayarlar sayfasından "Yedek Al" butonuna tıklayın
2. Yedek dosyayı güvenli bir konuma kaydedin
3. Gerektiğinde "Yedekten Geri Yükle" ile geri yükleyin

**Not:** Yedekleme dosyaları tarih damgalıdır (örn: `insurances_backup_2025-11-10T12-00-00.json`)

## Sorun Giderme

### Uygulama açılmıyor
- Node.js ve npm'in kurulu olduğundan emin olun
- `npm install` komutunu çalıştırın
- `npm run dev` ile hata mesajlarını kontrol edin

### Bildirimler çalışmıyor
- Windows bildirim ayarlarını kontrol edin
- Ayarlar sayfasında "Bildirimleri Test Et" butonuna tıklayın

### Veriler kayboldu
- `src/data/` klasöründe yedek dosyaları arayın
- Yedekten geri yükleme yapın

## Lisans

Bu proje özel kullanım içindir.
