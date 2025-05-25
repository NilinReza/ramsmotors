import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-blue-900 text-white px-6 py-4 shadow-lg flex justify-between items-center">
      <h1 className="text-2xl font-bold tracking-wide">Rams Motors</h1>
      <div className="space-x-6 text-lg">
        <Link to="/" className="hover:text-gray-300 transition-colors duration-200">Home</Link>
        <Link to="/inventory" className="hover:text-gray-300 transition-colors duration-200">Inventory</Link>
      </div>
    </nav>
  );
};

export default Navbar;