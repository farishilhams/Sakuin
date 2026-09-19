import React, { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import DraggableFAB from "../components/DraggableFAB";
import BottomNav from "../components/BottomNav";
import TransactionModal from "../components/TransactionModal";
import ReceiptScannerModal from "../components/ReceiptScannerModal";

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
         {/* Render Active Route View */}
         <div className="flex-1">
            <Outlet />
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
