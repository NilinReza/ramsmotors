import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import cars from '../data/cars';

const VehicleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const car = cars.find(c => c.id === parseInt(id));

  if (!car) return <div className="text-center mt-10">Vehicle not found.</div>;

  return (
    <div className="max-w-3xl mx-auto mt-12 bg-white p-8 rounded-xl shadow-lg">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-4">{car.year} {car.make} {car.model}</h1>
      <p className="text-2xl text-blue-700 font-semibold mb-4">Price: {car.price}</p>
      <p className="text-lg text-gray-700 mb-6 leading-relaxed">{car.description}</p>
      <div className="flex space-x-4">
        <button className="bg-blue-900 text-white px-6 py-3 rounded-md text-lg hover:bg-blue-800 transition">Contact Dealer</button>
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-300 text-gray-800 px-6 py-3 rounded-md text-lg hover:bg-gray-400 transition"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default VehicleDetail;