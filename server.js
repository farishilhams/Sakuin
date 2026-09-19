require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const rateLimit = require("express-rate-limit");
const connectDB = require("./config/db");
const passport = require("./config/passport");
const session = require("express-session");
const MongoStore = require("connect-mongo");

// Import passport config
require("./config/passport");

// Import routes
const authRoutes = require("./routes/authRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const budgetRoutes = require("./routes/budgetRoutes");
const historyRoutes = require("./routes/historyRoutes");
const pemasukanRoutes = require("./routes/pemasukanRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");

connectDB();

const app = express();

// Trust proxy for secure cookies and rate limiter when behind reverse proxies
app.set("trust proxy", 1);

// Security Headers with Helmet
app.use(
   helmet({
      crossOriginResourcePolicy: false,
      contentSecurityPolicy: false, // Vite inline dev scripts compatibility
   })
);

// CORS configuration
app.use(
   cors({
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
      credentials: true,
      optionsSuccessStatus: 204,
   })
);

// Body parser & Cookie parser
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// NoSQL Query Injection Sanitization
app.use(mongoSanitize());

// Rate Limiter for Authentication Endpoints
const authLimiter = rateLimit({
   windowMs: 15 * 60 * 1000, // 15 menit
   max: 60, // maks 60 request per IP per 15 menit
   standardHeaders: true,
   legacyHeaders: false,
   message: {
      message: "Terlalu banyak percobaan autentikasi. Silakan coba lagi beberapa saat.",
   },
});

// Session configuration
app.use(
   session({
      secret: process.env.SESSION_SECRET || process.env.JWT_SECRET || "sakuin_default_session_secret_farish",
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({
         mongoUrl: process.env.MONGO_URI || "mongodb://localhost:27017/sakuin",
         collectionName: "sessions",
         ttl: 24 * 60 * 60, // 1 hari
      }),
      cookie: {
         secure: process.env.NODE_ENV === "production",
         sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
         maxAge: 24 * 60 * 60 * 1000,
         httpOnly: true,
      },
   })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Mount Routes
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/budgets", budgetRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/pemasukan", pemasukanRoutes);
app.use("/api/wishlist", wishlistRoutes);

// Health check endpoint
app.get("/api/health-check", (req, res) => {
   res.status(200).json({
      status: "OK",
      service: "Sakuin API Server",
      timestamp: new Date().toISOString(),
   });
});

app.get("/", (req, res) => {
   res.send("Sakuin API Server is active!");
});

// Centralized error handler
app.use((err, req, res, next) => {
   console.error("Internal Server Error:", err.stack);
   res.status(err.status || 500).json({
      message: err.message || "Terjadi kesalahan pada server",
      error: process.env.NODE_ENV === "development" ? err.stack : undefined,
   });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Sakuin server running on port ${PORT}`));
