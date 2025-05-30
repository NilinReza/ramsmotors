// Recent Activity Component
import React from 'react';
import { Link } from 'react-router-dom';

const RecentActivity = ({ vehicles = [] }) => {
  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Recently';
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      Available: 'bg-green-100 text-green-800',
      Sold: 'bg-red-100 text-red-800',
      Pending: 'bg-yellow-100 text-yellow-800'
    };

    return (
      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="bg-white shadow-sm rounded-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Recent Vehicles</h3>
          <Link
            to="/admin/vehicles"
            className="text-sm text-blue-600 hover:text-blue-500"
          >
            View all →
          </Link>
        </div>
      </div>
      
      <div className="p-6">
        {vehicles.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-400 text-4xl mb-4">🚗</div>
            <h4 className="text-lg font-medium text-gray-900 mb-2">No recent vehicles</h4>
            <p className="text-gray-500 text-sm">Vehicles you add will appear here.</p>
            <Link
              to="/admin/vehicles/add"
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Add your first vehicle
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {vehicles.map((vehicle) => (
              <div key={vehicle.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition duration-200">
                <div className="flex items-center space-x-4">
                  {/* Vehicle Image */}
                  <div className="flex-shrink-0 h-12 w-12">
                    {vehicle.images && vehicle.images.length > 0 ? (
                      <img
                        src={vehicle.images[0].url}
                        alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                        className="h-12 w-12 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400 text-sm">🚗</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Vehicle Info */}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {vehicle.year} {vehicle.make} {vehicle.model}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatPrice(vehicle.price)} • {vehicle.mileage?.toLocaleString()} km
                    </p>
                    <p className="text-xs text-gray-400">
                      Added {formatDate(vehicle.createdAt)}
                    </p>
                  </div>
                </div>

                {/* Status and Actions */}
                <div className="flex items-center space-x-3">
                  {getStatusBadge(vehicle.status)}
                  <Link
                    to={`/admin/vehicles/${vehicle.id}/edit`}
                    className="text-blue-600 hover:text-blue-500 text-sm font-medium"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentActivity;
