import React, { useState, useEffect, useMemo } from "react";
import api from "../utils/api";
import toast from "react-hot-toast";
import TipsPenggunaanAtDashboard from "./TipsPenggunaanAtDashboard";
import { Check, Coins, Loader2, CalendarDays, Pencil } from "lucide-react";
import { motion } from "framer-motion";

/**
 * Menghitung label periode aktif: "September 2026"
 */
function getActivePeriodLabel() {
   return new Intl.DateTimeFormat("id-ID", {
      month: "long",
      year: "numeric",
   }).format(new Date());
}

const MonthlyIncomeCard = ({ monthlyIncome, setMonthlyIncome }) => {
   // Nilai yang tersimpan di database (dari props parent)
   const [savedAmount, setSavedAmount] = useState(0);
   // Nilai yang sedang diketik pengguna di input
   const [incomeValue, setIncomeValue] = useState("0");
   const [isSavingIncome, setIsSavingIncome] = useState(false);

   // Sinkronkan savedAmount dan incomeValue setiap kali monthlyIncome berubah dari DB
   useEffect(() => {
      const serverAmount =
         monthlyIncome?.amount !== undefined && monthlyIncome?.amount !== null
            ? monthlyIncome.amount
            : 0;
      setSavedAmount(serverAmount);
      setIncomeValue(String(serverAmount));
   }, [monthlyIncome]);

   /**
    * isDirty: true jika nilai input berbeda dari nilai yang sudah tersimpan.
    * Menggunakan parseFloat agar "500000" === 500000 dibandingkan dengan benar.
    */
   const isDirty = useMemo(() => {
      const parsed = parseFloat(incomeValue) || 0;
      return parsed !== savedAmount;
   }, [incomeValue, savedAmount]);

   const activePeriodLabel = useMemo(() => getActivePeriodLabel(), []);

   const handleSaveIncome = async () => {
      // Cegah submit duplikat jika nilai tidak berubah
      if (!isDirty || isSavingIncome) return;

      const amount = parseFloat(incomeValue) || 0;
      try {
         setIsSavingIncome(true);
         const res = await api.post("/pemasukan", {
            month: new Date().getMonth() + 1,
            year: new Date().getFullYear(),
            amount,
         });
         // Update state global Dashboard sekaligus savedAmount lokal
         setMonthlyIncome(res.data.pemasukan);
         setSavedAmount(amount);
         toast.success("Pemasukan bulanan berhasil diperbarui!");
      } catch (error) {
         console.error("Error updating income", error);
         toast.error("Gagal menyimpan pemasukan bulanan");
      } finally {
         setIsSavingIncome(false);
      }
   };

   return (
      <section className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 shadow-xs flex flex-col justify-between transition-colors">
         <div>
            {/* Header */}
            <div className="flex items-start gap-2.5 pb-4 mb-5 border-b border-[var(--color-border)]">
               <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0">
                  <Coins size={20} className="stroke-[2.2]" />
               </div>
               <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                     <h2 className="font-bold text-base sm:text-lg text-[var(--color-ink)] leading-tight">
                        Pemasukan Bulanan
                     </h2>
                     {/* Badge Periode Aktif Dinamis */}
                     <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full whitespace-nowrap">
                        <CalendarDays size={10} strokeWidth={2.5} />
                        Plafon Aktif {activePeriodLabel}
                     </span>
                  </div>
                  <p className="text-xs text-[var(--color-ink-muted)] mt-0.5">
                     Atur estimasi dana masuk atau uang saku bulan ini
                  </p>
               </div>
            </div>

            {/* Input + Button Row */}
            <div className="flex flex-col sm:flex-row gap-3 items-stretch">
               <div className="relative flex-1">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[var(--color-ink-muted)]">
                     Rp
                  </span>
                  <input
                     type="number"
                     placeholder="0"
                     value={incomeValue}
                     onChange={(e) => setIncomeValue(e.target.value)}
                     min={0}
                     className="w-full border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-ink)] rounded-xl py-2.5 pl-10 pr-4 font-mono text-sm sm:text-base tabular-nums focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
                  />
               </div>

               <motion.button
                  whileHover={isDirty ? { scale: 1.02 } : {}}
                  whileTap={isDirty ? { scale: 0.98 } : {}}
                  onClick={handleSaveIncome}
                  disabled={!isDirty || isSavingIncome}
                  className={`px-5 py-2.5 rounded-xl font-semibold text-xs tracking-wide shadow-xs transition-all flex items-center justify-center gap-2 ${
                     isSavingIncome
                        ? "bg-emerald-600 text-white cursor-wait opacity-80"
                        : isDirty
                        ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/25 cursor-pointer"
                        : "bg-emerald-950/40 dark:bg-emerald-900/30 text-emerald-400 border border-emerald-800/50 cursor-default"
                  }`}
                  aria-label={isDirty ? "Perbarui Pemasukan" : "Nilai sudah tersimpan"}
               >
                  {isSavingIncome ? (
                     <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>Menyimpan...</span>
                     </>
                  ) : isDirty ? (
                     <>
                        <Pencil size={14} className="stroke-[2.5]" />
                        <span>Perbarui Pemasukan</span>
                     </>
                  ) : (
                     <>
                        <Check size={16} className="stroke-[2.5]" />
                        <span>Tersimpan</span>
                     </>
                  )}
               </motion.button>
            </div>

            {/* Microcopy */}
            <p className="mt-2.5 text-[11px] text-[var(--color-ink-muted)] leading-relaxed">
               Acuan pemasukan bulanan untuk mengukur batas aman pengeluaran dan rasio tabungan bulan ini.
               {!isDirty && savedAmount > 0 && (
                  <span className="ml-1 font-semibold text-emerald-600 dark:text-emerald-400">
                     Rp {savedAmount.toLocaleString("id-ID")} aktif.
                  </span>
               )}
            </p>
         </div>

         <div className="mt-6 pt-4 border-t border-[var(--color-border)]">
            <TipsPenggunaanAtDashboard />
         </div>
      </section>
   );
};

export default MonthlyIncomeCard;
