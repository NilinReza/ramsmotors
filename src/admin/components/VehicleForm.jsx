import React, { useState, useEffect } from 'react';
import { XMarkIcon, PhotoIcon } from '@heroicons/react/24/outline';

const VehicleForm = ({ vehicle = null, onSubmit, onCancel, isLoading = false }) => {  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    price: '',
    mileage: '',
    color: '',
    transmission: 'Automatic',
    fuelType: 'Gasoline',
    bodyType: 'Sedan',
    engine: '',
    vin: '',
    description: '',
    features: [],
    condition: 'Used',
    status: 'Available',
    images: [],
    ...vehicle
  });
  const [errors, setErrors] = useState({});
  const [imageFiles, setImageFiles] = useState([]);
  const [videoFiles, setVideoFiles] = useState([]);
  useEffect(() => {
    if (vehicle) {
      setFormData(prev => ({ ...prev, ...vehicle }));
    }
  }, [vehicle]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleFeatureToggle = (feature) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(prev => [...prev, ...files]);
    
    // Create preview URLs
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, e.target.result]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const handleVideoUpload = (e) => {
    const files = Array.from(e.target.files);
    setVideoFiles(prev => [...prev, ...files]);
    
    // Create preview URLs for videos
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({
          ...prev,
          videos: [...(prev.videos || []), e.target.result]
        }));
      };
      reader.readAsDataURL(file);
    });
  };
  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  const removeVideo = (index) => {
    setFormData(prev => ({
      ...prev,
      videos: prev.videos.filter((_, i) => i !== index)
    }));
    setVideoFiles(prev => prev.filter((_, i) => i !== index));
  };
  const validateForm = () => {
    const newErrors = {};

    // Required fields validation
    if (!formData.make.trim()) newErrors.make = 'Make is required';
    if (!formData.model.trim()) newErrors.model = 'Model is required';
    if (!formData.year || formData.year < 1900 || formData.year > new Date().getFullYear() + 1) {
      newErrors.year = 'Valid year is required';
    }
    if (!formData.price || formData.price <= 0) newErrors.price = 'Valid price is required';
    if (!formData.mileage && formData.mileage !== 0) newErrors.mileage = 'Mileage is required';
    if (formData.mileage < 0) newErrors.mileage = 'Mileage cannot be negative';
    if (!formData.color.trim()) newErrors.color = 'Color is required';
    if (!formData.transmission.trim()) newErrors.transmission = 'Transmission is required';
    if (!formData.fuelType.trim()) newErrors.fuelType = 'Fuel Type is required';
    if (!formData.bodyType.trim()) newErrors.bodyType = 'Body Type is required';
    if (!formData.condition.trim()) newErrors.condition = 'Condition is required';
    if (!formData.engine.trim()) newErrors.engine = 'Engine is required';
    if (!formData.vin.trim()) newErrors.vin = 'VIN is required';
    if (formData.vin.trim().length !== 17) newErrors.vin = 'VIN must be 17 characters';
    if (!formData.description.trim()) newErrors.description = 'Description is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({ ...formData, imageFiles, videoFiles });
    }
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear + 1 - i);

  const availableFeatures = [
    'Air Conditioning', 'Bluetooth', 'Backup Camera', 'Navigation System',
    'Leather Seats', 'Sunroof', 'Heated Seats', 'Remote Start',
    'Keyless Entry', 'Cruise Control', 'USB Ports', 'Apple CarPlay',
    'Android Auto', 'Blind Spot Monitoring', 'Lane Departure Warning',
    'Automatic Emergency Braking', 'Adaptive Cruise Control', 'Parking Sensors'
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">
          {vehicle ? 'Edit Vehicle' : 'Add New Vehicle'}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Make *
            </label>
            <input
              type="text"
              value={formData.make}
              onChange={(e) => handleInputChange('make', e.target.value)}
              className={`w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.make ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="e.g., Toyota"
            />
            {errors.make && <p className="mt-1 text-sm text-red-600">{errors.make}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Model *
            </label>
            <input
              type="text"
              value={formData.model}
              onChange={(e) => handleInputChange('model', e.target.value)}
              className={`w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.model ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="e.g., Camry"
            />
            {errors.model && <p className="mt-1 text-sm text-red-600">{errors.model}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Year *
            </label>
            <select
              value={formData.year}
              onChange={(e) => handleInputChange('year', parseInt(e.target.value))}
              className={`w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.year ? 'border-red-300' : 'border-gray-300'
              }`}
            >
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
            {errors.year && <p className="mt-1 text-sm text-red-600">{errors.year}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price *
            </label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) => handleInputChange('price', parseFloat(e.target.value))}
              className={`w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.price ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="25000"
              min="0"
            />
            {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
          </div>          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mileage *
            </label>
            <input
              type="number"
              value={formData.mileage}
              onChange={(e) => handleInputChange('mileage', parseInt(e.target.value))}
              className={`w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.mileage ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="50000"
              min="0"
            />
            {errors.mileage && <p className="mt-1 text-sm text-red-600">{errors.mileage}</p>}
          </div><div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color *
            </label>
            <input
              type="text"
              value={formData.color}
              onChange={(e) => handleInputChange('color', e.target.value)}
              className={`w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.color ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="e.g., Black"
            />
            {errors.color && <p className="mt-1 text-sm text-red-600">{errors.color}</p>}
          </div>
        </div>

        {/* Vehicle Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Transmission *
            </label>
            <select
              value={formData.transmission}
              onChange={(e) => handleInputChange('transmission', e.target.value)}
              className={`w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.transmission ? 'border-red-300' : 'border-gray-300'
              }`}
            >
              <option value="Automatic">Automatic</option>
              <option value="Manual">Manual</option>
              <option value="CVT">CVT</option>
            </select>
            {errors.transmission && <p className="mt-1 text-sm text-red-600">{errors.transmission}</p>}
          </div>          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fuel Type *
            </label>
            <select
              value={formData.fuelType}
              onChange={(e) => handleInputChange('fuelType', e.target.value)}
              className={`w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.fuelType ? 'border-red-300' : 'border-gray-300'
              }`}
            >
              <option value="Gasoline">Gasoline</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Electric">Electric</option>
              <option value="Diesel">Diesel</option>
            </select>
            {errors.fuelType && <p className="mt-1 text-sm text-red-600">{errors.fuelType}</p>}
          </div><div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Body Type *
            </label>
            <select
              value={formData.bodyType}
              onChange={(e) => handleInputChange('bodyType', e.target.value)}
              className={`w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.bodyType ? 'border-red-300' : 'border-gray-300'
              }`}
            >
              <option value="Sedan">Sedan</option>
              <option value="SUV">SUV</option>
              <option value="Truck">Truck</option>
              <option value="Coupe">Coupe</option>
              <option value="Hatchback">Hatchback</option>
              <option value="Convertible">Convertible</option>
              <option value="Wagon">Wagon</option>
            </select>
            {errors.bodyType && <p className="mt-1 text-sm text-red-600">{errors.bodyType}</p>}
          </div>          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Condition *
            </label>
            <select
              value={formData.condition}
              onChange={(e) => handleInputChange('condition', e.target.value)}
              className={`w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.condition ? 'border-red-300' : 'border-gray-300'
              }`}
            >
              <option value="New">New</option>
              <option value="Used">Used</option>
              <option value="Certified Pre-Owned">Certified Pre-Owned</option>
            </select>
            {errors.condition && <p className="mt-1 text-sm text-red-600">{errors.condition}</p>}
          </div>
        </div>

        {/* Engine and VIN */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Engine *
            </label>
            <input
              type="text"
              value={formData.engine}
              onChange={(e) => handleInputChange('engine', e.target.value)}
              className={`w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.engine ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="e.g., 2.0L 4-Cylinder"
            />
            {errors.engine && <p className="mt-1 text-sm text-red-600">{errors.engine}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              VIN *
            </label>
            <input
              type="text"
              value={formData.vin}
              onChange={(e) => handleInputChange('vin', e.target.value.toUpperCase())}
              className={`w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.vin ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="17-character VIN"
              maxLength="17"
            />
            {errors.vin && <p className="mt-1 text-sm text-red-600">{errors.vin}</p>}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            className={`w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.description ? 'border-red-300' : 'border-gray-300'
            }`}
            rows={3}
            placeholder="Enter a detailed description of the vehicle"
          />
          {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
        </div>

        {/* Features */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Features
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {availableFeatures.map(feature => (
              <label key={feature} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.features.includes(feature)}
                  onChange={() => handleFeatureToggle(feature)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{feature}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Images */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Images
          </label>
          
          <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center hover:border-gray-400 transition-colors">
            <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-4">
              <label htmlFor="images" className="cursor-pointer">
                <span className="mt-2 block text-sm font-medium text-gray-900">
                  Click to upload images
                </span>
                <input
                  id="images"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="sr-only"
                />
              </label>
            </div>
          </div>

          {/* Image Previews */}
          {formData.images.length > 0 && (
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
              {formData.images.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={image}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-24 object-cover rounded-md border border-gray-300"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>          )}
        </div>

        {/* Video Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Videos
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center hover:border-gray-400 transition-colors">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <div className="mt-4">
              <label htmlFor="videos" className="cursor-pointer">
                <span className="mt-2 block text-sm font-medium text-gray-900">
                  Click to upload videos
                </span>
                <input
                  id="videos"
                  type="file"
                  multiple
                  accept="video/*"
                  onChange={handleVideoUpload}
                  className="sr-only"
                />
              </label>
            </div>
          </div>

          {/* Video Previews */}
          {formData.videos && formData.videos.length > 0 && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              {formData.videos.map((video, index) => (
                <div key={index} className="relative">
                  <video
                    src={video}
                    className="w-full h-32 object-cover rounded-md border border-gray-300"
                    controls
                  />
                  <button
                    type="button"
                    onClick={() => removeVideo(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label><select
            value={formData.status}
            onChange={(e) => handleInputChange('status', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="Available">Available</option>
            <option value="Pending">Pending</option>
            <option value="Sold">Sold</option>
            <option value="Draft">Draft</option>
          </select>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Saving...' : (vehicle ? 'Update Vehicle' : 'Add Vehicle')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default VehicleForm;
