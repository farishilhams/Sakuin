import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

const NotFound = () => {
   return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--color-bg)] text-[var(--color-ink)]">
         <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="border border-[var(--color-border)] bg-[var(--color-surface)] rounded-3xl shadow-xl p-8 sm:p-12 max-w-lg w-full text-center"
         >
            <div className="w-16 h-16 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto mb-5">
               <AlertCircle size={32} className="stroke-[2.2]" />
            </div>

            <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight text-[var(--color-ink)] mb-2 font-mono tabular-nums">
               404
            </h1>

            <p className="text-sm font-semibold text-rose-600 dark:text-rose-400 mb-3">
               Halaman Tidak Ditemukan
            </p>

            <p className="text-xs sm:text-sm text-[var(--color-ink-muted)] mb-8 max-w-sm mx-auto leading-relaxed">
               Alamat URL yang Anda tuju tidak terdaftar dalam routing sistem Sakuin atau mungkin telah dipindahkan.
            </p>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
               <Link
                  to="/"
                  className="inline-flex items-center gap-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl shadow-md shadow-emerald-600/20 transition-colors"
               >
                  <ArrowLeft size={16} className="stroke-[2.5]" />
                  <span>Kembali ke Dashboard</span>
               </Link>
            </motion.div>
         </motion.div>
      </div>
   );
};

export default NotFound;