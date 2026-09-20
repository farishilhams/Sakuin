import React from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, Target, Plus, History, User } from "lucide-react";
import { motion } from "framer-motion";

export default function BottomNav({ onOpenQuickAdd, onOpenHistory }) {
   return (
      <nav
         aria-label="Navigasi Utama Ponsel"
         className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[var(--color-surface)]/95 backdrop-blur-xl border-t border-[var(--color-border)] px-2 py-1.5 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-8px_24px_rgba(0,0,0,0.06)] select-none transition-colors"
      >
         <div className="max-w-md mx-auto flex items-center justify-between relative">
            {/* 1. Arus Kas (Dashboard) - Client-side Routing NavLink */}
            <NavLink
               to="/"
               end
               className={({ isActive }) =>
                  `flex flex-col items-center justify-center flex-1 py-1 transition-colors cursor-pointer ${
                     isActive
                        ? "text-emerald-600 dark:text-emerald-400 font-semibold"
                        : "text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
                  }`
               }
            >
               {({ isActive }) => (
                  <>
                     <div className="relative">
                        <LayoutDashboard size={20} className="stroke-[2.2]" />
                        {isActive && (
                           <motion.div
                              layoutId="bottom-nav-dot"
                              className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-emerald-500"
                              transition={{
                                 type: "spring",
                                 stiffness: 400,
                                 damping: 30,
                              }}
                           />
                        )}
                     </div>
                     <span className="text-[10px] mt-1 font-medium tracking-tight">
                        Arus Kas
                     </span>
                  </>
               )}
            </NavLink>

            {/* 2. Target Wishlist - Client-side Routing NavLink */}
            <NavLink
               to="/wishlist"
               className={({ isActive }) =>
                  `flex flex-col items-center justify-center flex-1 py-1 transition-colors cursor-pointer ${
                     isActive
                        ? "text-emerald-600 dark:text-emerald-400 font-semibold"
                        : "text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
                  }`
               }
            >
               {({ isActive }) => (
                  <>
                     <div className="relative">
                        <Target size={20} className="stroke-[2.2]" />
                        {isActive && (
                           <motion.div
                              layoutId="bottom-nav-dot"
                              className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-emerald-500"
                              transition={{
                                 type: "spring",
                                 stiffness: 400,
                                 damping: 30,
                              }}
                           />
                        )}
                     </div>
                     <span className="text-[10px] mt-1 font-medium tracking-tight">
                        Wishlist
                     </span>
                  </>
               )}
            </NavLink>

            {/* 3. Central Hero Quick Add (+) Button */}
            <div className="flex-1 flex justify-center -mt-5">
               <motion.button
                  type="button"
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={onOpenQuickAdd}
                  className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 text-white shadow-lg shadow-emerald-500/35 flex items-center justify-center border-2 border-[var(--color-surface)] cursor-pointer"
                  title="Catat Pengeluaran Sat-Set"
                  aria-label="Catat Pengeluaran Cepat"
               >
                  <Plus size={24} className="stroke-[2.8]" />
               </motion.button>
            </div>

            {/* 4. Riwayat & Arsip - Client-side Routing NavLink */}
            <NavLink
               to="/history"
               className={({ isActive }) =>
                  `flex flex-col items-center justify-center flex-1 py-1 transition-colors cursor-pointer ${
                     isActive
                        ? "text-emerald-600 dark:text-emerald-400 font-semibold"
                        : "text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
                  }`
               }
               title="Riwayat dan Arsip Bulanan"
            >
               {({ isActive }) => (
                  <>
                     <div className="relative">
                        <History size={20} className="stroke-[2.2]" />
                        {isActive && (
                           <motion.div
                              layoutId="bottom-nav-dot"
                              className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-emerald-500"
                              transition={{
                                 type: "spring",
                                 stiffness: 400,
                                 damping: 30,
                              }}
                           />
                        )}
                     </div>
                     <span className="text-[10px] mt-1 font-medium tracking-tight">
                        Riwayat
                     </span>
                  </>
               )}
            </NavLink>

            {/* 5. Profil Akun - Client-side Routing NavLink */}
            <NavLink
               to="/profile"
               className={({ isActive }) =>
                  `flex flex-col items-center justify-center flex-1 py-1 transition-colors cursor-pointer ${
                     isActive
                        ? "text-emerald-600 dark:text-emerald-400 font-semibold"
                        : "text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
                  }`
               }
               title="Profil Akun Pengguna"
            >
               {({ isActive }) => (
                  <>
                     <div className="relative">
                        <User size={20} className="stroke-[2.2]" />
                        {isActive && (
                           <motion.div
                              layoutId="bottom-nav-dot"
                              className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-emerald-500"
                              transition={{
                                 type: "spring",
                                 stiffness: 400,
                                 damping: 30,
                              }}
                           />
                        )}
                     </div>
                     <span className="text-[10px] mt-1 font-medium tracking-tight">
                        Profil
                     </span>
                  </>
               )}
            </NavLink>
         </div>
      </nav>
   );
}
