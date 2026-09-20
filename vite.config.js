import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
   resolve: {
      alias: {
         "@": path.resolve(__dirname, "./src"),
      },
   },
   plugins: [
      react(),
      tailwindcss(),
      VitePWA({
         registerType: "autoUpdate",
         includeAssets: [
            "favicon.ico",
            "apple-touch-icon.png",
            "masked-icon.svg",
         ],
         manifest: {
            name: "Sakuin — Smart Personal Finance & Quick Expense Tracker",
            short_name: "Sakuin",
            description: "Catat pengeluaran sat-set, alokasikan anggaran bulanan, dan kelola uang saku pribadi secara cerdas.",
            theme_color: "#10B981",
            background_color: "#F8FAFC",
            display: "standalone",
            orientation: "portrait",
            icons: [
               {
                  src: "icon.svg",
                  sizes: "192x192",
                  type: "image/svg+xml",
               },
               {
                  src: "icon-192.png",
                  sizes: "192x192",
                  type: "image/png",
               },
               {
                  src: "icon.svg",
                  sizes: "512x512",
                  type: "image/svg+xml",
               },
               {
                  src: "icon-512.png",
                  sizes: "512x512",
                  type: "image/png",
                  purpose: "any maskable", 
               },
            ],
         },
      }),
   ],
   build: {
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
         output: {
            manualChunks: {
               vendor: ["react", "react-dom", "react-router-dom"],
               motion: ["framer-motion"],
               icons: ["lucide-react"],
               pdf: ["jspdf", "jspdf-autotable"],
            },
         },
      },
   },
});
