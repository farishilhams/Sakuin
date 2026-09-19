import React from "react";
import { X, BookOpen, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export default function TutorialPenggunaanAtLogin({ setShowTutorial }) {
   const steps = [
      {
         num: "01",
         title: "Registrasi & Masuk Akun",
         desc: "Buat akun baru menggunakan nama lengkap, email aktif, dan kata sandi minimal 6 karakter. Anda juga dapat masuk langsung dengan akun Google dalam satu klik.",
      },
      {
         num: "02",
         title: "Atur Pemasukan & Alokasi Anggaran",
         desc: "Di dashboard utama, masukkan estimasi saldo dana masuk bulanan dan tetapkan batas anggaran per kategori seperti amplop keuangan pintar.",
      },
      {
         num: "03",
         title: "Catat Pengeluaran Sat-Set Super Cepat",
         desc: "Gunakan tombol cepat tambah untuk mencatat nominal dan kategori secara instan. Saldo dan meteran batas anggaran akan terhitung otomatis.",
      },
      {
         num: "04",
         title: "Pindai Struk & Bukti Transfer Otomatis",
         desc: "Cukup foto struk belanjaan atau unggah tangkapan layar m-banking atau bukti QRIS. Sistem otomatis mengekstrak nominal, tanggal, dan nama merchant.",
      },
      {
         num: "05",
         title: "Target Tabungan & Wishlist Barang",
         desc: "Kelola daftar barang impian lengkap dengan estimasi harga, link toko, dan pantau akumulasi tabungan hingga tercapai.",
      },
   ];

   return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
         <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl shadow-2xl w-full max-w-lg max-h-[85vh] flex flex-col overflow-hidden"
         >
            {/* Header */}
            <div className="p-5 border-b border-[var(--color-border)] flex items-center justify-between">
               <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                     <BookOpen size={18} className="stroke-[2.2]" />
                  </div>
                  <div>
                     <h2 className="font-bold text-base sm:text-lg text-[var(--color-ink)] leading-tight">
                        Panduan Penggunaan Sakuin
                     </h2>
                     <p className="text-xs text-[var(--color-ink-muted)]">
                        Langkah mudah mengelola uang saku dan arus kas harian
                     </p>
                  </div>
               </div>

               <button
                  type="button"
                  onClick={() => setShowTutorial(false)}
                  className="w-8 h-8 rounded-xl bg-[var(--color-bg)] hover:bg-slate-200 dark:hover:bg-slate-800 text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Tutup"
               >
                  <X size={18} />
               </button>
            </div>

            {/* Body */}
            <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4">
               <p className="text-xs text-[var(--color-ink-muted)] leading-relaxed">
                  Sakuin dirancang dengan filosofi kecepatan dan kemudahan agar pencatatan keuangan tidak terasa membebani rutinitas harian Anda.
               </p>

               <div className="space-y-3">
                  {steps.map((step) => (
                     <div
                        key={step.num}
                        className="border border-[var(--color-border)] bg-[var(--color-bg)] rounded-2xl p-3.5 flex gap-3.5 items-start"
                     >
                        <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-500/15 rounded-xl px-2 py-1 shrink-0 font-mono">
                           {step.num}
                        </span>
                        <div>
                           <h4 className="text-xs font-bold text-[var(--color-ink)]">
                              {step.title}
                           </h4>
                           <p className="text-xs text-[var(--color-ink-muted)] mt-1 leading-relaxed">
                              {step.desc}
                           </p>
                        </div>
                     </div>
                  ))}
               </div>

               <div className="p-3.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-xs text-[var(--color-ink-muted)] flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                  <span>
                     Repositori & Bantuan:{" "}
                     <a
                        href="https://github.com/farishilhams/Sakuin"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline"
                     >
                        github.com/farishilhams/Sakuin
                     </a>
                  </span>
               </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-[var(--color-border)] flex justify-end">
               <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => setShowTutorial(false)}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer"
               >
                  Tutup Panduan
               </motion.button>
            </div>
         </motion.div>
      </div>
   );
}