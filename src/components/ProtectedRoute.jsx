import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';



const ProtectedRoute = ({ children }) => {
   const { user, isAuthChecked } = useContext(AuthContext);
   if (!isAuthChecked) {
      return (
         <div className="min-h-screen w-full flex items-center justify-center bg-[var(--color-bg)] text-[var(--color-ink)]">
            <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
         </div>
      );
   }
   return user ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;