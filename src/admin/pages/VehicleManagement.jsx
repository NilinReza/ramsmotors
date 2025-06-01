// Modern Vehicle Management Page
import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';
import { vehicleService } from '../services/vehicleService';
import VehicleList from '../components/VehicleList';
import VehicleForm from '../components/VehicleForm';
import VehicleFilters from '../components/VehicleFilters';
import VehicleImport from '../components/VehicleImport';
import dataSync from '../../utils/dataSync';

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
  const navigate = useNavigate();  useEffect(() => {
    loadVehicles();
  }, []);
  // Set up data sync listener for real-time updates
  useEffect(() => {
    const unsubscribe = dataSync.onVehicleChange((eventDetail) => {
      // Always refresh the vehicle list when any change occurs
      switch (eventDetail.action) {
        case 'create':
        case 'update':
        case 'delete':
        case 'bulk_delete':
        case 'refresh':
          loadVehicles();
          break;
        default:
          // Unknown action type
          break;
      }
    });    // Cleanup listener on unmount
    return () => {
      unsubscribe();
    };
  }, []);

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
  const applyFilters = useCallback(() => {
    let filtered = vehicles;

    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(vehicle =>
        vehicle.make?.toLowerCase().includes(searchTerm) ||
        vehicle.model?.toLowerCase().includes(searchTerm) ||
        vehicle.year?.toString().includes(searchTerm) ||
        vehicle.color?.toLowerCase().includes(searchTerm) ||
        vehicle.vin?.toLowerCase().includes(searchTerm)
      );
    }

    // Status filter
    if (filters.status) {
      filtered = filtered.filter(vehicle => vehicle.status === filters.status);
    }

    // Make filter (case-insensitive, partial match)
    if (filters.make) {
      filtered = filtered.filter(vehicle => vehicle.make && vehicle.make.toLowerCase().includes(filters.make.toLowerCase()));
    }

    // Model filter (case-insensitive, partial match)
    if (filters.model) {
      filtered = filtered.filter(vehicle => vehicle.model && vehicle.model.toLowerCase().includes(filters.model.toLowerCase()));
    }

    // Year filter (exact match)
    if (filters.year) {
      filtered = filtered.filter(vehicle => vehicle.year && vehicle.year.toString() === filters.year.toString());
    }

    // Price range filter
    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split('-').map(Number);
      filtered = filtered.filter(vehicle => vehicle.price >= min && vehicle.price <= max);
    }
    if (filters.minPrice) {
      filtered = filtered.filter(vehicle => parseFloat(vehicle.price) >= parseFloat(filters.minPrice));
    }
    if (filters.maxPrice) {
      filtered = filtered.filter(vehicle => parseFloat(vehicle.price) <= parseFloat(filters.maxPrice));
    }

    // Max Mileage filter
    if (filters.maxMileage) {
      filtered = filtered.filter(vehicle => vehicle.mileage && vehicle.mileage <= parseInt(filters.maxMileage));
    }

    // Transmission filter (case-insensitive)
    if (filters.transmission) {
      filtered = filtered.filter(vehicle => vehicle.transmission && vehicle.transmission.toLowerCase() === filters.transmission.toLowerCase());
    }

    // Fuel Type filter (case-insensitive)
    if (filters.fuelType) {
      filtered = filtered.filter(vehicle => vehicle.fuelType && vehicle.fuelType.toLowerCase() === filters.fuelType.toLowerCase());
    }

    // Body Type filter (case-insensitive)
    if (filters.bodyType) {
      filtered = filtered.filter(vehicle => vehicle.bodyStyle && vehicle.bodyStyle.toLowerCase() === filters.bodyType.toLowerCase());
    }

    setFilteredVehicles(filtered);
  }, [vehicles, filters]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      status: '',
      make: '',
      model: '',
      minPrice: '',
      maxPrice: ''
    });
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
  };  const handleFormSubmit = async (vehicleData) => {
    try {
      // Extract image and video files from vehicleData
      const { imageFiles = [], videoFiles = [], ...cleanVehicleData } = vehicleData;
      
      // Call createVehicle with separated parameters
      await vehicleService.createVehicle(cleanVehicleData, imageFiles, videoFiles);
      navigate('/admin/vehicles');
      await loadVehicles();
    } catch (error) {
      console.error('Form submission error:', error);
      setError('Failed to save vehicle. Please try again.');
    }
  };  const handleEditFormSubmit = async (vehicleId, vehicleData) => {
    try {
      // Extract image and video files and deletion IDs from vehicleData
      const { 
        imageFiles = [], 
        videoFiles = [], 
        deletedImageIds = [], 
        deletedVideoIds = [], 
        ...cleanVehicleData 
      } = vehicleData;
      
      // Call updateVehicle with separated parameters including deletion IDs
      await vehicleService.updateVehicle(vehicleId, cleanVehicleData, imageFiles, videoFiles, deletedImageIds, deletedVideoIds);
      navigate('/admin/vehicles');
      await loadVehicles();
    } catch (error) {
      console.error('Edit form submission error:', error);
      setError('Failed to update vehicle. Please try again.');
    }
  };
  const handleFormCancel = () => {
    navigate('/admin/vehicles');
  };

  // Component to handle edit form with vehicle ID
  const EditVehicleForm = () => {
    const { id } = useParams();
    const [vehicleData, setVehicleData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);    useEffect(() => {
      const loadVehicle = async () => {
        try {
          const vehicleData = await vehicleService.getVehicle(id);
        setVehicleData(vehicleData);
        } catch (error) {
          console.error('Failed to load vehicle:', error);
          setError('Failed to load vehicle data.');
        } finally {
          setIsLoading(false);
        }
      };

      if (id) {
        loadVehicle();
      }
    }, [id]);

    const handleEditSubmit = async (formData) => {
      await handleEditFormSubmit(id, formData);
    };

    if (isLoading) {
      return (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading vehicle...</p>
        </div>
      );
    }

    return (
      <VehicleForm
        vehicle={vehicleData}
        isEdit={true}
        onSubmit={handleEditSubmit}
        onCancel={handleFormCancel}
      />
    );
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
                onClearFilters={handleClearFilters}
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
              <h1 className="text-3xl font-bold text-gray-900 mt-2">Add New Vehicle</h1>            </div>
            <VehicleForm
              onSubmit={handleFormSubmit}
              onCancel={handleFormCancel}
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
              <h1 className="text-3xl font-bold text-gray-900 mt-2">Edit Vehicle</h1>            </div>
            <EditVehicleForm />
          </div>
        } />        {/* Import Vehicles */}
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
            <VehicleImport              onImport={async (data, settings) => {
                // Handle the import process
                try {
                  // Process imported vehicles here
                  await loadVehicles();
                  navigate('/admin/vehicles');
                } catch (error) {
                  console.error('Import failed:', error);
                  setError('Failed to import vehicles. Please try again.');
                }
              }}
              onClose={() => navigate('/admin/vehicles')}
            />
          </div>
        } />
      </Routes>
    </div>
  );
};

export default VehicleManagement;
