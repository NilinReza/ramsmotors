import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-bold text-red-400 mb-4">Rams Motors</h3>
            <p className="text-gray-300 mb-4">
              Your trusted dealership in Scarborough. Quality vehicles, exceptional service, 
              and competitive prices.
            </p>            <div className="flex space-x-4">
              <button className="text-gray-400 hover:text-red-400 transition-colors">
                Facebook
              </button>
              <button className="text-gray-400 hover:text-red-400 transition-colors">
                Instagram
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-red-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/inventory" className="text-gray-300 hover:text-red-400 transition-colors">
                  Inventory
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-red-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-red-400 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-red-400" />
                <span className="text-gray-300 text-sm">
                  2655 Lawrence Ave E unit m12<br />
                  Scarborough, ON M1P 2S3
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-red-400" />
                <span className="text-gray-300">(416) 123-4567</span>
              </div>              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-red-400" />
                <span className="text-gray-300">ramsmotorsinc@gmail.com</span>
              </div>
            </div>
          </div>

          {/* Hours */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Business Hours</h3>
            <div className="space-y-2 text-gray-300 text-sm">
              <div className="flex justify-between">
                <span>Mon - Fri:</span>
                <span>9:00 AM - 7:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Saturday:</span>
                <span>9:00 AM - 6:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Sunday:</span>
                <span>11:00 AM - 5:00 PM</span>
              </div>
            </div>
          </div>
        </div>        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            &copy; 2025 Rams Motors. All rights reserved. | 
            <button className="hover:text-red-400 transition-colors ml-1"> Privacy Policy</button> | 
            <button className="hover:text-red-400 transition-colors ml-1"> Terms of Service</button>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;