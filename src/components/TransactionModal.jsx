import React, { useState, useEffect, useMemo } from "react";
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
   ShoppingBag,
   Receipt,
   Gamepad2,
   HeartPulse,
   GraduationCap,
   MoreHorizontal,
   Delete,
   Camera,
   FileText,
   Undo2,
   Search,
   Plus,
   ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
   walletCategories,
   getAllWalletNames,
   getCustomWallets,
   saveCustomWallet,
   getWalletColor,
} from "../utils/walletsData";

const defaultCategories = [
   { name: "Makanan & Minuman", icon: Utensils, color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20 hover:bg-emerald-500/20" },
   { name: "Transportasi", icon: Car, color: "text-blue-500 bg-blue-500/10 border-blue-500/20 hover:bg-blue-500/20" },
   { name: "Belanja", icon: ShoppingBag, color: "text-violet-500 bg-violet-500/10 border-violet-500/20 hover:bg-violet-500/20" },
   { name: "Tagihan", icon: Receipt, color: "text-amber-500 bg-amber-500/10 border-amber-500/20 hover:bg-amber-500/20" },
   { name: "Hiburan", icon: Gamepad2, color: "text-purple-500 bg-purple-500/10 border-purple-500/20 hover:bg-purple-500/20" },
   { name: "Kesehatan", icon: HeartPulse, color: "text-rose-500 bg-rose-500/10 border-rose-500/20 hover:bg-rose-500/20" },
   { name: "Lainnya", icon: MoreHorizontal, color: "text-slate-500 bg-slate-500/10 border-slate-500/20 hover:bg-slate-500/20" },
];

const quickPrimaryWallets = ["Tunai", "BCA", "Mandiri", "GoPay", "ShopeePay", "DANA"];
const quickAdditions = [10000, 20000, 50000, 100000];
const customColorOptions = ["#10B981", "#2563EB", "#8B5CF6", "#F59E0B", "#EC4899", "#06B6D4"];

const TransactionModal = ({
   onClose,
   editData = null,
   refreshTransactions,
   onOpenScanner,
   existingTransactions = [],
}) => {
   // State for Quick 3-Tap Numpad Mode
   const [amount, setAmount] = useState(0);
   const [selectedWallet, setSelectedWallet] = useState(() => {
      return localStorage.getItem("sakuin_default_wallet") || "Tunai";
   });
   const [notes, setNotes] = useState("");
   const [showNotesInput, setShowNotesInput] = useState(false);
   const [showWalletsSelector, setShowWalletsSelector] = useState(false);
   const [submitting, setSubmitting] = useState(false);

   // State for Categorized Wallet Drawer & Custom Wallet Form
   const [walletSearchQuery, setWalletSearchQuery] = useState("");
   const [customWalletsList, setCustomWalletsList] = useState(() => getCustomWallets());
   const [showNewWalletForm, setShowNewWalletForm] = useState(false);
   const [newWalletName, setNewWalletName] = useState("");
   const [newWalletColor, setNewWalletColor] = useState("#10B981");

   // State for Edit Mode
   const [editFormData, setEditFormData] = useState({
      name: "",
      category: "Makanan & Minuman",
      amount: "",
      date: new Date().toISOString().slice(0, 10),
      wallet: "Tunai",
      notes: "",
   });

   // Adaptive sorting: Sort categories based on past transaction frequency
   const sortedCategories = useMemo(() => {
      if (editData || !existingTransactions || existingTransactions.length === 0) {
         return defaultCategories;
      }

      const frequencyMap = {};
      existingTransactions.forEach((tx) => {
         const cat = tx.category === "Makanan" ? "Makanan & Minuman" : tx.category;
         frequencyMap[cat] = (frequencyMap[cat] || 0) + 1;
      });

      return [...defaultCategories].sort((a, b) => {
         const countA = frequencyMap[a.name] || 0;
         const countB = frequencyMap[b.name] || 0;
         return countB - countA;
      });
   }, [existingTransactions, editData]);

   useEffect(() => {
      if (editData) {
         setEditFormData({
            name: editData.name || "",
            category: editData.category === "Makanan" ? "Makanan & Minuman" : (editData.category || "Makanan & Minuman"),
            amount: editData.amount || "",
            date: editData.date
               ? new Date(editData.date).toISOString().slice(0, 10)
               : new Date().toISOString().slice(0, 10),
            wallet: editData.wallet || "Tunai",
            notes: editData.notes || "",
         });
         setAmount(Number(editData.amount) || 0);
      }
   }, [editData]);

   // Custom Numpad Handlers
   const handleNumpadDigit = (digit) => {
      const currentStr = amount === 0 ? "" : String(amount);
      if (currentStr.length >= 10) return;
      const nextStr = currentStr + digit;
      setAmount(parseInt(nextStr, 10) || 0);
   };

   const handleNumpadTripleZero = () => {
      if (amount === 0) return;
      const currentStr = String(amount);
      if (currentStr.length >= 8) return;
      const nextStr = currentStr + "000";
      setAmount(parseInt(nextStr, 10) || 0);
   };

   const handleNumpadBackspace = () => {
      const currentStr = String(amount);
      if (currentStr.length <= 1) {
         setAmount(0);
      } else {
         setAmount(parseInt(currentStr.slice(0, -1), 10) || 0);
      }
   };

   const handleAddQuickAmount = (increment) => {
      setAmount((prev) => prev + increment);
   };

   const handleClearAmount = () => {
      setAmount(0);
   };

   // Handle Save New Custom Wallet
   const handleCreateCustomWallet = (e) => {
      e?.preventDefault();
      if (!newWalletName.trim()) {
         toast.error("Masukkan nama sumber dana");
         return;
      }

      const updated = saveCustomWallet({
         name: newWalletName.trim(),
         color: newWalletColor,
         category: "Lainnya",
      });

      setCustomWalletsList(updated);
      setSelectedWallet(newWalletName.trim());
      localStorage.setItem("sakuin_default_wallet", newWalletName.trim());
      toast.success(`Sumber dana ${newWalletName.trim()} berhasil ditambahkan`);
      setNewWalletName("");
      setShowNewWalletForm(false);
      setShowWalletsSelector(false);
   };

   // 1-Tap Quick Save Handler
   const handleCategoryTap = async (categoryName) => {
      if (submitting) return;

      if (!amount || amount <= 0) {
         toast.error("Masukkan nominal transaksi terlebih dahulu", { id: "nominal-req" });
         return;
      }

      setSubmitting(true);
      const finalCategory = categoryName;
      const finalName = notes.trim() ? notes.trim() : finalCategory;
      const currentAmount = amount;

      const payload = {
         name: finalName,
         category: finalCategory,
         amount: currentAmount,
         wallet: selectedWallet,
         notes: notes.trim(),
         date: new Date().toISOString().slice(0, 10),
         type: "expense",
      };

      try {
         localStorage.setItem("sakuin_default_wallet", selectedWallet);

         const res = await api.post("/transactions", payload);
         const createdTx = res.data.transaction;

         onClose();
         if (refreshTransactions) {
            refreshTransactions(createdTx);
         }

         // Interactive Toast with Instant Undo
         toast.custom(
            (t) => (
               <div
                  className={`${
                     t.visible ? "animate-enter" : "animate-leave"
                  } max-w-sm w-full bg-[var(--color-surface)] border border-[var(--color-border)] shadow-xl rounded-2xl p-3.5 flex items-center justify-between gap-3 select-none`}
               >
                  <div className="flex items-center gap-2.5 overflow-hidden">
                     <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                     <div className="truncate">
                        <p className="text-xs font-bold text-[var(--color-ink)] truncate">
                           Rp {currentAmount.toLocaleString("id-ID")} — {finalCategory} tersimpan
                        </p>
                        <p className="text-[10px] text-[var(--color-ink-muted)]">
                           Dompet: {selectedWallet}
                        </p>
                     </div>
                  </div>

                  <button
                     type="button"
                     onClick={async () => {
                        toast.dismiss(t.id);
                        try {
                           await api.delete(`/transactions/${createdTx._id}`);
                           if (refreshTransactions) {
                              refreshTransactions();
                           }
                           toast.success("Transaksi berhasil dibatalkan");
                        } catch (err) {
                           console.error("Undo error", err);
                           toast.error("Gagal membatalkan transaksi");
                        }
                     }}
                     className="px-2.5 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 font-bold text-xs flex items-center gap-1 transition-colors shrink-0 cursor-pointer"
                  >
                     <Undo2 size={13} />
                     <span>Undo</span>
                  </button>
               </div>
            ),
            { duration: 4500 }
         );
      } catch (error) {
         console.error("Quick transaction error:", error);
         toast.error(error.response?.data?.message || "Gagal mencatat transaksi");
         setSubmitting(false);
      }
   };

   // Edit Mode Submit Handler
   const handleEditSubmit = async (e) => {
      e.preventDefault();
      if (!editFormData.amount || editFormData.amount <= 0) {
         toast.error("Masukkan nominal transaksi yang valid");
         return;
      }
      if (!editFormData.name.trim()) {
         toast.error("Masukkan nama transaksi");
         return;
      }

      setSubmitting(true);
      try {
         const res = await api.put(`/transactions/${editData._id}`, {
            ...editFormData,
            amount: Number(editFormData.amount),
         });
         toast.success("Transaksi berhasil diperbarui!");
         if (refreshTransactions) refreshTransactions(res.data.transaction);
         onClose();
      } catch (error) {
         console.error("Edit transaction error:", error);
         toast.error(error.response?.data?.message || "Gagal memperbarui transaksi");
      } finally {
         setSubmitting(false);
      }
   };

   // Filter wallets by search query
   const filteredCategories = useMemo(() => {
      const q = walletSearchQuery.toLowerCase().trim();
      if (!q) return walletCategories;
      return walletCategories
         .map((cat) => ({
            ...cat,
            items: cat.items.filter((item) =>
               item.name.toLowerCase().includes(q)
            ),
         }))
         .filter((cat) => cat.items.length > 0);
   }, [walletSearchQuery]);

   const filteredCustomWallets = useMemo(() => {
      const q = walletSearchQuery.toLowerCase().trim();
      if (!q) return customWalletsList;
      return customWalletsList.filter((w) =>
         w.name.toLowerCase().includes(q)
      );
   }, [walletSearchQuery, customWalletsList]);

   return (
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
         <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.98 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-t-3xl sm:rounded-3xl shadow-2xl w-full max-w-md max-h-[95vh] flex flex-col overflow-hidden"
         >
            {/* Mobile Sheet Handle */}
            <div className="sm:hidden w-12 h-1.5 bg-[var(--color-border)] rounded-full mx-auto mt-2.5 mb-1 shrink-0" />

            {/* Header */}
            <div className="px-5 py-3.5 border-b border-[var(--color-border)] flex items-center justify-between shrink-0">
               <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                     <Wallet size={16} className="stroke-[2.4]" />
                  </div>
                  <div>
                     <h2 className="font-bold text-sm sm:text-base text-[var(--color-ink)] leading-none">
                        {editData ? "Edit Transaksi" : "Catat Sat-Set Super Cepat"}
                     </h2>
                     <p className="text-[11px] text-[var(--color-ink-muted)] mt-0.5">
                        {editData ? "Perbarui informasi transaksi" : "Ketik nominal lalu tap 1 kategori"}
                     </p>
                  </div>
               </div>

               <div className="flex items-center gap-1.5">
                  {!editData && onOpenScanner && (
                     <button
                        type="button"
                        onClick={() => {
                           onClose();
                           onOpenScanner();
                        }}
                        className="p-2 rounded-xl bg-[var(--color-bg)] hover:bg-emerald-500/10 text-[var(--color-ink-muted)] hover:text-emerald-600 transition-colors cursor-pointer"
                        title="Pindai Struk atau Bukti QRIS"
                     >
                        <Camera size={16} />
                     </button>
                  )}

                  <button
                     type="button"
                     onClick={onClose}
                     className="p-2 rounded-xl bg-[var(--color-bg)] hover:bg-slate-200 dark:hover:bg-slate-800 text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] transition-colors cursor-pointer"
                     aria-label="Tutup"
                  >
                     <X size={16} />
                  </button>
               </div>
            </div>

            {/* Content Body */}
            {editData ? (
               /* ==================== EDIT FORM MODE ==================== */
               <form onSubmit={handleEditSubmit} className="p-5 overflow-y-auto space-y-4">
                  <div>
                     <label className="block mb-1 text-xs font-semibold text-[var(--color-ink)]">
                        Nominal Transaksi
                     </label>
                     <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-emerald-600 dark:text-emerald-400">
                           Rp
                        </span>
                        <input
                           type="number"
                           value={editFormData.amount}
                           onChange={(e) =>
                              setEditFormData({ ...editFormData, amount: e.target.value })
                           }
                           className="w-full border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-ink)] rounded-xl py-2.5 pl-11 pr-4 font-mono font-bold text-base focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                           placeholder="0"
                           required
                        />
                     </div>
                  </div>

                  <div>
                     <label className="block mb-1 text-xs font-semibold text-[var(--color-ink)]">
                        Nama Transaksi
                     </label>
                     <input
                        type="text"
                        value={editFormData.name}
                        onChange={(e) =>
                           setEditFormData({ ...editFormData, name: e.target.value })
                        }
                        className="w-full border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-ink)] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                        placeholder="Masukkan nama pengeluaran"
                        required
                     />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                     <div>
                        <label className="block mb-1 text-xs font-semibold text-[var(--color-ink)]">
                           Kategori
                        </label>
                        <select
                           value={editFormData.category}
                           onChange={(e) =>
                              setEditFormData({ ...editFormData, category: e.target.value })
                           }
                           className="w-full border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-ink)] rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30 cursor-pointer"
                        >
                           {defaultCategories.map((c) => (
                              <option key={c.name} value={c.name}>
                                 {c.name}
                              </option>
                           ))}
                        </select>
                     </div>

                     <div>
                        <label className="block mb-1 text-xs font-semibold text-[var(--color-ink)]">
                           Sumber Dana
                        </label>
                        <select
                           value={editFormData.wallet}
                           onChange={(e) =>
                              setEditFormData({ ...editFormData, wallet: e.target.value })
                           }
                           className="w-full border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-ink)] rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30 cursor-pointer"
                        >
                           {walletCategories.map((cat) => (
                              <optgroup key={cat.category} label={cat.category}>
                                 {cat.items.map((item) => (
                                    <option key={item.name} value={item.name}>
                                       {item.name}
                                    </option>
                                 ))}
                              </optgroup>
                           ))}
                           {customWalletsList.length > 0 && (
                              <optgroup label="Sumber Dana Kustom">
                                 {customWalletsList.map((w) => (
                                    <option key={w.name} value={w.name}>
                                       {w.name}
                                    </option>
                                 ))}
                              </optgroup>
                           )}
                        </select>
                     </div>
                  </div>

                  <div>
                     <label className="block mb-1 text-xs font-semibold text-[var(--color-ink)]">
                        Tanggal
                     </label>
                     <input
                        type="date"
                        value={editFormData.date}
                        onChange={(e) =>
                           setEditFormData({ ...editFormData, date: e.target.value })
                        }
                        className="w-full border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-ink)] rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30 cursor-pointer"
                        required
                     />
                  </div>

                  <div>
                     <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-semibold text-[var(--color-ink)]">
                           Catatan Pengeluaran
                        </label>
                        <span className="text-[10px] font-semibold text-[var(--color-ink-muted)] bg-[var(--color-bg)] px-2 py-0.5 rounded-md border border-[var(--color-border)]">
                           Opsional
                        </span>
                     </div>
                     <input
                        type="text"
                        value={editFormData.notes}
                        onChange={(e) =>
                           setEditFormData({ ...editFormData, notes: e.target.value })
                        }
                        className="w-full border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-ink)] rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                        placeholder="Tulis catatan transaksi"
                     />
                  </div>

                  <div className="flex gap-2 justify-end pt-3 border-t border-[var(--color-border)]">
                     <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 rounded-xl border border-[var(--color-border)] text-xs font-semibold text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] cursor-pointer"
                     >
                        Batal
                     </button>
                     <button
                        type="submit"
                        disabled={submitting}
                        className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                     >
                        {submitting ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                        <span>Simpan Perubahan</span>
                     </button>
                  </div>
               </form>
            ) : (
               /* ==================== QUICK NUMPAD 3-TAP MODE ==================== */
               <div className="p-4 sm:p-5 overflow-y-auto space-y-3.5">
                  {/* 1. Hero Nominal Display */}
                  <div className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded-2xl p-4 text-center relative overflow-hidden">
                     <span className="text-[10px] font-semibold text-[var(--color-ink-muted)] uppercase tracking-wider block mb-0.5">
                        Nominal Pengeluaran
                     </span>
                     <div className="flex items-center justify-center gap-1">
                        <span className="text-xl sm:text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                           Rp
                        </span>
                        <span
                           className={`font-mono font-extrabold text-3xl sm:text-4xl tracking-tight tabular-nums ${
                              amount > 0 ? "text-[var(--color-ink)]" : "text-[var(--color-ink-muted)] opacity-60"
                           }`}
                        >
                           {amount > 0 ? amount.toLocaleString("id-ID") : "0"}
                        </span>
                     </div>

                     {/* Quick Addition Chips */}
                     <div className="flex items-center justify-center gap-1.5 mt-2.5 flex-wrap">
                        {quickAdditions.map((inc) => (
                           <motion.button
                              key={inc}
                              type="button"
                              whileTap={{ scale: 0.94 }}
                              onClick={() => handleAddQuickAmount(inc)}
                              className="px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-[var(--color-surface)] hover:bg-emerald-500/15 text-[var(--color-ink)] hover:text-emerald-600 border border-[var(--color-border)] transition-colors cursor-pointer"
                           >
                              +{inc / 1000}rb
                           </motion.button>
                        ))}
                        {amount > 0 && (
                           <motion.button
                              type="button"
                              whileTap={{ scale: 0.94 }}
                              onClick={handleClearAmount}
                              className="px-2 py-0.5 rounded-lg text-[10px] font-semibold text-rose-500 bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 transition-colors cursor-pointer"
                           >
                              Reset
                           </motion.button>
                        )}
                     </div>
                  </div>

                  {/* 2. Custom On-Screen Numpad Grid */}
                  <div className="grid grid-cols-3 gap-2 select-none">
                     {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                        <motion.button
                           key={num}
                           type="button"
                           whileHover={{ scale: 1.02 }}
                           whileTap={{ scale: 0.94 }}
                           onClick={() => handleNumpadDigit(String(num))}
                           className="py-3 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-emerald-500/40 text-lg font-bold font-mono text-[var(--color-ink)] shadow-xs transition-colors cursor-pointer"
                        >
                           {num}
                        </motion.button>
                     ))}
                     <motion.button
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.94 }}
                        onClick={handleNumpadTripleZero}
                        className="py-3 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-emerald-500/40 text-sm font-bold font-mono text-[var(--color-ink)] shadow-xs transition-colors cursor-pointer"
                     >
                        000
                     </motion.button>
                     <motion.button
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.94 }}
                        onClick={() => handleNumpadDigit("0")}
                        className="py-3 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-emerald-500/40 text-lg font-bold font-mono text-[var(--color-ink)] shadow-xs transition-colors cursor-pointer"
                     >
                        0
                     </motion.button>
                     <motion.button
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.94 }}
                        onClick={handleNumpadBackspace}
                        className="py-3 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-rose-500/40 text-[var(--color-ink-muted)] hover:text-rose-500 flex items-center justify-center shadow-xs transition-colors cursor-pointer"
                        aria-label="Hapus digit terakhir"
                     >
                        <Delete size={20} />
                     </motion.button>
                  </div>

                  {/* 3. 1-Tap Category Grid (Adaptive Ordering) */}
                  <div>
                     <div className="flex items-center justify-between mb-1.5 px-0.5">
                        <span className="text-xs font-semibold text-[var(--color-ink)] flex items-center gap-1.5">
                           <span>Pilih Kategori untuk Simpan</span>
                           <span className="text-[10px] text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded font-bold">
                              1-Tap
                           </span>
                        </span>
                        <span className="text-[10px] text-[var(--color-ink-muted)]">
                           Paling Sering Digunakan
                        </span>
                     </div>

                     <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {sortedCategories.map((cat) => {
                           const Icon = cat.icon;
                           return (
                              <motion.button
                                 key={cat.name}
                                 type="button"
                                 whileHover={{ scale: 1.02 }}
                                 whileTap={{ scale: 0.95 }}
                                 disabled={submitting}
                                 onClick={() => handleCategoryTap(cat.name)}
                                 className={`flex items-center gap-2 p-2.5 rounded-xl border text-left transition-all cursor-pointer ${cat.color} ${
                                    submitting ? "opacity-50 cursor-not-allowed" : ""
                                 }`}
                              >
                                 <Icon size={18} className="shrink-0" />
                                 <span className="text-xs font-semibold truncate leading-tight">
                                    {cat.name}
                                 </span>
                              </motion.button>
                           );
                        })}
                     </div>
                  </div>

                  {/* 4. Wallet & Optional Note Strip */}
                  <div className="pt-2 border-t border-[var(--color-border)] space-y-2">
                     {/* Wallet quick selector */}
                     <div className="flex items-center justify-between text-xs gap-1">
                        <span className="text-[11px] font-medium text-[var(--color-ink-muted)] shrink-0">
                           Sumber Dana:
                        </span>
                        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                           {quickPrimaryWallets.slice(0, 4).map((w) => {
                              const isSelected = selectedWallet === w;
                              const wColor = getWalletColor(w);
                              return (
                                 <button
                                    key={w}
                                    type="button"
                                    onClick={() => setSelectedWallet(w)}
                                    className={`px-2 py-1 rounded-lg text-[11px] font-semibold border transition-colors flex items-center gap-1.5 cursor-pointer ${
                                       isSelected
                                          ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                                          : "bg-[var(--color-bg)] text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] border-[var(--color-border)]"
                                    }`}
                                 >
                                    <span
                                       className="w-2 h-2 rounded-full shrink-0"
                                       style={{ backgroundColor: isSelected ? "#FFFFFF" : wColor }}
                                    />
                                    <span>{w}</span>
                                 </button>
                              );
                           })}
                           {/* If active wallet is not in top 4, display it */}
                           {!quickPrimaryWallets.slice(0, 4).includes(selectedWallet) && (
                              <button
                                 type="button"
                                 className="px-2 py-1 rounded-lg text-[11px] font-semibold border bg-emerald-600 text-white border-emerald-600 shadow-xs flex items-center gap-1.5 cursor-pointer"
                              >
                                 <span
                                    className="w-2 h-2 rounded-full bg-white shrink-0"
                                 />
                                 <span className="truncate max-w-[80px]">{selectedWallet}</span>
                              </button>
                           )}
                           <button
                              type="button"
                              onClick={() => {
                                 setShowWalletsSelector(true);
                                 setWalletSearchQuery("");
                              }}
                              className="px-2.5 py-1 rounded-lg text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors shrink-0 cursor-pointer"
                           >
                              Ganti
                           </button>
                        </div>
                     </div>

                     {/* Note toggle */}
                     {!showNotesInput ? (
                        <button
                           type="button"
                           onClick={() => setShowNotesInput(true)}
                           className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 hover:underline inline-flex items-center gap-1 cursor-pointer"
                        >
                           <FileText size={12} />
                           <span>+ Tambah catatan atau nama merchant</span>
                        </button>
                     ) : (
                        <div className="flex items-center gap-2 mt-1">
                           <input
                              type="text"
                              value={notes}
                              onChange={(e) => setNotes(e.target.value)}
                              placeholder="Nama toko atau catatan transaksi"
                              className="flex-1 border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-ink)] rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                              autoFocus
                           />
                           <button
                              type="button"
                              onClick={() => {
                                 setShowNotesInput(false);
                                 setNotes("");
                              }}
                              className="text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] p-1 text-xs cursor-pointer"
                           >
                              Batal
                           </button>
                        </div>
                     )}
                  </div>
               </div>
            )}

            {/* Categorized Wallets Selector Sheet (Section 6.C) */}
            <AnimatePresence>
               {showWalletsSelector && (
                  <motion.div
                     initial={{ opacity: 0, y: 100 }}
                     animate={{ opacity: 1, y: 0 }}
                     exit={{ opacity: 0, y: 100 }}
                     transition={{ duration: 0.2 }}
                     className="absolute inset-0 z-30 bg-[var(--color-surface)] flex flex-col overflow-hidden"
                  >
                     {/* Drawer Header */}
                     <div className="px-4 py-3 border-b border-[var(--color-border)] flex items-center justify-between shrink-0">
                        <div className="flex items-center gap-2">
                           <div className="w-7 h-7 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                              <Wallet size={15} />
                           </div>
                           <h3 className="font-bold text-sm text-[var(--color-ink)]">
                              Pilih Sumber Dana
                           </h3>
                        </div>
                        <button
                           type="button"
                           onClick={() => {
                              setShowWalletsSelector(false);
                              setShowNewWalletForm(false);
                           }}
                           className="p-1.5 rounded-xl bg-[var(--color-bg)] text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] transition-colors cursor-pointer"
                        >
                           <X size={16} />
                        </button>
                     </div>

                     {/* Search Bar */}
                     <div className="p-3 border-b border-[var(--color-border)]">
                        <div className="relative">
                           <Search
                              size={15}
                              className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-ink-muted)]"
                           />
                           <input
                              type="text"
                              value={walletSearchQuery}
                              onChange={(e) => setWalletSearchQuery(e.target.value)}
                              placeholder="Cari bank atau e-wallet..."
                              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-ink)] focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                           />
                        </div>
                     </div>

                     {/* Categorized Wallets List */}
                     <div className="flex-1 overflow-y-auto p-3 space-y-4">
                        {/* Custom Wallets if any */}
                        {filteredCustomWallets.length > 0 && (
                           <div>
                              <span className="text-[10px] font-bold text-[var(--color-ink-muted)] uppercase tracking-wider block mb-1.5 px-1">
                                 Sumber Dana Kustom Anda
                              </span>
                              <div className="grid grid-cols-2 gap-1.5">
                                 {filteredCustomWallets.map((cw) => (
                                    <button
                                       key={cw.name}
                                       type="button"
                                       onClick={() => {
                                          setSelectedWallet(cw.name);
                                          localStorage.setItem("sakuin_default_wallet", cw.name);
                                          setShowWalletsSelector(false);
                                       }}
                                       className={`flex items-center justify-between p-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                                          selectedWallet === cw.name
                                             ? "bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400"
                                             : "bg-[var(--color-bg)] border-[var(--color-border)] text-[var(--color-ink)] hover:border-emerald-500/30"
                                       }`}
                                    >
                                       <div className="flex items-center gap-2 truncate">
                                          <span
                                             className="w-2.5 h-2.5 rounded-full shrink-0"
                                             style={{ backgroundColor: cw.color || "#10B981" }}
                                          />
                                          <span className="truncate">{cw.name}</span>
                                       </div>
                                       {selectedWallet === cw.name && (
                                          <Check size={14} className="text-emerald-500 shrink-0" />
                                       )}
                                    </button>
                                 ))}
                              </div>
                           </div>
                        )}

                        {/* All Predefined Categories (35+ Entitas) */}
                        {filteredCategories.map((cat) => (
                           <div key={cat.category}>
                              <div className="flex items-center gap-1.5 mb-1.5 px-1">
                                 <span
                                    className="w-2 h-2 rounded-full"
                                    style={{ backgroundColor: cat.color }}
                                 />
                                 <span className="text-[10px] font-bold text-[var(--color-ink-muted)] uppercase tracking-wider">
                                    {cat.category}
                                 </span>
                              </div>
                              <div className="grid grid-cols-2 gap-1.5">
                                 {cat.items.map((item) => {
                                    const isSel = selectedWallet === item.name;
                                    return (
                                       <button
                                          key={item.name}
                                          type="button"
                                          onClick={() => {
                                             setSelectedWallet(item.name);
                                             localStorage.setItem("sakuin_default_wallet", item.name);
                                             setShowWalletsSelector(false);
                                          }}
                                          className={`flex items-center justify-between p-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                                             isSel
                                                ? "bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400"
                                                : "bg-[var(--color-bg)] border-[var(--color-border)] text-[var(--color-ink)] hover:border-emerald-500/30"
                                          }`}
                                       >
                                          <div className="flex items-center gap-2 truncate">
                                             <span
                                                className="w-2 h-2 rounded-full shrink-0"
                                                style={{ backgroundColor: item.color }}
                                             />
                                             <span className="truncate">{item.name}</span>
                                          </div>
                                          {isSel && (
                                             <Check size={14} className="text-emerald-500 shrink-0" />
                                          )}
                                       </button>
                                    );
                                 })}
                              </div>
                           </div>
                        ))}

                        {/* + Tambah Sumber Dana Lain Form Drawer */}
                        <div className="pt-2">
                           {!showNewWalletForm ? (
                              <button
                                 type="button"
                                 onClick={() => setShowNewWalletForm(true)}
                                 className="w-full py-2.5 px-3 rounded-xl border-2 border-dashed border-[var(--color-border)] hover:border-emerald-500/50 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                              >
                                 <Plus size={14} />
                                 <span>Tambah Sumber Dana Lain</span>
                              </button>
                           ) : (
                              <form
                                 onSubmit={handleCreateCustomWallet}
                                 className="p-3 bg-[var(--color-bg)] rounded-xl border border-[var(--color-border)] space-y-2.5"
                              >
                                 <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-[var(--color-ink)]">
                                       Tambah Sumber Dana Kustom
                                    </span>
                                    <button
                                       type="button"
                                       onClick={() => setShowNewWalletForm(false)}
                                       className="text-[10px] text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
                                    >
                                       Batal
                                    </button>
                                 </div>

                                 <input
                                    type="text"
                                    value={newWalletName}
                                    onChange={(e) => setNewWalletName(e.target.value)}
                                    placeholder="Contoh: Tabungan Emas atau Kripto"
                                    className="w-full px-3 py-1.5 text-xs rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-ink)] focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                                    autoFocus
                                 />

                                 <div>
                                    <span className="text-[10px] text-[var(--color-ink-muted)] block mb-1">
                                       Pilih Warna Label:
                                    </span>
                                    <div className="flex items-center gap-2">
                                       {customColorOptions.map((c) => (
                                          <button
                                             key={c}
                                             type="button"
                                             onClick={() => setNewWalletColor(c)}
                                             className={`w-5 h-5 rounded-full transition-transform cursor-pointer ${
                                                newWalletColor === c ? "scale-125 ring-2 ring-emerald-500" : ""
                                             }`}
                                             style={{ backgroundColor: c }}
                                          />
                                       ))}
                                    </div>
                                 </div>

                                 <button
                                    type="submit"
                                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                                 >
                                    Simpan dan Gunakan
                                 </button>
                              </form>
                           )}
                        </div>
                     </div>
                  </motion.div>
               )}
            </AnimatePresence>
         </motion.div>
      </div>
   );
};

export default TransactionModal;