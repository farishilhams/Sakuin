import React, { useState, useEffect } from "react";
import api from "../utils/api";
import toast from "react-hot-toast";
import HistoryDeleteConfirmation from "./HistoryDeleteConfirmation";
import ExportHistoryPDF from "./ExportHistoryPDFS";
import { X, Trash2, Archive, Calendar, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const HistoryModal = ({ onClose, onDelete }) => {
   const [history, setHistory] = useState([]);
   const [loadingDelete, setLoadingDelete] = useState(null);
   const [isLoading, setIsLoading] = useState(true);
   const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
   const [historyToDelete, setHistoryToDelete] = useState(null);

   useEffect(() => {
      const fetchData = async () => {
         try {
            setIsLoading(true);
            const historyRes = await api.get("/history");
            setHistory(historyRes.data || []);
         } catch (error) {
            console.error("Error fetching history", error);
            toast.error("Gagal memuat arsip histori");
         } finally {
            setIsLoading(false);
         }
      };

      fetchData();
   }, []);

   const confirmDelete = (item) => {
      setHistoryToDelete(item);
      setShowDeleteConfirmation(true);
   };

   const handleDelete = async () => {
      if (!historyToDelete) return;

      try {
         setLoadingDelete(historyToDelete._id);
         await api.delete(`/history/${historyToDelete._id}`);
         setHistory(history.filter((item) => item._id !== historyToDelete._id));
         toast.success("Arsip histori berhasil dihapus!");
         if (onDelete) {
            onDelete();
         }
      } catch (error) {
         console.error("Error deleting history", error);
         toast.error("Gagal menghapus arsip histori");
      } finally {
         setLoadingDelete(null);
         setShowDeleteConfirmation(false);
         setHistoryToDelete(null);
      }
   };

   const calculateTotal = (totals) => {
      return Object.values(totals || {}).reduce((acc, curr) => acc + (curr || 0), 0);
   };

   const getMonthName = (month) => {
      const months = [
         "Januari", "Februari", "Maret", "April", "Mei", "Juni",
         "Juli", "Agustus", "September", "Oktober", "November", "Desember"
      ];
      return months[month - 1] || "";
   };

   return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
         <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-xl w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden"
         >
            {/* Header Modal */}
            <div className="p-4 sm:p-5 border-b border-[var(--color-border)] flex items-center justify-between gap-4">
               <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                     <Archive size={18} className="stroke-[2.2]" />
                  </div>
                  <div>
                     <h2 className="font-bold text-base sm:text-lg text-[var(--color-ink)] leading-tight">
                        Arsip Histori Pengeluaran
                     </h2>
                     <p className="text-xs text-[var(--color-ink-muted)]">
                        Rekapan total pengeluaran per bulan yang telah ditutup
                     </p>
                  </div>
               </div>

               <div className="flex items-center gap-2">
                  {!isLoading && history.length > 0 && (
                     <ExportHistoryPDF history={history} />
                  )}
                  <button
                     onClick={onClose}
                     className="w-8 h-8 rounded-xl bg-[var(--color-bg)] hover:bg-slate-200 dark:hover:bg-slate-800 text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] flex items-center justify-center transition-colors cursor-pointer"
                     aria-label="Tutup"
                  >
                     <X size={18} />
                  </button>
               </div>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
               {isLoading ? (
                  <div className="py-14 text-center text-xs text-[var(--color-ink-muted)] flex flex-col items-center justify-center gap-2">
                     <Loader2 size={24} className="animate-spin text-emerald-500" />
                     <span>Memuat data arsip...</span>
                  </div>
               ) : history.length ? (
                  history.map((item, index) => {
                     const total = calculateTotal(item.totals);

                     return (
                        <div
                           key={item._id}
                           className="border border-[var(--color-border)] bg-[var(--color-surface)] rounded-xl p-4 hover:border-emerald-500/30 transition-all"
                        >
                           {/* Period & Delete */}
                           <div className="flex items-center justify-between pb-3 border-b border-[var(--color-border)] mb-3">
                              <div className="flex items-center gap-2">
                                 <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                                    #{index + 1}
                                 </span>
                                 <span className="font-bold text-sm text-[var(--color-ink)]">
                                    {getMonthName(item.month)} {item.year}
                                 </span>
                              </div>

                              <button
                                 onClick={() => confirmDelete(item)}
                                 disabled={loadingDelete === item._id}
                                 className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                                 title="Hapus Arsip Periode Ini"
                              >
                                 <Trash2 size={15} />
                              </button>
                           </div>

                           {/* Categories Breakdown */}
                           <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                              {Object.entries(item.totals || {}).map(([category, amount]) => (
                                 <div
                                    key={category}
                                    className="border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 rounded-lg flex justify-between text-xs"
                                 >
                                    <span className="text-[var(--color-ink-muted)]">
                                       {category}
                                    </span>
                                    <span className="font-bold font-mono tabular-nums text-[var(--color-ink)]">
                                       Rp {Number(amount).toLocaleString("id-ID")}
                                    </span>
                                 </div>
                              ))}
                           </div>

                           {/* Total row */}
                           <div className="pt-2.5 border-t border-[var(--color-border)] flex items-center justify-between text-xs">
                              <span className="font-semibold text-[var(--color-ink-muted)]">
                                 Total Pengeluaran Periode:
                              </span>
                              <span className="font-extrabold text-sm sm:text-base font-mono tabular-nums text-emerald-600 dark:text-emerald-400">
                                 Rp {Number(total).toLocaleString("id-ID")}
                              </span>
                           </div>
                        </div>
                     );
                  })
               ) : (
                  <div className="py-12 text-center border border-dashed border-[var(--color-border)] rounded-2xl p-8">
                     <p className="text-sm font-semibold text-[var(--color-ink)]">
                        Belum Ada Arsip Pengeluaran Tersimpan
                     </p>
                     <p className="text-xs text-[var(--color-ink-muted)] mt-1 max-w-sm mx-auto">
                        Tekan tombol "Arsipkan Pengeluaran Bulan Ini" di dashboard untuk menyimpan ringkasan periode berjalan.
                     </p>
                  </div>
               )}
            </div>
         </motion.div>

         {/* Delete confirmation modal */}
         <HistoryDeleteConfirmation
            isOpen={showDeleteConfirmation}
            onClose={() => setShowDeleteConfirmation(false)}
            onConfirm={handleDelete}
            historyData={historyToDelete}
            isLoading={loadingDelete === historyToDelete?._id}
         />
      </div>
   );
};

export default HistoryModal;
