const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Pastikan folder uploads/avatars/ tersedia di sistem
const uploadDir = path.join(__dirname, "../uploads/avatars");
if (!fs.existsSync(uploadDir)) {
   fs.mkdirSync(uploadDir, { recursive: true });
}

// Konfigurasi disk storage untuk multer
const storage = multer.diskStorage({
   destination: (req, file, cb) => {
      cb(null, uploadDir);
   },
   filename: (req, file, cb) => {
      const userId = req.user?.userId || "user";
      const sanitizedExt = path.extname(file.originalname).toLowerCase();
      const uniqueName = `avatar-${userId}-${Date.now()}${sanitizedExt}`;
      cb(null, uniqueName);
   },
});

// Validasi MIME type awal
const fileFilter = (req, file, cb) => {
   const allowedMimes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
      "image/jpg",
   ];

   if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
   } else {
      cb(
         new Error(
            "Format file tidak didukung. Harap unggah foto dengan format JPG, JPEG, PNG, WebP, atau GIF."
         ),
         false
      );
   }
};

// Batasan ukuran: maksimal 5MB
const upload = multer({
   storage,
   limits: {
      fileSize: 5 * 1024 * 1024, // 5MB
   },
   fileFilter,
});

/**
 * Validasi Magic Bytes untuk memastikan file benar-benar gambar valid
 * (bukan file berbahaya yang diganti ekstensinya)
 */
const validateMagicBytes = (filePath) => {
   try {
      const buffer = Buffer.alloc(12);
      const fd = fs.openSync(filePath, "r");
      fs.readSync(fd, buffer, 0, 12, 0);
      fs.closeSync(fd);

      // Check JPEG: FF D8 FF
      if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
         return true;
      }

      // Check PNG: 89 50 4E 47 0D 0A 1A 0A
      if (
         buffer[0] === 0x89 &&
         buffer[1] === 0x50 &&
         buffer[2] === 0x4e &&
         buffer[3] === 0x47 &&
         buffer[4] === 0x0d &&
         buffer[5] === 0x0a &&
         buffer[6] === 0x1a &&
         buffer[7] === 0x0a
      ) {
         return true;
      }

      // Check GIF: GIF8 (47 49 46 38)
      if (
         buffer[0] === 0x47 &&
         buffer[1] === 0x49 &&
         buffer[2] === 0x46 &&
         buffer[3] === 0x38
      ) {
         return true;
      }

      // Check WebP: RIFF (52 49 46 46) ... WEBP (57 45 42 50)
      if (
         buffer[0] === 0x52 &&
         buffer[1] === 0x49 &&
         buffer[2] === 0x46 &&
         buffer[3] === 0x46 &&
         buffer[8] === 0x57 &&
         buffer[9] === 0x45 &&
         buffer[10] === 0x42 &&
         buffer[11] === 0x50
      ) {
         return true;
      }

      return false;
   } catch (error) {
      console.error("[Magic Bytes Check Error]:", error);
      return false;
   }
};

/**
 * Express middleware wrapper untuk penanganan error multer dan validasi magic bytes
 */
const handleAvatarUpload = (req, res, next) => {
   const uploadSingle = upload.single("avatar");

   uploadSingle(req, res, (err) => {
      if (err instanceof multer.MulterError) {
         if (err.code === "LIMIT_FILE_SIZE") {
            return res.status(400).json({
               message: "Ukuran file terlalu besar. Maksimal ukuran foto profil adalah 5MB.",
            });
         }
         return res.status(400).json({
            message: `Kesalahan upload: ${err.message}`,
         });
      } else if (err) {
         return res.status(400).json({
            message: err.message || "Gagal memproses unggahan file.",
         });
      }

      // Jika ada file yang diunggah, lakukan verifikasi magic bytes
      if (req.file) {
         const isValid = validateMagicBytes(req.file.path);
         if (!isValid) {
            // Hapus file palsu dari disk
            try {
               fs.unlinkSync(req.file.path);
            } catch (unlinkErr) {
               console.error("Gagal menghapus file invalid:", unlinkErr);
            }

            return res.status(400).json({
               message:
                  "Format berkas tidak valid. Berkas bukan merupakan gambar asli (JPEG, PNG, WebP, atau GIF).",
            });
         }
      }

      next();
   });
};

module.exports = {
   handleAvatarUpload,
   validateMagicBytes,
};
