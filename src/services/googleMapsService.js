import { Loader } from '@googlemaps/js-api-loader';

// Centralized Google Maps loader with consistent configuration
class GoogleMapsService {
  constructor() {
    this.isLoaded = false;
    this.loadPromise = null;
    this.apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
    
    // STANDARDIZED OPTIONS - use "weekly" version consistently
    this.loaderOptions = {
      apiKey: this.apiKey,
      version: "weekly", // CHANGE THIS FROM "beta" TO "weekly"
      libraries: ["places"],
      id: "__googleMapsScriptId"
    };
    
    this.loader = new Loader(this.loaderOptions);
  }
  
  load() {
    if (!this.loadPromise) {
      console.log('🗺️ Loading Google Maps API (centralized)...');
      this.loadPromise = this.loader.load()
        .then(() => {
          console.log('✅ Google Maps API loaded successfully');
          this.isLoaded = true;
          return window.google;
        })
        .catch(error => {
          console.error('❌ Failed to load Google Maps API:', error);
          throw error;
        });
    }
    return this.loadPromise;
  }
  
  // Helper to check if API is loaded
  isApiLoaded() {
    return this.isLoaded;
  }
}

const googleMapsService = new GoogleMapsService();
export default googleMapsService;