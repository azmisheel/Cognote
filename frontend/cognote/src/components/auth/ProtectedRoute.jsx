import React from 'react'
import { Outlet, Navigate } from 'react-router-dom';
import AppLayout from '../layout/AppLayout';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = () => {
    const {isAuthenticated, loading} = useAuth()

    if (loading) {
        return (
        <div className='flex items-center justify-center h-screen'>Loading...</div>
       );
    }

  return isAuthenticated ? (
    <AppLayout >
        <Outlet />
    </AppLayout>
   ) : (
    <Navigate to="/login" replace />
  );
}

export default ProtectedRoute