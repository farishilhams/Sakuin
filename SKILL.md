# SKILL.md — Pola Kode & Snippet Baku Aktual (As-Is Patterns)

> Dokumen ini mencatat pola kode yang **SUDAH DIGUNAKAN** di codebase backend dan frontend saat ini. Tujuannya adalah memastikan setiap penambahan atau perubahan kode baru mengikuti pola yang sudah ada secara konsisten, bukan memperkenalkan konvensi baru yang bertentangan.

---

## BAGIAN A: POLA KODE BACKEND (Express.js + Mongoose)

### 1. Pola Definisi Route & Proteksi Auth
Setiap route baru didefinisikan pada file router tersendiri di `routes/`, lalu di-mount di `server.js` dengan prefix `/api/<resource>`. Proteksi login menggunakan `authMiddleware`.

```javascript
// routes/contohRoutes.js
const express = require("express");
const router = express.Router();
const contohController = require("../controllers/contohController");
const authMiddleware = require("../middleware/authMiddleware");

// Pola route terproteksi
router.get("/", authMiddleware, contohController.getContoh);
router.post("/", authMiddleware, contohController.createContoh);
router.put("/:id", authMiddleware, contohController.updateContoh);
router.delete("/:id", authMiddleware, contohController.deleteContoh);

module.exports = router;
```

### 2. Pola Controller & Akses Database Langsung (Direct Mongoose Query)
Controller mengekstrak input dari `req.body` atau `req.params`, lalu **langsung berinteraksi dengan model Mongoose**. Akses ke database selalu menyertakan filter `userId: req.user.userId` untuk memastikan isolasi data per pengguna.

```javascript
// controllers/contohController.js
const ContohModel = require("../models/ContohModel");

const getContoh = async (req, res) => {
   try {
      const data = await ContohModel.find({
         userId: req.user.userId,
      }).sort({ date: -1 });
      res.json(data); // Pola umum: return raw array
   } catch (error) {
      res.status(500).json({ message: "Server error", error });
   }
};

const createContoh = async (req, res) => {
   try {
      const { name, amount } = req.body;
      const newItem = new ContohModel({
         userId: req.user.userId,
         name,
         amount,
      });
      await newItem.save();
      res.json({
         message: "Item berhasil ditambahkan",
         item: newItem,
      });
   } catch (error) {
      res.status(500).json({ message: "Server error", error });
   }
};

const updateContoh = async (req, res) => {
   try {
      const { id } = req.params;
      const { name, amount } = req.body;
      const updated = await ContohModel.findOneAndUpdate(
         { _id: id, userId: req.user.userId },
         { name, amount },
         { new: true }
      );
      if (!updated) {
         return res.status(404).json({ message: "Data tidak ditemukan" });
      }
      res.json({
         message: "Item berhasil diupdate",
         item: updated,
      });
   } catch (error) {
      res.status(500).json({ message: "Server error", error });
   }
};

const deleteContoh = async (req, res) => {
   try {
      const { id } = req.params;
      const deleted = await ContohModel.findOneAndDelete({
         _id: id,
         userId: req.user.userId,
      });
      if (!deleted) {
         return res.status(404).json({ message: "Data tidak ditemukan" });
      }
      res.json({ message: "Item berhasil dihapus" });
   } catch (error) {
      res.status(500).json({ message: "Server error", error });
   }
};

module.exports = { getContoh, createContoh, updateContoh, deleteContoh };
```

### 3. Pola Upsert (Pemasukan Bulanan)
Pola pencarian data berdasarkan kombinasi `userId`, `month`, dan `year`. Jika sudah ada diperbarui, jika belum ada dibuat baru.

```javascript
const upsertMonthlyData = async (req, res) => {
   const { month, year, amount } = req.body;
   const userId = req.user.userId;
   try {
      let record = await Model.findOne({ userId, month, year });
      if (record) {
         record.amount = amount;
         record.updatedAt = Date.now();
         await record.save();
      } else {
         record = new Model({ userId, month, year, amount });
         await record.save();
      }
      res.json({ message: "Data berhasil disimpan", record });
   } catch (error) {
      res.status(500).json({ message: "Server error", error });
   }
};
```

---

