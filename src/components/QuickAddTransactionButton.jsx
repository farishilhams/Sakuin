import React, { useState } from "react";
import TransactionModal from "./TransactionModal";
import ReceiptScannerModal from "./ReceiptScannerModal";
import api from "../utils/api";
import { Plus, Receipt, Edit3, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const QuickAddTransactionButton = ({ isScrolled, refreshTransactions, transactions = [] }) => {
   const [isOpen, setIsOpen] = useState(false);
   const [showManualModal, setShowManualModal] = useState(false);
   const [showScannerModal, setShowScannerModal] = useState(false);

   const handleManualClick = () => {
      setIsOpen(false);
      setShowManualModal(true);
   };

   const handleScannerClick = () => {
      setIsOpen(false);
      setShowScannerModal(true);
   };

   const handleTransactionSaved = async () => {
      try {
         const res = await api.get("/transactions");
         if (refreshTransactions) {
            refreshTransactions(res.data);
         }
      } catch (err) {
         console.error("Error refreshing transactions", err);
      }
   };

   return (
      <>
         {/* Backdrop dismiss when speed-dial is open */}
         <AnimatePresence>
            {isOpen && (
               <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsOpen(false)}
                  className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs"
               />
            )}
         </AnimatePresence>

         {/* Speed-dial container with mobile safe bottom */}
         <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 pointer-events-none pb-safe">
            {/* Expanded Action Options */}
            <AnimatePresence>
               {isOpen && (
                  <motion.div
                     initial={{ opacity: 0, y: 15, scale: 0.9 }}
                     animate={{ opacity: 1, y: 0, scale: 1 }}
                     exit={{ opacity: 0, y: 10, scale: 0.9 }}
                     transition={{ duration: 0.2 }}
                     className="flex flex-col items-end gap-2.5 pointer-events-auto"
                  >
                     {/* Receipt & QRIS Scanner Button */}
                     <motion.button
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={handleScannerClick}
                        className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-600/30 hover:shadow-xl transition-all cursor-pointer group"
                     >
                        <span className="text-xs font-semibold tracking-wide">
                           Pindai Struk / Bukti QRIS
                        </span>
                        <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                           <Receipt size={16} className="text-white stroke-[2.2]" />
                        </div>
                     </motion.button>

                     {/* Quick Expense Manual Input */}
                     <motion.button
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={handleManualClick}
                        className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-[var(--color-surface)] text-[var(--color-ink)] border border-[var(--color-border)] shadow-lg shadow-black/5 hover:shadow-xl transition-all cursor-pointer group"
                     >
                        <span className="text-xs font-semibold tracking-wide">
                           Catat Pengeluaran Sat-Set
                        </span>
                        <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                           <Edit3 size={16} className="stroke-[2.2]" />
                        </div>
                     </motion.button>
                  </motion.div>
               )}
            </AnimatePresence>

            {/* Main FAB Trigger */}
            <motion.button
               whileHover={{ scale: 1.06 }}
               whileTap={{ scale: 0.92 }}
               onClick={() => setIsOpen(!isOpen)}
               className={`pointer-events-auto w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all cursor-pointer ${
                  isScrolled && !isOpen ? "opacity-90" : "opacity-100"
               }`}
               aria-label="Menu Tambah Transaksi"
               title="Tambah Transaksi"
            >
               <motion.div
                  animate={{ rotate: isOpen ? 135 : 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
               >
                  <Plus size={26} className="stroke-[2.5]" />
               </motion.div>
            </motion.button>
         </div>

         {/* Manual Input Modal */}
         {showManualModal && (
            <TransactionModal
               onClose={() => setShowManualModal(false)}
               editData={null}
               existingTransactions={transactions}
               onOpenScanner={() => {
                  setShowManualModal(false);
                  setShowScannerModal(true);
               }}
               refreshTransactions={handleTransactionSaved}
            />
         )}

         {/* Receipt / QRIS Scanner Modal */}
         {showScannerModal && (
            <ReceiptScannerModal
               isOpen={showScannerModal}
               onClose={() => setShowScannerModal(false)}
               onTransactionSaved={handleTransactionSaved}
            />
         )}
      </>
   );
};

export default QuickAddTransactionButton;