const mongoose = require("mongoose");

/**
 * Koneksi Database MongoDB (Mongoose) untuk Platform Sakuin
 * Mendukung MongoDB Atlas (Cloud) maupun MongoDB Local (Laragon/Community Server)
 * Maintainer: Farish Ilham Syahrani (https://github.com/farishilhams)
 */
const connectDB = async () => {
   const mongoURI =
      process.env.MONGODB_URI ||
      process.env.MONGO_URI ||
      "mongodb://127.0.0.1:27017/sakuin";

   try {
      const conn = await mongoose.connect(mongoURI, {
         serverSelectionTimeoutMS: 8000,
         autoIndex: true,
      });

      console.log(`[MongoDB Connected]: ${conn.connection.host} (${conn.connection.name})`);

      // Pasang event listener untuk memonitor koneksi secara real-time
      mongoose.connection.on("error", (err) => {
         console.error(`[MongoDB Error]: ${err.message}`);
      });

      mongoose.connection.on("disconnected", () => {
         console.warn("[MongoDB Disconnected]: Koneksi terputus. Mencoba menghubungkan kembali...");
      });

      mongoose.connection.on("reconnected", () => {
         console.log("[MongoDB Reconnected]: Koneksi database berhasil dipulihkan.");
      });

      return conn;
   } catch (error) {
      console.error("===================================================================");
      console.error(`[MongoDB Connection Error]: ${error.message}`);
      console.error("-------------------------------------------------------------------");
      console.error("PANDUAN PENYEBAB & SOLUSI KONEKSI DATABASE:");
      console.error("1. JIKA MENGGUNAKAN MONGODB ATLAS:");
      console.error("   - Pastikan MONGODB_URI di berkas .env terisi dengan format valid:");
      console.error("     mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/sakuin?retryWrites=true&w=majority");
      console.error("   - Buka Network Access di MongoDB Atlas -> tambahkan IP Address 0.0.0.0/0 (Allow from Anywhere).");
      console.error("   - Pastikan username & password Database User sudah benar (bukan password akun login Atlas).");
      console.error("2. JIKA MENGGUNAKAN MONGODB LOKAL:");
      console.error("   - Pastikan service mongod sudah berjalan di port 27017.");
      console.error("   - Gunakan URI: mongodb://127.0.0.1:27017/sakuin");
      console.error("===================================================================");
      
      // Jika di development, log error tanpa mematikan proses node secara mendadak
      // agar developer tetap dapat melihat log dan memperbaiki .env
      if (process.env.NODE_ENV === "production") {
         process.exit(1);
      }
   }
};

module.exports = connectDB;