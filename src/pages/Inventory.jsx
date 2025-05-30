import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import apiService from '../services/api';
import VehicleGrid from '../components/VehicleGrid';

const Inventory = () => {
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  // Filter states
  const [filters, setFilters] = useState({
    search: '',
    make: '',
    model: '',
    minYear: '',
    maxYear: '',
    minPrice: '',
    maxPrice: '',
    minMileage: '',
    maxMileage: '',
    transmission: '',
    fuelType: '',
    bodyStyle: '',
    color: '',
    isAvailable: true // Only show available vehicles by default
  });
  useEffect(() => {
    loadVehicles();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [vehicles, filters]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadVehicles = async () => {
    try {
      console.log('📦 Starting to load vehicles...');
      setIsLoading(true);
      setError('');
      
      console.log('📡 Calling apiService.getVehicles()...');
      const response = await apiService.getVehicles();
      
      console.log('📬 Raw API response:', response);
      console.log('📬 Response type:', typeof response);
      console.log('📬 Response keys:', Object.keys(response || {}));
      
      // Extract the vehicles array from the API response
      const vehiclesData = response.data || response;
      
      console.log('🚗 Vehicles data:', vehiclesData);
      console.log('🚗 Vehicles data type:', typeof vehiclesData);
      console.log('🚗 Is array:', Array.isArray(vehiclesData));
      console.log('🚗 Length:', vehiclesData?.length);
      
      const finalVehicles = Array.isArray(vehiclesData) ? vehiclesData : [];
      
      console.log('✅ Final vehicles to set:', finalVehicles);
      console.log('✅ Final count:', finalVehicles.length);
      
      setVehicles(finalVehicles);
      
      console.log('✅ Vehicles loaded successfully, count:', finalVehicles.length);
      
    } catch (error) {
      console.error('❌ Error loading vehicles:', error);
      console.error('❌ Error message:', error.message);
      console.error('❌ Error stack:', error.stack);
      setError('Failed to load vehicles. Please try again later.');
    } finally {
      setIsLoading(false);
      console.log('📦 Load vehicles process completed');
    }
  };  const applyFilters = () => {
    try {
      console.log('🔍 Applying filters to', vehicles.length, 'vehicles');
      
      let filtered = vehicles.filter(vehicle => {
        try {
          // Null check for vehicle
          if (!vehicle) return false;
          
          // Search filter
          if (filters.search) {
            const searchTerm = filters.search.toLowerCase();
            // Handle potentially undefined properties safely
            const make = vehicle.make || '';
            const model = vehicle.model || '';
            const year = vehicle.year || '';
            const color = vehicle.color || '';
            const vehicleText = `${make} ${model} ${year} ${color}`.toLowerCase();
            if (!vehicleText.includes(searchTerm)) return false;
          }

          // Make filter - with null check
          if (filters.make && vehicle.make && vehicle.make !== filters.make) return false;

          // Model filter - with null check
          if (filters.model && vehicle.model && vehicle.model !== filters.model) return false;

          // Year filters - with safe parseInt
          if (filters.minYear && vehicle.year && vehicle.year < parseInt(filters.minYear || '0')) return false;
          if (filters.maxYear && vehicle.year && vehicle.year > parseInt(filters.maxYear || '9999')) return false;

          // Price filters - with safe parseFloat
          if (filters.minPrice && vehicle.price && vehicle.price < parseFloat(filters.minPrice || '0')) return false;
          if (filters.maxPrice && vehicle.price && vehicle.price > parseFloat(filters.maxPrice || '999999999')) return false;

          // Mileage filters - with safe parseInt
          if (filters.minMileage && vehicle.mileage && vehicle.mileage < parseInt(filters.minMileage || '0')) return false;
          if (filters.maxMileage && vehicle.mileage && vehicle.mileage > parseInt(filters.maxMileage || '9999999')) return false;
            // Other filters - all with null checks
          if (filters.transmission && vehicle.transmission && vehicle.transmission !== filters.transmission) return false;
          if (filters.fuelType && vehicle.fuelType && vehicle.fuelType !== filters.fuelType) return false;
          if (filters.bodyStyle && vehicle.bodyStyle && vehicle.bodyStyle !== filters.bodyStyle) return false;
          if (filters.color && vehicle.color && vehicle.color.toLowerCase() !== filters.color.toLowerCase()) return false;
          
          // Available filter - check status instead of isAvailable
          if (filters.isAvailable !== null && filters.isAvailable !== undefined) {
            if (filters.isAvailable && vehicle.status !== 'Available') return false;
            if (!filters.isAvailable && vehicle.status === 'Available') return false;
          }
              
          return true; // Pass all filters
        } catch (error) {
          console.error('❌ Filter error for vehicle:', vehicle, error);
          return false; // Exclude problematic vehicles from results
        }
      });
      
      console.log('✅ Filter applied successfully. Results:', filtered.length);
      setFilteredVehicles(filtered);
      
    } catch (error) {
      console.error('❌ Error in applyFilters:', error);
      // Fallback to showing all vehicles if filtering fails
      setFilteredVehicles(vehicles);
    }
  };

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const clearFilters = () => {
    setFilters({
      search: '',
      make: '',
      model: '',
      minYear: '',
      maxYear: '',
      minPrice: '',
      maxPrice: '',
      minMileage: '',
      maxMileage: '',
      transmission: '',
      fuelType: '',
      bodyStyle: '',
      color: '',
      isAvailable: true
    });
  };
  // Get unique values for filter dropdowns
  const getUniqueValues = (field) => {
    const values = vehicles.map(vehicle => vehicle[field]).filter(Boolean);
    return [...new Set(values)].sort();
  };

  // Get year options from available vehicles
  const getYearOptions = () => {
    const years = vehicles.map(vehicle => vehicle.year).filter(Boolean);
    const uniqueYears = [...new Set(years)].sort((a, b) => a - b);
    return uniqueYears;
  };

  // Get price options in increments based on available vehicles
  const getPriceOptions = () => {
    const prices = vehicles.map(vehicle => vehicle.price).filter(Boolean);
    if (prices.length === 0) return [];
    
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const increment = 5000; // $5,000 increments
    
    const options = [];
    for (let price = Math.floor(minPrice / increment) * increment; price <= Math.ceil(maxPrice / increment) * increment; price += increment) {
      if (price >= minPrice) {
        options.push(price);
      }
    }
    return options;
  };

  // Get mileage options in increments based on available vehicles
  const getMileageOptions = () => {
    const mileages = vehicles.map(vehicle => vehicle.mileage).filter(Boolean);
    if (mileages.length === 0) return [];
    
    const minMileage = Math.min(...mileages);
    const maxMileage = Math.max(...mileages);
    const increment = 10000; // 10,000 mile increments
    
    const options = [];
    for (let mileage = Math.floor(minMileage / increment) * increment; mileage <= Math.ceil(maxMileage / increment) * increment; mileage += increment) {
      if (mileage >= minMileage) {
        options.push(mileage);
      }
    }
    return options;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  return (
    <>
      <Helmet>
        <title>Vehicle Inventory - Quality Pre-Owned Cars | Rams Motors</title>
        <meta name="description" content="Browse our extensive inventory of quality pre-owned vehicles in Scarborough. Search by make, model, price, mileage and more. Find your perfect car at Rams Motors today!" />
        <meta name="keywords" content="used car inventory, pre-owned vehicles Scarborough, car search, vehicle filters, Honda Civic, Ford Mustang, Jeep Grand Cherokee, automotive inventory" />
        <link rel="canonical" href="https://ramsmotors.ca/inventory" />
        <meta property="og:title" content="Vehicle Inventory - Quality Pre-Owned Cars | Rams Motors" />
        <meta property="og:description" content="Browse our extensive inventory of quality pre-owned vehicles. Advanced search filters to find your perfect car." />
        <meta property="og:url" content="https://ramsmotors.ca/inventory" />
      </Helmet>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Inventory</h1>
        <p className="text-lg text-gray-600">
          Discover your perfect vehicle from our extensive collection
        </p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Search and Filter Controls */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        {/* Search Bar */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by make, model, year, or color..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
          />
        </div>

        {/* Filter Toggle */}
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            <span>Advanced Filters</span>
            <svg
              className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              {filteredVehicles.length} of {vehicles.length} vehicles
            </span>
            <button
              onClick={clearFilters}
              className="text-gray-500 hover:text-gray-700 text-sm font-medium"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pt-4 border-t">
            {/* Make */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Make</label>
              <select
                value={filters.make}
                onChange={(e) => handleFilterChange('make', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Makes</option>
                {getUniqueValues('make').map(make => (
                  <option key={make} value={make}>{make}</option>
                ))}
              </select>
            </div>

            {/* Model */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
              <select
                value={filters.model}
                onChange={(e) => handleFilterChange('model', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Models</option>
                {getUniqueValues('model').map(model => (
                  <option key={model} value={model}>{model}</option>
                ))}
              </select>
            </div>            {/* Year Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Min Year</label>
              <select
                value={filters.minYear}
                onChange={(e) => handleFilterChange('minYear', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Any Year</option>
                {getYearOptions().map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Year</label>
              <select
                value={filters.maxYear}
                onChange={(e) => handleFilterChange('maxYear', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Any Year</option>
                {getYearOptions().reverse().map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Min Price ($)</label>
              <select
                value={filters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Any Price</option>
                {getPriceOptions().map(price => (
                  <option key={price} value={price}>${price.toLocaleString()}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Price ($)</label>
              <select
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Any Price</option>
                {getPriceOptions().reverse().map(price => (
                  <option key={price} value={price}>${price.toLocaleString()}</option>
                ))}
              </select>
            </div>

            {/* Mileage Range */}            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Min Mileage</label>
              <select
                value={filters.minMileage}
                onChange={(e) => handleFilterChange('minMileage', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Any Mileage</option>
                {getMileageOptions().map(mileage => (
                  <option key={mileage} value={mileage}>{mileage.toLocaleString()} kilometres</option>
                ))}
              </select>
            </div>            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Mileage</label>
              <select
                value={filters.maxMileage}
                onChange={(e) => handleFilterChange('maxMileage', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Any Mileage</option>
                {getMileageOptions().reverse().map(mileage => (
                  <option key={mileage} value={mileage}>{mileage.toLocaleString()} kilometres</option>
                ))}
              </select>
            </div>

            {/* Transmission */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Transmission</label>
              <select
                value={filters.transmission}
                onChange={(e) => handleFilterChange('transmission', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Types</option>
                {getUniqueValues('transmission').map(transmission => (
                  <option key={transmission} value={transmission}>{transmission}</option>
                ))}
              </select>
            </div>

            {/* Fuel Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fuel Type</label>
              <select
                value={filters.fuelType}
                onChange={(e) => handleFilterChange('fuelType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Types</option>
                {getUniqueValues('fuelType').map(fuelType => (
                  <option key={fuelType} value={fuelType}>{fuelType}</option>
                ))}
              </select>
            </div>

            {/* Body Style */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Body Style</label>
              <select
                value={filters.bodyStyle}
                onChange={(e) => handleFilterChange('bodyStyle', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Styles</option>
                {getUniqueValues('bodyStyle').map(bodyStyle => (
                  <option key={bodyStyle} value={bodyStyle}>{bodyStyle}</option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>      {/* Refresh Inventory Button */}
      <div className="mb-8 text-center">
        <button
          onClick={loadVehicles}
          className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Refresh Inventory
        </button>
      </div>

      {/* Vehicle Grid */}
      <VehicleGrid vehicles={filteredVehicles} />
      </div>
    </>
  );
};

export default Inventory;
