// Production API service for Supabase deployment
// This file switches your app to use Supabase for the demo

import supabaseApiService from './supabaseApi';
import mockApiService from './mockApi';

// 🚀 PRODUCTION MODE - Set to false for demo deployment
const USE_MOCK_DATA = false;

class ApiService {
  constructor() {
    // Use Supabase for production demo
    if (!USE_MOCK_DATA) {
      console.log('🚀 PRODUCTION MODE: Using Supabase for demo');
      this.service = supabaseApiService;
    } else {
      console.log('🧪 TESTING MODE: Using mock data');
      this.service = mockApiService;
    }
    
    this.token = localStorage.getItem('authToken');
    console.log('🔍 API Service initialized for demo, USE_MOCK_DATA:', USE_MOCK_DATA);
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('authToken', token);
    } else {
      localStorage.removeItem('authToken');
    }
  }

  // Authentication methods
  async login(email, password) {
    console.log('🔍 Demo login called with:', { email, passwordLength: password?.length });
    
    try {
      let result;
      
      if (USE_MOCK_DATA) {
        // Mock mode - support both formats for compatibility
        result = await mockApiService.login({ username: email, password });
      } else {
        // Production Supabase mode
        result = await supabaseApiService.login(email, password);
      }
      
      if (result.success && result.token) {
        this.setToken(result.token);
      }
      
      console.log('🔍 Demo login result:', { success: result.success, hasToken: !!result.token });
      return result;
    } catch (error) {
      console.error('❌ Demo login error:', error);
      return { success: false, error: error.message };
    }
  }

  async logout() {
    console.log('🔍 Demo logout called');
    
    try {
      const result = USE_MOCK_DATA 
        ? await mockApiService.logout()
        : await supabaseApiService.logout();
      
      if (result.success) {
        this.setToken(null);
      }
      
      return result;
    } catch (error) {
      console.error('❌ Demo logout error:', error);
      return { success: false, error: error.message };
    }
  }

  // Vehicle methods for demo
  async getVehicles() {
    console.log('🔍 Demo getVehicles called');
    
    try {
      const result = USE_MOCK_DATA 
        ? await mockApiService.getVehicles()
        : await supabaseApiService.getVehicles();
      
      console.log('🔍 Demo vehicles result:', { success: result.success, count: result.data?.length });
      return result;
    } catch (error) {
      console.error('❌ Demo getVehicles error:', error);
      return { success: false, error: error.message, data: [] };
    }
  }

  async getVehicle(id) {
    console.log('🔍 Demo getVehicle called with ID:', id);
    
    try {
      const result = USE_MOCK_DATA 
        ? await mockApiService.getVehicle(id)
        : await supabaseApiService.getVehicle(id);
      
      console.log('🔍 Demo vehicle result:', { success: result.success, hasData: !!result.data });
      return result;
    } catch (error) {
      console.error('❌ Demo getVehicle error:', error);
      return { success: false, error: error.message };
    }
  }

  async addVehicle(vehicleData) {
    console.log('🔍 Demo addVehicle called');
    
    if (!this.token) {
      return { success: false, error: 'Authentication required' };
    }
    
    try {
      const result = USE_MOCK_DATA 
        ? await mockApiService.addVehicle(vehicleData)
        : await supabaseApiService.addVehicle(vehicleData);
      
      console.log('🔍 Demo addVehicle result:', { success: result.success });
      return result;
    } catch (error) {
      console.error('❌ Demo addVehicle error:', error);
      return { success: false, error: error.message };
    }
  }

  async updateVehicle(id, vehicleData) {
    console.log('🔍 Demo updateVehicle called with ID:', id);
    
    if (!this.token) {
      return { success: false, error: 'Authentication required' };
    }
    
    try {
      const result = USE_MOCK_DATA 
        ? await mockApiService.updateVehicle(id, vehicleData)
        : await supabaseApiService.updateVehicle(id, vehicleData);
      
      console.log('🔍 Demo updateVehicle result:', { success: result.success });
      return result;
    } catch (error) {
      console.error('❌ Demo updateVehicle error:', error);
      return { success: false, error: error.message };
    }
  }

  async deleteVehicle(id) {
    console.log('🔍 Demo deleteVehicle called with ID:', id);
    
    if (!this.token) {
      return { success: false, error: 'Authentication required' };
    }
    
    try {
      const result = USE_MOCK_DATA 
        ? await mockApiService.deleteVehicle(id)
        : await supabaseApiService.deleteVehicle(id);
      
      console.log('🔍 Demo deleteVehicle result:', { success: result.success });
      return result;
    } catch (error) {
      console.error('❌ Demo deleteVehicle error:', error);
      return { success: false, error: error.message };
    }
  }

  // Contact methods for demo
  async submitContact(contactData) {
    console.log('🔍 Demo submitContact called');
    
    try {
      const result = USE_MOCK_DATA 
        ? await mockApiService.submitContact(contactData)
        : await supabaseApiService.submitContact(contactData);
      
      console.log('🔍 Demo contact result:', { success: result.success });
      return result;
    } catch (error) {
      console.error('❌ Demo submitContact error:', error);
      return { success: false, error: error.message };
    }
  }

  // Reviews methods for demo
  async getReviews() {
    console.log('🔍 Demo getReviews called');
    
    try {
      const result = USE_MOCK_DATA 
        ? await mockApiService.getReviews()
        : await supabaseApiService.getReviews();
      
      console.log('🔍 Demo reviews result:', { success: result.success, count: result.data?.length });
      return result;
    } catch (error) {
      console.error('❌ Demo getReviews error:', error);
      return { success: false, error: error.message, data: [] };
    }
  }
}

// Export singleton instance for demo
const apiService = new ApiService();
export default apiService;
