// Mock API Service for Testing UI Without Backend
// This simulates the Supabase API responses for immediate testing

import dataSync from '../utils/dataSync.js';

// Load vehicles from localStorage or use default mock data
const loadVehiclesFromStorage = () => {
  try {
    const stored = localStorage.getItem('mockVehicles');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.warn('Failed to load vehicles from localStorage:', error);
  }
  return [];
};

// Save vehicles to localStorage
const saveVehiclesToStorage = (vehicles) => {
  try {
    localStorage.setItem('mockVehicles', JSON.stringify(vehicles));
  } catch (error) {
    console.warn('Failed to save vehicles to localStorage:', error);
  }
};

// Default mock vehicle data
const defaultMockVehicles = [  {
    id: '1',
    vin: 'JH4TB2H26CC000001',
    make: 'Honda',
    model: 'Accord',
    year: 2023,
    price: 28500,
    mileage: 15000,
    transmission: 'Automatic',
    fuelType: 'Gasoline',
    bodyStyle: 'Sedan',
    color: 'Silver Metallic',
    engineSize: '2.0L 4-Cylinder',
    condition: 'Used',
    status: 'Available',
    description: 'Excellent condition Honda Accord with low mileage.',
    features: ['Air Conditioning', 'Bluetooth', 'Backup Camera', 'Cruise Control'],
    images: [
      {
        url: 'https://via.placeholder.com/400x300/007bff/ffffff?text=Honda+Accord',
        publicId: 'mock-honda-accord-1'
      }    ],
    videos: [],
    createdAt: new Date().toISOString()
  },  {
    id: '2',
    vin: 'JH4TB2H26CC000002',
    make: 'Toyota',
    model: 'Camry',
    year: 2022,
    price: 26900,
    mileage: 22000,
    transmission: 'Automatic',
    fuelType: 'Gasoline',
    bodyStyle: 'Sedan',
    color: 'Pearl White',
    engineSize: '2.5L 4-Cylinder',
    condition: 'Used',
    status: 'Available',
    description: 'Reliable Toyota Camry in great condition.',
    features: ['Air Conditioning', 'Bluetooth', 'Navigation System', 'Heated Seats'],
    images: [
      {
        url: 'https://via.placeholder.com/400x300/28a745/ffffff?text=Toyota+Camry',
        publicId: 'mock-toyota-camry-1'
      }
    ],
    videos: [],
    createdAt: new Date().toISOString()
  },  {
    id: '3',
    vin: 'JH4TB2H26CC000003',
    make: 'Ford',
    model: 'F-150',
    year: 2023,
    price: 35900,
    mileage: 8500,
    transmission: 'Automatic',
    fuelType: 'Gasoline',
    bodyStyle: 'Truck',
    color: 'Shadow Black',
    engineSize: '3.5L V6 Twin Turbo',
    condition: 'Used',
    status: 'Pending',
    description: 'Powerful Ford F-150 truck with excellent towing capacity.',
    features: ['Air Conditioning', 'Bluetooth', 'Backup Camera', 'Remote Start', 'Keyless Entry'],
    images: [
      {
        url: 'https://via.placeholder.com/400x300/dc3545/ffffff?text=Ford+F-150',
        publicId: 'mock-ford-f150-1'
      }
    ],
    videos: [],
    createdAt: new Date().toISOString()
  },
  {
    id: '4',
    vin: 'JH4TB2H26CC000004',
    make: 'BMW',
    model: 'X5',
    year: 2022,
    price: 52900,    mileage: 18000,
    transmission: 'Automatic',
    fuelType: 'Gasoline',
    bodyStyle: 'SUV',
    color: 'Alpine White',
    engineSize: '3.0L I6 Twin Turbo',
    condition: 'Used',
    status: 'Sold',
    description: 'Luxury BMW X5 with premium features.',
    features: ['Air Conditioning', 'Bluetooth', 'Navigation System', 'Leather Seats', 'Sunroof', 'Heated Seats'],images: [
      {
        url: 'https://via.placeholder.com/400x300/6c757d/ffffff?text=BMW+X5',
        publicId: 'mock-bmw-x5-1'
      }
    ],
    videos: [],
    createdAt: new Date().toISOString()  }
];

// Initialize vehicles from localStorage or use defaults
let mockVehicles = loadVehiclesFromStorage();

// 🔄 FORCE REFRESH: Check if stored vehicles have the new complete structure
const needsRefresh = mockVehicles.length === 0 || 
  !mockVehicles[0]?.condition || // Missing condition field 
  !mockVehicles[0]?.engineSize;  // Missing engineSize field

