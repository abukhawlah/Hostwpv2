import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../../hooks/useSupabase';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // If we have a user, stop checking immediately
    if (user) {
      console.log('ProtectedRoute - user found, stopping check immediately');
      setIsChecking(false);
      return;
    }

    // Otherwise, set a timeout to stop checking
    const timer = setTimeout(() => {
      console.log('ProtectedRoute - timeout reached, setting isChecking to false');
      setIsChecking(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [user]); // Add user as dependency

  // Debug logging with more detail
  console.log('ProtectedRoute - user:', user, 'loading:', loading, 'isChecking:', isChecking);
  console.log('ProtectedRoute - localStorage demo_user:', localStorage.getItem('demo_user'));
  console.log('ProtectedRoute - localStorage demo_admin:', localStorage.getItem('demo_admin'));
  console.log('ProtectedRoute - location:', location.pathname);

  // Show loading spinner while checking authentication
  if (loading || isChecking) {
    console.log('ProtectedRoute - showing loading state');
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 bg-primary-600 rounded-xl flex items-center justify-center mb-4 mx-auto">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Checking Authentication
          </h2>
          <p className="text-gray-600">
            Please wait while we verify your access...
          </p>
        </motion.div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    console.log('ProtectedRoute - no user found, redirecting to login');
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // Render protected content if authenticated
  console.log('ProtectedRoute - user authenticated, rendering children');
  return children;
};

export default ProtectedRoute; 