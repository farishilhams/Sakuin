# ARCHITECTURE.md — Arsitektur & Spesifikasi Teknis Codebase

> Dokumen ini mencatat arsitektur aktual, data flow, dan API contract hasil audit codebase `be-catat-pengeluaran-anda-main` dan `fe-catat-pengeluaran-anda-main`. Seluruh isi didasarkan pada kondisi nyata kode yang ada (as-is), bukan asumsi atau rancangan ideal baru.

---

## 1. Struktur Folder & Tech Stack Aktual

### 1.1 Lokasi & Struktur Repository
Project berada dalam satu folder workspace induk (`d:\laragon\www\Sakuin`) dengan struktur full-stack tunggal yang terpadu:
```
d:\laragon\www\Sakuin\
├── config/                                      # [Backend] Konfigurasi database & passport
├── controllers/                                 # [Backend] Request handler & direct DB queries
├── middleware/                                  # [Backend] Auth middleware (JWT verify)
├── models/                                      # [Backend] Mongoose schemas (User, Budget, dll)
├── routes/                                      # [Backend] Express route definitions
├── scripts/                                     # [Backend] Maintenance script (migrateFresh.js)
├── server.js                                    # [Backend] Entry point Express REST API
│
├── public/                                      # [Frontend] Static assets (cover.png, icon.svg)
├── src/                                         # [Frontend] React 19 source code
│   ├── assets/                                  # Assets lokal
│   ├── components/                              # Komponen UI brutalist & modal
│   ├── context/                                 # AuthContext & ThemeContext
│   ├── pages/                                   # Halaman (Dashboard, Wishlist, Login, NotFound, Maintenance)
│   ├── utils/                                   # Axios instance (api.js)
│   ├── App.jsx                                  # Router & global providers
│   ├── index.css                                # CSS Tokens & reset zero-radius
│   └── main.jsx                                 # React DOM mount & SW register
├── index.html                                   # [Frontend] HTML Template & Google Fonts
├── vite.config.js                               # [Frontend] Konfigurasi Vite, Tailwind v4, & VitePWA
├── eslint.config.js                             # [Frontend] Konfigurasi Linter
├── vercel.json                                  # [Deployment] Routing rewrite untuk SPA di Vercel
│
├── .env.example                                 # Environment variables terpadu (Server & Client)
├── .gitignore                                   # Git ignore rules terpadu
├── package.json                                 # Dependencies & scripts terpadu (Express + Vite)
├── ARCHITECTURE.md                              # Dokumen arsitektur (file ini)
├── CLAUDE.md                                    # Rules & context anchor AI
├── DESIGN.md                                    # Design tokens & UI system
├── PRD.md                                       # Reverse-engineered requirements
├── SECURITY.md                                  # Security guidelines & checklists
├── SKILL.md                                     # Pola kode aktual yang sudah dipakai
├── TODO.md                                      # Task list (diisi setelah audit)
└── WORKFLOW.md                                  # Workflow conventions
```

### 1.2 Tech Stack Lengkap & Versi

#### Backend Service:
- **Runtime Environment**: Node.js (CommonJS, `require`)
- **Web Framework**: Express.js `v4.21.2`
- **Database & ODM**: MongoDB dengan Mongoose `v8.10.1`
- **Autentikasi & Keamanan**:
  - JWT (`jsonwebtoken` `v9.0.2`) dengan masa aktif token 7 hari (`expiresIn: "7d"`)
  - Passport.js `v0.7.0` + `passport-google-oauth20` `v2.0.0` (Google OAuth 2.0)
  - Hashing password: `bcryptjs` `v3.0.2` (salt round 10 via Mongoose pre-save hook)
  - Session Store: `express-session` `v1.18.1` & `connect-mongo` `v5.1.0` *(Catatan: terpasang di `server.js`, namun verifikasi request harian menggunakan stateless Bearer JWT)*
  - CORS (`cors` `v2.8.5`) & Cookie Parser (`cookie-parser` `v1.4.7`)
- **HTTP Client**: `axios` `v1.8.1`
- **Dev Tools**: `nodemon` `v3.1.9`
- **Database Utilities**: Script `scripts/migrateFresh.js` (wipe all collections dengan konfirmasi terminal)

