import React, { useState, useRef, useEffect, useContext } from "react";
import { useNavigate, useLocation, NavLink } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import ThemeSwitcher from "./ThemeSwitcher";
import ReceiptScannerModal from "./ReceiptScannerModal";
import {
   LogOut,
   Wallet,
   Receipt,
   User,
   ShieldCheck,
   ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { dropdownMenu, tapScale, tapScaleSubtle } from "../utils/motionVariants";

export default function Header({ onTransactionSaved }) {
   const { user, logout } = useContext(AuthContext);
   const navigate = useNavigate();
   const location = useLocation();

   const [isScannerOpen, setIsScannerOpen] = useState(false);
   const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

   const profileDropdownRef = useRef(null);

   const isDashboard = location.pathname === "/";
   const isWishlist = location.pathname === "/wishlist";
   const isProfile =
      location.pathname === "/profile" || location.pathname === "/profil";

   // Hitung inisial nama jika foto profil belum ada
   const initials = user?.name
      ? user.name
           .split(" ")
           .filter(Boolean)
           .map((n) => n[0])
           .slice(0, 2)
           .join("")
           .toUpperCase()
      : "SK";

   // Menutup dropdown saat klik di luar area atau menekan tombol Escape
   useEffect(() => {
      const handleClickOutside = (event) => {
         if (
            profileDropdownRef.current &&
            !profileDropdownRef.current.contains(event.target)
         ) {
            setIsProfileDropdownOpen(false);
         }
      };

      const handleKeyDown = (event) => {
         if (event.key === "Escape") {
            setIsProfileDropdownOpen(false);
         }
      };

      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
      return () => {
         document.removeEventListener("mousedown", handleClickOutside);
         document.removeEventListener("keydown", handleKeyDown);
      };
   }, []);

   const handleLogoutClick = async () => {
      setIsProfileDropdownOpen(false);
      await logout();
   };

   return (
      <>
         <header className="sticky top-0 z-40 glass-header border-b border-[var(--color-border)] px-4 sm:px-8 py-3 transition-colors duration-200">
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
               {/* Brand / Logo */}
               <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={tapScale}
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

               {/* Desktop Navigation Links (Client-Side NavLinks) */}
               <nav className="hidden md:flex items-center gap-2">
                  <div className="flex items-center bg-[var(--color-surface)] p-1 rounded-2xl border border-[var(--color-border)] shadow-xs">
                     {/* Nav Tab: Arus Kas */}
                     <NavLink
                        to="/"
                        end
                        className={({ isActive }) =>
                           `relative px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-colors duration-200 cursor-pointer ${
                              isActive
                                 ? "text-white"
                                 : "text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
                           }`
                        }
                     >
                        {({ isActive }) => (
                           <>
                              {isActive && (
                                 <motion.div
                                    layoutId="active-nav-pill"
                                    className="absolute inset-0 bg-emerald-600 rounded-xl shadow-xs"
                                    transition={{
                                       type: "spring",
                                       stiffness: 350,
                                       damping: 30,
                                    }}
                                 />
                              )}
                              <span className="relative z-10">
                                 Arus Kas & Anggaran
                              </span>
                           </>
                        )}
                     </NavLink>

                     {/* Nav Tab: Wishlist */}
                     <NavLink
                        to="/wishlist"
                        className={({ isActive }) =>
                           `relative px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-colors duration-200 cursor-pointer ${
                              isActive
                                 ? "text-white"
                                 : "text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
                           }`
                        }
                     >
                        {({ isActive }) => (
                           <>
                              {isActive && (
                                 <motion.div
                                    layoutId="active-nav-pill"
                                    className="absolute inset-0 bg-emerald-600 rounded-xl shadow-xs"
                                    transition={{
                                       type: "spring",
                                       stiffness: 350,
                                       damping: 30,
                                    }}
                                 />
                              )}
                              <span className="relative z-10">
                                 Target Wishlist
                              </span>
                           </>
                        )}
                     </NavLink>
                  </div>

                  {/* Receipt / QRIS Scanner CTA Button */}
                  <motion.button
                     whileHover={{ scale: 1.03 }}
                     whileTap={tapScale}
                     type="button"
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
               </nav>

               {/* Right Section: Universal User Avatar Dropdown (All Breakpoints) */}
               <div className="flex items-center gap-2">
                  {/* Quick Mobile Pindai CTA */}
                  <div className="md:hidden">
                     <motion.button
                        whileTap={tapScaleSubtle}
                        type="button"
                        onClick={() => setIsScannerOpen(true)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-medium shadow-xs cursor-pointer"
                        aria-label="Pindai Struk"
                     >
                        <Receipt size={14} />
                        <span className="font-semibold text-xs">Pindai</span>
                     </motion.button>
                  </div>

                  {/* Mobile Theme Switcher */}
                  <div className="md:hidden border border-[var(--color-border)] rounded-xl bg-[var(--color-surface)]">
                     <ThemeSwitcher />
                  </div>

                  {/* User Profile Avatar with Animated Dropdown Menu */}
                  <div className="relative" ref={profileDropdownRef}>
                     <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={tapScaleSubtle}
                        type="button"
                        onClick={() =>
                           setIsProfileDropdownOpen(!isProfileDropdownOpen)
                        }
                        className={`flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-2xl border transition-all cursor-pointer select-none ${
                           isProfileDropdownOpen || isProfile
                              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 shadow-xs"
                              : "bg-[var(--color-surface)] border-[var(--color-border)] hover:border-emerald-500/30 text-[var(--color-ink)]"
                        }`}
                        aria-label="Menu profil pengguna"
                        title="Profil & Pengaturan Akun"
                     >
                        {user?.avatar ? (
                           <img
                              src={user.avatar}
                              alt={user.name || "Profil"}
                              className="w-8 h-8 rounded-xl object-cover border border-emerald-500/30"
                              onError={(e) => {
                                 e.target.onerror = null;
                                 e.target.style.display = "none";
                              }}
                           />
                        ) : (
                           <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                              {initials}
                           </div>
                        )}
                        <span className="hidden sm:inline font-semibold text-xs max-w-[100px] truncate text-[var(--color-ink)]">
                           {user?.name?.split(" ")[0] || "Akun"}
                        </span>
                        <ChevronDown
                           size={13}
                           className={`transition-transform duration-200 text-[var(--color-ink-muted)] ${
                              isProfileDropdownOpen ? "rotate-180" : ""
                           }`}
                        />
                     </motion.button>

                     {/* Animated Dropdown Menu (Framer Motion) */}
                     <AnimatePresence>
                        {isProfileDropdownOpen && (
                           <motion.div
                              variants={dropdownMenu}
                              initial="initial"
                              animate="animate"
                              exit="exit"
                              className="absolute right-0 mt-2 w-64 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-xl p-2 z-50 select-none backdrop-blur-md"
                           >
                              {/* Non-interactive Profile Header */}
                              <div className="p-3 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)] mb-1.5 flex items-center gap-3">
                                 {user?.avatar ? (
                                    <img
                                       src={user.avatar}
                                       alt={user.name || "User"}
                                       className="w-10 h-10 rounded-xl object-cover border border-emerald-500/30 shrink-0"
                                    />
                                 ) : (
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-extrabold text-sm shrink-0">
                                       {initials}
                                    </div>
                                 )}
                                 <div className="min-w-0 flex-1">
                                    <div className="font-bold text-xs text-[var(--color-ink)] truncate">
                                       {user?.name || "Pengguna Sakuin"}
                                    </div>
                                    <div className="text-[11px] text-[var(--color-ink-muted)] truncate">
                                       {user?.email || "-"}
                                    </div>
                                    <span className="inline-flex items-center gap-1 mt-1 px-1.5 py-0.5 rounded-md text-[9px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                       <ShieldCheck size={10} />
                                       <span>
                                          {user?.provider === "google"
                                             ? "Google Akun"
                                             : "Akun Terverifikasi"}
                                       </span>
                                    </span>
                                 </div>
                              </div>

                              {/* Menu Actions (Zero Duplication with BottomNav) */}
                              <div className="space-y-0.5">
                                 <button
                                    type="button"
                                    onClick={() => {
                                       setIsProfileDropdownOpen(false);
                                       navigate("/profile");
                                    }}
                                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                                       isProfile
                                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                          : "text-[var(--color-ink)] hover:bg-[var(--color-bg)]"
                                    }`}
                                 >
                                    <User
                                       size={15}
                                       className="text-emerald-500 stroke-[2.2]"
                                    />
                                    <span>Profil Akun Saya</span>
                                 </button>
                              </div>

                              {/* Divider */}
                              <div className="my-1.5 border-t border-[var(--color-border)]" />

                              {/* Logout Button */}
                              <button
                                 type="button"
                                 onClick={handleLogoutClick}
                                 className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 transition-colors cursor-pointer"
                              >
                                 <span>Keluar dari Akun</span>
                                 <LogOut size={14} className="stroke-[2.2]" />
                              </button>
                           </motion.div>
                        )}
                     </AnimatePresence>
                  </div>
               </div>
            </div>
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
