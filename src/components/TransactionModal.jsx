import React, { useState, useEffect, useRef } from "react";
import api from "../utils/api";
import toast from "react-hot-toast";
import {
   X,
   Check,
   Calendar,
   Wallet,
   Tag,
   Loader2,
   Utensils,
   Car,
   Gamepad2,
   HeartPulse,
   GraduationCap,
   ShoppingBag,
} from "lucide-react";
import { motion } from "framer-motion";

const categories = [
   { name: "Makanan", icon: Utensils, color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" },
   { name: "Transportasi", icon: Car, color: "text-blue-500 bg-blue-500/10 border-blue-500/20" },
   { name: "Hiburan", icon: Gamepad2, color: "text-purple-500 bg-purple-500/10 border-purple-500/20" },
   { name: "Kesehatan", icon: HeartPulse, color: "text-rose-500 bg-rose-500/10 border-rose-500/20" },
   { name: "Pendidikan", icon: GraduationCap, color: "text-amber-500 bg-amber-500/10 border-amber-500/20" },
   { name: "Kebutuhan Pribadi", icon: ShoppingBag, color: "text-teal-500 bg-teal-500/10 border-teal-500/20" },
];

const wallets = [
   "Tunai",
   "BCA",
   "Mandiri",
   "GoPay",
   "OVO",
   "ShopeePay",
   "DANA",
];

const quickAmounts = [10000, 20000, 50000, 100000];

const TransactionModal = ({ onClose, editData, refreshTransactions }) => {
   const amountInputRef = useRef(null);
   const [formData, setFormData] = useState({
      name: "",
      category: "Makanan",
      amount: "",
      date: new Date().toISOString().slice(0, 10),
      wallet: "Tunai",
      notes: "",
   });
   const [displayAmount, setDisplayAmount] = useState("");
   const [loading, setLoading] = useState(false);

   useEffect(() => {
      if (editData) {
         setFormData({
            name: editData.name || "",
            category: editData.category || "Makanan",
            amount: editData.amount || "",
            date: editData.date
               ? new Date(editData.date).toISOString().slice(0, 10)
               : new Date().toISOString().slice(0, 10),
            wallet: editData.wallet || "Tunai",
            notes: editData.notes || "",
         });
         setDisplayAmount(
            editData.amount ? Number(editData.amount).toLocaleString("id-ID") : ""
         );
      } else {
         // Auto-focus on amount input for sat-set flow
         setTimeout(() => {
            if (amountInputRef.current) {
               amountInputRef.current.focus();
            }
         }, 150);
      }
   }, [editData]);

   const handleAmountChange = (e) => {
      const numericValue = e.target.value.replace(/\D/g, "");
      const val = numericValue ? parseInt(numericValue, 10) : "";
      setFormData((prev) => ({
         ...prev,
         amount: val,
      }));
      setDisplayAmount(val ? val.toLocaleString("id-ID") : "");
   };

   const addQuickAmount = (increment) => {
      const current = typeof formData.amount === "number" ? formData.amount : 0;
      const nextVal = current + increment;
      setFormData((prev) => ({
         ...prev,
         amount: nextVal,
      }));
      setDisplayAmount(nextVal.toLocaleString("id-ID"));
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      if (!formData.amount || formData.amount <= 0) {
         toast.error("Harap masukkan nominal transaksi yang valid");
         return;
      }
      if (!formData.name.trim()) {
         toast.error("Harap masukkan nama transaksi");
         return;
      }

      setLoading(true);
      try {
         if (editData) {
            await api.put(`/transactions/${editData._id}`, formData);
            toast.success("Transaksi berhasil diperbarui!");
         } else {
            await api.post("/transactions", formData);
            toast.success("Transaksi sat-set berhasil dicatat!");
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
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
         <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-t-3xl sm:rounded-3xl shadow-2xl w-full max-w-lg max-h-[92vh] flex flex-col overflow-hidden"
         >
            {/* Drag handle for mobile bottom sheet */}
            <div className="sm:hidden w-12 h-1.5 bg-[var(--color-border)] rounded-full mx-auto mt-2.5 mb-1" />

            {/* Modal Header */}
            <div className="p-5 border-b border-[var(--color-border)] flex items-center justify-between">
               <div>
                  <h2 className="font-bold text-base sm:text-lg text-[var(--color-ink)]">
                     {editData ? "Edit Transaksi" : "Catat Pengeluaran Sat-Set"}
                  </h2>
                  <p className="text-xs text-[var(--color-ink-muted)]">
                     {editData ? "Perbarui rincian catatan pengeluaran" : "Input nominal & pilih kategori dalam hitungan detik"}
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
            <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4">
               {/* Nominal Utama (Hero Input) */}
               <div>
                  <label className="block mb-1 text-xs font-semibold text-[var(--color-ink)]">
                     Nominal Transaksi
                  </label>
                  <div className="relative">
                     <span className="absolute left-4 top-1/2 -translate-y-1/2 text-base sm:text-lg font-bold text-emerald-600 dark:text-emerald-400">
                        Rp
                     </span>
                     <input
                        ref={amountInputRef}
                        type="text"
                        value={displayAmount}
                        onChange={handleAmountChange}
                        className="w-full border-2 border-emerald-500/40 bg-[var(--color-bg)] text-[var(--color-ink)] rounded-2xl py-3 pl-12 pr-4 font-mono text-xl sm:text-2xl font-bold tabular-nums focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all"
                        placeholder="Masukkan nominal (Rp)"
                        required
                     />
                  </div>

                  {/* Numpad Quick Amount Chips */}
                  <div className="flex gap-2 mt-2.5 overflow-x-auto pb-1 no-scrollbar">
                     {quickAmounts.map((amt) => (
                        <motion.button
                           key={amt}
                           type="button"
                           whileTap={{ scale: 0.94 }}
                           onClick={() => addQuickAmount(amt)}
                           className="px-2.5 py-1 rounded-xl text-[11px] font-semibold bg-[var(--color-bg)] hover:bg-emerald-500/10 text-[var(--color-ink)] hover:text-emerald-600 border border-[var(--color-border)] hover:border-emerald-500/30 transition-colors whitespace-nowrap cursor-pointer"
                        >
                           +{amt >= 1000000 ? `${amt / 1000000}jt` : `${amt / 1000}rb`}
                        </motion.button>
                     ))}
                     <motion.button
                        type="button"
                        whileTap={{ scale: 0.94 }}
                        onClick={() => {
                           setFormData((prev) => ({ ...prev, amount: 0 }));
                           setDisplayAmount("");
                        }}
                        className="px-2.5 py-1 rounded-xl text-[11px] font-semibold text-rose-500 bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 transition-colors whitespace-nowrap cursor-pointer ml-auto"
                     >
                        Reset
                     </motion.button>
                  </div>
               </div>

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
                     placeholder="Masukkan nama transaksi"
                     required
                  />
               </div>

               {/* Pilihan Kategori 1-Klik */}
               <div>
                  <label className="block mb-1.5 text-xs font-semibold text-[var(--color-ink)]">
                     Kategori Pos Belanja
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                     {categories.map((cat) => {
                        const Icon = cat.icon;
                        const isSelected = formData.category === cat.name;

                        return (
                           <motion.button
                              key={cat.name}
                              type="button"
                              whileTap={{ scale: 0.95 }}
                              onClick={() =>
                                 setFormData({ ...formData, category: cat.name })
                              }
                              className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                                 isSelected
                                    ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                                    : "bg-[var(--color-bg)] text-[var(--color-ink)] border-[var(--color-border)] hover:border-emerald-500/40"
                              }`}
                           >
                              <Icon size={16} className={isSelected ? "text-white" : "text-emerald-500"} />
                              <span className="truncate">{cat.name}</span>
                           </motion.button>
                        );
                     })}
                  </div>
               </div>

               {/* Pilihan Sumber Dompet / Rekening */}
               <div>
                  <label className="block mb-1.5 text-xs font-semibold text-[var(--color-ink)]">
                     Sumber Dana / Dompet
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                     {wallets.map((w) => {
                        const isSelected = formData.wallet === w;
                        return (
                           <motion.button
                              key={w}
                              type="button"
                              whileTap={{ scale: 0.94 }}
                              onClick={() =>
                                 setFormData({ ...formData, wallet: w })
                              }
                              className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors cursor-pointer ${
                                 isSelected
                                    ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                                    : "bg-[var(--color-bg)] text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] border-[var(--color-border)] hover:bg-slate-200 dark:hover:bg-slate-800"
                              }`}
                           >
                              {w}
                           </motion.button>
                        );
                     })}
                  </div>
               </div>

               {/* Tanggal & Catatan Opsional */}
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                     <label className="block mb-1 text-xs font-semibold text-[var(--color-ink)]">
                        Tanggal
                     </label>
                     <input
                        type="date"
                        value={formData.date}
                        onChange={(e) =>
                           setFormData({ ...formData, date: e.target.value })
                        }
                        className="w-full border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-ink)] rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all cursor-pointer"
                        required
                     />
                  </div>

                  <div>
                     <label className="block mb-1 text-xs font-semibold text-[var(--color-ink)]">
                        Catatan Pengeluaran
                     </label>
                     <input
                        type="text"
                        value={formData.notes || ""}
                        onChange={(e) =>
                           setFormData({ ...formData, notes: e.target.value })
                        }
                        className="w-full border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-ink)] rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
                        placeholder="Masukkan catatan (opsional)"
                     />
                  </div>
               </div>

               {/* Action Buttons */}
               <div className="flex gap-2.5 justify-end pt-3 border-t border-[var(--color-border)]">
                  <button
                     type="button"
                     onClick={onClose}
                     className="px-4 py-2.5 rounded-xl border border-[var(--color-border)] hover:bg-[var(--color-bg)] text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] text-xs font-semibold transition-colors cursor-pointer"
                  >
                     Batal
                  </button>

                  <motion.button
                     whileHover={{ scale: 1.02 }}
                     whileTap={{ scale: 0.98 }}
                     type="submit"
                     disabled={loading}
                     className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs tracking-wide shadow-md shadow-emerald-600/20 disabled:opacity-50 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                     {loading ? (
                        <>
                           <Loader2 size={14} className="animate-spin" />
                           <span>Menyimpan...</span>
                        </>
                     ) : (
                        <>
                           <Check size={14} className="stroke-[2.5]" />
                           <span>{editData ? "Perbarui" : "Simpan Sat-Set"}</span>
                        </>
                     )}
                  </motion.button>
               </div>
            </form>
         </motion.div>
      </div>
   );
};

export default TransactionModal;