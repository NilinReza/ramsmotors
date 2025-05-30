// Stats Card Component
import React from 'react';

const StatsCard = ({ title, value, icon, color = 'blue', trend = null }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    green: 'bg-green-50 text-green-700 border-green-200',
    yellow: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
    red: 'bg-red-50 text-red-700 border-red-200'
  };

  return (
    <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
      <div className="p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className={`w-8 h-8 rounded-md flex items-center justify-center ${colorClasses[color]}`}>
              <span className="text-lg">{icon}</span>
            </div>
          </div>
          <div className="ml-4 w-0 flex-1">
            <dt className="text-sm font-medium text-gray-500 truncate">
              {title}
            </dt>
            <dd className="text-2xl font-semibold text-gray-900">
              {value}
            </dd>
            {trend && (
              <div className={`flex items-center text-sm ${
                trend.direction === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                <span className="mr-1">
                  {trend.direction === 'up' ? '↗️' : '↘️'}
                </span>
                {trend.percentage}% from last month
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
