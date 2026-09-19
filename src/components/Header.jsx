import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ThemeSwitcher from "./ThemeSwitcher";
import ReceiptScannerModal from "./ReceiptScannerModal";
import { Menu, X, LogOut, Wallet, Receipt, CreditCard } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Header({ logout, onTransactionSaved }) {
   const navigate = useNavigate();
   const location = useLocation();
   const [isMenuOpen, setIsMenuOpen] = useState(false);
   const [isScannerOpen, setIsScannerOpen] = useState(false);

   const isDashboard = location.pathname === "/";
   const isWishlist = location.pathname === "/wishlist";

   return (
      <>
         <header className="sticky top-0 z-40 glass-header border-b border-[var(--color-border)] px-4 sm:px-8 py-3 transition-colors duration-200">
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
               {/* Brand / Logo */}
               <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate("/")}
                  className="cursor-pointer flex items-center gap-2.5 select-none"
               >
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
                     <Wallet size={18} className="stroke-[2.5]" />
                  </div>
                  <div className="flex flex-col">
                     <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-[var(--color-ink)] leading-none">
                        Saku<span className="text-emerald-500">in</span>
                     </span>
                     <span className="text-[10px] font-medium tracking-wider uppercase text-[var(--color-ink-muted)]">
                        Pengelola Uang Saku
                     </span>
                  </div>
               </motion.div>

               {/* Desktop Navigation */}
               <nav className="hidden md:flex items-center gap-2">
                  <div className="flex items-center bg-[var(--color-surface)] p-1 rounded-2xl border border-[var(--color-border)] shadow-xs">
                     {/* Nav Tab: Keuangan */}
                     <button
                        onClick={() => navigate("/")}
                        className={`relative px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-colors duration-200 cursor-pointer ${
                           isDashboard
                              ? "text-white"
                              : "text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
                        }`}
                     >
                        {isDashboard && (
                           <motion.div
                              layoutId="active-nav-pill"
                              className="absolute inset-0 bg-emerald-600 rounded-xl shadow-xs"
                              transition={{ type: "spring", stiffness: 350, damping: 30 }}
                           />
                        )}
                        <span className="relative z-10">Arus Kas & Budget</span>
                     </button>

                     {/* Nav Tab: Wishlist */}
                     <button
                        onClick={() => navigate("/wishlist")}
                        className={`relative px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-colors duration-200 cursor-pointer ${
                           isWishlist
                              ? "text-white"
                              : "text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
                        }`}
                     >
                        {isWishlist && (
                           <motion.div
                              layoutId="active-nav-pill"
                              className="absolute inset-0 bg-emerald-600 rounded-xl shadow-xs"
                              transition={{ type: "spring", stiffness: 350, damping: 30 }}
                           />
                        )}
                        <span className="relative z-10">Target Wishlist</span>
                     </button>
                  </div>

                  {/* Receipt / QRIS Scanner CTA Button */}
                  <motion.button
                     whileHover={{ scale: 1.03 }}
                     whileTap={{ scale: 0.97 }}
                     onClick={() => setIsScannerOpen(true)}
                     className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold text-xs shadow-md shadow-emerald-600/20 hover:shadow-lg transition-all cursor-pointer"
                     title="Pindai Struk atau Bukti Transfer QRIS"
                  >
                     <Receipt size={15} className="stroke-[2.2]" />
                     <span>Pindai Struk</span>
                  </motion.button>

                  {/* Theme Switcher */}
                  <div className="border border-[var(--color-border)] rounded-xl p-0.5 bg-[var(--color-surface)]">
                     <ThemeSwitcher />
                  </div>

                  {/* Logout Button */}
                  <button
                     onClick={logout}
                     className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/50 border border-rose-200 dark:border-rose-900/50 transition-colors cursor-pointer"
                     title="Keluar dari akun"
                  >
                     <LogOut size={14} className="stroke-[2.5]" />
                     <span>Logout</span>
                  </button>
               </nav>

               {/* Mobile Header Actions */}
               <div className="flex items-center gap-2 md:hidden">
                  <motion.button
                     whileTap={{ scale: 0.92 }}
                     onClick={() => setIsScannerOpen(true)}
                     className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-medium shadow-xs"
                     aria-label="Pindai Struk"
                  >
                     <Receipt size={15} />
                     <span className="font-semibold text-xs">Pindai</span>
                  </motion.button>

                  <div className="border border-[var(--color-border)] rounded-xl bg-[var(--color-surface)]">
                     <ThemeSwitcher />
                  </div>

                  <button
                     onClick={() => setIsMenuOpen(!isMenuOpen)}
                     className="p-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-ink)] active:scale-95 transition-transform"
                     aria-label="Menu navigasi"
                  >
                     {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
                  </button>
               </div>
            </div>

            {/* Mobile Menu Dropdown */}
            <AnimatePresence>
               {isMenuOpen && (
                  <motion.div
                     initial={{ opacity: 0, height: 0 }}
                     animate={{ opacity: 1, height: "auto" }}
                     exit={{ opacity: 0, height: 0 }}
                     transition={{ duration: 0.2 }}
                     className="md:hidden overflow-hidden pt-3 border-t border-[var(--color-border)] mt-3 flex flex-col gap-2"
                  >
                     <button
                        onClick={() => {
                           navigate("/");
                           setIsMenuOpen(false);
                        }}
                        className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                           isDashboard
                              ? "bg-emerald-600 text-white shadow-xs"
                              : "bg-[var(--color-surface)] text-[var(--color-ink)] border border-[var(--color-border)]"
                        }`}
                     >
                        <span>Arus Kas & Anggaran</span>
                        {isDashboard && <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">Aktif</span>}
                     </button>

                     <button
                        onClick={() => {
                           navigate("/wishlist");
                           setIsMenuOpen(false);
                        }}
                        className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                           isWishlist
                              ? "bg-emerald-600 text-white shadow-xs"
                              : "bg-[var(--color-surface)] text-[var(--color-ink)] border border-[var(--color-border)]"
                        }`}
                     >
                        <span>Target Wishlist</span>
                        {isWishlist && <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">Aktif</span>}
                     </button>

                     <button
                        onClick={() => {
                           setIsMenuOpen(false);
                           setIsScannerOpen(true);
                        }}
                        className="flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xs"
                     >
                        <span className="flex items-center gap-2">
                           <Receipt size={16} />
                           Pindai Bukti Struk & QRIS
                        </span>
                     </button>

                     <button
                        onClick={() => {
                           setIsMenuOpen(false);
                           logout();
                        }}
                        className="flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 mt-1"
                     >
                        <span>Logout dari Sakuin</span>
                        <LogOut size={16} />
                     </button>
                  </motion.div>
               )}
            </AnimatePresence>
         </header>

         {/* Receipt / QRIS Scanner Modal */}
         <ReceiptScannerModal
            isOpen={isScannerOpen}
            onClose={() => setIsScannerOpen(false)}
            onTransactionSaved={(newTx) => {
               if (onTransactionSaved) {
                  onTransactionSaved(newTx);
               }
            }}
         />
      </>
   );
}