if (needsRefresh) {
  console.log('🔄 Mock API: Refreshing vehicles with complete structure');
  mockVehicles = [...defaultMockVehicles];
  saveVehiclesToStorage(mockVehicles);
  console.log('✅ Mock API: Vehicles refreshed with complete data');
}

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Transform vehicle data from camelCase (mock storage) to snake_case (expected by VehicleForm)
const transformVehicleForResponse = (vehicle) => {
  if (!vehicle) return vehicle;
  
  console.log('🔄 Mock API: Transforming vehicle for response');
  console.log('🔍 Input vehicle:', vehicle);
  
  const transformed = {
    ...vehicle,
    // Transform camelCase to snake_case for VehicleForm compatibility
    exterior_color: vehicle.color || vehicle.exterior_color,
    fuel_type: vehicle.fuelType || vehicle.fuel_type,
    body_style: vehicle.bodyStyle || vehicle.body_style,
    
    // Map engine field (mock data uses 'engineSize', VehicleForm expects 'engine')
    engine: vehicle.engineSize || vehicle.engine,
    
    // Ensure all required fields exist with fallbacks
    make: vehicle.make || '',
    model: vehicle.model || '',
    year: vehicle.year || new Date().getFullYear(),
    price: vehicle.price || '',
    mileage: vehicle.mileage || '',
    transmission: vehicle.transmission || 'Automatic',
    vin: vehicle.vin || '',
    description: vehicle.description || '',
    features: vehicle.features || [],
    condition: vehicle.condition || 'Used',
    status: vehicle.status || 'Available',
    images: vehicle.images || [],
    videos: vehicle.videos || [],
    createdAt: vehicle.createdAt || new Date().toISOString()
  };
  
  console.log('✅ Transformed vehicle:', transformed);
  console.log('🔍 Key fields check:');
  console.log('  make:', transformed.make);
  console.log('  model:', transformed.model);
  console.log('  exterior_color:', transformed.exterior_color);
  console.log('  engine:', transformed.engine);
  console.log('  price:', transformed.price);
  
  return transformed;
};

