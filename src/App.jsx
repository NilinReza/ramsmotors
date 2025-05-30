import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import apiService from './services/api';
import Home from './pages/Home';
import Inventory from './pages/Inventory';
import VehicleDetail from './pages/VehicleDetail';
import About from './pages/About';
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
  useEffect(() => {
    // Initialize demo vehicles from Supabase on app startup
    const initializeDemoVehicles = async () => {
      try {
        // Call your API service or Supabase function here
        await apiService.initializeDemoVehicles();
        console.log('Demo vehicles initialized successfully');
      } catch (error) {
        console.error('Error initializing demo vehicles:', error);
      }
    };

    initializeDemoVehicles();
  }, []);

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
            <Route path="/" element={
              <>
                <Navbar />
                <main className="flex-grow px-4 sm:px-6 lg:px-8 py-8">
                  <Home />
                </main>
                <Footer />
              </>
            } />
            <Route path="/inventory" element={
              <>
                <Navbar />
                <main className="flex-grow px-4 sm:px-6 lg:px-8 py-8">
                  <Inventory />
                </main>
                <Footer />
              </>
            } />
            <Route path="/inventory/:id" element={
              <>
                <Navbar />
                <main className="flex-grow px-4 sm:px-6 lg:px-8 py-8">
                  <VehicleDetail />
                </main>
                <Footer />
              </>
            } />
            <Route path="/about" element={
              <>
                <Navbar />
                <main className="flex-grow px-4 sm:px-6 lg:px-8 py-8">
                  <About />
                </main>
                <Footer />
              </>
            } />
            <Route path="/contact" element={
              <>
                <Navbar />
                <main className="flex-grow px-4 sm:px-6 lg:px-8 py-8">
                  <Contact />
                </main>
                <Footer />
              </>
            } />
            <Route path="/*" element={
              <>
                <Navbar />
                <main className="flex-grow px-4 sm:px-6 lg:px-8 py-8">
                  <Home />
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