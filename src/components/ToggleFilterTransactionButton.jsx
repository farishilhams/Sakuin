import React from "react";
import { Filter } from "lucide-react";

export default function ToggleFilterTransactionButton({
   showSearchFilters,
   setShowSearchFilters,
}) {
   return (
      <button
         onClick={() => setShowSearchFilters(!showSearchFilters)}
         className="sm:hidden text-xs font-semibold bg-[var(--color-surface)] text-[var(--color-ink)] border border-[var(--color-border)] rounded-xl px-3.5 py-2.5 hover:bg-[var(--color-bg)] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
      >
         <Filter size={14} className="stroke-[2.2]" />
         <span>{showSearchFilters ? "Tutup Filter" : "Filter Data"}</span>
      </button>
   );
}
