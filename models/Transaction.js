const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema(
   {
      userId: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User",
         required: [true, "User ID wajib diisi"],
         index: true,
      },
      name: {
         type: String,
         required: [true, "Nama transaksi wajib diisi"],
         trim: true,
      },
      category: {
         type: String,
         enum: {
            values: [
               "Makanan",
               "Makanan & Minuman",
               "Transportasi",
               "Belanja",
               "Tagihan",
               "Hiburan",
               "Kesehatan",
               "Pendidikan",
               "Kebutuhan Pribadi",
               "Lainnya",
            ],
            message: "Kategori {VALUE} tidak didukung",
         },
         required: [true, "Kategori transaksi wajib diisi"],
      },
      amount: {
         type: Number,
         required: [true, "Nominal transaksi wajib diisi"],
         min: [0, "Nominal tidak boleh negatif"],
      },
      date: {
         type: Date,
         default: Date.now,
         index: true,
      },
      type: {
         type: String,
         enum: ["expense", "income", "transfer"],
         default: "expense",
      },
      wallet: {
         type: String,
         enum: [
            "Tunai",
            "BCA",
            "Mandiri",
            "BRI",
            "BNI",
            "GoPay",
            "OVO",
            "ShopeePay",
            "DANA",
            "Lainnya",
         ],
         default: "Tunai",
      },
      notes: {
         type: String,
         default: "",
         trim: true,
      },
      receiptUrl: {
         type: String,
         default: "",
      },
   },
   {
      timestamps: true,
   }
);

// Compound indexing untuk pencarian transaksi harian dan analitik performa tinggi
TransactionSchema.index({ userId: 1, date: -1 });
TransactionSchema.index({ userId: 1, category: 1 });
TransactionSchema.index({ userId: 1, type: 1 });

module.exports = mongoose.model("Transaction", TransactionSchema);
