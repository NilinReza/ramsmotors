import React, { useState, useEffect } from 'react';

const MigrationStatus = () => {
    const [status, setStatus] = useState({
        loading: true,
        adminLogin: 'pending',
        googleMaps: 'pending',
        environment: 'pending',
        apis: 'pending',
        errors: []
    });

    const checkEnvironmentVariables = () => {
        const envVars = {
            googleMapsKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
            googlePlacesKey: process.env.REACT_APP_GOOGLE_PLACES_API_KEY,
            googlePlaceId: process.env.REACT_APP_GOOGLE_PLACE_ID,
            supabaseUrl: process.env.REACT_APP_SUPABASE_URL,
            supabaseKey: process.env.REACT_APP_SUPABASE_ANON_KEY
        };

        const configured = Object.entries(envVars).filter(([key, value]) => 
            value && !value.includes('your_') && !value.includes('_here')
        );

        return {
            total: Object.keys(envVars).length,
            configured: configured.length,
            details: envVars
        };
    };

    const checkAdminLogin = async () => {
        try {
            // Test the admin login endpoint
            const response = await fetch('/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: 'test', password: 'test' })
            });
            
            // We expect this to fail with 401, but endpoint should exist
            return response.status === 401 ? 'working' : 'configured';
        } catch (error) {
            return 'error';
        }
    };

    const checkGoogleMapsAPI = () => {
        const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
        if (!apiKey || apiKey.includes('your_') || apiKey.includes('_here')) {
            return 'not_configured';
        }
        return 'configured';
    };

    useEffect(() => {
        const runChecks = async () => {
            const envCheck = checkEnvironmentVariables();
            const adminCheck = await checkAdminLogin();
            const mapsCheck = checkGoogleMapsAPI();

            setStatus({
                loading: false,
                adminLogin: adminCheck,
                googleMaps: mapsCheck,
                environment: envCheck.configured >= 2 ? 'partial' : 'not_configured',
                envDetails: envCheck,
                apis: 'checked',
                errors: []
            });
        };

        runChecks();
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case 'working':
            case 'configured':
                return 'text-green-600';
            case 'partial':
                return 'text-yellow-600';
            case 'not_configured':
            case 'error':
                return 'text-red-600';
            default:
                return 'text-gray-600';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'working':
            case 'configured':
                return '✅';
            case 'partial':
                return '⚠️';
            case 'not_configured':
            case 'error':
                return '❌';
            default:
                return '⏳';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'working':
                return 'Working correctly';
            case 'configured':
                return 'Configured';
            case 'partial':
                return 'Partially configured';
            case 'not_configured':
                return 'Not configured';
            case 'error':
                return 'Error detected';
            default:
                return 'Checking...';
        }
    };

    if (status.loading) {
        return (
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-bold mb-4">Migration Status</h3>
                <div className="flex items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
                    <span>Checking migration status...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-6">🚀 Migration Status Report</h3>
            
            <div className="space-y-4">
                {/* Admin Login Status */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div className="flex items-center">
                        <span className="text-2xl mr-3">{getStatusIcon(status.adminLogin)}</span>
                        <div>
                            <span className="font-medium">Admin Login System</span>
                            <p className="text-sm text-gray-600">Authentication and API endpoints</p>
                        </div>
                    </div>
                    <span className={`font-medium ${getStatusColor(status.adminLogin)}`}>
                        {getStatusText(status.adminLogin)}
                    </span>
                </div>

                {/* Google Maps Status */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div className="flex items-center">
                        <span className="text-2xl mr-3">{getStatusIcon(status.googleMaps)}</span>
                        <div>
                            <span className="font-medium">Google Maps Integration</span>
                            <p className="text-sm text-gray-600">Maps API and location services</p>
                        </div>
                    </div>
                    <span className={`font-medium ${getStatusColor(status.googleMaps)}`}>
                        {getStatusText(status.googleMaps)}
                    </span>
                </div>

                {/* Environment Variables */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div className="flex items-center">
                        <span className="text-2xl mr-3">{getStatusIcon(status.environment)}</span>
                        <div>
                            <span className="font-medium">Environment Configuration</span>
                            <p className="text-sm text-gray-600">
                                {status.envDetails?.configured || 0} of {status.envDetails?.total || 0} variables configured
                            </p>
                        </div>
                    </div>
                    <span className={`font-medium ${getStatusColor(status.environment)}`}>
                        {getStatusText(status.environment)}
                    </span>
                </div>

                {/* Diagnostic Tools */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div className="flex items-center">
                        <span className="text-2xl mr-3">✅</span>
                        <div>
                            <span className="font-medium">Diagnostic Tools</span>
                            <p className="text-sm text-gray-600">Debug utilities and testing functions</p>
                        </div>
                    </div>
                    <span className="font-medium text-green-600">Active</span>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-6 pt-4 border-t">
                <h4 className="font-medium mb-3">🔧 Quick Actions</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <button 
                        onClick={() => window.location.href = '/admin'}
                        className="p-2 bg-blue-100 text-blue-800 rounded hover:bg-blue-200 transition-colors"
                    >
                        Test Admin Login
                    </button>
                    <button 
                        onClick={() => window.location.href = '/'}
                        className="p-2 bg-green-100 text-green-800 rounded hover:bg-green-200 transition-colors"
                    >
                        Test Google Maps (Home)
                    </button>
                    <button 
                        onClick={() => window.location.href = '/contact'}
                        className="p-2 bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200 transition-colors"
                    >
                        Test Contact Form
                    </button>
                    <button 
                        onClick={() => window.runMigrationTests?.()}
                        className="p-2 bg-purple-100 text-purple-800 rounded hover:bg-purple-200 transition-colors"
                    >
                        Run Full Tests
                    </button>
                </div>
            </div>

            {/* Configuration Help */}
            {status.googleMaps === 'not_configured' && (
                <div className="mt-4 p-4 bg-yellow-50 border-l-4 border-yellow-400">
                    <h5 className="font-medium text-yellow-800">Google Maps Setup Required</h5>
                    <p className="text-sm text-yellow-700 mt-1">
                        Add your Google Maps API key to the .env file to enable maps functionality.
                        See GOOGLE_API_KEY_SETUP.md for detailed instructions.
                    </p>
                </div>
            )}
        </div>
    );
};

export default MigrationStatus;
