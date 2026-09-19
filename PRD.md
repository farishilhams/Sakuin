# PRD.md — Product Requirements Document (Reverse-Engineered Draft)

> Dokumen ini disusun berdasarkan hasil reverse-engineering terhadap fitur, kode, dan alur aplikasi yang sudah terimplementasi pada sub-project `backend` dan `frontend`.
> Bagian yang bertanda **[HASIL REVERSE-ENGINEERING, PERLU KONFIRMASI]** adalah kesimpulan tersirat dari kode yang memerlukan klarifikasi dan persetujuan dari pemilik project sebelum pengembangan fitur dilanjutkan.

---

## 1. Ringkasan Produk

```
Nama Produk       : Sakuin
Arti & Filosofi   : Singkat, ramah di telinga, dari kata "masukin ke saku" atau mengelola uang saku.
Tipe Produk       : Single Page Web Application (PWA Ready) + REST API Backend
Target Pengguna   : Individu yang ingin mengontrol uang saku dan pengeluaran harian secara disiplin
Value Utama       : Pencatatan pengeluaran harian cepat, alokasi anggaran dengan prinsip
                    zero-based budgeting, pengarsipan akhir bulan, dan tracking wishlist
                    dengan estetika Industrial Brutalism (tanpa distorsi visual / AI-slop).
```

---

## 2. Fitur yang Sudah Terimplementasi (Existing Scope)

| Modul | Fitur | Status di Kode | Aturan / Logika Tersirat |
|---|---|---|---|
| **Autentikasi** | Registrasi Lokal | Selesai | Validasi form: Nama wajib, email valid, password min. 6 karakter. Otomatis membuat 6 kategori budget awal bernilai `Rp 0`. |
| **Autentikasi** | Login Email/Password | Selesai | Verifikasi hash bcrypt; menerbitkan token JWT stateless masa aktif 7 hari. |
| **Autentikasi** | Google OAuth 2.0 | Selesai | Menggunakan profil Google (ID, Display Name, Email, Avatar). Otomatis membuat user dan 6 budget awal jika baru pertama login. |
| **Autentikasi** | Proteksi Rute (Guards) | Selesai | Frontend memvalidasi token JWT via `ProtectedRoute.jsx`; Backend memverifikasi header `Bearer <token>` via `authMiddleware.js`. |
| **Autentikasi** | Logout Pengguna | Selesai | Dilakukan di sisi client dengan menghapus token & profil dari `localStorage` serta me-reset state context. |
| **Pemasukan** | Catat Pemasukan Bulanan | Selesai | Disimpan per `month` dan `year`. Menggunakan pola upsert (jika bulan/tahun sudah ada, nominal diperbarui). |
| **Anggaran** | Alokasi Budget 6 Kategori | Selesai | Kategori dibatasi statis pada 6 enum: Makanan, Transportasi, Hiburan, Kesehatan, Pendidikan, Kebutuhan Pribadi. |
| **Anggaran** | Validasi Zero-Based Budget | Selesai | **Di client-side:** Total dari 6 kategori budget HARUS sama persis dengan Pemasukan Bulanan sebelum tombol Simpan aktif. |
| **Anggaran** | Visualisasi Meteran Budget | Selesai | 10 segment blocks visual dengan status semantik: Aman (<80%), Mendekati Limit (80-100%), dan Over Budget (>100%). |
| **Transaksi** | AI Receipt / QRIS Scanner (OCR) | Selesai | Cukup foto atau unggah struk belanja/tangkapan layar QRIS m-banking, sistem otomatis membaca nominal, tanggal, dan nama merchant dengan Tesseract.js client-side OCR. |
| **Transaksi** | Catat Pengeluaran Harian | Selesai | Input: Nama transaksi, Kategori (dari 6 opsi), Nominal (Rp), Tanggal. Dilengkapi format pemisah ribuan otomatis. |
| **Transaksi** | Edit & Hapus Transaksi | Selesai | Modal edit dan konfirmasi hapus modal modern dengan Framer Motion. |
| **Transaksi** | Quick Add (Speed-Dial FAB) | Selesai | Floating Action Button modern dengan opsi cepat: Scan AI QRIS & Catat Manual. |
| **Transaksi** | Filter & Cari Multikriteria | Selesai | **Client-side only:** Pencarian teks (semua/nama/kategori/tanggal) dan filter nominal dengan operator `=`, `>`, `<`, `>=`, `<=`. |
| **Transaksi** | Pagination Transaksi | Selesai | **Client-side only:** Pembagian halaman dengan opsi jumlah baris (5, 10, 20, 50, 100, semua). |
| **Transaksi** | Ekspor Laporan PDF | Selesai | Menggunakan `jsPDF` + `autoTable` dengan branding Sakuin Faris Ilham dan kalkulasi grand total otomatis. |
| **Histori** | Pengarsipan Akhir Bulan | Selesai | Agregasi total belanja per kategori pada bulan bersangkutan ke koleksi `HistoryPengeluaran`. |
| **Histori** | Deteksi Batas Akhir Bulan | Selesai | Tampil banner peringatan jika tanggal saat ini berjarak <= 3 hari dari akhir bulan kalender berjalan. |
| **Histori** | Manajemen & Ekspor Histori | Selesai | Modal arsip untuk melihat riwayat bulan-bulan lampau, menghapus arsip, dan mengekspor seluruh histori ke dokumen PDF. |
| **Wishlist** | Manajemen Barang Impian | Selesai | Mencatat nama, harga, deskripsi, link pembelian online, dan URL gambar barang. Menghitung total barang & total estimasi dana. |
| **UI & Tema** | Modern Financial Elegance | Selesai | Font Google **Poppins**, **Framer Motion**, glassmorphism, rounded cards, responsive mobile card view, dan dark/light mode switcher. |
| **Sistem** | Mode Pemeliharaan | Selesai | Halaman Under Maintenance otomatis aktif jika environment variable `VITE_PUBLIC_MAINTENANCE_MODE=true`. |

