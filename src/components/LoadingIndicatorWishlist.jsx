import React from "react";
import { Loader2 } from "lucide-react";

const LoadingIndicatorWishlist = ({
   message = "Memproses...",
}) => {
   return (
      <div className="py-2 px-3.5 bg-[var(--color-surface)] text-[var(--color-ink)] rounded-xl border border-[var(--color-border)] inline-flex items-center gap-2 text-xs font-semibold shadow-xs">
         <Loader2 size={14} className="animate-spin text-emerald-500" />
         <span>{message}</span>
      </div>
   );
};

export default LoadingIndicatorWishlist;