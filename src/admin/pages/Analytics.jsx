import React from 'react';
import { 
  ChartBarIcon, 
  TruckIcon, 
  CurrencyDollarIcon, 
  UserGroupIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline';

const Analytics = () => {
  // Mock analytics data
  const analyticsData = {
    overview: {
      totalVehicles: 127,
      totalValue: 3250000,
      avgPrice: 25590,
      salesThisMonth: 18,
      previousMonth: 15
    },
    salesTrends: [
      { month: 'Jan', sales: 12, revenue: 325000 },
      { month: 'Feb', sales: 15, revenue: 410000 },
      { month: 'Mar', sales: 18, revenue: 475000 },
      { month: 'Apr', sales: 22, revenue: 580000 },
      { month: 'May', sales: 19, revenue: 495000 },
      { month: 'Jun', sales: 25, revenue: 650000 }
    ],
    popularMakes: [
      { make: 'Toyota', count: 28, percentage: 22 },
      { make: 'Honda', count: 24, percentage: 19 },
      { make: 'Ford', count: 18, percentage: 14 },
      { make: 'Chevrolet', count: 15, percentage: 12 },
      { make: 'Nissan', count: 12, percentage: 9 }
    ],
    priceDistribution: [
      { range: 'Under $15k', count: 25 },
      { range: '$15k - $25k', count: 42 },
      { range: '$25k - $35k', count: 38 },
      { range: '$35k - $50k', count: 18 },
      { range: 'Over $50k', count: 4 }
    ],
    inventory: {
      available: 105,
      pending: 8,
      sold: 14,
      draft: 3
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const calculateGrowth = (current, previous) => {
    const growth = ((current - previous) / previous) * 100;
    return growth;
  };

  const salesGrowth = calculateGrowth(
    analyticsData.overview.salesThisMonth,
    analyticsData.overview.previousMonth
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600">Track your dealership performance and insights</p>
        </div>
        <div className="flex space-x-3">
          <select className="border border-gray-300 rounded-md px-3 py-2 text-sm">
            <option>Last 30 days</option>
            <option>Last 3 months</option>
            <option>Last 6 months</option>
            <option>Last year</option>
          </select>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition-colors">
            Export Report
          </button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Vehicles</p>
              <p className="text-3xl font-bold text-gray-900">{analyticsData.overview.totalVehicles}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <TruckIcon className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Inventory Value</p>
              <p className="text-3xl font-bold text-gray-900">
                {formatCurrency(analyticsData.overview.totalValue)}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Price</p>
              <p className="text-3xl font-bold text-gray-900">
                {formatCurrency(analyticsData.overview.avgPrice)}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <ChartBarIcon className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Sales This Month</p>
              <p className="text-3xl font-bold text-gray-900">{analyticsData.overview.salesThisMonth}</p>
              <div className="flex items-center mt-2">                {salesGrowth >= 0 ? (
                  <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
                ) : (
                  <ArrowTrendingDownIcon className="h-4 w-4 text-red-500 mr-1" />
                )}
                <span className={`text-sm ${salesGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {Math.abs(salesGrowth).toFixed(1)}% vs last month
                </span>
              </div>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <UserGroupIcon className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Trends */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales Trends</h3>
          <div className="space-y-4">
            {analyticsData.salesTrends.map((data, index) => (
              <div key={data.month} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-gray-700 w-8">{data.month}</span>
                  <div className="w-48 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${(data.sales / 25) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{data.sales} sales</p>
                  <p className="text-xs text-gray-600">{formatCurrency(data.revenue)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Makes */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Makes</h3>
          <div className="space-y-4">
            {analyticsData.popularMakes.map((make, index) => (
              <div key={make.make} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-gray-700 w-20">{make.make}</span>
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: `${make.percentage * 4}%` }}
                    ></div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{make.count} vehicles</p>
                  <p className="text-xs text-gray-600">{make.percentage}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Additional Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Price Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Price Distribution</h3>
          <div className="space-y-3">
            {analyticsData.priceDistribution.map((range, index) => (
              <div key={range.range} className="flex items-center justify-between">
                <span className="text-sm text-gray-700">{range.range}</span>
                <div className="flex items-center space-x-3">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-purple-600 h-2 rounded-full" 
                      style={{ width: `${(range.count / 42) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-8">{range.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Inventory Status */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Inventory Status</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">{analyticsData.inventory.available}</p>
              <p className="text-sm text-green-800">Available</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <p className="text-2xl font-bold text-yellow-600">{analyticsData.inventory.pending}</p>
              <p className="text-sm text-yellow-800">Pending</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{analyticsData.inventory.sold}</p>
              <p className="text-sm text-blue-800">Sold</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-600">{analyticsData.inventory.draft}</p>
              <p className="text-sm text-gray-800">Draft</p>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Performance Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600">82.5%</p>
            <p className="text-sm text-gray-600 mt-1">Inventory Turnover Rate</p>
            <p className="text-xs text-gray-500 mt-1">↑ 5.2% from last month</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600">15.3</p>
            <p className="text-sm text-gray-600 mt-1">Average Days on Lot</p>
            <p className="text-xs text-gray-500 mt-1">↓ 2.1 days from last month</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-purple-600">$2,450</p>
            <p className="text-sm text-gray-600 mt-1">Average Profit per Sale</p>
            <p className="text-xs text-gray-500 mt-1">↑ $150 from last month</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
