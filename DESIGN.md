# DESIGN.md — Sakuin Modern Design System & Visual Tokens

> Dokumen ini mencatat design tokens, komponen, dan konvensi visual yang **AKTIF DIGUNAKAN** di antarmuka frontend Sakuin. Seluruh tampilan dibangun dengan tema **Modern Financial Elegance** yang mengedepankan estetika bersih, keterbacaan data keuangan prima, tipografi Google Font **Poppins**, animasi halus **Framer Motion**, dan responsivitas nyata untuk perangkat Laptop, Tablet, Android, dan iPhone/iOS.

---

## 1. Design Tokens (CSS Variables)

Definisi token berada di `src/index.css` dan dikonfigurasi melalui Tailwind CSS v4 `@theme`.

### 1.1 Palet Warna Modern

| Token | Light Mode (Slate Pearl) | Dark Mode (Obsidian Navy) | Penggunaan Fungsional |
|---|---|---|---|
| `--color-bg` | `#F8FAFC` *(Slate 50)* | `#090D16` *(Deep Obsidian)* | Background utama seluruh halaman |
| `--color-surface` | `#FFFFFF` *(Pure Card)* | `#111827` *(Slate 900)* | Background card, modal, dropdown, header |
| `--color-surface-hover` | `#F1F5F9` *(Slate 100)* | `#1F293D` *(Elevated Slate)* | Hover state baris tabel dan item interaktif |
| `--color-ink` | `#0F172A` *(Slate 900)* | `#F8FAFC` *(Slate 50)* | Teks utama, judul, angka |
| `--color-ink-muted` | `#64748B` *(Slate 500)* | `#94A3B8` *(Slate 400)* | Label sekunder, tanggal, subtitle, caption |
| `--color-border` | `#E2E8F0` *(Slate 200)* | `#1E293B` *(Slate 800)* | Garis tepi elemen card dan pemisah |
| `--color-accent` | `#10B981` *(Emerald 500)* | `#10B981` *(Emerald 400)* | **Warna brand primer / Action CTA / AI Scanner** |
| `--color-accent-ink` | `#FFFFFF` | `#090D16` | Teks di atas warna aksen primer |
| `--color-accent-secondary`| `#6366F1` *(Indigo 500)* | `#818CF8` *(Indigo 400)* | Aksen sekunder analitik dan kategori |
| `--color-positive` | `#10B981` *(Emerald 500)* | `#34D399` *(Emerald 400)* | Pemasukan, saldo surplus, budget aman (<80%) |
| `--color-warning` | `#F59E0B` *(Amber 500)* | `#FBBF24` *(Amber 400)* | Budget mendekati limit (80-100%), alert akhir bulan |
| `--color-negative` | `#EF4444` *(Rose 500)* | `#F87171` *(Rose 400)* | Over budget (>100%), error, hapus data, logout |

---

## 2. Tipografi (Poppins & JetBrains Mono)

Google Fonts dimuat langsung pada `index.html`:
```html
<link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400;1,600&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet" />
```

1. **Font Utama (`font-body` & `font-sans`)**: **Poppins**
   - Karakter: Geometris, ramah, modern, keterbacaan tinggi di berbagai ukuran layar smartphone maupun laptop.
   - Digunakan untuk: Judul modul, navigasi, form label, deskripsi panduan, button, teks tabel.
2. **Font Monospace Angka (`font-mono` / `tabular-nums`)**: **JetBrains Mono**
   - Karakter: Tabular number alignment, presisi digit keuangan.
   - Digunakan untuk: Semua nilai nominal Rupiah (`Rp 1.500.000`), kalkulator perbandingan budget, dan tanggal transaksi.

---

## 3. Sistem Radius, Elevation, & Glassmorphism

- **Border Radius**:
  - Modal & Main Auth Cards: `rounded-2xl` hingga `rounded-3xl`
  - Dashboard Panels & Stat Cards: `rounded-2xl`
  - Badges, Tabs, & Filter Chips: `rounded-xl` atau `rounded-full`
  - Input Fields: `rounded-xl`
- **Elevation & Glassmorphism**:
  - Header: `.glass-header` dengan `backdrop-filter: blur(12px)`
  - Action cards & FAB: `shadow-lg shadow-emerald-500/20`
  - Modals: `backdrop-blur-xs` dengan `bg-black/50`

---

## 4. Animasi & Interaktivitas (Framer Motion)

- **Nav Tabs**: Animasi layout spring pill (`layoutId="active-nav-pill"`).
- **Stat Cards**: Stagger entrance (`delay: index * 0.1`) dengan hover lift translateY (`y: -3`).
- **Quick Add FAB**: Speed-dial menu melayang dengan rotasi plus ke silang (`rotate: 135deg`) dan animasi kemunculan opsi menu.
- **AI Scanner Laser**: Animasi scanning laser vertikal naik-turun (`animate={{ top: ["0%", "100%", "0%"] }}`) selama proses OCR.
- **Modal Dialogs**: Scale & opacity transitions (`initial={{ opacity: 0, scale: 0.95 }}`).

---

## 5. Responsivitas Multi-Device

- **Laptop / Desktop (≥ 1024px)**: Layout multi-kolom penuh, tabel transaksi tabular lengkap dengan sorting dan filtering.
- **Tablet (768px – 1023px)**: Grid responsif adaptif 2-kolom, drawer navigasi ringkas.
- **Mobile Smartphone / iOS & Android (< 768px)**:
  - Mobile Card-based transaction feed (menggantikan scrolling tabel yang rumit).
  - Floating speed-dial di pojok kanan bawah dengan safe bottom padding (`pb-safe`, `pb-28`).
  - Drawer menu navigasi dengan opsi scan langsung.
  - Camera & File upload yang mendukung kamera native ponsel.
