// Modern Vehicle Management Page
import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { vehicleService } from '../services/vehicleService';
import VehicleList from '../components/VehicleList';
import VehicleForm from '../components/VehicleForm';
import VehicleFilters from '../components/VehicleFilters';
import VehicleImport from '../components/VehicleImport';

const VehicleManagement = () => {
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    make: '',
    model: '',
    minPrice: '',
    maxPrice: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    loadVehicles();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [vehicles, filters]);

  const loadVehicles = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      const response = await vehicleService.getVehicles();
      const vehicleData = response.data || [];
      
      setVehicles(vehicleData);
      
    } catch (error) {
      console.error('Failed to load vehicles:', error);
      setError('Failed to load vehicles. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = vehicles;

    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(vehicle =>
        vehicle.make?.toLowerCase().includes(searchTerm) ||
        vehicle.model?.toLowerCase().includes(searchTerm) ||
        vehicle.year?.toString().includes(searchTerm) ||
        vehicle.color?.toLowerCase().includes(searchTerm)
      );
    }

    // Status filter
    if (filters.status) {
      filtered = filtered.filter(vehicle => vehicle.status === filters.status);
    }

    // Make filter
    if (filters.make) {
      filtered = filtered.filter(vehicle => vehicle.make === filters.make);
    }

    // Model filter
    if (filters.model) {
      filtered = filtered.filter(vehicle => vehicle.model === filters.model);
    }

    // Price filters
    if (filters.minPrice) {
      filtered = filtered.filter(vehicle => parseFloat(vehicle.price) >= parseFloat(filters.minPrice));
    }
    if (filters.maxPrice) {
      filtered = filtered.filter(vehicle => parseFloat(vehicle.price) <= parseFloat(filters.maxPrice));
    }

    setFilteredVehicles(filtered);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleDeleteVehicle = async (vehicleId) => {
    if (!window.confirm('Are you sure you want to delete this vehicle?')) {
      return;
    }

    try {
      await vehicleService.deleteVehicle(vehicleId);
      await loadVehicles();
    } catch (error) {
      console.error('Failed to delete vehicle:', error);
      setError('Failed to delete vehicle. Please try again.');
    }
  };

  const handleBulkAction = async (action, vehicleIds, data = null) => {
    try {
      switch (action) {
        case 'delete':
          if (!window.confirm(`Delete ${vehicleIds.length} vehicles?`)) return;
          await vehicleService.bulkDeleteVehicles(vehicleIds);
          break;
        case 'status_update':
          const promises = vehicleIds.map(id => 
            vehicleService.updateVehicle(id, { status: data })
          );
          await Promise.all(promises);
          break;
        default:
          console.warn('Unknown bulk action:', action);
      }
      
      await loadVehicles();
    } catch (error) {
      console.error('Bulk action failed:', error);
      setError('Bulk action failed. Please try again.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <Routes>
        {/* Vehicle List */}
        <Route index element={
          <>
            {/* Header */}
            <div className="mb-8">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Vehicle Management</h1>
                  <p className="mt-1 text-sm text-gray-500">
                    Manage your vehicle inventory ({filteredVehicles.length} of {vehicles.length} vehicles)
                  </p>
                </div>
                <div className="flex space-x-3">
                  <Link
                    to="/admin/vehicles/import"
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-200"
                  >
                    📁 Import
                  </Link>
                  <Link
                    to="/admin/vehicles/add"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-200"
                  >
                    ➕ Add Vehicle
                  </Link>
                </div>
              </div>
            </div>

            {error && (
              <div className="mb-6 bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded-md">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <span className="text-red-500">⚠️</span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Filters */}
            <div className="mb-6">
              <VehicleFilters
                filters={filters}
                onFilterChange={handleFilterChange}
                vehicles={vehicles}
              />
            </div>

            {/* Vehicle List */}
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading vehicles...</p>
              </div>
            ) : (
              <VehicleList
                vehicles={filteredVehicles}
                onDelete={handleDeleteVehicle}
                onBulkAction={handleBulkAction}
                onRefresh={loadVehicles}
              />
            )}
          </>
        } />

        {/* Add Vehicle */}
        <Route path="add" element={
          <div>
            <div className="mb-8">
              <Link
                to="/admin/vehicles"
                className="text-blue-600 hover:text-blue-500 text-sm font-medium"
              >
                ← Back to Vehicle List
              </Link>
              <h1 className="text-3xl font-bold text-gray-900 mt-2">Add New Vehicle</h1>
            </div>
            <VehicleForm
              onSuccess={() => {
                navigate('/admin/vehicles');
                loadVehicles();
              }}
              onCancel={() => navigate('/admin/vehicles')}
            />
          </div>
        } />

        {/* Edit Vehicle */}
        <Route path=":id/edit" element={
          <div>
            <div className="mb-8">
              <Link
                to="/admin/vehicles"
                className="text-blue-600 hover:text-blue-500 text-sm font-medium"
              >
                ← Back to Vehicle List
              </Link>
              <h1 className="text-3xl font-bold text-gray-900 mt-2">Edit Vehicle</h1>
            </div>
            <VehicleForm
              isEdit={true}
              onSuccess={() => {
                navigate('/admin/vehicles');
                loadVehicles();
              }}
              onCancel={() => navigate('/admin/vehicles')}
            />
          </div>
        } />

        {/* Import Vehicles */}
        <Route path="import" element={
          <div>
            <div className="mb-8">
              <Link
                to="/admin/vehicles"
                className="text-blue-600 hover:text-blue-500 text-sm font-medium"
              >
                ← Back to Vehicle List
              </Link>
              <h1 className="text-3xl font-bold text-gray-900 mt-2">Import Vehicles</h1>
            </div>
            <VehicleImport
              onSuccess={() => {
                navigate('/admin/vehicles');
                loadVehicles();
              }}
              onCancel={() => navigate('/admin/vehicles')}
            />
          </div>
        } />
      </Routes>
    </div>
  );
};

export default VehicleManagement;
