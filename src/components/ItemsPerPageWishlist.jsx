import React from "react";

export default function ItemsPerPageWishlist({
   itemsPerPage,
   handleItemsPerPageChange,
   filteredItems = [],
}) {
   return (
      <div className="mb-4 text-xs flex items-center gap-2 text-[var(--color-ink-muted)]">
         <span className="font-medium">
            Tampilkan:
         </span>
         <select
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            className="border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-ink)] rounded-lg px-2.5 py-1 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all cursor-pointer shadow-2xs"
         >
            <option value={3}>3</option>
            <option value={6}>6</option>
            <option value={12}>12</option>
            <option value={24}>24</option>
            <option value={filteredItems.length}>Semua</option>
         </select>
         <span className="font-medium">
            item per halaman
         </span>
      </div>
   );
}
