/**
 * Helper terstandarisasi untuk menyelesaikan URL foto avatar pengguna
 * Mendukung URL Google OAuth absolut, URL static backend (/uploads/...), blob URL preview, dan base64.
 */
export const getAvatarUrl = (avatar) => {
   if (!avatar || typeof avatar !== "string") return "";

   // Jika URL sudah merupakan URL absolut atau preview lokal browser
   if (
      avatar.startsWith("http://") ||
      avatar.startsWith("https://") ||
      avatar.startsWith("blob:") ||
      avatar.startsWith("data:")
   ) {
      return avatar;
   }

   // Jika merupakan path statis backend seperti /uploads/avatars/avatar-...
   const apiBase =
      import.meta.env.VITE_API_BASE_URL ||
      import.meta.env.VITE_PUBLIC_API_URL ||
      "http://localhost:5000/api";

   const serverOrigin = apiBase.replace(/\/api\/?$/, "");
   const normalizedPath = avatar.startsWith("/") ? avatar : `/${avatar}`;

   return `${serverOrigin}${normalizedPath}`;
};
