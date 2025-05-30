// Quick Actions Component
import React from 'react';
import { Link } from 'react-router-dom';

const QuickActions = ({ onRefresh }) => {
  const actions = [
    {
      title: 'Add Vehicle',
      description: 'Add a new vehicle to inventory',
      icon: '➕',
      href: '/admin/vehicles/add',
      color: 'blue'
    },
    {
      title: 'Bulk Import',
      description: 'Import multiple vehicles from CSV',
      icon: '📁',
      href: '/admin/vehicles/import',
      color: 'green'
    },
    {
      title: 'Export Data',
      description: 'Export inventory to spreadsheet',
      icon: '📊',
      href: '/admin/vehicles/export',
      color: 'purple'
    },
    {
      title: 'Settings',
      description: 'Configure dealership settings',
      icon: '⚙️',
      href: '/admin/settings',
      color: 'gray'
    }
  ];

  const colorClasses = {
    blue: 'text-blue-600 hover:bg-blue-50',
    green: 'text-green-600 hover:bg-green-50',
    purple: 'text-purple-600 hover:bg-purple-50',
    gray: 'text-gray-600 hover:bg-gray-50'
  };

  return (
    <div className="bg-white shadow-sm rounded-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
          <button
            onClick={onRefresh}
            className="text-sm text-blue-600 hover:text-blue-500"
          >
            🔄 Refresh
          </button>
        </div>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {actions.map((action) => (
            <Link
              key={action.title}
              to={action.href}
              className={`block p-4 rounded-lg border-2 border-dashed border-gray-200 transition duration-200 ${colorClasses[action.color]}`}
            >
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <span className="text-2xl">{action.icon}</span>
                </div>
                <div className="ml-4">
                  <h4 className="text-sm font-medium">{action.title}</h4>
                  <p className="text-xs text-gray-500 mt-1">{action.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuickActions;
