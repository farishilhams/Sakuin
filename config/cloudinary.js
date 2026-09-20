const cloudinary = require("cloudinary").v2;

/**
 * Konfigurasi Cloudinary & Serverless Image Storage Adapter
 * Mendukung Cloudinary Cloud Storage maupun fallback Data URI murni in-memory
 * Maintainer: Farish Ilham Syahrani (https://github.com/farishilhams)
 */
const isCloudinaryConfigured = Boolean(
   (process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET) ||
      process.env.CLOUDINARY_URL
);

if (isCloudinaryConfigured) {
   if (process.env.CLOUDINARY_URL) {
      cloudinary.config();
   } else {
      cloudinary.config({
         cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
         api_key: process.env.CLOUDINARY_API_KEY,
         api_secret: process.env.CLOUDINARY_API_SECRET,
         secure: true,
      });
   }
}

/**
 * Upload buffer gambar ke Cloudinary atau fallback ke Base64 Data URI
 * @param {Buffer} buffer - File buffer dari multer memoryStorage
 * @param {string} mimetype - MIME type gambar (misal: image/jpeg, image/png)
 * @param {string} folder - Folder target pada Cloudinary
 * @returns {Promise<string>} - Mengembalikan URL HTTPS publik atau Data URI base64
 */
const uploadBufferToStorage = async (
   buffer,
   mimetype = "image/jpeg",
   folder = "sakuin_avatars"
) => {
   if (isCloudinaryConfigured) {
      return new Promise((resolve, reject) => {
         const uploadStream = cloudinary.uploader.upload_stream(
            {
               folder,
               resource_type: "image",
               transformation: [
                  { width: 400, height: 400, crop: "fill", gravity: "face", quality: "auto" },
               ],
            },
            (error, result) => {
               if (error) {
                  console.error("[Cloudinary Upload Error]:", error);
                  return reject(error);
               }
               resolve(result.secure_url);
            }
         );
         uploadStream.end(buffer);
      });
   }

   // Fallback ramah Vercel Serverless: Konversi buffer in-memory ke Data URI base64
   const base64Data = buffer.toString("base64");
   return `data:${mimetype};base64,${base64Data}`;
};

module.exports = {
   cloudinary,
   isCloudinaryConfigured,
   uploadBufferToStorage,
};
