import React from "react";
import PropTypes from "prop-types";
import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function WelcomeMessage({ user }) {
   const userName = user && user.name ? user.name : "Teman Sakuin";

   return (
      <motion.section
         initial={{ opacity: 0, y: 10 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.3 }}
         className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-5 sm:p-6 shadow-xs relative overflow-hidden"
      >
         <div className="flex items-center gap-2 mb-1.5 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
            <Sparkles size={14} />
            <span>Dashboard Keuangan Pribadi</span>
         </div>
         <h2 className="font-extrabold text-xl sm:text-2xl text-[var(--color-ink)] tracking-tight">
            Selamat Datang Kembali, <span className="text-emerald-600 dark:text-emerald-400">{userName}</span> 👋
         </h2>
         <p className="text-xs sm:text-sm text-[var(--color-ink-muted)] mt-1 font-normal">
            Pantau arus kas, alokasikan target budget, dan simpan struk belanja Anda dengan mudah.
         </p>
      </motion.section>
   );
}

WelcomeMessage.propTypes = {
   user: PropTypes.shape({
      name: PropTypes.string,
   }),
};
