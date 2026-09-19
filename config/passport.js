const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");
const Budget = require("../models/Budget");

passport.serializeUser((user, done) => {
   done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
   try {
      const user = await User.findById(id);
      done(null, user);
   } catch (error) {
      done(error, null);
   }
});

passport.use(
   new GoogleStrategy(
      {
         clientID: process.env.GOOGLE_CLIENT_ID || "placeholder_client_id",
         clientSecret: process.env.GOOGLE_CLIENT_SECRET || "placeholder_client_secret",
         callbackURL: process.env.GOOGLE_CALLBACK_URL || "/api/auth/google/callback",
         proxy: true,
      },
      async (accessToken, refreshToken, profile, done) => {
         try {
            const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
            const photo = profile.photos && profile.photos[0] ? profile.photos[0].value : "";

            // 1. Cek apakah pengguna sudah pernah login Google dengan ID ini
            let existingUser = await User.findOne({ googleId: profile.id });

            if (existingUser) {
               return done(null, existingUser);
            }

            // 2. Cek apakah ada pengguna lokal dengan email yang sama untuk disambungkan
            if (email) {
               existingUser = await User.findOne({ email });
               if (existingUser) {
                  existingUser.googleId = profile.id;
                  if (!existingUser.avatar && photo) {
                     existingUser.avatar = photo;
                  }
                  await existingUser.save();
                  return done(null, existingUser);
               }
            }

            // 3. Buat akun baru jika belum ada
            const user = new User({
               googleId: profile.id,
               name: profile.displayName || "Pengguna Sakuin",
               email: email,
               avatar: photo,
               provider: "google",
            });

            await user.save();

            // Inisialisasi 6 kategori budget awal bernilai Rp 0
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

            done(null, user);
         } catch (error) {
            console.error("Google OAuth Strategy Error:", error);
            done(error, null);
         }
      }
   )
);

module.exports = passport;
