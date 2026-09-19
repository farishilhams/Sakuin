/**
 * Parser cerdas untuk mengekstrak data transaksi (Merchant, Nominal, Tanggal, Kategori)
 * dari teks mentah hasil pemindaian OCR struk belanja fisik atau tangkapan layar m-banking / QRIS.
 */

const KNOWN_MERCHANTS = [
   // Retail Minimarket & Supermarket
   { name: "Indomaret", category: "Makanan" },
   { name: "Alfamart", category: "Makanan" },
   { name: "Alfamidi", category: "Makanan" },
   { name: "Superindo", category: "Makanan" },
   { name: "Hypermart", category: "Makanan" },
   { name: "Transmart", category: "Makanan" },
   { name: "Lawson", category: "Makanan" },
   { name: "FamilyMart", category: "Makanan" },
   { name: "Circle K", category: "Makanan" },
   
   // F&B / Coffee / Fast Food
   { name: "Kopi Kenangan", category: "Makanan" },
   { name: "Janji Jiwa", category: "Makanan" },
   { name: "Point Coffee", category: "Makanan" },
   { name: "Starbucks", category: "Makanan" },
   { name: "Mixue", category: "Makanan" },
   { name: "Chatime", category: "Makanan" },
   { name: "McDonald's", category: "Makanan" },
   { name: "KFC", category: "Makanan" },
   { name: "HokBen", category: "Makanan" },
   { name: "A&W", category: "Makanan" },
   { name: "Solaria", category: "Makanan" },
   { name: "Bakso", category: "Makanan" },
   { name: "Mie Gacoan", category: "Makanan" },
   { name: "Richeese Factory", category: "Makanan" },

   // Transportasi
   { name: "SPBU Pertamina", category: "Transportasi" },
   { name: "Pertamina", category: "Transportasi" },
   { name: "Shell", category: "Transportasi" },
   { name: "BP-AKR", category: "Transportasi" },
   { name: "Gojek", category: "Transportasi" },
   { name: "GoRide", category: "Transportasi" },
   { name: "GoCar", category: "Transportasi" },
   { name: "Grab", category: "Transportasi" },
   { name: "GrabRide", category: "Transportasi" },
   { name: "GrabCar", category: "Transportasi" },
   { name: "Maxim", category: "Transportasi" },
   { name: "KAI Commuter", category: "Transportasi" },
   { name: "MRT Jakarta", category: "Transportasi" },
   { name: "TransJakarta", category: "Transportasi" },
   { name: "Parkir", category: "Transportasi" },

   // Kesehatan & Farmasi
   { name: "Kimia Farma", category: "Kesehatan" },
   { name: "Apotek K-24", category: "Kesehatan" },
   { name: "Apotek Roxy", category: "Kesehatan" },
   { name: "Guardian", category: "Kesehatan" },
   { name: "Watsons", category: "Kesehatan" },
   { name: "Century", category: "Kesehatan" },
   { name: "Halodoc", category: "Kesehatan" },

   // Hiburan
   { name: "Cinema XXI", category: "Hiburan" },
   { name: "CGV Cinemas", category: "Hiburan" },
   { name: "Cinepolis", category: "Hiburan" },
   { name: "Steam", category: "Hiburan" },
   { name: "Netflix", category: "Hiburan" },
   { name: "Spotify", category: "Hiburan" },
   { name: "Timezone", category: "Hiburan" },

   // Pendidikan & Alat Tulis
   { name: "Gramedia", category: "Pendidikan" },
   { name: "Togamas", category: "Pendidikan" },
   { name: "Paperclip", category: "Pendidikan" },
   { name: "Fotocopy", category: "Pendidikan" },

   // Kebutuhan Pribadi & Fashion
   { name: "Uniqlo", category: "Kebutuhan Pribadi" },
   { name: "H&M", category: "Kebutuhan Pribadi" },
   { name: "Zara", category: "Kebutuhan Pribadi" },
   { name: "Miniso", category: "Kebutuhan Pribadi" },
   { name: "KKV", category: "Kebutuhan Pribadi" },
   { name: "Barbershop", category: "Kebutuhan Pribadi" },
   { name: "Laundry", category: "Kebutuhan Pribadi" },
   { name: "PLN", category: "Kebutuhan Pribadi" },
   { name: "PDAM", category: "Kebutuhan Pribadi" },
];

/**
 * Ekstraksi angka nominal dari teks
 */
