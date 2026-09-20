import React, { useState, useContext, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../utils/api";
import toast from "react-hot-toast";
import Header from "../components/Header";
import { getAvatarUrl } from "../utils/avatarHelper";
import {
   User,
   Mail,
   Phone,
   Lock,
   Camera,
   ShieldCheck,
   KeyRound,
   LogOut,
   Check,
   Loader2,
   Eye,
   EyeOff,
   ArrowLeft,
   Calendar,
   UploadCloud,
   Trash2,
   Image as ImageIcon,
} from "lucide-react";
import { motion } from "framer-motion";

export default function ProfilePage() {
   const { user, logout, updateUser } = useContext(AuthContext);
   const navigate = useNavigate();

   const fileInputRef = useRef(null);

   // Profile form states
   const [profileData, setProfileData] = useState({
      name: "",
      email: "",
      phone: "",
      avatar: "",
   });
   const [avatarFile, setAvatarFile] = useState(null);
   const [avatarPreview, setAvatarPreview] = useState("");
   const [uploadingAvatar, setUploadingAvatar] = useState(false);
   const [savingProfile, setSavingProfile] = useState(false);
   const [profileErrors, setProfileErrors] = useState({});

   // Password change states
   const [passwordData, setPasswordData] = useState({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
   });
   const [showCurrentPassword, setShowCurrentPassword] = useState(false);
   const [showNewPassword, setShowNewPassword] = useState(false);
   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
   const [savingPassword, setSavingPassword] = useState(false);
   const [passwordErrors, setPasswordErrors] = useState({});

   const handleLogout = async () => {
      toast.success("Berhasil keluar dari akun.");
      await logout();
   };

   useEffect(() => {
      if (user) {
         setProfileData({
            name: user.name || "",
            email: user.email || "",
            phone: user.phone || "",
            avatar: user.avatar || "",
         });
      }
   }, [user]);

   const initials = profileData.name
      ? profileData.name
           .split(" ")
           .map((n) => n[0])
           .slice(0, 2)
           .join("")
           .toUpperCase()
      : "U";

   // Handler saat file foto dipilih
   const handleFileChange = (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // Validasi ukuran: maksimal 5MB
      if (file.size > 5 * 1024 * 1024) {
         toast.error("Ukuran berkas terlalu besar. Maksimal 5MB.");
         return;
      }

      // Validasi tipe file gambar
      if (!file.type.startsWith("image/")) {
         toast.error("Format berkas harus berupa gambar (JPG, PNG, WebP, GIF).");
         return;
      }

      setAvatarFile(file);

      // Instant preview lokal dengan createObjectURL
      const objectUrl = URL.createObjectURL(file);
      setAvatarPreview(objectUrl);
      toast.success("Foto profil dipilih. Klik 'Unggah Sekarang' atau simpan form untuk memperbarui.");
   };

   // Unggah langsung avatar terpisah
   const handleDirectUploadAvatar = async () => {
      if (!avatarFile) {
         fileInputRef.current?.click();
         return;
      }

      const formData = new FormData();
      formData.append("avatar", avatarFile);

      setUploadingAvatar(true);
      const toastId = toast.loading("Mengunggah foto profil...");

      try {
         const res = await api.post("/auth/upload-avatar", formData, {
            headers: {
               "Content-Type": "multipart/form-data",
            },
         });

         const newAvatarUrl = res.data.avatarUrl;
         setProfileData((prev) => ({ ...prev, avatar: newAvatarUrl }));
         setAvatarFile(null);
         if (avatarPreview) {
            URL.revokeObjectURL(avatarPreview);
            setAvatarPreview("");
         }

         if (updateUser) {
            updateUser(res.data.user);
         }

         toast.success("Foto profil berhasil diperbarui!", { id: toastId });
      } catch (err) {
         console.error("Upload avatar error:", err);
         toast.error(err.response?.data?.message || "Gagal mengunggah foto profil", { id: toastId });
      } finally {
         setUploadingAvatar(false);
      }
   };

   // Hapus foto profil
   const handleRemoveAvatar = async () => {
      setSavingProfile(true);
      try {
         const res = await api.put("/auth/profile", {
            name: profileData.name.trim(),
            email: profileData.email.trim(),
            phone: profileData.phone.trim(),
            avatar: "",
         });

         setProfileData((prev) => ({ ...prev, avatar: "" }));
         setAvatarFile(null);
         if (avatarPreview) {
            URL.revokeObjectURL(avatarPreview);
            setAvatarPreview("");
         }

         if (updateUser) {
            updateUser(res.data.user);
         }

         toast.success("Foto profil berhasil dihapus.");
      } catch (err) {
         console.error("Hapus avatar error:", err);
         toast.error("Gagal menghapus foto profil");
      } finally {
         setSavingProfile(false);
      }
   };

   // Handle Edit Profile Submit
   const handleProfileSubmit = async (e) => {
      e.preventDefault();
      const errors = {};

      if (!profileData.name.trim()) {
         errors.name = "Nama lengkap wajib diisi";
      }
      if (!profileData.email.trim()) {
         errors.email = "Alamat email wajib diisi";
      }

      if (Object.keys(errors).length > 0) {
         setProfileErrors(errors);
         return;
      }

      setSavingProfile(true);
      setProfileErrors({});

      try {
         let res;

         // Jika user melampirkan berkas foto baru, kirim via multipart/form-data FormData
         if (avatarFile) {
            const formData = new FormData();
            formData.append("name", profileData.name.trim());
            formData.append("email", profileData.email.trim());
            formData.append("phone", profileData.phone.trim());
            formData.append("avatar", avatarFile);

            res = await api.put("/auth/profile", formData, {
               headers: {
                  "Content-Type": "multipart/form-data",
               },
            });

            setAvatarFile(null);
            if (avatarPreview) {
               URL.revokeObjectURL(avatarPreview);
               setAvatarPreview("");
            }
         } else {
            // Pengiriman data teks biasa jika tidak ada file baru
            res = await api.put("/auth/profile", {
               name: profileData.name.trim(),
               email: profileData.email.trim(),
               phone: profileData.phone.trim(),
               avatar: profileData.avatar.trim(),
            });
         }

         if (updateUser) {
            updateUser(res.data.user);
         } else {
            const stored = localStorage.getItem("user");
            if (stored) {
               const parsed = JSON.parse(stored);
               localStorage.setItem("user", JSON.stringify({ ...parsed, ...res.data.user }));
            }
         }

         setProfileData((prev) => ({ ...prev, avatar: res.data.user?.avatar || "" }));
         toast.success("Profil akun berhasil diperbarui!");
      } catch (err) {
         console.error("Update profile error:", err);
         toast.error(err.response?.data?.message || "Gagal memperbarui profil");
      } finally {
         setSavingProfile(false);
      }
   };

   // Handle Change Password Submit
   const handlePasswordSubmit = async (e) => {
      e.preventDefault();
      const errors = {};

      if (!passwordData.currentPassword) {
         errors.currentPassword = "Kata sandi saat ini wajib diisi";
      }
      if (!passwordData.newPassword) {
         errors.newPassword = "Kata sandi baru wajib diisi";
      } else if (passwordData.newPassword.length < 6) {
         errors.newPassword = "Kata sandi baru minimal 6 karakter";
      }
      if (passwordData.newPassword !== passwordData.confirmPassword) {
         errors.confirmPassword = "Konfirmasi kata sandi tidak cocok";
      }

      if (Object.keys(errors).length > 0) {
         setPasswordErrors(errors);
         return;
      }

      setSavingPassword(true);
      setPasswordErrors({});

      try {
         const res = await api.put("/auth/change-password", {
            currentPassword: passwordData.currentPassword,
            newPassword: passwordData.newPassword,
         });

         toast.success(res.data.message || "Kata sandi berhasil diubah. Silakan masuk kembali.");
         setPasswordData({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
         });

         // Invalidate session and prompt re-login after 2 seconds
         setTimeout(() => {
            logout();
            navigate("/login");
         }, 1800);
      } catch (err) {
         console.error("Change password error:", err);
         toast.error(err.response?.data?.message || "Gagal mengubah kata sandi");
      } finally {
         setSavingPassword(false);
      }
   };

   return (
      <div className="min-h-screen bg-transparent flex flex-col justify-between transition-colors">
         <div>
            {/* Hidden native file input for profile photo upload */}
            <input
               ref={fileInputRef}
               type="file"
               accept="image/jpeg,image/png,image/webp,image/gif,image/jpg"
               onChange={handleFileChange}
               className="hidden"
            />

            {/* Header Navbar */}
            <Header onOpenHistory={() => navigate("/?history=true")} />

            {/* Main Content Area */}
            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
               {/* Breadcrumb / Back button */}
               <div className="flex items-center justify-between">
                  <button
                     type="button"
                     onClick={() => navigate(-1)}
                     className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] transition-colors cursor-pointer"
                  >
                     <ArrowLeft size={16} />
                     <span>Kembali</span>
                  </button>

                  <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 flex items-center gap-1.5">
                     <ShieldCheck size={14} />
                     <span>Akun Terlindungi</span>
                  </span>
               </div>

               {/* Profile Hero Card */}
               <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
                     {/* Avatar container with instant camera trigger */}
                     <div className="relative group shrink-0">
                        {avatarPreview || profileData.avatar ? (
                           <img
                              src={getAvatarUrl(avatarPreview || profileData.avatar)}
                              alt={profileData.name}
                              className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover border-2 border-emerald-500/30 shadow-md"
                              onError={(e) => {
                                 e.target.onerror = null;
                                 setProfileData((prev) => ({ ...prev, avatar: "" }));
                              }}
                           />
                        ) : (
                           <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-extrabold text-2xl sm:text-3xl shadow-md">
                              {initials}
                           </div>
                        )}

                        {/* Quick Camera Trigger Button */}
                        <button
                           type="button"
                           onClick={() => fileInputRef.current?.click()}
                           disabled={uploadingAvatar}
                           className="absolute -bottom-1 -right-1 w-8 h-8 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-md flex items-center justify-center border-2 border-[var(--color-surface)] cursor-pointer transition-all hover:scale-105"
                           title="Ubah Foto Profil"
                           aria-label="Pilih foto profil baru"
                        >
                           {uploadingAvatar ? (
                              <Loader2 size={14} className="animate-spin" />
                           ) : (
                              <Camera size={14} />
                           )}
                        </button>
                     </div>

                     {/* Info */}
                     <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
                           <h1 className="text-xl sm:text-2xl font-extrabold text-[var(--color-ink)] truncate">
                              {profileData.name || "Pengguna Sakuin"}
                           </h1>
                           <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                              {user?.provider === "google" ? "Google Akun" : "Akun Terverifikasi"}
                           </span>
                        </div>

                        <p className="text-xs text-[var(--color-ink-muted)] mb-3 flex items-center justify-center sm:justify-start gap-1.5">
                           <Mail size={13} className="shrink-0" />
                           <span className="truncate">{profileData.email}</span>
                        </p>

                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-[11px] text-[var(--color-ink-muted)] pt-2 border-t border-[var(--color-border)]">
                           <span className="flex items-center gap-1.5">
                              <Calendar size={13} className="text-emerald-500" />
                              <span>
                                 Bergabung:{" "}
                                 {user?.createdAt
                                    ? new Date(user.createdAt).toLocaleDateString("id-ID", {
                                         month: "long",
                                         year: "numeric",
                                      })
                                    : "2026"}
                              </span>
                           </span>
                        </div>
                     </div>

                     {/* Logout Button */}
                     <div className="shrink-0 pt-2 sm:pt-0">
                        <button
                           type="button"
                           onClick={handleLogout}
                           className="px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                           <LogOut size={14} />
                           <span>Keluar Akun</span>
                        </button>
                     </div>
                  </div>
               </div>

               {/* Split Columns: Edit Profile & Change Password */}
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Card 1: Form Edit Profil */}
                  <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl p-6 sm:p-7 shadow-xs">
                     <div className="flex items-center gap-2.5 pb-4 mb-5 border-b border-[var(--color-border)]">
                        <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                           <User size={20} className="stroke-[2.2]" />
                        </div>
                        <div>
                           <h2 className="font-bold text-base text-[var(--color-ink)]">
                              Informasi Akun
                           </h2>
                           <p className="text-xs text-[var(--color-ink-muted)]">
                              Perbarui informasi identitas profil pengguna Anda
                           </p>
                        </div>
                     </div>

                     <form onSubmit={handleProfileSubmit} className="space-y-4">
                        <div>
                           <label className="block mb-1.5 text-xs font-semibold text-[var(--color-ink)]">
                              Nama Lengkap
                           </label>
                           <input
                              type="text"
                              value={profileData.name}
                              onChange={(e) => {
                                 setProfileData({ ...profileData, name: e.target.value });
                                 if (profileErrors.name) setProfileErrors({ ...profileErrors, name: "" });
                              }}
                              placeholder="Masukkan nama lengkap"
                              className="w-full border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-ink)] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
                              required
                           />
                           {profileErrors.name && (
                              <p className="text-[11px] text-rose-500 mt-1 font-medium">{profileErrors.name}</p>
                           )}
                        </div>

                        <div>
                           <label className="block mb-1.5 text-xs font-semibold text-[var(--color-ink)]">
                              Alamat Email
                           </label>
                           <input
                              type="email"
                              value={profileData.email}
                              onChange={(e) => {
                                 setProfileData({ ...profileData, email: e.target.value });
                                 if (profileErrors.email) setProfileErrors({ ...profileErrors, email: "" });
                              }}
                              placeholder="Masukkan alamat email"
                              className="w-full border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-ink)] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
                              required
                           />
                           {profileErrors.email && (
                              <p className="text-[11px] text-rose-500 mt-1 font-medium">{profileErrors.email}</p>
                           )}
                        </div>

                        <div>
                           <div className="flex items-center justify-between mb-1.5">
                              <label className="text-xs font-semibold text-[var(--color-ink)]">
                                 Nomor Telepon
                              </label>
                              <span className="text-[10px] font-semibold text-[var(--color-ink-muted)] bg-[var(--color-bg)] px-2 py-0.5 rounded-md border border-[var(--color-border)]">
                                 Opsional
                              </span>
                           </div>
                           <input
                              type="tel"
                              value={profileData.phone}
                              onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                              placeholder="Masukkan nomor telepon aktif"
                              className="w-full border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-ink)] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
                           />
                        </div>

                        {/* Unggah Foto Profil (Multipart File Upload & Preview) */}
                        <div className="pt-1">
                           <div className="flex items-center justify-between mb-2">
                              <label className="text-xs font-semibold text-[var(--color-ink)] flex items-center gap-1.5">
                                 <ImageIcon size={14} className="text-emerald-500" />
                                 <span>Foto Profil Pengguna</span>
                              </label>
                              <span className="text-[10px] font-semibold text-[var(--color-ink-muted)] bg-[var(--color-bg)] px-2 py-0.5 rounded-md border border-[var(--color-border)]">
                                 Maks 5MB
                              </span>
                           </div>

                           <div className="border border-[var(--color-border)] rounded-2xl p-4 bg-[var(--color-bg)] transition-all">
                              <div className="flex flex-col sm:flex-row items-center gap-4">
                                 {/* Mini Thumbnail Preview */}
                                 <div className="relative shrink-0">
                                    {avatarPreview || profileData.avatar ? (
                                       <img
                                          src={getAvatarUrl(avatarPreview || profileData.avatar)}
                                          alt="Preview Avatar"
                                          className="w-14 h-14 rounded-2xl object-cover border border-emerald-500/30 shadow-xs"
                                       />
                                    ) : (
                                       <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-bold text-lg shadow-xs">
                                          {initials}
                                       </div>
                                    )}
                                    {uploadingAvatar && (
                                       <div className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center text-white">
                                          <Loader2 size={18} className="animate-spin" />
                                       </div>
                                    )}
                                 </div>

                                 {/* Action Buttons & File Status */}
                                 <div className="flex-1 text-center sm:text-left space-y-2">
                                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                                       <button
                                          type="button"
                                          onClick={() => fileInputRef.current?.click()}
                                          disabled={uploadingAvatar}
                                          className="px-3.5 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                                       >
                                          <UploadCloud size={14} />
                                          <span>{avatarFile ? "Ganti Berkas" : "Pilih Berkas Foto"}</span>
                                       </button>

                                       {avatarFile && (
                                          <button
                                             type="button"
                                             onClick={handleDirectUploadAvatar}
                                             disabled={uploadingAvatar}
                                             className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs disabled:opacity-50"
                                          >
                                             {uploadingAvatar ? (
                                                <>
                                                   <Loader2 size={13} className="animate-spin" />
                                                   <span>Mengunggah...</span>
                                                </>
                                             ) : (
                                                <>
                                                   <Check size={13} />
                                                   <span>Unggah Sekarang</span>
                                                </>
                                             )}
                                          </button>
                                       )}

                                       {(profileData.avatar || avatarFile) && (
                                          <button
                                             type="button"
                                             onClick={handleRemoveAvatar}
                                             disabled={uploadingAvatar || savingProfile}
                                             className="px-3 py-1.5 rounded-xl text-rose-500 hover:bg-rose-500/10 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                                             title="Hapus foto profil saat ini"
                                          >
                                             <Trash2 size={13} />
                                             <span>Hapus</span>
                                          </button>
                                       )}
                                    </div>

                                    <p className="text-[11px] text-[var(--color-ink-muted)]">
                                       {avatarFile
                                          ? `Berkas: ${avatarFile.name} (${(avatarFile.size / 1024).toFixed(0)} KB)`
                                          : "Format didukung: JPG, PNG, WebP, GIF. Maksimal ukuran 5MB."}
                                    </p>
                                 </div>
                              </div>
                           </div>
                        </div>

                        <div className="pt-2">
                           <motion.button
                              whileHover={{ scale: 1.01 }}
                              whileTap={{ scale: 0.99 }}
                              type="submit"
                              disabled={savingProfile}
                              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs tracking-wide shadow-xs disabled:opacity-50 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                           >
                              {savingProfile ? (
                                 <>
                                    <Loader2 size={15} className="animate-spin" />
                                    <span>Menyimpan Perubahan...</span>
                                 </>
                              ) : (
                                 <>
                                    <Check size={15} className="stroke-[2.5]" />
                                    <span>Simpan Informasi Profil</span>
                                 </>
                              )}
                           </motion.button>
                        </div>
                     </form>
                  </div>

                  {/* Card 2: Form Ubah Kata Sandi */}
                  <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl p-6 sm:p-7 shadow-xs">
                     <div className="flex items-center gap-2.5 pb-4 mb-5 border-b border-[var(--color-border)]">
                        <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                           <KeyRound size={20} className="stroke-[2.2]" />
                        </div>
                        <div>
                           <h2 className="font-bold text-base text-[var(--color-ink)]">
                              Ubah Kata Sandi
                           </h2>
                           <p className="text-xs text-[var(--color-ink-muted)]">
                              Perbarui kata sandi akun secara berkala demi keamanan
                           </p>
                        </div>
                     </div>

                     <form onSubmit={handlePasswordSubmit} className="space-y-4">
                        <div>
                           <label className="block mb-1.5 text-xs font-semibold text-[var(--color-ink)]">
                              Kata Sandi Saat Ini
                           </label>
                           <div className="relative">
                              <input
                                 type={showCurrentPassword ? "text" : "password"}
                                 value={passwordData.currentPassword}
                                 onChange={(e) => {
                                    setPasswordData({ ...passwordData, currentPassword: e.target.value });
                                    if (passwordErrors.currentPassword) setPasswordErrors({ ...passwordErrors, currentPassword: "" });
                                 }}
                                 placeholder="Masukkan kata sandi saat ini"
                                 className="w-full border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-ink)] rounded-xl pl-3.5 pr-11 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
                                 required
                              />
                              <button
                                 type="button"
                                 onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                 className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] p-1 rounded-lg transition-colors cursor-pointer"
                                 aria-label={showCurrentPassword ? "Sembunyikan kata sandi" : "Lihat kata sandi"}
                              >
                                 {showCurrentPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                              </button>
                           </div>
                           {passwordErrors.currentPassword && (
                              <p className="text-[11px] text-rose-500 mt-1 font-medium">{passwordErrors.currentPassword}</p>
                           )}
                        </div>

                        <div>
                           <label className="block mb-1.5 text-xs font-semibold text-[var(--color-ink)]">
                              Kata Sandi Baru
                           </label>
                           <div className="relative">
                              <input
                                 type={showNewPassword ? "text" : "password"}
                                 value={passwordData.newPassword}
                                 onChange={(e) => {
                                    setPasswordData({ ...passwordData, newPassword: e.target.value });
                                    if (passwordErrors.newPassword) setPasswordErrors({ ...passwordErrors, newPassword: "" });
                                 }}
                                 placeholder="Masukkan kata sandi baru"
                                 className="w-full border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-ink)] rounded-xl pl-3.5 pr-11 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
                                 required
                                 minLength={6}
                              />
                              <button
                                 type="button"
                                 onClick={() => setShowNewPassword(!showNewPassword)}
                                 className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] p-1 rounded-lg transition-colors cursor-pointer"
                                 aria-label={showNewPassword ? "Sembunyikan kata sandi baru" : "Lihat kata sandi baru"}
                              >
                                 {showNewPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                              </button>
                           </div>
                           {passwordErrors.newPassword && (
                              <p className="text-[11px] text-rose-500 mt-1 font-medium">{passwordErrors.newPassword}</p>
                           )}
                        </div>

                        <div>
                           <label className="block mb-1.5 text-xs font-semibold text-[var(--color-ink)]">
                              Konfirmasi Kata Sandi Baru
                           </label>
                           <div className="relative">
                              <input
                                 type={showConfirmPassword ? "text" : "password"}
                                 value={passwordData.confirmPassword}
                                 onChange={(e) => {
                                    setPasswordData({ ...passwordData, confirmPassword: e.target.value });
                                    if (passwordErrors.confirmPassword) setPasswordErrors({ ...passwordErrors, confirmPassword: "" });
                                 }}
                                 placeholder="Masukkan konfirmasi kata sandi baru"
                                 className="w-full border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-ink)] rounded-xl pl-3.5 pr-11 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
                                 required
                                 minLength={6}
                              />
                              <button
                                 type="button"
                                 onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                 className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] p-1 rounded-lg transition-colors cursor-pointer"
                                 aria-label={showConfirmPassword ? "Sembunyikan konfirmasi kata sandi" : "Lihat konfirmasi kata sandi"}
                              >
                                 {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                              </button>
                           </div>
                           {passwordErrors.confirmPassword && (
                              <p className="text-[11px] text-rose-500 mt-1 font-medium">{passwordErrors.confirmPassword}</p>
                           )}
                        </div>

                        <div className="pt-2">
                           <motion.button
                              whileHover={{ scale: 1.01 }}
                              whileTap={{ scale: 0.99 }}
                              type="submit"
                              disabled={savingPassword}
                              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs tracking-wide shadow-xs disabled:opacity-50 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                           >
                              {savingPassword ? (
                                 <>
                                    <Loader2 size={15} className="animate-spin" />
                                    <span>Memperbarui Kata Sandi...</span>
                                 </>
                              ) : (
                                 <>
                                    <Lock size={15} className="stroke-[2.2]" />
                                    <span>Simpan Kata Sandi Baru</span>
                                 </>
                              )}
                           </motion.button>
                        </div>
                     </form>
                  </div>
               </div>

               {/* Financial Tips & Security Card */}
               <div className="p-4 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[var(--color-ink-muted)]">
                  <div className="flex items-center gap-2">
                     <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                     <span>Tips Finansial: Pisahkan uang saku harian dan alokasikan tabungan di awal bulan.</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                     <ShieldCheck size={14} />
                     <span>Data Keuangan Terenkripsi</span>
                  </div>
               </div>
            </main>
         </div>

         {/* Footer */}
         <footer className="border-t border-[var(--color-border)] bg-[var(--color-surface)] py-5 mt-12 mb-16 md:mb-0 transition-colors">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[var(--color-ink-muted)]">
               <div className="flex items-center gap-2 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                  <span>Sakuin — Kelola Uang Saku & Anggaran Cerdas</span>
               </div>
               <div className="text-[11px]">
                  © {new Date().getFullYear()} Sakuin. Hak Cipta Dilindungi.
               </div>
            </div>
         </footer>
      </div>
   );
}