#### Frontend Client:
- **Core Library**: React `v19.0.0` + React DOM `v19.0.0`
- **Build Tool & Bundler**: Vite `v6.1.0` (ES Modules)
- **Routing**: React Router DOM `v7.2.0` (`BrowserRouter`, `Routes`, `Route`)
- **Styling**: Tailwind CSS v4 (`tailwindcss` `v4.0.7`, `@tailwindcss/vite` `v4.0.7`) dikombinasikan dengan Industrial Brutalism CSS custom variables
- **State & Context**: React Context API (`AuthContext`, `ThemeContext`)
- **Icons**: Lucide React `v1.40.0`
- **Feedback & Notifications**: `react-hot-toast` `v2.5.2`
- **Document Export**: `jspdf` `v3.0.0` & `jspdf-autotable` `v5.0.2`
- **PWA Integration**: `vite-plugin-pwa` `v0.21.1` (Service Worker autoUpdate, manifest, icons)
- **OAuth Helpers**: `@react-oauth/google` `v0.12.1`, `jwt-decode` `v4.0.0`

---

## 2. Pola Arsitektur yang Dianut

### 2.1 Backend: Controller-Model (2-Tier Pattern)
Backend **TIDAK menerapkan Layered Architecture murni (tidak ada Service Layer maupun Repository Layer terpisah)**:
1. **Routes Layer (`routes/*.js`)**:
   Mendefinisikan endpoint URL, menerapkan middleware otentikasi (`authMiddleware`), dan memanggil fungsi controller secara langsung.
2. **Controller Layer (`controllers/*.js`)**:
   Berperan ganda: menangani HTTP Request/Response, melakukan validasi manual input sederhana, memproses logika kalkulasi (misal: aggregasi total transaksi di `historyController`, total harga di `wishlistController`), dan **langsung mengeksekusi query database menggunakan model Mongoose**.
3. **Model Layer (`models/*.js`)**:
   Mendefinisikan skema Mongoose, validasi enum statis, default value, dan lifecycle hook (`pre('save')` untuk hash password pada `User.js`).

### 2.2 Frontend: Component-Based SPA dengan In-Memory Client Processing
1. **Client-Side Heavy Processing**:
   Semua penyaringan data (filter tanggal, nama, kategori, nominal dengan operator `=`, `>`, `<`, `>=`, `<=`), pengurutan, dan penomoran halaman (pagination) dilakukan sepenuhnya pada browser memory (React state `useMemo`/`useEffect`) setelah menerima seluruh dataset array dari backend.
2. **Direct Axios Calls**:
   Pemanggilan API dilakukan melalui instance Axios `src/utils/api.js` yang disebar di berbagai komponen (`TransactionTable`, `BudgetEditor`, `MonthlyIncomeCard`, `WishlistModal`, dll.), bukan terpusat dalam API service repository khusus.
3. **Dual-Mode Industrial Brutalism UI**:
   Arsitektur visual menganut prinsip zero border-radius (`* { border-radius: 0 !important; }`), hard offset shadows (`shadow-[4px_4px_0_var(--color-ink)]`), border hitam tebal, dan tipografi berjenjang (Macro, Micro/Data Monospace, Body).

---

## 3. Data Flow per Layer

```
[Browser / React Client]
       │
       ▼ (HTTP Request via Axios: baseURL = VITE_PUBLIC_API_URL / fallback http://localhost:3000/api)
       │ (Header: Authorization: Bearer <token>)
[Express Entrypoint: server.js]
       │
       ├─► Global Middleware: cors, express.json(), cookieParser(), session(), passport.initialize()
       │
       ▼ (Route Match: /api/auth, /api/transactions, /api/budgets, /api/history, /api/pemasukan, /api/wishlist)
[Route Layer: routes/*.js]
       │
       ▼ (Intercepted by authMiddleware.js - kecuali /api/auth/* dan /api/health-check)
[Middleware: authMiddleware.js]
       │ ──► [Token valid] ──► req.user = { userId: ... }
       │ ──► [Token kosong/invalid] ──► Return 401 Unauthorized / 403 Invalid token
       │
       ▼
[Controller Layer: controllers/*.js]
       │ ──► Input parsing dari req.body / req.params
       │ ──► Business logic inline (perhitungan total, date filtering)
       │ ──► Direct Mongoose Query: User.*, Transaction.*, Budget.*, Wishlist.*
       │
       ▼
[Database Layer: MongoDB]
       │
       ▼ (Return JSON Response ke Client)
[Client React Context / Component State Update & react-hot-toast]
```

### Detail Alur Autentikasi
1. **Registrasi Lokal**:
   `POST /api/auth/register` ──► Buat User di MongoDB ──► Otomatis insert 6 kategori Budget default bernilai `0` (Makanan, Transportasi, Hiburan, Kesehatan, Pendidikan, Kebutuhan Pribadi) ──► Return `{ message: "Register berhasil" }` ──► Frontend langsung menembak `POST /api/auth/login`.
