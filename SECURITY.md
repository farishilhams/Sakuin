# SECURITY.md — Checklist Keamanan Website (Universal, Semua Framework/Bahasa)

> Dua bagian di file ini dipakai di momen berbeda dalam alur development:
> - **Bagian A (16 Poin)** → ditempel ke AI coding assistant untuk audit kode, sebelum deploy ke staging.
> - **Bagian B (71 Poin)** → dicek MANUAL oleh kamu sendiri sebelum deploy final ke production/hosting (banyak poin di sini di luar jangkauan AI editor kode — infra, server, firewall, dll).
>
> Referensi dari: `WORKFLOW.md § 6 Checklist Sebelum Deploy ke Production`.

---

## BAGIAN A — 16 Poin untuk Audit AI (Sebelum Deploy ke Staging)

### Prompt siap tempel ke AI editor kode:
```
Audit codebase proyek ini menggunakan 16 Prinsip Keamanan Web Universal berikut,
berlaku untuk framework/bahasa apa pun. Telusuri seluruh route, middleware, model,
query database, penanganan session, dan input handling. Buatkan laporan berisi:
1. File dan baris kode yang melanggar prinsip-prinsip ini.
2. Penjelasan risiko dari tiap temuan.
3. Refactor kode perbaikan yang aman dan siap diterapkan langsung.

PRINSIP:

1. Autentikasi & Otorisasi Server-Side
   - Semua pengecekan hak akses dilakukan di server, bukan hanya disembunyikan di UI.
   - Setiap endpoint privat memverifikasi role/permission sebelum eksekusi logika bisnis.

2. Hash Password
   - Password disimpan dengan algoritma hash lambat (bcrypt/argon2id), salt otomatis.
   - Tidak ada password disimpan plaintext atau dienkripsi dua arah.

3. Session & Token Aman
   - Session/token divalidasi di server pada setiap request.
   - Cookie session memakai atribut HttpOnly, Secure, SameSite=Lax/Strict.

4. Reset Password Aman
   - Token reset acak kriptografis, sekali pakai, expired singkat (15-30 menit).
   - Respons form lupa password bersifat generik (anti user enumeration).

5. Validasi & Sanitasi Input
   - Semua input divalidasi dengan pendekatan allowlist (tipe, format, panjang).
   - Field/parameter yang tidak terdaftar ditolak, bukan diabaikan begitu saja.

6. Anti SQL/NoSQL Injection
   - Semua query pakai parameterized query / ORM-ODM.
   - Tidak ada string query yang di-concatenate langsung dari input user.

7. Anti XSS (Cross-Site Scripting)
   - Semua data dinamis di-escape sesuai konteks output (HTML/atribut/JS).
   - Tidak ada rendering HTML mentah dari input user tanpa sanitasi.

8. Proteksi CSRF
   - Semua request pengubah data (POST/PUT/PATCH/DELETE) dilindungi CSRF token
     atau kebijakan cookie SameSite yang ketat.

9. Konfigurasi CORS Ketat
   - Access-Control-Allow-Origin dibatasi ke domain yang sah.
   - Tidak ada wildcard (*) pada rute yang menerima cookie/kredensial.

10. Pencegahan IDOR (Insecure Direct Object Reference)
    - Setiap operasi baca/ubah/hapus data memverifikasi kepemilikan data
      (id_objek milik user yang sedang login, bukan sekadar id valid).

11. Secrets Tidak Hardcode
    - Tidak ada API key, DB credential, atau token tertulis langsung di kode.
    - Seluruh secret dimuat lewat environment variable / secret manager.

12. Penanganan File Upload
    - Validasi tipe file berdasarkan magic bytes, bukan ekstensi/MIME dari client saja.
    - Nama file di-generate ulang (UUID/random) sebelum disimpan.
    - File disimpan di lokasi yang tidak bisa dieksekusi sebagai script.

13. Error Handling Aman
    - Mode debug nonaktif di kode yang mengarah ke environment production.
    - Pesan error ke user bersifat netral, detail teknis (stack trace, query)
      hanya masuk log internal, tidak dikirim ke response.

14. Rate Limiting di Level Aplikasi
    - Endpoint sensitif (login, register, forgot-password, OTP) punya
      pembatasan request per IP/akun di level middleware/aplikasi.

15. Security Header via Middleware/Config Aplikasi
    - Set header: X-Content-Type-Options: nosniff, X-Frame-Options,
      Content-Security-Policy — via middleware atau konfigurasi app-level.

16. Query/Permission Database Minimal
    - Kode aplikasi hanya menggunakan operasi DML (SELECT/INSERT/UPDATE/DELETE)
      yang relevan, tidak menjalankan operasi DDL/administratif dari runtime app.
```

