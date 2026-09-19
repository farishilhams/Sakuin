import React from "react";

export default function ItemPerPageKeuangan({
   itemsPerPage,
   setItemsPerPage,
   filteredTransactions = [],
   setCurrentPage,
   currentPage,
}) {
   const totalCount = filteredTransactions.length;
   const startItem = itemsPerPage === "all" ? 1 : Math.min((currentPage - 1) * itemsPerPage + 1, totalCount);
   const endItem = itemsPerPage === "all" ? totalCount : Math.min(currentPage * itemsPerPage, totalCount);

   return (
      <div className="mb-4 flex flex-col sm:flex-row justify-between sm:items-center gap-3 text-xs">
         <div className="flex items-center gap-2">
            <span className="text-[var(--color-ink-muted)] font-medium">
               Baris per halaman:
            </span>
            <select
               value={itemsPerPage}
               onChange={(e) => {
                  setItemsPerPage(
                     e.target.value === "all" ? "all" : parseInt(e.target.value, 10)
                  );
                  setCurrentPage(1);
               }}
               className="border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-ink)] font-semibold rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer"
            >
               <option value={5}>5</option>
               <option value={10}>10</option>
               <option value={20}>20</option>
               <option value={50}>50</option>
               <option value={100}>100</option>
               <option value="all">Semua</option>
            </select>
         </div>

         {totalCount > 0 && (
            <div className="text-[var(--color-ink-muted)] text-[11px] font-medium">
               Menampilkan <span className="font-semibold text-[var(--color-ink)]">{startItem} – {endItem}</span> dari <span className="font-semibold text-[var(--color-ink)]">{totalCount}</span> transaksi
            </div>
         )}
      </div>
   );
}
