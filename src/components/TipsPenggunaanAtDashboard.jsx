import React, { useState } from "react";
import { ChevronDown, ChevronUp, BookOpen, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function TipsPenggunaanAtDashboard() {
   const [isOpen, setIsOpen] = useState(false);

   const tips = [
      {
         step: "01",
         title: "Setup Budget & Pemasukan",
         desc: "Tentukan estimasi dana masuk dan alokasikan budget per kategori belanja Anda.",
      },
      {
         step: "02",
         title: "Pindai Struk & Bukti QRIS",
         desc: "Gunakan tombol Pindai Struk di pojok kanan bawah atau header untuk membaca struk dan QRIS otomatis.",
      },
      {
         step: "03",
         title: "Catat Pengeluaran Harian",
         desc: "Setiap transaksi otomatis memperbarui grafik per kategori secara real-time.",
      },
      {
         step: "04",
         title: "Arsip Bulanan & Wishlist",
         desc: "Tutup buku di akhir bulan dan rencanakan tabungan barang impian di menu Wishlist.",
      },
   ];

   return (
      <div className="w-full">
         <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full text-xs font-semibold py-2.5 px-3.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] hover:bg-slate-200 dark:hover:bg-slate-800 text-[var(--color-ink)] flex items-center justify-between transition-colors cursor-pointer"
         >
            <span className="flex items-center gap-2">
               <BookOpen size={15} className="text-emerald-500 stroke-[2.2]" />
               <span>Panduan Cepat Penggunaan Sakuin</span>
            </span>
            {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
         </button>

         <AnimatePresence>
            {isOpen && (
               <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden mt-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] p-4 space-y-3"
               >
                  {tips.map((item) => (
                     <div
                        key={item.step}
                        className="flex items-start gap-3 pb-2.5 border-b border-[var(--color-border)] last:border-b-0 last:pb-0"
                     >
                        <span className="text-[11px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-md shrink-0">
                           {item.step}
                        </span>
                        <div>
                           <h4 className="text-xs font-bold text-[var(--color-ink)]">
                              {item.title}
                           </h4>
                           <p className="text-xs text-[var(--color-ink-muted)] mt-0.5">
                              {item.desc}
                           </p>
                        </div>
                     </div>
                  ))}
               </motion.div>
            )}
         </AnimatePresence>
      </div>
   );
}
