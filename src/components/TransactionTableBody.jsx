import React from "react";
import { Pencil, Trash2, Inbox, Calendar } from "lucide-react";

export const categoryColors = {
   Makanan: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
   "Makanan & Minuman": "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
   Transportasi: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
   Belanja: "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20",
   Tagihan: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
   Hiburan: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
   Kesehatan: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
   Pendidikan: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
   "Kebutuhan Pribadi": "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20",
   Lainnya: "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20",
};

/**
 * Mengelompokkan tanggal transaksi menjadi: Hari Ini, Kemarin, Pekan Ini, atau Sebelumnya
 */
const getDateGroup = (dateString) => {
   if (!dateString) return "Sebelumnya";
   const txDate = new Date(dateString);
   const today = new Date();
   
   // Reset jam untuk komparasi tanggal murni
   const d1 = new Date(txDate.getFullYear(), txDate.getMonth(), txDate.getDate());
   const d0 = new Date(today.getFullYear(), today.getMonth(), today.getDate());
   
   const diffDays = Math.round((d0 - d1) / (1000 * 60 * 60 * 24));
   
   if (diffDays === 0) return "Hari Ini";
   if (diffDays === 1) return "Kemarin";
   if (diffDays > 1 && diffDays <= 7) return "Pekan Ini";
   return "Sebelumnya";
};

const TransactionTableBody = ({
   isLoadingTransactions,
   filteredTransactions,
   paginatedTransactions,
   itemsPerPage,
   currentPage,
   openModalForEdit,
   confirmDelete,
   transactions,
}) => {
   let lastGroup = null;

   return (
      <tbody className="divide-y divide-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-ink)]">
         {isLoadingTransactions ? (
            Array(5)
               .fill(0)
               .map((_, index) => (
                  <tr key={`skeleton-${index}`} className="animate-pulse">
                     <td className="py-3 px-3 text-center">
                        <div className="h-4 bg-[var(--color-border)] rounded w-4 mx-auto" />
                     </td>
                     <td className="py-3 px-4">
                        <div className="h-4 bg-[var(--color-border)] rounded w-20" />
                     </td>
                     <td className="py-3 px-4">
                        <div className="h-4 bg-[var(--color-border)] rounded w-36" />
                     </td>
                     <td className="py-3 px-4">
                        <div className="h-5 bg-[var(--color-border)] rounded-full w-24" />
                     </td>
                     <td className="py-3 px-4 text-right">
                        <div className="h-4 bg-[var(--color-border)] rounded w-20 ml-auto" />
                     </td>
                     <td className="py-3 px-4 text-center">
                        <div className="h-6 bg-[var(--color-border)] rounded-lg w-14 mx-auto" />
                     </td>
                  </tr>
               ))
         ) : filteredTransactions.length > 0 ? (
            paginatedTransactions.map((tx, index) => {
               const realIndex =
                  itemsPerPage === "all"
                     ? index + 1
                     : (currentPage - 1) * itemsPerPage + index + 1;

               const catStyle =
                  categoryColors[tx.category] ||
                  "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20";

               // Check date grouping
               const currentGroup = getDateGroup(tx.date);
               const showGroupHeader = currentGroup !== lastGroup;
               lastGroup = currentGroup;

               return (
                  <React.Fragment key={tx._id}>
                     {showGroupHeader && (
                        <tr className="bg-[var(--color-bg)]/70">
                           <td
                              colSpan="6"
                              className="py-2 px-4 text-[11px] font-bold tracking-wider uppercase text-[var(--color-ink-muted)] border-y border-[var(--color-border)]/60"
                           >
                              <div className="flex items-center gap-2">
                                 <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                 <span>{currentGroup}</span>
                              </div>
                           </td>
                        </tr>
                     )}

                     <tr className="hover:bg-[var(--color-bg)]/60 transition-colors duration-150 text-xs">
                        {/* Index */}
                        <td className="py-3 px-3 text-center text-[var(--color-ink-muted)] font-mono text-[11px]">
                           {realIndex}
                        </td>

                        {/* Date */}
                        <td className="py-3 px-4 whitespace-nowrap text-[var(--color-ink-muted)] font-medium">
                           {new Date(tx.date).toLocaleDateString("id-ID", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                           })}
                        </td>

                        {/* Name & Wallet */}
                        <td className="py-3 px-4 font-medium text-[var(--color-ink)]">
                           <div className="flex items-center gap-1.5 flex-wrap">
                              <span>{tx.name}</span>
                              {tx.wallet && (
                                 <span className="text-[10px] text-[var(--color-ink-muted)] bg-[var(--color-bg)] px-1.5 py-0.5 rounded border border-[var(--color-border)]">
                                    {tx.wallet}
                                 </span>
                              )}
                           </div>
                           {tx.notes && (
                              <span className="text-[11px] text-[var(--color-ink-muted)] block truncate max-w-xs mt-0.5">
                                 {tx.notes}
                              </span>
                           )}
                        </td>

                        {/* Category badge */}
                        <td className="py-3 px-4 whitespace-nowrap">
                           <span className={`inline-block border px-2.5 py-0.5 text-[10px] font-semibold rounded-full ${catStyle}`}>
                              {tx.category}
                           </span>
                        </td>

                        {/* Nominal */}
                        <td className="py-3 px-4 text-right font-bold text-xs sm:text-sm font-mono tabular-nums text-[var(--color-ink)] whitespace-nowrap">
                           Rp {Number(tx.amount).toLocaleString("id-ID")}
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-4 text-center whitespace-nowrap">
                           <div className="flex items-center justify-center gap-1.5">
                              <button
                                 onClick={() => openModalForEdit(tx)}
                                 className="p-1.5 rounded-lg text-[var(--color-ink-muted)] hover:text-emerald-600 hover:bg-emerald-500/10 transition-colors cursor-pointer"
                                 title="Edit Transaksi"
                              >
                                 <Pencil size={14} className="stroke-[2.2]" />
                              </button>
                              <button
                                 onClick={() => confirmDelete(tx)}
                                 className="p-1.5 rounded-lg text-[var(--color-ink-muted)] hover:text-rose-600 hover:bg-rose-500/10 transition-colors cursor-pointer"
                                 title="Hapus Transaksi"
                              >
                                 <Trash2 size={14} className="stroke-[2.2]" />
                              </button>
                           </div>
                        </td>
                     </tr>
                  </React.Fragment>
               );
            })
         ) : (
            <tr>
               <td
                  colSpan="6"
                  className="py-14 px-4 text-center text-xs text-[var(--color-ink-muted)]"
               >
                  <div className="flex flex-col items-center justify-center gap-2">
                     <Inbox size={28} className="stroke-[1.5] text-[var(--color-ink-muted)] opacity-60" />
                     <span className="font-medium">
                        {transactions.length === 0
                           ? "Belum ada transaksi yang dicatat"
                           : "Tidak ada transaksi yang cocok dengan filter pencarian"}
                     </span>
                  </div>
               </td>
            </tr>
         )}
      </tbody>
   );
};

export default TransactionTableBody;
