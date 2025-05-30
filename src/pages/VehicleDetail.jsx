import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiService from '../services/api';

const VehicleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadVehicle();
  }, [id]);
  const loadVehicle = async () => {
    try {
      setIsLoading(true);
      const response = await apiService.getVehicle(id);
      console.log('🔍 API Response:', response); // Debug log
      
      // Handle API response structure - extract vehicle from response.data
      const vehicleData = response.data || response;
      console.log('🔍 Vehicle Data:', vehicleData); // Debug log
      
      setVehicle(vehicleData);
    } catch (error) {
      setError('Vehicle not found');
      console.error('Error loading vehicle:', error);
    } finally {
      setIsLoading(false);
    }
  };

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

  const nextImage = () => {
    if (vehicle.images && vehicle.images.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === vehicle.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (vehicle.images && vehicle.images.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? vehicle.images.length - 1 : prev - 1
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="max-w-3xl mx-auto mt-12 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Vehicle Not Found</h1>
        <p className="text-gray-600 mb-6">The vehicle you're looking for doesn't exist or has been removed.</p>
        <button
          onClick={() => navigate('/inventory')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md transition duration-200"
        >
          Back to Inventory
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Image Gallery */}
        <div className="relative">
          {vehicle.images && vehicle.images.length > 0 ? (
            <div className="relative h-96 md:h-[500px]">
              <img
                src={vehicle.images[currentImageIndex].url}
                alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                className="w-full h-full object-cover"
              />
              
              {vehicle.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition"
                  >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition"
                  >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  
                  {/* Image indicators */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {vehicle.images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-3 h-3 rounded-full transition ${
                          index === currentImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="h-96 md:h-[500px] bg-gray-200 flex items-center justify-center">
              <div className="text-gray-400 text-center">
                <svg className="w-24 h-24 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p>No images available</p>
              </div>
            </div>
          )}
        </div>

        {/* Vehicle Information */}
        <div className="p-6 md:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Basic Info */}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                {vehicle.year} {vehicle.make} {vehicle.model}
              </h1>
              
              <div className="flex items-center space-x-4 mb-6">
                <span className="text-3xl md:text-4xl font-bold text-blue-600">
                  {formatPrice(vehicle.price)}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  vehicle.status === 'Available' ? 'bg-green-100 text-green-800' :
                  vehicle.status === 'Sold' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {vehicle.status}
                </span>
              </div>              {vehicle.description && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Description:</h3>
                  <p className="text-gray-700 leading-relaxed">{vehicle.description}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md transition duration-200">
                  Contact Dealer
                </button>
                <button
                  onClick={() => navigate('/inventory')}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-3 px-6 rounded-md transition duration-200"
                >
                  Back to Inventory
                </button>
              </div>
            </div>

            {/* Right Column - Specifications */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Vehicle Specifications</h3>
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="text-gray-600">Mileage</span>
                    <span className="font-medium">{formatMileage(vehicle.mileage)} km</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="text-gray-600">Transmission</span>
                    <span className="font-medium">{vehicle.transmission}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="text-gray-600">Fuel Type</span>
                    <span className="font-medium">{vehicle.fuelType}</span>
                  </div>                  <div className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="text-gray-600">Body Style</span>
                    <span className="font-medium">{vehicle.bodyStyle}</span>
                  </div>
                  {vehicle.color && (
                    <div className="flex justify-between border-b border-gray-200 pb-2">
                      <span className="text-gray-600">Color</span>
                      <span className="font-medium">{vehicle.color}</span>
                    </div>
                  )}
                  {vehicle.engineSize && (
                    <div className="flex justify-between border-b border-gray-200 pb-2">
                      <span className="text-gray-600">Engine</span>
                      <span className="font-medium">{vehicle.engineSize}</span>
                    </div>
                  )}                </div>
              </div>
            </div>
          </div>

          {/* Features Section */}
          {vehicle.features && vehicle.features.length > 0 && (
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Features</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {vehicle.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-md">
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Videos Section */}
          {vehicle.videos && vehicle.videos.length > 0 && (
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Videos</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {vehicle.videos.map((video, index) => (
                  <div key={video.id} className="rounded-lg overflow-hidden">
                    <video
                      controls
                      className="w-full h-64 object-cover"
                      poster={video.thumbnailUrl}
                    >
                      <source src={video.url} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Thumbnail Gallery */}
          {vehicle.images && vehicle.images.length > 1 && (
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Gallery</h3>
              <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                {vehicle.images.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`relative h-20 rounded-lg overflow-hidden border-2 transition ${
                      index === currentImageIndex ? 'border-blue-500' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={`${vehicle.year} ${vehicle.make} ${vehicle.model} - Image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VehicleDetail;