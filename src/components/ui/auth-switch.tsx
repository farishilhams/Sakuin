import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
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
   PieChart,
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
      <div className="w-full min-h-[100dvh] flex flex-col justify-center items-center bg-slate-950 font-sans select-none overflow-x-hidden">
         {/* ========================================================================= */}
         {/* 1. MOBILE & TABLET LAYOUT (< 1024px) - Fluid, Scrollable, No Letterboxing */}
         {/* ========================================================================= */}
         <div className="w-full min-h-[100dvh] flex lg:hidden flex-col justify-center items-center px-4 py-8 pb-14 overflow-y-auto">
            <div className="w-full max-w-md mx-auto bg-slate-900 border border-slate-800/90 rounded-2xl p-5 sm:p-7 shadow-2xl">
               {/* Brand Header */}
               <div className="flex items-center justify-center gap-2.5 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                     <Wallet size={20} className="stroke-[2.5]" />
                  </div>
                  <span className="font-extrabold text-2xl tracking-tight text-white">
                     Saku<span className="text-emerald-400">in</span>
                  </span>
               </div>

               {/* Tab Switcher: Balanced Grid 2 Columns */}
               <div className="grid grid-cols-2 p-1 w-full rounded-xl bg-slate-950 border border-slate-800 mb-5">
                  <button
                     type="button"
                     onClick={() => handleToggleMode(false)}
                     className={`w-full py-2.5 text-center text-sm font-semibold transition-all rounded-lg cursor-pointer ${
                        !isSignUp
                           ? "bg-emerald-600 text-white shadow-sm"
                           : "text-slate-400 hover:text-white"
                     }`}
                  >
                     Masuk
                  </button>
                  <button
                     type="button"
                     onClick={() => handleToggleMode(true)}
                     className={`w-full py-2.5 text-center text-sm font-semibold transition-all rounded-lg cursor-pointer ${
                        isSignUp
                           ? "bg-emerald-600 text-white shadow-sm"
                           : "text-slate-400 hover:text-white"
                     }`}
                  >
                     Daftar
                  </button>
               </div>

               {/* Form Heading */}
               <div className="text-center mb-5">
                  <h2 className="text-xl font-bold text-white tracking-tight">
                     {isSignUp ? "Daftar Akun Baru" : "Masuk ke Sakuin"}
                  </h2>
                  <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                     {isSignUp
                        ? "Buat akun gratis untuk mengelola arus kas pribadi sat-set dan teratur."
                        : "Masukkan email dan kata sandi terdaftar untuk membuka dashboard."}
                  </p>
               </div>

               {/* Active Form with Balanced Spacing */}
               <form
                  onSubmit={isSignUp ? handleSignUpSubmit : handleSignInSubmit}
                  className="space-y-3.5"
               >
                  {/* Name field: only on sign-up */}
                  {isSignUp && (
                     <div className="relative w-full">
                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-400 pointer-events-none">
                           <User size={18} className="stroke-[2.2]" />
                        </div>
                        <input
                           type="text"
                           name="name"
                           value={signUpData.name}
                           onChange={handleSignUpChange}
                           placeholder="Masukkan nama lengkap"
                           className="w-full h-12 bg-slate-950/80 border border-slate-800 text-white rounded-xl pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all placeholder:text-slate-500"
                        />
                        {signUpErrors.name && (
                           <p className="text-[11px] text-rose-400 font-medium mt-1 ml-1">
                              {signUpErrors.name}
                           </p>
                        )}
                     </div>
                  )}

                  {/* Email Field */}
                  <div className="relative w-full">
                     <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-400 pointer-events-none">
                        <Mail size={18} className="stroke-[2.2]" />
                     </div>
                     <input
                        type="email"
                        name="email"
                        value={isSignUp ? signUpData.email : signInData.email}
                        onChange={
                           isSignUp ? handleSignUpChange : handleSignInChange
                        }
                        placeholder="Masukkan alamat email"
                        className="w-full h-12 bg-slate-950/80 border border-slate-800 text-white rounded-xl pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all placeholder:text-slate-500"
                     />
                     {(isSignUp ? signUpErrors.email : signInErrors.email) && (
                        <p className="text-[11px] text-rose-400 font-medium mt-1 ml-1">
                           {isSignUp
                              ? signUpErrors.email
                              : signInErrors.email}
                        </p>
                     )}
                  </div>

                  {/* Password Field */}
                  <div className="relative w-full">
                     <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-400 pointer-events-none">
                        <Lock size={18} className="stroke-[2.2]" />
                     </div>
                     <input
                        type={
                           isSignUp
                              ? showSignUpPassword
                                 ? "text"
                                 : "password"
                              : showSignInPassword
                              ? "text"
                              : "password"
                        }
                        name="password"
                        value={
                           isSignUp
                              ? signUpData.password
                              : signInData.password
                        }
                        onChange={
                           isSignUp ? handleSignUpChange : handleSignInChange
                        }
                        placeholder="Masukkan kata sandi"
                        className="w-full h-12 bg-slate-950/80 border border-slate-800 text-white rounded-xl pl-11 pr-11 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all placeholder:text-slate-500"
                     />
                     <button
                        type="button"
                        onClick={() =>
                           isSignUp
                              ? setShowSignUpPassword((prev) => !prev)
                              : setShowSignInPassword((prev) => !prev)
                        }
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
                        aria-label="Toggle kata sandi"
                     >
                        {(isSignUp ? showSignUpPassword : showSignInPassword) ? (
                           <EyeOff size={18} className="stroke-[2]" />
                        ) : (
                           <Eye size={18} className="stroke-[2]" />
                        )}
                     </button>
                     {(isSignUp
                        ? signUpErrors.password
                        : signInErrors.password) && (
                        <p className="text-[11px] text-rose-400 font-medium mt-1 ml-1">
                           {isSignUp
                              ? signUpErrors.password
                              : signInErrors.password}
                        </p>
                     )}
                  </div>

                  {/* Confirm Password field: only on sign-up */}
                  {isSignUp && (
                     <div className="relative w-full">
                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-400 pointer-events-none">
                           <Lock size={18} className="stroke-[2.2]" />
                        </div>
                        <input
                           type={showSignUpConfirmPassword ? "text" : "password"}
                           name="confirmPassword"
                           value={signUpData.confirmPassword}
                           onChange={handleSignUpChange}
                           placeholder="Masukkan konfirmasi kata sandi"
                           className="w-full h-12 bg-slate-950/80 border border-slate-800 text-white rounded-xl pl-11 pr-11 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all placeholder:text-slate-500"
                        />
                        <button
                           type="button"
                           onClick={() =>
                              setShowSignUpConfirmPassword((prev) => !prev)
                           }
                           className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
                           aria-label="Toggle konfirmasi kata sandi"
                        >
                           {showSignUpConfirmPassword ? (
                              <EyeOff size={18} className="stroke-[2]" />
                           ) : (
                              <Eye size={18} className="stroke-[2]" />
                           )}
                        </button>
                        {signUpErrors.confirmPassword && (
                           <p className="text-[11px] text-rose-400 font-medium mt-1 ml-1">
                              {signUpErrors.confirmPassword}
                           </p>
                        )}
                     </div>
                  )}

                  {/* Forgot Password link: only on sign-in */}
                  {!isSignUp && (
                     <div className="flex justify-end w-full pt-0.5">
                        <button
                           type="button"
                           onClick={() => navigate("/forgot-password")}
                           className="text-xs font-semibold text-emerald-400 hover:underline cursor-pointer"
                        >
                           Lupa Kata Sandi?
                        </button>
                     </div>
                  )}

                  {/* Submit Button (h-12, w-full, bold) */}
                  <button
                     type="submit"
                     disabled={isSubmitting}
                     className="w-full h-12 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm tracking-wide shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] disabled:opacity-50 mt-1"
                  >
                     {isSubmitting ? (
                        <>
                           <Loader2 size={18} className="animate-spin" />
                           <span>Memproses...</span>
                        </>
                     ) : (
                        <>
                           <span>
                              {isSignUp
                                 ? "Daftar Akun Baru"
                                 : "Masuk ke Dashboard"}
                           </span>
                           <ArrowRight size={16} className="stroke-[2.5]" />
                        </>
                     )}
                  </button>

                  {/* Divider ATAU */}
                  <div className="relative w-full my-4 text-center">
                     <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-800" />
                     </div>
                     <span className="relative bg-slate-900 px-3 text-[11px] font-semibold text-slate-400">
                        ATAU
                     </span>
                  </div>

                  {/* Google OAuth Button */}
                  <button
                     type="button"
                     onClick={loginWithGoogle}
                     disabled={googleLoginLoading}
                     className="w-full h-12 rounded-xl border border-slate-800 bg-slate-950/80 hover:bg-slate-800 text-white text-xs font-semibold shadow-sm transition-colors flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50"
                  >
                     {googleLoginLoading ? (
                        <>
                           <Loader2
                              size={16}
                              className="animate-spin text-emerald-400"
                           />
                           <span>Menghubungkan Google...</span>
                        </>
                     ) : (
                        <>
                           <svg
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                              className="shrink-0"
                           >
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
                           <span>
                              {isSignUp
                                 ? "Daftar dengan Google"
                                 : "Masuk dengan Google"}
                           </span>
                        </>
                     )}
                  </button>

                  {/* Footer Switch Prompt with Generous Clearance */}
                  <div className="pt-4 pb-2 text-center">
                     <p className="text-xs text-slate-400">
                        {isSignUp ? "Sudah punya akun?" : "Belum punya akun?"}{" "}
                        <button
                           type="button"
                           onClick={() => handleToggleMode(!isSignUp)}
                           className="font-semibold text-emerald-400 hover:underline cursor-pointer ml-1"
                        >
                           {isSignUp ? "Masuk ke Akun" : "Daftar Sekarang"}
                        </button>
                     </p>
                  </div>
               </form>
            </div>
         </div>

         {/* ========================================================================= */}
         {/* 2. DESKTOP SLIDING LAYOUT (>= 1024px) - Clean Two-Half Sliding Animation */}
         {/* ========================================================================= */}
         <div className="hidden lg:flex w-full max-w-[1020px] min-h-[640px] bg-slate-900 border border-slate-800 rounded-3xl relative overflow-hidden shadow-2xl my-8">
            {/* Left Column (50% width) */}
            <div className="w-1/2 min-h-[640px] flex items-center justify-center p-10 z-10">
               {isSignUp ? (
                  /* When isSignUp is true, Left Column hosts the SIGN UP FORM */
                  <div className="w-full max-w-[360px]">
                     <div className="flex items-center gap-2 mb-4">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                           <Wallet size={18} className="stroke-[2.5]" />
                        </div>
                        <span className="font-extrabold text-2xl tracking-tight text-white">
                           Saku<span className="text-emerald-400">in</span>
                        </span>
                     </div>
                     <h2 className="text-2xl font-bold text-white tracking-tight mb-1">
                        Daftar Akun Baru
                     </h2>
                     <p className="text-xs text-slate-400 mb-5">
                        Kelola arus kas dan uang saku Anda secara teratur.
                     </p>
                     <form onSubmit={handleSignUpSubmit} className="space-y-3">
                        <div className="relative">
                           <User
                              size={17}
                              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-400 pointer-events-none"
                           />
                           <input
                              type="text"
                              name="name"
                              value={signUpData.name}
                              onChange={handleSignUpChange}
                              placeholder="Masukkan nama lengkap"
                              className="w-full h-11 bg-slate-950 border border-slate-800 text-white rounded-xl pl-10 pr-4 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                           />
                           {signUpErrors.name && (
                              <p className="text-[11px] text-rose-400 mt-1">
                                 {signUpErrors.name}
                              </p>
                           )}
                        </div>
                        <div className="relative">
                           <Mail
                              size={17}
                              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-400 pointer-events-none"
                           />
                           <input
                              type="email"
                              name="email"
                              value={signUpData.email}
                              onChange={handleSignUpChange}
                              placeholder="Masukkan alamat email"
                              className="w-full h-11 bg-slate-950 border border-slate-800 text-white rounded-xl pl-10 pr-4 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                           />
                           {signUpErrors.email && (
                              <p className="text-[11px] text-rose-400 mt-1">
                                 {signUpErrors.email}
                              </p>
                           )}
                        </div>
                        <div className="relative">
                           <Lock
                              size={17}
                              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-400 pointer-events-none"
                           />
                           <input
                              type={showSignUpPassword ? "text" : "password"}
                              name="password"
                              value={signUpData.password}
                              onChange={handleSignUpChange}
                              placeholder="Masukkan kata sandi"
                              className="w-full h-11 bg-slate-950 border border-slate-800 text-white rounded-xl pl-10 pr-10 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                           />
                           <button
                              type="button"
                              onClick={() => setShowSignUpPassword((prev) => !prev)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                           >
                              {showSignUpPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                           </button>
                           {signUpErrors.password && (
                              <p className="text-[11px] text-rose-400 mt-1">
                                 {signUpErrors.password}
                              </p>
                           )}
                        </div>
                        <div className="relative">
                           <Lock
                              size={17}
                              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-400 pointer-events-none"
                           />
                           <input
                              type={
                                 showSignUpConfirmPassword ? "text" : "password"
                              }
                              name="confirmPassword"
                              value={signUpData.confirmPassword}
                              onChange={handleSignUpChange}
                              placeholder="Masukkan konfirmasi kata sandi"
                              className="w-full h-11 bg-slate-950 border border-slate-800 text-white rounded-xl pl-10 pr-10 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                           />
                           <button
                              type="button"
                              onClick={() =>
                                 setShowSignUpConfirmPassword((prev) => !prev)
                              }
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                           >
                              {showSignUpConfirmPassword ? (
                                 <EyeOff size={16} />
                              ) : (
                                 <Eye size={16} />
                              )}
                           </button>
                           {signUpErrors.confirmPassword && (
                              <p className="text-[11px] text-rose-400 mt-1">
                                 {signUpErrors.confirmPassword}
                              </p>
                           )}
                        </div>
                        <button
                           type="submit"
                           disabled={isSubmitting}
                           className="w-full h-11 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
                        >
                           {isSubmitting ? (
                              <Loader2 size={16} className="animate-spin" />
                           ) : (
                              <>
                                 <span>Daftar Akun Baru</span>
                                 <ArrowRight size={14} />
                              </>
                           )}
                        </button>
                        <button
                           type="button"
                           onClick={loginWithGoogle}
                           disabled={googleLoginLoading}
                           className="w-full h-11 rounded-xl border border-slate-800 bg-slate-950 hover:bg-slate-800 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
                        >
                           <span>Daftar dengan Google</span>
                        </button>
                     </form>
                  </div>
               ) : (
                  /* When isSignUp is false, Left Column hosts the WELCOME OVERLAY PANEL */
                  <div className="text-center text-white px-6">
                     <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center mx-auto mb-5">
                        <ShieldCheck size={30} />
                     </div>
                     <h3 className="text-3xl font-extrabold tracking-tight mb-3">
                        Baru di Sakuin?
                     </h3>
                     <p className="text-xs text-emerald-100/90 leading-relaxed max-w-xs mx-auto mb-6">
                        Daftarkan akun gratis untuk mengontrol pengeluaran harian, mencegah boncos dengan anggaran amplop, dan merencanakan barang impian dengan tenang.
                     </p>
                     <button
                        type="button"
                        onClick={() => handleToggleMode(true)}
                        className="px-8 py-2.5 rounded-full border-2 border-white text-white font-semibold text-xs tracking-wider uppercase hover:bg-white/15 transition-all cursor-pointer inline-flex items-center gap-2"
                     >
                        <span>Daftar Akun</span>
                        <ArrowRight size={14} />
                     </button>
                  </div>
               )}
            </div>

            {/* Right Column (50% width) */}
            <div className="w-1/2 min-h-[640px] flex items-center justify-center p-10 z-10">
               {!isSignUp ? (
                  /* When isSignUp is false, Right Column hosts the SIGN IN FORM */
                  <div className="w-full max-w-[360px]">
                     <div className="flex items-center gap-2 mb-5">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                           <Wallet size={18} className="stroke-[2.5]" />
                        </div>
                        <span className="font-extrabold text-2xl tracking-tight text-white">
                           Saku<span className="text-emerald-400">in</span>
                        </span>
                     </div>
                     <h2 className="text-2xl font-bold text-white tracking-tight mb-1">
                        Masuk ke Sakuin
                     </h2>
                     <p className="text-xs text-slate-400 mb-6">
                        Buka dashboard keuangan pribadi Anda.
                     </p>
                     <form onSubmit={handleSignInSubmit} className="space-y-3.5">
                        <div className="relative">
                           <Mail
                              size={17}
                              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-400 pointer-events-none"
                           />
                           <input
                              type="email"
                              name="email"
                              value={signInData.email}
                              onChange={handleSignInChange}
                              placeholder="Masukkan alamat email"
                              className="w-full h-12 bg-slate-950 border border-slate-800 text-white rounded-xl pl-11 pr-4 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                           />
                           {signInErrors.email && (
                              <p className="text-[11px] text-rose-400 mt-1">
                                 {signInErrors.email}
                              </p>
                           )}
                        </div>
                        <div className="relative">
                           <Lock
                              size={17}
                              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-400 pointer-events-none"
                           />
                           <input
                              type={showSignInPassword ? "text" : "password"}
                              name="password"
                              value={signInData.password}
                              onChange={handleSignInChange}
                              placeholder="Masukkan kata sandi"
                              className="w-full h-12 bg-slate-950 border border-slate-800 text-white rounded-xl pl-11 pr-11 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                           />
                           <button
                              type="button"
                              onClick={() => setShowSignInPassword((prev) => !prev)}
                              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                           >
                              {showSignInPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                           </button>
                           {signInErrors.password && (
                              <p className="text-[11px] text-rose-400 mt-1">
                                 {signInErrors.password}
                              </p>
                           )}
                        </div>
                        <div className="flex justify-end">
                           <button
                              type="button"
                              onClick={() => navigate("/forgot-password")}
                              className="text-xs font-semibold text-emerald-400 hover:underline cursor-pointer"
                           >
                              Lupa Kata Sandi?
                           </button>
                        </div>
                        <button
                           type="submit"
                           disabled={isSubmitting}
                           className="w-full h-12 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs tracking-wide transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
                        >
                           {isSubmitting ? (
                              <Loader2 size={16} className="animate-spin" />
                           ) : (
                              <>
                                 <span>Masuk ke Dashboard</span>
                                 <ArrowRight size={14} />
                              </>
                           )}
                        </button>
                        <button
                           type="button"
                           onClick={loginWithGoogle}
                           disabled={googleLoginLoading}
                           className="w-full h-12 rounded-xl border border-slate-800 bg-slate-950 hover:bg-slate-800 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
                        >
                           <span>Masuk dengan Google</span>
                        </button>
                     </form>
                  </div>
               ) : (
                  /* When isSignUp is true, Right Column hosts the WELCOME BACK OVERLAY PANEL */
                  <div className="text-center text-white px-6">
                     <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center mx-auto mb-5">
                        <PieChart size={30} />
                     </div>
                     <h3 className="text-3xl font-extrabold tracking-tight mb-3">
                        Sudah Punya Akun?
                     </h3>
                     <p className="text-xs text-emerald-100/90 leading-relaxed max-w-xs mx-auto mb-6">
                        Masuk kembali untuk memantau arus kas, alokasi amplop anggaran, dan ringkasan transaksi terbaru Anda.
                     </p>
                     <button
                        type="button"
                        onClick={() => handleToggleMode(false)}
                        className="px-8 py-2.5 rounded-full border-2 border-white text-white font-semibold text-xs tracking-wider uppercase hover:bg-white/15 transition-all cursor-pointer inline-flex items-center gap-2"
                     >
                        <span>Masuk Akun</span>
                        <ArrowRight size={14} />
                     </button>
                  </div>
               )}
            </div>

            {/* Sliding Background Ribbon (Hardware-accelerated) */}
            <div
               className={`absolute top-0 bottom-0 w-1/2 bg-gradient-to-br from-emerald-600 via-teal-700 to-slate-900 transition-transform duration-700 ease-in-out z-0 pointer-events-none ${
                  isSignUp ? "translate-x-full" : "translate-x-0"
               }`}
            />
         </div>
      </div>
   );
};

export default AuthSwitch;
