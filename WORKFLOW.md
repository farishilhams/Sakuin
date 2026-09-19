# WORKFLOW.md — Alur Kerja Development

> Dibaca AI sebelum commit, membuat branch, atau menyentuh konfigurasi environment/CI-CD.

## 1. Branching Strategy
```
main        → production, selalu deployable
develop     → integrasi fitur sebelum ke main
feature/*   → 1 branch per fitur, dari develop
fix/*       → bugfix
hotfix/*    → perbaikan darurat langsung dari main
```

## 2. Commit Convention
Gunakan format **Conventional Commits**:
```
feat: tambah fitur X
fix: perbaiki bug Y
refactor: rapikan struktur Z tanpa ubah behavior
docs: update dokumentasi
test: tambah/perbaiki test
chore: tugas non-kode (dependency update, config, dll)
```
> Commit kecil & sering. Satu commit = satu perubahan logis, supaya gampang di-rollback kalau hasil AI bermasalah.

## 3. Pull Request / Review (kalau tim / kalau solo tetap disarankan)
- PR wajib deskripsi: apa yang berubah & kenapa.
- Checklist sebelum merge:
  - [ ] Test lulus
  - [ ] Tidak ada secret/console.log debug tertinggal
  - [ ] Sesuai konvensi di `CLAUDE.md`
  - [ ] `TODO.md` diupdate

## 4. Environment
```
development : .env.development — data dummy, debug ON
staging     : .env.staging     — mirip production, buat testing akhir
production  : .env.production  — debug OFF, secret dari secret manager
```
> Jangan pernah pakai kredensial production di environment lain.

## 5. CI/CD Pipeline (Minimal)
```
Setiap push ke branch fitur    → run lint + unit test
Setiap PR ke develop/main      → run full test suite
Merge ke main                  → build + deploy otomatis (kalau sudah siap)
```

## 6. Checklist Sebelum Deploy ke Production
> Checklist keamanan lengkap ada di `SECURITY.md` (Bagian A = audit AI sebelum staging, Bagian B = 71 poin cek manual sebelum production). Ringkasan cepat di sini:
- [ ] Semua test lulus di staging
- [ ] Sudah jalankan audit `SECURITY.md § Bagian A` lewat AI sebelum push ke staging
- [ ] Sudah cek manual `SECURITY.md § Bagian B` (71 poin) sebelum go-live
- [ ] Environment variable production sudah benar & tidak bocor
- [ ] Debug mode off
- [ ] Migration database sudah dijalankan & dicek
- [ ] Rollback plan siap kalau deploy gagal

## 7. Aturan untuk AI Terkait Workflow
1. AI tidak boleh langsung commit/push tanpa diminta eksplisit.
2. AI wajib menyarankan commit message sesuai convention di atas.
3. Kalau AI mengubah struktur/config penting, sarankan branch baru, jangan langsung di `main`/`develop`.