2. **Login Lokal**:
   `POST /api/auth/login` ──► Validasi email & compare password (bcrypt) ──► Terbitkan JWT (payload: `{ userId }`, expired 7 hari) ──► Return `{ token, user: { id, name, email } }` ──► Frontend simpan ke `localStorage` dan inject ke Axios default headers.
3. **Google OAuth 2.0 Flow**:
   User klik tombol ──► Redirect browser ke `/api/auth/google` ──► Passport mengalihkan ke Google Consent Screen ──► Google redirect balik ke `/api/auth/google/callback` ──► Passport cari/buat user baru (serta 6 budget default jika baru) ──► `authController.googleAuthCallback` terbitkan JWT ──► Redirect HTTP 302 ke frontend URL: `/auth/google/success?token=...&user=...&t=...` ──► Komponen `GoogleAuthSuccess.jsx` membaca query params, menyimpan token ke `localStorage`, lalu redirect ke `/`.

---

## 4. API Contract & Temuan Ketidakkonsistenan

### 4.1 Ringkasan Endpoint Aktual

| Method | Endpoint | Auth Required | Request Body / Params | Response Format Aktual | Status Code |
|---|---|---|---|---|---|
| `GET` | `/api/health-check` | Tidak | - | `{"status": "OK"}` | 200 |
| `POST` | `/api/auth/register` | Tidak | `{ name, email, password }` | `{"message": "Register berhasil"}` | 200 / 400 / 500 |
| `POST` | `/api/auth/login` | Tidak | `{ email, password }` | `{"token": "...", "user": { "id", "name", "email" }}` | 200 / 400 / 500 |
| `GET` | `/api/auth/google` | Tidak | Query Google | Redirect ke Google OAuth | 302 |
| `GET` | `/api/auth/google/callback` | Tidak | Callback Google | Redirect ke frontend `/auth/google/success?...` | 302 |
| `GET` | `/api/transactions` | Ya (Bearer) | - | Array of objects: `[ { _id, userId, name, category, amount, date }, ... ]` | 200 / 500 |
| `POST` | `/api/transactions` | Ya (Bearer) | `{ name, category, amount, date }` | `{"message": "Transaksi berhasil ditambahkan", "transaction": {...}}` | 200 / 500 |
| `PUT` | `/api/transactions/:id` | Ya (Bearer) | `{ name, category, amount, date }` | `{"message": "Transaksi berhasil diupdate", "transaction": {...}}` | 200 / 404 / 500 |
| `DELETE` | `/api/transactions/:id` | Ya (Bearer) | URL param `id` | `{"message": "Transaksi berhasil dihapus"}` | 200 / 404 / 500 |
| `GET` | `/api/budgets` | Ya (Bearer) | - | Array of objects: `[ { _id, userId, category, budget }, ... ]` | 200 / 500 |
| `POST` | `/api/budgets` | Ya (Bearer) | `{ category, budget }` | `{"message": "Budget berhasil ditambahkan", "budget": {...}}` | 200 / 500 |
| `PUT` | `/api/budgets/:id` | Ya (Bearer) | `{ budget }` | `{"message": "Budget berhasil diupdate", "budget": {...}}` | 200 / 404 / 500 |
| `GET` | `/api/pemasukan` | Ya (Bearer) | - | Array of objects: `[ { _id, userId, month, year, amount, updatedAt }, ... ]` | 200 / 500 |
| `POST` | `/api/pemasukan` | Ya (Bearer) | `{ month, year, amount }` | `{"message": "Pemasukan bulanan berhasil disimpan", "pemasukan": {...}}` | 200 / 500 |
| `GET` | `/api/history` | Ya (Bearer) | - | Array of objects: `[ { _id, userId, month, year, totals: {...}, createdAt }, ... ]` | 200 / 500 |
| `POST` | `/api/history` | Ya (Bearer) | `{ month, year }` | `{"message": "History pengeluaran berhasil disimpan", "history": {...}}` | 200 / 500 |
| `DELETE` | `/api/history/:id` | Ya (Bearer) | URL param `id` | `{"message": "History pengeluaran berhasil dihapus", "id": "..."}` | 200 / 404 / 500 |
| `GET` | `/api/wishlist` | Ya (Bearer) | - | Wrapped Object: `{"items": [...], "totalPrice": 0, "totalItem": 0}` | 200 / 500 |
| `POST` | `/api/wishlist` | Ya (Bearer) | `{ name, price, description, purchaseLink, imageUrls }` | `{"message": "Wishlist berhasil ditambahkan", "whistlist": {...}}` *(typo key!)* | 200 / 500 |
| `PUT` | `/api/wishlist/:id` | Ya (Bearer) | `{ name, price, description, purchaseLink, imageUrls }` | `{"message": "Wishlist berhasil diupdate", "whistlist": {...}}` *(typo key!)* | 200 / 404 / 500 |
| `DELETE` | `/api/wishlist/:id` | Ya (Bearer) | URL param `id` | `{"message": "Wishlist berhasil dihapus"}` | 200 / 404 / 500 |

