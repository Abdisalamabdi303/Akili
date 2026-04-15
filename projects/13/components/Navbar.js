import React from 'react';
import { ShoppingCart, PawPrint } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md sticky top-0 z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:flex justify-between items-center h-16">
        <div className="flex items-center space-x-3">
          <PawPrint className="w-7 h-7 text-indigo-600" />
          <div className="text-2xl font-bold text-gray-900">PetParadise</div>
        </div>
        <div className="flex items-center space-x-6">
          <a href="#products" className="text-gray-600 hover:text-indigo-600 transition duration-150 font-medium">Shop</a>
          <a href="#" className="text-gray-600 hover:text-indigo-600 transition duration-150 font-medium">About</a>
          <button className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-full hover:bg-indigo-700 transition duration-300 shadow-lg">
            <ShoppingCart className="w-5 h-5 mr-2" /> Cart
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;