## BAGIAN B: POLA KODE FRONTEND (React + Vite + Tailwind v4)

### 1. Pola Pemanggilan API via Axios Instance
Seluruh request ke backend wajib menggunakan instance `api` dari `src/utils/api.js` yang telah dikonfigurasi dengan baseURL dan token header otomatis.

```javascript
import api from "../utils/api";
import toast from "react-hot-toast";

// Pola fetch di useEffect
useEffect(() => {
   const fetchData = async () => {
      try {
         setIsLoading(true);
         const res = await api.get("/transactions");
         setTransactions(res.data || []);
      } catch (error) {
         console.error("Error fetching data", error);
         toast.error("GAGAL MEMUAT DATA");
      } finally {
         setIsLoading(false);
      }
   };
   if (user) fetchData();
}, [user]);
```

### 2. Pola Form Modal dengan Format Angka Rupiah
Input nominal keuangan diformat secara visual dengan pemisah ribuan saat diketik, namun disimpan sebagai tipe data number murni.

```jsx
const [amount, setAmount] = useState("");
const [displayAmount, setDisplayAmount] = useState("");

const handleAmountChange = (e) => {
   // Hapus karakter selain angka
   const numericValue = e.target.value.replace(/\D/g, "");
   setAmount(numericValue ? parseInt(numericValue, 10) : "");
   setDisplayAmount(
      numericValue ? parseInt(numericValue, 10).toLocaleString("id-ID") : ""
   );
};

// Di dalam render JSX input:
<input
   type="text"
   value={displayAmount}
   onChange={handleAmountChange}
   placeholder="0"
   className="w-full border-2 border-[var(--color-ink)] bg-[var(--color-surface)] text-[var(--color-ink)] p-2.5 font-mono tabular-nums focus:outline-2 focus:outline-[var(--color-accent)]"
/>
```

### 3. Pola Modal Dialog & Konfirmasi Hapus (Industrial Brutalism)
Modal menggunakan fixed backdrop gelap, border tebal hitam, hard offset box-shadow, serta tombol aksi konfirmasi yang jelas.

```jsx
// Pola backdrop dan container modal
<div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 animate-fadeIn">
   <div className="bg-[var(--color-surface)] border-[3px] border-[var(--color-ink)] shadow-[8px_8px_0_var(--color-ink)] w-full max-w-md flex flex-col">
      {/* Header Modal */}
      <div className="p-4 sm:p-5 border-b-[3px] border-[var(--color-ink)] flex items-center justify-between">
         <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-[var(--color-accent)] border border-[var(--color-ink)]" />
            <h2 className="font-macro uppercase text-base sm:text-lg tracking-tight text-[var(--color-ink)]">
               JUDUL MODAL
            </h2>
         </div>
         <button onClick={onClose} className="w-8 h-8 border-2 border-[var(--color-ink)] flex items-center justify-center hover:bg-[var(--color-ink)] hover:text-[var(--color-bg)]">
            <X size={18} />
         </button>
      </div>

      {/* Body Modal */}
      <div className="p-5 sm:p-6 space-y-4">
         {/* Form controls */}
      </div>
   </div>
</div>
```

### 4. Pola Ekspor PDF Berformat Monospace / Tabel Monokrom
Ekspor dokumen laporan menggunakan `jsPDF` dan `jspdf-autotable` dengan palet warna hitam/putih brutalist.

```javascript
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const exportPDF = (dataList) => {
   const doc = new jsPDF();
   doc.setFontSize(16);
   doc.text("LAPORAN DATA KEUANGAN", 14, 22);

   const tableData = dataList.map((item, idx) => [
      idx + 1,
      item.name,
      `Rp ${Number(item.amount).toLocaleString("id-ID")}`
   ]);

   autoTable(doc, {
      head: [["No", "Nama", "Nominal"]],
      body: tableData,
      startY: 32,
      theme: "grid",
      headStyles: {
         fillColor: [10, 10, 10],
         textColor: [255, 255, 255],
         fontStyle: "bold",
      },
      styles: {
         font: "courier",
         lineColor: [0, 0, 0],
         lineWidth: 0.25,
      },
   });

   doc.save(`Laporan_${Date.now()}.pdf`);
};
```
