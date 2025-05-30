// Modern Vehicle List Component
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const VehicleList = ({ vehicles = [], onDelete, onBulkAction, onRefresh }) => {
  const [selectedVehicles, setSelectedVehicles] = useState(new Set());
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(price);
  };

  const formatMileage = (mileage) => {
    return new Intl.NumberFormat('en-US').format(mileage);
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (error) {
      return 'N/A';
    }
  };
  const getStatusBadge = (status) => {
    const statusClasses = {
      Available: 'bg-green-100 text-green-800',
      Sold: 'bg-red-100 text-red-800',
      Pending: 'bg-yellow-100 text-yellow-800',
      Draft: 'bg-gray-100 text-gray-800'
    };

    return (
      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
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

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const sortedVehicles = [...vehicles].sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];

    // Handle different data types
    if (sortBy === 'price' || sortBy === 'mileage' || sortBy === 'year') {
      aValue = parseFloat(aValue) || 0;
      bValue = parseFloat(bValue) || 0;
    } else if (sortBy === 'createdAt') {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    } else {
      aValue = aValue?.toString().toLowerCase() || '';
      bValue = bValue?.toString().toLowerCase() || '';
    }

    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const getSortIcon = (field) => {
    if (sortBy !== field) return '↕️';
    return sortOrder === 'asc' ? '↑' : '↓';
  };

  if (vehicles.length === 0) {
    return (
      <div className="bg-white shadow-sm rounded-lg border border-gray-200">
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🚗</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No vehicles found</h3>
          <p className="text-gray-500 text-sm mb-6">
            Get started by adding your first vehicle to the inventory.
          </p>
          <Link
            to="/admin/vehicles/add"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Add Vehicle
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-sm rounded-lg border border-gray-200">
      {/* Bulk Actions Bar */}
      {selectedVehicles.size > 0 && (
        <div className="bg-blue-50 border-b border-blue-200 px-6 py-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-700 font-medium">
              {selectedVehicles.size} vehicle{selectedVehicles.size !== 1 ? 's' : ''} selected
            </span>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => onBulkAction('status_update', Array.from(selectedVehicles), 'Available')}
                className="text-sm bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md"
              >
                Mark Available
              </button>
              <button
                onClick={() => onBulkAction('status_update', Array.from(selectedVehicles), 'Sold')}
                className="text-sm bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md"
              >
                Mark Sold
              </button>
              <button
                onClick={() => onBulkAction('delete', Array.from(selectedVehicles))}
                className="text-sm bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table Header */}
      <div className="px-6 py-3 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={selectedVehicles.size === vehicles.length && vehicles.length > 0}
              onChange={handleSelectAll}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">
              Select All
            </span>
          </div>
          <button
            onClick={onRefresh}
            className="text-sm text-blue-600 hover:text-blue-500"
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Select
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('make')}
              >
                Vehicle {getSortIcon('make')}
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('year')}
              >
                Year {getSortIcon('year')}
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('price')}
              >
                Price {getSortIcon('price')}
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('mileage')}
              >
                Mileage {getSortIcon('mileage')}
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('status')}
              >
                Status {getSortIcon('status')}
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('createdAt')}
              >
                Added {getSortIcon('createdAt')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedVehicles.map((vehicle) => (
              <tr key={vehicle.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedVehicles.has(vehicle.id)}
                    onChange={() => handleSelectVehicle(vehicle.id)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      {vehicle.images && vehicle.images.length > 0 ? (
                        <img
                          src={vehicle.images[0].url}
                          alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                          className="h-10 w-10 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-lg bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-400 text-xs">🚗</span>
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {vehicle.make} {vehicle.model}
                      </div>
                      <div className="text-sm text-gray-500">
                        {vehicle.color} • {vehicle.transmission}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {vehicle.year}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {formatPrice(vehicle.price)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatMileage(vehicle.mileage)} km
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(vehicle.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(vehicle.createdAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    <Link
                      to={`/admin/vehicles/${vehicle.id}/edit`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => onDelete(vehicle.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VehicleList;
