# Sakuin — Daily Personal Finance Tracker Sat-Set 💰

[![Maintainer](https://img.shields.io/badge/Maintainer-Farish%20Ilham%20Syahrani-10b981.svg)](https://github.com/farishilhams)
[![Repository](https://img.shields.io/badge/GitHub-farishilhams%2FSakuin-0f172a.svg)](https://github.com/farishilhams/Sakuin.git)
[![Stack](https://img.shields.io/badge/Tech%20Stack-MERN%20%2B%20Vite%20%2B%20Tailwind-6366f1.svg)]()
[![License](https://img.shields.io/badge/License-MIT-emerald.svg)]()

> **Sakuin** (berasal dari kata *"masukin ke saku"*) adalah platform pencatatan keuangan pribadi super-cepat (*sat-set*) yang dirancang untuk membantu Anda memantau arus kas harian, mendisiplinkan alokasi anggaran bulanan (*envelope budgeting*), dan merencanakan barang impian tanpa distraksi.

---

## 🌟 Fitur Utama

- ⚡ **Input Pengeluaran Sat-Set (< 3 Detik)**: Antarmuka *thumb-friendly* dengan keypad nominal cepat, kategori satu-klik, dan opsi pemilihan sumber dana / dompet digital.
- 📸 **Pindai Bukti Transaksi & QRIS Instan**: Pindai struk belanja atau tangkapan layar m-banking secara instan dengan teknologi OCR client-side berakurasi tinggi (nominal, tanggal, dan nama merchant terbaca otomatis).
- 📊 **Dasbor Arus Kas & Anggaran Amplop**: Pemantauan real-time saldo bersih, total pemasukan, pengeluaran, dan meteran alokasi budget dengan indikator semantik (Aman, Waspada, Boncos).
- 🎯 **Target Tabungan & Wishlist**: Kelola daftar barang impian lengkap dengan estimasi harga, link toko online, foto produk, dan akumulasi target tabungan.
- 📑 **Ekspor Laporan PDF**: Unduh rekapitulasi transaksi bulanan resmi dalam format dokumen PDF siap cetak.
- 📱 **Multi-Device Responsif Nyata**: Dioptimalkan secara mulus untuk perangkat Laptop, Tablet/iPad, Android, dan iPhone/iOS dengan safe-area navigation.
- 🔒 **Keamanan Berlapis**: Dilengkapi HTTP security headers (*Helmet*), proteksi NoSQL injection, pembatasan laju request (*rate-limiting*), dan integrasi Google OAuth 2.0.

---

## 🛠️ Tech Stack Modern

- **Frontend**: React 19, Vite 6, Tailwind CSS v4, Framer Motion, Lucide React, Google Font Poppins, JetBrains Mono.
- **Backend**: Node.js, Express.js, MongoDB & Mongoose 8, JWT Authentication, Passport.js Google OAuth 2.0.
- **Security**: Helmet, Express Rate Limit, Express Mongo Sanitize, Bcryptjs.
- **Tooling**: Tesseract.js (OCR Client Engine), JsPDF, Concurrently.

---

## 🚀 Panduan Instalasi Lokal

### 1. Prasyarat Sistem
Pastikan perangkat Anda telah terpasang:
- **Node.js** v18.x atau lebih baru
- **NPM** v9.x atau lebih baru
- **MongoDB** lokal yang sedang berjalan (port default `27017`) atau akun MongoDB Atlas.

### 2. Kloning Repositori
```bash
git clone https://github.com/farishilhams/Sakuin.git
cd Sakuin
```

### 3. Pasang Dependensi
```bash
npm install
```

### 4. Konfigurasi Variabel Lingkungan
Salin file template `.env.example` menjadi `.env`:
```bash
cp .env.example .env
```
Sesuaikan konfigurasi kredensial Anda pada file `.env`:
```env
# Server
PORT=5000
MONGO_URI=mongodb://localhost:27017/sakuin
JWT_SECRET=rahasia_jwt_anda_minimal_32_karakter
SESSION_SECRET=rahasia_session_anda
CLIENT_URL=http://localhost:5173
NODE_ENV=development

# Google OAuth 2.0 (Opsional)
GOOGLE_CLIENT_ID=client_id_dari_google_cloud_console
GOOGLE_CLIENT_SECRET=client_secret_dari_google_cloud_console
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# Client
VITE_PUBLIC_API_URL=http://localhost:5000/api
VITE_PUBLIC_MAINTENANCE_MODE=false
```

### 5. Menjalankan Aplikasi
Jalankan backend server dan frontend client secara bersamaan:
```bash
npm run dev
```

Aplikasi dapat diakses melalui:
- **Frontend Client**: `http://localhost:5173`
- **Backend API**: `http://localhost:5000/api`

---

## 📁 Struktur Repositori

```
Sakuin/
├── config/              # Konfigurasi Database Mongoose & Passport Google OAuth
├── controllers/         # Handler endpoint API (Auth, Budget, Transaksi, Wishlist)
├── middleware/          # JWT Verification & Proteksi Rute
├── models/              # Schema Mongoose (User, Budget, Transaction, Wishlist, dll)
├── routes/              # Definisi REST API Endpoints
├── public/              # Aset statis & Web App Manifest
├── src/
│   ├── assets/          # Ilustrasi & Ikon lokal
│   ├── components/      # Komponen UI modern (Header, Numpad, Modals, Cards)
│   ├── context/         # AuthContext & ThemeContext
│   ├── pages/           # Halaman Dashboard, Wishlist, Login
│   ├── utils/           # Axios instance & OCR Receipt Parser
│   ├── App.jsx          # Routing & Layout Providers
│   └── index.css        # Token desain, Poppins typography & Glassmorphism
├── server.js            # Entry point Express API Server
└── package.json         # Konfigurasi script & dependensi
```

---

## 👤 Pemilik & Pengembang

Dikembangkan dan dipelihara secara aktif oleh:
- **Nama**: Farish Ilham Syahrani
- **GitHub**: [@farishilhams](https://github.com/farishilhams)
- **Email**: [farishilham.s@gmail.com](mailto:farishilham.s@gmail.com)
- **Repositori Resmi**: [https://github.com/farishilhams/Sakuin.git](https://github.com/farishilhams/Sakuin.git)

---

## 📄 Lisensi

Hak Cipta © 2026 **Farish Ilham Syahrani**. Dirilis di bawah lisensi [MIT](LICENSE).
