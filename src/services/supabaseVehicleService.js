// Dedicated Supabase Vehicle Service for Rams Motors
// This service handles all vehicle-related database operations

import { supabase } from '../config/supabase';
import cloudinaryService from './cloudinary';

class SupabaseVehicleService {
  constructor() {
    this.currentDealerId = 'ramsmotors'; // Default dealer ID for Rams Motors
  }  // Field mapping between frontend (camelCase) and database (snake_case)
  static FIELD_MAPPINGS = {
    // Frontend -> Database
    toDatabase: {
      bodyType: 'body_style',
      bodyStyle: 'body_style',      // Alternative naming from inventory page
      fuelType: 'fuel_type',
      exteriorColor: 'exterior_color',
      interiorColor: 'interior_color',
      color: 'exterior_color',      // Single color field maps to exterior_color
      isAvailable: 'is_available',
      isFeatured: 'is_featured',
      viewCount: 'view_count',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      dealerId: 'dealer_id'
      // Removed defensive snake_case mappings as they were causing conflicts
    },
    // Database -> Frontend  
    fromDatabase: {
      body_style: 'bodyType',
      fuel_type: 'fuelType', 
      exterior_color: 'exteriorColor',
      interior_color: 'interiorColor',
      is_available: 'isAvailable',
      is_featured: 'isFeatured',
      view_count: 'viewCount',
      created_at: 'createdAt',
      updated_at: 'updatedAt',
      dealer_id: 'dealerId'
    }
  };

  // Transform frontend vehicle data to database format
  transformToDatabase(vehicleData) {
    const transformed = { ...vehicleData };
    
    Object.entries(SupabaseVehicleService.FIELD_MAPPINGS.toDatabase).forEach(([frontendField, dbField]) => {
      if (frontendField in transformed) {
        transformed[dbField] = transformed[frontendField];
        delete transformed[frontendField];
      }
    });
    
    return transformed;
  }
  // Transform database vehicle data to frontend format
  transformFromDatabase(vehicleData) {
    if (!vehicleData) return vehicleData;
    
    const transformed = { ...vehicleData };
    
    Object.entries(SupabaseVehicleService.FIELD_MAPPINGS.fromDatabase).forEach(([dbField, frontendField]) => {
      if (dbField in transformed) {
        transformed[frontendField] = transformed[dbField];
        delete transformed[dbField];
      }
    });
    
    // Add backward compatibility fields
    // Add 'color' field as alias for exteriorColor for components that expect it
    if (transformed.exteriorColor && !transformed.color) {
      transformed.color = transformed.exteriorColor;
    }
    
    // Add 'bodyStyle' as alias for bodyType for inventory page compatibility
    if (transformed.bodyType && !transformed.bodyStyle) {
      transformed.bodyStyle = transformed.bodyType;
    }
    
    return transformed;
  }

