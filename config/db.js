const mongoose = require("mongoose");

/**
 * Koneksi Database MongoDB (Mongoose) untuk Platform Sakuin
 * Menggunakan pola caching koneksi yang aman untuk Vercel Serverless Functions
 * maupun server konvensional (Express / nodemon).
 * Maintainer: Farish Ilham Syahrani (https://github.com/farishilhams)
 */
let cachedConnection = null;

const connectDB = async () => {
   // Jika koneksi sudah aktif (readyState 1 = connected, 2 = connecting), gunakan kembali
   if (cachedConnection && mongoose.connection.readyState >= 1) {
      return cachedConnection;
   }

   const mongoURI =
      process.env.MONGODB_URI ||
      process.env.MONGO_URI ||
      "mongodb://127.0.0.1:27017/sakuin";

   try {
      const conn = await mongoose.connect(mongoURI, {
         serverSelectionTimeoutMS: 8000,
         autoIndex: true,
      });

      cachedConnection = conn;
      console.log(`[MongoDB Connected]: ${conn.connection.host} (${conn.connection.name})`);

      // Event listener status koneksi
      mongoose.connection.on("error", (err) => {
         console.error(`[MongoDB Error]: ${err.message}`);
      });

      mongoose.connection.on("disconnected", () => {
         console.warn("[MongoDB Disconnected]: Koneksi terputus.");
         cachedConnection = null;
      });

      return conn;
   } catch (error) {
      console.error("===================================================================");
      console.error(`[MongoDB Connection Error]: ${error.message}`);
      console.error("-------------------------------------------------------------------");
      console.error("PANDUAN KONEKSI DATABASE:");
      console.error("1. MONGODB ATLAS:");
      console.error("   - Pastikan MONGODB_URI diatur di Vercel Dashboard / .env.");
      console.error("   - Pastikan IP 0.0.0.0/0 sudah terdaftar di Network Access Atlas.");
      console.error("2. MONGODB LOKAL:");
      console.error("   - Pastikan mongod berjalan pada port 27017.");
      console.error("===================================================================");

      // Jangan mematikan proses via exit(1) agar Vercel Serverless Function tidak crash seketika
      throw error;
   }
};

module.exports = connectDB;