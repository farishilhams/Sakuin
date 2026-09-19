import React, { useState, useEffect, useMemo } from "react";
import TransactionModal from "./TransactionModal";
import api from "../utils/api";
import toast from "react-hot-toast";
import TransactionDeleteConfirmation from "./TransactionDeleteConfirmation";
import ExportTransactionsPDF from "./ExportTransactionsPDF";
import ItemPerPageKeuangan from "./ItemPerPageKeuangan";
import TransactionFilter from "./TransactionFilter";
import TransactionTableHeader from "./TransactionTableHeader";
import TransactionTableBody, { categoryColors } from "./TransactionTableBody";
import ToggleFilterTransactionButton from "./ToggleFilterTransactionButton";
import TransactionPagination from "./TransactionPagination";
import { Plus, ReceiptText, Pencil, Trash2, Inbox } from "lucide-react";
import { motion } from "framer-motion";

const TransactionTable = ({
   transactions = [],
   setTransactions,
   isLoadingTransactions = false,
}) => {
   const [showModal, setShowModal] = useState(false);
   const [editData, setEditData] = useState(null);
   const [isLoading, setIsLoading] = useState(false);
   const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
   const [transactionToDelete, setTransactionToDelete] = useState(null);

   // Pagination states
   const [currentPage, setCurrentPage] = useState(1);
   const [itemsPerPage, setItemsPerPage] = useState(10);
   const [paginatedTransactions, setPaginatedTransactions] = useState([]);
   const [totalPages, setTotalPages] = useState(1);
   const [showSearchFilters, setShowSearchFilters] = useState(false);

   // Search and filter states
   const [searchTerm, setSearchTerm] = useState("");
   const [searchColumn, setSearchColumn] = useState("all");
   const [searchAmountOperator, setSearchAmountOperator] = useState("equals");
   const [searchAmountValue, setSearchAmountValue] = useState("");
   const [categoryFilter, setCategoryFilter] = useState("all");
   const [walletFilter, setWalletFilter] = useState("all");
   const [filteredTransactions, setFilteredTransactions] = useState([]);

   // Filter transactions based on search criteria
   useEffect(() => {
      if (!transactions || isLoadingTransactions) return;

      let results = [...transactions];

      if (searchTerm) {
         results = results.filter((tx) => {
            if (searchColumn === "all") {
               return (
                  (tx.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                  (tx.category || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                  new Date(tx.date)
                     .toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                     })
                     .toLowerCase()
                     .includes(searchTerm.toLowerCase())
               );
            } else if (searchColumn === "date") {
               return new Date(tx.date)
                  .toLocaleDateString("id-ID", {
                     day: "numeric",
                     month: "short",
                     year: "numeric",
                  })
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase());
            } else if (searchColumn === "name") {
               return (tx.name || "").toLowerCase().includes(searchTerm.toLowerCase());
            } else if (searchColumn === "category") {
               return (tx.category || "")
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase());
            }
            return true;
         });
      }

      if (searchAmountValue && searchAmountValue !== "") {
         const amountValue = parseFloat(searchAmountValue);
         if (!isNaN(amountValue)) {
            results = results.filter((tx) => {
               const txAmount = parseFloat(tx.amount);
               switch (searchAmountOperator) {
                  case "equals":
                     return txAmount === amountValue;
                  case "greater":
                     return txAmount > amountValue;
                  case "less":
                     return txAmount < amountValue;
                  case "greaterEqual":
                     return txAmount >= amountValue;
                  case "lessEqual":
                     return txAmount <= amountValue;
                  default:
                     return true;
               }
            });
         }
      }

      if (categoryFilter && categoryFilter !== "all") {
         results = results.filter((tx) => {
            const cat = tx.category === "Makanan" ? "Makanan & Minuman" : tx.category;
            return cat === categoryFilter;
         });
      }

      if (walletFilter && walletFilter !== "all") {
         results = results.filter((tx) => tx.wallet === walletFilter);
      }

      setFilteredTransactions(results);
      setCurrentPage(1);
   }, [
      transactions,
      searchTerm,
      searchColumn,
      searchAmountOperator,
      searchAmountValue,
      categoryFilter,
      walletFilter,
      isLoadingTransactions,
   ]);

   // Paginate
   useEffect(() => {
      if (filteredTransactions.length === 0) {
         setPaginatedTransactions([]);
         setTotalPages(0);
         return;
      }

      if (itemsPerPage === "all") {
         setPaginatedTransactions(filteredTransactions);
         setTotalPages(1);
         return;
      }

      const calculatedTotalPages = Math.ceil(
         filteredTransactions.length / itemsPerPage
      );
      setTotalPages(calculatedTotalPages);

      if (currentPage > calculatedTotalPages) {
         setCurrentPage(1);
         return;
      }

      const indexOfLastItem = currentPage * itemsPerPage;
      const indexOfFirstItem = indexOfLastItem - itemsPerPage;
      const currentTransactions = filteredTransactions.slice(
         indexOfFirstItem,
         indexOfLastItem
      );

      setPaginatedTransactions(currentTransactions);
   }, [filteredTransactions, currentPage, itemsPerPage]);

   useEffect(() => {
      if (transactions) {
         setFilteredTransactions(transactions);
      }
   }, [transactions]);

   const confirmDelete = (transaction) => {
      setTransactionToDelete(transaction);
      setShowDeleteConfirmation(true);
   };

   const handleDelete = async () => {
      if (!transactionToDelete) return;

      setIsLoading(true);
      try {
         await api.delete(`/transactions/${transactionToDelete._id}`);
         setTransactions(
            transactions.filter((tx) => tx._id !== transactionToDelete._id)
         );
         toast.success("Transaksi berhasil dihapus!");
      } catch (error) {
         console.error("Delete transaction error", error);
         toast.error("Gagal menghapus transaksi");
      } finally {
         setIsLoading(false);
         setShowDeleteConfirmation(false);
         setTransactionToDelete(null);
      }
   };

   const openModalForEdit = (transaction) => {
      setEditData(transaction);
      setShowModal(true);
   };

   const goToPage = (page) => {
      if (page < 1 || page > totalPages) return;
      setCurrentPage(page);
   };

   const handleSearchSubmit = (e) => {
      e.preventDefault();
   };

   const resetFilters = () => {
      setSearchTerm("");
      setSearchColumn("all");
      setSearchAmountOperator("equals");
      setSearchAmountValue("");
      setCategoryFilter("all");
      setWalletFilter("all");
   };

   const pageNumbers = useMemo(() => {
      if (totalPages <= 7) {
         return Array.from({ length: totalPages }, (_, i) => i + 1);
      }

      const pages = [1];
      if (currentPage > 3) pages.push("...");

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
         pages.push(i);
      }

      if (currentPage < totalPages - 2) pages.push("...");
      if (totalPages > 1) pages.push(totalPages);

      return pages;
   }, [currentPage, totalPages]);

   return (
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-5 sm:p-6 shadow-xs transition-colors">
         {/* Top Section */}
         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b border-[var(--color-border)] pb-4">
            <div className="flex items-center gap-2.5">
               <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                  <ReceiptText size={18} className="stroke-[2.2]" />
               </div>
               <div>
                  <h2 className="font-bold text-base sm:text-lg text-[var(--color-ink)] leading-tight">
                     Transaksi Pengeluaran
                  </h2>
                  <p className="text-xs text-[var(--color-ink-muted)]">
                     Catatan riwayat semua pos belanja dan pengeluaran harian
                  </p>
               </div>
            </div>

            {/* Action Buttons Toolbar */}
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
               <ToggleFilterTransactionButton
                  showSearchFilters={showSearchFilters}
                  setShowSearchFilters={setShowSearchFilters}
               />

               <ExportTransactionsPDF
                  transactions={transactions}
                  filteredTransactions={filteredTransactions}
               />

               <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                     setEditData(null);
                     setShowModal(true);
                  }}
                  disabled={isLoadingTransactions}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs tracking-wide shadow-xs disabled:opacity-50 transition-colors flex items-center justify-center gap-1.5 flex-1 sm:flex-initial cursor-pointer"
               >
                  <Plus size={15} className="stroke-[2.5]" />
                  <span>Tambah Transaksi</span>
               </motion.button>
            </div>
         </div>

         {/* Filter Panel */}
         <TransactionFilter
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            searchColumn={searchColumn}
            setSearchColumn={setSearchColumn}
            searchAmountOperator={searchAmountOperator}
            setSearchAmountOperator={setSearchAmountOperator}
            searchAmountValue={searchAmountValue}
            setSearchAmountValue={setSearchAmountValue}
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
            walletFilter={walletFilter}
            setWalletFilter={setWalletFilter}
            resetFilters={resetFilters}
            showSearchFilters={showSearchFilters}
            setShowSearchFilters={setShowSearchFilters}
            filteredTransactions={filteredTransactions}
            transactions={transactions}
            handleSearchSubmit={handleSearchSubmit}
         />

         {/* Row Selector & Range Info */}
         <ItemPerPageKeuangan
            itemsPerPage={itemsPerPage}
            setItemsPerPage={setItemsPerPage}
            filteredTransactions={filteredTransactions}
            setCurrentPage={setCurrentPage}
            currentPage={currentPage}
         />

         {/* Desktop Table View (Tablet & Laptop & Desktop) */}
         <div className="hidden md:block overflow-x-auto rounded-xl border border-[var(--color-border)] mt-4">
            <table className="w-full border-collapse">
               <TransactionTableHeader />
               <TransactionTableBody
                  isLoadingTransactions={isLoadingTransactions}
                  filteredTransactions={filteredTransactions}
                  paginatedTransactions={paginatedTransactions}
                  itemsPerPage={itemsPerPage}
                  currentPage={currentPage}
                  openModalForEdit={openModalForEdit}
                  confirmDelete={confirmDelete}
                  transactions={transactions}
               />
            </table>
         </div>

         {/* Mobile Card-Based Transaction Feed (iPhone & Android) */}
         <div className="md:hidden flex flex-col gap-3 mt-4">
            {isLoadingTransactions ? (
               [1, 2, 3].map((i) => (
                  <div key={i} className="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] animate-pulse space-y-2">
                     <div className="h-4 bg-[var(--color-border)] rounded w-1/3" />
                     <div className="h-5 bg-[var(--color-border)] rounded w-2/3" />
                     <div className="h-4 bg-[var(--color-border)] rounded w-1/2" />
                  </div>
               ))
            ) : paginatedTransactions.length > 0 ? (
               paginatedTransactions.map((tx) => {
                  const catStyle =
                     categoryColors[tx.category] ||
                     "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20";

                  return (
                     <div
                        key={tx._id}
                        className="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] flex items-center justify-between gap-3"
                     >
                        <div className="flex flex-col gap-1 min-w-0">
                           <div className="flex items-center gap-1.5 flex-wrap">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${catStyle}`}>
                                 {tx.category}
                              </span>
                              {tx.wallet && (
                                 <span className="text-[10px] text-[var(--color-ink-muted)] bg-[var(--color-surface)] px-1.5 py-0.5 rounded border border-[var(--color-border)]">
                                    {tx.wallet}
                                 </span>
                              )}
                              <span className="text-[11px] text-[var(--color-ink-muted)]">
                                 {new Date(tx.date).toLocaleDateString("id-ID", {
                                    day: "numeric",
                                    month: "short",
                                 })}
                              </span>
                           </div>
                           <h4 className="font-semibold text-sm text-[var(--color-ink)] truncate">
                              {tx.name}
                           </h4>
                           {tx.notes && (
                              <span className="text-[11px] text-[var(--color-ink-muted)] truncate block">
                                 {tx.notes}
                              </span>
                           )}
                           <p className="font-extrabold text-sm text-[var(--color-ink)] font-mono tabular-nums">
                              Rp {Number(tx.amount).toLocaleString("id-ID")}
                           </p>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                           <button
                              onClick={() => openModalForEdit(tx)}
                              className="p-2 rounded-lg text-[var(--color-ink-muted)] hover:text-emerald-600 hover:bg-emerald-500/10 transition-colors"
                              title="Edit Transaksi"
                           >
                              <Pencil size={15} className="stroke-[2.2]" />
                           </button>
                           <button
                              onClick={() => confirmDelete(tx)}
                              className="p-2 rounded-lg text-[var(--color-ink-muted)] hover:text-rose-600 hover:bg-rose-500/10 transition-colors"
                              title="Hapus Transaksi"
                           >
                              <Trash2 size={15} className="stroke-[2.2]" />
                           </button>
                        </div>
                     </div>
                  );
               })
            ) : (
               <div className="py-10 text-center text-xs text-[var(--color-ink-muted)] border border-dashed border-[var(--color-border)] rounded-xl flex flex-col items-center justify-center gap-2">
                  <Inbox size={24} className="opacity-50" />
                  <span>Belum ada transaksi</span>
               </div>
            )}
         </div>

         {/* Pagination */}
         {totalPages > 1 && (
            <div className="mt-5">
               <TransactionPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  pageNumbers={pageNumbers}
                  goToPage={goToPage}
               />
            </div>
         )}

         {/* Modals */}
         {showModal && (
            <TransactionModal
               onClose={() => setShowModal(false)}
               editData={editData}
               existingTransactions={transactions}
               refreshTransactions={async () => {
                  const res = await api.get("/transactions");
                  setTransactions(res.data);
               }}
            />
         )}

         <TransactionDeleteConfirmation
            isOpen={showDeleteConfirmation}
            onClose={() => setShowDeleteConfirmation(false)}
            onConfirm={handleDelete}
            transactionName={transactionToDelete?.name}
            transactionAmount={transactionToDelete?.amount}
            isLoading={isLoading}
         />
      </div>
   );
};

export default TransactionTable;
