import React, { useState } from "react";
import WishlistDeleteConfirmation from "./WishlistDeleteConfirmation";
import { Pencil, Trash2, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

const WishlistCard = ({ item, onUpdate, onDelete, index }) => {
   const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
   const [isDeleting, setIsDeleting] = useState(false);

   const confirmDelete = () => {
      setShowDeleteConfirm(true);
   };

   const handleDelete = async () => {
      setIsDeleting(true);
      try {
         await onDelete(item._id);
      } catch (error) {
         console.error("Error deleting wishlist item", error);
      } finally {
         setIsDeleting(false);
         setShowDeleteConfirm(false);
      }
   };

   const displayLink = item.purchaseLink
      ? item.purchaseLink.replace(/^https?:\/\/(www\.)?/, "").slice(0, 28) + (item.purchaseLink.length > 28 ? "..." : "")
      : "-";

   return (
      <>
         <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
            className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
         >
            {/* Image Container with Top Badges */}
            <div className="relative aspect-[16/10] w-full bg-[var(--color-bg)] overflow-hidden">
               <img
                  src={
                     item.imageUrls ||
                     "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='250' viewBox='0 0 400 250'%3E%3Crect width='400' height='250' fill='%23f1f5f9'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='13' fill='%2394a3b8'%3ETidak Ada Foto Produk%3C/text%3E%3C/svg%3E"
                  }
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                     e.target.onerror = null;
                     e.target.src =
                        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='250' viewBox='0 0 400 250'%3E%3Crect width='400' height='250' fill='%23f1f5f9'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='13' fill='%2394a3b8'%3ETidak Ada Foto Produk%3C/text%3E%3C/svg%3E";
                  }}
               />

               {/* Price Badge */}
               <div className="absolute top-3 left-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs border border-white/20 px-3 py-1 rounded-full shadow-xs">
                  <span className="font-extrabold text-xs tracking-tight text-[var(--color-ink)] font-mono tabular-nums">
                     Rp {Number(item.price || 0).toLocaleString("id-ID")}
                  </span>
               </div>

               {/* Item Sequence Number */}
               <div className="absolute top-3 right-3 bg-emerald-600 text-white font-bold text-[11px] px-2.5 py-0.5 rounded-full shadow-xs">
                  #{index + 1}
               </div>
            </div>

            {/* Content Section */}
            <div className="p-5 flex-1 flex flex-col justify-between">
               <div>
                  <h3 className="font-bold text-base text-[var(--color-ink)] tracking-tight mb-2 line-clamp-1">
                     {item.name}
                  </h3>

                  <p className="text-xs text-[var(--color-ink-muted)] line-clamp-2 mb-4">
                     {item.description || "Tidak ada catatan deskripsi."}
                  </p>

                  {/* Purchase Link */}
                  {item.purchaseLink && (
                     <div className="mb-2">
                        <a
                           href={item.purchaseLink}
                           target="_blank"
                           rel="noopener noreferrer"
                           className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:underline"
                        >
                           <span>Buka Toko / Link Produk</span>
                           <ExternalLink size={12} />
                        </a>
                     </div>
                  )}
               </div>

               {/* Action Buttons */}
               <div className="flex gap-2 pt-4 border-t border-[var(--color-border)] justify-end">
                  <button
                     onClick={() => onUpdate(item)}
                     className="px-3 py-1.5 rounded-xl border border-[var(--color-border)] hover:bg-[var(--color-bg)] text-[var(--color-ink)] text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                     <Pencil size={13} className="stroke-[2.2]" />
                     <span>Edit</span>
                  </button>

                  <button
                     onClick={confirmDelete}
                     className="px-3 py-1.5 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                     <Trash2 size={13} className="stroke-[2.2]" />
                     <span>Hapus</span>
                  </button>
               </div>
            </div>
         </motion.div>

         {/* Delete Confirmation Modal */}
         <WishlistDeleteConfirmation
            isOpen={showDeleteConfirm}
            onClose={() => setShowDeleteConfirm(false)}
            onConfirm={handleDelete}
            wishlistItem={item}
            isLoading={isDeleting}
         />
      </>
   );
};

export default WishlistCard;
