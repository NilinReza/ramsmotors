import { supabase } from "../config/supabase";
import cloudinaryService from "./cloudinary";

class SupabaseApiService {
  constructor() {
    this.currentDealerId = "ramsmotors"; // Default for RamsMotors, will be dynamic later
    this.googleReviewsCache = {
      data: null,
      timestamp: null,
      isLoading: false,
    };
    this.CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache
  }

  // Set the current dealer context
  setDealerId(dealerId) {
    this.currentDealerId = dealerId;
  }
  // Authentication
  async login(email, password) {
    try {
      console.log("🔐 SupabaseApiService.login called with:", {
        email,
        hasPassword: !!password,
        emailType: typeof email,
        passwordType: typeof password,
      });

      // Validate input parameters
      if (!email || !password) {
        throw new Error("Email and password are required");
      }

      if (typeof email !== "string" || typeof password !== "string") {
        throw new Error("Email and password must be strings");
      }

      // Ensure we're not accidentally passing an object
      const authPayload = {
        email: String(email).trim(),
        password: String(password),
      };

      console.log(
        "🔐 Calling supabase.auth.signInWithPassword with payload structure:",
        {
          email: authPayload.email,
          hasPassword: !!authPayload.password,
        }
      );

      const { data, error } = await supabase.auth.signInWithPassword(
        authPayload
      );

      if (error) {
        console.error("❌ Supabase auth error:", error);
        throw error;
      }

      console.log("✅ Supabase authentication successful");

      // Get additional user info from our admin_users table
      const { data: adminUser, error: userError } = await supabase
        .from("admin_users")
        .select("*")
        .eq("email", email)
        .eq("dealer_id", this.currentDealerId)
        .single();

      if (userError) {
        console.warn("⚠️ Admin user lookup warning:", userError);
        // Don't fail if admin_users table doesn't exist, just proceed with auth user
      }

      return {
        success: true,
        user: data.user,
        session: data.session,
        adminUser: adminUser || null,
      };
    } catch (error) {
      console.error("❌ SupabaseApiService login error:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async logout() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error("Logout error:", error);
      return { success: false, error: error.message };
    }
  }

  // Get current session
  async getSession() {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      return session;
    } catch (error) {
      console.error("Session error:", error);
      return null;
    }
  }

