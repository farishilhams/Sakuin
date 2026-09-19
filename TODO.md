# TODO.md — Sakuin Task Tracker

> Dibaca AI di awal setiap sesi untuk tahu task aktif & prioritas. Update file ini setiap kali task selesai atau status berubah.

## Status Legend
`[ ]` belum mulai · `[~]` sedang dikerjakan · `[x]` selesai · `[!]` terblokir

---

## Sprint Saat Ini: Sakuin Rebrand & Modern Transformation v2.0

### High Priority
- [x] Gabungkan nested backend & frontend ke satu repository root `Sakuin` — *selesai: 2026-09-19*
- [x] Ubah identitas pemilik/developer dari `abdulrahemfaqih` ke `Faris Ilham` (`farishilhams`, `farishilham.s@gmail.com`) — *selesai: 2026-09-19*
- [x] Redesign menyeluruh dengan Google Font **Poppins** dan modern rounded tokens — *selesai: 2026-09-19*
- [x] Tambahkan animasi interaktif dengan **Framer Motion** (Nav layout pill, modal transitions, stat card hover, speed-dial FAB) — *selesai: 2026-09-19*
- [x] Optimasi multi-device responsif (Laptop, Tablet, Android, iPhone/iOS dengan card feed mobile) — *selesai: 2026-09-19*
- [x] Implementasi fitur **AI Receipt / QRIS Scanner (OCR)** dengan kamera langsung & upload struk/screenshot m-banking — *selesai: 2026-09-19*
- [x] Konfigurasi environment & dokumentasi Google OAuth 2.0 untuk Faris Ilham — *selesai: 2026-09-19*
- [x] Validasi performa build Vite (`npm run build` lolos tanpa error) — *selesai: 2026-09-19*
- [~] Push commit ke repository GitHub `https://github.com/farishilhams/Sakuin.git`

### Medium Priority / Backlog
- [ ] Tambahkan filter tanggal rentang custom (Date range picker)
- [ ] Integrasi webhook notifikasi Telegram/WhatsApp untuk pengingat budget
- [ ] Export format Excel / CSV di samping PDF

---

## Selesai (Recent)
- [x] Inisialisasi Git & Remote: `origin -> https://github.com/farishilhams/Sakuin.git` — *selesai: 2026-09-19*
- [x] Pembuatan parser struk & QRIS Indonesia `src/utils/receiptParser.js` — *selesai: 2026-09-19*
- [x] Pembuatan modal OCR canggih `src/components/ReceiptScannerModal.jsx` — *selesai: 2026-09-19*
- [x] Pembaruan `DESIGN.md`, `PRD.md`, `ARCHITECTURE.md`, `CLAUDE.md` — *selesai: 2026-09-19*
