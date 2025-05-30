// Clean API service for Rams Motors
import supabaseApiService from './supabaseApi';
import mockApiService from './mockApi';

const USE_MOCK_DATA = true;

class ApiService {
  constructor() {
    this.supabase = supabaseApiService;
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

  async getStats() {
    if (USE_MOCK_DATA) {
      return await mockApiService.getStats();
    }
    return await this.supabase.getStats();
  }

  async submitContactForm(formData) {
    if (USE_MOCK_DATA) {
      console.log('📧 Contact form submitted:', formData);
      return { success: true, message: 'Contact form submitted successfully' };
    }
    return await this.supabase.submitContactForm(formData);
  }

  async getGoogleReviews() {
    if (USE_MOCK_DATA) {
      return await mockApiService.getGoogleReviews();
    }
    return await this.supabase.getGoogleReviews();
  }

  isAuthenticated() {
    return !!this.token;
  }
}

const apiService = new ApiService();
export default apiService;