### 4.2 Temuan Anomali & Ketidakkonsistenan API Contract (As-Is)
1. **Tidak Ada Envelope Baku**:
   Tidak ada format envelope standar seperti `{ success: boolean, data: any, message: string }`.
2. **Struktur GET Berbeda Antara Koleksi**:
   - `/api/transactions`, `/api/budgets`, `/api/pemasukan`, `/api/history` mengembalikan **Raw Array** langsung: `[...]`.
   - `/api/wishlist` mengembalikan **Wrapped Object**: `{ items: [...], totalPrice: ..., totalItem: ... }`.
3. **Typo Kunci JSON pada Response Wishlist**:
   Backend menggunakan ejaan salah: `"whistlist"` (dengan huruf 'h') pada response `POST` dan `PUT /api/wishlist`. Frontend (`DashboardWishlist.jsx` baris 69 dan 77) secara eksplisit mengakses `response.data.whistlist`.
4. **Respon Delete Tidak Seragam**:
   - `DELETE /api/history/:id` mengembalikan `{ message, id }`.
   - `DELETE /api/transactions/:id` dan `DELETE /api/wishlist/:id` hanya mengembalikan `{ message }` tanpa ID.
5. **Endpoint Fantom di README Asli**:
   README backend asli mencantumkan endpoint berikut yang **sama sekali tidak ada dalam kode**:
   - `GET /api/auth/logout` (Logout ditangani sepenuhnya di sisi client dengan menghapus token)
   - `GET /api/transactions/:id`
   - `GET /api/budgets/:id` dan `DELETE /api/budgets/:id`
   - `GET /api/pemasukan/:id`, `PUT /api/pemasukan/:id`, `DELETE /api/pemasukan/:id`
   - `GET /api/wishlist/:id`
6. **Error Response & Information Leakage**:
   Pada blok `catch (error)`, sebagian besar controller mengembalikan `res.status(500).json({ message: "Server error", error })`. Objek error mentah Mongoose/Node.js diteruskan langsung ke client jika terjadi kesalahan database.

---

## 5. Skema Database Aktual (Mongoose Models)

### 5.1 Koleksi: `users` (`models/User.js`)
| Field | Tipe | Constraint / Default | Keterangan |
|---|---|---|---|
| `_id` | ObjectId | Auto | Primary Key |
| `name` | String | required: true | Nama lengkap pengguna |
| `email` | String | required: true, unique: true | Alamat email pengguna |
| `password` | String | optional | Hash bcrypt. Opsional untuk akun Google OAuth |
| `googleId` | String | optional | ID dari profil Google |
| `avatar` | String | optional | URL foto profil dari Google |
| `provider` | String | enum: `["local", "google"]`, default: `"local"` | Metode registrasi |

### 5.2 Koleksi: `budgets` (`models/Budget.js`)
| Field | Tipe | Constraint / Default | Keterangan |
|---|---|---|---|
| `_id` | ObjectId | Auto | Primary Key |
| `userId` | ObjectId | ref: "User", required: true | Relasi ke pemilik user |
| `category` | String | required: true, enum: `["Makanan", "Transportasi", "Hiburan", "Kesehatan", "Pendidikan", "Kebutuhan Pribadi"]` | Kategori budget (6 opsi statis) |
| `budget` | Number | required: true | Batas anggaran dalam rupiah |

### 5.3 Koleksi: `transactions` (`models/Transaction.js`)
| Field | Tipe | Constraint / Default | Keterangan |
|---|---|---|---|
| `_id` | ObjectId | Auto | Primary Key |
| `userId` | ObjectId | ref: "User", required: true | Relasi ke pemilik transaksi |
| `name` | String | required: true | Nama / deskripsi transaksi |
| `category` | String | required: true, enum: `["Makanan", "Transportasi", "Hiburan", "Kesehatan", "Pendidikan", "Kebutuhan Pribadi"]` | Kategori transaksi |
| `amount` | Number | required: true | Nominal pengeluaran |
| `date` | Date | default: `Date.now` | Tanggal transaksi |

