import React from 'react';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <span className="text-2xl font-bold text-indigo-600 tracking-wider">BrandName</span>
          </div>
          <nav className="hidden md:flex space-x-8">
            <a href="#features" className="text-gray-600 hover:text-indigo-600 transition duration-150">Features</a>
            <a href="#pricing" className="text-gray-600 hover:text-indigo-600 transition duration-150">Pricing</a>
            <a href="#contact" className="text-gray-600 hover:text-indigo-600 transition duration-150">Contact</a>
          </nav>
          <div className="flex items-center space-x-4">
            <button className="text-gray-600 hover:text-indigo-600 transition duration-150">Sign In</button>
            <a href="#" className="bg-indigo-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-indigo-700 transition duration-300 shadow-lg shadow-indigo-300/50">
              Get Started
            </a>
          </div>
          <div className="md:hidden">
            <button className="text-gray-600 hover:text-indigo-600 transition duration-150">
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;