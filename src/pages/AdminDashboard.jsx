import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/api';
import VehicleForm from '../components/VehicleForm';
import VehicleGrid from '../components/VehicleGrid';

const AdminDashboard = () => {
  const [vehicles, setVehicles] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const checkAuth = useCallback(async () => {
    try {
      console.log('Checking authentication...');
      const token = localStorage.getItem('authToken');
      console.log('Current token:', token);
      
      if (!token) {
        console.log('No token found, redirecting to login');
        navigate('/admin/login');
        return;
      }
      
      const response = await apiService.validateToken();
      console.log('Token validation response:', response);
    } catch (error) {
      console.error('Authentication failed:', error);
      localStorage.removeItem('authToken');
      navigate('/admin/login');
    }
  }, [navigate]);
  const loadVehicles = useCallback(async () => {
    try {
      setIsLoading(true);
      setError('');
      
      // Log that we're attempting to load vehicles
      console.log('Loading vehicles...');
      
      const data = await apiService.getVehicles();
      console.log('Vehicles data received:', data);
      
      // Handle different response formats
      if (data && (data.data || Array.isArray(data))) {
        setVehicles(data.data || data);
      } else {
        console.warn('Unexpected vehicles data format:', data);
        setVehicles([]); // Set empty array as fallback
      }
    } catch (error) {
      setError('Failed to load vehicles');
      console.error('Error loading vehicles:', error);
      setVehicles([]); // Set empty array on error
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        console.log('Initializing dashboard...');
        await checkAuth();
        await loadVehicles();
      } catch (error) {
        console.error('Dashboard initialization failed:', error);
        setError('Failed to initialize dashboard');
        setIsLoading(false);
      }
    };
    initializeDashboard();
  }, [checkAuth, loadVehicles]);

  const handleLogout = async () => {
    try {
      await apiService.logout();
      navigate('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
      localStorage.removeItem('authToken');
      navigate('/admin/login');
    }
  };

  const handleAddVehicle = () => {
    setEditingVehicle(null);
    setShowForm(true);
  };

  const handleEditVehicle = (vehicle) => {
    setEditingVehicle(vehicle);
    setShowForm(true);
  };

  const handleDeleteVehicle = async (vehicleId) => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      try {
        await apiService.deleteVehicle(vehicleId);
        await loadVehicles(); // Reload the vehicles list
      } catch (error) {
        setError('Failed to delete vehicle');
        console.error('Error deleting vehicle:', error);
      }
    }
  };

  const handleFormSubmit = async (vehicleData) => {
    try {
      if (editingVehicle) {
        await apiService.updateVehicle(editingVehicle.vin, vehicleData);
      } else {
        await apiService.createVehicle(vehicleData);
      }
      setShowForm(false);
      setEditingVehicle(null);
      await loadVehicles(); // Reload the vehicles list
    } catch (error) {
      setError('Failed to save vehicle');
      console.error('Error saving vehicle:', error);
    }
  };
  const handleFormCancel = () => {
    setShowForm(false);
    setEditingVehicle(null);
  };

  const handleBulkAction = async (actionType, vehicleIds, newStatus = null) => {
    try {
      switch (actionType) {
        case 'delete':
          console.log(`Bulk deleted ${vehicleIds.length} vehicles`);
          break;
        case 'status_update':
          console.log(`Updated ${vehicleIds.length} vehicles to ${newStatus} status`);
          break;
        default:
          console.log('Unknown bulk action:', actionType);
      }
      // Reload vehicles after any bulk action
      await loadVehicles();
    } catch (error) {
      setError(`Failed to process bulk action: ${actionType}`);
      console.error('Bulk action error:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="mt-1 text-sm text-gray-500">Manage your vehicle inventory</p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={handleAddVehicle}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Add Vehicle
              </button>
              <button
                onClick={handleLogout}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {showForm ? (
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                {editingVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}
              </h3>
              <VehicleForm
                vehicle={editingVehicle}
                onSubmit={handleFormSubmit}
                onCancel={handleFormCancel}
              />
            </div>
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Vehicle Inventory ({vehicles.length})
                </h3>
                <button
                  onClick={loadVehicles}
                  className="text-sm text-blue-600 hover:text-blue-500"
                >
                  Refresh
                </button>
              </div>
              
              {vehicles.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">No vehicles found.</p>
                  <button
                    onClick={handleAddVehicle}
                    className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                  >
                    Add Your First Vehicle
                  </button>
                </div>
              ) : (                <VehicleGrid
                  vehicles={vehicles}
                  onEdit={handleEditVehicle}
                  onDelete={handleDeleteVehicle}
                  isAdmin={true}
                  onBulkAction={handleBulkAction}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