export function extractAmount(text) {
   if (!text) return 0;

   const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
   
   // Prioritas 1: Baris yang mengandung kata Total / Tagihan / Bayar / Nominal
   const totalKeywords = [
      /total\s*bayar/i,
      /total\s*belanja/i,
      /total\s*tagihan/i,
      /grand\s*total/i,
      /total\s*transaksi/i,
      /jumlah\s*bayar/i,
      /nominal/i,
      /total/i,
      /jumlah/i,
      /subtotal/i,
   ];

   for (const regex of totalKeywords) {
      for (const line of lines) {
         if (regex.test(line)) {
            const numbers = extractNumbersFromLine(line);
            if (numbers.length > 0) {
               // Ambil angka terbesar di baris total
               const maxVal = Math.max(...numbers);
               if (maxVal > 500 && maxVal < 100000000) {
                  return maxVal;
               }
            }
         }
      }
   }

   // Prioritas 2: Cari pola Rp ... di seluruh baris
   const rpRegex = /(?:rp\.?|idr)\s*([\d.,]+)/gi;
   let allRpMatches = [];
   let match;
   while ((match = rpRegex.exec(text)) !== null) {
      const parsed = parseIndonesianCurrency(match[1]);
      if (parsed > 500 && parsed < 100000000) {
         allRpMatches.push(parsed);
      }
   }

   if (allRpMatches.length > 0) {
      // Ambil nilai tertinggi yang wajar (biasanya Grand Total)
      return Math.max(...allRpMatches);
   }

   // Prioritas 3: Cari angka nominal umum di seluruh teks
   const allNumbers = [];
   for (const line of lines) {
      const nums = extractNumbersFromLine(line);
      allNumbers.push(...nums);
   }

   const validTotals = allNumbers.filter((n) => n >= 1000 && n <= 50000000);
   if (validTotals.length > 0) {
      return Math.max(...validTotals);
   }

   return 0;
}

function extractNumbersFromLine(line) {
   // Hapus karakter non angka dan pemisah ribuan
   const results = [];
   const parts = line.split(/[\s,]+/);
   for (const part of parts) {
      const clean = part.replace(/[^\d.]/g, "");
      if (clean) {
         const val = parseIndonesianCurrency(clean);
         if (val > 0) results.push(val);
      }
   }
   return results;
}

function parseIndonesianCurrency(str) {
   if (!str) return 0;
   // Format Indonesia biasanya ribuan pakai titik: 50.000 atau koma 50,000
   let clean = str.replace(/[^\d.,]/g, "");
   
   // Jika ada titik dan koma, misal 50.000,00
   if (clean.includes(".") && clean.includes(",")) {
      clean = clean.replace(/\./g, "").replace(",", ".");
   } else if (clean.includes(".")) {
      // 50.000 -> 50000
      clean = clean.replace(/\./g, "");
   } else if (clean.includes(",")) {
      // Jika format koma ribuan: 50,000 -> 50000
      clean = clean.replace(/,/g, "");
   }

   const num = parseInt(clean, 10);
   return isNaN(num) ? 0 : num;
}

/**
 * Ekstraksi Tanggal Transaksi (Format YYYY-MM-DD untuk input form)
 */
export function extractDate(text) {
   if (!text) return new Date().toISOString().slice(0, 10);

   const lines = text.split("\n");

   // Pola 1: DD/MM/YYYY atau DD-MM-YYYY
   const slashDashDate = /\b(\d{1,2})[/\-.](\d{1,2})[/\-.](\d{2,4})\b/;
   for (const line of lines) {
      const match = line.match(slashDashDate);
      if (match) {
         let day = parseInt(match[1], 10);
         let month = parseInt(match[2], 10);
         let year = parseInt(match[3], 10);

         if (year < 100) year += 2000; // 24 -> 2024, 26 -> 2026

         // Validasi rentang tanggal
         if (month >= 1 && month <= 12 && day >= 1 && day <= 31) {
            const formattedMonth = String(month).padStart(2, "0");
            const formattedDay = String(day).padStart(2, "0");
            return `${year}-${formattedMonth}-${formattedDay}`;
         }
      }
   }

   // Pola 2: DD NamaBulan YYYY (misal: 19 Sep 2026, 12 Januari 2025)
   const monthNames = {
      jan: 1, januari: 1, january: 1,
      feb: 2, februari: 2, february: 2,
      mar: 3, maret: 3, march: 3,
      apr: 4, april: 4,
      mei: 5, may: 5,
      jun: 6, juni: 6, june: 6,
      jul: 7, juli: 7, july: 7,
      agu: 8, agustus: 8, august: 8,
      sep: 9, september: 9,
      okt: 10, oktober: 10, october: 10,
      nov: 11, november: 11,
      des: 12, desember: 12, december: 12
   };

   const textMonthRegex = /\b(\d{1,2})\s+([a-zA-Z]{3,9})\s+(\d{4})\b/i;
   for (const line of lines) {
      const match = line.match(textMonthRegex);
      if (match) {
         const day = String(match[1]).padStart(2, "0");
         const monthKey = match[2].toLowerCase();
         const year = match[3];

         if (monthNames[monthKey]) {
            const month = String(monthNames[monthKey]).padStart(2, "0");
            return `${year}-${month}-${day}`;
         }
      }
   }

   // Default hari ini
   return new Date().toISOString().slice(0, 10);
}

