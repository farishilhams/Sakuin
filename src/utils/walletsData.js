/**
 * Daftar Sumber Dana Lengkap Sakuin per Kategori
 * Dilengkapi warna brand aksen dan dukungan custom wallet
 */
export const walletCategories = [
   {
      category: "Tunai",
      color: "#10B981",
      items: [
         { name: "Tunai", color: "#10B981", type: "cash" },
      ],
   },
   {
      category: "Bank Konvensional",
      color: "#2563EB",
      items: [
         { name: "BCA", color: "#005EAA", type: "bank" },
         { name: "Mandiri", color: "#003876", type: "bank" },
         { name: "BNI", color: "#F15A22", type: "bank" },
         { name: "BRI", color: "#00529C", type: "bank" },
         { name: "CIMB Niaga", color: "#ED1B24", type: "bank" },
         { name: "Danamon", color: "#F58220", type: "bank" },
         { name: "Permata Bank", color: "#008853", type: "bank" },
         { name: "BTN", color: "#17479E", type: "bank" },
         { name: "Maybank Indonesia", color: "#FFD100", type: "bank" },
         { name: "OCBC NISP", color: "#ED1C24", type: "bank" },
         { name: "Panin Bank", color: "#006699", type: "bank" },
         { name: "BTPN", color: "#FF6600", type: "bank" },
         { name: "Bank Mega", color: "#F7931E", type: "bank" },
         { name: "Bank Sinarmas", color: "#ED1C24", type: "bank" },
      ],
   },
   {
      category: "Bank Syariah",
      color: "#059669",
      items: [
         { name: "Bank Syariah Indonesia BSI", color: "#00A39D", type: "bank" },
         { name: "Bank Muamalat", color: "#7B2382", type: "bank" },
      ],
   },
   {
      category: "Bank Digital",
      color: "#8B5CF6",
      items: [
         { name: "Bank Jago", color: "#FF7A00", type: "bank" },
         { name: "SeaBank", color: "#FF5722", type: "bank" },
         { name: "Bank Neo Commerce BNC", color: "#FFD000", type: "bank" },
         { name: "Allo Bank", color: "#FF3366", type: "bank" },
         { name: "Jenius", color: "#00A4E4", type: "bank" },
         { name: "LINE Bank", color: "#00C300", type: "bank" },
         { name: "Superbank", color: "#4F46E5", type: "bank" },
         { name: "Blu by BCA Digital", color: "#0066FF", type: "bank" },
      ],
   },
   {
      category: "E-Wallet",
      color: "#06B6D4",
      items: [
         { name: "GoPay", color: "#00AED6", type: "ewallet" },
         { name: "OVO", color: "#4C3494", type: "ewallet" },
         { name: "DANA", color: "#118EEA", type: "ewallet" },
         { name: "ShopeePay", color: "#EE4D2D", type: "ewallet" },
         { name: "LinkAja", color: "#ED1C24", type: "ewallet" },
         { name: "i.saku", color: "#005CAB", type: "ewallet" },
         { name: "Sakuku BCA", color: "#005EAA", type: "ewallet" },
         { name: "AstraPay", color: "#0A3977", type: "ewallet" },
         { name: "Flip", color: "#FA591D", type: "ewallet" },
      ],
   },
   {
      category: "QRIS",
      color: "#DC2626",
      items: [
         { name: "QRIS Universal", color: "#ED1C24", type: "other" },
      ],
   },
];

/**
 * Mengambil daftar seluruh nama sumber dana yang ada secara flat
 */
export const getAllWalletNames = () => {
   const customWallets = getCustomWallets().map((w) => w.name);
   const builtInWallets = walletCategories.flatMap((cat) =>
      cat.items.map((item) => item.name)
   );
   return [...new Set([...builtInWallets, ...customWallets])];
};

/**
 * Mengambil daftar dompet kustom buatan user dari localStorage
 */
export const getCustomWallets = () => {
   try {
      const stored = localStorage.getItem("sakuin_custom_wallets");
      return stored ? JSON.parse(stored) : [];
   } catch {
      return [];
   }
};

/**
 * Menyimpan dompet kustom baru buatan user ke localStorage
 */
export const saveCustomWallet = (wallet) => {
   const current = getCustomWallets();
   const exists = current.some(
      (w) => w.name.toLowerCase() === wallet.name.toLowerCase()
   );
   if (!exists) {
      const updated = [...current, wallet];
      localStorage.setItem("sakuin_custom_wallets", JSON.stringify(updated));
      return updated;
   }
   return current;
};

/**
 * Mendapatkan warna aksen untuk nama dompet tertentu
 */
export const getWalletColor = (walletName) => {
   if (!walletName) return "#10B981";
   for (const cat of walletCategories) {
      const found = cat.items.find((item) => item.name === walletName);
      if (found) return found.color;
   }
   const custom = getCustomWallets().find((w) => w.name === walletName);
   if (custom) return custom.color || "#10B981";
   return "#10B981";
};