---

## 3. Alur Pengguna Utama (User Flows)

### 3.1 Alur Autentikasi
1. Pengguna membuka aplikasi di `/login`.
2. Pengguna memilih login manual atau klik tombol **[ MASUK DENGAN GOOGLE ]**.
3. Jika akun baru mendaftar (register):
   - Sistem membuat dokumen `User`.
   - Sistem secara otomatis menginisialisasi 6 dokumen `Budget` default dengan nominal `0`.
4. Sistem menerbitkan JWT token dan mengarahkan pengguna ke halaman utama `/` (Dashboard).

### 3.2 Alur Perencanaan Keuangan Bulanan (Income & Budget)
1. Di awal bulan, pengguna memasukkan total **Pemasukan Bulanan** (misal: Rp 5.000.000) lalu klik **[ SIMPAN ]**.
2. Pengguna mengalokasikan angka ke dalam 6 kategori anggaran di **Budget Editor**.
3. Saat pengguna menekan simpan budget, sistem memeriksa:
   - Apakah `Total Budget == Pemasukan Bulanan`?
   - Jika tidak sama, proses diblokir dengan peringatan: *"TOTAL BUDGET HARUS SAMA DENGAN PEMASUKAN BULANAN"*.
   - Jika sama, 6 request pembaruan budget dikirimkan ke server.

### 3.3 Alur Pencatatan Transaksi & Pemantauan Pengeluaran
1. Pengguna mencatat transaksi pengeluaran melalui tombol modal atau Quick Add FAB.
2. Kartu statistik real-time memperbarui:
   - `#1 TOTAL BUDGET`
   - `#2 TOTAL PENGELUARAN` & `SISA UANG` (Pemasukan - Total Pengeluaran)
   - `#3 PEMASUKAN BULANAN`
3. Kotak progres tiap kategori mengupdate persentase dan warna indikator.

### 3.4 Alur Pengarsipan Akhir Bulan
1. Ketika sisa hari pada bulan kalender berjalan <= 3 hari, sistem memunculkan banner peringatan: *"PERINGATAN: BATAS AKHIR BULAN"*.
2. Pengguna menekan tombol **[ ARSIPKAN SEKARANG ]**.
3. Sistem menghitung total transaksi bulan tersebut per kategori dan menyimpannya ke koleksi `HistoryPengeluaran`.
4. Pengguna dapat membuka modal arsip kapan saja untuk mengecek riwayat bulan lalu atau mengekspornya menjadi berkas PDF.

---

## 4. Aturan Bisnis yang Tersirat dari Kode (Business Rules)

1. **Aturan Zero-Based Budgeting**:
   Uang masuk harus dialokasikan habis ke kategori anggaran (`Sum(Budgets) === MonthlyIncome`). Pengguna tidak diperbolehkan memiliki selisih sisa budget yang tidak teralokasikan saat menyimpan budget editor.