### 5.4 Koleksi: `pemasukans` (`models/Pemasukan.js`)
| Field | Tipe | Constraint / Default | Keterangan |
|---|---|---|---|
| `_id` | ObjectId | Auto | Primary Key |
| `userId` | ObjectId | ref: "User", required: true | Relasi ke pemilik pemasukan |
| `month` | Number | required: true | Bulan (1-12) |
| `year` | Number | required: true | Tahun (misal: 2026) |
| `amount` | Number | required: true | Total nominal pemasukan bulanan |
| `updatedAt`| Date | default: `Date.now` | Timestamp pembaruan |

### 5.5 Koleksi: `historypengeluarans` (`models/HistoryPengeluaran.js`)
| Field | Tipe | Constraint / Default | Keterangan |
|---|---|---|---|
| `_id` | ObjectId | Auto | Primary Key |
| `userId` | ObjectId | ref: "User", required: true | Relasi ke pemilik arsip |
| `month` | Number | required: true | Bulan periode pengeluaran |
| `year` | Number | required: true | Tahun periode pengeluaran |
| `totals` | Object | `{ Makanan: 0, Transportasi: 0, "Kebutuhan Pribadi": 0, Hiburan: 0, Kesehatan: 0, Pendidikan: 0 }` | Hasil agregasi total per kategori |
| `createdAt`| Date | default: `Date.now` | Timestamp pengarsipan |

### 5.6 Koleksi: `wishlists` (`models/Wishlist.js`)
| Field | Tipe | Constraint / Default | Keterangan |
|---|---|---|---|
| `_id` | ObjectId | Auto | Primary Key |
| `userId` | ObjectId | ref: "User", required: true | Relasi ke pemilik wishlist |
| `name` | String | required: true | Nama barang |
| `price` | Number | required: true | Estimasi harga barang |
| `description`| String | optional | Catatan atau deskripsi barang |
| `purchaseLink`| String | optional | Tautan toko online/situs pembelian |
| `imageUrls`| `[String]` | array of strings | Schema berupa array string, namun diisi single string oleh client |
| `date` | Date | default: `Date.now` | Tanggal ditambahkan |

---

## 6. Real-Time Architecture
**Status: Tidak Ada (N/A).**
Aplikasi ini murni menggunakan synchronous HTTP REST request-response. Tidak ada koneksi persisten seperti WebSocket, Socket.io, Server-Sent Events (SSE), atau WebRTC yang digunakan pada codebase saat ini.

---

## 7. ADR Log (Architecture Decision Record - Codebase Historis)

| No | Keputusan Teknis Teramati | Konteks & Alasan Teramati | Dampak / Konsekuensi |
|---|---|---|---|
| 1 | Autentikasi stateless via JWT di Header | Menghindari kompleksitas session sharing cross-domain antara frontend Vite (port 5173) dan backend (port 5000/3000). | Session store MongoStore yang diinisialisasi di `server.js` menjadi redundant. |
| 2 | Kategori Finansial Hardcoded (6 Enum) | Menyederhanakan relasi data agar tidak membutuhkan tabel kategori dinamis. | Pengguna tidak dapat menambah, menghapus, atau mengubah nama kategori secara dinamis. |
| 3 | Client-Side Filtering & Pagination | Mengurangi beban query kompleks di MongoDB; dataset transaksi pengguna personal diasumsikan berukuran kecil-menengah. | Skalabilitas performa akan menurun drastis jika jumlah transaksi per user mencapai ribuan data. |
| 4 | Pemisahan Model Pemasukan & Transaksi | Transaksi hanya melacak `Pengeluaran`. `Pemasukan` dicatat sebagai entitas agregat single-record per bulan. | Transaksi pengeluaran tidak mengurangi saldo pemasukan di level database; kalkulasi sisa saldo dihitung di React UI. |
| 5 | Dual-Mode Industrial Brutalism Style | Menghilangkan nuansa visual template generik ("AI slop") menjadi gaya terminal/ledger akuntansi tegas. | Mewajibkan seluruh komponen patuh pada aturan ketat (zero border-radius, hard shadow offset, tipografi macro/mono/body). |

---

## 8. Batasan & Trade-off yang Disadari Saat Ini
- **Multi-Port Conflict**: Default port backend di kode adalah `5000`, namun frontend fallback ke `3000`, dan file `.env.example` backend menulis `PORT=3000`.
- **Tidak ada Server-Side Validation Middleware**: Validasi input di endpoint sangat minim, hanya mengandalkan casting Mongoose dan cek manual di controller.
- **Client-Side Enforced Zero-Based Budgeting**: Aturan bahwa total budget harus sama dengan pemasukan bulanan hanya divalidasi di browser (`BudgetEditor.jsx`), tidak dicek di backend API.
