import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const DataLoadingIndicator = ({ isLoading, initialDelay = 800 }) => {
   const [showIndicator, setShowIndicator] = useState(false);
   const [elapsedTime, setElapsedTime] = useState(0);
   const [message, setMessage] = useState("Memuat data keuangan...");

   useEffect(() => {
      const timer = setTimeout(() => {
         if (isLoading) {
            setShowIndicator(true);
         }
      }, initialDelay);

      return () => clearTimeout(timer);
   }, [isLoading, initialDelay]);

   useEffect(() => {
      let interval;

      if (showIndicator && isLoading) {
         interval = setInterval(() => {
            setElapsedTime((prev) => {
               const newTime = prev + 1;
               if (newTime > 10) {
                  setMessage("Mengambil data dari server, mohon tunggu sebentar...");
               } else if (newTime > 4) {
                  setMessage("Menyinkronkan informasi saldo dan transaksi Sakuin...");
               }
               return newTime;
            });
         }, 1000);
      }

      return () => {
         if (interval) clearInterval(interval);
      };
   }, [showIndicator, isLoading]);

   useEffect(() => {
      if (!isLoading) {
         const hideTimer = setTimeout(() => {
            setShowIndicator(false);
         }, 300);

         return () => clearTimeout(hideTimer);
      }
   }, [isLoading]);

   if (!showIndicator) return null;

   return (
      <motion.div
         initial={{ opacity: 0, y: -10 }}
         animate={{ opacity: 1, y: 0 }}
         className="mb-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-xs"
      >
         <div className="flex items-center gap-3">
            <Loader2 size={18} className="animate-spin text-emerald-500 shrink-0" />
            <div className="flex-1">
               <h3 className="text-xs font-semibold text-[var(--color-ink)] mb-1.5">
                  {message}
               </h3>
               <div className="w-full bg-[var(--color-bg)] rounded-full h-1.5 overflow-hidden">
                  <div className="bg-emerald-500 h-full w-2/3 animate-pulse rounded-full" />
               </div>
            </div>
         </div>
      </motion.div>
   );
};

export default DataLoadingIndicator;