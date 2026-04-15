import React from 'react';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  return (
    <header className="bg-white shadow-md sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <span className="text-3xl font-bold text-amber-600 tracking-tight">PetParadise</span>
          </div>
          <nav className="hidden md:flex space-x-8">
            <a href="#products" className="text-gray-600 hover:text-amber-600 transition duration-150">Shop</a>
            <a href="#about" className="text-gray-600 hover:text-amber-600 transition duration-150">About Us</a>
            <a href="#contact" className="text-gray-600 hover:text-amber-600 transition duration-150">Contact</a>
          </nav>
          <div className="md:hidden">
            <button className="text-gray-600 hover:text-amber-600 focus:outline-none">
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;