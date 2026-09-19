import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../utils/api";
import toast from "react-hot-toast";
import { KeyRound, Eye, EyeOff, Loader2, ArrowLeft, CheckCircle2, ShieldAlert } from "lucide-react";
import { motion } from "framer-motion";

export default function ResetPassword() {
   const { token } = useParams();
   const navigate = useNavigate();

   const [password, setPassword] = useState("");
   const [confirmPassword, setConfirmPassword] = useState("");
   const [showPassword, setShowPassword] = useState(false);
   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
   const [loading, setLoading] = useState(false);
   const [errorMessage, setErrorMessage] = useState("");
   const [isSuccess, setIsSuccess] = useState(false);

   const handleSubmit = async (e) => {
      e.preventDefault();
      setErrorMessage("");

      if (password.length < 6) {
         setErrorMessage("Kata sandi baru minimal 6 karakter");
         return;
      }

      if (password !== confirmPassword) {
         setErrorMessage("Konfirmasi kata sandi tidak cocok dengan kata sandi baru");
         return;
      }

      setLoading(true);
      try {
         const res = await api.post(`/auth/reset-password/${token}`, { password });
         setIsSuccess(true);
         toast.success(res.data.message || "Kata sandi berhasil diperbarui!");
         setTimeout(() => {
            navigate("/login");
         }, 2500);
      } catch (err) {
         console.error("Reset password error:", err);
         setErrorMessage(err.response?.data?.message || "Tautan reset tidak valid atau telah kedaluwarsa.");
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
            <div className="text-center mb-6">
               <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-3 shadow-xs">
                  <KeyRound size={24} className="stroke-[2.2]" />
               </div>
               <h1 className="text-xl sm:text-2xl font-extrabold text-[var(--color-ink)] tracking-tight">
                  Atur Ulang Kata Sandi
               </h1>
               <p className="text-xs text-[var(--color-ink-muted)] mt-1 max-w-xs mx-auto">
                  Buat kata sandi baru yang kuat untuk mengamankan akun Sakuin Anda.
               </p>
            </div>

            {errorMessage && (
               <div className="mb-5 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
                  <ShieldAlert size={16} className="shrink-0" />
                  <span>{errorMessage}</span>
               </div>
            )}

            {isSuccess ? (
               <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                     <CheckCircle2 size={22} className="stroke-[2.4]" />
                  </div>
                  <h3 className="font-bold text-sm text-[var(--color-ink)]">
                     Kata Sandi Berhasil Diperbarui
                  </h3>
                  <p className="text-xs text-[var(--color-ink-muted)] leading-relaxed">
                     Mengarahkan Anda ke halaman masuk dalam beberapa detik...
                  </p>
                  <div className="pt-2">
                     <Link
                        to="/login"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
                     >
                        <span>Masuk Sekarang</span>
                     </Link>
                  </div>
               </div>
            ) : (
               <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                     <label className="block mb-1.5 text-xs font-semibold text-[var(--color-ink)]">
                        Kata Sandi Baru
                     </label>
                     <div className="relative">
                        <input
                           type={showPassword ? "text" : "password"}
                           value={password}
                           onChange={(e) => {
                              setPassword(e.target.value);
                              if (errorMessage) setErrorMessage("");
                           }}
                           placeholder="Masukkan kata sandi baru"
                           className="w-full border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-ink)] rounded-xl pl-3.5 pr-11 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
                           required
                           minLength={6}
                        />
                        <button
                           type="button"
                           onClick={() => setShowPassword(!showPassword)}
                           className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] p-1 rounded-lg transition-colors cursor-pointer"
                           aria-label={showPassword ? "Sembunyikan kata sandi" : "Lihat kata sandi"}
                        >
                           {showPassword ? (
                              <EyeOff size={16} className="stroke-[2]" />
                           ) : (
                              <Eye size={16} className="stroke-[2]" />
                           )}
                        </button>
                     </div>
                  </div>

                  <div>
                     <label className="block mb-1.5 text-xs font-semibold text-[var(--color-ink)]">
                        Konfirmasi Kata Sandi Baru
                     </label>
                     <div className="relative">
                        <input
                           type={showConfirmPassword ? "text" : "password"}
                           value={confirmPassword}
                           onChange={(e) => {
                              setConfirmPassword(e.target.value);
                              if (errorMessage) setErrorMessage("");
                           }}
                           placeholder="Masukkan konfirmasi kata sandi baru"
                           className="w-full border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-ink)] rounded-xl pl-3.5 pr-11 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
                           required
                           minLength={6}
                        />
                        <button
                           type="button"
                           onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                           className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] p-1 rounded-lg transition-colors cursor-pointer"
                           aria-label={
                              showConfirmPassword
                                 ? "Sembunyikan konfirmasi kata sandi"
                                 : "Lihat konfirmasi kata sandi"
                           }
                        >
                           {showConfirmPassword ? (
                              <EyeOff size={16} className="stroke-[2]" />
                           ) : (
                              <Eye size={16} className="stroke-[2]" />
                           )}
                        </button>
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
                           <span>Menyimpan Kata Sandi...</span>
                        </>
                     ) : (
                        <span>Simpan Kata Sandi Baru</span>
                     )}
                  </motion.button>

                  <div className="text-center pt-2">
                     <Link
                        to="/login"
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] transition-colors"
                     >
                        <ArrowLeft size={14} />
                        <span>Batal dan Kembali ke Masuk</span>
                     </Link>
                  </div>
               </form>
            )}
         </motion.div>
      </div>
   );
}
