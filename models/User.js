const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
   {
      name: {
         type: String,
         required: [true, "Nama lengkap wajib diisi"],
         trim: true,
      },
      email: {
         type: String,
         required: [true, "Alamat email wajib diisi"],
         unique: true,
         trim: true,
         lowercase: true,
         match: [/^\S+@\S+\.\S+$/, "Format alamat email tidak valid"],
      },
      password: {
         type: String,
         minlength: [6, "Kata sandi minimal 6 karakter"],
      },
      googleId: {
         type: String,
         default: null,
      },
      avatar: {
         type: String,
         default: null,
      },
      provider: {
         type: String,
         enum: ["local", "google"],
         default: "local",
      },
   },
   {
      timestamps: true,
   }
);

// Sebelum simpan, hash password jika password ada dan diubah
UserSchema.pre("save", async function (next) {
   if (!this.isModified("password") || !this.password) return next();
   try {
      this.password = await bcrypt.hash(this.password, 10);
      next();
   } catch (err) {
      next(err);
   }
});

// Verifikasi password candidate
UserSchema.methods.comparePassword = async function (candidatePassword) {
   if (!this.password) return false;
   return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);
