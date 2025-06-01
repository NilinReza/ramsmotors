// Analytics Service - Dashboard Stats
import mockApiService from '../../services/mockApi';

const USE_MOCK_DATA = true; // Enable mock data for dashboard functionality

class AnalyticsService {
  constructor() {
    this.isInitialized = false;
  }

  async initialize() {
    if (this.isInitialized) return;
    
    if (!USE_MOCK_DATA) {
      // TODO: Initialize Supabase client
      // this.supabase = createClient(url, key);
    }
    
    this.isInitialized = true;
  }

  async getVehicleStats() {
    await this.initialize();
    
    if (USE_MOCK_DATA) {
      try {
        const response = await mockApiService.getVehicles();
        const vehicles = response.data || [];
        
        const stats = {
          totalVehicles: vehicles.length,
          availableVehicles: vehicles.filter(v => v.status === 'Available').length,
          soldThisMonth: vehicles.filter(v => {
            if (v.status === 'Sold' && v.soldDate) {
              const soldDate = new Date(v.soldDate);
              const currentMonth = new Date().getMonth();
              const currentYear = new Date().getFullYear();
              return soldDate.getMonth() === currentMonth && soldDate.getFullYear() === currentYear;
            }
            return false;
          }).length,
          totalValue: vehicles
            .filter(v => v.status === 'Available')
            .reduce((sum, v) => sum + (parseFloat(v.price) || 0), 0)
        };
        
        return stats;
      } catch (error) {
        console.error('Error getting vehicle stats:', error);
        return {
          totalVehicles: 0,
          availableVehicles: 0,
          soldThisMonth: 0,
          totalValue: 0
        };
      }
    }
    
    // Supabase implementation
    /*
    const { data: vehicles, error } = await this.supabase
      .from('vehicles')
      .select('status, price, sold_date');
    
    if (error) {
      throw new Error(error.message);
    }
    
    const stats = {
      totalVehicles: vehicles.length,
      availableVehicles: vehicles.filter(v => v.status === 'Available').length,
      soldThisMonth: vehicles.filter(v => {
        if (v.status === 'Sold' && v.sold_date) {
          const soldDate = new Date(v.sold_date);
          const currentMonth = new Date().getMonth();
          const currentYear = new Date().getFullYear();
          return soldDate.getMonth() === currentMonth && soldDate.getFullYear() === currentYear;
        }
        return false;
      }).length,
      totalValue: vehicles
        .filter(v => v.status === 'Available')
        .reduce((sum, v) => sum + (parseFloat(v.price) || 0), 0)
    };
    
    return stats;
    */
    
    throw new Error('Supabase not configured');
  }

  async getSalesData(period = '30d') {
    await this.initialize();
    
    if (USE_MOCK_DATA) {
      // Mock sales data for charts
      const mockData = [];
      const days = period === '30d' ? 30 : 7;
      
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        
        mockData.push({
          date: date.toISOString().split('T')[0],
          sales: Math.floor(Math.random() * 10) + 1,
          revenue: Math.floor(Math.random() * 50000) + 10000
        });
      }
      
      return mockData;
    }
    
    // Supabase implementation
    /*
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - (period === '30d' ? 30 : 7));
    
    const { data, error } = await this.supabase
      .from('vehicles')
      .select('sold_date, price')
      .eq('status', 'Sold')
      .gte('sold_date', startDate.toISOString());
    
    if (error) {
      throw new Error(error.message);
    }
    
    // Group by date and aggregate
    const salesByDate = {};
    data.forEach(vehicle => {
      const date = vehicle.sold_date.split('T')[0];
      if (!salesByDate[date]) {
        salesByDate[date] = { sales: 0, revenue: 0 };
      }
      salesByDate[date].sales++;
      salesByDate[date].revenue += parseFloat(vehicle.price);
    });
    
    return Object.entries(salesByDate).map(([date, data]) => ({
      date,
      ...data
    }));
    */
    
    throw new Error('Supabase not configured');
  }

  async getPopularMakes() {
    await this.initialize();
    
    if (USE_MOCK_DATA) {
      try {
        const response = await mockApiService.getVehicles();
        const vehicles = response.data || [];
        
        const makeCount = {};
        vehicles.forEach(vehicle => {
          const make = vehicle.make || 'Unknown';
          makeCount[make] = (makeCount[make] || 0) + 1;
        });
        
        return Object.entries(makeCount)
          .map(([make, count]) => ({ make, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 10);
      } catch (error) {
        console.error('Error getting popular makes:', error);
        return [];
      }
    }
    
    // Supabase implementation
    /*
    const { data, error } = await this.supabase
      .from('vehicles')
      .select('make');
    
    if (error) {
      throw new Error(error.message);
    }
    
    const makeCount = {};
    data.forEach(vehicle => {
      const make = vehicle.make || 'Unknown';
      makeCount[make] = (makeCount[make] || 0) + 1;
    });
    
    return Object.entries(makeCount)
      .map(([make, count]) => ({ make, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
    */
    
    throw new Error('Supabase not configured');
  }

  async getInventoryTrends() {
    await this.initialize();
    
    if (USE_MOCK_DATA) {
      // Mock inventory trends
      return {
        averageDaysOnLot: 45,
        fastestSelling: 'Honda Civic',
        slowestSelling: 'Luxury SUV',
        turnoverRate: 0.15,
        monthlyAdditions: 12,
        monthlySales: 8
      };
    }
    
    // Supabase implementation would calculate real trends
    throw new Error('Supabase not configured');
  }
}

// Export singleton instance
export const analyticsService = new AnalyticsService();
