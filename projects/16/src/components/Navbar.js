import React from 'react';
import { Menu, Search, ShoppingCart } from 'lucide-react';

const Navbar = () => {
  return (
    <header className="bg-cyan-600 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <div className="text-2xl font-extrabold text-white tracking-wider">
              Pet<span className="text-yellow-300">Paradise</span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#products" className="text-white hover:text-cyan-200 transition duration-300 font-medium">Shop</a>
              <a href="#about" className="text-white hover:text-cyan-200 transition duration-300 font-medium">About</a>
              <a href="#contact" className="text-white hover:text-cyan-200 transition duration-300 font-medium">Contact</a>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative hidden sm:block">
              <input
                type="text"
                placeholder="Search pets, toys, food..."
                className="py-2 pl-10 pr-4 border border-cyan-400 rounded-lg focus:ring-cyan-300 focus:border-cyan-300 w-40 transition duration-300 bg-white text-gray-800"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-cyan-500" />
            </div>
            <button className="p-2 bg-white text-cyan-600 rounded-full hover:bg-cyan-50 transition duration-300 shadow-md">
              <ShoppingCart className="h-6 w-6" />
            </button>
            <button className="md:hidden p-2 bg-white text-cyan-600 rounded-full hover:bg-cyan-50 transition duration-300">
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;