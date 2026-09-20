import React from "react";
import { motion } from "framer-motion";
import { PiggyBank, ArrowDownRight, Wallet, TrendingUp, Sparkles } from "lucide-react";

const cardVariants = {
   hidden: { opacity: 0, y: 15 },
   visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.35, ease: "easeOut" },
   }),
};

const StatsCard = ({
   index = 0,
   icon: Icon,
   iconColor = "text-emerald-500",
   iconBg = "bg-emerald-500/10",
   title,
   value,
   isLoading = false,
   additionalInfo = null,
}) => {
   return (
      <motion.div
         custom={index}
         initial="hidden"
         animate="visible"
         variants={cardVariants}
         whileHover={{ y: -3 }}
         className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-5 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between relative overflow-hidden"
      >
         <div>
            <div className="flex items-center justify-between mb-3">
               <div className={`w-10 h-10 rounded-2xl ${iconBg} ${iconColor} flex items-center justify-center shadow-xs`}>
                  <Icon size={20} className="stroke-[2.2]" />
               </div>
               <span className="text-[11px] font-semibold text-[var(--color-ink-muted)] bg-[var(--color-bg)] px-2.5 py-0.5 rounded-full border border-[var(--color-border)]">
                  #{index + 1}
               </span>
            </div>

            <h3 className="text-xs font-medium text-[var(--color-ink-muted)] mb-1.5">
               {title}
            </h3>

            {isLoading ? (
               <div className="h-8 bg-[var(--color-border)] animate-pulse rounded-lg w-3/4 my-2" />
            ) : (
               <p className="font-extrabold text-2xl sm:text-3xl text-[var(--color-ink)] tabular-nums tracking-tight">
                  Rp {Number(value || 0).toLocaleString("id-ID")}
               </p>
            )}
         </div>

         {additionalInfo && (
            <div className="mt-4 pt-3 border-t border-[var(--color-border)] flex items-center justify-between text-xs">
               <span className="text-[var(--color-ink-muted)] font-medium">
                  {additionalInfo.label}
               </span>
               <span
                  className={`font-semibold tabular-nums px-2 py-0.5 rounded-full text-xs ${
                     additionalInfo.value >= 0
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                  }`}
               >
                  Rp {Number(additionalInfo.value || 0).toLocaleString("id-ID")}
               </span>
            </div>
         )}
      </motion.div>
   );
};

const StatsCardKeuangan = ({
   budgets,
   actualSpending,
   monthlyIncome,
   totalIncomeRealtime = 0,
   isLoading = false,
}) => {
   const totalBudget = (budgets || []).reduce((sum, item) => sum + (item.budget || 0), 0);

   const totalSpending = Object.values(actualSpending || {}).reduce(
      (sum, val) => sum + (val || 0),
      0
   );

   const incomeAmount = monthlyIncome?.amount || 0;
   const remainingBalance = incomeAmount - totalSpending;

   return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
         <StatsCard
            index={0}
            icon={PiggyBank}
            iconColor="text-emerald-500"
            iconBg="bg-emerald-500/10"
            title="Total Alokasi Budget"
            value={totalBudget}
            isLoading={isLoading}
         />
         <StatsCard
            index={1}
            icon={ArrowDownRight}
            iconColor="text-rose-500"
            iconBg="bg-rose-500/10"
            title="Total Pengeluaran Bulan Ini"
            value={totalSpending}
            isLoading={isLoading}
            additionalInfo={{
               label: "Sisa Saldo Uang",
               value: remainingBalance,
            }}
         />
         <StatsCard
            index={2}
            icon={Wallet}
            iconColor="text-indigo-500"
            iconBg="bg-indigo-500/10"
            title="Pemasukan Bulanan"
            value={incomeAmount}
            isLoading={isLoading}
            additionalInfo={
               totalIncomeRealtime > 0
                  ? {
                       label: "+ Pemasukan Tercatat",
                       value: totalIncomeRealtime,
                    }
                  : null
            }
         />
      </div>
   );
};

export default StatsCardKeuangan;
