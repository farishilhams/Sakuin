import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import TransactionTable from "../components/TransactionTable";
import BudgetEditor from "../components/BudgetEditor";
import HistoryModal from "../components/HistoryModal";
import MonthlyIncomeCard from "../components/MonthlyIncomeCard";
import HistoryButtons from "../components/HistoryButtons";
import api from "../utils/api";
import Header from "../components/Header";
import WelcomeMessage from "../components/WelcomeMessage";
import toast from "react-hot-toast";
import StatsCardKeuangan from "../components/StatsCardKeuangan";
import QuickAddTransactionButton from "../components/QuickAddTransactionButton";
import BottomNav from "../components/BottomNav";
import TransactionModal from "../components/TransactionModal";
import ReceiptScannerModal from "../components/ReceiptScannerModal";

const Dashboard = () => {
   const { user, logout } = useContext(AuthContext);
   const [transactions, setTransactions] = useState([]);
   const [budgets, setBudgets] = useState([]);
   const [monthlyIncome, setMonthlyIncome] = useState(null);
   const [isLoadingPengeluaran, setIsLoadingPengeluaran] = useState(false);
   const [isLoading, setIsLoading] = useState(true);
   const [isScrolled, setIsScrolled] = useState(false);

   const [historyUpdateCounter, setHistoryUpdateCounter] = useState(0);
   const [showHistoryModal, setShowHistoryModal] = useState(false);
   const [showMobileQuickAdd, setShowMobileQuickAdd] = useState(false);
   const [showMobileScanner, setShowMobileScanner] = useState(false);

   const [actualSpending, setActualSpending] = useState({
      Makanan: 0,
      Transportasi: 0,
      Hiburan: 0,
      Kesehatan: 0,
      Pendidikan: 0,
      "Kebutuhan Pribadi": 0,
   });

   useEffect(() => {
      const handleScroll = () => {
         const scrolled = window.scrollY > 100;
         setIsScrolled(scrolled);
      };

      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
   }, []);

   const handleHistoryDeleted = () => {
      setTimeout(() => {
         setHistoryUpdateCounter((prev) => prev + 1);
      }, 0);
   };

   // Fetch data
   useEffect(() => {
      const fetchData = async () => {
         try {
            setIsLoading(true);
            const [txRes, budgetRes, incomeRes] = await Promise.all([
               api.get("/transactions"),
               api.get("/budgets"),
               api.get("/pemasukan"),
            ]);
            setTransactions(txRes.data || []);
            setBudgets(budgetRes.data || []);
            setMonthlyIncome(incomeRes.data?.[0] || null);
         } catch (error) {
            console.error("Error fetching data", error);
            toast.error("GAGAL MENGAMBIL DATA KEUANGAN");
         } finally {
            setIsLoading(false);
         }
      };
      if (user) fetchData();
   }, [user]);

   // Hitung total pengeluaran aktual per kategori
   // Hitung total pengeluaran aktual per kategori
   useEffect(() => {
      if (transactions.length) {
         // Inisialisasi spending categories
         const spending = {
            Makanan: 0,
            Transportasi: 0,
            Hiburan: 0,
            Kesehatan: 0,
            Pendidikan: 0,
            "Kebutuhan Pribadi": 0,
         };

         // Get current month and year
         const now = new Date();
         const currentMonth = now.getMonth(); // 0-11 (Jan-Dec)
         const currentYear = now.getFullYear();

         // Filter transactions for current month only
         const currentMonthTransactions = transactions.filter((tx) => {
            const txDate = new Date(tx.date);
            return (
               txDate.getMonth() === currentMonth &&
               txDate.getFullYear() === currentYear
            );
         });

         // Sum up amounts by category for current month only
         currentMonthTransactions.forEach((tx) => {
            if (spending[tx.category] !== undefined) {
               spending[tx.category] += tx.amount || 0;
            } else {
               spending[tx.category] = (spending[tx.category] || 0) + (tx.amount || 0);
            }
         });

         setActualSpending(spending);
      } else {
         setActualSpending({
            Makanan: 0,
            Transportasi: 0,
            Hiburan: 0,
            Kesehatan: 0,
            Pendidikan: 0,
            "Kebutuhan Pribadi": 0,
         });
      }
   }, [transactions]);

   if (!user) return null;

   return (
      <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-ink)] flex flex-col justify-between">
         <div>
            <Header
               logout={logout}
               onTransactionSaved={(newTx) =>
                  setTransactions((prev) => [newTx, ...prev])
               }
            />

            <main className="max-w-7xl mx-auto px-4 sm:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8 pb-28 md:pb-12">
               {/* Welcome Banner */}
               <WelcomeMessage user={user} />

               {/* Stats Cards (#1, #2, #3) */}
               <StatsCardKeuangan
                  budgets={budgets}
                  actualSpending={actualSpending}
                  monthlyIncome={monthlyIncome}
                  isLoading={isLoading}
               />

               {/* Pemasukan & Budget Grid */}
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                  <MonthlyIncomeCard
                     monthlyIncome={monthlyIncome}
                     setMonthlyIncome={setMonthlyIncome}
                  />

                  <BudgetEditor
                     budgets={budgets}
                     setBudgets={setBudgets}
                     actualSpending={actualSpending}
                     monthlyIncome={monthlyIncome}
                     isLoadingEditor={isLoading}
                  />
               </div>

               {/* History Archive Action Strip */}
               <HistoryButtons
                  onOpenHistoryModal={() => setShowHistoryModal(true)}
                  isLoadingPengeluaran={isLoadingPengeluaran}
                  setIsLoadingPengeluaran={setIsLoadingPengeluaran}
                  historyUpdated={historyUpdateCounter}
               />

               {/* Transaction Journal Table */}
               <TransactionTable
                  isLoadingTransactions={isLoading}
                  transactions={transactions}
                  setTransactions={setTransactions}
               />
            </main>
         </div>

         {/* History Modal */}
         {showHistoryModal && (
            <HistoryModal
               onClose={() => setShowHistoryModal(false)}
               onDelete={handleHistoryDeleted}
            />
         )}

         {/* Quick Add FAB & Speed Dial (Desktop & Tablet) */}
         <QuickAddTransactionButton
            refreshTransactions={setTransactions}
            isScrolled={isScrolled}
         />

         {/* Mobile Bottom Navigation Bar (< 768px) */}
         <BottomNav
            onOpenQuickAdd={() => setShowMobileQuickAdd(true)}
            onOpenScanner={() => setShowMobileScanner(true)}
            onLogout={logout}
         />

         {/* Mobile Direct Quick Add Modal */}
         {showMobileQuickAdd && (
            <TransactionModal
               onClose={() => setShowMobileQuickAdd(false)}
               editData={null}
               refreshTransactions={(newTx) => {
                  if (newTx && Array.isArray(newTx)) {
                     setTransactions(newTx);
                  } else if (newTx) {
                     setTransactions((prev) => [newTx, ...prev]);
                  }
                  setShowMobileQuickAdd(false);
               }}
            />
         )}

         {/* Mobile Direct Scanner Modal */}
         {showMobileScanner && (
            <ReceiptScannerModal
               isOpen={showMobileScanner}
               onClose={() => setShowMobileScanner(false)}
               onTransactionSaved={(newTx) => {
                  if (newTx) setTransactions((prev) => [newTx, ...prev]);
                  setShowMobileScanner(false);
               }}
            />
         )}

         {/* Footer */}
         <footer className="border-t border-[var(--color-border)] bg-[var(--color-surface)] py-5 mt-12 mb-16 md:mb-0 transition-colors">
            <div className="max-w-7xl mx-auto px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[var(--color-ink-muted)]">
               <div className="flex items-center gap-2 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                  <span>Sakuin — Kelola Uang Saku & Anggaran Cerdas</span>
               </div>
               <div className="text-[11px]">
                  © {new Date().getFullYear()} Sakuin. Hak Cipta Dilindungi.
               </div>
            </div>
         </footer>
      </div>
   );
};

export default Dashboard;
