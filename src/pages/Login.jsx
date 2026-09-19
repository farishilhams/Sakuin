import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import LoginGoogleButton from "../components/LoginGoogleButton";
import TutorialPenggunaanAtLogin from "../components/TutorialPenggunaanAtLogin";
import {
   ArrowRight,
   BookOpen,
   AlertCircle,
   Wallet,
   ScanLine,
   PieChart,
   Target,
   Sparkles,
   CheckCircle2,
   Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Login = () => {
   const {
      login,
      register,
      authError,
      user,
      loading,
      isAuthChecked,
      loginWithGoogle,
      googleLoginLoading,
   } = useContext(AuthContext);

   const [isRegister, setIsRegister] = useState(false);
   const [formData, setFormData] = useState({
      name: "",
      email: "",
      password: "",
   });
   const [showTutorial, setShowTutorial] = useState(false);
   const [localAuthError, setLocalAuthError] = useState(null);
   const [validationErrors, setValidationErrors] = useState({});
   const navigate = useNavigate();

   useEffect(() => {
      if (isAuthChecked && user) {
         navigate("/");
      }
   }, [user, navigate, isAuthChecked]);

   useEffect(() => {
      if (!loading) {
         setLocalAuthError(authError);
      }
   }, [authError, loading]);

   useEffect(() => {
      setValidationErrors({});
      setLocalAuthError(null);
   }, [isRegister]);

   if (!isAuthChecked) {
      return (
         <div className="flex items-center justify-center min-h-screen bg-[var(--color-bg)] text-xs text-[var(--color-ink-muted)]">
            <Loader2 size={24} className="animate-spin text-emerald-500 mr-2" />
            <span>Memeriksa sesi pengguna...</span>
         </div>
      );
   }

   const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });

      if (validationErrors[name]) {
         setValidationErrors({
            ...validationErrors,
            [name]: "",
         });
      }
   };

   const validateForm = () => {
      const errors = {};

      if (isRegister && !formData.name.trim()) {
         errors.name = "Nama lengkap wajib diisi";
      }

      if (!formData.email) {
         errors.email = "Alamat email wajib diisi";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
         errors.email = "Format email tidak valid";
      }

      if (!formData.password) {
         errors.password = "Kata sandi wajib diisi";
      } else if (isRegister && formData.password.length < 6) {
         errors.password = "Kata sandi minimal 6 karakter";
      }

      setValidationErrors(errors);
      return Object.keys(errors).length === 0;
   };

   const handleSubmit = (e) => {
      e.preventDefault();
      const isValid = validateForm();
      if (!isValid) return;

      setLocalAuthError(null);

      if (isRegister) {
         register(formData);
      } else {
         login({ email: formData.email, password: formData.password });
      }
   };

   const handleGoogleLogin = () => {
      loginWithGoogle();
   };

   return (
      <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[var(--color-bg)] text-[var(--color-ink)]">
         {/* Left Side: Brand Showcase & Features */}
         <div className="w-full lg:w-[46%] bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950 text-white p-8 sm:p-12 lg:p-16 flex flex-col justify-between relative overflow-hidden">
            {/* Ambient background blur glow */}
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10">
               {/* Brand Header */}
               <div className="flex items-center gap-3 mb-10">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30">
                     <Wallet size={20} className="stroke-[2.5]" />
                  </div>
                  <div>
                     <span className="font-extrabold text-2xl tracking-tight text-white leading-none">
                        Saku<span className="text-emerald-400">in</span>
                     </span>
                     <p className="text-[10px] uppercase font-semibold tracking-wider text-emerald-400/80 mt-0.5">
                        Kelola Uang Saku & Belanja
                     </p>
                  </div>
               </div>

               <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
               >
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold mb-4">
                     <Sparkles size={13} />
                     <span>Versi Modern dengan AI Scanner</span>
                  </div>

                  <h1 className="font-extrabold text-3xl sm:text-4xl lg:text-5xl tracking-tight leading-tight text-white mb-4">
                     Catat Uang Saku, <br />
                     <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300">
                        Atur Budget Cerdas.
                     </span>
                  </h1>

                  <p className="text-sm text-slate-300 leading-relaxed max-w-md mb-8">
                     Dari kata <em>"masukin ke saku"</em>. Platform manajemen keuangan pribadi yang intuitif, cepat, dan rapi untuk laptop, tablet, dan ponsel Anda.
                  </p>
               </motion.div>

               {/* Feature highlights */}
               <div className="space-y-3.5 max-w-md hidden sm:block">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
                     <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                        <ScanLine size={18} />
                     </div>
                     <div>
                        <h4 className="text-xs font-semibold text-white">AI Receipt / QRIS Scanner</h4>
                        <p className="text-[11px] text-slate-400">Foto struk atau screenshot m-banking untuk catat instan.</p>
                     </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
                     <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center shrink-0">
                        <PieChart size={18} />
                     </div>
                     <div>
                        <h4 className="text-xs font-semibold text-white">Alokasi Budget Dinamis</h4>
                        <p className="text-[11px] text-slate-400">Meteran real-time per pos kebutuhan bulanan.</p>
                     </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
                     <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                        <Target size={18} />
                     </div>
                     <div>
                        <h4 className="text-xs font-semibold text-white">Target Wishlist & PDF Export</h4>
                        <p className="text-[11px] text-slate-400">Rencanakan barang impian dan unduh laporan kapan saja.</p>
                     </div>
                  </div>
               </div>
            </div>

            {/* Footer Left */}
            <div className="relative z-10 pt-8 mt-8 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
               <span>© {new Date().getFullYear()} Faris Ilham</span>
               <span>v2.0 Modern Edition</span>
            </div>
         </div>

         {/* Right Side: Authentication Form */}
         <div className="w-full lg:w-[54%] flex items-center justify-center p-6 sm:p-10 lg:p-16">
            <motion.div
               initial={{ opacity: 0, scale: 0.98 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ duration: 0.3 }}
               className="w-full max-w-md bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl p-6 sm:p-8 shadow-lg shadow-black/5"
            >
               {/* Tab Switcher */}
               <div className="flex bg-[var(--color-bg)] p-1 rounded-xl mb-6 border border-[var(--color-border)]">
                  <button
                     type="button"
                     onClick={() => setIsRegister(false)}
                     className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                        !isRegister
                           ? "bg-[var(--color-surface)] text-[var(--color-ink)] shadow-xs"
                           : "text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
                     }`}
                  >
                     Masuk Akun
                  </button>
                  <button
                     type="button"
                     onClick={() => setIsRegister(true)}
                     className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                        isRegister
                           ? "bg-[var(--color-surface)] text-[var(--color-ink)] shadow-xs"
                           : "text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
                     }`}
                  >
                     Daftar Baru
                  </button>
               </div>

               {/* Title */}
               <div className="mb-6">
                  <h2 className="text-xl sm:text-2xl font-extrabold text-[var(--color-ink)] tracking-tight">
                     {isRegister ? "Buat Akun Sakuin" : "Selamat Datang Kembali"}
                  </h2>
                  <p className="text-xs text-[var(--color-ink-muted)] mt-1">
                     {isRegister
                        ? "Daftarkan akun gratis untuk mulai mengelola keuangan Anda."
                        : "Masukkan email dan kata sandi Anda untuk mengakses dashboard."}
                  </p>
               </div>

               {/* Error Banner */}
               {localAuthError && (
                  <div className="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-medium flex items-center gap-2">
                     <AlertCircle size={16} className="shrink-0" />
                     <span>{localAuthError}</span>
                  </div>
               )}

               {/* Form Fields */}
               <form onSubmit={handleSubmit} className="space-y-4">
                  {isRegister && (
                     <div>
                        <label className="block mb-1.5 text-xs font-semibold text-[var(--color-ink)]">
                           Nama Lengkap
                        </label>
                        <input
                           type="text"
                           name="name"
                           value={formData.name}
                           onChange={handleChange}
                           className="w-full border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-ink)] rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
                           placeholder="Faris Ilham"
                        />
                        {validationErrors.name && (
                           <p className="text-[11px] text-rose-500 mt-1 font-medium">
                              {validationErrors.name}
                           </p>
                        )}
                     </div>
                  )}

                  <div>
                     <label className="block mb-1.5 text-xs font-semibold text-[var(--color-ink)]">
                        Alamat Email
                     </label>
                     <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-ink)] rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
                        placeholder="nama@email.com"
                     />
                     {validationErrors.email && (
                        <p className="text-[11px] text-rose-500 mt-1 font-medium">
                           {validationErrors.email}
                        </p>
                     )}
                  </div>

                  <div>
                     <label className="block mb-1.5 text-xs font-semibold text-[var(--color-ink)]">
                        Kata Sandi
                     </label>
                     <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-ink)] rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
                        placeholder="••••••••"
                     />
                     {validationErrors.password && (
                        <p className="text-[11px] text-rose-500 mt-1 font-medium">
                           {validationErrors.password}
                        </p>
                     )}
                  </div>

                  {/* Submit Button */}
                  <motion.button
                     whileHover={{ scale: 1.01 }}
                     whileTap={{ scale: 0.99 }}
                     type="submit"
                     disabled={loading}
                     className="w-full mt-2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs tracking-wide shadow-md shadow-emerald-600/20 disabled:opacity-50 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                     {loading ? (
                        <>
                           <Loader2 size={16} className="animate-spin" />
                           <span>Memproses...</span>
                        </>
                     ) : (
                        <>
                           <span>{isRegister ? "Daftar Sekarang" : "Masuk ke Dashboard"}</span>
                           <ArrowRight size={14} className="stroke-[2.5]" />
                        </>
                     )}
                  </motion.button>
               </form>

               {/* Divider ── atau ── */}
               <div className="relative my-5 text-center">
                  <div className="absolute inset-0 flex items-center">
                     <div className="w-full border-t border-[var(--color-border)]" />
                  </div>
                  <span className="relative bg-[var(--color-surface)] px-3 text-[11px] font-semibold text-[var(--color-ink-muted)]">
                     ATAU
                  </span>
               </div>

               {/* Google OAuth Button */}
               <div>
                  <LoginGoogleButton
                     onClick={handleGoogleLogin}
                     isLoading={googleLoginLoading}
                     isRegister={isRegister}
                  />
               </div>

               {/* Footer switch & tutorial button */}
               <div className="mt-6 pt-4 border-t border-[var(--color-border)] flex items-center justify-between text-xs">
                  <button
                     type="button"
                     onClick={() => setIsRegister(!isRegister)}
                     className="text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] transition-colors"
                  >
                     {isRegister ? "Sudah punya akun? " : "Belum punya akun? "}
                     <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                        {isRegister ? "Masuk" : "Daftar"}
                     </span>
                  </button>

                  <button
                     type="button"
                     onClick={() => setShowTutorial(true)}
                     className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] transition-colors cursor-pointer"
                  >
                     <BookOpen size={13} className="text-emerald-500" />
                     <span>Panduan</span>
                  </button>
               </div>
            </motion.div>
         </div>

         {/* Tutorial Modal */}
         {showTutorial && (
            <TutorialPenggunaanAtLogin setShowTutorial={setShowTutorial} />
         )}
      </div>
   );
};

export default Login;