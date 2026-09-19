# CLAUDE.md / AGENTS.md — Context Anchor & Development Rules

> File ini adalah **sumber kebenaran utama (source of truth)** untuk setiap AI coding assistant atau engineer yang bekerja di project ini. Seluruh aturan didasarkan pada kondisi dan konvensi aktual codebase (mengacu pada `ARCHITECTURE.md`, `SKILL.md`, dan `DESIGN.md`).

---

## 1. Identitas Project
```
Nama Project      : Sakuin
Arti Nama         : Singkat, ramah di telinga, dari kata "masukin ke saku" atau mengelola uang saku.
Deskripsi Singkat : Aplikasi pencatatan dan pengelolaan uang saku pribadi dengan alokasi anggaran bulanan,
                    pengarsipan otomatis akhir bulan, dan tracking wishlist barang.
Tipe              : Web App (Vite + React SPA PWA-Ready) & REST API (Express + MongoDB)
Desain Sistem     : Modern Financial Elegance (Clean Fintech, Google Font Poppins, Framer Motion)
Maintainer        : Farish Ilham Syahrani (https://github.com/farishilhams/Sakuin)
```

---

## 2. Dokumen Referensi Wajib Dibaca Sebelum Bekerja
AI **wajib membaca file terkait sebelum melakukan modifikasi**, bukan membuat konvensi baru:

| File | Kapan Wajib Dibaca |
|---|---|
| `PRD.md` | Sebelum merancang atau menambah fitur baru (pahami batasan scope dan aturan bisnis) |
| `ARCHITECTURE.md` | Sebelum menyentuh struktur file, routing, model database, atau API contract |
| `SKILL.md` | Untuk menggunakan ulang snippet dan pola kode baku backend & frontend yang sudah ada |
| `DESIGN.md` | Sebelum membuat atau mengubah komponen antarmuka, warna, font, atau styling UI |
| `SECURITY.md` | Sebelum audit keamanan, penanganan token JWT, atau konfigurasi CORS/cookies |
| `TODO.md` | Untuk mengecek daftar prioritas tugas aktif yang telah disepakati |

---

## 3. Tech Stack Tetap (Jangan Diganti Tanpa Diskusi)
```
Backend          : Node.js (CommonJS), Express.js v4.21.2
Keamanan Backend : Helmet, Express Rate Limit, Express Mongo Sanitize, CORS
Database         : MongoDB dengan Mongoose v8.10.1 (Compound Indexes)
Autentikasi      : JWT (jsonwebtoken v9) + Passport.js v0.7 (Google OAuth 2.0)
Frontend         : React v19.0.0, Vite v6.4.3, React Router DOM v7.2.0
Styling & Font   : Tailwind CSS v4 (@tailwindcss/vite) + Google Font Poppins
Animasi          : Framer Motion v12
Icons & Toast    : Lucide React v1.40.0, react-hot-toast v2.5.2
Dokumen Ekspor   : jsPDF v3.0.0, jspdf-autotable v5.0.2
PWA Support      : vite-plugin-pwa v0.21.2
```

---

## 4. Struktur Folder & Lokasi Kerja
Project tersusun sebagai full-stack project tunggal di root workspace (`d:/laragon/www/Sakuin/`):
```
d:/laragon/www/Sakuin/
├── config/               # [Backend] db.js, passport.js
├── controllers/          # [Backend] auth, budget, history, pemasukan, transaction, wishlist
├── middleware/           # [Backend] authMiddleware.js
├── models/               # [Backend] User, Budget, HistoryPengeluaran, Pemasukan, Transaction, Wishlist
├── routes/               # [Backend] auth, budget, history, pemasukan, transaction, wishlist
├── scripts/              # [Backend] migrateFresh.js
├── server.js             # [Backend] Entry point Express REST API
│
├── public/               # [Frontend] Static assets (cover.png, icon.svg)
├── src/                  # [Frontend] React 19 source code (components, context, pages, utils)
├── index.html            # [Frontend] HTML entrypoint
├── vite.config.js        # [Frontend] Konfigurasi Vite & Tailwind v4
├── eslint.config.js      # [Frontend] Linter config
├── vercel.json           # [Deployment] Routing rewrite SPA
│
├── .env.example          # Environment variables terpadu (PORT, MONGO_URI, VITE_*)
├── .gitignore            # Gitignore terpadu
└── package.json          # Dependencies & npm scripts terpadu (Express + Vite)
```