  // Set the current dealer context
  setDealerId(dealerId) {
    this.currentDealerId = dealerId;
  }
  // Get all vehicles with optional filters
  async getVehicles(filters = {}) {
    try {
      console.log('🔍 Supabase: Getting vehicles with filters:', filters);
      
      let query = supabase
        .from('vehicles')
        .select(`
          *,
          vehicle_images (*),
          vehicle_videos (*)
        `)
        .eq('dealer_id', this.currentDealerId)
        .order('created_at', { ascending: false });

      // Apply filters - transform frontend filter names to database column names
      if (filters.make) {
        query = query.ilike('make', `%${filters.make}%`);
      }
      if (filters.model) {
        query = query.ilike('model', `%${filters.model}%`);
      }
      if (filters.year) {
        query = query.eq('year', parseInt(filters.year));
      }
      if (filters.minPrice) {
        query = query.gte('price', parseFloat(filters.minPrice));
      }
      if (filters.maxPrice) {
        query = query.lte('price', parseFloat(filters.maxPrice));
      }
      if (filters.minMileage) {
        query = query.gte('mileage', parseInt(filters.minMileage));
      }
      if (filters.maxMileage) {
        query = query.lte('mileage', parseInt(filters.maxMileage));
      }
      if (filters.transmission) {
        query = query.ilike('transmission', `%${filters.transmission}%`);
      }
      if (filters.fuelType) {
        query = query.ilike('fuel_type', `%${filters.fuelType}%`);
      }
      if (filters.bodyStyle || filters.bodyType) {
        const bodyFilter = filters.bodyStyle || filters.bodyType;
        query = query.ilike('body_style', `%${bodyFilter}%`);
      }
      if (filters.color) {
        query = query.ilike('exterior_color', `%${filters.color}%`);
      }
      if (filters.isAvailable !== undefined) {
        query = query.eq('is_available', filters.isAvailable);
      }
      
      // Search across multiple fields
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        query = query.or(`make.ilike.%${searchTerm}%,model.ilike.%${searchTerm}%,year.eq.${parseInt(searchTerm) || 0},exterior_color.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
      }

      const { data, error, count } = await query;

      if (error) {
        console.error('❌ Supabase vehicles query error:', error);
        throw error;
      }

      console.log('✅ Supabase vehicles loaded:', data?.length || 0);
      
      // Transform database results to frontend format
      const transformedData = data?.map(vehicle => this.transformFromDatabase(vehicle)) || [];
      
      return {
        success: true,
        data: transformedData,
        count: count || transformedData.length || 0
      };
    } catch (error) {
      console.error('❌ Supabase getVehicles error:', error);
      return {
        success: false,
        error: error.message,
        data: [],
        count: 0
      };
    }
  }
  // Get a single vehicle by ID
  async getVehicle(id) {
    try {
      console.log('🔍 Supabase: Getting vehicle by ID:', id);
      
      const { data, error } = await supabase
        .from('vehicles')
        .select(`
          *,
          vehicle_images (*),
          vehicle_videos (*)
        `)
        .eq('id', id)
        .eq('dealer_id', this.currentDealerId)
        .single();

      if (error) {
        console.error('❌ Supabase vehicle query error:', error);
        throw error;
      }

      console.log('✅ Supabase vehicle loaded:', data?.id);
      
      // Transform database result to frontend format
      const transformedData = this.transformFromDatabase(data);
      
      return {
        success: true,
        data: transformedData
      };
    } catch (error) {
      console.error('❌ Supabase getVehicle error:', error);
      return {
        success: false,
        error: error.message,
        data: null
      };
    }
  }
  // Create a new vehicle
  async createVehicle(vehicleData, images = [], videos = []) {
    try {
      console.log('🚗 Supabase: Creating vehicle:', vehicleData);
      
      // Transform frontend field names to database field names
      const transformedData = this.transformToDatabase(vehicleData);
      
      // Prepare vehicle data for insertion
      const vehicleToInsert = {
        ...transformedData,
        dealer_id: this.currentDealerId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Insert vehicle first
      const { data: vehicle, error: vehicleError } = await supabase
        .from('vehicles')
        .insert([vehicleToInsert])
        .select()
        .single();

      if (vehicleError) {
        console.error('❌ Supabase vehicle insert error:', vehicleError);
        throw vehicleError;
      }

      console.log('✅ Vehicle created:', vehicle.id);

      // Handle image uploads if provided
      if (images && images.length > 0) {
        console.log('📸 Uploading', images.length, 'images...');
        
        const imagePromises = images.map(async (file, index) => {
          try {
            // Upload to Cloudinary
            const uploadResult = await cloudinaryService.uploadFile(
              file, 
              this.currentDealerId, 
              vehicle.id, 
              'image'
            );

            if (!uploadResult.success) {
              throw new Error(`Image upload failed: ${uploadResult.error}`);
            }

            // Save image record to database
            return {
              vehicle_id: vehicle.id,
              url: uploadResult.url,
              public_id: uploadResult.publicId,
              is_primary: index === 0, // First image is primary
              created_at: new Date().toISOString()
            };
          } catch (error) {
            console.error('❌ Image upload error:', error);
            return null;
          }
        });

        const imageRecords = (await Promise.all(imagePromises)).filter(Boolean);

        if (imageRecords.length > 0) {
          const { error: imageError } = await supabase
            .from('vehicle_images')
            .insert(imageRecords);

          if (imageError) {
            console.error('❌ Image records insert error:', imageError);
          } else {
            console.log('✅ Images saved:', imageRecords.length);
          }
        }
      }

      // Handle video uploads if provided
      if (videos && videos.length > 0) {
        console.log('🎥 Uploading', videos.length, 'videos...');
        
        const videoPromises = videos.map(async (file) => {
          try {
            // Upload to Cloudinary
            const uploadResult = await cloudinaryService.uploadFile(
              file, 
              this.currentDealerId, 
              vehicle.id, 
              'video'
            );

            if (!uploadResult.success) {
              throw new Error(`Video upload failed: ${uploadResult.error}`);
            }

            // Save video record to database
            return {
              vehicle_id: vehicle.id,
              url: uploadResult.url,
              public_id: uploadResult.publicId,
              created_at: new Date().toISOString()
            };
          } catch (error) {
            console.error('❌ Video upload error:', error);
            return null;
          }
        });

        const videoRecords = (await Promise.all(videoPromises)).filter(Boolean);

        if (videoRecords.length > 0) {
          const { error: videoError } = await supabase
            .from('vehicle_videos')
            .insert(videoRecords);

          if (videoError) {
            console.error('❌ Video records insert error:', videoError);
          } else {
            console.log('✅ Videos saved:', videoRecords.length);
          }
        }
      }

      // Return transformed vehicle data to frontend format
      const transformedVehicle = this.transformFromDatabase(vehicle);

      return {
        success: true,
        data: transformedVehicle
      };
    } catch (error) {
      console.error('❌ Supabase createVehicle error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
  // Update an existing vehicle
  async updateVehicle(id, vehicleData, newImages = [], newVideos = []) {
    try {
      console.log('🔄 Supabase: Updating vehicle:', id);
      
      // Transform frontend field names to database field names
      const transformedData = this.transformToDatabase(vehicleData);
      
      // Update vehicle data
      const { data: vehicle, error: vehicleError } = await supabase
        .from('vehicles')
        .update({
          ...transformedData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('dealer_id', this.currentDealerId)
        .select()
        .single();

      if (vehicleError) {
        console.error('❌ Supabase vehicle update error:', vehicleError);
        throw vehicleError;
      }

      console.log('✅ Vehicle updated:', vehicle.id);

      // Handle new image uploads
      if (newImages && newImages.length > 0) {
        console.log('📸 Uploading new images...');
        await this._handleImageUploads(id, newImages);
      }

      // Handle new video uploads
      if (newVideos && newVideos.length > 0) {
        console.log('🎥 Uploading new videos...');
        await this._handleVideoUploads(id, newVideos);
      }

      // Return transformed vehicle data to frontend format
      const transformedVehicle = this.transformFromDatabase(vehicle);

      return {
        success: true,
        data: transformedVehicle
      };
    } catch (error) {
      console.error('❌ Supabase updateVehicle error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Delete a vehicle and all associated media
  async deleteVehicle(id) {
    try {
      console.log('🗑️ Supabase: Deleting vehicle:', id);
      
      // Get vehicle with associated media first
      const { data: vehicle } = await supabase
        .from('vehicles')
        .select(`
          *,
          vehicle_images (*),
          vehicle_videos (*)
        `)
        .eq('id', id)
        .eq('dealer_id', this.currentDealerId)
        .single();

      if (!vehicle) {
        throw new Error('Vehicle not found');
      }

      // Delete media from Cloudinary
      if (vehicle.vehicle_images) {
        for (const image of vehicle.vehicle_images) {
          if (image.public_id) {
            await cloudinaryService.deleteFile(image.public_id, 'image');
          }
        }
      }

      if (vehicle.vehicle_videos) {
        for (const video of vehicle.vehicle_videos) {
          if (video.public_id) {
            await cloudinaryService.deleteFile(video.public_id, 'video');
          }
        }
      }

      // Delete from database (cascade will handle images/videos)
      const { error } = await supabase
        .from('vehicles')
        .delete()
        .eq('id', id)
        .eq('dealer_id', this.currentDealerId);

      if (error) {
        console.error('❌ Supabase vehicle delete error:', error);
        throw error;
      }

      console.log('✅ Vehicle deleted:', id);

      return {
        success: true
      };
    } catch (error) {
      console.error('❌ Supabase deleteVehicle error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Bulk delete vehicles
  async bulkDeleteVehicles(vehicleIds) {
    try {
      console.log('🗑️ Supabase: Bulk deleting vehicles:', vehicleIds);
      
      const results = await Promise.all(
        vehicleIds.map(id => this.deleteVehicle(id))
      );

      const failures = results.filter(r => !r.success);
      
      return {
        success: failures.length === 0,
        deleted: results.filter(r => r.success).length,
        failed: failures.length,
        errors: failures.map(f => f.error)
      };
    } catch (error) {
      console.error('❌ Supabase bulkDeleteVehicles error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get vehicle statistics
  async getVehicleStats() {
    try {
      console.log('📊 Supabase: Getting vehicle stats...');
      
      const { data: vehicles, error } = await supabase
        .from('vehicles')
        .select('is_available, price, created_at')
        .eq('dealer_id', this.currentDealerId);

      if (error) {
        console.error('❌ Supabase stats query error:', error);
        throw error;
      }

      const stats = {
        totalVehicles: vehicles.length,
        availableVehicles: vehicles.filter(v => v.is_available).length,
        soldThisMonth: 0, // Calculate based on your sold tracking logic
        totalValue: vehicles
          .filter(v => v.is_available)
          .reduce((sum, v) => sum + (parseFloat(v.price) || 0), 0)
      };

      return {
        success: true,
        data: stats
      };
    } catch (error) {
      console.error('❌ Supabase getVehicleStats error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Helper method to handle image uploads
  async _handleImageUploads(vehicleId, images) {
    const imagePromises = images.map(async (file) => {
      try {
        const uploadResult = await cloudinaryService.uploadFile(
          file, 
          this.currentDealerId, 
          vehicleId, 
          'image'
        );

        if (!uploadResult.success) {
          throw new Error(`Image upload failed: ${uploadResult.error}`);
        }

        return {
          vehicle_id: vehicleId,
          url: uploadResult.url,
          public_id: uploadResult.publicId,
          is_primary: false,
          created_at: new Date().toISOString()
        };
      } catch (error) {
        console.error('❌ Image upload error:', error);
        return null;
      }
    });

    const imageRecords = (await Promise.all(imagePromises)).filter(Boolean);

    if (imageRecords.length > 0) {
      const { error: imageError } = await supabase
        .from('vehicle_images')
        .insert(imageRecords);

      if (imageError) {
        console.error('❌ Image records insert error:', imageError);
      }
    }
  }

  // Helper method to handle video uploads
  async _handleVideoUploads(vehicleId, videos) {
    const videoPromises = videos.map(async (file) => {
      try {
        const uploadResult = await cloudinaryService.uploadFile(
          file, 
          this.currentDealerId, 
          vehicleId, 
          'video'
        );

        if (!uploadResult.success) {
          throw new Error(`Video upload failed: ${uploadResult.error}`);
        }

        return {
          vehicle_id: vehicleId,
          url: uploadResult.url,
          public_id: uploadResult.publicId,
          created_at: new Date().toISOString()
        };
      } catch (error) {
        console.error('❌ Video upload error:', error);
        return null;
      }
    });

    const videoRecords = (await Promise.all(videoPromises)).filter(Boolean);

    if (videoRecords.length > 0) {
      const { error: videoError } = await supabase
        .from('vehicle_videos')
        .insert(videoRecords);

      if (videoError) {
        console.error('❌ Video records insert error:', videoError);
      }
    }
  }

  // Initialize demo vehicles if database is empty
  async initializeDemoVehicles() {
    try {
      console.log('🚗 Checking if demo vehicles need to be initialized...');
        const { data: existingVehicles, error: checkError } = await supabase
        .from('vehicles')
        .select('id')
        .eq('dealer_id', this.currentDealerId)
        .limit(1);

      if (checkError) {
        throw checkError;
      }

      // If vehicles already exist, don't add demo data
      if (existingVehicles && existingVehicles.length > 0) {
        console.log('✅ Vehicles already exist in database');
        return { success: true, message: 'Vehicles already exist' };
      }

      console.log('🔄 Initializing demo vehicles...');

      // Demo vehicle data
      const demoVehicles = [
        {
          dealer_id: this.currentDealerId,
          vin: 'JH4TB2H26CC000001',
          make: 'Honda',
          model: 'Accord',
          year: 2023,
          price: 28500,
          mileage: 15000,
          transmission: 'Automatic',
          fuel_type: 'Gasoline',
          body_style: 'Sedan',
          exterior_color: 'Metallic Gray',
          interior_color: 'Black',
          engine: '2.0L 4-Cylinder Turbo',
          drivetrain: 'FWD',
          description: 'Excellent condition Honda Accord with low mileage and premium features.',
          features: ['Air Conditioning', 'Bluetooth', 'Backup Camera', 'Apple CarPlay', 'Honda Sensing'],
          is_available: true,
          is_featured: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          dealer_id: this.currentDealerId,
          vin: 'JH4TB2H26CC000002',
          make: 'Toyota',
          model: 'Camry',
          year: 2022,
          price: 26900,
          mileage: 22000,
          transmission: 'Automatic',
          fuel_type: 'Gasoline',
          body_style: 'Sedan',
          exterior_color: 'Pearl White',
          interior_color: 'Beige',
          engine: '2.5L 4-Cylinder',
          drivetrain: 'FWD',
          description: 'Reliable Toyota Camry with excellent fuel economy and safety features.',
          features: ['Air Conditioning', 'Bluetooth', 'Toyota Safety Sense', 'Wireless Charging'],
          is_available: true,
          is_featured: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          dealer_id: this.currentDealerId,
          vin: 'JH4TB2H26CC000003',
          make: 'Ford',
          model: 'F-150',
          year: 2023,
          price: 35900,
          mileage: 12000,
          transmission: 'Automatic',
          fuel_type: 'Gasoline',
          body_style: 'Truck',
          exterior_color: 'Shadow Black',
          interior_color: 'Gray',
          engine: '3.5L V6 Twin Turbo',
          drivetrain: '4WD',
          description: 'Powerful Ford F-150 truck with excellent towing capacity and modern features.',
          features: ['Air Conditioning', 'Bluetooth', 'Backup Camera', 'Remote Start', '4WD', 'Tow Package'],
          is_available: false, // Pending sale
          is_featured: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          dealer_id: this.currentDealerId,
          vin: 'JH4TB2H26CC000004',
          make: 'BMW',
          model: 'X5',
          year: 2022,
          price: 52900,
          mileage: 18000,
          transmission: 'Automatic',
          fuel_type: 'Gasoline',
          body_style: 'SUV',
          exterior_color: 'Alpine White',
          interior_color: 'Black Leather',
          engine: '3.0L I6 Twin Turbo',
          drivetrain: 'AWD',
          description: 'Luxury BMW X5 SUV with premium features and excellent performance.',
          features: ['Leather Seats', 'Navigation', 'Panoramic Sunroof', 'AWD', 'Premium Audio', 'Heated Seats'],
          is_available: false, // Sold
          is_featured: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];      // Insert demo vehicles
      const { data, error: insertError } = await supabase
        .from('vehicles')
        .insert(demoVehicles)
        .select();

      if (insertError) {
        throw insertError;
      }

      console.log('✅ Demo vehicles initialized:', data.length);
      
      return {
        success: true,
        data,
        message: `${data.length} demo vehicles added successfully`
      };
    } catch (error) {
      console.error('❌ Demo vehicle initialization error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

// Export singleton instance
const supabaseVehicleService = new SupabaseVehicleService();
export default supabaseVehicleService;
