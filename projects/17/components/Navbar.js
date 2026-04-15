import React from 'react';
import { Menu, ShoppingCart, PawPrint } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="text-2xl font-bold text-cyan-600 tracking-wider">
              PetParadise
            </div>
            <div className="hidden md:flex space-x-6">
              <a href="#products" className="text-gray-600 hover:text-cyan-600 transition duration-150">Shop</a>
              <a href="#about" className="text-gray-600 hover:text-cyan-600 transition duration-150">About</a>
              <a href="#contact" className="text-gray-600 hover:text-cyan-600 transition duration-150">Contact</a>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="text-gray-600 hover:text-cyan-600 transition duration-150">
              <PawPrint className="w-5 h-5" />
            </button>
            <a href="#" className="p-2 rounded-full text-gray-600 hover:bg-cyan-50 hover:text-cyan-600 transition duration-150">
              <ShoppingCart className="w-5 h-5" />
            </a>
          </div>
          {/* Mobile Menu Button (simplified for this example) */}
          <div className="md:hidden">
            <button className="text-gray-600 hover:text-cyan-600 transition duration-150">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;