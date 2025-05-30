// Modern Vehicle Service - Supabase Integration
import supabaseVehicleService from '../../services/supabaseVehicleService';

class VehicleService {
  constructor() {
    this.isInitialized = false;
  }

  // Initialize service
  async initialize() {
    if (this.isInitialized) return;
    this.isInitialized = true;
  }

  async getVehicles(filters = {}) {
    await this.initialize();
    
    try {
      const result = await supabaseVehicleService.getVehicles(filters);
      return {
        data: result.data || [],
        count: result.data?.length || 0
      };
    } catch (error) {
      console.error('Admin service - getVehicles error:', error);
      throw error;
    }
  }

  async getVehicle(id) {
    await this.initialize();
    
    try {
      const result = await supabaseVehicleService.getVehicle(id);
      return result.data;
    } catch (error) {
      console.error('Admin service - getVehicle error:', error);
      throw error;
    }
  }

  async createVehicle(vehicleData, images = [], videos = []) {
    await this.initialize();
    
    try {
      const result = await supabaseVehicleService.createVehicle(vehicleData, images, videos);
      return result.data;
    } catch (error) {
      console.error('Admin service - createVehicle error:', error);
      throw error;
    }
  }

  async updateVehicle(id, vehicleData, newImages = [], newVideos = []) {
    await this.initialize();
    
    try {
      const result = await supabaseVehicleService.updateVehicle(id, vehicleData, newImages, newVideos);
      return result.data;
    } catch (error) {
      console.error('Admin service - updateVehicle error:', error);
      throw error;
    }
  }

  async deleteVehicle(id) {
    await this.initialize();
    
    try {
      const result = await supabaseVehicleService.deleteVehicle(id);
      return result;
    } catch (error) {
      console.error('Admin service - deleteVehicle error:', error);
      throw error;
    }
  }

  async bulkDeleteVehicles(ids) {
    await this.initialize();
    
    try {
      const result = await supabaseVehicleService.bulkDeleteVehicles(ids);
      return result;
    } catch (error) {
      console.error('Admin service - bulkDeleteVehicles error:', error);
      throw error;
    }
  }

  async uploadVehicleImages(vehicleId, images) {
    await this.initialize();
    
    try {
      // The Supabase service handles image uploads during vehicle creation/update
      // This method is kept for compatibility but delegates to the main service
      return await supabaseVehicleService._handleImageUploads(vehicleId, images);
    } catch (error) {
      console.error('Admin service - uploadVehicleImages error:', error);
      throw error;
    }
  }

  async getRecentVehicles(limit = 5) {
    await this.initialize();
    
    try {
      const filters = { limit, orderBy: 'created_at', orderDirection: 'desc' };
      const result = await supabaseVehicleService.getVehicles(filters);
      return result.data || [];
    } catch (error) {
      console.error('Admin service - getRecentVehicles error:', error);
      throw error;
    }
  }

  async searchVehicles(searchTerm) {
    await this.initialize();
    
    try {
      const filters = { search: searchTerm };
      const result = await supabaseVehicleService.getVehicles(filters);
      return result.data || [];
    } catch (error) {
      console.error('Admin service - searchVehicles error:', error);
      throw error;
    }
  }

  // Get vehicle statistics for admin dashboard
  async getVehicleStats() {
    await this.initialize();
    
    try {
      return await supabaseVehicleService.getVehicleStats();
    } catch (error) {
      console.error('Admin service - getVehicleStats error:', error);
      throw error;
    }
  }

  // Bulk update vehicle status
  async bulkUpdateVehicleStatus(ids, status) {
    await this.initialize();
    
    try {
      const promises = ids.map(id => 
        supabaseVehicleService.updateVehicle(id, { is_available: status === 'available' })
      );
      
      const results = await Promise.all(promises);
      return {
        success: true,
        updatedCount: results.filter(r => r.success).length
      };
    } catch (error) {
      console.error('Admin service - bulkUpdateVehicleStatus error:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const vehicleService = new VehicleService();
