import React from "react";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";

const AddWishlistButton = ({ onClick }) => {
   return (
      <motion.button
         whileHover={{ scale: 1.02 }}
         whileTap={{ scale: 0.98 }}
         onClick={onClick}
         className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs tracking-wide shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
      >
         <Plus size={16} className="stroke-[2.5]" />
         <span>Tambah Item Wishlist</span>
      </motion.button>
   );
};

export default AddWishlistButton;