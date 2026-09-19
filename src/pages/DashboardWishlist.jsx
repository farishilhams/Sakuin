import React, { useState, useEffect, useContext, useCallback } from "react";
import api from "../utils/api";
import Header from "../components/Header";
import Wishlists from "../components/Wishlists";
import WishlistModal from "../components/WishlistModal";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";
import WishlistStatsCard from "../components/WishlistStatsCard";
import AddWishlistButton from "../components/AddWishlistButton";
import LoadingIndicatorWishlist from "../components/LoadingIndicatorWishlist";
import BottomNav from "../components/BottomNav";
import TransactionModal from "../components/TransactionModal";
import ReceiptScannerModal from "../components/ReceiptScannerModal";

const DashboardWishlist = () => {
   const { logout } = useContext(AuthContext);
   const [items, setItems] = useState([]);
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [currentItem, setCurrentItem] = useState(null);
   const [totalPrice, setTotalPrice] = useState(0);
   const [totalItem, setTotalItem] = useState(0);
   const [isLoadingDelete, setIsLoadingDelete] = useState(false);
   const [isLoadingWishlists, setIsLoadingWishlists] = useState(true);
   const [showMobileQuickAdd, setShowMobileQuickAdd] = useState(false);
   const [showMobileScanner, setShowMobileScanner] = useState(false);

   const fetchWishlist = useCallback(async () => {
      try {
         setIsLoadingWishlists(true);
         const response = await api.get("/wishlist");
         setItems(response.data.items || []);
         setTotalPrice(response.data.totalPrice || 0);
         setTotalItem(response.data.totalItem || 0);
      } catch (error) {
         console.error("Error fetching wishlist:", error);
         toast.error("GAGAL MENGAMBIL DATA WISHLIST");
      } finally {
         setIsLoadingWishlists(false);
      }
   }, []);

   useEffect(() => {
      fetchWishlist();
   }, [fetchWishlist]);

   const handleUpdate = (item) => {
      setCurrentItem(item);
      setIsModalOpen(true);
   };

   const handleDelete = async (itemId) => {
      setIsLoadingDelete(true);
      try {
         const itemToDelete = items.find((item) => item._id === itemId);
         await api.delete(`/wishlist/${itemId}`);
         setItems(items.filter((item) => item._id !== itemId));
         setTotalPrice((prev) => prev - (itemToDelete?.price || 0));
         setTotalItem((prev) => prev - 1);
         toast.success("ITEM BERHASIL DIHAPUS");
      } catch (error) {
         console.error("Error deleting wishlist item:", error);
         toast.error("GAGAL MENGHAPUS ITEM");
      } finally {
         setIsLoadingDelete(false);
      }
   };

   const handleSave = async (item) => {
      try {
         if (currentItem) {
            const response = await api.put(`/wishlist/${item._id}`, item);
            setItems(
               items.map((i) =>
                  i._id === item._id ? response.data.whistlist : i
               )
            );
            setTotalPrice(
               (prev) => prev + (item.price || 0) - (currentItem.price || 0)
            );
         } else {
            const response = await api.post("/wishlist", item);
            setItems([...items, response.data.whistlist]);
            setTotalPrice((prev) => prev + (item.price || 0));
            setTotalItem((prev) => prev + 1);
         }
         setIsModalOpen(false);
         toast.success("ITEM BERHASIL DISIMPAN");
      } catch (error) {
         console.error("Error saving wishlist item:", error);
         toast.error("GAGAL MENYIMPAN ITEM");
      }
   };

   const handleAdd = () => {
      setCurrentItem(null);
      setIsModalOpen(true);
   };

   return (
      <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-ink)] flex flex-col justify-between">
         <div>
            <Header logout={logout} />

            <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
               {/* Stats Cards Row */}
               <div className="flex flex-col sm:flex-row gap-6">
                  <WishlistStatsCard
                     number="1"
                     title="Total Item Wishlist"
                     value={totalItem}
                  />

                  <WishlistStatsCard
                     number="2"
                     title="Total Estimasi Biaya"
                     value={totalPrice}
                     isPrice={true}
                  />
               </div>

               {/* Add Button & Status */}
               <div className="flex items-center justify-between">
                  <AddWishlistButton onClick={handleAdd} />
                  {isLoadingDelete && (
                     <LoadingIndicatorWishlist message="Menghapus item..." />
                  )}
               </div>

               {/* Wishlist Main Section */}
               <Wishlists
                  isLoadingWishlists={isLoadingWishlists}
                  items={items}
                  onUpdate={handleUpdate}
                  onDelete={handleDelete}
               />
            </main>
         </div>

         {/* Modal */}
         <WishlistModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSave={handleSave}
            item={currentItem}
         />

         {/* Mobile Bottom Navigation Bar (< 768px) */}
         <BottomNav
            onOpenQuickAdd={() => setShowMobileQuickAdd(true)}
            onOpenScanner={() => setShowMobileScanner(true)}
            onLogout={logout}
         />

         {/* Mobile Direct Quick Add Modal */}
         {showMobileQuickAdd && (
            <TransactionModal
               onClose={() => setShowMobileQuickAdd(false)}
               editData={null}
               refreshTransactions={() => {
                  setShowMobileQuickAdd(false);
                  toast.success("Transaksi berhasil dicatat!");
               }}
            />
         )}

         {/* Mobile Direct Scanner Modal */}
         {showMobileScanner && (
            <ReceiptScannerModal
               isOpen={showMobileScanner}
               onClose={() => setShowMobileScanner(false)}
               onTransactionSaved={() => {
                  setShowMobileScanner(false);
                  toast.success("Struk berhasil disimpan!");
               }}
            />
         )}

         {/* Footer */}
         <footer className="border-t border-[var(--color-border)] bg-[var(--color-surface)] py-5 mt-12 mb-16 md:mb-0 transition-colors">
            <div className="max-w-7xl mx-auto px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[var(--color-ink-muted)]">
               <div className="flex items-center gap-2 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                  <span>Sakuin — Target Wishlist & Tabungan Cerdas</span>
               </div>
               <div className="text-[11px]">
                  © {new Date().getFullYear()} Sakuin. Hak Cipta Dilindungi.
               </div>
            </div>
         </footer>
      </div>
   );
};

export default DashboardWishlist;