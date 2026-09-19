const User = require("../models/User");
const Budget = require("../models/Budget");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const register = async (req, res) => {
   try {
      const { name, email, password } = req.body;
      let user = await User.findOne({ email });
      if (user)
         return res.status(400).json({ message: "User sudah terdaftar" });

      user = new User({
         name,
         email,
         password,
         provider: "local",
      });
      await user.save();

      // Buat budget default
      const categories = [
         "Makanan",
         "Transportasi",
         "Hiburan",
         "Kesehatan",
         "Pendidikan",
         "Kebutuhan Pribadi",
      ];
      const budgetDocs = categories.map((cat) => ({
         userId: user._id,
         category: cat,
         budget: 0,
      }));
      await Budget.insertMany(budgetDocs);

      res.json({ message: "Register berhasil" });
   } catch (error) {
      res.status(500).json({ message: "Server error", error });
   }
};

const login = async (req, res) => {
   try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user || !(await user.comparePassword(password))) {
         return res.status(400).json({ message: "Email atau password salah" });
      }
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
         expiresIn: "7d",
      });
      res.json({
         token,
         user: {
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone || "",
            avatar: user.avatar || null,
            createdAt: user.createdAt,
         },
      });
   } catch (error) {
      res.status(500).json({ message: "Server error", error });
   }
};

const googleAuthCallback = (req, res) => {
   try {
      const user = req.user;
      if (!user) {
         return res.redirect(
            `${process.env.CLIENT_URL}/login?error=auth_failed`
         );
      }

      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
         expiresIn: "7d",
      });

      // Tambahkan timestamp untuk menghindari cache issues
      const timestamp = new Date().getTime();

      // Redirect ke frontend dengan token dan user data
      res.redirect(
         `${
            process.env.CLIENT_URL
         }/auth/google/success?token=${token}&user=${encodeURIComponent(
            JSON.stringify({
               id: user._id,
               name: user.name,
               email: user.email,
               phone: user.phone || "",
               avatar: user.avatar || null,
               createdAt: user.createdAt,
            })
         )}&t=${timestamp}`
      );
   } catch (error) {
      console.error("Google auth callback error:", error);
      res.redirect(
         `${
            process.env.CLIENT_URL
         }/login?error=auth_failed&msg=${encodeURIComponent(error.message)}`
      );
   }
};

// GET /api/auth/me
const getMe = async (req, res) => {
   try {
      const user = await User.findById(req.user.userId).select("-password -resetPasswordToken -resetPasswordExpires");
      if (!user) {
         return res.status(404).json({ message: "Pengguna tidak ditemukan" });
      }
      res.json({
         user: {
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone || "",
            avatar: user.avatar || null,
            createdAt: user.createdAt,
         },
      });
   } catch (error) {
      console.error("getMe error:", error);
      res.status(500).json({ message: "Gagal mengambil data profil", error: error.message });
   }
};

// PUT /api/auth/profile
const updateProfile = async (req, res) => {
   try {
      const { name, email, phone, avatar } = req.body;
      const user = await User.findById(req.user.userId);
      if (!user) {
         return res.status(404).json({ message: "Pengguna tidak ditemukan" });
      }

      if (name) user.name = name.trim();
      if (phone !== undefined) user.phone = phone.trim();
      if (avatar !== undefined) user.avatar = avatar;

      // Jika email diubah, cek keunikan
      if (email && email.toLowerCase() !== user.email) {
         const existingEmail = await User.findOne({ email: email.toLowerCase() });
         if (existingEmail && existingEmail._id.toString() !== user._id.toString()) {
            return res.status(400).json({ message: "Alamat email sudah digunakan oleh akun lain" });
         }
         user.email = email.toLowerCase().trim();
      }

      await user.save();

      res.json({
         message: "Profil akun berhasil diperbarui",
         user: {
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone || "",
            avatar: user.avatar || null,
            createdAt: user.createdAt,
         },
      });
   } catch (error) {
      console.error("updateProfile error:", error);
      res.status(500).json({ message: "Gagal memperbarui profil", error: error.message });
   }
};

