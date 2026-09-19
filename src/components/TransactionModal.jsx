import React, { useState, useEffect } from "react";
import api from "../utils/api";
import toast from "react-hot-toast";
import { X, Check, Calendar, Tag, CreditCard, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const TransactionModal = ({ onClose, editData, refreshTransactions }) => {
   const [formData, setFormData] = useState({
      name: "",
      category: "Makanan",
      amount: "",
      date: new Date().toISOString().slice(0, 10),
   });
   const [displayAmount, setDisplayAmount] = useState("");
   const [loading, setLoading] = useState(false);

   const categories = [
      "Makanan",
      "Transportasi",
      "Hiburan",
      "Kesehatan",
      "Pendidikan",
      "Kebutuhan Pribadi",
   ];

   useEffect(() => {
      if (editData) {
         setFormData({
            name: editData.name || "",
            category: editData.category || "Makanan",
            amount: editData.amount || "",
            date: editData.date
               ? new Date(editData.date).toISOString().slice(0, 10)
               : new Date().toISOString().slice(0, 10),
         });
         setDisplayAmount(
            editData.amount ? Number(editData.amount).toLocaleString("id-ID") : ""
         );
      }
   }, [editData]);

   const handleAmountChange = (e) => {
      const numericValue = e.target.value.replace(/\D/g, "");
      setFormData({
         ...formData,
         amount: numericValue ? parseInt(numericValue, 10) : "",
      });
      setDisplayAmount(
         numericValue ? parseInt(numericValue, 10).toLocaleString("id-ID") : ""
      );
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      try {
         if (editData) {
            await api.put(`/transactions/${editData._id}`, formData);
            toast.success("Transaksi berhasil diperbarui!");
         } else {
            await api.post("/transactions", formData);
            toast.success("Transaksi berhasil ditambahkan!");
         }
         refreshTransactions();
         onClose();
      } catch (error) {
         console.error("Transaction submit error", error);
         toast.error("Gagal menyimpan transaksi");
      } finally {
         setLoading(false);
      }
   };

   return (
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
         <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
         >
            {/* Modal Header */}
            <div className="p-5 border-b border-[var(--color-border)] flex items-center justify-between">
               <div>
                  <h2 className="font-bold text-base sm:text-lg text-[var(--color-ink)]">
                     {editData ? "Edit Transaksi" : "Tambah Transaksi Baru"}
                  </h2>
                  <p className="text-xs text-[var(--color-ink-muted)]">
                     {editData ? "Perbarui rincian transaksi" : "Catat pengeluaran belanja Anda secara manual"}
                  </p>
               </div>

               <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-xl bg-[var(--color-bg)] hover:bg-slate-200 dark:hover:bg-slate-800 text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Tutup"
               >
                  <X size={18} />
               </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
               {/* Nama Transaksi */}
               <div>
                  <label className="block mb-1.5 text-xs font-semibold text-[var(--color-ink)]">
                     Nama Transaksi
                  </label>
                  <input
                     type="text"
                     value={formData.name}
                     onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                     }
                     className="w-full border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-ink)] rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
                     placeholder="Misal: Makan Siang Nasi Padang"
                     required
                  />
               </div>

               {/* Kategori */}
               <div>
                  <label className="block mb-1.5 text-xs font-semibold text-[var(--color-ink)]">
                     Kategori
                  </label>
                  <select
                     value={formData.category}
                     onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                     }
                     className="w-full border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-ink)] rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all cursor-pointer"
                     required
                  >
                     {categories.map((cat) => (
                        <option key={cat} value={cat}>
                           {cat}
                        </option>
                     ))}
                  </select>
               </div>

               {/* Nominal */}
               <div>
                  <label className="block mb-1.5 text-xs font-semibold text-[var(--color-ink)]">
                     Nominal Pengeluaran
                  </label>
                  <div className="relative">
                     <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[var(--color-ink-muted)]">
                        Rp
                     </span>
                     <input
                        type="text"
                        value={displayAmount}
                        onChange={handleAmountChange}
                        className="w-full border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-ink)] rounded-xl py-2.5 pl-10 pr-3.5 font-mono text-sm sm:text-base tabular-nums focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
                        placeholder="0"
                        required
                     />
                  </div>
               </div>

               {/* Tanggal */}
               <div>
                  <label className="block mb-1.5 text-xs font-semibold text-[var(--color-ink)]">
                     Tanggal
                  </label>
                  <input
                     type="date"
                     value={formData.date}
                     onChange={(e) =>
                        setFormData({ ...formData, date: e.target.value })
                     }
                     className="w-full border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-ink)] rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all cursor-pointer"
                     required
                  />
               </div>

               {/* Action Buttons */}
               <div className="flex gap-2.5 justify-end pt-4 border-t border-[var(--color-border)]">
                  <button
                     type="button"
                     onClick={onClose}
                     className="px-4 py-2.5 rounded-xl border border-[var(--color-border)] hover:bg-[var(--color-bg)] text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] text-xs font-semibold transition-colors cursor-pointer"
                  >
                     Batal
                  </button>

                  <button
                     type="submit"
                     disabled={loading}
                     className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs tracking-wide shadow-xs disabled:opacity-50 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                     {loading ? (
                        <>
                           <Loader2 size={14} className="animate-spin" />
                           <span>Menyimpan...</span>
                        </>
                     ) : (
                        <>
                           <Check size={14} className="stroke-[2.5]" />
                           <span>{editData ? "Perbarui" : "Simpan"}</span>
                        </>
                     )}
                  </button>
               </div>
            </form>
         </motion.div>
      </div>
   );
};

export default TransactionModal;