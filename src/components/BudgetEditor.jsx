import React, { useState, useEffect } from "react";
import api from "../utils/api";
import toast from "react-hot-toast";
import { Check, PieChart, AlertCircle, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const BudgetEditor = ({
   budgets,
   setBudgets,
   actualSpending = {},
   monthlyIncome,
   isLoadingEditor = false,
}) => {
   const [editBudgets, setEditBudgets] = useState([]);
   const [loading, setLoading] = useState(false);

   useEffect(() => {
      setEditBudgets(budgets || []);
   }, [budgets]);

   const handleChange = (category, value) => {
      const parsedVal = isNaN(value) ? 0 : Math.max(0, value);
      setEditBudgets((prev) =>
         prev.map((b) =>
            b.category === category ? { ...b, budget: parsedVal } : b
         )
      );
   };

   // Hitung total budget
   const totalBudget = editBudgets.reduce((sum, item) => sum + (item.budget || 0), 0);

   const handleSave = async () => {
      if (monthlyIncome !== undefined && monthlyIncome !== null) {
         const incomeAmount = monthlyIncome?.amount || 0;
         if (totalBudget !== incomeAmount) {
            toast.error("Total alokasi budget harus sama dengan pemasukan bulanan!");
            return;
         }
      }

      setLoading(true);
      try {
         await Promise.all(
            editBudgets.map((budget) =>
               api.put(`/budgets/${budget._id}`, { budget: budget.budget })
            )
         );
         setBudgets(editBudgets);
         toast.success("Alokasi budget berhasil diperbarui!");
      } catch (error) {
         console.error("Error updating budget", error);
         toast.error("Gagal menyimpan alokasi budget");
      } finally {
         setLoading(false);
      }
   };

   if (isLoadingEditor) {
      return (
         <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 shadow-xs">
            <div className="animate-pulse space-y-4">
               <div className="h-6 bg-[var(--color-border)] w-48 rounded-md mb-6" />
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                     <div key={i} className="h-36 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] p-4" />
                  ))}
               </div>
            </div>
         </div>
      );
   }

   return (
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 shadow-xs flex flex-col justify-between transition-colors">
         <div>
            <div className="flex items-center gap-2.5 pb-4 mb-5 border-b border-[var(--color-border)]">
               <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                  <PieChart size={18} className="stroke-[2.2]" />
               </div>
               <div>
                  <h2 className="font-bold text-base sm:text-lg text-[var(--color-ink)] leading-tight">
                     Budget per Kategori
                  </h2>
                  <p className="text-xs text-[var(--color-ink-muted)]">
                     Kelola alokasi batas pengeluaran untuk setiap pos belanja
                  </p>
               </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               {editBudgets.map((item) => {
                  const spending = actualSpending[item.category] || 0;
                  const budget = item.budget || 0;
                  const ratio = budget > 0 ? Math.min(100, (spending / budget) * 100) : 0;
                  const actualRatio = budget > 0 ? (spending / budget) * 100 : 0;

                  // Status semantik
                  const isOver = spending > budget && budget > 0;
                  const isNear = spending >= budget * 0.8 && !isOver && budget > 0;

                  const progressColor = isOver
                     ? "from-rose-500 to-red-600"
                     : isNear
                     ? "from-amber-400 to-amber-500"
                     : "from-emerald-400 to-teal-500";

                  const badgeStyle = isOver
                     ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
                     : isNear
                     ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                     : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";

                  return (
                     <div
                        key={item._id}
                        className="bg-[var(--color-bg)] border border-[var(--color-border)] hover:border-emerald-500/30 rounded-xl p-4 flex flex-col justify-between transition-all duration-200"
                     >
                        <div>
                           {/* Category Title */}
                           <div className="flex items-center justify-between mb-3">
                              <span className="font-semibold text-xs text-[var(--color-ink)]">
                                 {item.category}
                              </span>
                              {budget > 0 && (
                                 <span className="text-[11px] font-bold tabular-nums text-[var(--color-ink-muted)]">
                                    {Math.round(actualRatio)}%
                                 </span>
                              )}
                           </div>

                           {/* Input Budget */}
                           <div className="mb-3">
                              <label className="text-[10px] font-medium text-[var(--color-ink-muted)] uppercase tracking-wider block mb-1">
                                 Alokasi Target:
                              </label>
                              <div className="relative">
                                 <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-[var(--color-ink-muted)]">
                                    Rp
                                 </span>
                                 <input
                                    type="number"
                                    value={item.budget}
                                    onChange={(e) =>
                                       handleChange(
                                          item.category,
                                          parseFloat(e.target.value) || 0
                                       )
                                    }
                                    className="w-full border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-ink)] rounded-lg text-xs sm:text-sm py-1.5 pl-8 pr-2.5 font-mono tabular-nums focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                                 />
                              </div>
                           </div>

                           {/* Aktual info */}
                           <div className="flex items-center justify-between text-xs mb-2">
                              <span className="text-[11px] text-[var(--color-ink-muted)]">Aktual:</span>
                              <span className="font-semibold tabular-nums text-[var(--color-ink)]">
                                 Rp {Number(spending).toLocaleString("id-ID")}
                              </span>
                           </div>

                           {/* Smooth Progress Bar */}
                           <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden mb-3">
                              <motion.div
                                 initial={{ width: 0 }}
                                 animate={{ width: `${Math.min(100, actualRatio)}%` }}
                                 transition={{ duration: 0.5, ease: "easeOut" }}
                                 className={`h-full rounded-full bg-gradient-to-r ${progressColor}`}
                              />
                           </div>
                        </div>

                        {/* Status Badge */}
                        {budget > 0 ? (
                           <div className={`text-[11px] font-semibold border rounded-lg px-2.5 py-1 flex items-center justify-between ${badgeStyle}`}>
                              <span>
                                 {isOver
                                    ? "Melebihi Target"
                                    : isNear
                                    ? "Mendekati Batas"
                                    : "Dalam Batas Aman"}
                              </span>
                              <span className="tabular-nums font-bold">
                                 {isOver ? `+${Math.round(actualRatio - 100)}%` : `${Math.round(100 - actualRatio)}% sisa`}
                              </span>
                           </div>
                        ) : (
                           <div className="text-[11px] border border-dashed border-[var(--color-border)] text-[var(--color-ink-muted)] rounded-lg px-2 py-1 text-center font-medium">
                              Belum Ditetapkan
                           </div>
                        )}
                     </div>
                  );
               })}
            </div>
         </div>

         {/* Summary & Save Action */}
         <div className="mt-5 pt-4 border-t border-[var(--color-border)] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
               <span className="text-xs text-[var(--color-ink-muted)] font-medium">Total Alokasi:</span>
               <span className="font-bold text-sm sm:text-base text-[var(--color-ink)] font-mono tabular-nums">
                  Rp {Number(totalBudget).toLocaleString("id-ID")}
               </span>
            </div>

            <motion.button
               whileHover={{ scale: 1.02 }}
               whileTap={{ scale: 0.98 }}
               onClick={handleSave}
               disabled={loading}
               className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs tracking-wide shadow-xs disabled:opacity-50 disabled:pointer-events-none transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
               {loading ? (
                  <>
                     <Loader2 size={15} className="animate-spin" />
                     <span>Menyimpan...</span>
                  </>
               ) : (
                  <>
                     <Check size={15} className="stroke-[2.5]" />
                     <span>Simpan Alokasi</span>
                  </>
               )}
            </motion.button>
         </div>
      </div>
   );
};

export default BudgetEditor;
