import React, { useState, useEffect } from "react";
import api from "../utils/api";
import toast from "react-hot-toast";
import TipsPenggunaanAtDashboard from "./TipsPenggunaanAtDashboard";
import { Check, Coins, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const MonthlyIncomeCard = ({ monthlyIncome, setMonthlyIncome }) => {
   const [incomeValue, setIncomeValue] = useState("0");
   const [isSavingIncome, setIsSavingIncome] = useState(false);

   useEffect(() => {
      if (monthlyIncome?.amount !== undefined && monthlyIncome?.amount !== null) {
         setIncomeValue(String(monthlyIncome.amount));
      } else {
         setIncomeValue("0");
      }
   }, [monthlyIncome]);

   const handleSaveIncome = async () => {
      try {
         setIsSavingIncome(true);
         const res = await api.post("/pemasukan", {
            month: new Date().getMonth() + 1,
            year: new Date().getFullYear(),
            amount: parseFloat(incomeValue) || 0,
         });
         setMonthlyIncome(res.data.pemasukan);
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
            <div className="flex items-center gap-2.5 pb-4 mb-5 border-b border-[var(--color-border)]">
               <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                  <Coins size={20} className="stroke-[2.2]" />
               </div>
               <div>
                  <h2 className="font-bold text-base sm:text-lg text-[var(--color-ink)] leading-tight">
                     Pemasukan Bulanan
                  </h2>
                  <p className="text-xs text-[var(--color-ink-muted)]">
                     Atur estimasi dana masuk atau uang saku bulan ini
                  </p>
               </div>
            </div>

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
                     className="w-full border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-ink)] rounded-xl py-2.5 pl-10 pr-4 font-mono text-sm sm:text-base tabular-nums focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
                  />
               </div>

               <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSaveIncome}
                  disabled={isSavingIncome}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs tracking-wide shadow-xs disabled:opacity-50 disabled:pointer-events-none transition-colors flex items-center justify-center gap-2 cursor-pointer"
               >
                  {isSavingIncome ? (
                     <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>Menyimpan...</span>
                     </>
                  ) : (
                     <>
                        <Check size={16} className="stroke-[2.5]" />
                        <span>Simpan</span>
                     </>
                  )}
               </motion.button>
            </div>
         </div>

         <div className="mt-6 pt-4 border-t border-[var(--color-border)]">
            <TipsPenggunaanAtDashboard />
         </div>
      </section>
   );
};

export default MonthlyIncomeCard;
