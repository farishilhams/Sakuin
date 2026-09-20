import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";
import {
   Mail,
   Lock,
   User,
   Eye,
   EyeOff,
   ArrowRight,
   Loader2,
   Wallet,
   ShieldCheck,
   Receipt,
   PieChart,
   Target,
} from "lucide-react";

export interface AuthSwitchProps {
   initialMode?: "sign-in" | "sign-up";
   onModeChange?: (mode: "sign-in" | "sign-up") => void;
}

export const AuthSwitch: React.FC<AuthSwitchProps> = ({
   initialMode = "sign-in",
   onModeChange,
}) => {
   const navigate = useNavigate();
   const location = useLocation();
   const {
      login,
      register,
      loginWithGoogle,
      googleLoginLoading,
      user,
      isAuthChecked,
   } = useContext(AuthContext);

   // Mode state: false = Sign In, true = Sign Up
   const [isSignUp, setIsSignUp] = useState<boolean>(
      initialMode === "sign-up" || location.pathname === "/register"
   );

   // Password visibility states
   const [showSignInPassword, setShowSignInPassword] = useState(false);
   const [showSignUpPassword, setShowSignUpPassword] = useState(false);
   const [showSignUpConfirmPassword, setShowSignUpConfirmPassword] = useState(false);

   // Loading states
   const [isSubmitting, setIsSubmitting] = useState(false);

   // Form data states
   const [signInData, setSignInData] = useState({
      email: "",
      password: "",
   });

   const [signUpData, setSignUpData] = useState({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
   });

   // Validation errors
   const [signInErrors, setSignInErrors] = useState<Record<string, string>>({});
   const [signUpErrors, setSignUpErrors] = useState<Record<string, string>>({});

   // Sync mode if location pathname or initialMode changes
   useEffect(() => {
      if (location.pathname === "/register") {
         setIsSignUp(true);
      } else if (location.pathname === "/login") {
         setIsSignUp(false);
      }
   }, [location.pathname]);

   // Redirect if already authenticated
   useEffect(() => {
      if (isAuthChecked && user) {
         navigate("/", { replace: true });
      }
   }, [user, isAuthChecked, navigate]);

   // Mode switch handler with URL sync
   const handleToggleMode = (signUpMode: boolean) => {
      setIsSignUp(signUpMode);
      setSignInErrors({});
      setSignUpErrors({});
      const targetPath = signUpMode ? "/register" : "/login";
      if (location.pathname !== targetPath) {
         window.history.replaceState(null, "", targetPath);
      }
      if (onModeChange) {
         onModeChange(signUpMode ? "sign-up" : "sign-in");
      }
   };

   // Input change handlers
   const handleSignInChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setSignInData((prev) => ({ ...prev, [name]: value }));
      if (signInErrors[name]) {
         setSignInErrors((prev) => ({ ...prev, [name]: "" }));
      }
   };

   const handleSignUpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setSignUpData((prev) => ({ ...prev, [name]: value }));
      if (signUpErrors[name]) {
         setSignUpErrors((prev) => ({ ...prev, [name]: "" }));
      }
   };

   // Validate Sign In
   const validateSignIn = () => {
      const errors: Record<string, string> = {};
      if (!signInData.email.trim()) {
         errors.email = "Alamat email wajib diisi";
      } else if (!/\S+@\S+\.\S+/.test(signInData.email)) {
         errors.email = "Format alamat email tidak valid";
      }

      if (!signInData.password) {
         errors.password = "Kata sandi wajib diisi";
      }

      setSignInErrors(errors);
      return Object.keys(errors).length === 0;
   };

   // Validate Sign Up
   const validateSignUp = () => {
      const errors: Record<string, string> = {};
      if (!signUpData.name.trim()) {
         errors.name = "Nama lengkap wajib diisi";
      }

      if (!signUpData.email.trim()) {
         errors.email = "Alamat email wajib diisi";
      } else if (!/\S+@\S+\.\S+/.test(signUpData.email)) {
         errors.email = "Format alamat email tidak valid";
      }

      if (!signUpData.password) {
         errors.password = "Kata sandi wajib diisi";
      } else if (signUpData.password.length < 6) {
         errors.password = "Kata sandi minimal 6 karakter";
      }

      if (!signUpData.confirmPassword) {
         errors.confirmPassword = "Konfirmasi kata sandi wajib diisi";
      } else if (signUpData.password !== signUpData.confirmPassword) {
         errors.confirmPassword = "Konfirmasi kata sandi tidak sesuai";
      }

      setSignUpErrors(errors);
      return Object.keys(errors).length === 0;
   };

   // Submit Sign In
   const handleSignInSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!validateSignIn()) return;

      try {
         setIsSubmitting(true);
         await login({
            email: signInData.email.trim(),
            password: signInData.password,
         });
         toast.success("Berhasil masuk! Selamat datang kembali.");
         navigate("/");
      } catch (error: any) {
         console.error("Sign in error:", error);
         const msg =
            error.response?.data?.message ||
            "Gagal masuk. Periksa kembali email dan kata sandi Anda.";
         toast.error(msg);
      } finally {
         setIsSubmitting(false);
      }
   };

   // Submit Sign Up
   const handleSignUpSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!validateSignUp()) return;

      try {
         setIsSubmitting(true);
         await register({
            name: signUpData.name.trim(),
            email: signUpData.email.trim().toLowerCase(),
            password: signUpData.password,
         });
         toast.success("Pendaftaran berhasil! Selamat datang di Sakuin.");
         navigate("/");
      } catch (error: any) {
         console.error("Sign up error:", error);
         const msg =
            error.response?.data?.message ||
            "Pendaftaran akun gagal. Silakan coba beberapa saat lagi.";
         toast.error(msg);
      } finally {
         setIsSubmitting(false);
      }
   };

   return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[var(--color-bg)] p-0 sm:p-4 md:p-6 select-none overflow-x-hidden font-sans">
         <div
            className={`auth-switch-container ${
               isSignUp ? "sign-up-mode" : ""
            }`}
         >
            {/* Forms Container */}
            <div className="auth-forms-container">
               <div className="auth-signin-signup">
                  {/* SIGN IN FORM */}
                  <form
                     onSubmit={handleSignInSubmit}
                     className="auth-form auth-sign-in-form"
                  >
                     {/* Brand Logo Header */}
                     <div className="flex items-center gap-2.5 mb-5">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                           <Wallet size={20} className="stroke-[2.5]" />
                        </div>
                        <span className="font-extrabold text-2xl tracking-tight text-[var(--color-ink)]">
                           Saku<span className="text-emerald-500">in</span>
                        </span>
                     </div>

                     {/* Mobile Tab Switcher */}
                     <div className="flex lg:hidden w-full max-w-[380px] bg-[var(--color-bg)] p-1 rounded-2xl mb-4 border border-[var(--color-border)]">
                        <button
                           type="button"
                           onClick={() => handleToggleMode(false)}
                           className="flex-1 py-1.5 text-xs font-semibold rounded-xl bg-[var(--color-surface)] text-[var(--color-ink)] shadow-xs"
                        >
                           Masuk
                        </button>
                        <button
                           type="button"
                           onClick={() => handleToggleMode(true)}
                           className="flex-1 py-1.5 text-xs font-semibold rounded-xl text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
                        >
                           Daftar
                        </button>
                     </div>

                     <h2 className="text-xl sm:text-2xl font-extrabold text-[var(--color-ink)] tracking-tight mb-1 text-center">
                        Masuk ke Sakuin
                     </h2>
                     <p className="text-xs text-[var(--color-ink-muted)] mb-5 text-center max-w-xs">
                        Masukkan email dan kata sandi terdaftar untuk membuka dashboard keuangan.
                     </p>

                     {/* Email Field */}
                     <div className="relative w-full max-w-[380px] mb-3">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600 dark:text-emerald-400 pointer-events-none">
                           <Mail size={17} className="stroke-[2.2]" />
                        </div>
                        <input
                           type="email"
                           name="email"
                           value={signInData.email}
                           onChange={handleSignInChange}
                           placeholder="Masukkan alamat email"
                           className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-ink)] rounded-2xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all placeholder:text-[var(--color-ink-muted)]"
                        />
                        {signInErrors.email && (
                           <p className="text-[11px] text-rose-500 font-medium mt-1 ml-1">
                              {signInErrors.email}
                           </p>
                        )}
                     </div>

                     {/* Password Field */}
                     <div className="relative w-full max-w-[380px] mb-1.5">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600 dark:text-emerald-400 pointer-events-none">
                           <Lock size={17} className="stroke-[2.2]" />
                        </div>
                        <input
                           type={showSignInPassword ? "text" : "password"}
                           name="password"
                           value={signInData.password}
                           onChange={handleSignInChange}
                           placeholder="Masukkan kata sandi"
                           className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-ink)] rounded-2xl pl-11 pr-11 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all placeholder:text-[var(--color-ink-muted)]"
                        />
                        <button
                           type="button"
                           onClick={() => setShowSignInPassword((prev) => !prev)}
                           className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] p-1 rounded-lg cursor-pointer transition-colors"
                           aria-label={showSignInPassword ? "Sembunyikan kata sandi" : "Lihat kata sandi"}
                        >
                           {showSignInPassword ? (
                              <EyeOff size={16} className="stroke-[2]" />
                           ) : (
                              <Eye size={16} className="stroke-[2]" />
                           )}
                        </button>
                     </div>
                     {signInErrors.password && (
                        <p className="w-full max-w-[380px] text-[11px] text-rose-500 font-medium mb-2 ml-1">
                           {signInErrors.password}
                        </p>
                     )}

                     {/* Forgot Password Link */}
                     <div className="w-full max-w-[380px] flex justify-end mb-4">
                        <button
                           type="button"
                           onClick={() => navigate("/forgot-password")}
                           className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                        >
                           Lupa Kata Sandi?
                        </button>
                     </div>

                     {/* Submit Button */}
                     <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full max-w-[380px] py-3 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs tracking-wide shadow-lg shadow-emerald-600/25 disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
                     >
                        {isSubmitting ? (
                           <>
                              <Loader2 size={16} className="animate-spin" />
                              <span>Memproses Masuk...</span>
                           </>
                        ) : (
                           <>
                              <span>Masuk ke Dashboard</span>
                              <ArrowRight size={15} className="stroke-[2.5]" />
                           </>
                        )}
                     </button>

                     {/* Divider */}
                     <div className="relative w-full max-w-[380px] my-4 text-center">
                        <div className="absolute inset-0 flex items-center">
                           <div className="w-full border-t border-[var(--color-border)]" />
                        </div>
                        <span className="relative bg-[var(--color-surface)] px-3 text-[11px] font-semibold text-[var(--color-ink-muted)]">
                           ATAU
                        </span>
                     </div>

                     {/* Google OAuth Button */}
                     <button
                        type="button"
                        onClick={loginWithGoogle}
                        disabled={googleLoginLoading}
                        className="w-full max-w-[380px] border border-[var(--color-border)] bg-[var(--color-surface)] hover:bg-[var(--color-bg)] text-[var(--color-ink)] py-2.5 px-4 rounded-2xl text-xs font-semibold shadow-xs transition-colors flex items-center justify-center gap-2.5 disabled:opacity-50 cursor-pointer"
                     >
                        {googleLoginLoading ? (
                           <>
                              <Loader2 size={16} className="animate-spin text-emerald-500" />
                              <span>Menghubungkan Google...</span>
                           </>
                        ) : (
                           <>
                              <svg width="18" height="18" viewBox="0 0 24 24" className="shrink-0">
                                 <path
                                    fill="#4285F4"
                                    d="M21.8,12.1c0-0.7-0.1-1.4-0.2-2.1H12v3.9h5.5c-0.2,1.2-0.9,2.3-2,3v2.5h3.2C20.2,17.5,21.8,15,21.8,12.1z"
                                 />
                                 <path
                                    fill="#34A853"
                                    d="M12,22c2.7,0,4.9-0.9,6.5-2.4l-3.2-2.5c-0.9,0.6-2,0.9-3.4,0.9c-2.6,0-4.7-1.7-5.5-4.1H3.1v2.6C4.8,19.7,8.2,22,12,22z"
                                 />
                                 <path
                                    fill="#FBBC05"
                                    d="M6.5,13.9c-0.2-0.6-0.3-1.2-0.3-1.9c0-0.7,0.1-1.3,0.3-1.9V7.6H3.1C2.4,9,2,10.5,2,12s0.4,3,1.1,4.4L6.5,13.9z"
                                 />
                                 <path
                                    fill="#EA4335"
                                    d="M12,5.8c1.4,0,2.7,0.5,3.8,1.5l2.8-2.8C16.9,2.9,14.7,2,12,2C8.2,2,4.8,4.3,3.1,7.6l3.4,2.6C7.3,7.5,9.5,5.8,12,5.8z"
                                 />
                              </svg>
                              <span>Masuk dengan Google</span>
                           </>
                        )}
                     </button>
                  </form>

                  {/* SIGN UP FORM */}
                  <form
                     onSubmit={handleSignUpSubmit}
                     className="auth-form auth-sign-up-form"
                  >
                     {/* Brand Logo Header */}
                     <div className="flex items-center gap-2.5 mb-4">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                           <Wallet size={20} className="stroke-[2.5]" />
                        </div>
                        <span className="font-extrabold text-2xl tracking-tight text-[var(--color-ink)]">
                           Saku<span className="text-emerald-500">in</span>
                        </span>
                     </div>

                     {/* Mobile Tab Switcher */}
                     <div className="flex lg:hidden w-full max-w-[380px] bg-[var(--color-bg)] p-1 rounded-2xl mb-3 border border-[var(--color-border)]">
                        <button
                           type="button"
                           onClick={() => handleToggleMode(false)}
                           className="flex-1 py-1.5 text-xs font-semibold rounded-xl text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
                        >
                           Masuk
                        </button>
                        <button
                           type="button"
                           onClick={() => handleToggleMode(true)}
                           className="flex-1 py-1.5 text-xs font-semibold rounded-xl bg-[var(--color-surface)] text-[var(--color-ink)] shadow-xs"
                        >
                           Daftar
                        </button>
                     </div>

                     <h2 className="text-xl sm:text-2xl font-extrabold text-[var(--color-ink)] tracking-tight mb-1 text-center">
                        Daftar Akun Baru
                     </h2>
                     <p className="text-xs text-[var(--color-ink-muted)] mb-4 text-center max-w-xs">
                        Buat akun gratis untuk mengelola arus kas pribadi sat-set dan teratur.
                     </p>

                     {/* Name Field */}
                     <div className="relative w-full max-w-[380px] mb-2.5">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600 dark:text-emerald-400 pointer-events-none">
                           <User size={17} className="stroke-[2.2]" />
                        </div>
                        <input
                           type="text"
                           name="name"
                           value={signUpData.name}
                           onChange={handleSignUpChange}
                           placeholder="Masukkan nama lengkap"
                           className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-ink)] rounded-2xl pl-11 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all placeholder:text-[var(--color-ink-muted)]"
                        />
                        {signUpErrors.name && (
                           <p className="text-[11px] text-rose-500 font-medium mt-1 ml-1">
                              {signUpErrors.name}
                           </p>
                        )}
                     </div>

                     {/* Email Field */}
                     <div className="relative w-full max-w-[380px] mb-2.5">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600 dark:text-emerald-400 pointer-events-none">
                           <Mail size={17} className="stroke-[2.2]" />
                        </div>
                        <input
                           type="email"
                           name="email"
                           value={signUpData.email}
                           onChange={handleSignUpChange}
                           placeholder="Masukkan alamat email"
                           className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-ink)] rounded-2xl pl-11 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all placeholder:text-[var(--color-ink-muted)]"
                        />
                        {signUpErrors.email && (
                           <p className="text-[11px] text-rose-500 font-medium mt-1 ml-1">
                              {signUpErrors.email}
                           </p>
                        )}
                     </div>

                     {/* Password Field */}
                     <div className="relative w-full max-w-[380px] mb-2.5">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600 dark:text-emerald-400 pointer-events-none">
                           <Lock size={17} className="stroke-[2.2]" />
                        </div>
                        <input
                           type={showSignUpPassword ? "text" : "password"}
                           name="password"
                           value={signUpData.password}
                           onChange={handleSignUpChange}
                           placeholder="Masukkan kata sandi"
                           className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-ink)] rounded-2xl pl-11 pr-11 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all placeholder:text-[var(--color-ink-muted)]"
                        />
                        <button
                           type="button"
                           onClick={() => setShowSignUpPassword((prev) => !prev)}
                           className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] p-1 rounded-lg cursor-pointer transition-colors"
                           aria-label={showSignUpPassword ? "Sembunyikan kata sandi" : "Lihat kata sandi"}
                        >
                           {showSignUpPassword ? (
                              <EyeOff size={16} className="stroke-[2]" />
                           ) : (
                              <Eye size={16} className="stroke-[2]" />
                           )}
                        </button>
                        {signUpErrors.password && (
                           <p className="text-[11px] text-rose-500 font-medium mt-1 ml-1">
                              {signUpErrors.password}
                           </p>
                        )}
                     </div>

                     {/* Confirm Password Field */}
                     <div className="relative w-full max-w-[380px] mb-3">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600 dark:text-emerald-400 pointer-events-none">
                           <Lock size={17} className="stroke-[2.2]" />
                        </div>
                        <input
                           type={showSignUpConfirmPassword ? "text" : "password"}
                           name="confirmPassword"
                           value={signUpData.confirmPassword}
                           onChange={handleSignUpChange}
                           placeholder="Masukkan konfirmasi kata sandi"
                           className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-ink)] rounded-2xl pl-11 pr-11 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all placeholder:text-[var(--color-ink-muted)]"
                        />
                        <button
                           type="button"
                           onClick={() =>
                              setShowSignUpConfirmPassword((prev) => !prev)
                           }
                           className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] p-1 rounded-lg cursor-pointer transition-colors"
                           aria-label={
                              showSignUpConfirmPassword
                                 ? "Sembunyikan konfirmasi kata sandi"
                                 : "Lihat konfirmasi kata sandi"
                           }
                        >
                           {showSignUpConfirmPassword ? (
                              <EyeOff size={16} className="stroke-[2]" />
                           ) : (
                              <Eye size={16} className="stroke-[2]" />
                           )}
                        </button>
                        {signUpErrors.confirmPassword && (
                           <p className="text-[11px] text-rose-500 font-medium mt-1 ml-1">
                              {signUpErrors.confirmPassword}
                           </p>
                        )}
                     </div>

                     {/* Submit Button */}
                     <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full max-w-[380px] py-3 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs tracking-wide shadow-lg shadow-emerald-600/25 disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
                     >
                        {isSubmitting ? (
                           <>
                              <Loader2 size={16} className="animate-spin" />
                              <span>Mendaftarkan Akun...</span>
                           </>
                        ) : (
                           <>
                              <span>Daftar Akun Baru</span>
                              <ArrowRight size={15} className="stroke-[2.5]" />
                           </>
                        )}
                     </button>

                     {/* Divider */}
                     <div className="relative w-full max-w-[380px] my-3.5 text-center">
                        <div className="absolute inset-0 flex items-center">
                           <div className="w-full border-t border-[var(--color-border)]" />
                        </div>
                        <span className="relative bg-[var(--color-surface)] px-3 text-[11px] font-semibold text-[var(--color-ink-muted)]">
                           ATAU
                        </span>
                     </div>

                     {/* Google OAuth Button */}
                     <button
                        type="button"
                        onClick={loginWithGoogle}
                        disabled={googleLoginLoading}
                        className="w-full max-w-[380px] border border-[var(--color-border)] bg-[var(--color-surface)] hover:bg-[var(--color-bg)] text-[var(--color-ink)] py-2.5 px-4 rounded-2xl text-xs font-semibold shadow-xs transition-colors flex items-center justify-center gap-2.5 disabled:opacity-50 cursor-pointer"
                     >
                        {googleLoginLoading ? (
                           <>
                              <Loader2 size={16} className="animate-spin text-emerald-500" />
                              <span>Menghubungkan Google...</span>
                           </>
                        ) : (
                           <>
                              <svg width="18" height="18" viewBox="0 0 24 24" className="shrink-0">
                                 <path
                                    fill="#4285F4"
                                    d="M21.8,12.1c0-0.7-0.1-1.4-0.2-2.1H12v3.9h5.5c-0.2,1.2-0.9,2.3-2,3v2.5h3.2C20.2,17.5,21.8,15,21.8,12.1z"
                                 />
                                 <path
                                    fill="#34A853"
                                    d="M12,22c2.7,0,4.9-0.9,6.5-2.4l-3.2-2.5c-0.9,0.6-2,0.9-3.4,0.9c-2.6,0-4.7-1.7-5.5-4.1H3.1v2.6C4.8,19.7,8.2,22,12,22z"
                                 />
                                 <path
                                    fill="#FBBC05"
                                    d="M6.5,13.9c-0.2-0.6-0.3-1.2-0.3-1.9c0-0.7,0.1-1.3,0.3-1.9V7.6H3.1C2.4,9,2,10.5,2,12s0.4,3,1.1,4.4L6.5,13.9z"
                                 />
                                 <path
                                    fill="#EA4335"
                                    d="M12,5.8c1.4,0,2.7,0.5,3.8,1.5l2.8-2.8C16.9,2.9,14.7,2,12,2C8.2,2,4.8,4.3,3.1,7.6l3.4,2.6C7.3,7.5,9.5,5.8,12,5.8z"
                                 />
                              </svg>
                              <span>Daftar dengan Google</span>
                           </>
                        )}
                     </button>
                  </form>
               </div>
            </div>

            {/* Sliding Panels Container */}
            <div className="auth-panels-container">
               {/* Left Panel (Prompts to Sign Up) */}
               <div className="auth-panel auth-left-panel">
                  <div className="auth-panel-content">
                     <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/20 flex items-center justify-center text-white mb-4">
                        <ShieldCheck size={26} />
                     </div>
                     <h3 className="text-2xl font-extrabold text-white tracking-tight leading-snug mb-2">
                        Baru di Sakuin?
                     </h3>
                     <p className="text-xs text-emerald-50/90 leading-relaxed max-w-xs mb-1">
                        Daftarkan akun gratis untuk mengontrol pengeluaran harian, mencegah boncos dengan anggaran amplop, dan merencanakan barang impian dengan tenang.
                     </p>
                     <button
                        type="button"
                        className="auth-btn-transparent"
                        onClick={() => handleToggleMode(true)}
                     >
                        <span>Daftar Akun</span>
                        <ArrowRight size={14} className="stroke-[2.5]" />
                     </button>
                  </div>
               </div>

               {/* Right Panel (Prompts to Sign In) */}
               <div className="auth-panel auth-right-panel">
                  <div className="auth-panel-content">
                     <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/20 flex items-center justify-center text-white mb-4">
                        <PieChart size={26} />
                     </div>
                     <h3 className="text-2xl font-extrabold text-white tracking-tight leading-snug mb-2">
                        Sudah Punya Akun?
                     </h3>
                     <p className="text-xs text-emerald-50/90 leading-relaxed max-w-xs mb-1">
                        Masuk kembali untuk memantau arus kas, alokasi amplop anggaran, dan ringkasan transaksi terbaru Anda.
                     </p>
                     <button
                        type="button"
                        className="auth-btn-transparent"
                        onClick={() => handleToggleMode(false)}
                     >
                        <span>Masuk Akun</span>
                        <ArrowRight size={14} className="stroke-[2.5]" />
                     </button>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default AuthSwitch;