/**
 * Ekstraksi Nama Merchant atau Penerima QRIS
 */
export function extractMerchant(text) {
   if (!text) return "Transaksi Struk/QRIS";

   const lines = text
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.length > 2 && !l.toLowerCase().includes("halaman"));

   // 1. Cek dari daftar brand terkenal
   for (const merchant of KNOWN_MERCHANTS) {
      const regex = new RegExp(`\\b${merchant.name}\\b`, "i");
      if (regex.test(text)) {
         return merchant.name;
      }
   }

   // 2. Cek pola QRIS m-banking: "Penerima:", "Kepada:", "Merchant:", "Nama:"
   const qrisKeywords = [
      /(?:penerima|merchant|toko|kepada|ke|nama\s*toko)\s*:\s*(.+)/i,
      /(?:transfer\s*ke|bayar\s*ke)\s*:\s*(.+)/i,
   ];

   for (const regex of qrisKeywords) {
      for (const line of lines) {
         const match = line.match(regex);
         if (match && match[1]) {
            const cleanName = match[1].replace(/[:\-#*]/g, "").trim();
            if (cleanName.length > 2 && cleanName.length < 40) {
               return cleanName;
            }
         }
      }
   }

   // 3. Fallback: Cari baris awal struk (biasanya nama toko berada di 1-3 baris teratas)
   const headerLines = lines.slice(0, 4).filter((l) => {
      const lower = l.toLowerCase();
      return (
         !lower.includes("qris") &&
         !lower.includes("transaksi") &&
         !lower.includes("berhasil") &&
         !lower.includes("struk") &&
         !lower.includes("nota") &&
         !lower.includes("tanggal") &&
         !/\d{5,}/.test(l)
      );
   });

   if (headerLines.length > 0) {
      return headerLines[0].slice(0, 35);
   }

   return "Transaksi Struk";
}

/**
 * Prediksi Kategori Pengeluaran berdasarkan nama toko / kata kunci struk
 */
export function predictCategory(merchantName, rawText) {
   const combined = `${merchantName || ""} ${rawText || ""}`.toLowerCase();

   // Cek brand database dulu
   for (const item of KNOWN_MERCHANTS) {
      if (combined.includes(item.name.toLowerCase())) {
         return item.category;
      }
   }

   if (/(cafe|kopi|coffee|resto|makan|food|bakso|ayam|mie|sate|martabak|dapur|dunkin|roti|snack|tea|jus)/i.test(combined)) {
      return "Makanan";
   }
   if (/(bensin|spbu|pertamina|shell|gojek|grab|maxim|ojek|taxi|taksi|toll|parkir|krl|kereta|mrt)/i.test(combined)) {
      return "Transportasi";
   }
   if (/(apotek|farmasi|obat|dokter|klinik|rs|medika|sehat|lab|laboratorium|dental)/i.test(combined)) {
      return "Kesehatan";
   }
   if (/(buku|book|gramedia|kursus|kuliah|sekolah|spp|les|bimbel|paper|alat\s*tulis)/i.test(combined)) {
      return "Pendidikan";
   }
   if (/(cinema|xxi|cgv|film|game|steam|playstation|karaoke|billiard|wisata|hiburan)/i.test(combined)) {
      return "Hiburan";
   }
   if (/(baju|fashion|sepatu|skincare|kosmetik|laundry|salon|barber|pln|listrik|pdam|pulsa|paket)/i.test(combined)) {
      return "Kebutuhan Pribadi";
   }

   return "Makanan"; // Default paling umum untuk struk harian
}

/**
 * Parser Utama: Mengolah string mentah OCR menjadi objek transaksi terstruktur
 */
export function parseReceipt(rawText) {
   const merchant = extractMerchant(rawText);
   const amount = extractAmount(rawText);
   const date = extractDate(rawText);
   const category = predictCategory(merchant, rawText);

   return {
      name: merchant,
      amount,
      date,
      category,
      rawText,
   };
}
