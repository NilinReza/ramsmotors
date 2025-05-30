// Get Directions Button Component
import React from 'react';
import { Navigation, ExternalLink } from 'lucide-react';

const GetDirectionsButton = ({ 
  address = "2655 Lawrence Ave E unit m12, Scarborough, ON M1P 2S3", 
  businessName = "Rams Motors",
  className = "",
  variant = "primary" // primary, secondary, minimal
}) => {
  const encodedAddress = encodeURIComponent(address);
  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`;
  
  const handleGetDirections = () => {
    window.open(googleMapsUrl, '_blank', 'noopener,noreferrer');
  };

  const baseClasses = "inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variantClasses = {
    primary: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-md hover:shadow-lg transform hover:-translate-y-0.5",
    secondary: "bg-white text-red-600 border-2 border-red-600 hover:bg-red-50 focus:ring-red-500 shadow-sm hover:shadow-md",
    minimal: "bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-500"
  };

  return (
    <button
      onClick={handleGetDirections}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      aria-label={`Get directions to ${businessName}`}
    >
      <Navigation className="w-4 h-4" />
      <span>Get Directions</span>
      <ExternalLink className="w-3 h-3 opacity-70" />
    </button>
  );
};

export default GetDirectionsButton;