  // Vehicles CRUD
  async getVehicles() {
    try {
      const { data, error } = await supabase
        .from("vehicles")
        .select(
          `
          *,
          vehicle_images (*),
          vehicle_videos (*)
        `
        )
        .eq("dealer_id", this.currentDealerId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      return {
        success: true,
        data: data || [],
      };
    } catch (error) {
      console.error("Get vehicles error:", error);
      return {
        success: false,
        error: error.message,
        data: [],
      };
    }
  }

  async getVehicle(id) {
    try {
      const { data, error } = await supabase
        .from("vehicles")
        .select(
          `
          *,
          vehicle_images (*),
          vehicle_videos (*)
        `
        )
        .eq("id", id)
        .eq("dealer_id", this.currentDealerId)
        .single();

      if (error) throw error;

      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error("Get vehicle error:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async createVehicle(vehicleData, images = [], videos = []) {
    try {
      // Start a transaction-like operation
      const vehicleToInsert = {
        ...vehicleData,
        dealer_id: this.currentDealerId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Insert vehicle
      const { data: vehicle, error: vehicleError } = await supabase
        .from("vehicles")
        .insert([vehicleToInsert])
        .select()
        .single();

      if (vehicleError) throw vehicleError;

      // Upload images to Cloudinary and save references
      const imagePromises = images.map(async (file, index) => {
        const uploadResult = await cloudinaryService.uploadFile(
          file,
          this.currentDealerId,
          vehicle.id,
          "image"
        );

        if (!uploadResult.success) {
          throw new Error(`Image upload failed: ${uploadResult.error}`);
        }

        return {
          vehicle_id: vehicle.id,
          url: uploadResult.url,
          public_id: uploadResult.publicId,
          is_primary: index === 0,
          created_at: new Date().toISOString(),
        };
      });

      // Upload videos to Cloudinary and save references
      const videoPromises = videos.map(async (file) => {
        const uploadResult = await cloudinaryService.uploadFile(
          file,
          this.currentDealerId,
          vehicle.id,
          "video"
        );

        if (!uploadResult.success) {
          throw new Error(`Video upload failed: ${uploadResult.error}`);
        }

        return {
          vehicle_id: vehicle.id,
          url: uploadResult.url,
          public_id: uploadResult.publicId,
          created_at: new Date().toISOString(),
        };
      });

      // Wait for all uploads to complete
      const imageRecords = await Promise.all(imagePromises);
      const videoRecords = await Promise.all(videoPromises);

      // Insert image records
      if (imageRecords.length > 0) {
        const { error: imageError } = await supabase
          .from("vehicle_images")
          .insert(imageRecords);

        if (imageError) throw imageError;
      }

      // Insert video records
      if (videoRecords.length > 0) {
        const { error: videoError } = await supabase
          .from("vehicle_videos")
          .insert(videoRecords);

        if (videoError) throw videoError;
      }

      return {
        success: true,
        data: vehicle,
      };
    } catch (error) {
      console.error("Create vehicle error:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async updateVehicle(id, vehicleData, newImages = [], newVideos = []) {
    try {
      // Update vehicle data
      const { data: vehicle, error: vehicleError } = await supabase
        .from("vehicles")
        .update({
          ...vehicleData,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .eq("dealer_id", this.currentDealerId)
        .select()
        .single();

      if (vehicleError) throw vehicleError;

      // Handle new image uploads
      if (newImages.length > 0) {
        const imagePromises = newImages.map(async (file) => {
          const uploadResult = await cloudinaryService.uploadFile(
            file,
            this.currentDealerId,
            id,
            "image"
          );

          if (!uploadResult.success) {
            throw new Error(`Image upload failed: ${uploadResult.error}`);
          }

          return {
            vehicle_id: id,
            url: uploadResult.url,
            public_id: uploadResult.publicId,
            is_primary: false,
            created_at: new Date().toISOString(),
          };
        });

        const imageRecords = await Promise.all(imagePromises);

        const { error: imageError } = await supabase
          .from("vehicle_images")
          .insert(imageRecords);

        if (imageError) throw imageError;
      }

      // Handle new video uploads
      if (newVideos.length > 0) {
        const videoPromises = newVideos.map(async (file) => {
          const uploadResult = await cloudinaryService.uploadFile(
            file,
            this.currentDealerId,
            id,
            "video"
          );

          if (!uploadResult.success) {
            throw new Error(`Video upload failed: ${uploadResult.error}`);
          }

          return {
            vehicle_id: id,
            url: uploadResult.url,
            public_id: uploadResult.publicId,
            created_at: new Date().toISOString(),
          };
        });

        const videoRecords = await Promise.all(videoPromises);

        const { error: videoError } = await supabase
          .from("vehicle_videos")
          .insert(videoRecords);

        if (videoError) throw videoError;
      }

      return {
        success: true,
        data: vehicle,
      };
    } catch (error) {
      console.error("Update vehicle error:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async deleteVehicle(id) {
    try {
      // Get vehicle with images and videos first
      const { data: vehicle } = await supabase
        .from("vehicles")
        .select(
          `
          *,
          vehicle_images (*),
          vehicle_videos (*)
        `
        )
        .eq("id", id)
        .eq("dealer_id", this.currentDealerId)
        .single();

      if (!vehicle) {
        throw new Error("Vehicle not found");
      }

      // Delete from Cloudinary (mark for deletion - actual deletion needs server-side)
      vehicle.vehicle_images?.forEach((image) => {
        cloudinaryService.deleteFile(image.public_id, "image");
      });

      vehicle.vehicle_videos?.forEach((video) => {
        cloudinaryService.deleteFile(video.public_id, "video");
      });

      // Delete from database (cascade will handle images/videos)
      const { error } = await supabase
        .from("vehicles")
        .delete()
        .eq("id", id)
        .eq("dealer_id", this.currentDealerId);

      if (error) throw error;

      return {
        success: true,
      };
    } catch (error) {
      console.error("Delete vehicle error:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Bulk operations
  async bulkDeleteVehicles(vehicleIds) {
    try {
      const results = await Promise.all(
        vehicleIds.map((id) => this.deleteVehicle(id))
      );

      const failures = results.filter((r) => !r.success);

      return {
        success: failures.length === 0,
        deleted: results.filter((r) => r.success).length,
        failed: failures.length,
        errors: failures.map((f) => f.error),
      };
    } catch (error) {
      console.error("Bulk delete error:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Image/Video management
  async deleteVehicleImage(imageId) {
    try {
      // Get image info first
      const { data: image } = await supabase
        .from("vehicle_images")
        .select("*")
        .eq("id", imageId)
        .single();

      if (image) {
        // Delete from Cloudinary
        await cloudinaryService.deleteFile(image.public_id, "image");

        // Delete from database
        const { error } = await supabase
          .from("vehicle_images")
          .delete()
          .eq("id", imageId);

        if (error) throw error;
      }

      return { success: true };
    } catch (error) {
      console.error("Delete image error:", error);
      return { success: false, error: error.message };
    }
  }

  async deleteVehicleVideo(videoId) {
    try {
      // Get video info first
      const { data: video } = await supabase
        .from("vehicle_videos")
        .select("*")
        .eq("id", videoId)
        .single();

      if (video) {
        // Delete from Cloudinary
        await cloudinaryService.deleteFile(video.public_id, "video");

        // Delete from database
        const { error } = await supabase
          .from("vehicle_videos")
          .delete()
          .eq("id", videoId);

        if (error) throw error;
      }

      return { success: true };
    } catch (error) {
      console.error("Delete video error:", error);
      return { success: false, error: error.message };
    }
  }

  // Google Reviews
  async getGoogleReviews() {
    try {      // Check if we have fresh cached data
      const now = Date.now();
      if (this.googleReviewsCache.data && 
          this.googleReviewsCache.timestamp && 
          (now - this.googleReviewsCache.timestamp) < this.CACHE_DURATION) {
        return {
          success: true,
          data: this.googleReviewsCache.data,
          source: 'cache'
        };
      }

      // Prevent multiple simultaneous requests
      if (this.googleReviewsCache.isLoading) {
        // Wait for the current request to complete
        return new Promise((resolve) => {
          const checkInterval = setInterval(() => {
            if (!this.googleReviewsCache.isLoading) {
              clearInterval(checkInterval);
              if (this.googleReviewsCache.data) {
                resolve({
                  success: true,
                  data: this.googleReviewsCache.data,
                  source: 'cache-after-wait'
                });
              } else {
                resolve({
                  success: false,
                  error: 'Failed to fetch after waiting'
                });
              }
            }
          }, 100);
        });
      }      // Mark as loading
      this.googleReviewsCache.isLoading = true;

      // Add retry logic and better error handling
      const maxRetries = 3;
      let lastError = null;

      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          // Call the Supabase Edge Function with explicit configuration
          const { data, error } = await supabase.functions.invoke(
            "google-reviews",
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
              },
              // Add timeout and retry configuration
              signal: AbortSignal.timeout(30000), // 30 second timeout
            }
          );

          if (error) {
            console.error(
              `❌ Supabase Edge Function error (attempt ${attempt}):`,
              error
            );

            // Check if it's a 405 error specifically
            if (error.message?.includes("405") || error.status === 405) {
              console.warn(
                "⚠️ 405 Method Not Allowed - retrying with different approach"
              );

              // Wait before retry (exponential backoff)
              if (attempt < maxRetries) {
                await new Promise((resolve) =>
                  setTimeout(resolve, attempt * 1000)
                );
                continue;
              }
            }

            lastError = error;

            // Don't retry on certain errors
            if (error.status === 401 || error.status === 403) {
              throw error;
            }

            // Continue to next attempt for other errors
            if (attempt < maxRetries) {
              await new Promise((resolve) =>
                setTimeout(resolve, attempt * 1000)
              );
              continue;
            }

            throw error;
          }          // Cache the successful result
          this.googleReviewsCache.data = data.data || data;
          this.googleReviewsCache.timestamp = now;
          this.googleReviewsCache.isLoading = false;

          return {
            success: true,
            data: data.data || data,
            source: data.source || "edge-function",
            attempt: attempt,
          };
        } catch (attemptError) {
          console.error(`❌ Attempt ${attempt} failed:`, attemptError);
          lastError = attemptError;

          // If it's the last attempt, don't wait
          if (attempt < maxRetries) {
            await new Promise((resolve) => setTimeout(resolve, attempt * 1000));
          }
        }
      }

      // If all attempts failed, throw the last error
      throw lastError;
    } catch (error) {
      console.error("❌ Error calling Google Reviews Edge Function:", error);

      // Reset loading state
      this.googleReviewsCache.isLoading = false;

      // Provide more specific error messaging
      let errorMessage = "Failed to fetch Google Reviews";

      if (error.message?.includes("405")) {
        errorMessage = "Method not allowed - please try refreshing the page";
      } else if (error.message?.includes("timeout")) {
        errorMessage = "Request timed out - please check your connection";
      } else if (error.message?.includes("CORS")) {
        errorMessage = "CORS error - please refresh the page";
      }

      return {
        success: false,
        error: errorMessage,
        originalError: error.message,
        shouldRetry:
          error.message?.includes("405") || error.message?.includes("timeout"),
      };
    }
  }

  // Helper method for components to use with automatic retry
  async getGoogleReviewsWithRetry() {
    const result = await this.getGoogleReviews();

    // If it failed with a retryable error, wait and try once more
    if (!result.success && result.shouldRetry) {
      console.log("🔄 Retrying Google Reviews fetch after failure...");
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return await this.getGoogleReviews();
    }

    return result;
  }
  // Method to clear cache manually if needed
  clearGoogleReviewsCache() {
    this.googleReviewsCache = {
      data: null,
      timestamp: null,
      isLoading: false
    };
  }

  // Initialize method to ensure proper setup
  async initialize() {
    try {
      // Ensure Supabase is properly initialized
      const {
        data: { session },
      } = await supabase.auth.getSession();
      console.log("🔧 SupabaseApiService initialized", {
        hasSession: !!session,
      });
      return true;
    } catch (error) {
      console.error("❌ Failed to initialize SupabaseApiService:", error);
      return false;
    }
  }
}

const supabaseApiService = new SupabaseApiService();
export default supabaseApiService;
