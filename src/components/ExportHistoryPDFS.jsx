import React, { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import toast from "react-hot-toast";
import { FileDown } from "lucide-react";

const ExportHistoryPDFS = ({ history = [] }) => {
   const [exportingPdf, setExportingPdf] = useState(false);

   const calculateTotal = (totals) => {
      return Object.values(totals || {}).reduce((acc, curr) => acc + (curr || 0), 0);
   };

   const getMonthName = (month) => {
      const months = [
         "Januari", "Februari", "Maret", "April", "Mei", "Juni",
         "Juli", "Agustus", "September", "Oktober", "November", "Desember"
      ];
      return months[month - 1] || "";
   };

   const exportHistoryPDF = async () => {
      if (history.length === 0) {
         toast.error("TIDAK ADA DATA ARSIP UNTUK DIEKSPOR");
         return;
      }

      setExportingPdf(true);

      try {
         const doc = new jsPDF("p", "mm", "a4");

         doc.setFontSize(16);
         doc.setFont("helvetica", "bold");
         doc.text("SAKUIN — LAPORAN ARSIP HISTORI PENGELUARAN", 105, 15, { align: "center" });

         doc.setFontSize(10);
         doc.setFont("helvetica", "normal");
         doc.text(
            `DIEKSPOR PADA: ${new Date().toLocaleDateString("id-ID", {
               day: "numeric",
               month: "long",
               year: "numeric",
               hour: "2-digit",
               minute: "2-digit",
            })}`,
            105,
            22,
            { align: "center" }
         );

         let yPos = 30;

         history.forEach((item, index) => {
            doc.setFontSize(13);
            doc.setFont("helvetica", "bold");
            doc.text(`${index + 1}. ${getMonthName(item.month)} ${item.year}`, 14, yPos);

            yPos += 7;

            const tableData = Object.entries(item.totals || {}).map(([category, amount]) => [
               category,
               `Rp ${Number(amount).toLocaleString("id-ID")}`,
            ]);

            tableData.push([
               "Total Pengeluaran",
               `Rp ${calculateTotal(item.totals).toLocaleString("id-ID")}`,
            ]);

            autoTable(doc, {
               startY: yPos,
               head: [["Kategori", "Nominal"]],
               body: tableData,
               headStyles: {
                  fillColor: [10, 10, 10],
                  textColor: [255, 255, 255],
                  fontStyle: "bold",
               },
               alternateRowStyles: {
                  fillColor: [245, 245, 240],
               },
               theme: "grid",
               styles: {
                  font: "courier",
                  fontStyle: "normal",
                  fontSize: 9,
                  lineColor: [0, 0, 0],
                  lineWidth: 0.2,
               },
               columnStyles: {
                  0: { fontStyle: "normal" },
                  1: { halign: "right", fontStyle: "normal" },
               },
            });

            yPos = doc.lastAutoTable.finalY + 12;

            if (index < history.length - 1 && yPos > 250) {
               doc.addPage();
               yPos = 20;
            }
         });

         const pageCount = doc.internal.getNumberOfPages();
         for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setTextColor(100, 100, 100);
            doc.text(
               `Halaman ${i} dari ${pageCount} — SAKUIN`,
               105,
               doc.internal.pageSize.height - 10,
               { align: "center" }
            );
         }

         doc.save("History_Pengeluaran_Bulanan.pdf");
         toast.success("DOKUMEN PDF BERHASIL DIGENERATE");
      } catch (error) {
         console.error("Error generating PDF:", error);
         toast.error("GAGAL MEMBUAT PDF");
      } finally {
         setExportingPdf(false);
      }
   };

   return (
      <button
         type="button"
         onClick={exportHistoryPDF}
         disabled={exportingPdf || history.length === 0}
         className="px-3.5 py-1.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] hover:bg-[var(--color-bg)] text-[var(--color-ink)] text-xs font-semibold shadow-2xs disabled:opacity-40 disabled:pointer-events-none transition-colors flex items-center gap-1.5 cursor-pointer"
      >
         <FileDown size={14} className="stroke-[2.2] text-emerald-600 dark:text-emerald-400" />
         <span>{exportingPdf ? "Mengekspor..." : "Unduh Rekap PDF"}</span>
      </button>
   );
};

export default ExportHistoryPDFS;