import React from "react";
import { motion } from "framer-motion";
import { Target, Coins } from "lucide-react";

const WishlistStatsCard = ({ number, title, value, isPrice = false }) => {
   const Icon = isPrice ? Coins : Target;

   return (
      <motion.div
         initial={{ opacity: 0, y: 15 }}
         animate={{ opacity: 1, y: 0 }}
         whileHover={{ y: -3 }}
         className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-5 shadow-xs flex-1 flex flex-col justify-between transition-all"
      >
         <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
               <Icon size={20} className="stroke-[2.2]" />
            </div>
            <span className="text-[11px] font-semibold text-[var(--color-ink-muted)] bg-[var(--color-bg)] px-2.5 py-0.5 rounded-full border border-[var(--color-border)]">
               #{number}
            </span>
         </div>

         <h3 className="text-xs font-medium text-[var(--color-ink-muted)] mb-1.5">
            {title}
         </h3>

         <p className="font-extrabold text-2xl sm:text-3xl text-[var(--color-ink)] tabular-nums tracking-tight font-mono">
            {isPrice ? `Rp ${Number(value || 0).toLocaleString("id-ID")}` : value}
         </p>
      </motion.div>
   );
};

export default WishlistStatsCard;