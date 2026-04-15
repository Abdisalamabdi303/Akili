import React from 'react';
import { ShoppingCart, PawPrint } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="text-2xl font-bold text-indigo-600 flex items-center">
              <PawPrint className="w-6 h-6 mr-2 text-orange-500" />
              PetStore
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <a href="#" className="text-gray-600 hover:text-indigo-600 transition duration-150 font-medium">Home</a>
            <a href="#" className="text-gray-600 hover:text-indigo-600 transition duration-150 font-medium">Shop</a>
            <a href="#" className="text-gray-600 hover:text-indigo-600 transition duration-150 font-medium">Contact</a>
            <button className="relative p-2 bg-indigo-100 rounded-full hover:bg-indigo-200 transition duration-150">
              <ShoppingCart className="w-6 h-6 text-indigo-600" />
              <span className="absolute top-0 right-0 block h-3 w-3 rounded-full ring-2 ring-white bg-red-500"></span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;