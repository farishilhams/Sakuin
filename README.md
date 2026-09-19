# Sakuin — Smart Personal Finance & Quick Expense Tracker 💰

[![Maintainer](https://img.shields.io/badge/Maintainer-Farish%20Ilham%20Syahrani-10b981.svg)](https://github.com/farishilhams)
[![Repository](https://img.shields.io/badge/GitHub-farishilhams%2FSakuin-0f172a.svg)](https://github.com/farishilhams/Sakuin.git)
[![Stack](https://img.shields.io/badge/Tech%20Stack-MERN%20%2B%20Vite%20%2B%20Tailwind%20%2B%20Framer-6366f1.svg)]()
[![License](https://img.shields.io/badge/License-MIT-emerald.svg)]()

> **Sakuin** (dari kata *"masukin ke saku"*) adalah platform pencatatan keuangan pribadi dan pengelolaan uang saku berkecepatan tinggi (*sat-set*). Didesain dengan estetika *modern clean fintech* (bebas AI Slop), tipografi Google Font **Poppins**, animasi halus **Framer Motion**, serta pengalaman navigasi *mobile-first* (Bottom Navigation Bar & Bottom Sheet Drawer).

---

## 🌟 Fitur Unggulan

- 🎯 **Tombol Melayang Interaktif (AssistiveTouch iOS Draggable FAB)**:
  - Persistent di tingkat root `AppShell` — posisi tidak pernah hilang atau reset saat berpindah halaman.
  - *Magnetic snap-to-edge* otomatis merapat ke tepi kiri atau kanan layar secara natural dengan animasi pegas Framer Motion.
  - Deteksi threshold cerdas: gestur tap di bawah 8px membuka modal transaksi kilat, sedangkan tarikan 8px atau lebih mengaktifkan mode drag.
  - Memori posisi tersimpan aman di `localStorage` per perangkat.
- ⚡ **Pencatatan Cepat Sat-Set (< 3 Detik, Maksimal 3 Tap)**:
  - Custom Numpad besar bawaan (bebas hambatan keyboard layar HP) dengan chip nominal instan `+10rb`, `+20rb`, `+50rb`, `+100rb`.
  - Grid kategori adaptif tepat di bawah numpad (Makanan & Minuman, Transportasi, Belanja, Tagihan, Hiburan, Kesehatan, Lainnya) yang otomatis menampilkan kategori terpopuler di depan.
  - **1-Tap Save**: Cukup tap 1 kategori, transaksi otomatis tersimpan seketika tanpa perlu mencari tombol submit terpisah.
  - **Interactive Toast & Instant Undo**: Notifikasi ringkas dengan tombol "Undo" (3-5 detik) untuk membatalkan transaksi yang keliru tanpa konfirmasi berbelit.
  - 35+ Pilihan Dompet Terkategori (Bank Nasional, Bank Digital, E-Wallet, Investasi, Kas Fisik) dengan ingatan preferensi dompet terakhir.
- 👤 **Halaman Profil Akun Universal (`/profile`)**:
  - Tampilan seragam dan konsisten di seluruh ukuran layar (ponsel, tablet, desktop).
  - Kelola nama pengguna, alamat email, avatar dengan pratinjau live, dan nomor telepon dengan lencana "Opsional".
  - Ganti kata sandi langsung dari dalam akun dengan toggle mata interaktif (`Eye` & `EyeOff`) dan verifikasi kata sandi saat ini.
- 🔐 **Alur Lupa & Reset Kata Sandi**:
  - Pemulihan akun aman via token hash SHA-256 dengan batas kedaluwarsa 30 menit.
  - Respons anti-enumerasi akun generic untuk mencegah sniffing data pengguna.
  - Halaman `ForgotPassword` dan `ResetPassword` modern dengan validasi ganda.
- 📸 **Pindai Struk & Bukti Transaksi Instan (OCR)**:
  - Ekstraksi otomatis nominal, tanggal, dan nama toko/merchant dari struk belanja atau tangkapan layar m-banking (QRIS).
- 📊 **Dasbor Arus Kas Real-Time**:
  - Ringkasan total saldo bersih, pengeluaran & pemasukan harian/bulanan.
  - Bar progres anggaran amplop (*envelope budgeting*) dengan indikator semantik (Aman, Waspada, Over Budget).
- 📱 **Responsivitas Perangkat Nyata (Mobile-First)**:
  - **Ponsel (Android & iPhone)**: Navigasi bawah (*Bottom Navigation Bar*), modal lembar dari bawah (*Bottom Sheet Drawer*), dan tampilan riwayat berbasis kartu (*Card Feed*).
  - **Tablet & iPad**: Layout *split-view* adaptif.
  - **Laptop & Desktop**: Tabel transaksi analitik lengkap dengan sorting, filtering, dan ekspor PDF.
- 👁️ **Form Input Terstandarisasi & Toggle Password**:
  - Placeholder aksi ramah pengguna: *"Masukkan nama lengkap"*, *"Masukkan alamat email"*, *"Masukkan kata sandi"*, *"Masukkan konfirmasi kata sandi"*, *"Masukkan nominal Rp"*.
  - Ikon interaktif mata (`Eye` & `EyeOff`) di semua kolom kata sandi.
  - Standarisasi wadah ikon outline `w-10 h-10 rounded-2xl` transparan modern tanpa lingkaran putih AI Slop.
- 🔒 **Keamanan Berlapis**:
  - Proteksi HTTP Security Headers (`helmet`), Anti-NoSQL Injection (`express-mongo-sanitize`), Rate Limiter autentikasi, serta hash kata sandi `bcrypt`.

---

## 🛠️ Tech Stack

| Layer | Teknologi |
|---|---|
| **Frontend** | React 19, Vite 6, Tailwind CSS v4, Framer Motion, Lucide React, Google Font Poppins |
| **Backend** | Node.js, Express.js (Modular Controllers, Services, Models) |
| **Database** | MongoDB dengan Mongoose 8 (Compound Indexing performa tinggi) |
| **Autentikasi** | JWT (JSON Web Token) + Passport.js (Google OAuth 2.0) |
| **Keamanan** | Helmet, Express Rate Limit, Express Mongo Sanitize, Bcryptjs |
| **Dokumen & PWA** | jsPDF, jspdf-autotable, vite-plugin-pwa |

---

## 🗄️ Skema Model Database Mongoose

Platform Sakuin memiliki 4 pilar skema data utama di direktori `models/`:

1. **`User`** (`models/User.js`):
   - Menyimpan identitas akun (`name`, `email` unique & lowercase, `password` ter-hash bcrypt, `googleId`, `avatar`, `provider`).
2. **`Wallet`** (`models/Wallet.js`):
   - Pengelolaan multi-rekening & dompet digital (`userId`, `name`, `type` [cash, bank, ewallet, other], `balance`, `accountNumber`, `color`, `isDefault`).
   - Compound index: `{ userId: 1, name: 1 }`.
3. **`Transaction`** (`models/Transaction.js`):
   - Jurnal transaksi harian (`userId`, `name`, `category`, `amount`, `date`, `type` [expense, income, transfer], `wallet`, `notes`, `receiptUrl`).
   - Compound indexes: `{ userId: 1, date: -1 }`, `{ userId: 1, category: 1 }`, `{ userId: 1, type: 1 }`.
4. **`Budget`** (`models/Budget.js`):
   - Limit batas pengeluaran bulanan per kategori (`userId`, `category`, `budget`).
   - Unique compound index: `{ userId: 1, category: 1 }`.

---

## 🚀 Panduan Instalasi & Menjalankan Aplikasi

### 1. Prasyarat Sistem
- **Node.js**: versi 18.x atau lebih baru.
- **NPM**: versi 9.x atau lebih baru.
- **MongoDB**: MongoDB Atlas (Cloud) atau MongoDB Local (Port 27017).

### 2. Kloning Repositori
```bash
git clone https://github.com/farishilhams/Sakuin.git
cd Sakuin
```

### 3. Pasang Seluruh Dependensi
```bash
npm install
```

### 4. Konfigurasi Variabel Lingkungan (`.env`)
Salin file template `.env.example` menjadi `.env`:
```bash
cp .env.example .env
```

Isi konfigurasi sesuai panduan berikut:

```env
# --- SERVER BACKEND ---
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# --- DATABASE MONGODB ---
# Pilih salah satu: MongoDB Atlas (Cloud) atau MongoDB Lokal
MONGODB_URI=mongodb://127.0.0.1:27017/sakuin

# --- AUTENTIKASI JWT & SESSION ---
JWT_SECRET=rahasia_jwt_sakuin_farish_2026
JWT_EXPIRES_IN=7d
SESSION_SECRET=rahasia_session_sakuin_farish_ilham_syahrani

# --- GOOGLE OAUTH 2.0 (FARISH ILHAM SYAHRANI) ---
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# --- CLIENT FRONTEND (VITE) ---
VITE_API_BASE_URL=http://localhost:5000/api
VITE_PUBLIC_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

---

## 🌐 Panduan Penyambungan Database MongoDB

Jika registrasi/login gagal dengan status database belum tersambung, ikuti panduan ini:

### Opsi A: Menggunakan MongoDB Atlas (Cloud — Direkomendasikan)
1. Buka [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) dan masuk ke akun Anda.
2. Buat cluster gratis (**M0 Free Tier**).
3. Buat **Database User**:
   - Masuk ke menu **Security** > **Database Access**.
   - Klik **Add New Database User**.
   - Pilih Authentication Method: **Password**. Masukkan username & password (catat password ini).
   - Berikan role **Built-in Role: Read and write to any database**.
4. Atur **Network Access** (PENTING):
   - Masuk ke menu **Security** > **Network Access**.
   - Klik **Add IP Address**.
   - Masukkan `0.0.0.0/0` (Allow Access from Anywhere) lalu klik **Confirm**.
5. Salin Connection String:
   - Masuk ke menu **Deployment** > **Database**.
   - Klik tombol **Connect** pada cluster Anda -> Pilih **Drivers (Node.js)**.
   - Salin URI yang diberikan dan tempelkan ke `MONGODB_URI` di file `.env`:
     ```env
     MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/sakuin?retryWrites=true&w=majority
     ```
     *(Ganti `<username>` dan `<password>` dengan database user yang Anda buat di Langkah 3).*

### Opsi B: Menggunakan MongoDB Lokal (Windows / Laragon)
1. Pastikan service MongoDB telah terpasang dan aktif di komputer Anda:
   ```bash
   mongod --version
   ```
2. Isi `MONGODB_URI` di file `.env`:
   ```env
   MONGODB_URI=mongodb://127.0.0.1:27017/sakuin
   ```

---

## 🔑 Panduan Konfigurasi Google OAuth 2.0 (Farish Ilham Syahrani)

Untuk mengaktifkan tombol **Masuk dengan Akun Google**:

1. Buka [Google Cloud Console](https://console.cloud.google.com/).
2. Buat project baru bernama **Sakuin**.
3. Atur **OAuth consent screen**:
   - User Type: **External**.
   - App name: **Sakuin**.
   - User support email: `farishilham.s@gmail.com`.
   - Developer contact email: `farishilham.s@gmail.com`.
   - Scopes: `.../auth/userinfo.email`, `.../auth/userinfo.profile`, `openid`.
4. Buat **Credentials**:
   - Klik **Create Credentials** > **OAuth client ID**.
   - Application type: **Web application**.
   - Name: **Sakuin Client**.
   - **Authorized JavaScript origins**:
     - `http://localhost:5173`
   - **Authorized redirect URIs**:
     - `http://localhost:5000/api/auth/google/callback`
5. Salin **Client ID** dan **Client Secret** ke file `.env`:
   ```env
   GOOGLE_CLIENT_ID=xxxxxxxxxxxx.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=GOCSPX-xxxxxxxxxxxx
   ```

---

## 💻 Menjalankan Server & Client

Jalankan backend dan frontend secara serentak dalam satu perintah:
```bash
npm run dev
```

- **Frontend Client**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:5000/api](http://localhost:5000/api)
- **API Health Check**: [http://localhost:5000/api/health-check](http://localhost:5000/api/health-check)

---

## 📁 Struktur Direktori Proyek

```
Sakuin/
├── config/              # Konfigurasi database db.js (auto-reconnect) & passport.js
├── controllers/         # Handler REST API (auth, budget, history, pemasukan, transaction, wishlist)
├── middleware/          # authMiddleware.js (JWT verify)
├── models/              # Skema Mongoose: User, Wallet, Transaction, Budget, Wishlist, History
├── routes/              # Express API route endpoints
├── public/              # Aset statis & PWA manifest
├── src/
│   ├── components/      # Komponen UI: Header, BottomNav, DraggableFAB, Modals, Tables
│   ├── context/         # AuthContext & ThemeContext
│   ├── layouts/         # AppShell.jsx (Persistent FAB, BottomNav, Global Modals)
│   ├── pages/           # Dashboard, DashboardWishlist, ProfilePage, Login, Forgot/Reset
│   ├── utils/           # Axios instance api.js & OCR receiptParser.js
│   ├── App.jsx          # Route Tree & Providers
│   └── index.css        # Tailwind CSS v4 tokens, Poppins font, Clean Fintech
├── server.js            # Express server (Helmet, Rate Limit, Mongo Sanitize)
├── README.md            # Dokumentasi resmi Sakuin
└── package.json         # Konfigurasi dependensi MERN
```

---

## 👤 Pemilik & Pengembang

Dikembangkan dan dipelihara secara resmi oleh:
- **Nama**: Farish Ilham Syahrani
- **GitHub**: [@farishilhams](https://github.com/farishilhams)
- **Email**: [farishilham.s@gmail.com](mailto:farishilham.s@gmail.com)
- **Repositori Resmi**: [https://github.com/farishilhams/Sakuin.git](https://github.com/farishilhams/Sakuin.git)

---

## 📄 Lisensi

Hak Cipta © 2026 **Farish Ilham Syahrani**. Dirilis di bawah lisensi [MIT](LICENSE).
