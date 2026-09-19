import React, { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import DraggableFAB from "../components/DraggableFAB";
import BottomNav from "../components/BottomNav";
import TransactionModal from "../components/TransactionModal";
import ReceiptScannerModal from "../components/ReceiptScannerModal";
import { pageTransition } from "../utils/motionVariants";

export default function AppShell() {
   const [showQuickAdd, setShowQuickAdd] = useState(false);
   const [showScanner, setShowScanner] = useState(false);
   const navigate = useNavigate();
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
         {/* Render Active Route View with Framer Motion Page Transition */}
         <div className="flex-1">
            <AnimatePresence mode="wait">
               <motion.div
                  key={location.pathname}
                  variants={pageTransition}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="w-full"
               >
                  <Outlet />
               </motion.div>
            </AnimatePresence>
         </div>

         {/* Draggable AssistiveTouch Floating Action Button (iOS Style) */}
         <DraggableFAB onOpenQuickAdd={() => setShowQuickAdd(true)} />

         {/* Mobile Bottom Navigation Bar (5 Items) */}
         <BottomNav
            onOpenQuickAdd={() => setShowQuickAdd(true)}
            onOpenHistory={() => {
               if (location.pathname === "/") {
                  window.dispatchEvent(new CustomEvent("sakuin:open-history"));
               } else {
                  navigate("/?history=true");
               }
            }}
            onOpenProfile={() => navigate("/profile")}
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
      </div>
   );
}