// PUT /api/auth/change-password
const changePassword = async (req, res) => {
   try {
      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
         return res.status(400).json({ message: "Kata sandi saat ini dan kata sandi baru wajib diisi" });
      }

      if (newPassword.length < 6) {
         return res.status(400).json({ message: "Kata sandi baru minimal 6 karakter" });
      }

      const user = await User.findById(req.user.userId);
      if (!user) {
         return res.status(404).json({ message: "Pengguna tidak ditemukan" });
      }

      // Verifikasi kata sandi saat ini
      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
         return res.status(400).json({ message: "Kata sandi saat ini tidak sesuai" });
      }

      // Update kata sandi baru
      user.password = newPassword;
      await user.save();

      res.json({ message: "Kata sandi berhasil diubah. Silakan masuk kembali dengan kata sandi baru." });
   } catch (error) {
      console.error("changePassword error:", error);
      res.status(500).json({ message: "Gagal mengubah kata sandi", error: error.message });
   }
};

// POST /api/auth/forgot-password
const forgotPassword = async (req, res) => {
   try {
      const { email } = req.body;
      if (!email) {
         return res.status(400).json({ message: "Alamat email wajib diisi" });
      }

      const user = await User.findOne({ email: email.toLowerCase().trim() });

      // Generik respons untuk mencegah user enumeration (Security Best Practice)
      const genericMessage = "Jika alamat email terdaftar di Sakuin, instruksi dan tautan reset kata sandi telah dikirimkan.";

      if (user) {
         // Buat reset token
         const resetToken = crypto.randomBytes(32).toString("hex");
         user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
         user.resetPasswordExpires = Date.now() + 30 * 60 * 1000; // 30 menit
         await user.save();

         const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
         const resetUrl = `${clientUrl}/reset-password/${resetToken}`;

         // Log ke console untuk simulasi & verifikasi lokal instan
         console.log("===================================================================");
         console.log(`[PASSWORD RESET REQUEST]: ${user.email}`);
         console.log(`[RESET LINK]: ${resetUrl}`);
         console.log(`[VALID UNTIL]: 30 menit dari sekarang`);
         console.log("===================================================================");
      }

      res.json({ message: genericMessage });
   } catch (error) {
      console.error("forgotPassword error:", error);
      res.status(500).json({ message: "Gagal memproses permintaan reset kata sandi", error: error.message });
   }
};

// POST /api/auth/reset-password/:token
const resetPassword = async (req, res) => {
   try {
      const { token } = req.params;
      const { password } = req.body;

      if (!password || password.length < 6) {
         return res.status(400).json({ message: "Kata sandi baru minimal 6 karakter" });
      }

      const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

      const user = await User.findOne({
         resetPasswordToken: hashedToken,
         resetPasswordExpires: { $gt: Date.now() },
      });

      if (!user) {
         return res.status(400).json({ message: "Tautan reset kata sandi tidak valid atau telah kedaluwarsa" });
      }

      // Update password & bersihkan token
      user.password = password;
      user.resetPasswordToken = null;
      user.resetPasswordExpires = null;
      await user.save();

      res.json({ message: "Kata sandi berhasil diperbarui! Silakan masuk dengan kata sandi baru Anda." });
   } catch (error) {
      console.error("resetPassword error:", error);
      res.status(500).json({ message: "Gagal mereset kata sandi", error: error.message });
   }
};

// POST /api/auth/logout
const logout = async (req, res) => {
   try {
      if (req.logout) {
         req.logout((err) => {
            if (err) console.error("Passport logout error:", err);
         });
      }
      if (req.session) {
         req.session.destroy();
      }
      res.clearCookie("connect.sid");
      return res.status(200).json({ message: "Berhasil keluar dari akun Sakuin." });
   } catch (error) {
      console.error("logout error:", error);
      return res.status(200).json({ message: "Sesi telah dibersihkan." });
   }
};

module.exports = {
   register,
   login,
   logout,
   googleAuthCallback,
   getMe,
   updateProfile,
   changePassword,
   forgotPassword,
   resetPassword,
};
