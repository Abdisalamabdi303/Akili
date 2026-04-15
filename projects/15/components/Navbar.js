import React from 'react';
import { Menu, ShoppingBag } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="text-2xl font-bold text-cyan-600 tracking-wider">
              PetHaven
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-8">
              <a href="#products" className="text-gray-600 hover:text-cyan-600 transition duration-150">Products</a>
              <a href="#about" className="text-gray-600 hover:text-cyan-600 transition duration-150">About Us</a>
              <a href="#contact" className="text-gray-600 hover:text-cyan-600 transition duration-150">Contact</a>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <button className="text-gray-600 hover:text-cyan-600 transition duration-150">
              <ShoppingBag className="w-5 h-5" /> Cart
            </button>
            <button className="bg-cyan-500 text-white px-4 py-2 rounded-full shadow-lg hover:bg-cyan-600 transition duration-300 transform hover:scale-[1.02]">
              Shop Now
            </button>
          </div>
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