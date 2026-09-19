import React, { useState, useEffect } from "react";
import { X, Check, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const WishlistModal = ({ isOpen, onClose, onSave, item }) => {
   const [name, setName] = useState("");
   const [price, setPrice] = useState("");
   const [displayPrice, setDisplayPrice] = useState("");
   const [description, setDescription] = useState("");
   const [purchaseLink, setPurchaseLink] = useState("");
   const [imageUrls, setImageUrls] = useState("");
   const [isLoading, setIsLoading] = useState(false);

   const safeToString = (value) => {
      try {
         if (value === null || value === undefined) return "";
         return String(value);
      } catch (e) {
         console.error("Error converting to string:", e);
         return "";
      }
   };

   useEffect(() => {
      if (item) {
         try {
            setName(safeToString(item.name));

            if (item.price !== undefined && item.price !== null) {
               const priceValue = parseFloat(item.price);
               if (!isNaN(priceValue)) {
                  setPrice(priceValue);
                  setDisplayPrice(priceValue.toLocaleString("id-ID"));
               } else {
                  setPrice("");
                  setDisplayPrice("");
               }
            } else {
               setPrice("");
               setDisplayPrice("");
            }

            setDescription(safeToString(item.description));
            setPurchaseLink(safeToString(item.purchaseLink));
            setImageUrls(safeToString(item.imageUrls));
         } catch (error) {
            console.error("Error setting form values:", error);
            resetForm();
         }
      } else {
         resetForm();
      }
   }, [item]);

   const resetForm = () => {
      setName("");
      setPrice("");
      setDisplayPrice("");
      setDescription("");
      setPurchaseLink("");
      setImageUrls("");
      setIsLoading(false);
   };

   const handlePriceChange = (e) => {
      try {
         const rawValue = e.target.value;
         const numericValue = rawValue.replace(/\D/g, "");

         if (numericValue) {
            const parsedValue = parseInt(numericValue, 10);
            setPrice(parsedValue);
            setDisplayPrice(parsedValue.toLocaleString("id-ID"));
         } else {
            setPrice("");
            setDisplayPrice("");
         }
      } catch (error) {
         console.error("Error handling price change:", error);
         setPrice("");
         setDisplayPrice("");
      }
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      try {
         setIsLoading(true);

         const priceValue = parseFloat(price);
         if (isNaN(priceValue) || priceValue <= 0) {
            alert("Harga harus berupa angka yang lebih dari 0");
            setIsLoading(false);
            return;
         }

         const dataToSave = {
            name: name.trim(),
            price: priceValue,
            description: description.trim(),
            purchaseLink: purchaseLink.trim(),
            imageUrls: imageUrls.trim(),
         };

         if (item && item._id) {
            dataToSave._id = item._id;
         }

         await onSave(dataToSave);
         resetForm();
         onClose();
      } catch (error) {
         console.error("Error saving wishlist:", error);
      } finally {
         setIsLoading(false);
      }
   };

   const handleClose = () => {
      resetForm();
      onClose();
   };

   if (!isOpen) return null;

   const hasImageUrl =
      Boolean(imageUrls) &&
      typeof imageUrls === "string" &&
      imageUrls.trim() !== "" &&
      (imageUrls.startsWith("http://") || imageUrls.startsWith("https://"));

   return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
         <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden"
         >
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-[var(--color-border)] flex items-center justify-between">
               <div>
                  <h2 className="font-bold text-base sm:text-lg text-[var(--color-ink)]">
                     {item ? "Edit Item Wishlist" : "Tambah Target Wishlist"}
                  </h2>
                  <p className="text-xs text-[var(--color-ink-muted)]">
                     {item ? "Perbarui informasi target impian Anda" : "Rencanakan barang atau impian yang ingin dibeli"}
                  </p>
               </div>

               <button
                  onClick={handleClose}
                  className="w-8 h-8 rounded-xl bg-[var(--color-bg)] hover:bg-slate-200 dark:hover:bg-slate-800 text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Tutup"
               >
                  <X size={18} />
               </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4">
               {/* Name */}
               <div>
                  <label className="block mb-1.5 text-xs font-semibold text-[var(--color-ink)]">
                     Nama Barang / Impian
                  </label>
                  <input
                     type="text"
                     className="w-full border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-ink)] rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
                     value={name}
                     onChange={(e) => setName(e.target.value)}
                     placeholder="Misal: Mechanical Keyboard Keychron V1"
                     required
                  />
               </div>

               {/* Price */}
               <div>
                  <label className="block mb-1.5 text-xs font-semibold text-[var(--color-ink)]">
                     Estimasi Harga
                  </label>
                  <div className="relative">
                     <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[var(--color-ink-muted)]">
                        Rp
                     </span>
                     <input
                        type="text"
                        className="w-full border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-ink)] rounded-xl py-2.5 pl-10 pr-3.5 font-mono text-sm sm:text-base tabular-nums focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
                        value={displayPrice}
                        onChange={handlePriceChange}
                        placeholder="0"
                        required
                     />
                  </div>
               </div>

               {/* Description */}
               <div>
                  <label className="block mb-1.5 text-xs font-semibold text-[var(--color-ink)]">
                     Catatan / Alasan Pembelian
                  </label>
                  <textarea
                     className="w-full border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-ink)] rounded-xl p-3 text-xs sm:text-sm min-h-20 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
                     value={description}
                     onChange={(e) => setDescription(e.target.value)}
                     placeholder="Tuliskan catatan detail kebutuhan atau target tanggal pembelian..."
                     required
                  />
               </div>

               {/* Purchase Link */}
               <div>
                  <label className="block mb-1.5 text-xs font-semibold text-[var(--color-ink)]">
                     Link Toko / Produk
                  </label>
                  <input
                     type="url"
                     className="w-full border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-ink)] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
                     value={purchaseLink}
                     onChange={(e) => setPurchaseLink(e.target.value)}
                     placeholder="https://tokopedia.com/..."
                     required
                  />
               </div>

               {/* Image URL */}
               <div>
                  <label className="block mb-1.5 text-xs font-semibold text-[var(--color-ink)]">
                     URL Foto Produk (Opsional)
                  </label>
                  <input
                     type="url"
                     className="w-full border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-ink)] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
                     value={imageUrls}
                     onChange={(e) => setImageUrls(e.target.value)}
                     placeholder="https://images.unsplash.com/..."
                  />
               </div>

               {/* Preview */}
               {hasImageUrl && (
                  <div className="border border-[var(--color-border)] p-2 rounded-xl bg-[var(--color-bg)]">
                     <span className="text-[10px] uppercase font-bold text-[var(--color-ink-muted)] block mb-1">
                        Preview Foto:
                     </span>
                     <img
                        src={imageUrls}
                        alt="Preview"
                        className="w-full h-36 object-cover rounded-lg"
                        onError={(e) => {
                           e.target.onerror = null;
                           e.target.style.display = "none";
                        }}
                     />
                  </div>
               )}

               {/* Action Buttons */}
               <div className="flex justify-end gap-2.5 pt-4 border-t border-[var(--color-border)]">
                  <button
                     type="button"
                     onClick={handleClose}
                     className="px-4 py-2.5 rounded-xl border border-[var(--color-border)] hover:bg-[var(--color-bg)] text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] text-xs font-semibold transition-colors cursor-pointer"
                  >
                     Batal
                  </button>

                  <button
                     type="submit"
                     disabled={isLoading}
                     className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs tracking-wide shadow-xs disabled:opacity-50 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                     {isLoading ? (
                        <>
                           <Loader2 size={14} className="animate-spin" />
                           <span>Menyimpan...</span>
                        </>
                     ) : (
                        <>
                           <Check size={14} className="stroke-[2.5]" />
                           <span>Simpan Item</span>
                        </>
                     )}
                  </button>
               </div>
            </form>
         </motion.div>
      </div>
   );
};

export default WishlistModal;