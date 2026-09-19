import React from "react";
import { Wrench, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

const UnderMaintenancePage = () => {
   return (
      <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-ink)] flex items-center justify-center p-6">
         <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-lg w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl p-8 sm:p-10 shadow-xl text-center"
         >
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto mb-5">
               <Wrench size={30} className="stroke-[2.2]" />
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--color-ink)] tracking-tight mb-2">
               Sistem Sedang Pemeliharaan
            </h1>

            <p className="text-xs sm:text-sm text-[var(--color-ink-muted)] mb-6 max-w-md mx-auto leading-relaxed">
               Kami sedang melakukan peningkatan performa infrastruktur server untuk memastikan pencatatan keuangan Anda tetap cepat dan aman.
            </p>

            <div className="space-y-3 text-left mb-6">
               <div className="border border-[var(--color-border)] rounded-2xl p-4 bg-[var(--color-bg)]">
                  <span className="text-xs font-bold text-[var(--color-ink)] block mb-1">
                     Status Operasional
                  </span>
                  <p className="text-xs text-[var(--color-ink-muted)] leading-relaxed">
                     Pembaruan berkala database dan pengoptimalan waktu respons API.
                  </p>
               </div>

               <div className="border border-[var(--color-border)] rounded-2xl p-4 bg-[var(--color-bg)]">
                  <span className="text-xs font-bold text-[var(--color-ink)] block mb-1">
                     Perkiraan Waktu
                  </span>
                  <p className="text-xs text-[var(--color-ink-muted)] leading-relaxed">
                     Layanan akan kembali beroperasi dalam waktu singkat. Silakan muat ulang halaman beberapa saat lagi.
                  </p>
               </div>
            </div>

            <motion.button
               whileHover={{ scale: 1.02 }}
               whileTap={{ scale: 0.98 }}
               type="button"
               onClick={() => window.location.reload()}
               className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-md shadow-emerald-600/20 transition-colors cursor-pointer"
            >
               <RefreshCw size={15} className="stroke-[2.2]" />
               <span>Muat Ulang Halaman</span>
            </motion.button>
         </motion.div>
      </div>
   );
};

export default UnderMaintenancePage;
