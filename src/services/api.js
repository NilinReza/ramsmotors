// Clean API service for Rams Motors
import mockApiService from './mockApi';

const USE_MOCK_DATA = true;

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
    
    // Supabase implementation would go here
    return { success: false, message: 'Supabase not configured' };
  }

  async logout() {
    if (USE_MOCK_DATA) {
      const result = await mockApiService.logout();
      if (result.success) {
        this.setToken(null);
      }
      return result;
    }
    
    // Supabase implementation would go here
    this.setToken(null);
    return { success: true };
  }
  async getVehicles(filters = {}) {
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
      return { success: false, data: [], count: 0 };
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
    return { success: false, data: null };
  }

  async createVehicle(vehicleData, images = [], videos = []) {
    if (USE_MOCK_DATA) {
      return await mockApiService.createVehicle(vehicleData, images, videos);
    }
    return { success: false, message: 'Supabase not configured' };
  }

  async updateVehicle(id, vehicleData, newImages = [], newVideos = []) {
    if (USE_MOCK_DATA) {
      return await mockApiService.updateVehicle(id, vehicleData, newImages, newVideos);
    }
    return { success: false, message: 'Supabase not configured' };
  }

  async deleteVehicle(id) {
    if (USE_MOCK_DATA) {
      return await mockApiService.deleteVehicle(id);
    }
    return { success: false, message: 'Supabase not configured' };
  }

  async getStats() {
    if (USE_MOCK_DATA) {
      return await mockApiService.getStats();
    }
    return { success: false, data: {} };
  }

  async submitContactForm(formData) {
    if (USE_MOCK_DATA) {
      console.log('📧 Contact form submitted:', formData);
      return { success: true, message: 'Contact form submitted successfully' };
    }
    return { success: false, message: 'Supabase not configured' };
  }

  async getGoogleReviews() {
    if (USE_MOCK_DATA) {
      return await mockApiService.getGoogleReviews();
    }
    return { success: false, data: [] };
  }

  isAuthenticated() {
    return !!this.token;
  }
}

const apiService = new ApiService();
export default apiService;
