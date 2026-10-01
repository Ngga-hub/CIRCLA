# CIRCLA — Circular Economy and Sharing

Platform web **P2P Rental & Ekonomi Sirkular** berbasis *static site*.
Dibangun dengan **HTML5 + CSS3 + JavaScript DOM murni (vanilla JS)** — tanpa framework,
tanpa build step, tanpa backend.

> **Rental. Share. Reuse. Sustain.**
> Sewa Barang, Kurangi Limbah, Maksimalkan Manfaat.
> *Why buy it when you can use it?*

---

## 1. Struktur Proyek

```
circla/
├── index.html          # Halaman 1 — Home (Beranda)
├── katalog.html        # Halaman 2 — Katalog Sewa (6 tab kategori + modal reservasi)
├── mitra.html          # Halaman 3 — Layanan Mitra (Lender Portal + formulir)
├── about.html          # Halaman 4 — About Us (profil 4 founder)
├── css/
│   └── style.css       # Seluruh styling (tidak ada CSS inline di HTML)
├── js/
│   ├── data.js         # Sumber data tunggal: 6 kategori + 39 produk + konstanta brand
│   └── main.js         # Navigasi, render katalog, filter/tab, modal, form, animasi
└── asset/
    ├── about us.jpeg   # Foto tim untuk halaman About
    └── img/
        ├── logo.svg            # Logo daur ulang 3 panah
        ├── kezya.jpeg          # Foto co-founder (kezya, zia, rafly, angga)
        ├── zia.jpeg
        ├── rafly.jpeg
        ├── angga.jpeg
        ├── produk/             # Foto produk (opsional, lihat bagian 4)
        ├── cat-outdoor.svg     # Ilustrasi kategori (6 file)
        ├── cat-photography.svg
        ├── cat-event.svg
        ├── cat-fashion.svg
        ├── cat-tools.svg
        └── cat-entertainment.svg
```

### Cara menjalankan

Tidak perlu instalasi. Cukup:

```bash
# buka langsung
start index.html          # Windows
# atau jalankan server statis sederhana
python -m http.server 8080
```

> Catatan: sinkronisasi URL katalog (`?cat=…&q=…`) otomatis di-nonaktifkan saat
> situs dibuka lewat protokol `file://`. Semua fitur lain tetap berjalan normal.

---

## 2. Identitas Merek

| Peran | Warna |
| --- | --- |
| Latar belakang | `#F5F0EB` / `#F9F7F2` (krem hangat) |
| Hijau zaitun pekat (utama) | `#2D3E2F` |
| Sage (sekunder) | `#7C8D74` |
| Taupe / emas hangat | `#C2A67E` |
| Eco recycle green (ikon daur ulang) | `#5E9E44` |

Tipografi: **Playfair Display** (judul, serif) + **Montserrat** (teks isi, sans-serif).

Seluruh token warna ada di blok `:root` pada `css/style.css` — ubah di satu tempat
untuk mengganti tema.

---

## 3. Alur Katalog (Client-side)

- Tab kategori dirender oleh `js/main.js` dari `window.CIRCLA.CATEGORIES`.
- Kartu produk dirender dari `window.CIRCLA.PRODUCTS` (39 barang, 6 kategori).
- Pencarian menyaring **nama + merek + kota**; tersedia pengurutan harga & stok.
- Klik **“Sewa Sekarang”** membuka modal reservasi:
  nama, nomor WhatsApp, pilihan unit & merek, tanggal mulai/selesai,
  metode pengambilan (COD / Ekspedisi Instan), unggah KTP (simulasi KYC),
  dan rincian tagihan otomatis (**biaya sewa + deposit escrow**).

> **Penting:** ini adalah **demo frontend-only**. Tidak ada pembayaran, verifikasi KYC,
> maupun penyimpanan data ke server. Kolom KTP dan pembayaran diberi label simulasi.

---

## 4. Menambahkan Foto Produk

Setiap kartu produk mencari berkas foto di `asset/img/produk/<slug>.jpg`.
Selama berkas belum ada, kartu otomatis memakai *placeholder* flat design
(warna kategori + ikon emoji produk) — jadi tidak pernah muncul gambar rusak.

Cukup letakkan foto dengan nama berikut di folder `asset/img/produk/`:

