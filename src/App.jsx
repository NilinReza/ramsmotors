import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Home from './pages/Home';
import Inventory from './pages/Inventory';
import VehicleDetail from './pages/VehicleDetail';
import Contact from './pages/Contact';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import DiagnosticPage from './pages/DiagnosticPage';
import TestPage from './pages/TestPage';
import FixesTestPage from './pages/FixesTestPage';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AdminPortal from './admin';

const App = () => {
  return (
    <HelmetProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900 font-sans">
          <Routes>
            {/* Modern Admin Portal */}
            <Route path="/admin/*" element={<AdminPortal />} />
            
            {/* Legacy Admin routes (keep for backward compatibility) */}
            <Route path="/legacy-admin/login" element={<AdminLogin />} />
            <Route path="/legacy-admin/dashboard" element={<AdminDashboard />} />
            
            {/* Diagnostic routes (development only) */}
            <Route path="/diagnostic" element={<DiagnosticPage />} />
            <Route path="/test" element={<TestPage />} />
            <Route path="/fixes" element={<FixesTestPage />} />
            
            {/* Public routes with navbar/footer */}
            <Route path="/*" element={
              <>
                <Navbar />
                <main className="flex-grow px-4 sm:px-6 lg:px-8 py-8">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/inventory" element={<Inventory />} />
                    <Route path="/inventory/:id" element={<VehicleDetail />} />
                    <Route path="/contact" element={<Contact />} />
                  </Routes>
                </main>
                <Footer />
              </>
            } />
          </Routes>
        </div>
      </Router>
    </HelmetProvider>
  );
};

export default App;