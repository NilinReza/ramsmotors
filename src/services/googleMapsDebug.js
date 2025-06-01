// Debug utility to detect multiple Google Maps loads

class GoogleMapsDebugger {
  constructor() {
    this.loadAttempts = [];
    this.originalLoader = null;
  }

  logLoadAttempt(config) {
    const timestamp = new Date().toISOString();
    this.loadAttempts.push({
      timestamp,
      config,
      stack: new Error().stack
    });

    console.log('🗺️ Google Maps load attempt:', {
      timestamp,
      config,
      attemptNumber: this.loadAttempts.length
    });

    // Warn if multiple different configurations
    if (this.loadAttempts.length > 1) {
      const configs = this.loadAttempts.map(attempt => attempt.config);
      const hasConflicts = configs.some((config, index) => {
        return index > 0 && JSON.stringify(config) !== JSON.stringify(configs[0]);
      });

      if (hasConflicts) {
        console.error('⚠️ GOOGLE MAPS CONFLICT DETECTED!');
        console.table(configs);
        console.log('Load attempts:', this.loadAttempts);
      }
    }
  }

  getLoadHistory() {
    return this.loadAttempts;
  }
}

const googleMapsDebugger = new GoogleMapsDebugger();

// Add to window for debugging
if (typeof window !== 'undefined') {
  window.googleMapsDebugger = googleMapsDebugger;
}

export default googleMapsDebugger;