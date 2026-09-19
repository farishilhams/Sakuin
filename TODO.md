# TODO.md — Sakuin Task Tracker

> Dibaca AI di awal setiap sesi untuk tahu task aktif & prioritas. Update file ini setiap kali task selesai atau status berubah.

## Status Legend
`[ ]` belum mulai · `[~]` sedang dikerjakan · `[x]` selesai · `[!]` terblokir

---

## Sprint Saat Ini: Sakuin Rebrand & Modern Transformation v2.0

### High Priority
- [x] Gabungkan nested backend & frontend ke satu repository root `Sakuin` — *selesai: 2026-09-19*
- [x] Migrasi identitas kepemilikan repositori ke **Farish Ilham Syahrani** (`farishilhams`, `farishilham.s@gmail.com`) — *selesai: 2026-09-19*
- [x] Hardening keamanan backend (Helmet, Rate Limiter, Mongo Sanitize, Safe OAuth Linking) — *selesai: 2026-09-19*
- [x] Modernisasi skema Mongoose `Transaction` dengan compound indexes dan pilihan dompet — *selesai: 2026-09-19*
- [x] Redesign menyeluruh dengan Google Font **Poppins** dan modern clean fintech UI — *selesai: 2026-09-19*
- [x] Animasi interaktif dengan **Framer Motion** (Nav layout pill, modal transitions, stat card hover, scale feedback) — *selesai: 2026-09-19*
- [x] Eliminasi seluruh teks/jargon teknis pengembang (Anti-AI Slop) menjadi copywriting komersial natural — *selesai: 2026-09-19*
- [x] Fitur Quick Expense Sat-Set (< 3 detik) dengan chip nominal instan dan pilihan sumber dana — *selesai: 2026-09-19*
- [x] Pemindai struk & bukti QRIS OCR otomatis (`src/utils/receiptParser.js` & `ReceiptScannerModal.jsx`) — *selesai: 2026-09-19*
- [x] Validasi performa build Vite (`npm run build` 100% lulus tanpa error) — *selesai: 2026-09-19*
- [x] Sinkronisasi Git & remote push ke `https://github.com/farishilhams/Sakuin.git` — *selesai: 2026-09-19*

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
