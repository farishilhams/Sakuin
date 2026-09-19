const mongoose = require("mongoose");

const BudgetSchema = new mongoose.Schema(
   {
      userId: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User",
         required: [true, "User ID wajib diisi"],
         index: true,
      },
      category: {
         type: String,
         enum: {
            values: [
               "Makanan",
               "Transportasi",
               "Hiburan",
               "Kesehatan",
               "Pendidikan",
               "Kebutuhan Pribadi",
            ],
            message: "Kategori {VALUE} tidak valid",
         },
         required: [true, "Kategori anggaran wajib diisi"],
      },
      budget: {
         type: Number,
         required: [true, "Nominal batas anggaran wajib diisi"],
         min: [0, "Batas anggaran tidak boleh negatif"],
      },
   },
   {
      timestamps: true,
   }
);

// Compound Index: Satu user hanya memiliki satu limit anggaran per kategori
BudgetSchema.index({ userId: 1, category: 1 }, { unique: true });

module.exports = mongoose.model("Budget", BudgetSchema);
