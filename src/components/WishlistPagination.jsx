import React from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

const WishlistPagination = ({
   currentPage,
   totalItems,
   itemsPerPage,
   onPageChange,
}) => {
   const totalPages = Math.ceil(totalItems / itemsPerPage);

   if (totalPages <= 1 || totalItems === 0) {
      return null;
   }

   const handleClick = (pageNumber) => {
      if (pageNumber === currentPage || pageNumber < 1 || pageNumber > totalPages) {
         return;
      }
      onPageChange(pageNumber);
   };

   const getPageNumbers = () => {
      const pageNumbers = [];

      for (let i = 1; i <= totalPages; i++) {
         if (
            i === 1 ||
            i === totalPages ||
            (i >= currentPage - 1 && i <= currentPage + 1)
         ) {
            pageNumbers.push({ number: i, type: "page" });
         } else if (i === currentPage - 2 || i === currentPage + 2) {
            pageNumbers.push({ type: "ellipsis" });
         }
      }

      return pageNumbers.filter((item, index, array) => {
         if (item.type === "ellipsis") {
            return array[index - 1]?.type !== "ellipsis";
         }
         return true;
      });
   };

   const pageNumbers = getPageNumbers();

   return (
      <div className="mt-8 flex justify-center items-center gap-1.5 flex-wrap text-xs select-none">
         {/* First page */}
         <button
            onClick={() => handleClick(1)}
            disabled={currentPage === 1}
            className="w-8 h-8 rounded-xl flex items-center justify-center border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-ink)] hover:bg-[var(--color-bg)] disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
            aria-label="Halaman Pertama"
            type="button"
         >
            <ChevronsLeft size={14} className="stroke-[2.2]" />
         </button>

         {/* Prev page */}
         <button
            onClick={() => handleClick(currentPage - 1)}
            disabled={currentPage === 1}
            className="w-8 h-8 rounded-xl flex items-center justify-center border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-ink)] hover:bg-[var(--color-bg)] disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
            aria-label="Halaman Sebelumnya"
            type="button"
         >
            <ChevronLeft size={14} className="stroke-[2.2]" />
         </button>

         {/* Numbers */}
         <div className="flex gap-1 overflow-x-auto px-1 max-w-[calc(100%-130px)] sm:max-w-full">
            {pageNumbers.map((item, index) =>
               item.type === "ellipsis" ? (
                  <span
                     key={`ellipsis-${index}`}
                     className="w-8 h-8 flex items-center justify-center text-[var(--color-ink-muted)] font-semibold"
                  >
                     ...
                  </span>
               ) : (
                  <button
                     key={`page-${item.number}`}
                     onClick={() => handleClick(item.number)}
                     className={`w-8 h-8 rounded-xl flex items-center justify-center font-semibold text-xs transition-colors cursor-pointer ${
                        currentPage === item.number
                           ? "bg-emerald-600 text-white shadow-xs"
                           : "border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-ink)] hover:bg-[var(--color-bg)]"
                     }`}
                     aria-label={`Halaman ${item.number}`}
                     aria-current={currentPage === item.number ? "page" : undefined}
                     type="button"
                  >
                     {item.number}
                  </button>
               )
            )}
         </div>

         {/* Next page */}
         <button
            onClick={() => handleClick(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="w-8 h-8 rounded-xl flex items-center justify-center border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-ink)] hover:bg-[var(--color-bg)] disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
            aria-label="Halaman Berikutnya"
            type="button"
         >
            <ChevronRight size={14} className="stroke-[2.2]" />
         </button>

         {/* Last page */}
         <button
            onClick={() => handleClick(totalPages)}
            disabled={currentPage === totalPages}
            className="w-8 h-8 rounded-xl flex items-center justify-center border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-ink)] hover:bg-[var(--color-bg)] disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
            aria-label="Halaman Terakhir"
            type="button"
         >
            <ChevronsRight size={14} className="stroke-[2.2]" />
         </button>
      </div>
   );
};

export default WishlistPagination;