| Produk | Merek | Nama berkas |
| --- | --- | --- |
| Tenda Dome Quechua Arpenaz 3P | Quechua | `tenda-dome-quechua-arpenaz-3p.jpg` |
| Sleeping Bag Bulu Angsa Ultralight | Consina | `sleeping-bag-bulu-angsa-ultralight.jpg` |
| Carrier Ransel 60L Rhinos Series | Eiger | `carrier-ransel-60l-rhinos-series.jpg` |
| Matras Angin Otomatis + Pompa | Naturehike | `matras-angin-otomatis-pompa.jpg` |
| Kursi Lipat Camping Portable | Dhaulagiri | `kursi-lipat-camping-portable.jpg` |
| Kompor Portable Mini & Cooking Set | Kovar | `kompor-portable-mini-cooking-set.jpg` |
| Koper Hardcase 24 Inch TSA Lock | Samsonite | `koper-hardcase-24-inch-tsa-lock.jpg` |
| Travel Equipment Set (Adapter & Scale) | Baseus | `travel-equipment-set-adapter-scale.jpg` |
| Kamera Mirrorless Sony A6400 Kit | Sony | `kamera-mirrorless-sony-a6400-kit.jpg` |
| Lensa Portrait Sony FE 50mm f/1.8 | Sony | `lensa-portrait-sony-fe-50mm-f-1-8.jpg` |
| Tripod Carbon Fiber Travel Pro | Manfrotto | `tripod-carbon-fiber-travel-pro.jpg` |
| Gimbal Stabilizer RS3 Mini | DJI | `gimbal-stabilizer-rs3-mini.jpg` |
| Mic Wireless Dual Channel Mic 2 | DJI | `mic-wireless-dual-channel-mic-2.jpg` |
| Studio Lighting Godox SL60W + Softbox | Godox | `studio-lighting-godox-sl60w-softbox.jpg` |
| Action Camera Hero 11 Black 4K | GoPro | `action-camera-hero-11-black-4k.jpg` |
| Projector Full HD 4000 Lumens | Epson | `projector-full-hd-4000-lumens.jpg` |
| Portable Speaker 12" + 2 Wireless Mic | Huper | `portable-speaker-12-2-wireless-mic.jpg` |
| Microphone Dynamic Vocal Wireless | Shure | `microphone-dynamic-vocal-wireless.jpg` |
| Lighting Party RGB Laser & Par LED | Beam | `lighting-party-rgb-laser-par-led.jpg` |
| Backdrop Stand Portable 3x3 Meter | Midio | `backdrop-stand-portable-3x3-meter.jpg` |
| Dekorasi Rustic Event Kit | Circla Deco | `dekorasi-rustic-event-kit.jpg` |
| Perlengkapan Pesta & Dispenser Juice Kaca | Kedaung | `perlengkapan-pesta-dispenser-juice-kaca.jpg` |
| Dress Pesta Evening Gown | Mango / Zara | `dress-pesta-evening-gown.jpg` |
| Jas Formal Pria Slim Fit Wool Blend | The Executive | `jas-formal-pria-slim-fit-wool-blend.jpg` |
| Kebaya Modern Brokat Wisuda | Kebaya Craft | `kebaya-modern-brokat-wisuda.jpg` |
| Shoulder Bag Leather Luxury | Charles & Keith | `shoulder-bag-leather-luxury.jpg` |
| Sepatu Pantofel / Heels Formal | Pedro | `sepatu-pantofel-heels-formal.jpg` |
| Set Aksesori Kalung & Gelang Pearl | Glamour | `set-aksesori-kalung-gelang-pearl.jpg` |
| Bor Listrik Cordless Hammer Drill 12V | Makita | `bor-listrik-cordless-hammer-drill-12v.jpg` |
| Vacuum Cleaner Wet & Dry 15L | Kärcher | `vacuum-cleaner-wet-dry-15l.jpg` |
| Carpet Extractor Cleaner Portable | Bissell | `carpet-extractor-cleaner-portable.jpg` |
| Tangga Lipat Teleskopik 3.8 Meter | Krisbow | `tangga-lipat-teleskopik-3-8-meter.jpg` |
| Mesin Cuci Portable Mini 4.5 Kg | Mito | `mesin-cuci-portable-mini-4-5-kg.jpg` |
| Kotak Peralatan DIY Set Lengkap 100 Pcs | Bosch | `kotak-peralatan-diy-set-lengkap-100-pcs.jpg` |
| PlayStation 5 Console + 2 DualSense | Sony | `playstation-5-console-2-dualsense.jpg` |
| VR Headset Quest 2 128GB | Meta | `vr-headset-quest-2-128gb.jpg` |
| Gaming Steering Wheel & Pedal G29 | Logitech | `gaming-steering-wheel-pedal-g29.jpg` |
| Board Games Collection (Catan, Splendor, Uno) | Asmodee | `board-games-collection-catan-splendor-uno.jpg` |
| Portable Karaoke Speaker Set + Bluetooth Mic | Advance | `portable-karaoke-speaker-set-bluetooth-mic.jpg` |

**Foto tim** (halaman About) diletakkan langsung di `asset/img/`:

```
kezya.jpeg · zia.jpeg · rafly.jpeg · angga.jpeg
```

Format ideal: potret vertikal (rasio 4:5), mis. 800×1000 px, ukuran < 300 KB.
Jika sebuah berkas belum ada, kartu tim otomatis menampilkan monogram inisial.

---

## 5. Menambah / Mengubah Barang

Semua inventaris ada di `js/data.js`, pada array `RAW`:

```js
["Nama Produk", "Merek", "kategori", hargaPerHari, stok, "Satuan", "🙂"]
```

- `kategori` harus salah satu dari: `outdoor`, `photography`, `event`,
  `fashion`, `tools`, `entertainment`.
- Slug berkas foto dan `id` produk dihitung otomatis dari nama produk.
- Deposit escrow dihitung otomatis: **3× harga harian**, dibulatkan ke Rp5.000.

---

## 6. Catatan Teknis

- **Multi-halaman**, bukan single-page: navigasi antar `.html` biasa.
- **Flat design**: tanpa gradien berat, bayangan sangat lembut, aksen garis tegas.
- **Responsif**: breakpoint 1080 / 900 / 820 / 640 / 380 px, menu *hamburger*
  di bawah 900 px, grid produk menyesuaikan lebar layar.
- **Animasi ringan & soft**: `softBounce`, `floatSoft`, `fadeUp`, *scroll reveal*
  via `IntersectionObserver`. Semua dinonaktifkan otomatis ketika pengguna
  mengaktifkan `prefers-reduced-motion`.
- **Aksesibilitas**: skip-link, `aria-current`, `aria-expanded`, label form
  eksplisit, `sr-only`, fokus yang terlihat.
- **Tanpa dependensi**: hanya Google Fonts dari CDN; seluruh logika dan ilustrasi
  lokal (SVG) agar tetap ringan.

---

© 2026 CIRCLA Indonesia. All rights reserved.
