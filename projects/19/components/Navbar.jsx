import React from 'react';
import { ShoppingCart, PawPrint } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="bg-gray-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="text-2xl font-bold text-cyan-400 tracking-wider">
              PetStore
            </div>
            <div className="flex items-center space-x-2">
              <PawPrint className="w-6 h-6 text-cyan-400" />
              <span className="text-white font-medium hidden sm:inline">Modern Pets</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <a href="#" className="text-gray-300 hover:text-cyan-400 transition duration-300">Shop</a>
            <a href="#" className="text-gray-300 hover:text-cyan-400 transition duration-300">About</a>
            <button className="bg-cyan-500 hover:bg-cyan-400 text-gray-900 font-semibold py-2 px-4 rounded-full transition duration-300 shadow-md">
              Cart (0)
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;