---

## BAGIAN B — 71 Poin untuk Checklist Manual (Sebelum Deploy Final/Production)

### 1. Autentikasi & Otorisasi
1. Verifikasi identitas user dilakukan sepenuhnya di **server-side**, tidak pernah percaya validasi dari client.
2. Terapkan **role-based / permission-based access control** — setiap endpoint mengecek hak akses, bukan hanya status login.
3. Cek ulang otorisasi di **setiap request**, termasuk saat mengakses resource milik user lain via ID (cegah IDOR).
4. Area admin/dashboard internal punya lapisan proteksi tambahan (misal IP whitelist atau MFA), tidak hanya login biasa.
5. Terapkan **Multi-Factor Authentication (MFA)** minimal untuk akun admin/privileged.
6. Batasi percobaan login (lockout/delay) untuk mencegah brute force.

### 2. Password & Kredensial
7. Password di-hash dengan algoritma lambat & aman (bcrypt, argon2, scrypt) — tidak pernah plaintext atau MD5/SHA1 polos.
8. Gunakan salt otomatis (bawaan algoritma hash modern).
9. Terapkan kebijakan kompleksitas password minimal & cek terhadap daftar password bocor bila memungkinkan.
10. Proses reset password memakai token sekali pakai dengan masa berlaku singkat, dikirim lewat kanal terverifikasi.
11. Jangan pernah mengirim password asli lewat email/notifikasi.

### 3. Session & Token Management
12. Session/token disimpan dengan flag Secure, HttpOnly, SameSite.
13. Session punya masa expired jelas & mekanisme auto-logout saat idle.
14. Session di-invalidasi saat logout dan saat password diganti.
15. Jika pakai JWT: gunakan expiry pendek, refresh token terpisah, dan validasi signature di server setiap request.

### 4. Validasi & Sanitasi Input
16. Semua input dari user divalidasi: tipe, format, panjang, range.
17. Validasi dilakukan di server-side, validasi client-side hanya untuk UX.
18. Sanitasi/escape input sebelum disimpan atau ditampilkan kembali.
19. Gunakan whitelist validation, bukan blacklist.

### 5. Proteksi Serangan Injeksi
20. Gunakan parameterized query / prepared statement / ORM — anti SQL Injection.
21. Escape/encode semua output ke HTML, JS, URL sesuai konteksnya — anti XSS.
22. Terapkan Content Security Policy (CSP) header untuk mengurangi dampak XSS.
23. Hindari eksekusi command sistem dari input user; sanitasi ketat bila terpaksa — anti Command Injection.
24. Validasi path file dari input user untuk mencegah Path/Directory Traversal.
25. Nonaktifkan external entity processing pada parsing XML/JSON — anti XXE.

### 6. CSRF & Request Forgery
26. Gunakan CSRF token pada semua form/request yang mengubah data.
27. Validasi token CSRF di server sebelum memproses request.
28. Gunakan cookie dengan atribut SameSite=Lax/Strict sebagai lapisan tambahan.

### 7. CORS & Header Keamanan
29. Konfigurasi CORS ketat — jangan wildcard (*) di production, apalagi bersamaan dengan credentials.
30. Aktifkan security header standar: Strict-Transport-Security, X-Content-Type-Options, X-Frame-Options, Referrer-Policy.
31. Nonaktifkan header yang membocorkan info stack/framework (misal X-Powered-By).

