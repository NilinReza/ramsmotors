// Clean API service for Rams Motors
import mockApiService from './mockApi';
import supabaseApiService from './supabaseApi';
import supabaseVehicleService from './supabaseVehicleService';

// Environment-based configuration
// In production, if SUPABASE_URL is set, use Supabase, otherwise use mock data
// Also allow forcing mock data with environment variable
const USE_MOCK_DATA = process.env.REACT_APP_USE_MOCK_DATA === 'true' || 
                     (!process.env.REACT_APP_SUPABASE_URL || 
                      process.env.REACT_APP_SUPABASE_URL === 'YOUR_SUPABASE_URL');

class ApiService {
  constructor() {
    this.token = localStorage.getItem('authToken');
    
    console.log('🔧 ApiService initialized:', {
      useMockData: USE_MOCK_DATA,
      environment: process.env.NODE_ENV,
      hasSupabaseUrl: !!process.env.REACT_APP_SUPABASE_URL,
      supabaseUrlValue: process.env.REACT_APP_SUPABASE_URL
    });
    
    if (USE_MOCK_DATA) {
      console.log('🧪 TESTING MODE: Using mock data');
    } else {
      console.log('🔗 PRODUCTION MODE: Using Supabase');
    }
  }
  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('authToken', token);
    } else {
      localStorage.removeItem('authToken');
    }
  }

  getToken() {
    return this.token;
  }  async login(credentials) {
    console.log('🔐 Login called with:', { 
      username: credentials.username,
      hasPassword: !!credentials.password,
      useMockData: USE_MOCK_DATA,
      environment: process.env.NODE_ENV
    });
    
    if (USE_MOCK_DATA) {
      const result = await mockApiService.login(credentials);
      if (result.success && result.token) {
        this.setToken(result.token);
      }
      return result;
    }
    
    // Supabase implementation - map credentials for production
    try {
      // Map credentials for different environments
      let email, password;
      
      // For production, handle the admin@ramsmotors.com case
      if (credentials.username === 'admin' && credentials.password === 'admin123') {
        // Development credentials -> map to production credentials
        email = 'admin@ramsmotors.com';
        password = 'password123';
        console.log('🔄 Mapping development credentials to production format');
      } else if (credentials.username === 'admin@ramsmotors.com') {
        // Production credentials format
        email = credentials.username;
        password = credentials.password;
      } else {
        // Use credentials as provided
        email = credentials.username || credentials.email;
        password = credentials.password;
      }
      
      if (!email || !password) {
        return {
          success: false,
          error: 'Email and password are required'
        };
      }
      
      console.log('🔐 Attempting Supabase authentication with email:', email);
      
      // Ensure we're passing individual parameters, not the credentials object
      const result = await supabaseApiService.login(email, password);
      
      if (result.success && result.session) {
        this.setToken(result.session.access_token);
        console.log('✅ Supabase login successful');
      } else {
        console.log('❌ Supabase login failed:', result.error);
      }
      
      return result;
      
    } catch (error) {
      console.error('❌ Supabase login error:', error);
      
      // Fallback to mock data if Supabase fails in development
      if (process.env.NODE_ENV === 'development') {
        console.log('🔄 Falling back to mock data...');
        const result = await mockApiService.login(credentials);
        if (result.success && result.token) {
          this.setToken(result.token);
        }
        return result;
      }
      
      return {
        success: false,
        error: error.message || 'Authentication failed'
      };
    }
  }

  async logout() {
    if (USE_MOCK_DATA) {
      const result = await mockApiService.logout();
      if (result.success) {
        this.setToken(null);
      }
      return result;
    }
    
    // Supabase implementation
    const result = await supabaseApiService.logout();
    if (result.success) {
      this.setToken(null);
    }
    return result;
  }  async getVehicles(filters = {}) {
    try {
      console.log('🔍 API getVehicles called with filters:', filters);
      if (USE_MOCK_DATA) {
        try {
          // Use mockApiService but handle potential errors
          const response = await mockApiService.getVehicles(filters);
          console.log('✅ API getVehicles success, vehicles count:', response?.data?.length);
          return response;
        } catch (mockError) {
          console.error('❌ Error in mock getVehicles:', mockError);
          // Return fallback data to prevent UI breaking
          return { 
            data: [], 
            count: 0, 
            success: false, 
            error: mockError.message 
          };
        }
      }
      
      // Supabase implementation
      const response = await supabaseVehicleService.getVehicles(filters);
      console.log('✅ API getVehicles success from Supabase, vehicles count:', response?.data?.length);
      return response;
    } catch (error) {
      console.error('❌ Critical error in getVehicles:', error);
      // Return fallback data to prevent UI breaking
      return { 
        data: [], 
        count: 0, 
        success: false,
        error: 'Failed to load vehicles data'
      };
    }
  }  async getVehicle(id) {
    console.log('🔍 API.getVehicle called with ID:', id);
    try {
      let result;
      if (USE_MOCK_DATA) {
        console.log('🔍 API: Using mock data service');
        result = await mockApiService.getVehicle(id);
      } else {
        console.log('🔍 API: Using Supabase service');
        result = await supabaseVehicleService.getVehicle(id);
      }
      
      console.log('🔍 API.getVehicle result success:', result?.success);
      if (result?.data) {
        console.log('🔍 API RESULT SPECIFIC VALUES:');
        console.log('   API Price:', result.data.price);
        console.log('   API Make:', result.data.make);
        console.log('   API Model:', result.data.model);
      }
      
      return result;
    } catch (error) {
      console.error('❌ API.getVehicle error:', error);
      return { success: false, error: error.message };
    }
  }

  async createVehicle(vehicleData, images = [], videos = []) {
    if (USE_MOCK_DATA) {
      return await mockApiService.createVehicle(vehicleData, images, videos);
    }
    return await supabaseVehicleService.createVehicle(vehicleData, images, videos);
  }

  async updateVehicle(id, vehicleData, newImages = [], newVideos = []) {
    if (USE_MOCK_DATA) {
      return await mockApiService.updateVehicle(id, vehicleData, newImages, newVideos);
    }
    return await supabaseVehicleService.updateVehicle(id, vehicleData, newImages, newVideos);
  }

  async deleteVehicle(id) {
    if (USE_MOCK_DATA) {
      return await mockApiService.deleteVehicle(id);
    }
    return await supabaseVehicleService.deleteVehicle(id);
  }
  async getStats() {
    if (USE_MOCK_DATA) {
      return await mockApiService.getStats();
    }
    return await supabaseVehicleService.getVehicleStats();
  }

  async submitContactForm(formData) {
    if (USE_MOCK_DATA) {
      console.log('📧 Contact form submitted:', formData);
      return { success: true, message: 'Contact form submitted successfully' };
    }
    return await supabaseApiService.submitContactForm(formData);
  }

  async getGoogleReviews() {
    if (USE_MOCK_DATA) {
      return await mockApiService.getGoogleReviews();
    }
    return await supabaseApiService.getGoogleReviews();
  }

  // Bulk operations
  async bulkDeleteVehicles(vehicleIds) {
    if (USE_MOCK_DATA) {
      return await mockApiService.bulkDeleteVehicles(vehicleIds);
    }
    return await supabaseVehicleService.bulkDeleteVehicles(vehicleIds);
  }
  // Initialize demo vehicles if database is empty
  async initializeDemoVehicles() {
    if (USE_MOCK_DATA) {
      return { success: true, message: 'Using mock data' };
    }
    return await supabaseVehicleService.initializeDemoVehicles();
  }

  // Token validation
  async validateToken() {
    if (USE_MOCK_DATA) {
      return await mockApiService.validateToken();
    }
    // Supabase implementation would go here
    // For now, just check if token exists
    return { success: !!this.token, user: this.token ? { id: 1, username: 'admin', role: 'admin' } : null };
  }

  isAuthenticated() {
    return !!this.token;
  }
}

const apiService = new ApiService();
export default apiService;
