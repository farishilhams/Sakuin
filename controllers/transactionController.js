const Transaction = require("../models/Transaction");

const getTransactions = async (req, res) => {
   try {
      const transactions = await Transaction.find({
         userId: req.user.userId,
      }).sort({ date: -1 });
      res.json(transactions);
   } catch (error) {
      console.error("Error fetching transactions:", error);
      res.status(500).json({ message: "Server error", error: error.message });
   }
};

const createTransaction = async (req, res) => {
   try {
      const { name, category, amount, date, type, wallet, notes, receiptUrl } = req.body;

      if (!name || amount === undefined || amount === null) {
         return res.status(400).json({ message: "Nama transaksi dan nominal wajib diisi" });
      }

      const newTransaction = new Transaction({
         userId: req.user.userId,
         name: name.trim(),
         category: category || "Makanan",
         amount: Number(amount),
         date: date ? new Date(date) : new Date(),
         type: type || "expense",
         wallet: wallet || "Tunai",
         notes: notes ? notes.trim() : "",
         receiptUrl: receiptUrl || "",
      });

      await newTransaction.save();
      res.status(201).json({
         message: "Transaksi berhasil dicatat",
         transaction: newTransaction,
      });
   } catch (error) {
      console.error("Error creating transaction:", error);
      res.status(500).json({ message: "Server error", error: error.message });
   }
};

const updateTransaction = async (req, res) => {
   try {
      const { id } = req.params;
      const { name, category, amount, date, type, wallet, notes, receiptUrl } = req.body;

      const updateFields = {};
      if (name) updateFields.name = name.trim();
      if (category) updateFields.category = category;
      if (amount !== undefined) updateFields.amount = Number(amount);
      if (date) updateFields.date = new Date(date);
      if (type) updateFields.type = type;
      if (wallet) updateFields.wallet = wallet;
      if (notes !== undefined) updateFields.notes = notes.trim();
      if (receiptUrl !== undefined) updateFields.receiptUrl = receiptUrl;

      const updatedTransaction = await Transaction.findOneAndUpdate(
         { _id: id, userId: req.user.userId },
         updateFields,
         { new: true }
      );

      if (!updatedTransaction) {
         return res.status(404).json({ message: "Transaksi tidak ditemukan" });
      }

      res.json({
         message: "Transaksi berhasil diperbarui",
         transaction: updatedTransaction,
      });
   } catch (error) {
      console.error("Error updating transaction:", error);
      res.status(500).json({ message: "Server error", error: error.message });
   }
};

const deleteTransaction = async (req, res) => {
   try {
      const { id } = req.params;
      const deleted = await Transaction.findOneAndDelete({
         _id: id,
         userId: req.user.userId,
      });

      if (!deleted) {
         return res.status(404).json({ message: "Transaksi tidak ditemukan" });
      }

      res.json({ message: "Transaksi berhasil dihapus" });
   } catch (error) {
      console.error("Error deleting transaction:", error);
      res.status(500).json({ message: "Server error", error: error.message });
   }
};

module.exports = {
   getTransactions,
   createTransaction,
   updateTransaction,
   deleteTransaction,
};
