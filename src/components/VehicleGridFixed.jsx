import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const VehicleGrid = ({ vehicles, onEdit, onDelete, isAdmin = false, onBulkAction }) => {
  const [selectedVehicles, setSelectedVehicles] = useState(new Set());
  const [isProcessing, setIsProcessing] = useState(false);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatMileage = (mileage) => {
    return new Intl.NumberFormat('en-US').format(mileage);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Available':
        return 'bg-green-100 text-green-800';
      case 'Sold':
        return 'bg-red-100 text-red-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSelectVehicle = (vehicleId) => {
    const newSelected = new Set(selectedVehicles);
    if (newSelected.has(vehicleId)) {
      newSelected.delete(vehicleId);
    } else {
      newSelected.add(vehicleId);
    }
    setSelectedVehicles(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedVehicles.size === vehicles.length) {
      setSelectedVehicles(new Set());
    } else {
      setSelectedVehicles(new Set(vehicles.map(v => v.id)));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedVehicles.size === 0) return;
    
    const confirmed = window.confirm(
      `Are you sure you want to delete ${selectedVehicles.size} vehicle(s)? This action cannot be undone.`
    );
    
    if (!confirmed) return;

    setIsProcessing(true);
    try {
      const vehicleIds = Array.from(selectedVehicles);
      // Removed apiService call for now
      setSelectedVehicles(new Set());
      if (onBulkAction) {
        onBulkAction('delete', vehicleIds);
      }
    } catch (error) {
      console.error('Bulk delete failed:', error);
      alert('Failed to delete vehicles. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBulkStatusUpdate = async (newStatus) => {
    if (selectedVehicles.size === 0) return;

    setIsProcessing(true);
    try {
      const vehicleIds = Array.from(selectedVehicles);
      // Removed apiService calls for now
      setSelectedVehicles(new Set());
      if (onBulkAction) {
        onBulkAction('status_update', vehicleIds, newStatus);
      }
    } catch (error) {
      console.error('Bulk status update failed:', error);
      alert('Failed to update vehicle status. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (vehicles.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto h-12 w-12 text-gray-400">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0M15 17a2 2 0 104 0" />
          </svg>
        </div>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No vehicles found</h3>
        <p className="mt-1 text-sm text-gray-500">
          {isAdmin ? 'Get started by adding a new vehicle.' : 'Please check back later for new inventory.'}
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Bulk Actions Bar - Only show for admin */}
      {isAdmin && (
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedVehicles.size === vehicles.length && vehicles.length > 0}
                  onChange={handleSelectAll}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 text-sm text-gray-700">
                  Select All ({selectedVehicles.size} selected)
                </label>
              </div>
              
              {selectedVehicles.size > 0 && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleBulkDelete}
                    disabled={isProcessing}
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white text-sm rounded-md transition duration-200"
                  >
                    {isProcessing ? 'Processing...' : `Delete ${selectedVehicles.size}`}
                  </button>
                  
                  <div className="flex items-center space-x-1">
                    <span className="text-sm text-gray-600">Status:</span>
                    <button
                      onClick={() => handleBulkStatusUpdate('Available')}
                      disabled={isProcessing}
                      className="px-2 py-1 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white text-xs rounded"
                    >
                      Available
                    </button>
                    <button
                      onClick={() => handleBulkStatusUpdate('Pending')}
                      disabled={isProcessing}
                      className="px-2 py-1 bg-yellow-600 hover:bg-yellow-700 disabled:bg-yellow-400 text-white text-xs rounded"
                    >
                      Pending
                    </button>
                    <button
                      onClick={() => handleBulkStatusUpdate('Sold')}
                      disabled={isProcessing}
                      className="px-2 py-1 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white text-xs rounded"
                    >
                      Sold
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            <div className="text-sm text-gray-500">
              {vehicles.length} vehicle{vehicles.length !== 1 ? 's' : ''} total
            </div>
          </div>
        </div>
      )}

      {/* Vehicle Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {vehicles.map((vehicle) => (
          <div key={vehicle.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
            {/* Admin Selection Checkbox */}
            {isAdmin && (
              <div className="p-2">
                <input
                  type="checkbox"
                  checked={selectedVehicles.has(vehicle.id)}
                  onChange={() => handleSelectVehicle(vehicle.id)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>
            )}

            {/* Vehicle Image */}
            <div className="h-48 bg-gray-200 relative">
              {vehicle.images && vehicle.images.length > 0 ? (
                <img
                  src={vehicle.images[0].url}
                  alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
              
              {/* Status Badge */}
              <div className="absolute top-2 right-2">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(vehicle.status)}`}>
                  {vehicle.status}
                </span>
              </div>
            </div>

            {/* Vehicle Details */}
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {vehicle.year} {vehicle.make} {vehicle.model}
              </h3>
              
              <p className="text-2xl font-bold text-blue-600 mb-2">
                {formatPrice(vehicle.price)}
              </p>

              <div className="space-y-1 text-sm text-gray-600 mb-3">
                <div className="flex justify-between">
                  <span>Mileage:</span>
                  <span>{formatMileage(vehicle.mileage)} km</span>
                </div>
                <div className="flex justify-between">
                  <span>Transmission:</span>
                  <span>{vehicle.transmission}</span>
                </div>
                <div className="flex justify-between">
                  <span>Fuel:</span>
                  <span>{vehicle.fuelType}</span>
                </div>
                <div className="flex justify-between">
                  <span>Body:</span>
                  <span>{vehicle.bodyStyle}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2">
                {!isAdmin ? (
                  <Link
                    to={`/inventory/${vehicle.id}`}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 text-center block"
                  >
                    View Details
                  </Link>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onEdit(vehicle)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-3 rounded-md transition duration-200 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(vehicle.id)}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-3 rounded-md transition duration-200 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VehicleGrid;
