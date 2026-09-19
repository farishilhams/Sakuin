import React, { useState, useEffect } from "react";
import api from "../utils/api";
import toast from "react-hot-toast";
import { History, Archive, AlertTriangle, Check, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const HistoryButtons = ({
   onOpenHistoryModal,
   isLoadingPengeluaran,
   setIsLoadingPengeluaran,
   historyUpdated = 0,
}) => {
   const [isEndOfMonth, setIsEndOfMonth] = useState(false);
   const [alreadySaved, setAlreadySaved] = useState(false);
   const [checking, setChecking] = useState(true);

   useEffect(() => {
      const checkExistingHistory = async () => {
         try {
            setChecking(true);
            const month = new Date().getMonth() + 1;
            const year = new Date().getFullYear();

            const response = await api.get("/history");
            const historyExists = response.data.some(
               (item) => item.month === month && item.year === year
            );

            setAlreadySaved(historyExists);

            const today = new Date();
            const lastDay = new Date(
               today.getFullYear(),
               today.getMonth() + 1,
               0
            ).getDate();
            const currentDay = today.getDate();

            setIsEndOfMonth(lastDay - currentDay <= 3);
         } catch (error) {
            console.error("Error checking history status:", error);
         } finally {
            setChecking(false);
         }
      };

      checkExistingHistory();
   }, [historyUpdated]);

   const handleSaveHistory = async () => {
      if (alreadySaved) {
         toast.error("Pengeluaran bulan ini sudah diarsipkan sebelumnya");
         return;
      }

      setIsLoadingPengeluaran(true);
      try {
         const month = new Date().getMonth() + 1;
         const year = new Date().getFullYear();
         await api.post("/history", { month, year });
         toast.success("Pengeluaran bulan ini berhasil diarsipkan!");
         setAlreadySaved(true);
      } catch (error) {
         console.error("Error saving history", error);
         if (error.response && error.response.status === 409) {
            toast.error("Pengeluaran bulan ini sudah diarsipkan sebelumnya");
            setAlreadySaved(true);
         } else {
            toast.error("Gagal menyimpan arsip pengeluaran");
         }
      } finally {
         setIsLoadingPengeluaran(false);
      }
   };

   return (
      <div className="flex flex-col gap-4 mb-8">
         {/* End of Month Alert */}
         {isEndOfMonth && !alreadySaved && (
            <div className="border border-amber-500/30 bg-amber-500/10 rounded-2xl p-4 flex items-center gap-3.5">
               <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                  <AlertTriangle size={20} className="stroke-[2.2]" />
               </div>
               <div>
                  <h3 className="text-xs font-bold text-amber-700 dark:text-amber-300">
                     Peringatan Akhir Bulan
                  </h3>
                  <p className="text-xs text-[var(--color-ink)] mt-0.5">
                     Bulan berjalan segera berakhir. Segera arsipkan rekapan pengeluaran sebelum memasuki periode baru.
                  </p>
               </div>
            </div>
         )}

         {/* Action Buttons */}
         <div className="flex flex-col sm:flex-row justify-end gap-2.5">
            {/* View History Button */}
            <motion.button
               whileHover={{ scale: 1.02 }}
               whileTap={{ scale: 0.98 }}
               onClick={onOpenHistoryModal}
               className="px-4 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-ink)] hover:bg-[var(--color-bg)] font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
            >
               <History size={16} className="stroke-[2.2] text-emerald-500" />
               <span>Lihat Arsip Histori</span>
            </motion.button>

            {/* Save History Button */}
            <motion.button
               whileHover={{ scale: alreadySaved ? 1 : 1.02 }}
               whileTap={{ scale: alreadySaved ? 1 : 0.98 }}
               onClick={handleSaveHistory}
               disabled={isLoadingPengeluaran || alreadySaved || checking}
               className={`px-5 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 shadow-xs ${
                  alreadySaved
                     ? "bg-[var(--color-bg)] text-[var(--color-ink-muted)] border border-[var(--color-border)] cursor-not-allowed opacity-75"
                     : "bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
               }`}
            >
               {isLoadingPengeluaran ? (
                  <>
                     <Loader2 size={15} className="animate-spin" />
                     <span>Menyimpan Arsip...</span>
                  </>
               ) : checking ? (
                  <span>Memeriksa Status...</span>
               ) : alreadySaved ? (
                  <>
                     <Check size={16} className="text-emerald-500 stroke-[3]" />
                     <span>Periode Ini Sudah Diarsip</span>
                  </>
               ) : (
                  <>
                     <Archive size={16} className="stroke-[2.2]" />
                     <span>Arsipkan Pengeluaran Bulan Ini</span>
                  </>
               )}
            </motion.button>
         </div>
      </div>
   );
};

export default HistoryButtons;