const mockApiService = {
  // Authentication methods
  async login(credentials) {
    console.log('🧪 Mock API login called with:', JSON.stringify(credentials));
    console.log('🧪 Username:', credentials && credentials.username);
    console.log('🧪 Password provided:', credentials && !!credentials.password);
    await delay(1000);
    // Validate credentials format
    if (!credentials || typeof credentials !== 'object') {
      console.error('❌ Invalid credentials format:', credentials);
      return {
        success: false,
        error: 'Invalid credentials format'
      };
    }
    if (credentials.username === 'admin' && credentials.password === 'admin123') {
      const mockToken = 'mock-jwt-token-' + Date.now();
      localStorage.setItem('authToken', mockToken);
      console.log('✅ Mock login successful, token:', mockToken);
      return {
        success: true,
        token: mockToken,
        user: { id: 1, username: 'admin', role: 'admin' }
      };
    }
    console.log('❌ Mock login failed - invalid credentials');
    console.log('Expected: username=admin, password=admin123');
    console.log('Received: username=' + (credentials && credentials.username));
    return {
      success: false,
      error: 'Invalid credentials'
    };
  },

  async register(userData) {
    await delay(1000);
    const mockToken = 'mock-jwt-token-' + Date.now();
    localStorage.setItem('authToken', mockToken);
    return {
      success: true,
      token: mockToken,
      user: { id: Date.now(), username: userData.username, role: 'admin' }
    };
  },
  async validateToken() {
    await delay(500);
    const token = localStorage.getItem('authToken');
    if (token && token.startsWith('mock-jwt-token-')) {
      return {
        success: true,
        user: { id: 1, username: 'admin', role: 'admin' }
      };
    }
    return { success: false, error: 'Invalid token' };
  },
  async logout() {
    await delay(500);
    localStorage.removeItem('authToken');
    return { success: true };
  },

  // Vehicle CRUD operations
  async getVehicles(filters = {}) {
    try {
      console.log('🧪 Mock API: Getting vehicles with filters:', filters);
      await delay(800);
      
      // Make a safe copy of the mock vehicles
      let vehicles = [...mockVehicles];
      console.log('🧪 Mock API: Total vehicles before filtering:', vehicles.length);
      
      // Apply filters safely
      try {
        // Apply filters with null checks and try/catch for each filter
        if (filters.make) {
          vehicles = vehicles.filter(v => v && v.make && v.make.toLowerCase().includes(filters.make.toLowerCase()));
        }
        if (filters.model) {
          vehicles = vehicles.filter(v => v && v.model && v.model.toLowerCase().includes(filters.model.toLowerCase()));
        }
        if (filters.year && !isNaN(parseInt(filters.year))) {
          vehicles = vehicles.filter(v => v && v.year && v.year === parseInt(filters.year));
        }
        if (filters.minPrice && !isNaN(parseInt(filters.minPrice))) {
          vehicles = vehicles.filter(v => v && v.price && v.price >= parseInt(filters.minPrice));
        }
        if (filters.maxPrice && !isNaN(parseInt(filters.maxPrice))) {
          vehicles = vehicles.filter(v => v && v.price && v.price <= parseInt(filters.maxPrice));
        }
        if (filters.status) {
          vehicles = vehicles.filter(v => v && v.status && v.status === filters.status);
        }
      } catch (filterError) {
        console.error('🧪 Mock API: Error applying filters:', filterError);
      }
        console.log('🧪 Mock API: Returning filtered vehicles:', vehicles.length);
      
      // Transform all vehicles for VehicleForm compatibility
      const transformedVehicles = vehicles.map(transformVehicleForResponse);
      
      return {
        data: transformedVehicles,
        count: transformedVehicles.length
      };
    } catch (error) {
      console.error('🧪 Mock API: Critical error in getVehicles:', error);
      // Return empty data rather than throwing to avoid breaking the UI
      return {
        data: [],
        count: 0,
        error: error.message
      };
    }
  },
  async getVehicle(id) {
    await delay(500);
    const vehicle = mockVehicles.find(v => v.id === id);
    if (!vehicle) {
      throw new Error('Vehicle not found');
    }
    // Transform field names for VehicleForm compatibility
    const transformedVehicle = transformVehicleForResponse(vehicle);
    return { data: transformedVehicle };
  },async createVehicle(vehicleData) {
    await delay(1000);
    
    // Process images if they exist
    const processedImages = [];
    if (vehicleData.images && vehicleData.images.length > 0) {
      vehicleData.images.forEach((imageDataUrl, index) => {
        processedImages.push({
          url: imageDataUrl, // Use the base64 data URL directly for display
          publicId: `mock-vehicle-${Date.now()}-${index}`
        });
      });
    }
    
    // Process videos if they exist
    const processedVideos = [];
    if (vehicleData.videos && vehicleData.videos.length > 0) {
      vehicleData.videos.forEach((videoDataUrl, index) => {
        processedVideos.push({
          url: videoDataUrl, // Use the base64 data URL directly for display
          publicId: `mock-video-${Date.now()}-${index}`,
          thumbnailUrl: 'https://via.placeholder.com/400x300/007bff/ffffff?text=Video+Thumbnail'
        });
      });
    }
    
    const newVehicle = {
      id: (mockVehicles.length + 1).toString(),
      ...vehicleData,
      images: processedImages,
      videos: processedVideos,
      createdAt: new Date().toISOString()
    };
    
    console.log('🧪 Mock API: Created vehicle with images:', newVehicle.images.length, 'videos:', newVehicle.videos.length);
    mockVehicles.push(newVehicle);
    saveVehiclesToStorage(mockVehicles);
    
    // Emit data sync event for real-time updates
    dataSync.vehicleCreated(newVehicle);
    
    return { data: newVehicle };
  },
  async updateVehicle(id, updates) {
    await delay(800);
    const index = mockVehicles.findIndex(v => v.id === id);
    if (index === -1) {
      throw new Error('Vehicle not found');
    }
    
    mockVehicles[index] = { ...mockVehicles[index], ...updates };
    saveVehiclesToStorage(mockVehicles);
    
    // Emit data sync event for real-time updates
    dataSync.vehicleUpdated(mockVehicles[index]);
    
    return { data: mockVehicles[index] };
  },
  async deleteVehicle(id) {
    await delay(600);
    const index = mockVehicles.findIndex(v => v.id === id);
    if (index === -1) {
      throw new Error('Vehicle not found');
    }
    
    const deletedVehicle = mockVehicles.splice(index, 1)[0];
    saveVehiclesToStorage(mockVehicles);
    
    // Emit data sync event for real-time updates
    dataSync.vehicleDeleted(deletedVehicle);
    
    return { data: deletedVehicle };
  },
  // Bulk operations
  async bulkDeleteVehicles(vehicleIds) {
    await delay(1500);
    const deletedVehicles = [];
    vehicleIds.forEach(id => {
      const index = mockVehicles.findIndex(v => v.id === id);
      if (index !== -1) {
        deletedVehicles.push(mockVehicles.splice(index, 1)[0]);
      }
    });
    saveVehiclesToStorage(mockVehicles);
    
    // Emit data sync event for real-time updates
    dataSync.vehiclesBulkDeleted(deletedVehicles);
    
    return { 
      data: deletedVehicles, 
      count: deletedVehicles.length 
    };
  },

  // Legacy method for compatibility
  async uploadFiles(files) {
    await delay(2000);
    // Mock Cloudinary response
    return files.map((file, index) => ({
      url: `https://via.placeholder.com/400x300/007bff/ffffff?text=Mock+Image+${index + 1}`,
      publicId: `mock-upload-${Date.now()}-${index}`
    }));
  },

  // Contact form
  async submitContactForm(formData) {
    await delay(1000);
    console.log('Mock contact form submission:', formData);
    return { success: true, message: 'Message sent successfully!' };
  }
};

export default mockApiService;
