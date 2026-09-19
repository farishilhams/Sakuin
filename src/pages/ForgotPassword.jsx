import React, { useState } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";
import toast from "react-hot-toast";
import { Mail, ArrowLeft, Loader2, CheckCircle2, ShieldAlert } from "lucide-react";
import { motion } from "framer-motion";

export default function ForgotPassword() {
   const [email, setEmail] = useState("");
   const [loading, setLoading] = useState(false);
   const [isSubmitted, setIsSubmitted] = useState(false);
   const [errorMessage, setErrorMessage] = useState("");

   const handleSubmit = async (e) => {
      e.preventDefault();
      if (!email.trim()) {
         setErrorMessage("Masukkan alamat email Anda");
         return;
      }

      setLoading(true);
      setErrorMessage("");

      try {
         const res = await api.post("/auth/forgot-password", { email: email.trim() });
         setIsSubmitted(true);
         toast.success(res.data.message || "Tautan reset telah diproses");
      } catch (err) {
         console.error("Forgot password error:", err);
         // Tetap tampilkan pesan ramah demi keamanan
         setErrorMessage(err.response?.data?.message || "Terjadi kesalahan saat memproses permintaan.");
      } finally {
         setLoading(false);
      }
   };

   return (
      <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center p-4 select-none transition-colors">
         <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-md bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl shadow-xl p-6 sm:p-8"
         >
            {/* Header / Brand */}
            <div className="text-center mb-6">
               <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-3 shadow-xs">
                  <Mail size={24} className="stroke-[2.2]" />
               </div>
               <h1 className="text-xl sm:text-2xl font-extrabold text-[var(--color-ink)] tracking-tight">
                  Lupa Kata Sandi
               </h1>
               <p className="text-xs text-[var(--color-ink-muted)] mt-1 max-w-xs mx-auto">
                  Masukkan email terdaftar untuk menerima tautan pemulihan kata sandi akun Anda.
               </p>
            </div>

            {errorMessage && (
               <div className="mb-5 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
                  <ShieldAlert size={16} className="shrink-0" />
                  <span>{errorMessage}</span>
               </div>
            )}

            {isSubmitted ? (
               <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-3"
               >
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                     <CheckCircle2 size={22} className="stroke-[2.4]" />
                  </div>
                  <h3 className="font-bold text-sm text-[var(--color-ink)]">
                     Permintaan Reset Terkirim
                  </h3>
                  <p className="text-xs text-[var(--color-ink-muted)] leading-relaxed">
                     Jika alamat email <strong className="text-[var(--color-ink)]">{email}</strong> terdaftar di Sakuin, tautan reset kata sandi telah dikirimkan. Tautan berlaku selama 30 menit.
                  </p>
                  <div className="pt-2">
                     <Link
                        to="/login"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
                     >
                        <ArrowLeft size={14} />
                        <span>Kembali ke Halaman Masuk</span>
                     </Link>
                  </div>
               </motion.div>
            ) : (
               <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                     <label className="block mb-1.5 text-xs font-semibold text-[var(--color-ink)]">
                        Alamat Email
                     </label>
                     <div className="relative">
                        <input
                           type="email"
                           value={email}
                           onChange={(e) => {
                              setEmail(e.target.value);
                              if (errorMessage) setErrorMessage("");
                           }}
                           placeholder="Masukkan alamat email terdaftar"
                           className="w-full border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-ink)] rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
                           required
                           autoFocus
                        />
                     </div>
                  </div>

                  <motion.button
                     whileHover={{ scale: 1.01 }}
                     whileTap={{ scale: 0.99 }}
                     type="submit"
                     disabled={loading}
                     className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs tracking-wide shadow-md shadow-emerald-600/20 disabled:opacity-50 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                     {loading ? (
                        <>
                           <Loader2 size={16} className="animate-spin" />
                           <span>Mengirimkan Tautan...</span>
                        </>
                     ) : (
                        <span>Kirim Tautan Reset Kata Sandi</span>
                     )}
                  </motion.button>

                  <div className="text-center pt-2">
                     <Link
                        to="/login"
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] transition-colors"
                     >
                        <ArrowLeft size={14} />
                        <span>Kembali ke Halaman Masuk</span>
                     </Link>
                  </div>
               </form>
            )}
         </motion.div>
      </div>
   );
}
