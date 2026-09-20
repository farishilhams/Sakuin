import React, { useState, useEffect, useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { AuthContext } from "../context/AuthContext";
import Header from "../components/Header";
import HistoryDeleteConfirmation from "../components/HistoryDeleteConfirmation";
import ExportHistoryPDFS from "../components/ExportHistoryPDFS";
import toast from "react-hot-toast";
import {
   Archive,
   Calendar,
   ChevronDown,
   ChevronRight,
   Trash2,
   Loader2,
   Inbox,
   Search,
   Filter,
   ArrowLeft,
   RefreshCw,
   Clock,
   Receipt,
   Tag,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const getMonthName = (month) => {
   const months = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
   ];
   return months[month - 1] || "";
};

const categoryBadgeStyles = {
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

export default function HistoryPage() {
   const { user } = useContext(AuthContext);
   const navigate = useNavigate();

   const [historyList, setHistoryList] = useState([]);
   const [isLoading, setIsLoading] = useState(true);
   const [loadingDelete, setLoadingDelete] = useState(null);
   const [historyToDelete, setHistoryToDelete] = useState(null);
   const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

   // State pencarian & filter
   const [searchQuery, setSearchQuery] = useState("");
   const [selectedYear, setSelectedYear] = useState("all");

   // State accordion: Set ID periode yang terbuka
   const [expandedPeriods, setExpandedPeriods] = useState({});

   const fetchHistory = async () => {
      try {
         setIsLoading(true);
         const res = await api.get("/history");
         const data = Array.isArray(res.data) ? res.data : [];
         setHistoryList(data);

         // Buka periode pertama secara default jika ada
         if (data.length > 0 && Object.keys(expandedPeriods).length === 0) {
            setExpandedPeriods({ [data[0]._id]: true });
         }
      } catch (error) {
         console.error("Gagal memuat arsip riwayat:", error);
         toast.error("Gagal memuat arsip riwayat pengeluaran");
      } finally {
         setIsLoading(false);
      }
   };

   useEffect(() => {
      fetchHistory();
   }, []);

   // Toggle status accordion per periode
   const togglePeriod = (id) => {
      setExpandedPeriods((prev) => ({
         ...prev,
         [id]: !prev[id],
      }));
   };

   // Konfirmasi penghapusan
   const confirmDelete = (item) => {
      setHistoryToDelete(item);
      setShowDeleteConfirmation(true);
   };

   const handleDelete = async () => {
      if (!historyToDelete) return;
      try {
         setLoadingDelete(historyToDelete._id);
         await api.delete(`/history/${historyToDelete._id}`);
         setHistoryList((prev) => prev.filter((item) => item._id !== historyToDelete._id));
         toast.success("Arsip histori berhasil dihapus!");
         window.dispatchEvent(new CustomEvent("sakuin:history-updated"));
      } catch (error) {
         console.error("Error deleting history:", error);
         toast.error("Gagal menghapus arsip riwayat");
      } finally {
         setLoadingDelete(null);
         setShowDeleteConfirmation(false);
         setHistoryToDelete(null);
      }
   };

   const calculateTotal = (totals) => {
      return Object.values(totals || {}).reduce((acc, curr) => acc + (curr || 0), 0);
   };

   // Ekstrak daftar tahun unik untuk filter
   const availableYears = useMemo(() => {
      const years = new Set(historyList.map((item) => item.year).filter(Boolean));
      return Array.from(years).sort((a, b) => b - a);
   }, [historyList]);

   // Filter riwayat berdasarkan pencarian & tahun
   const filteredHistory = useMemo(() => {
      return historyList.filter((item) => {
         const monthName = getMonthName(item.month).toLowerCase();
         const yearString = String(item.year || "");
         const matchesYear = selectedYear === "all" || String(item.year) === selectedYear;

         const matchesSearch =
            !searchQuery ||
            monthName.includes(searchQuery.toLowerCase()) ||
            yearString.includes(searchQuery) ||
            Object.keys(item.totals || {}).some((cat) =>
               cat.toLowerCase().includes(searchQuery.toLowerCase())
            );

         return matchesYear && matchesSearch;
      });
   }, [historyList, searchQuery, selectedYear]);

   const grandTotal = useMemo(() => {
      return filteredHistory.reduce((acc, item) => acc + calculateTotal(item.totals), 0);
   }, [filteredHistory]);

   return (
      <div className="min-h-[100dvh] w-full bg-transparent flex flex-col justify-between pb-32 md:pb-8 transition-colors">
         <div>
            {/* Top Navigation Bar */}
            <Header />

            {/* Main Content Container */}
            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
               {/* Breadcrumb & Navigation Back */}
               <div className="flex items-center justify-between">
                  <button
                     type="button"
                     onClick={() => navigate("/")}
                     className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] transition-colors cursor-pointer"
                  >
                     <ArrowLeft size={16} />
                     <span>Kembali ke Arus Kas</span>
                  </button>

                  <div className="flex items-center gap-2">
                     <button
                        type="button"
                        onClick={fetchHistory}
                        disabled={isLoading}
                        className="p-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] hover:bg-[var(--color-surface-hover)] text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] transition-colors cursor-pointer shadow-xs"
                        title="Segarkan Data"
                     >
                        <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
                     </button>
                     {historyList.length > 0 && (
                        <ExportHistoryPDFS history={filteredHistory} />
                     )}
                  </div>
               </div>

               {/* Banner Header Riwayat */}
               <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                     <div className="flex items-center gap-3.5">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                           <Archive size={24} className="stroke-[2.2]" />
                        </div>
                        <div>
                           <div className="flex items-center gap-2 flex-wrap">
                              <h1 className="text-xl sm:text-2xl font-extrabold text-[var(--color-ink)]">
                                 Riwayat & Arsip Bulanan
                              </h1>
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                 {historyList.length} Periode
                              </span>
                           </div>
                           <p className="text-xs text-[var(--color-ink-muted)] mt-0.5">
                              Rekapitulasi total pengeluaran per bulan yang telah ditutup dan diarsipkan
                           </p>
                        </div>
                     </div>

                     <div className="sm:text-right pt-3 sm:pt-0 border-t sm:border-t-0 border-[var(--color-border)]">
                        <span className="text-[11px] font-medium text-[var(--color-ink-muted)] block">
                           Total Terarsip:
                        </span>
                        <span className="text-lg sm:text-2xl font-extrabold font-mono tabular-nums text-emerald-600 dark:text-emerald-400">
                           Rp {Number(grandTotal).toLocaleString("id-ID")}
                        </span>
                     </div>
                  </div>
               </div>

               {/* Search & Filter Toolbar */}
               <div className="flex flex-col sm:flex-row items-center gap-3">
                  <div className="relative flex-1 w-full">
                     <Search
                        size={15}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-ink-muted)]"
                     />
                     <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Cari berdasarkan bulan, tahun, atau kategori..."
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-ink)] text-xs placeholder:text-[var(--color-ink-muted)] focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all shadow-xs"
                     />
                  </div>

                  {availableYears.length > 0 && (
                     <div className="w-full sm:w-auto shrink-0 flex items-center gap-2">
                        <Filter size={15} className="text-[var(--color-ink-muted)]" />
                        <select
                           value={selectedYear}
                           onChange={(e) => setSelectedYear(e.target.value)}
                           className="w-full sm:w-auto px-3 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-ink)] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all shadow-xs cursor-pointer"
                        >
                           <option value="all">Semua Tahun</option>
                           {availableYears.map((year) => (
                              <option key={year} value={String(year)}>
                                 Tahun {year}
                              </option>
                           ))}
                        </select>
                     </div>
                  )}
               </div>

               {/* Accordion History List */}
               <div className="space-y-4">
                  {isLoading ? (
                     <div className="py-20 text-center text-xs text-[var(--color-ink-muted)] flex flex-col items-center justify-center gap-3">
                        <Loader2 size={28} className="animate-spin text-emerald-500" />
                        <span className="font-medium">Memuat arsip riwayat pengeluaran...</span>
                     </div>
                  ) : filteredHistory.length > 0 ? (
                     filteredHistory.map((item, index) => {
                        const total = calculateTotal(item.totals);
                        const isExpanded = !!expandedPeriods[item._id];
                        const categoriesCount = Object.keys(item.totals || {}).length;

                        return (
                           <div
                              key={item._id}
                              className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-xs transition-colors overflow-hidden"
                           >
                              {/* Accordion Trigger Header */}
                              <div
                                 onClick={() => togglePeriod(item._id)}
                                 className="p-4 sm:p-5 flex items-center justify-between gap-3 cursor-pointer hover:bg-[var(--color-surface-hover)] transition-colors select-none"
                              >
                                 <div className="flex items-center gap-3 min-w-0">
                                    <div
                                       className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                                          isExpanded
                                             ? "bg-emerald-500 text-white shadow-xs"
                                             : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                       }`}
                                    >
                                       <Calendar size={18} className="stroke-[2.2]" />
                                    </div>

                                    <div className="min-w-0">
                                       <div className="flex items-center gap-2 flex-wrap">
                                          <h3 className="font-bold text-sm sm:text-base text-[var(--color-ink)] leading-tight truncate">
                                             {getMonthName(item.month)} {item.year}
                                          </h3>
                                          <span className="text-[10px] font-semibold text-[var(--color-ink-muted)] bg-[var(--color-border)]/40 px-2 py-0.5 rounded-full">
                                             {categoriesCount} Kategori
                                          </span>
                                       </div>
                                       <p className="text-[11px] text-[var(--color-ink-muted)] mt-0.5">
                                          Klik untuk {isExpanded ? "menutup" : "melihat"} rincian pos pengeluaran
                                       </p>
                                    </div>
                                 </div>

                                 <div className="flex items-center gap-3 shrink-0">
                                    <div className="text-right">
                                       <span className="text-[10px] font-semibold text-[var(--color-ink-muted)] block">
                                          Total Periode:
                                       </span>
                                       <span className="font-extrabold text-sm sm:text-base font-mono tabular-nums text-emerald-600 dark:text-emerald-400">
                                          Rp {Number(total).toLocaleString("id-ID")}
                                       </span>
                                    </div>

                                    <button
                                       type="button"
                                       onClick={(e) => {
                                          e.stopPropagation();
                                          confirmDelete(item);
                                       }}
                                       disabled={loadingDelete === item._id}
                                       className="p-2 rounded-xl text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                                       title="Hapus Arsip Periode Ini"
                                       aria-label="Hapus arsip periode"
                                    >
                                       <Trash2 size={16} />
                                    </button>

                                    <div className="text-[var(--color-ink-muted)]">
                                       <ChevronDown
                                          size={18}
                                          className={`transition-transform duration-200 ${
                                             isExpanded ? "rotate-180" : ""
                                          }`}
                                       />
                                    </div>
                                 </div>
                              </div>

                              {/* Accordion Content Panel */}
                              <AnimatePresence>
                                 {isExpanded && (
                                    <motion.div
                                       initial={{ height: 0, opacity: 0 }}
                                       animate={{ height: "auto", opacity: 1 }}
                                       exit={{ height: 0, opacity: 0 }}
                                       transition={{ duration: 0.2, ease: "easeOut" }}
                                       className="border-t border-[var(--color-border)] px-4 sm:px-5 py-4 overflow-hidden"
                                    >
                                       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                                          {Object.entries(item.totals || {}).map(([category, amount]) => {
                                             const badgeClass =
                                                categoryBadgeStyles[category] ||
                                                "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20";

                                             return (
                                                <div
                                                   key={category}
                                                   className="border border-[var(--color-border)] rounded-xl p-3 flex items-center justify-between transition-colors"
                                                >
                                                   <div className="flex items-center gap-2 min-w-0">
                                                      <span
                                                         className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${badgeClass} shrink-0`}
                                                      >
                                                         {category}
                                                      </span>
                                                   </div>
                                                   <span className="font-bold font-mono tabular-nums text-xs text-[var(--color-ink)]">
                                                      Rp {Number(amount).toLocaleString("id-ID")}
                                                   </span>
                                                </div>
                                             );
                                          })}
                                       </div>

                                       <div className="mt-4 pt-3 border-t border-[var(--color-border)] flex flex-col sm:flex-row items-center justify-between text-xs text-[var(--color-ink-muted)] gap-2">
                                          <div className="flex items-center gap-2">
                                             <Clock size={13} className="text-emerald-500" />
                                             <span>
                                                Arsip ditutup secara otomatis pada akhir periode {getMonthName(item.month)} {item.year}
                                             </span>
                                          </div>
                                          <span className="font-bold text-[var(--color-ink)]">
                                             100% Data Terverifikasi
                                          </span>
                                       </div>
                                    </motion.div>
                                 )}
                              </AnimatePresence>
                           </div>
                        );
                     })
                  ) : (
                     <div className="bg-[var(--color-surface)] border border-dashed border-[var(--color-border)] rounded-3xl p-12 text-center shadow-xs">
                        <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto mb-3">
                           <Inbox size={28} className="stroke-[1.8]" />
                        </div>
                        <h3 className="font-bold text-base text-[var(--color-ink)]">
                           Belum Ada Arsip Pengeluaran
                        </h3>
                        <p className="text-xs text-[var(--color-ink-muted)] mt-1 max-w-md mx-auto">
                           {searchQuery
                              ? "Tidak ditemukan periode arsip yang sesuai dengan kata kunci pencarian Anda."
                              : "Gunakan tombol Arsipkan Pengeluaran Bulan Ini pada halaman dashboard untuk menutup periode berjalan dan mengarsipkan total belanja bulanan."}
                        </p>
                        {searchQuery && (
                           <button
                              type="button"
                              onClick={() => {
                                 setSearchQuery("");
                                 setSelectedYear("all");
                              }}
                              className="mt-4 px-4 py-2 rounded-xl bg-emerald-600 text-white font-semibold text-xs transition-colors cursor-pointer"
                           >
                              Reset Pencarian
                           </button>
                        )}
                     </div>
                  )}
               </div>
            </main>
         </div>

         {/* Footer */}
         <footer className="border-t border-[var(--color-border)] bg-[var(--color-surface)] py-5 mt-12 mb-0 transition-colors">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[var(--color-ink-muted)]">
               <div className="flex items-center gap-2 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                  <span>Sakuin — Riwayat & Arsip Pengeluaran Cerdas</span>
               </div>
               <div className="text-[11px]">
                  © {new Date().getFullYear()} Sakuin. Hak Cipta Dilindungi.
               </div>
            </div>
         </footer>

         {/* Delete Confirmation Modal */}
         <HistoryDeleteConfirmation
            isOpen={showDeleteConfirmation}
            onClose={() => setShowDeleteConfirmation(false)}
            onConfirm={handleDelete}
            historyData={historyToDelete}
            isLoading={loadingDelete === historyToDelete?._id}
         />
      </div>
   );
}
