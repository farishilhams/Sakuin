import React from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const HistoryDeleteConfirmation = ({
   isOpen,
   onClose,
   onConfirm,
   historyData,
   isLoading = false,
}) => {
   if (!isOpen) return null;

   const getMonthName = (month) => {
      const months = [
         "Januari", "Februari", "Maret", "April", "Mei", "Juni",
         "Juli", "Agustus", "September", "Oktober", "November", "Desember"
      ];
      return months[month - 1] || "";
   };

   return (
      <div
         className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-[60] p-4"
         onClick={onClose}
      >
         <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-xl p-5 sm:p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
         >
            <div className="flex items-center gap-2.5 text-rose-600 dark:text-rose-400 mb-3 pb-3 border-b border-[var(--color-border)]">
               <div className="w-8 h-8 rounded-xl bg-rose-500/10 flex items-center justify-center">
                  <AlertTriangle size={18} className="stroke-[2.5]" />
               </div>
               <h3 className="font-bold text-base text-[var(--color-ink)]">
                  Hapus Arsip Periode
               </h3>
            </div>

            <p className="text-xs sm:text-sm text-[var(--color-ink-muted)] mb-3">
               Apakah Anda yakin ingin menghapus data arsip pengeluaran periode ini? Tindakan ini tidak dapat dibatalkan.
            </p>

            {historyData && (
               <div className="border border-[var(--color-border)] bg-[var(--color-bg)] rounded-xl p-3 mb-5 text-center">
                  <span className="font-bold text-sm text-[var(--color-ink)]">
                     {getMonthName(historyData.month)} {historyData.year}
                  </span>
               </div>
            )}

            <div className="flex gap-2.5 justify-end">
               <button
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl border border-[var(--color-border)] hover:bg-[var(--color-bg)] text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] text-xs font-semibold transition-colors cursor-pointer"
               >
                  Batal
               </button>
               <button
                  onClick={onConfirm}
                  disabled={isLoading}
                  className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs tracking-wide shadow-xs disabled:opacity-50 transition-colors flex items-center gap-1.5 cursor-pointer"
               >
                  {isLoading ? (
                     <>
                        <Loader2 size={14} className="animate-spin" />
                        <span>Menghapus...</span>
                     </>
                  ) : (
                     <span>Hapus Permanen</span>
                  )}
               </button>
            </div>
         </motion.div>
      </div>
   );
};

export default HistoryDeleteConfirmation;