### 8. Transport & Domain Security
32. Paksa HTTPS di seluruh endpoint, redirect otomatis dari HTTP ke HTTPS.
33. Sertifikat SSL/TLS valid, tidak expired, dan auto-renewal aktif.
34. Nonaktifkan protokol/cipher TLS versi lama yang rentan (TLS 1.0/1.1).

### 9. Secrets & Environment Configuration
35. Semua kredensial sensitif disimpan di environment variable, bukan hardcode.
36. File environment tidak pernah ter-commit ke repository — pastikan masuk .gitignore.
37. File environment tidak bisa diakses lewat URL publik.
38. Cek riwayat commit git untuk memastikan tidak ada secret yang pernah ter-push.
39. API key/token diberi scope & permission seminimal mungkin, serta dirotasi berkala.
40. Gunakan secret manager untuk environment production skala besar.

### 10. Konfigurasi Production
41. Debug mode dimatikan di environment production.
42. Pesan error ke user bersifat umum — tidak membocorkan stack trace/struktur DB.
43. Log error detail tetap dicatat di sisi server, hanya disembunyikan dari respons ke user.
44. Nonaktifkan endpoint/fitur development atau testing sebelum go-live.
45. Matikan directory listing di web server.

### 11. Database
46. Database tidak bisa diakses langsung dari internet publik — batasi dengan firewall.
47. Gunakan user database dengan permission terbatas (least privilege), jangan pakai root/superuser.
48. Backup database terjadwal, terenkripsi, dan diuji proses restore-nya.
49. Enkripsi data sensitif (PII, data finansial) at-rest bila relevan.

### 12. Upload File
50. Validasi tipe file berdasarkan konten asli (magic bytes), bukan ekstensi/MIME saja.
51. Batasi ukuran file yang diizinkan diunggah.
52. Simpan file upload di luar folder yang bisa dieksekusi sebagai script.
53. Scan file upload dengan antivirus/malware scanner bila fitur krusial.
54. Generate ulang nama file upload (random/UUID) sebelum disimpan.

### 13. Rate Limiting & Abuse Prevention
55. Terapkan rate limiting per IP/user pada endpoint sensitif.
56. Terapkan CAPTCHA/challenge pada form yang rawan bot.
57. Terapkan throttling pada API untuk mencegah abuse dan DDoS skala kecil.

### 14. Dependency & Supply Chain
58. Audit dependency pihak ketiga terhadap known vulnerability sebelum deploy.
59. Update dependency yang punya celah keamanan kritikal.
60. Verifikasi integritas package (lockfile) agar konsisten antar environment.

### 15. Infrastruktur & Deployment
61. Server/OS di-update dengan patch keamanan terbaru sebelum go-live.
62. Tutup port yang tidak digunakan; hanya buka port yang benar-benar diperlukan.
63. Pisahkan environment development, staging, dan production sepenuhnya.
64. Proses CI/CD tidak menyimpan secret dalam log build.
65. Siapkan proses rollback cepat jika deployment bermasalah.

### 16. Monitoring & Response
66. Aktifkan logging untuk aktivitas penting (login, perubahan data sensitif, akses admin).
67. Siapkan monitoring/alerting untuk aktivitas mencurigakan.
68. Siapkan rencana respons insiden dasar sebelum launch.

### 17. Pengujian Akhir Sebelum Go-Live
69. Lakukan penetration testing/security scan sebelum deploy final.
70. Uji semua poin di atas pada environment staging yang semirip mungkin dengan production.
71. Review checklist ini bersama tim sebagai bagian dari go-live sign-off.

---

## Ringkasan Kapan Pakai Bagian Mana

| Momen | Pakai Bagian |
|---|---|
| Selesai coding fitur, sebelum push ke staging | A (16 Poin) — tempel ke AI |
| Sebelum domain/hosting live ke publik | B (71 Poin) — cek manual satu-satu |

> Bagian B tidak bisa "dikerjakan" AI di editor kode — banyak poinnya soal infra, server fisik, sertifikat, dan proses tim yang butuh tindakan manual di luar kode.
