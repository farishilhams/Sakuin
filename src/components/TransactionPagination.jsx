import React from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

export default function TransactionPagination({
   currentPage,
   totalPages,
   goToPage,
   pageNumbers,
}) {
   return (
      <div className="flex justify-center items-center mt-6 gap-1.5 flex-wrap text-xs select-none">
         {/* First Page */}
         <button
            onClick={() => goToPage(1)}
            disabled={currentPage === 1}
            className="w-8 h-8 rounded-xl flex items-center justify-center border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-ink)] hover:bg-[var(--color-bg)] disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
            aria-label="Halaman Pertama"
         >
            <ChevronsLeft size={14} className="stroke-[2.2]" />
         </button>

         {/* Prev Page */}
         <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="w-8 h-8 rounded-xl flex items-center justify-center border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-ink)] hover:bg-[var(--color-bg)] disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
            aria-label="Halaman Sebelumnya"
         >
            <ChevronLeft size={14} className="stroke-[2.2]" />
         </button>

         {/* Page Numbers */}
         <div className="flex gap-1 overflow-x-auto px-1 max-w-[calc(100%-130px)] sm:max-w-full">
            {pageNumbers.map((page, index) =>
               page === "..." ? (
                  <span
                     key={`ellipsis-${index}`}
                     className="w-8 h-8 flex items-center justify-center text-[var(--color-ink-muted)] font-semibold"
                  >
                     ...
                  </span>
               ) : (
                  <button
                     key={page}
                     onClick={() => goToPage(page)}
                     className={`w-8 h-8 rounded-xl flex items-center justify-center font-semibold text-xs transition-colors cursor-pointer ${
                        currentPage === page
                           ? "bg-emerald-600 text-white shadow-xs"
                           : "border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-ink)] hover:bg-[var(--color-bg)]"
                     }`}
                     aria-current={currentPage === page ? "page" : undefined}
                  >
                     {page}
                  </button>
               )
            )}
         </div>

         {/* Next Page */}
         <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="w-8 h-8 rounded-xl flex items-center justify-center border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-ink)] hover:bg-[var(--color-bg)] disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
            aria-label="Halaman Berikutnya"
         >
            <ChevronRight size={14} className="stroke-[2.2]" />
         </button>

         {/* Last Page */}
         <button
            onClick={() => goToPage(totalPages)}
            disabled={currentPage === totalPages}
            className="w-8 h-8 rounded-xl flex items-center justify-center border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-ink)] hover:bg-[var(--color-bg)] disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
            aria-label="Halaman Terakhir"
         >
            <ChevronsRight size={14} className="stroke-[2.2]" />
         </button>
      </div>
   );
}