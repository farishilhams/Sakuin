import React, { useState, useRef } from "react";
import { createWorker } from "tesseract.js";
import { parseReceipt } from "../utils/receiptParser";
import api from "../utils/api";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
   Camera,
   Upload,
   X,
   Check,
   RefreshCw,
   Sparkles,
   FileText,
   ChevronDown,
   ChevronUp,
   Scan,
} from "lucide-react";

export default function ReceiptScannerModal({ isOpen, onClose, onTransactionSaved }) {
   const [imageFile, setImageFile] = useState(null);
   const [imagePreview, setImagePreview] = useState(null);
   const [isScanning, setIsScanning] = useState(false);
   const [scanProgress, setScanProgress] = useState(0);
   const [scanStatusText, setScanStatusText] = useState("");
   const [showRawText, setShowRawText] = useState(false);

   // Form data hasil parsing
   const [parsedData, setParsedData] = useState({
      name: "",
      amount: "",
      displayAmount: "",
      date: new Date().toISOString().slice(0, 10),
      category: "Makanan",
      rawText: "",
   });

   const [isSaving, setIsSaving] = useState(false);
   const fileInputRef = useRef(null);
   const cameraInputRef = useRef(null);

   const categories = [
      "Makanan",
      "Transportasi",
      "Hiburan",
      "Kesehatan",
      "Pendidikan",
      "Kebutuhan Pribadi",
   ];

   const handleFileSelect = (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (!file.type.startsWith("image/")) {
         toast.error("Harap pilih file gambar JPG, PNG, atau WebP!");
         return;
      }

      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);

      // Jalankan proses OCR
      processImageOCR(file);
   };

   const processImageOCR = async (file) => {
      setIsScanning(true);
      setScanProgress(0);
      setScanStatusText("Menyiapkan pemindai bukti transaksi...");

      try {
         // Inisialisasi Tesseract Worker
         const worker = await createWorker("ind+eng", 1, {
            logger: (m) => {
               if (m.status === "recognizing text") {
                  setScanProgress(Math.round((m.progress || 0) * 100));
                  setScanStatusText(`Membaca teks struk... ${Math.round((m.progress || 0) * 100)}%`);
               } else {
                  setScanStatusText(m.status || "Memproses...");
               }
            },
         });

         const { data } = await worker.recognize(file);
         await worker.terminate();

         const rawText = data.text || "";
         setScanStatusText("Menganalisis nominal dan merchant...");

         // Ekstraksi data cerdas via receiptParser
         const extracted = parseReceipt(rawText);

         setParsedData({
            name: extracted.name || "Transaksi Struk",
            amount: extracted.amount || "",
            displayAmount: extracted.amount ? Number(extracted.amount).toLocaleString("id-ID") : "",
            date: extracted.date || new Date().toISOString().slice(0, 10),
            category: extracted.category || "Makanan",
            rawText: rawText,
         });

         toast.success("Struk berhasil terbaca otomatis!");
      } catch (error) {
         console.error("OCR Scanner Error:", error);
         toast.error("Gagal membaca gambar. Silakan isi nominal manual.");
      } finally {
         setIsScanning(false);
      }
   };

   const handleAmountChange = (e) => {
      const numericValue = e.target.value.replace(/\D/g, "");
      setParsedData({
         ...parsedData,
         amount: numericValue ? parseInt(numericValue, 10) : "",
         displayAmount: numericValue ? parseInt(numericValue, 10).toLocaleString("id-ID") : "",
      });
   };

   const handleSaveTransaction = async () => {
      if (!parsedData.name.trim()) {
         toast.error("Nama merchant/transaksi tidak boleh kosong!");
         return;
      }

      const numAmount = typeof parsedData.amount === "number"
         ? parsedData.amount
         : parseFloat(parsedData.amount);

      if (!numAmount || numAmount <= 0) {
         toast.error("Nominal transaksi harus lebih besar dari Rp 0!");
         return;
      }

      setIsSaving(true);
      try {
         await api.post("/transactions", {
            name: parsedData.name.trim(),
            category: parsedData.category,
            amount: numAmount,
            date: parsedData.date,
         });

         toast.success("Transaksi berhasil dicatat dari struk!");
         if (onTransactionSaved) {
            onTransactionSaved();
         }
         handleClose();
      } catch (error) {
         console.error("Gagal menyimpan transaksi scanner:", error);
         toast.error("Gagal menyimpan transaksi ke database!");
      } finally {
         setIsSaving(false);
      }
   };

   const handleClose = () => {
      setImageFile(null);
      if (imagePreview) {
         URL.revokeObjectURL(imagePreview);
      }
      setImagePreview(null);
      setIsScanning(false);
      setParsedData({
         name: "",
         amount: "",
         displayAmount: "",
         date: new Date().toISOString().slice(0, 10),
         category: "Makanan",
         rawText: "",
      });
      onClose();
   };

   if (!isOpen) return null;

   return (
      <AnimatePresence>
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-900/60 backdrop-blur-sm">
            <motion.div
               initial={{ opacity: 0, scale: 0.95, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.95, y: 20 }}
               transition={{ duration: 0.2, ease: "easeOut" }}
               className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
               {/* Header Modal */}
               <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                  <div className="flex items-center gap-2.5">
                     <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                        <Scan size={20} className="stroke-[2.5]" />
                     </div>
                     <div>
                        <h3 className="font-semibold text-base sm:text-lg text-slate-900 dark:text-slate-100 flex items-center gap-2">
                           <span>Pindai Bukti Transaksi & QRIS</span>
                           <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 px-2 py-0.5 rounded-full">
                              Pindai Otomatis
                           </span>
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                           Foto struk belanja atau unggah tangkapan layar bukti transfer QRIS
                        </p>
                     </div>
                  </div>

                  <button
                     onClick={handleClose}
                     className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                     aria-label="Tutup"
                  >
                     <X size={18} />
                  </button>
               </div>

               {/* Modal Content */}
               <div className="p-6 overflow-y-auto space-y-6 flex-1">
                  {/* Upload / Capture Section */}
                  {!imagePreview ? (
                     <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-500 rounded-2xl p-8 text-center transition-colors bg-slate-50/60 dark:bg-slate-800/20">
                        <input
                           type="file"
                           ref={fileInputRef}
                           accept="image/*"
                           onChange={handleFileSelect}
                           className="hidden"
                        />
                        <input
                           type="file"
                           ref={cameraInputRef}
                           accept="image/*"
                           capture="environment"
                           onChange={handleFileSelect}
                           className="hidden"
                        />

                        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-inner">
                           <Scan size={32} />
                        </div>

                        <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-base mb-1">
                           Unggah atau Ambil Foto Struk
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-6">
                           Sistem secara cerdas mengenali struk fisik (Indomaret, Alfamart, dll.) atau bukti transfer QRIS (BCA, Mandiri, GoPay, OVO, Dana).
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                           <button
                              type="button"
                              onClick={() => cameraInputRef.current?.click()}
                              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-transform active:scale-95"
                           >
                              <Camera size={16} />
                              <span>Ambil Foto Langsung</span>
                           </button>

                           <button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 font-medium text-xs flex items-center justify-center gap-2 transition-transform active:scale-95"
                           >
                              <Upload size={16} />
                              <span>Pilih dari Galeri / File</span>
                           </button>
                        </div>
                     </div>
                  ) : (
                     <div className="space-y-6">
                        {/* Image Preview & Scanning Effect */}
                        <div className="relative rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-slate-950 max-h-56 flex items-center justify-center group">
                           <img
                              src={imagePreview}
                              alt="Struk yang dipindai"
                              className="max-h-56 w-auto object-contain opacity-90"
                           />

                           {/* Animated Scanning Beam */}
                           {isScanning && (
                              <motion.div
                                 initial={{ top: "0%" }}
                                 animate={{ top: ["0%", "95%", "0%"] }}
                                 transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                 className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#10B981] z-10"
                              />
                           )}

                           {/* Overlay Progress Bar saat scanning */}
                           {isScanning && (
                              <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-white">
                                 <RefreshCw size={24} className="animate-spin text-emerald-400 mb-2" />
                                 <span className="text-xs font-semibold tracking-wide">
                                    {scanStatusText}
                                 </span>
                                 <div className="w-48 h-2 bg-slate-800 rounded-full mt-3 overflow-hidden border border-slate-700">
                                    <div
                                       className="h-full bg-emerald-500 rounded-full transition-all duration-200"
                                       style={{ width: `${scanProgress}%` }}
                                    />
                                 </div>
                              </div>
                           )}

                           <button
                              type="button"
                              onClick={() => {
                                 setImagePreview(null);
                                 setImageFile(null);
                              }}
                              className="absolute top-3 right-3 p-1.5 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white shadow-md text-xs transition-opacity"
                              title="Ganti Foto"
                           >
                              <RefreshCw size={14} />
                           </button>
                        </div>

                        {/* Extracted Form Fields */}
                        <div className="bg-slate-50 dark:bg-slate-800/30 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 space-y-4">
                           <div className="flex items-center justify-between pb-2 border-b border-slate-200/60 dark:border-slate-800">
                              <h5 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                                 <FileText size={13} className="text-emerald-500" />
                                 <span>Rincian Hasil Pindai (Dapat Diedit)</span>
                              </h5>
                              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                                 {isScanning ? "Memindai..." : "Siap Disimpan"}
                              </span>
                           </div>

                           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {/* Nama Merchant */}
                              <div className="sm:col-span-2">
                                 <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                                    Nama Toko / Penerima QRIS
                                 </label>
                                 <input
                                    type="text"
                                    value={parsedData.name}
                                    onChange={(e) => setParsedData({ ...parsedData, name: e.target.value })}
                                    placeholder="Masukkan nama toko atau penerima"
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                                 />
                              </div>

                              {/* Nominal */}
                              <div>
                                 <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                                    Nominal Total
                                 </label>
                                 <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
                                       Rp
                                    </span>
                                    <input
                                       type="text"
                                       value={parsedData.displayAmount}
                                       onChange={handleAmountChange}
                                       placeholder="0"
                                       className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm font-semibold font-mono tabular-nums focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                                    />
                                 </div>
                              </div>

                              {/* Kategori */}
                              <div>
                                 <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                                    Kategori Otomatis
                                 </label>
                                 <select
                                    value={parsedData.category}
                                    onChange={(e) => setParsedData({ ...parsedData, category: e.target.value })}
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                                 >
                                    {categories.map((cat) => (
                                       <option key={cat} value={cat}>
                                          {cat}
                                       </option>
                                    ))}
                                 </select>
                              </div>

                              {/* Tanggal */}
                              <div className="sm:col-span-2">
                                 <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                                    Tanggal Transaksi
                                 </label>
                                 <input
                                    type="date"
                                    value={parsedData.date}
                                    onChange={(e) => setParsedData({ ...parsedData, date: e.target.value })}
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                                 />
                              </div>
                           </div>

                           {/* Toggle Raw OCR Text */}
                           {parsedData.rawText && (
                              <div className="pt-2">
                                 <button
                                    type="button"
                                    onClick={() => setShowRawText(!showRawText)}
                                    className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
                                 >
                                    <FileText size={13} />
                                    <span>Lihat teks mentah OCR</span>
                                    {showRawText ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                                 </button>

                                 {showRawText && (
                                    <pre className="mt-2 p-3 rounded-xl bg-slate-100 dark:bg-slate-900 text-[11px] font-mono text-slate-600 dark:text-slate-300 max-h-32 overflow-y-auto whitespace-pre-wrap">
                                       {parsedData.rawText}
                                    </pre>
                                 )}
                              </div>
                           )}
                        </div>
                     </div>
                  )}
               </div>

               {/* Footer Modal */}
               <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                  <button
                     type="button"
                     onClick={handleClose}
                     className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                     Batal
                  </button>

                  {imagePreview && (
                     <button
                        type="button"
                        onClick={handleSaveTransaction}
                        disabled={isSaving || isScanning}
                        className="px-5 py-2.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 rounded-xl shadow-md shadow-emerald-600/25 flex items-center gap-2 transition-all active:scale-95"
                     >
                        {isSaving ? (
                           <>
                              <RefreshCw size={14} className="animate-spin" />
                              <span>Menyimpan...</span>
                           </>
                        ) : (
                           <>
                              <Check size={14} className="stroke-[3]" />
                              <span>Simpan ke Transaksi</span>
                           </>
                        )}
                     </button>
                  )}
               </div>
            </motion.div>
         </div>
      </AnimatePresence>
   );
}
