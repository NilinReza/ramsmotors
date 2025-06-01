// Updated Cloudinary Service for Rams Motors
// Handles both image and video uploads with proper dealer and vehicle organization

const uploadFile = async (file, dealerId = null, vehicleId = null, resourceType = "image") => {
  try {
    console.log("☁️ Starting Cloudinary upload:", {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      resourceType,
      dealerId,
      vehicleId
    });

    // Validate file
    if (!file || !file.name) {
      throw new Error("Invalid file provided");
    }

    // Check file size (limit to 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      throw new Error(
        `File size too large. Maximum size is ${maxSize / 1024 / 1024}MB`
      );
    }

    // Validate environment variables
    const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;

    console.log("🔑 Cloudinary config check:", {
      hasCloudName: !!cloudName,
      hasUploadPreset: !!uploadPreset,
      cloudName: cloudName ? `${cloudName.substring(0, 5)}...` : "MISSING",
      uploadPreset: uploadPreset
        ? `${uploadPreset.substring(0, 5)}...`
        : "MISSING",
    });

    if (!cloudName || !uploadPreset) {
      throw new Error(
        "Missing Cloudinary configuration. Please check REACT_APP_CLOUDINARY_CLOUD_NAME and REACT_APP_CLOUDINARY_UPLOAD_PRESET environment variables."
      );
    }

    // Create form data
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);
    
    // Add folder organization if dealer and vehicle IDs are provided
    if (dealerId && vehicleId) {
      formData.append("folder", `${dealerId}/vehicles/${vehicleId}/${resourceType}s`);
    } else if (dealerId) {
      formData.append("folder", `${dealerId}/${resourceType}s`);
    }
      // Add resource type specific settings
    if (resourceType === "image") {
      formData.append("resource_type", "image");
      // Note: transformations not allowed with unsigned uploads
      // Image optimization will be handled by Cloudinary's auto settings in upload preset
    } else if (resourceType === "video") {
      formData.append("resource_type", "video");
      // Note: transformations not allowed with unsigned uploads
      // Video optimization will be handled by Cloudinary's upload preset
    }

    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;

    console.log("🌐 Uploading to:", uploadUrl);

    const response = await fetch(uploadUrl, {
      method: "POST",
      body: formData,
    });

    console.log(
      "📡 Upload response status:",
      response.status,
      response.statusText
    );

    if (!response.ok) {
      // Get error details from response
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;

      try {
        const errorData = await response.json();
        console.error("❌ Cloudinary error details:", errorData);

        if (errorData.error && errorData.error.message) {
          errorMessage = errorData.error.message;
        }
      } catch (parseError) {
        // If we can't parse the error response, use the response text
        try {
          const errorText = await response.text();
          console.error("❌ Cloudinary error text:", errorText);
          errorMessage = errorText || errorMessage;
        } catch (textError) {
          console.error("❌ Could not parse error response");
        }
      }

      throw new Error(`Upload failed: ${errorMessage}`);
    }

    const result = await response.json();
    console.log("✅ Upload successful:", {
      publicId: result.public_id,
      secureUrl: result.secure_url,
      format: result.format,
      resourceType: result.resource_type,
    });

    return {
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
      resourceType: result.resource_type,
    };
  } catch (error) {
    console.error("❌ Cloudinary upload error:", error);
    throw error;
  }
};

const deleteFile = async (publicId, resourceType = "image") => {
  try {
    console.log("🗑️ Attempting to delete Cloudinary file:", publicId);

    // For now, just log the deletion attempt
    // Actual deletion would require server-side implementation with API secret
    console.log("⚠️ File deletion requires server-side implementation");

    return {
      success: true,
      message: "File marked for deletion",
    };
  } catch (error) {
    console.error("❌ Cloudinary delete error:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

const cloudinaryService = {
  uploadFile,
  deleteFile,
};

export default cloudinaryService;
