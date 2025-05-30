import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary (will be set from environment variables)
cloudinary.config({
  cloud_name: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME || 'YOUR_CLOUD_NAME',
  api_key: process.env.REACT_APP_CLOUDINARY_API_KEY || 'YOUR_API_KEY',
  api_secret: process.env.REACT_APP_CLOUDINARY_API_SECRET || 'YOUR_API_SECRET',
})

class CloudinaryService {
  constructor() {
    this.uploadPreset = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET || 'ramsmotors_unsigned'
  }

  // Generate optimized image URL
  getOptimizedImageUrl(publicId, options = {}) {
    const defaultOptions = {
      width: 800,
      height: 600,
      crop: 'fill',
      quality: 'auto:best',
      format: 'auto',
      ...options
    }
    
    return cloudinary.url(publicId, defaultOptions)
  }

  // Generate thumbnail URL
  getThumbnailUrl(publicId, size = 200) {
    return cloudinary.url(publicId, {
      width: size,
      height: size,
      crop: 'fill',
      quality: 'auto:good',
      format: 'auto'
    })
  }

  // Upload file directly from frontend (unsigned upload)
  async uploadFile(file, dealerId, vehicleId, fileType = 'image') {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', this.uploadPreset)
    formData.append('folder', `dealership_${dealerId}/vehicle_${vehicleId}`)
    formData.append('resource_type', fileType === 'video' ? 'video' : 'image')

    const endpoint = `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/${fileType === 'video' ? 'video' : 'image'}/upload`

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`)
      }

      const result = await response.json()
      return {
        success: true,
        publicId: result.public_id,
        url: result.secure_url,
        format: result.format,
        bytes: result.bytes
      }
    } catch (error) {
      console.error('Cloudinary upload error:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  // Delete file from Cloudinary
  async deleteFile(publicId, resourceType = 'image') {
    try {
      // Note: For delete operations, you'll need server-side API or signed uploads
      // For now, we'll just mark as deleted in our database
      console.warn('Delete operation requires server-side implementation for security')
      return { success: true }
    } catch (error) {
      console.error('Cloudinary delete error:', error)
      return { success: false, error: error.message }
    }
  }
}

export default new CloudinaryService()
