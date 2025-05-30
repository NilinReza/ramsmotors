import React from 'react';
import { Link } from 'react-router-dom';
import GoogleMapsDiagnostic from '../components/GoogleMapsDiagnostic';
import MigrationStatus from '../components/MigrationStatus';
import '../utils/migrationTests';

const DiagnosticPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">System Diagnostics</h1>
          <p className="text-gray-600">Diagnostic tools for debugging the application</p>
          <Link 
            to="/" 
            className="text-blue-600 hover:text-blue-800 text-sm mt-2 inline-block"
          >
            ← Back to Homepage
          </Link>
        </div>        <div className="space-y-8">
          {/* Migration Status Overview */}
          <MigrationStatus />

          {/* Google Maps Diagnostic */}
          <GoogleMapsDiagnostic />

          {/* Quick Links for Testing */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Quick Test Links</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link 
                to="/admin" 
                className="p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <h3 className="font-semibold text-blue-800">Admin Login</h3>
                <p className="text-blue-600 text-sm">Test admin credentials</p>
              </Link>
              
              <Link 
                to="/inventory" 
                className="p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
              >
                <h3 className="font-semibold text-green-800">Inventory Page</h3>
                <p className="text-green-600 text-sm">Test vehicle grid</p>
              </Link>
              
              <Link 
                to="/contact" 
                className="p-4 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors"
              >
                <h3 className="font-semibold text-purple-800">Contact Page</h3>
                <p className="text-purple-600 text-sm">Test maps integration</p>
              </Link>
            </div>
          </div>

          {/* Environment Variables */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Environment Variables</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h3 className="font-semibold mb-2">Google Maps</h3>
                <div className="space-y-1 text-gray-600">
                  <p>REACT_APP_GOOGLE_MAPS_API_KEY: {process.env.REACT_APP_GOOGLE_MAPS_API_KEY ? '✅ Present' : '❌ Missing'}</p>
                  <p>REACT_APP_GOOGLE_PLACES_API_KEY: {process.env.REACT_APP_GOOGLE_PLACES_API_KEY ? '✅ Present' : '❌ Missing'}</p>
                  <p>REACT_APP_GOOGLE_PLACE_ID: {process.env.REACT_APP_GOOGLE_PLACE_ID ? '✅ Present' : '❌ Missing'}</p>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">System</h3>
                <div className="space-y-1 text-gray-600">
                  <p>NODE_ENV: {process.env.NODE_ENV}</p>
                  <p>React Version: {React.version}</p>
                  <p>Total ENV vars: {Object.keys(process.env).length}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiagnosticPage;
