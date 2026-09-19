import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import DraggableFAB from "../components/DraggableFAB";
import BottomNav from "../components/BottomNav";
import TransactionModal from "../components/TransactionModal";
import ReceiptScannerModal from "../components/ReceiptScannerModal";
import HistoryModal from "../components/HistoryModal";

export default function AppShell() {
   const [showQuickAdd, setShowQuickAdd] = useState(false);
   const [showScanner, setShowScanner] = useState(false);
   const [showHistory, setShowHistory] = useState(false);
   const location = useLocation();

   const handleTransactionSaved = (createdTx) => {
      setShowQuickAdd(false);
      // Dispatch global custom event so active pages (Dashboard, etc.) can update data instantly
      window.dispatchEvent(
         new CustomEvent("sakuin:transaction-created", { detail: createdTx })
      );
   };

   return (
      <div className="min-h-screen relative flex flex-col">
         {/* Render Active Route View with smooth client-side transition */}
         <div className="flex-1">
            <AnimatePresence>
               <motion.div
                  key={location.pathname}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="w-full"
               >
                  <Outlet />
               </motion.div>
            </AnimatePresence>
         </div>

         {/* Draggable AssistiveTouch Floating Action Button (iOS Style) */}
         <DraggableFAB onOpenQuickAdd={() => setShowQuickAdd(true)} />

         {/* Mobile Bottom Navigation Bar (5 Items) - Zero Page Reload */}
         <BottomNav
            onOpenQuickAdd={() => setShowQuickAdd(true)}
            onOpenHistory={() => setShowHistory(true)}
         />

         {/* Global Sat-Set Quick Transaction Modal */}
         {showQuickAdd && (
            <TransactionModal
               onClose={() => setShowQuickAdd(false)}
               editData={null}
               onOpenScanner={() => {
                  setShowQuickAdd(false);
                  setShowScanner(true);
               }}
               refreshTransactions={handleTransactionSaved}
            />
         )}

         {/* Global Receipt / QRIS Scanner Modal */}
         {showScanner && (
            <ReceiptScannerModal
               isOpen={showScanner}
               onClose={() => setShowScanner(false)}
               onTransactionSaved={(newTx) => {
                  handleTransactionSaved(newTx);
                  setShowScanner(false);
               }}
            />
         )}

         {/* Global History Modal / Drawer (Overlay - No Page Refresh) */}
         {showHistory && (
            <HistoryModal
               onClose={() => setShowHistory(false)}
               onDelete={() => {
                  window.dispatchEvent(new CustomEvent("sakuin:history-updated"));
               }}
            />
         )}
      </div>
   );
}
