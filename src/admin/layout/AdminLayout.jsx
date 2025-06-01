// Admin Layout with Navigation
import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';

const AdminLayout = () => {
  const { user, logout } = useAdminAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: '📊' },
    { name: 'Vehicles', href: '/admin/vehicles', icon: '🚗' },
    { name: 'Analytics', href: '/admin/analytics', icon: '📈' },
    { name: 'Settings', href: '/admin/settings', icon: '⚙️' }
  ];

  const isActive = (href) => location.pathname.startsWith(href);

  const handleLogout = async () => {
    try {
      await logout();
      // Redirect to homepage instead of login
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
      // Still redirect even if logout fails
      navigate('/', { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              {/* Logo */}
              <div className="flex-shrink-0 flex items-center">
                <Link to="/admin/dashboard" className="text-xl font-bold text-gray-900">
                  Rams Motors Admin
                </Link>
              </div>
              
              {/* Navigation Links */}
              <div className="hidden md:ml-6 md:flex md:space-x-8">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      isActive(item.href)
                        ? 'border-blue-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                  >
                    <span className="mr-2">{item.icon}</span>
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                Welcome, {user?.username || 'Admin'}
              </span>              <button
                onClick={handleLogout}
                className="bg-gray-800 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 transition duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive(item.href)
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <span className="mr-2">{item.icon}</span>
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
