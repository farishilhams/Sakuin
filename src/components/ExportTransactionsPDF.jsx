import React, { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import toast from "react-hot-toast";
import { FileDown, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const ExportTransactionsPDF = ({ transactions, filteredTransactions }) => {
   const [exportingPdf, setExportingPdf] = useState(false);

   const formatDate = (dateString, format = "full") => {
      const date = new Date(dateString);
      if (format === "full") {
         return date.toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
         });
      } else {
         return date.toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
         });
      }
   };

   const exportTransactionsPDF = async () => {
      try {
         setExportingPdf(true);

         const pdf = new jsPDF();
         const title = "SAKUIN — LAPORAN TRANSAKSI PENGELUARAN";
         pdf.setFontSize(16);
         pdf.setTextColor(15, 23, 42);
         pdf.text(title, 14, 22);

         pdf.setFontSize(10);
         pdf.setTextColor(100, 116, 139);
         pdf.text(`Dicetak pada: ${formatDate(new Date())}`, 14, 30);

         const dataToExport =
            filteredTransactions.length > 0
               ? filteredTransactions
               : transactions;

         let startY = 36;
         if (
            filteredTransactions.length !== transactions.length &&
            filteredTransactions.length > 0
         ) {
            pdf.text(
               `Filter aktif: Menampilkan ${filteredTransactions.length} dari ${transactions.length} transaksi`,
               14,
               36
            );
            startY = 42;
         }

         const tableData = dataToExport.map((tx, index) => [
            index + 1,
            formatDate(tx.date),
            tx.name,
            tx.category,
            `Rp ${Number(tx.amount).toLocaleString("id-ID")}`,
         ]);

         const headers = [["No", "Tanggal", "Nama", "Kategori", "Nominal"]];

         const columnStyles = {
            0: { cellWidth: 15 },
            1: { cellWidth: 35 },
            2: { cellWidth: 50 },
            3: { cellWidth: 40 },
            4: { cellWidth: 40 },
         };

         autoTable(pdf, {
            head: headers,
            body: tableData,
            startY: startY,
            theme: "grid",
            headStyles: {
               fillColor: [16, 185, 129],
               textColor: [255, 255, 255],
               fontStyle: "bold",
            },
            columnStyles: columnStyles,
            styles: {
               lineColor: [226, 232, 240],
               lineWidth: 0.25,
            },
         });

         const totalAmount = dataToExport.reduce(
            (sum, tx) => sum + Number(tx.amount),
            0
         );

         const finalY = pdf.lastAutoTable.finalY;
         pdf.setFontSize(11);
         pdf.setTextColor(15, 23, 42);
         pdf.setFont(undefined, "bold");
         pdf.text(
            `Total Pengeluaran: Rp ${totalAmount.toLocaleString("id-ID")}`,
            pdf.internal.pageSize.width - 20,
            finalY + 10,
            { align: "right" }
         );

         const pageCount = pdf.internal.getNumberOfPages();
         for (let i = 1; i <= pageCount; i++) {
            pdf.setPage(i);
            pdf.setFontSize(9);
            pdf.setTextColor(148, 163, 184);
            pdf.setFont(undefined, "normal");
            pdf.text(
               `Halaman ${i} dari ${pageCount} — Sakuin Laporan Arus Kas`,
               pdf.internal.pageSize.width - 20,
               pdf.internal.pageSize.height - 10,
               { align: "right" }
            );
         }

         const fileName = `Sakuin_Transaksi_${new Date().toISOString().slice(0, 10)}.pdf`;
         pdf.save(fileName);

         toast.success("Dokumen PDF berhasil diunduh!");
      } catch (error) {
         console.error("Error exporting PDF:", error);
         toast.error(`Gagal membuat PDF: ${error.message}`);
      } finally {
         setExportingPdf(false);
      }
   };

   return (
      <motion.button
         whileHover={{ scale: 1.02 }}
         whileTap={{ scale: 0.98 }}
         onClick={exportTransactionsPDF}
         disabled={exportingPdf || transactions.length === 0}
         className="w-full sm:w-auto text-xs font-semibold bg-[var(--color-surface)] text-[var(--color-ink)] border border-[var(--color-border)] rounded-xl px-4 py-2.5 hover:bg-[var(--color-bg)] disabled:opacity-40 disabled:pointer-events-none transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
      >
         {exportingPdf ? (
            <Loader2 size={15} className="animate-spin" />
         ) : (
            <FileDown size={15} className="stroke-[2.2] text-emerald-500" />
         )}
         <span>{exportingPdf ? "Mengekspor..." : "Export PDF"}</span>
      </motion.button>
   );
};

export default ExportTransactionsPDF;