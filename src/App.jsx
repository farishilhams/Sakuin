import React from "react";
import {
   BrowserRouter as Router,
   Routes,
   Route,
   Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Dashboard from "./pages/Dashboard";
import DashboardWishlist from "./pages/DashboardWishlist";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import UnderMaintenancePage from "./pages/UnderMaintenance";
import GoogleAuthSuccess from "./components/GoogleAuthSuccess";
import { ThemeProvider } from "./context/ThemeContext";
import { Toaster } from "react-hot-toast";
import AppShell from "./layouts/AppShell";
import ProfilePage from "./pages/ProfilePage";
import HistoryPage from "./pages/HistoryPage";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

function App() {
   const isUnderMaintenance =
      import.meta.env.VITE_PUBLIC_MAINTENANCE_MODE === "true";
   console.log(
      "Maintenance mode:",
      import.meta.env.VITE_PUBLIC_MAINTENANCE_MODE
   );

   return (
      <ThemeProvider>
         <AuthProvider>
            <Toaster
               position="top-right"
               toastOptions={{
                  duration: 3500,
                  style: {
                     background: "var(--color-surface)",
                     color: "var(--color-ink)",
                     border: "1px solid var(--color-border)",
                     borderRadius: "1rem",
                     fontFamily: "'Poppins', sans-serif",
                     fontSize: "0.85rem",
                     boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.05)",
                     fontWeight: 500,
                     padding: "0.75rem 1rem",
                  },
                  success: {
                     style: {
                        border: "1px solid rgba(16, 185, 129, 0.3)",
                     },
                     iconTheme: {
                        primary: "#10B981",
                        secondary: "#FFFFFF",
                     },
                  },
                  error: {
                     style: {
                        border: "1px solid rgba(239, 68, 68, 0.3)",
                     },
                     iconTheme: {
                        primary: "#EF4444",
                        secondary: "#FFFFFF",
                     },
                  },
               }}
            />
            <Router>
               {isUnderMaintenance ? (
                  <UnderMaintenancePage />
               ) : (
                   <Routes>
                      {/* Protected Routes wrapped in AppShell (DraggableFAB, BottomNav, Global Modals) */}
                      <Route
                         element={
                            <ProtectedRoute>
                               <AppShell />
                            </ProtectedRoute>
                         }
                      >
                         <Route path="/" element={<Dashboard />} />
                         <Route path="/wishlist" element={<DashboardWishlist />} />
                         <Route path="/history" element={<HistoryPage />} />
                         <Route path="/riwayat" element={<HistoryPage />} />
                         <Route path="/profile" element={<ProfilePage />} />
                         <Route path="/profil" element={<ProfilePage />} />
                      </Route>

                      {/* Public Routes */}
                      <Route path="/login" element={<Login />} />
                      <Route path="/forgot-password" element={<ForgotPassword />} />
                      <Route path="/reset-password/:token" element={<ResetPassword />} />
                      <Route path="/maintenance" element={<UnderMaintenancePage />} />
                      <Route path="/auth/google/success" element={<GoogleAuthSuccess />} />
                      <Route path="*" element={<NotFound />} />
                   </Routes>
               )}
            </Router>
         </AuthProvider>
      </ThemeProvider>
   );
}

export default App;
