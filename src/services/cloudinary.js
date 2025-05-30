// Web-compatible Cloudinary service for React frontend
class CloudinaryService {
  constructor() {
    this.cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME || 'dh5pac1ru'
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
    
    const params = Object.entries(defaultOptions)
      .map(([key, value]) => `${key}_${value}`)
      .join(',')
    
    return `https://res.cloudinary.com/${this.cloudName}/image/upload/${params}/${publicId}`
  }

  // Generate thumbnail URL
  getThumbnailUrl(publicId, size = 200) {
    return `https://res.cloudinary.com/${this.cloudName}/image/upload/w_${size},h_${size},c_fill,q_auto:good,f_auto/${publicId}`
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

const cloudinaryService = new CloudinaryService()
export default cloudinaryService
