import React, { useContext } from "react";
import { X, User, Mail, ShieldCheck, LogOut, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../context/AuthContext";

const ProfileModal = ({ isOpen, onClose, user: propUser, onLogout }) => {
   const { user: authUser, logout } = useContext(AuthContext);
   const user = propUser || authUser;
   const handleLogout = onLogout || logout;

   if (!isOpen || !user) return null;

   const initials = user.name
      ? user.name
           .split(" ")
           .map((n) => n[0])
           .slice(0, 2)
           .join("")
           .toUpperCase()
      : "U";

   return (
      <AnimatePresence>
         <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div
               initial={{ opacity: 0, y: 40, scale: 0.98 }}
               animate={{ opacity: 1, y: 0, scale: 1 }}
               exit={{ opacity: 0, y: 40, scale: 0.98 }}
               transition={{ duration: 0.22, ease: "easeOut" }}
               className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-t-3xl sm:rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden"
            >
               {/* Mobile Sheet Handle */}
               <div className="sm:hidden w-12 h-1.5 bg-[var(--color-border)] rounded-full mx-auto mt-2.5 mb-1 shrink-0" />

               {/* Modal Header */}
               <div className="px-5 py-3.5 border-b border-[var(--color-border)] flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-2">
                     <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                        <User size={16} className="stroke-[2.4]" />
                     </div>
                     <h2 className="font-bold text-base text-[var(--color-ink)]">
                        Profil Akun
                     </h2>
                  </div>

                  <button
                     type="button"
                     onClick={onClose}
                     className="p-2 rounded-xl bg-[var(--color-bg)] hover:bg-slate-200 dark:hover:bg-slate-800 text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] transition-colors cursor-pointer"
                     aria-label="Tutup profil"
                  >
                     <X size={16} />
                  </button>
               </div>

               {/* Profile Content */}
               <div className="p-6 space-y-5 overflow-y-auto">
                  {/* User Info Hero */}
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-[var(--color-bg)] border border-[var(--color-border)]">
                     {user.avatar ? (
                        <img
                           src={user.avatar}
                           alt={user.name}
                           className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-500/30"
                        />
                     ) : (
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-extrabold text-xl flex items-center justify-center shadow-md shadow-emerald-500/20">
                           {initials}
                        </div>
                     )}

                     <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-base text-[var(--color-ink)] truncate">
                           {user.name}
                        </h3>
                        <p className="text-xs text-[var(--color-ink-muted)] truncate mt-0.5">
                           {user.email}
                        </p>
                        <div className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-semibold">
                           <CheckCircle2 size={12} />
                           <span>Akun Terverifikasi</span>
                        </div>
                     </div>
                  </div>

                  {/* Account Details */}
                  <div className="space-y-3 text-xs">
                     <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)]">
                        <span className="text-[var(--color-ink-muted)] flex items-center gap-2">
                           <Mail size={15} />
                           <span>Alamat Email</span>
                        </span>
                        <span className="font-semibold text-[var(--color-ink)] truncate max-w-[200px]">
                           {user.email}
                        </span>
                     </div>

                     <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)]">
                        <span className="text-[var(--color-ink-muted)] flex items-center gap-2">
                           <ShieldCheck size={15} />
                           <span>Metode Autentikasi</span>
                        </span>
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                           {user.googleId ? "Google OAuth" : "Email & Kata Sandi"}
                        </span>
                     </div>
                  </div>

                  {/* Logout Button */}
                  <div className="pt-3 border-t border-[var(--color-border)]">
                     <button
                        type="button"
                        onClick={() => {
                           onClose();
                           handleLogout();
                        }}
                        className="w-full py-2.5 px-4 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                     >
                        <LogOut size={16} />
                        <span>Keluar dari Akun</span>
                     </button>
                  </div>
               </div>
            </motion.div>
         </div>
      </AnimatePresence>
   );
};

export default ProfileModal;
