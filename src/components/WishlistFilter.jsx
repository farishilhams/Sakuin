import React, { useState, useEffect, useCallback } from "react";
import { Search, RotateCcw, X, SlidersHorizontal } from "lucide-react";
import { motion } from "framer-motion";

const WishlistFilter = ({
   onApplyFilters,
   initialFilters = {},
   onToggleVisibility,
   isVisible = false,
}) => {
   const [searchTerm, setSearchTerm] = useState(initialFilters.keyword || "");
   const [priceOperator, setPriceOperator] = useState("lessEqual");
   const [priceValue, setPriceValue] = useState("");
   const [minPrice, setMinPrice] = useState("");
   const [maxPrice, setMaxPrice] = useState("");

   const handleFilterChange = useCallback(() => {
      let min = "";
      let max = "";

      switch (priceOperator) {
         case "equals":
            if (priceValue) {
               min = priceValue;
               max = priceValue;
            }
            break;
         case "greater":
            if (priceValue) {
               min = Number(priceValue) + 1;
            }
            break;
         case "less":
            if (priceValue) {
               max = Number(priceValue) - 1;
            }
            break;
         case "greaterEqual":
            if (priceValue) {
               min = priceValue;
            }
            break;
         case "lessEqual":
            if (priceValue) {
               max = priceValue;
            }
            break;
         case "between":
            min = minPrice;
            max = maxPrice;
            break;
         default:
            break;
      }

      onApplyFilters({
         keyword: searchTerm,
         minPrice: min,
         maxPrice: max,
         sortBy: initialFilters.sortBy || "createdAt",
         sortOrder: initialFilters.sortOrder || "desc",
      });
   }, [
      searchTerm,
      priceOperator,
      priceValue,
      minPrice,
      maxPrice,
      initialFilters,
      onApplyFilters,
   ]);

   useEffect(() => {
      const timeoutId = setTimeout(() => {
         handleFilterChange();
      }, 300);
      return () => clearTimeout(timeoutId);
   }, [handleFilterChange]);

   const handleOperatorChange = (e) => {
      setPriceOperator(e.target.value);
      setPriceValue("");
      setMinPrice("");
      setMaxPrice("");
   };

   const handleReset = () => {
      setSearchTerm("");
      setPriceOperator("lessEqual");
      setPriceValue("");
      setMinPrice("");
      setMaxPrice("");

      onApplyFilters({
         keyword: "",
         priceOperator: "lessEqual",
         priceValue: "",
         minPrice: "",
         maxPrice: "",
      });
   };

   return (
      <div
         className={`mb-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-xs transition-all overflow-hidden ${
            !isVisible ? "hidden md:block" : "block"
         }`}
      >
         {/* Filter Card Header */}
         <div className="px-5 py-3.5 border-b border-[var(--color-border)] flex items-center justify-between bg-[var(--color-surface-hover)]">
            <div className="flex items-center gap-2 text-xs font-bold text-[var(--color-ink)]">
               <SlidersHorizontal size={15} className="text-emerald-500 stroke-[2.2]" />
               <span>Filter & Pencarian Wishlist</span>
            </div>
            <button
               onClick={onToggleVisibility}
               className="md:hidden text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] p-1 rounded-lg transition-colors cursor-pointer"
               aria-label="Tutup filter"
            >
               <X size={16} />
            </button>
         </div>

         <div className="p-5">
            <div className="space-y-4">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Search text */}
                  <div>
                     <label
                        htmlFor="wishlistSearch"
                        className="block mb-1.5 text-xs font-semibold text-[var(--color-ink)]"
                     >
                        Kata Kunci Barang
                     </label>
                     <div className="relative">
                        <Search
                           size={15}
                           className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-ink-muted)]"
                        />
                        <input
                           type="text"
                           id="wishlistSearch"
                           value={searchTerm}
                           onChange={(e) => setSearchTerm(e.target.value)}
                           className="w-full border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-ink)] rounded-xl pl-10 pr-3.5 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                           placeholder="Cari nama barang atau catatan..."
                        />
                     </div>
                  </div>

                  {/* Price operator and values */}
                  <div>
                     <label
                        htmlFor="priceOperatorSelect"
                        className="block mb-1.5 text-xs font-semibold text-[var(--color-ink)]"
                     >
                        Filter Rentang Harga
                     </label>
                     <div className="flex gap-2">
                        <select
                           id="priceOperatorSelect"
                           value={priceOperator}
                           onChange={handleOperatorChange}
                           className="border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-ink)] rounded-xl px-3 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all cursor-pointer shrink-0"
                        >
                           <option value="lessEqual">Maksimal</option>
                           <option value="greaterEqual">Minimal</option>
                           <option value="equals">Sama Dengan</option>
                           <option value="between">Rentang Harga</option>
                        </select>

                        {priceOperator === "between" ? (
                           <div className="flex gap-1.5 items-center flex-1">
                              <input
                                 type="number"
                                 value={minPrice}
                                 onChange={(e) => setMinPrice(e.target.value)}
                                 placeholder="Min 0"
                                 className="w-full border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-ink)] rounded-xl px-3 py-2.5 text-xs font-mono tabular-nums focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                              />
                              <span className="text-xs text-[var(--color-ink-muted)]">–</span>
                              <input
                                 type="number"
                                 value={maxPrice}
                                 onChange={(e) => setMaxPrice(e.target.value)}
                                 placeholder="Maks 0"
                                 className="w-full border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-ink)] rounded-xl px-3 py-2.5 text-xs font-mono tabular-nums focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                              />
                           </div>
                        ) : (
                           <div className="relative flex-1">
                              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-[var(--color-ink-muted)]">
                                 Rp
                              </span>
                              <input
                                 type="number"
                                 value={priceValue}
                                 onChange={(e) => setPriceValue(e.target.value)}
                                 className="w-full border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-ink)] rounded-xl pl-10 pr-3.5 py-2.5 text-xs font-mono tabular-nums focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                                 placeholder="0"
                              />
                           </div>
                        )}
                     </div>
                  </div>
               </div>

               {/* Reset Button */}
               <div className="flex justify-end pt-3 border-t border-[var(--color-border)]">
                  <motion.button
                     type="button"
                     whileHover={{ scale: 1.02 }}
                     whileTap={{ scale: 0.98 }}
                     onClick={handleReset}
                     className="px-3.5 py-1.5 rounded-xl border border-[var(--color-border)] hover:bg-[var(--color-bg)] text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                     <RotateCcw size={13} className="stroke-[2.2]" />
                     <span>Atur Ulang Filter</span>
                  </motion.button>
               </div>
            </div>
         </div>
      </div>
   );
};

export default WishlistFilter;