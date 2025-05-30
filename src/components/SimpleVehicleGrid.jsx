import React from 'react';

const SimpleVehicleGrid = ({ vehicles }) => {
  if (!vehicles || vehicles.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No vehicles found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {vehicles.map((vehicle) => (
        <div key={vehicle.id} className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {vehicle.year} {vehicle.make} {vehicle.model}
            </h3>
            <p className="text-xl font-bold text-blue-600">
              ${vehicle.price?.toLocaleString()}
            </p>
            <div className="text-sm text-gray-600 mt-2">
              <p>Mileage: {vehicle.mileage?.toLocaleString()} km</p>
              <p>Transmission: {vehicle.transmission}</p>
              <p>Fuel: {vehicle.fuelType}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SimpleVehicleGrid;
