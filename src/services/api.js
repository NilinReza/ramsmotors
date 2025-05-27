// API service for communicating with the backend
const API_BASE_URL = 'http://localhost:5246/api';

class ApiService {
  constructor() {
    this.token = localStorage.getItem('authToken');
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('authToken', token);
    } else {
      localStorage.removeItem('authToken');
    }
  }
  getHeaders() {
    // Always check localStorage for a token first
    this.token = localStorage.getItem('authToken') || this.token;
    
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    
    return headers;
  }

  async makeRequest(url, options = {}) {
    const config = {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(`${API_BASE_URL}${url}`, config);
      
      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorData}`);
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }
      
      return await response.text();
    } catch (error) {
      console.error(`API request failed for ${url}:`, error);
      throw error;
    }
  }
  // Auth endpoints
  async login(username, password) {
    const response = await this.makeRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    
    if (response.token) {
      this.setToken(response.token);
    }
    
    return response;
  }

  async register(userData) {
    return await this.makeRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }  async validateToken() {
    try {
      // Log the token being used for validation
      console.log('Validating token:', this.token ? this.token.substring(0, 20) + '...' : 'No token');
      
      // Make the validation request
      return await this.makeRequest('/auth/validate', {
        method: 'POST'
      });
    } catch (error) {
      console.error('Token validation failed:', error);
      throw error;
    }
  }

  async logout() {
    await this.makeRequest('/auth/logout', { method: 'POST' });
    this.setToken(null);
  }
  // Vehicle endpoints
  async getVehicles(filters = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
          queryParams.append(key, filters[key]);
        }
      });

      const queryString = queryParams.toString();
      const url = `/vehicles${queryString ? `?${queryString}` : ''}`;
      
      console.log('Fetching vehicles from:', url);
      return await this.makeRequest(url);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      // Return an empty array instead of throwing to prevent cascading errors
      return { data: [], page: 1, pageSize: 10, totalCount: 0, totalPages: 0 };
    }
  }

  async getVehicle(id) {
    return await this.makeRequest(`/vehicles/${id}`);
  }

  async createVehicle(vehicleData) {
    return await this.makeRequest('/vehicles', {
      method: 'POST',
      body: JSON.stringify(vehicleData),
    });
  }

  async updateVehicle(id, vehicleData) {
    return await this.makeRequest(`/vehicles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(vehicleData),
    });
  }

  async deleteVehicle(id) {
    return await this.makeRequest(`/vehicles/${id}`, {
      method: 'DELETE',
    });
  }

  // File upload endpoints
  async uploadVehicleImages(vehicleId, files) {
    const formData = new FormData();
    
    for (let i = 0; i < files.length; i++) {
      formData.append('images', files[i]);
    }
    
    return await this.makeRequest(`/vehicles/${vehicleId}/images`, {
      method: 'POST',
      headers: this.token ? { 'Authorization': `Bearer ${this.token}` } : {},
      body: formData,
    });
  }

  async uploadVehicleVideos(vehicleId, files) {
    const formData = new FormData();
    
    for (let i = 0; i < files.length; i++) {
      formData.append('videos', files[i]);
    }
    
    return await this.makeRequest(`/vehicles/${vehicleId}/videos`, {
      method: 'POST',
      headers: this.token ? { 'Authorization': `Bearer ${this.token}` } : {},
      body: formData,
    });
  }

  async deleteVehicleImage(vehicleId, imageId) {
    return await this.makeRequest(`/vehicles/${vehicleId}/images/${imageId}`, {
      method: 'DELETE',
    });
  }

  async deleteVehicleVideo(vehicleId, videoId) {
    return await this.makeRequest(`/vehicles/${vehicleId}/videos/${videoId}`, {
      method: 'DELETE',
    });
  }

  // Contact form submission
  async submitContactForm(formData) {
    return await this.makeRequest('/contact/submit', {
      method: 'POST',
      body: JSON.stringify(formData),
    });
  }
}

const apiServiceInstance = new ApiService();
export default apiServiceInstance;
