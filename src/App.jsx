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
                     <Route
                        path="/wishlist"
                        element={
                           <ProtectedRoute>
                              <DashboardWishlist />
                           </ProtectedRoute>
                        }
                     />
                     <Route
                        path="/"
                        element={
                           <ProtectedRoute>
                              <Dashboard />
                           </ProtectedRoute>
                        }
                     />
                     <Route path="/login" element={<Login />} />
                     <Route path="*" element={<NotFound />} />
                     <Route
                        path="/maintenance"
                        element={<UnderMaintenancePage />}
                     />

                     <Route
                        path="/auth/google/success"
                        element={<GoogleAuthSuccess />}
                     />
                  </Routes>
               )}
            </Router>
         </AuthProvider>
      </ThemeProvider>
   );
}

export default App;