---

## 5. Prinsip & Aturan Non-Negosiabel

### 5.1 Backward-Compatibility Antara Backend & Frontend
1. **Dilarang mengubah response shape backend secara sepihak**:
   - `GET /api/transactions`, `GET /api/budgets`, `GET /api/pemasukan`, dan `GET /api/history` mengembalikan **Array langsung** (`res.json(data)`), bukan `{ data: [...] }`. Jangan membungkusnya menjadi object kecuali frontend dimigrasikan bersamaan.
   - `POST` dan `PUT /api/wishlist` mengembalikan key `{ whistlist: ... }` (dengan typo 'h'). Frontend membaca `res.data.whistlist`. **Jangan ubah key ini tanpa mengubah kedua sisi sekaligus**.
2. **Isolasi Data User Wajib**:
   Setiap query database pada controller terproteksi WAJIB memfilter kepemilikan user:
   `{ userId: req.user.userId }` atau `{ _id: id, userId: req.user.userId }`. Dilarang melakukan update/delete hanya berdasarkan `_id` tanpa memverifikasi `userId`.
3. **6 Kategori Statis Tetap**:
   Kategori pengeluaran saat ini dibatasi pada 6 enum:
   `["Makanan", "Transportasi", "Hiburan", "Kesehatan", "Pendidikan", "Kebutuhan Pribadi"]`.
   Jangan menambah kategori baru di frontend tanpa mengubah enum di model Mongoose (`Budget.js`, `Transaction.js`, `HistoryPengeluaran.js`).

### 5.2 Aturan Desain & Styling Frontend (Industrial Brutalism)
1. **Zero Border Radius**:
   Semua elemen HTML wajib berujung siku (`border-radius: 0`). Dilarang memakai utility Tailwind `rounded-*`.
2. **Hard Offset Box Shadows**:
   Gunakan hard offset shadow hitam tanpa blur: `shadow-[2px_2px_0_var(--color-ink)]`, `shadow-[4px_4px_0_var(--color-ink)]`, `shadow-[8px_8px_0_var(--color-ink)]`. Dilarang menggunakan shadow blur standar seperti `shadow-md` atau `shadow-lg`.
3. **Hirarki Font Ketat**:
   - Judul & nomor seri: `--font-macro` (`font-macro uppercase`)
   - Angka rupiah, tanggal, tabel, tombol, status badge: `--font-mono` (`font-mono tabular-nums`)
   - Teks body & catatan: `--font-body` (`font-body`)
4. **Semantik Warna**:
   - Pemasukan/Aman: `--color-positive`
   - Mendekati Limit/Peringatan: `--color-warning`
   - Over Budget/Hapus/Bahaya: `--color-negative`
   - Primary Brand / CTA / FAB: `--color-accent` (Signal Yellow `#FFC800`)

### 5.3 Pemanggilan API & Penanganan State
1. Seluruh request API frontend **WAJIB melalui instance `api`** di `src/utils/api.js`. Jangan membuat instance axios baru di dalam komponen.
2. Notifikasi feedback aksi pengguna harus menggunakan `toast` dari `react-hot-toast` dengan pesan UPPERCASE singkat (misal: `toast.success("TRANSAKSI BERHASIL DITAMBAHKAN")`).

---

## 6. Larangan Eksplisit untuk AI
- JANGAN mengubah atau merapikan logika bisnis tanpa persetujuan eksplisit dari pengguna.
- JANGAN menghapus atau mengganti library inti (React 19, Tailwind v4, Express, Mongoose, jsPDF) tanpa instruksi khusus.
- JANGAN mengabaikan filter `userId` saat membuat endpoint data baru.
- JANGAN mengisi atau memodifikasi file `.env` dengan kredensial riil ke repository.
