import { Loader } from '@googlemaps/js-api-loader';
import googleMapsDebugger from './googleMapsDebug';

// Centralized Google Maps loader to prevent conflicts
class GoogleMapsLoader {
  constructor() {
    this.loader = null;
    this.loadPromise = null;
    this.isLoaded = false;
    this.config = {
      apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
      version: "weekly", // Use consistent version across all loads
      libraries: ["places"],
      id: "__googleMapsScriptId" // Ensure consistent ID
    };
  }
  // Check if Google Maps script already exists in DOM
  isScriptLoaded() {
    // Check for existing script tags
    const existingScript = document.querySelector(`script[src*="maps.googleapis.com"]`);
    if (existingScript) {
      return true;
    }

    // Check if Google Maps API is available in window
    if (window.google && window.google.maps) {
      return true;
    }

    return false;
  }

  // Remove conflicting scripts before loading
  cleanupConflictingScripts() {
    const scripts = document.querySelectorAll('script[src*="maps.googleapis.com"]');
    scripts.forEach(script => {
      const src = script.src;
      // Check for version conflicts
      if (src.includes('v=beta') && this.config.version === 'weekly') {
        console.warn('⚠️ Removing conflicting Google Maps script with beta version:', src);
        script.remove();
      } else if (src.includes('v=weekly') && this.config.version === 'beta') {
        console.warn('⚠️ Removing conflicting Google Maps script with weekly version:', src);        script.remove();
      }
    });
  }

  async load() {
    // Log the load attempt for debugging
    googleMapsDebugger.logLoadAttempt(this.config);    // If already loaded, return the existing promise
    if (this.loadPromise) {
      return this.loadPromise;
    }

    // Check if Google Maps is already loaded
    if (this.isScriptLoaded()) {
      this.isLoaded = true;
      return Promise.resolve(window.google);
    }

    // Clean up any conflicting scripts
    this.cleanupConflictingScripts();

    // Create loader with consistent configuration
    this.loader = new Loader(this.config);    // Store the load promise to prevent multiple calls
    this.loadPromise = this.loader.load().then((google) => {
      this.isLoaded = true;
      return google;
    }).catch((error) => {
      console.error('❌ Failed to load Google Maps:', error);
      // Reset on error so it can be retried
      this.loadPromise = null;
      this.loader = null;
      throw error;
    });

    return this.loadPromise;
  }

  isGoogleMapsLoaded() {
    return this.isLoaded;
  }

  getConfig() {
    return this.config;
  }
}

// Export singleton instance
const googleMapsLoader = new GoogleMapsLoader();
export default googleMapsLoader;