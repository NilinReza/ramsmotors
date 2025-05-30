// Modern Dashboard with Analytics Cards
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { vehicleService } from '../services/vehicleService';
import { analyticsService } from '../services/analyticsService';
import StatsCard from '../components/StatsCard';
import QuickActions from '../components/QuickActions';
import RecentActivity from '../components/RecentActivity';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalVehicles: 0,
    availableVehicles: 0,
    soldThisMonth: 0,
    totalValue: 0
  });
  const [recentVehicles, setRecentVehicles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      setError('');

      // Load dashboard statistics
      const [vehicleStats, recentData] = await Promise.all([
        analyticsService.getVehicleStats(),
        vehicleService.getRecentVehicles(5)
      ]);

      setStats(vehicleStats);
      setRecentVehicles(recentData);

    } catch (error) {
      console.error('Dashboard data loading failed:', error);
      setError('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Welcome back! Here's what's happening with your dealership.
        </p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="text-red-500">⚠️</span>
            </div>
            <div className="ml-3">
              <p className="text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Vehicles"
          value={stats.totalVehicles}
          icon="🚗"
          color="blue"
        />
        <StatsCard
          title="Available"
          value={stats.availableVehicles}
          icon="✅"
          color="green"
        />
        <StatsCard
          title="Sold This Month"
          value={stats.soldThisMonth}
          icon="💰"
          color="yellow"
        />
        <StatsCard
          title="Total Inventory Value"
          value={`$${stats.totalValue.toLocaleString()}`}
          icon="💎"
          color="purple"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <QuickActions onRefresh={loadDashboardData} />
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <RecentActivity vehicles={recentVehicles} />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex flex-col sm:flex-row gap-4">
        <Link
          to="/admin/vehicles/add"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition duration-200 text-center"
        >
          ➕ Add New Vehicle
        </Link>
        <Link
          to="/admin/vehicles"
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-6 rounded-lg transition duration-200 text-center"
        >
          📋 Manage Inventory
        </Link>
        <Link
          to="/admin/analytics"
          className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition duration-200 text-center"
        >
          📊 View Analytics
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
