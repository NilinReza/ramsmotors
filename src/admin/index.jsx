// Modern Admin Portal Entry Point
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminLayout from './layout/AdminLayout';
import AdminLogin from './pages/AdminLogin';
import Dashboard from './pages/Dashboard';
import VehicleManagement from './pages/VehicleManagement';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import { AdminAuthProvider } from './context/AdminAuthContext';
import ProtectedRoute from './components/ProtectedRoute';

const AdminPortal = () => {
  return (
    <AdminAuthProvider>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<AdminLogin />} />
        
        {/* Protected admin routes */}
        <Route path="/" element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="vehicles/*" element={<VehicleManagement />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </AdminAuthProvider>
  );
};

export default AdminPortal;
