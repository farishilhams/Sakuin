import React from "react";
import { Loader2 } from "lucide-react";

export default function LoadingLogin() {
   return (
      <div className="mb-4 p-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-xs text-[var(--color-ink)] flex items-center justify-center gap-2.5 shadow-xs">
         <Loader2 size={16} className="animate-spin text-emerald-500" />
         <span className="font-semibold">
            Memproses autentikasi...
         </span>
      </div>
   );
}