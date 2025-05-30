import { supabase } from '../config/supabase'
import cloudinaryService from './cloudinary'

class SupabaseApiService {
  constructor() {
    this.currentDealerId = 'ramsmotors' // Default for RamsMotors, will be dynamic later
  }

  // Set the current dealer context
  setDealerId(dealerId) {
    this.currentDealerId = dealerId
  }

  // Authentication
  async login(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error

      // Get additional user info from our admin_users table
      const { data: adminUser, error: userError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('email', email)
        .eq('dealer_id', this.currentDealerId)
        .single()

      if (userError || !adminUser) {
        throw new Error('User not found or not authorized for this dealership')
      }

      return {
        success: true,
        user: data.user,
        session: data.session,
        adminUser
      }
    } catch (error) {
      console.error('Login error:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  async logout() {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      return { success: true }
    } catch (error) {
      console.error('Logout error:', error)
      return { success: false, error: error.message }
    }
  }

  // Get current session
  async getSession() {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      return session
    } catch (error) {
      console.error('Session error:', error)
      return null
    }
  }

  // Vehicles CRUD
  async getVehicles() {
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .select(`
          *,
          vehicle_images (*),
          vehicle_videos (*)
        `)
        .eq('dealer_id', this.currentDealerId)
        .order('created_at', { ascending: false })

      if (error) throw error

      return {
        success: true,
        data: data || []
      }
    } catch (error) {
      console.error('Get vehicles error:', error)
      return {
        success: false,
        error: error.message,
        data: []
      }
    }
  }

  async getVehicle(id) {
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .select(`
          *,
          vehicle_images (*),
          vehicle_videos (*)
        `)
        .eq('id', id)
        .eq('dealer_id', this.currentDealerId)
        .single()

      if (error) throw error

      return {
        success: true,
        data
      }
    } catch (error) {
      console.error('Get vehicle error:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  async createVehicle(vehicleData, images = [], videos = []) {
    try {
      // Start a transaction-like operation
      const vehicleToInsert = {
        ...vehicleData,
        dealer_id: this.currentDealerId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      // Insert vehicle
      const { data: vehicle, error: vehicleError } = await supabase
        .from('vehicles')
        .insert([vehicleToInsert])
        .select()
        .single()

      if (vehicleError) throw vehicleError

      // Upload images to Cloudinary and save references
      const imagePromises = images.map(async (file, index) => {
        const uploadResult = await cloudinaryService.uploadFile(
          file, 
          this.currentDealerId, 
          vehicle.id, 
          'image'
        )

        if (!uploadResult.success) {
          throw new Error(`Image upload failed: ${uploadResult.error}`)
        }

        return {
          vehicle_id: vehicle.id,
          url: uploadResult.url,
          public_id: uploadResult.publicId,
          is_primary: index === 0,
          created_at: new Date().toISOString()
        }
      })

      // Upload videos to Cloudinary and save references
      const videoPromises = videos.map(async (file) => {
        const uploadResult = await cloudinaryService.uploadFile(
          file, 
          this.currentDealerId, 
          vehicle.id, 
          'video'
        )

        if (!uploadResult.success) {
          throw new Error(`Video upload failed: ${uploadResult.error}`)
        }

        return {
          vehicle_id: vehicle.id,
          url: uploadResult.url,
          public_id: uploadResult.publicId,
          created_at: new Date().toISOString()
        }
      })

      // Wait for all uploads to complete
      const imageRecords = await Promise.all(imagePromises)
      const videoRecords = await Promise.all(videoPromises)

      // Insert image records
      if (imageRecords.length > 0) {
        const { error: imageError } = await supabase
          .from('vehicle_images')
          .insert(imageRecords)

        if (imageError) throw imageError
      }

      // Insert video records
      if (videoRecords.length > 0) {
        const { error: videoError } = await supabase
          .from('vehicle_videos')
          .insert(videoRecords)

        if (videoError) throw videoError
      }

      return {
        success: true,
        data: vehicle
      }
    } catch (error) {
      console.error('Create vehicle error:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  async updateVehicle(id, vehicleData, newImages = [], newVideos = []) {
    try {
      // Update vehicle data
      const { data: vehicle, error: vehicleError } = await supabase
        .from('vehicles')
        .update({
          ...vehicleData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('dealer_id', this.currentDealerId)
        .select()
        .single()

      if (vehicleError) throw vehicleError

      // Handle new image uploads
      if (newImages.length > 0) {
        const imagePromises = newImages.map(async (file) => {
          const uploadResult = await cloudinaryService.uploadFile(
            file, 
            this.currentDealerId, 
            id, 
            'image'
          )

          if (!uploadResult.success) {
            throw new Error(`Image upload failed: ${uploadResult.error}`)
          }

          return {
            vehicle_id: id,
            url: uploadResult.url,
            public_id: uploadResult.publicId,
            is_primary: false,
            created_at: new Date().toISOString()
          }
        })

        const imageRecords = await Promise.all(imagePromises)

        const { error: imageError } = await supabase
          .from('vehicle_images')
          .insert(imageRecords)

        if (imageError) throw imageError
      }

      // Handle new video uploads
      if (newVideos.length > 0) {
        const videoPromises = newVideos.map(async (file) => {
          const uploadResult = await cloudinaryService.uploadFile(
            file, 
            this.currentDealerId, 
            id, 
            'video'
          )

          if (!uploadResult.success) {
            throw new Error(`Video upload failed: ${uploadResult.error}`)
          }

          return {
            vehicle_id: id,
            url: uploadResult.url,
            public_id: uploadResult.publicId,
            created_at: new Date().toISOString()
          }
        })

        const videoRecords = await Promise.all(videoPromises)

        const { error: videoError } = await supabase
          .from('vehicle_videos')
          .insert(videoRecords)

        if (videoError) throw videoError
      }

      return {
        success: true,
        data: vehicle
      }
    } catch (error) {
      console.error('Update vehicle error:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  async deleteVehicle(id) {
    try {
      // Get vehicle with images and videos first
      const { data: vehicle } = await supabase
        .from('vehicles')
        .select(`
          *,
          vehicle_images (*),
          vehicle_videos (*)
        `)
        .eq('id', id)
        .eq('dealer_id', this.currentDealerId)
        .single()

      if (!vehicle) {
        throw new Error('Vehicle not found')
      }

      // Delete from Cloudinary (mark for deletion - actual deletion needs server-side)
      vehicle.vehicle_images?.forEach(image => {
        cloudinaryService.deleteFile(image.public_id, 'image')
      })

      vehicle.vehicle_videos?.forEach(video => {
        cloudinaryService.deleteFile(video.public_id, 'video')
      })

      // Delete from database (cascade will handle images/videos)
      const { error } = await supabase
        .from('vehicles')
        .delete()
        .eq('id', id)
        .eq('dealer_id', this.currentDealerId)

      if (error) throw error

      return {
        success: true
      }
    } catch (error) {
      console.error('Delete vehicle error:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  // Bulk operations
  async bulkDeleteVehicles(vehicleIds) {
    try {
      const results = await Promise.all(
        vehicleIds.map(id => this.deleteVehicle(id))
      )

      const failures = results.filter(r => !r.success)
      
      return {
        success: failures.length === 0,
        deleted: results.filter(r => r.success).length,
        failed: failures.length,
        errors: failures.map(f => f.error)
      }
    } catch (error) {
      console.error('Bulk delete error:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  // Image/Video management
  async deleteVehicleImage(imageId) {
    try {
      // Get image info first
      const { data: image } = await supabase
        .from('vehicle_images')
        .select('*')
        .eq('id', imageId)
        .single()

      if (image) {
        // Delete from Cloudinary
        await cloudinaryService.deleteFile(image.public_id, 'image')

        // Delete from database
        const { error } = await supabase
          .from('vehicle_images')
          .delete()
          .eq('id', imageId)

        if (error) throw error
      }

      return { success: true }
    } catch (error) {
      console.error('Delete image error:', error)
      return { success: false, error: error.message }
    }
  }

  async deleteVehicleVideo(videoId) {
    try {
      // Get video info first
      const { data: video } = await supabase
        .from('vehicle_videos')
        .select('*')
        .eq('id', videoId)
        .single()

      if (video) {
        // Delete from Cloudinary
        await cloudinaryService.deleteFile(video.public_id, 'video')

        // Delete from database
        const { error } = await supabase
          .from('vehicle_videos')
          .delete()
          .eq('id', videoId)

        if (error) throw error
      }

      return { success: true }
    } catch (error) {
      console.error('Delete video error:', error)
      return { success: false, error: error.message }
    }
  }
}

export default new SupabaseApiService()
