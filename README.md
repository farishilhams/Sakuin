# Sakuin — Smart Personal Finance & Quick Expense Tracker

This is a [React 19](https://react.dev/) + [Vite](https://vite.dev/) project integrated with an [Express.js](https://expressjs.com/) backend and [MongoDB](https://www.mongodb.com/) (via Mongoose) database, built for **Sakuin** — a quick personal expense tracker designed for ultra-fast daily transaction logging.

[![Maintainer](https://img.shields.io/badge/Maintainer-Farish%20Ilham%20Syahrani-10b981.svg)](https://github.com/farishilhams)
[![Repository](https://img.shields.io/badge/GitHub-farishilhams%2FSakuin-0f172a.svg)](https://github.com/farishilhams/Sakuin.git)
[![Stack](https://img.shields.io/badge/Tech%20Stack-MERN%20%2B%20Vite%20%2B%20Tailwind%20%2B%20Framer-6366f1.svg)]()
[![License](https://img.shields.io/badge/License-MIT-emerald.svg)]()

---

## Getting Started

First, install dependencies:

```bash
npm install
```

Second, configure environment variables by copying `.env.example`:

```bash
cp .env.example .env
```

Third, run the development server (runs both Express.js backend on port 5000 and Vite frontend on port 5173 concurrently):

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) with your browser to explore **Sakuin**.

- **Frontend Client**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:5000/api](http://localhost:5000/api)
- **Health Check**: [http://localhost:5000/api/health-check](http://localhost:5000/api/health-check)

---

## Key Features

- ⚡ **Sat-Set Quick Logging (< 3s, Max 3 Taps)**:
  - Custom large on-screen numpad with instant quick-add chips (`+10rb`, `+20rb`, `+50rb`, `+100rb`).
  - Adaptive category grid positioned directly below the numpad with most frequently used categories prioritized in front.
  - **1-Tap Save**: Tap any category to instantly persist the transaction without searching for a separate submit button.
  - **Interactive Toast & Instant Undo**: Action feedback toast (3-5s) with a single-click "Undo" button to safely reverse erroneous inputs without intrusive modal dialogs.
- 🎯 **Draggable AssistiveTouch Floating Action Button (iOS Style)**:
  - Persistently mounted at the root `AppShell` layout — never unmounts or resets across route changes.
  - Magnetic snap-to-edge automatically docks to the nearest left or right viewport boundary with smooth Framer Motion spring physics.
  - Smart gesture threshold distinguishes tap (under 8px) to open quick-add modal versus drag (8px or more) to reposition.
  - Position coordinates are stored in `localStorage` per device.
- 💳 **Organized Funding Sources (35+ Institutions)**:
  - Grouped by Cash, Conventional Banks (BCA, Mandiri, BNI, BRI, CIMB Niaga, Danamon, Permata, BTN, Maybank, OCBC NISP, Panin, BTPN, Mega, Sinarmas), Sharia Banks (BSI, Muamalat), Digital Banks (Bank Jago, SeaBank, BNC, Allo Bank, Jenius, LINE Bank, Superbank, Blu), E-Wallets (GoPay, OVO, DANA, ShopeePay, LinkAja, i.saku, Sakuku, AstraPay, Flip), and QRIS.
  - Custom wallet creator ("Tambah Sumber Dana Lain") for manual accounts with custom color badges.
  - Defaults to the user's most frequently or last used wallet.
- 📊 **Real-Time Cash Flow & Envelope Budgeting**:
  - Live net balance summary cards, daily spending, monthly income, and envelope budgeting limits with semantic status indicators.
  - Interactive monthly expense analytics and visual progress bars.
- 📱 **Clean Fintech UI/UX & Full Breakpoint Responsiveness**:
  - Built with Google Font **Poppins** (400, 500, 600, 700) and curated modern slate/emerald color tokens (anti-AI slop).
  - **Mobile**: Thumb-friendly Bottom Navigation (5 items: Arus Kas, Wishlist, Quick Add FAB, Riwayat, Profil) and Bottom Sheet Drawers.
  - **Tablet**: Clean split-view layout.
  - **Desktop**: Collapsible sidebar, data-dense transaction table, and PDF report export.
- 👁️ **Standardized Form Inputs & Password Toggle**:
  - Action-oriented placeholders (*"Masukkan nama lengkap"*, *"Masukkan alamat email"*, *"Masukkan kata sandi"*, *"Masukkan nominal"*).
  - Left currency adornment prefix (`Rp`) embedded directly inside input borders.
  - Dedicated "Opsional" badge rather than inline bracket text.
  - Smooth interactive eye toggle (`Eye` & `EyeOff` from Lucide React) on all password fields.
- 👤 **Universal Profile Management (`/profile`) & Password Security**:
  - Single responsive component serving mobile, tablet, and desktop without conditional dropping.
  - Edit full name, email, avatar upload preview, and optional phone number.
  - In-app password change requiring current password verification with server-side validation and session revocation.
  - Forgot password flow with single-use SHA-256 tokens (30 min expiration) and anti-enumeration generic responses.
- 📸 **Receipt & QRIS Scanner (OCR)**:
  - Tesseract.js client-side OCR for scanning paper supermarket receipts and m-banking QRIS transfer screenshots.

---

## Environment Variables

Configure your environment variables in `.env`:

```env
# Backend Server
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Database (MongoDB Atlas / Local)
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/sakuin?retryWrites=true&w=majority

# Authentication & Sessions
JWT_SECRET=rahasia_jwt_sakuin_farish_2026
JWT_EXPIRES_IN=7d
SESSION_SECRET=rahasia_session_sakuin_farish_ilham_syahrani

# Google OAuth 2.0 (Farish Ilham Syahrani)
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# Frontend Client (Vite)
VITE_API_BASE_URL=http://localhost:5000/api
VITE_PUBLIC_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

---

## Database Connection Guide (MongoDB Atlas & Local)

### Option A: MongoDB Atlas (Cloud — Recommended)
1. Sign up / log in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a free cluster (**M0 Free Tier**).
3. Under **Security > Database Access**, create a user (e.g. `farishilhams_db_user`) with `Read and write to any database` privileges.
4. Under **Security > Network Access**, click **Add IP Address** and choose `0.0.0.0/0` (Allow Access from Anywhere).
5. Under **Deployment > Database**, click **Connect > Drivers (Node.js)** and copy your connection string into `MONGODB_URI`.

### Option B: Local MongoDB
1. Ensure your local MongoDB service is running on default port `27017`.
2. Set `MONGODB_URI=mongodb://127.0.0.1:27017/sakuin`.

---

## Google OAuth 2.0 Configuration (Farish Ilham Syahrani)

To enable **Masuk dengan Akun Google**:
1. Go to [Google Cloud Console](https://console.cloud.google.com/).
2. Create a project named **Sakuin**.
3. Under **OAuth consent screen**, set User Type to External, App name to **Sakuin**, support email to `farishilham.s@gmail.com`.
4. Under **Credentials**, create an **OAuth 2.0 Client ID** (Web application).
   - **Authorized JavaScript origins**: `http://localhost:5173`
   - **Authorized redirect URIs**: `http://localhost:5000/api/auth/google/callback`
5. Copy the generated **Client ID** and **Client Secret** into your `.env` file.

---

## Production Build & Validation

To build the application bundle for production:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

---

## Project Structure

```
Sakuin/
├── config/              # Modular db.js (auto-reconnect) & passport.js OAuth strategy
├── controllers/         # REST API handlers (auth, budget, history, pemasukan, transaction, wishlist)
├── middleware/          # authMiddleware.js (JWT verify)
├── models/              # Mongoose schemas: User, Wallet, Transaction, Budget, Wishlist, History
├── routes/              # Express API route endpoints
├── public/              # Brand assets: icon.svg, favicon.ico, favicon.svg
├── src/
│   ├── components/      # UI components: Header, BottomNav, DraggableFAB, Modals, Tables
│   ├── context/         # AuthContext & ThemeContext
│   ├── layouts/         # AppShell.jsx (Persistent FAB, BottomNav, Global Modals)
│   ├── pages/           # Dashboard, DashboardWishlist, ProfilePage, Login, Forgot/Reset
│   ├── utils/           # Axios instance api.js, motionVariants.js, receiptParser.js
│   ├── App.jsx          # Route tree & persistent AppShell layout
│   └── index.css        # Tailwind CSS v4 design tokens, Poppins typography
├── server.js            # Express server entry point (Helmet, Rate Limit, Mongo Sanitize)
├── README.md            # Official public documentation
└── package.json         # Project scripts & dependencies
```

---

## Maintainer & Author

Created and maintained by:
- **Name**: Farish Ilham Syahrani
- **GitHub**: [@farishilhams](https://github.com/farishilhams)
- **Email**: [farishilham.s@gmail.com](mailto:farishilham.s@gmail.com)
- **Repository**: [https://github.com/farishilhams/Sakuin.git](https://github.com/farishilhams/Sakuin.git)

---

## License

This project is licensed under the [MIT License](LICENSE) © 2026 Farish Ilham Syahrani.
