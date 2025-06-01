// API service now using Supabase + Cloudinary
import supabaseApiService from './supabaseApi';
import mockApiService from './mockApi';

// 🧪 TESTING MODE - Set to true to use mock data for UI testing
const USE_MOCK_DATA = false;

class ApiService {
  constructor() {
    // Use mock service for testing or Supabase service for production
    if (USE_MOCK_DATA) {
      console.log('🧪 TESTING MODE: Using mock data for UI testing');
    }
    
    // Always initialize Supabase service (even in mock mode for future use)
    this.supabase = supabaseApiService;
    this.token = localStorage.getItem('authToken');
    
    console.log('🔍 API Service initialized, USE_MOCK_DATA:', USE_MOCK_DATA);
    console.log('🔍 Current token:', this.token ? 'PRESENT' : 'NONE');
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
  }

  // Authentication methods
  async login(credentials) {
    console.log('🔐 API Service login called with:', { username: credentials.username });
    
    if (USE_MOCK_DATA) {
      const result = await mockApiService.login(credentials);
      if (result.success && result.token) {
        this.setToken(result.token);
      }
      return result;
    }
    
    const result = await this.supabase.login(credentials);
    if (result.success && result.token) {
      this.setToken(result.token);
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
    
    const result = await this.supabase.logout();
    if (result.success) {
      this.setToken(null);
    }
    return result;
  }

  // Vehicle methods
  async getVehicles(filters = {}) {
    if (USE_MOCK_DATA) {
      return await mockApiService.getVehicles(filters);
    }
    return await this.supabase.getVehicles(filters);
  }

  async getVehicle(id) {
    if (USE_MOCK_DATA) {
      return await mockApiService.getVehicle(id);
    }
    return await this.supabase.getVehicle(id);
  }

  async createVehicle(vehicleData, images = [], videos = []) {
    if (USE_MOCK_DATA) {
      return await mockApiService.createVehicle(vehicleData, images, videos);
    }
    return await this.supabase.createVehicle(vehicleData, images, videos);
  }

  async updateVehicle(id, vehicleData, newImages = [], newVideos = []) {
    if (USE_MOCK_DATA) {
      return await mockApiService.updateVehicle(id, vehicleData, newImages, newVideos);
    }
    return await this.supabase.updateVehicle(id, vehicleData, newImages, newVideos);
  }

  async deleteVehicle(id) {
    if (USE_MOCK_DATA) {
      return await mockApiService.deleteVehicle(id);
    }
    return await this.supabase.deleteVehicle(id);
  }

  // Statistics methods
  async getStats() {
    if (USE_MOCK_DATA) {
      return await mockApiService.getStats();
    }
    return await this.supabase.getStats();
  }

  // Contact methods
  async submitContactForm(formData) {
    if (USE_MOCK_DATA) {
      return await mockApiService.submitContactForm(formData);
    }
    return await this.supabase.submitContactForm(formData);
  }

  // Google Reviews methods
  async getGoogleReviews() {
    if (USE_MOCK_DATA) {
      return await mockApiService.getGoogleReviews();
    }
    return await this.supabase.getGoogleReviews();
  }

  // Utility methods
  isAuthenticated() {
    return !!this.token;
  }

  // Switch between mock and production mode
  setMockMode(useMock) {
    console.log(`🔄 Switching to ${useMock ? 'MOCK' : 'PRODUCTION'} mode`);
    // Note: This would require a reload to take effect due to const USE_MOCK_DATA
  }
}

// Create singleton instance
const apiService = new ApiService();

export default apiService;
