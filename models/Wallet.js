const mongoose = require("mongoose");

const WalletSchema = new mongoose.Schema(
   {
      userId: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User",
         required: [true, "User ID wajib diisi"],
         index: true,
      },
      name: {
         type: String,
         required: [true, "Nama dompet atau rekening wajib diisi"],
         trim: true,
      },
      type: {
         type: String,
         enum: ["cash", "bank", "ewallet", "other"],
         default: "cash",
      },
      balance: {
         type: Number,
         default: 0,
         min: [0, "Saldo tidak boleh negatif"],
      },
      accountNumber: {
         type: String,
         trim: true,
         default: "",
      },
      color: {
         type: String,
         default: "#10B981",
      },
      icon: {
         type: String,
         default: "Wallet",
      },
      isDefault: {
         type: Boolean,
         default: false,
      },
   },
   {
      timestamps: true,
   }
);

// Compound Index: Satu pengguna tidak boleh memiliki dua dompet dengan nama yang sama persis
WalletSchema.index({ userId: 1, name: 1 });

module.exports = mongoose.model("Wallet", WalletSchema);
