// Data synchronization utility for cross-page vehicle updates
// This ensures inventory page refreshes when vehicles are added/updated/deleted

class DataSyncManager {
  constructor() {
    this.events = new EventTarget();
  }

  // Emit vehicle data change event
  emitVehicleChange(action, vehicleData = null) {
    console.log(`🔄 DataSync: Emitting ${action} event`, vehicleData?.id);
    
    const event = new CustomEvent('vehicleDataChanged', {
      detail: {
        action, // 'create', 'update', 'delete', 'bulk_delete', 'refresh'
        vehicleData,
        timestamp: new Date().toISOString()
      }
    });
    
    // Emit on our event target
    this.events.dispatchEvent(event);
    
    // Also emit on window for cross-component communication
    window.dispatchEvent(event);
  }

  // Listen for vehicle data changes
  onVehicleChange(callback) {
    const handler = (event) => {
      console.log(`🔄 DataSync: Received ${event.detail.action} event`);
      callback(event.detail);
    };
    
    this.events.addEventListener('vehicleDataChanged', handler);
    window.addEventListener('vehicleDataChanged', handler);
    
    // Return cleanup function
    return () => {
      this.events.removeEventListener('vehicleDataChanged', handler);
      window.removeEventListener('vehicleDataChanged', handler);
    };
  }

  // Force refresh all vehicle data across the app
  refreshAll() {
    this.emitVehicleChange('refresh');
  }

  // Emit specific CRUD operations
  vehicleCreated(vehicleData) {
    this.emitVehicleChange('create', vehicleData);
  }

  vehicleUpdated(vehicleData) {
    this.emitVehicleChange('update', vehicleData);
  }

  vehicleDeleted(vehicleId) {
    this.emitVehicleChange('delete', { id: vehicleId });
  }
  vehiclesBulkDeleted(deletedVehicles) {
    this.emitVehicleChange('bulk_delete', { 
      deletedVehicles,
      ids: deletedVehicles.map(v => v.id) 
    });
  }
}

// Create singleton instance
const dataSync = new DataSyncManager();

export default dataSync;
