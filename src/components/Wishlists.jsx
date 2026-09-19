import React, { useState, useEffect } from "react";
import WishlistCard from "./WishlistCard";
import WishlistFilter from "./WishlistFilter";
import { Filter, Sparkles, FolderX } from "lucide-react";
import { motion } from "framer-motion";

const Wishlists = ({ items, onUpdate, onDelete, isLoadingWishlists }) => {
   const [filteredItems, setFilteredItems] = useState([]);
   const [activeFilters, setActiveFilters] = useState({
      keyword: "",
      minPrice: "",
      maxPrice: "",
      sortBy: "createdAt",
      sortOrder: "desc",
   });
   const [showFilters, setShowFilters] = useState(false);

   useEffect(() => {
      if (items) {
         setFilteredItems(items);
      }
   }, [items]);

   const handleApplyFilters = (filters) => {
      setActiveFilters(filters);
      let result = [...items];

      if (filters.keyword && filters.keyword.trim() !== "") {
         const keywordLower = filters.keyword.toLowerCase();
         result = result.filter(
            (item) =>
               item.name.toLowerCase().includes(keywordLower) ||
               (item.description &&
                  item.description.toLowerCase().includes(keywordLower))
         );
      }

      if (filters.minPrice !== "") {
         const min = Number(filters.minPrice);
         if (!isNaN(min)) {
            result = result.filter((item) => Number(item.price) >= min);
         }
      }

      if (filters.maxPrice !== "") {
         const max = Number(filters.maxPrice);
         if (!isNaN(max)) {
            result = result.filter((item) => Number(item.price) <= max);
         }
      }

      result.sort((a, b) => {
         let valueA, valueB;

         if (filters.sortBy === "price") {
            valueA = Number(a.price);
            valueB = Number(b.price);
         } else if (filters.sortBy === "name") {
            valueA = a.name.toLowerCase();
            valueB = b.name.toLowerCase();
         } else {
            valueA = new Date(a.createdAt || 0);
            valueB = new Date(b.createdAt || 0);
         }

         if (filters.sortOrder === "asc") {
            return valueA > valueB ? 1 : -1;
         } else {
            return valueA < valueB ? 1 : -1;
         }
      });

      setFilteredItems(result);
   };

   const handleToggleFilters = () => {
      setShowFilters(!showFilters);
   };

   if (isLoadingWishlists) {
      return (
         <div className="py-16 text-center text-xs font-semibold text-[var(--color-ink-muted)]">
            Memuat daftar wishlist...
         </div>
      );
   }

   if (!items || items.length === 0) {
      return (
         <div className="border border-dashed border-[var(--color-border)] rounded-3xl p-10 sm:p-14 text-center bg-[var(--color-surface)] shadow-xs">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-4">
               <Sparkles size={28} />
            </div>
            <h3 className="font-bold text-lg sm:text-xl tracking-tight text-[var(--color-ink)] mb-2">
               Target Wishlist Masih Kosong
            </h3>
            <p className="text-xs sm:text-sm text-[var(--color-ink-muted)] max-w-md mx-auto mb-5">
               Mulai catat barang impian, gadget idaman, atau tabungan rencana Anda untuk memantau akumulasi target tabungan.
            </p>
         </div>
      );
   }

   return (
      <div className="space-y-6">
         {/* Title & Mobile Toggle */}
         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--color-border)]">
            <div>
               <h2 className="font-extrabold text-xl sm:text-2xl text-[var(--color-ink)] tracking-tight">
                  Daftar Target Wishlist
               </h2>
               <p className="text-xs text-[var(--color-ink-muted)] mt-0.5">
                  Total <span className="font-semibold text-[var(--color-ink)]">{items.length} item</span> rencana pembelian
               </p>
            </div>

            <motion.button
               whileHover={{ scale: 1.02 }}
               whileTap={{ scale: 0.98 }}
               onClick={handleToggleFilters}
               className="md:hidden self-start px-3.5 py-2 rounded-xl text-xs font-semibold bg-[var(--color-surface)] hover:bg-[var(--color-surface-hover)] text-[var(--color-ink)] border border-[var(--color-border)] shadow-xs flex items-center gap-2 cursor-pointer transition-colors"
            >
               <Filter size={15} className="stroke-[2.2]" />
               <span>{showFilters ? "Sembunyikan Filter" : "Filter & Urutkan"}</span>
            </motion.button>
         </div>

         {/* Filter Component */}
         <WishlistFilter
            onApplyFilters={handleApplyFilters}
            initialFilters={activeFilters}
            onToggleVisibility={handleToggleFilters}
            isVisible={showFilters}
         />

         {/* Filter status */}
         {filteredItems.length !== items.length && (
            <div className="border border-[var(--color-border)] bg-[var(--color-surface)] rounded-xl px-4 py-2.5 text-xs text-[var(--color-ink)] flex items-center justify-between shadow-xs">
               <span>
                  Menampilkan <strong className="font-mono tabular-nums text-emerald-600 dark:text-emerald-400">{filteredItems.length}</strong> dari {items.length} item sesuai kriteria pencarian
               </span>
            </div>
         )}

         {/* Grid Cards */}
         {filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {filteredItems.map((item, index) => (
                  <WishlistCard
                     key={item._id || index}
                     item={item}
                     onUpdate={onUpdate}
                     onDelete={onDelete}
                     index={index}
                  />
               ))}
            </div>
         ) : (
            <div className="border border-[var(--color-border)] bg-[var(--color-surface)] rounded-2xl p-10 text-center shadow-xs">
               <FolderX size={36} className="mx-auto text-[var(--color-ink-muted)] mb-3 opacity-60" />
               <p className="text-sm font-medium text-[var(--color-ink)] mb-1">
                  Tidak ada item yang cocok
               </p>
               <p className="text-xs text-[var(--color-ink-muted)]">
                  Coba ubah kata kunci pencarian atau rentang harga filter Anda.
               </p>
            </div>
         )}
      </div>
   );
};

export default Wishlists;