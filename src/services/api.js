// Clean API service for Rams Motors
import mockApiService from './mockApi';
import supabaseApiService from './supabaseApi';
import supabaseVehicleService from './supabaseVehicleService';

const USE_MOCK_DATA = false;

class ApiService {
  constructor() {
    this.token = localStorage.getItem('authToken');
    
    if (USE_MOCK_DATA) {
      console.log('🧪 TESTING MODE: Using mock data');
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
  async login(credentials) {
    console.log('🔐 Login called with:', { username: credentials.username });
    
    if (USE_MOCK_DATA) {
      const result = await mockApiService.login(credentials);
      if (result.success && result.token) {
        this.setToken(result.token);
      }
      return result;
    }
    
    // Supabase implementation
    const result = await supabaseApiService.login(credentials.username, credentials.password);
    if (result.success && result.session) {
      this.setToken(result.session.access_token);
    }
    return result;
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
  }
  async getVehicle(id) {
    if (USE_MOCK_DATA) {
      return await mockApiService.getVehicle(id);
    }
    return await supabaseVehicleService.getVehicle(id);
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

  isAuthenticated() {
    return !!this.token;
  }
}

const apiService = new ApiService();
export default apiService;