2. **Kategori Statis (Fixed 6 Categories)**:
   Aplikasi membatasi kategori pengeluaran hanya pada 6 nama kaku: `Makanan`, `Transportasi`, `Hiburan`, `Kesehatan`, `Pendidikan`, dan `Kebutuhan Pribadi`. Enum ini ditegakkan di level Mongoose schema (`Budget.js`, `Transaction.js`, `HistoryPengeluaran.js`).
3. **Pemisahan Entitas Transaksi vs Pemasukan**:
   Transaksi hanya mencatat arus keluar (pengeluaran). Arus masuk tidak memiliki riwayat transaksi detail individual (hanya satu nilai akumulasi `Pemasukan` per bulan/tahun).
4. **Isolasi Data Pengguna (Multi-Tenancy Sederhana)**:
   Setiap query data (`find`, `findOneAndUpdate`, `findOneAndDelete`) wajib memfilter berdasarkan `userId: req.user.userId`. Pengguna hanya dapat melihat dan memodifikasi datanya sendiri.
5. **Format Mata Uang Tunggal**:
   Mata uang dibatasi secara hardcoded ke Rupiah Indonesia (IDR) dengan format representasi `Rp XX.XXX.XXX`.

---

## 5. Bagian Hasil Reverse-Engineering yang Perlu Dikonfirmasi

> [!IMPORTANT]
> **Daftar Asumsi & Pertanyaan untuk Dikonfirmasi Pengguna Sebelum Lanjut Development:**

1. **[HASIL REVERSE-ENGINEERING, PERLU KONFIRMASI] — Fleksibilitas Kategori:**
   *Apakah 6 kategori pengeluaran harus tetap statis, atau pengguna nantinya diizinkan membuat, mengubah nama, dan menghapus kategori sesuai kebutuhan pribadi?*
2. **[HASIL REVERSE-ENGINEERING, PERLU KONFIRMASI] — Kebijakan Zero-Based Budgeting:**
   *Apakah aturan `Total Budget == Pemasukan` wajib dipertahankan secara ketat, atau apakah pengguna boleh memiliki alokasi tabungan/investasi bebas tanpa harus menghabiskan seluruh nominal pemasukan ke 6 kategori pengeluaran?*
3. **[HASIL REVERSE-ENGINEERING, PERLU KONFIRMASI] — Siklus Data Saat Pengarsipan Bulanan:**
   *Saat pengguna mengarsipkan pengeluaran bulanan di akhir bulan, apakah transaksi harian bulan tersebut seharusnya tetap berada di tabel transaksi, ataukah harus dipindahkan/dibersihkan untuk membuka lembaran bulan baru?*
4. **[HASIL REVERSE-ENGINEERING, PERLU KONFIRMASI] — Pengurangan Saldo untuk Wishlist:**
   *Saat ini Wishlist hanya berfungsi sebagai katalog daftar keinginan independen. Apakah di masa depan direncanakan ada fitur "Beli Item Wishlist" yang memotong saldo/mencatat transaksi pengeluaran secara otomatis?*
5. **[HASIL REVERSE-ENGINEERING, PERLU KONFIRMASI] — Riwayat Multi-Bulan di Dashboard:**
   *Dashboard saat ini secara default hanya menampilkan transaksi bulan kalender berjalan (`getMonth() === currentMonth`). Apakah perlu ditambahkan selector bulan/tahun di dashboard utama agar user bisa meninjau transaksi bulan-bulan sebelumnya tanpa harus lewat modal arsip?*

---

## 6. Non-Functional Requirements (Tersirat dari Kode)
- **Response Time**: Operasi data cepat karena query MongoDB sangat terindeks pada `userId`.
- **Offline / PWA**: Menggunakan Service Worker VitePWA untuk caching shell aplikasi dan manifest standalone.
- **Keamanan Token**: Token JWT disimpan di `localStorage` client dan dikirim via header HTTP `Authorization: Bearer <token>`. Masa kedaluwarsa token adalah 7 hari.
- **Estetika & Responsivitas**: Tampilan wajib konsisten menganut prinsip Swiss Industrial Print (Light) / Tactical Telemetry (Dark), bebas dari sudut membulat (`border-radius: 0`), dan responsif pada perangkat mobile (breakpoint 768px).
