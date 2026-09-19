const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema(
   {
      userId: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User",
         required: true,
         index: true,
      },
      name: {
         type: String,
         required: true,
         trim: true,
      },
      category: {
         type: String,
         enum: [
            "Makanan",
            "Transportasi",
            "Hiburan",
            "Kesehatan",
            "Pendidikan",
            "Kebutuhan Pribadi",
         ],
         required: true,
      },
      amount: {
         type: Number,
         required: true,
         min: 0,
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
         enum: ["Tunai", "BCA", "Mandiri", "BRI", "BNI", "GoPay", "OVO", "ShopeePay", "DANA", "Lainnya"],
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

// Compound indexing for fast daily queries and analytics
TransactionSchema.index({ userId: 1, date: -1 });
TransactionSchema.index({ userId: 1, category: 1 });
TransactionSchema.index({ userId: 1, type: 1 });

module.exports = mongoose.model("Transaction", TransactionSchema);
