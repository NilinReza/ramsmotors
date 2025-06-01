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
    
    // Handle status to is_available conversion
    if ('status' in transformed) {
      // Convert status string to is_available boolean
      transformed.is_available = transformed.status === 'Available';
      delete transformed.status; // Remove status field since it doesn't exist in DB
    }
    
    return transformed;
  }  // Transform database vehicle data to frontend format
  transformFromDatabase(vehicleData) {
    if (!vehicleData) return vehicleData;
    
    const transformed = { ...vehicleData };
      
    // Transform timestamp fields to camelCase
    if (transformed.created_at) {
      transformed.createdAt = transformed.created_at;
      delete transformed.created_at;
    }
    if (transformed.updated_at) {
      transformed.updatedAt = transformed.updated_at;
      delete transformed.updated_at;
    }
    
    // Transform other metadata fields
    if (transformed.dealer_id) {
      transformed.dealerId = transformed.dealer_id;
      delete transformed.dealer_id;
    }
    if (transformed.view_count) {
      transformed.viewCount = transformed.view_count;
      delete transformed.view_count;
    }
    if (transformed.is_featured) {
      transformed.isFeatured = transformed.is_featured;
      delete transformed.is_featured;
    }
    
    // Handle is_available to status conversion properly
    if (transformed.is_available !== undefined) {
      transformed.isAvailable = transformed.is_available;
      transformed.status = transformed.is_available ? 'Available' : 'Sold';
      delete transformed.is_available;
    } else {
      // Default if not present
      transformed.status = 'Available';
    }
    
    // Add default condition if not present in database
    if (!transformed.condition) {
      transformed.condition = 'Used';
    }
    
    // Ensure all required form fields have values from database or defaults
    const formFields = {
      make: transformed.make || '',
      model: transformed.model || '',
      year: transformed.year || new Date().getFullYear(),
      price: transformed.price || '',
      mileage: transformed.mileage || '',
      exterior_color: transformed.exterior_color || '',
      transmission: transformed.transmission || 'Automatic',
      fuel_type: transformed.fuel_type || 'Gasoline',
      body_style: transformed.body_style || 'Sedan',
      engine: transformed.engine || '',
      vin: transformed.vin || '',
      description: transformed.description || '',
      features: Array.isArray(transformed.features) ? transformed.features : [],
      condition: transformed.condition || 'Used',
      status: transformed.status || 'Available'
    };
    
    // Merge form fields into transformed data    Object.assign(transformed, formFields);
    
    // Add backward compatibility fields for components that expect camelCase
    // Keep original snake_case fields for admin forms
    if (transformed.exterior_color && !transformed.color) {
      transformed.color = transformed.exterior_color;
    }
    if (transformed.body_style && !transformed.bodyStyle) {
      transformed.bodyStyle = transformed.body_style;
    }
    if (transformed.fuel_type && !transformed.fuelType) {
      transformed.fuelType = transformed.fuel_type;
    }
    if (transformed.engine && !transformed.engineSize) {
      transformed.engineSize = transformed.engine;
    }
      // Transform vehicle_images to images array for frontend compatibility
    if (transformed.vehicle_images && Array.isArray(transformed.vehicle_images)) {
      transformed.images = transformed.vehicle_images.map(img => ({
        id: img.id,
        url: img.url,  // Database already has 'url' field
        publicId: img.public_id,
        displayOrder: img.sort_order || 0,  // Database uses 'sort_order'
        isPrimary: img.is_primary,
        altText: img.alt_text,
        createdAt: img.created_at
      }));
      delete transformed.vehicle_images;
    }
    
    // Transform vehicle_videos to videos array for frontend compatibility  
    if (transformed.vehicle_videos && Array.isArray(transformed.vehicle_videos)) {
      transformed.videos = transformed.vehicle_videos.map(video => ({
        id: video.id,
        url: video.url,  // Assuming videos table has similar structure
        publicId: video.public_id,
        displayOrder: video.sort_order || 0,
        createdAt: video.created_at
      }));
      delete transformed.vehicle_videos;
    }
    
    return transformed;
  }

  // Set the current dealer context
  setDealerId(dealerId) {
    this.currentDealerId = dealerId;
  }
  // Get all vehicles with optional filters
  async getVehicles(filters = {}) {    try {
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
        throw error;      }

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
  }  // Get a single vehicle by ID
  async getVehicle(id) {    try {
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
  }  // Create a new vehicle
  async createVehicle(vehicleData, images = [], videos = []) {
    try {
      // Transform frontend field names to database field names
      const transformedData = this.transformToDatabase(vehicleData);
      
      // Define supported database columns (based on your actual schema)
      const supportedColumns = [
        'make', 'model', 'year', 'price', 'mileage', 'transmission', 'engine', 
        'vin', 'description', 'features', 'body_style', 'fuel_type', 
        'exterior_color', 'interior_color', 'dealer_id', 'created_at', 'updated_at', 
        'is_available', 'is_featured'
      ];
      
      // Filter out unsupported fields (like 'condition')
      const filteredData = {};
      Object.keys(transformedData).forEach(key => {
        if (supportedColumns.includes(key)) {
          filteredData[key] = transformedData[key];
        } else {
          console.warn(`⚠️ Skipping unsupported field: ${key} = ${transformedData[key]}`);
        }
      });
      
      // Prepare vehicle data for insertion
      const vehicleToInsert = {
        ...filteredData,
        dealer_id: this.currentDealerId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      // Clean up undefined/null values that might cause database issues
      Object.keys(vehicleToInsert).forEach(key => {
        if (vehicleToInsert[key] === undefined || vehicleToInsert[key] === null || vehicleToInsert[key] === '') {
          delete vehicleToInsert[key];
        }
      });
      
      // Ensure required fields have default values
      if (!vehicleToInsert.is_available) {
        vehicleToInsert.is_available = true;
      }
      if (!vehicleToInsert.is_featured) {      vehicleToInsert.is_featured = false;
      }
      
      // Insert vehicle first
      const { data: vehicle, error: vehicleError } = await supabase
        .from('vehicles')
        .insert([vehicleToInsert])
        .select()
        .single();

      if (vehicleError) {
        console.error('❌ Supabase vehicle insert error:', vehicleError);
        console.error('❌ Error details:', JSON.stringify(vehicleError, null, 2));
        console.error('❌ Data that caused error:', JSON.stringify(vehicleToInsert, null, 2));
        throw vehicleError;
      }

      // Handle image uploads if provided
      if (images && images.length > 0) {        const imagePromises = images.map(async (file, index) => {
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
            console.error('❌ Image records insert error:', imageError);          } else {
          }
        }
      }      // Handle video uploads if provided
      if (videos && videos.length > 0) {
        
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
            .insert(videoRecords);          if (videoError) {
            console.error('❌ Video records insert error:', videoError);
          } else {
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
  }  // Update an existing vehicle
  async updateVehicle(id, vehicleData, newImages = [], newVideos = [], deletedImageIds = [], deletedVideoIds = []) {    try {
      // Transform frontend field names to database field names
      const transformedData = this.transformToDatabase(vehicleData);
      
      // Define supported database columns (same as createVehicle)
      const supportedColumns = [
        'make', 'model', 'year', 'price', 'mileage', 'transmission', 'engine', 
        'vin', 'description', 'features', 'body_style', 'fuel_type', 
        'exterior_color', 'interior_color', 'dealer_id', 'created_at', 'updated_at', 
        'is_available', 'is_featured'
      ];
      
      // Filter out unsupported fields (like 'condition')
      const filteredData = {};
      Object.keys(transformedData).forEach(key => {
        if (supportedColumns.includes(key)) {
          filteredData[key] = transformedData[key];
        } else {
          console.warn(`⚠️ Skipping unsupported field in update: ${key} = ${transformedData[key]}`);
        }
      });
        // Handle deleted images first (before updating vehicle data)
      if (deletedImageIds && deletedImageIds.length > 0) {
        
        // Get the image records to delete from Cloudinary
        const { data: imagesToDelete, error: fetchError } = await supabase
          .from('vehicle_images')
          .select('public_id')
          .in('public_id', deletedImageIds)
          .eq('vehicle_id', id);

        if (fetchError) {
          console.error('❌ Error fetching images to delete:', fetchError);
        } else if (imagesToDelete && imagesToDelete.length > 0) {
          // Delete from Cloudinary
          const cloudinaryDeletePromises = imagesToDelete.map(async (image) => {
            if (image.public_id) {              try {
                await cloudinaryService.deleteFile(image.public_id, 'image');
              } catch (error) {
                console.error('❌ Failed to delete image from Cloudinary:', image.public_id, error);
              }
            }
          });
          
          await Promise.all(cloudinaryDeletePromises);
        }

        // Delete from database
        const { error: deleteError } = await supabase
          .from('vehicle_images')
          .delete()
          .in('public_id', deletedImageIds)
          .eq('vehicle_id', id);        if (deleteError) {
          console.error('❌ Error deleting images from database:', deleteError);
        } else {
        }
      }      // Handle deleted videos
      if (deletedVideoIds && deletedVideoIds.length > 0) {
        
        // Get the video records to delete from Cloudinary
        const { data: videosToDelete, error: fetchError } = await supabase
          .from('vehicle_videos')
          .select('public_id')
          .in('public_id', deletedVideoIds)
          .eq('vehicle_id', id);

        if (fetchError) {
          console.error('❌ Error fetching videos to delete:', fetchError);
        } else if (videosToDelete && videosToDelete.length > 0) {
          // Delete from Cloudinary
          const cloudinaryDeletePromises = videosToDelete.map(async (video) => {
            if (video.public_id) {              try {
                await cloudinaryService.deleteFile(video.public_id, 'video');
              } catch (error) {
                console.error('❌ Failed to delete video from Cloudinary:', video.public_id, error);
              }
            }
          });
          
          await Promise.all(cloudinaryDeletePromises);
        }

        // Delete from database
        const { error: deleteError } = await supabase
          .from('vehicle_videos')
          .delete()
          .in('public_id', deletedVideoIds)
          .eq('vehicle_id', id);        if (deleteError) {
          console.error('❌ Error deleting videos from database:', deleteError);
        } else {
        }
      }
      
      // Update vehicle data
      const { data: vehicle, error: vehicleError } = await supabase
        .from('vehicles')
        .update({
          ...filteredData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('dealer_id', this.currentDealerId)
        .select()
        .single();      if (vehicleError) {
        console.error('❌ Supabase vehicle update error:', vehicleError);
        throw vehicleError;
      }      // Handle new image uploads
      if (newImages && newImages.length > 0) {
        await this._handleImageUploads(id, newImages);
      }      // Handle new video uploads
      if (newVideos && newVideos.length > 0) {
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
  async deleteVehicle(id) {    try {
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
        throw error;      }

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
      const { data: existingVehicles, error: checkError } = await supabase
        .from('vehicles')
        .select('id')
        .eq('dealer_id', this.currentDealerId)
        .limit(1);

      if (checkError) {
        throw checkError;
      }      // If vehicles already exist, don't add demo data
      if (existingVehicles && existingVehicles.length > 0) {
        return { success: true, message: 'Vehicles already exist' };      }

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
        .select();      if (insertError) {
        throw insertError;
      }

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
