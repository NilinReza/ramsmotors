import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import cars from '../data/cars';

const Inventory = () => {
  const [search, setSearch] = useState('');

  const filteredCars = cars.filter(car =>
    `${car.make} ${car.model}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="mt-10">
      <h1 className="text-4xl font-bold mb-8 text-center text-blue-900">Inventory</h1>
      <div className="max-w-md mx-auto mb-8">
        <input
          type="text"
          placeholder="Search by make or model..."
          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredCars.map(car => (
          <Link to={`/inventory/${car.id}`} key={car.id} className="no-underline text-inherit">
            <div className="border rounded-xl shadow-md bg-white p-6 hover:shadow-xl transition duration-200">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">{car.year} {car.make} {car.model}</h2>
              <p className="text-lg text-blue-700 font-medium">Price: {car.price}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Inventory;