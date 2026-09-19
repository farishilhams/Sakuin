import React from "react";
import { Search, RotateCcw, X, Filter } from "lucide-react";

const allCategories = [
   "Makanan & Minuman",
   "Transportasi",
   "Belanja",
   "Tagihan",
   "Hiburan",
   "Kesehatan",
   "Pendidikan",
   "Kebutuhan Pribadi",
   "Lainnya",
];

const allWallets = [
   "Tunai",
   "BCA",
   "Mandiri",
   "GoPay",
   "OVO",
   "ShopeePay",
   "DANA",
];

const TransactionFilter = ({
   searchTerm,
   setSearchTerm,
   searchColumn,
   setSearchColumn,
   searchAmountOperator,
   setSearchAmountOperator,
   searchAmountValue,
   setSearchAmountValue,
   categoryFilter = "all",
   setCategoryFilter,
   walletFilter = "all",
   setWalletFilter,
   resetFilters,
   showSearchFilters,
   setShowSearchFilters,
   filteredTransactions,
   transactions,
   handleSearchSubmit,
}) => {
   const hasActiveFilter =
      searchTerm ||
      (searchAmountValue && searchAmountValue !== "") ||
      (categoryFilter && categoryFilter !== "all") ||
      (walletFilter && walletFilter !== "all");

   return (
      <div
         className={`mb-6 border border-[var(--color-border)] bg-[var(--color-bg)] rounded-2xl overflow-hidden shadow-xs transition-all ${
            !showSearchFilters ? "hidden sm:block" : "block"
         }`}
      >
         {/* Filter Header */}
         <div className="px-4 py-3 bg-[var(--color-surface)] border-b border-[var(--color-border)] flex items-center justify-between">
            <h3 className="text-xs font-semibold text-[var(--color-ink)] flex items-center gap-2">
               <Search size={14} className="text-emerald-500 stroke-[2.2]" />
               <span>Filter & Cari Transaksi</span>
            </h3>
            <button
               onClick={() => setShowSearchFilters(false)}
               className="sm:hidden text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] p-1 rounded-lg cursor-pointer"
               aria-label="Tutup filter"
            >
               <X size={16} />
            </button>
         </div>

         <div className="p-4 sm:p-5">
            <form onSubmit={handleSearchSubmit} className="space-y-4">
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* 1. Text Search */}
                  <div>
                     <label
                        htmlFor="searchTerm"
                        className="block mb-1.5 text-xs font-semibold text-[var(--color-ink)]"
                     >
                        Kata Kunci
                     </label>
                     <div className="flex gap-2">
                        <input
                           type="text"
                           id="searchTerm"
                           value={searchTerm}
                           onChange={(e) => setSearchTerm(e.target.value)}
                           className="flex-1 border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-ink)] px-3.5 py-2 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                           placeholder="Cari transaksi..."
                        />
                        <select
                           id="searchColumn"
                           value={searchColumn}
                           onChange={(e) => setSearchColumn(e.target.value)}
                           className="border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-ink)] px-2.5 py-2 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all cursor-pointer"
                        >
                           <option value="all">Semua</option>
                           <option value="name">Nama</option>
                           <option value="category">Kategori</option>
                           <option value="date">Tanggal</option>
                        </select>
                     </div>
                  </div>

                  {/* 2. Amount Filter */}
                  <div>
                     <label
                        htmlFor="amountValue"
                        className="block mb-1.5 text-xs font-semibold text-[var(--color-ink)]"
                     >
                        Filter Nominal
                     </label>
                     <div className="flex gap-2">
                        <select
                           id="amountOperator"
                           value={searchAmountOperator}
                           onChange={(e) => setSearchAmountOperator(e.target.value)}
                           className="border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-ink)] px-2.5 py-2 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all cursor-pointer"
                        >
                           <option value="equals">=</option>
                           <option value="greater">&gt;</option>
                           <option value="less">&lt;</option>
                           <option value="greaterEqual">≥</option>
                           <option value="lessEqual">≤</option>
                        </select>
                        <div className="relative flex-1">
                           <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-[var(--color-ink-muted)]">
                              Rp
                           </span>
                           <input
                              type="number"
                              id="amountValue"
                              value={searchAmountValue}
                              onChange={(e) => setSearchAmountValue(e.target.value)}
                              className="w-full border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-ink)] px-3 py-2 pl-9 rounded-xl text-xs sm:text-sm font-mono tabular-nums focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                              placeholder="0"
                           />
                        </div>
                     </div>
                  </div>

                  {/* 3. Category Filter */}
                  <div>
                     <label
                        htmlFor="categoryFilter"
                        className="block mb-1.5 text-xs font-semibold text-[var(--color-ink)]"
                     >
                        Kategori
                     </label>
                     <select
                        id="categoryFilter"
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter && setCategoryFilter(e.target.value)}
                        className="w-full border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-ink)] px-3 py-2 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all cursor-pointer"
                     >
                        <option value="all">Semua Kategori</option>
                        {allCategories.map((c) => (
                           <option key={c} value={c}>
                              {c}
                           </option>
                        ))}
                     </select>
                  </div>

                  {/* 4. Wallet Filter */}
                  <div>
                     <label
                        htmlFor="walletFilter"
                        className="block mb-1.5 text-xs font-semibold text-[var(--color-ink)]"
                     >
                        Sumber Dompet
                     </label>
                     <select
                        id="walletFilter"
                        value={walletFilter}
                        onChange={(e) => setWalletFilter && setWalletFilter(e.target.value)}
                        className="w-full border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-ink)] px-3 py-2 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all cursor-pointer"
                     >
                        <option value="all">Semua Dompet</option>
                        {allWallets.map((w) => (
                           <option key={w} value={w}>
                              {w}
                           </option>
                        ))}
                     </select>
                  </div>
               </div>

               {/* Footer filter status & Reset */}
               <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[var(--color-border)]">
                  <div className="text-xs text-[var(--color-ink-muted)]">
                     {hasActiveFilter && (
                        <span>
                           Filter Aktif:{" "}
                           <strong className="text-emerald-600 dark:text-emerald-400 font-semibold">
                              {filteredTransactions.length}
                           </strong>{" "}
                           dari {(transactions || []).length} transaksi ditemukan
                        </span>
                     )}
                  </div>

                  <button
                     type="button"
                     onClick={resetFilters}
                     className="text-xs font-semibold bg-[var(--color-surface)] text-[var(--color-ink)] border border-[var(--color-border)] hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl px-3.5 py-1.5 transition-colors flex items-center gap-1.5 cursor-pointer ml-auto"
                  >
                     <RotateCcw size={13} className="stroke-[2.2]" />
                     <span>Reset Filter</span>
                  </button>
               </div>
            </form>
         </div>
      </div>
   );
};

export default TransactionFilter;
