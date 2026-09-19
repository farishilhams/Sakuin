import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const GoogleAuthSuccess = () => {
   const { processGoogleAuthSuccess } = useContext(AuthContext);
   const navigate = useNavigate();

   useEffect(() => {
      const success = processGoogleAuthSuccess();
      if (success) {
         navigate("/");
      } else {
         navigate("/login?error=auth_processing_failed");
      }
   }, [processGoogleAuthSuccess, navigate]);

   return (
      <div className="flex items-center justify-center min-h-screen bg-[var(--color-bg)] p-4">
         <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center p-8 sm:p-10 border border-[var(--color-border)] bg-[var(--color-surface)] rounded-3xl shadow-xl max-w-sm w-full"
         >
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto mb-4">
               <Loader2 size={26} className="animate-spin text-emerald-500" />
            </div>
            <h2 className="font-bold text-lg text-[var(--color-ink)] tracking-tight">
               Mengotentikasi Akun...
            </h2>
            <p className="text-xs text-[var(--color-ink-muted)] mt-1.5 leading-relaxed">
               Menyinkronkan sesi akun Google Anda dengan sistem Sakuin
            </p>
         </motion.div>
      </div>
   );
};

export default GoogleAuthSuccess;