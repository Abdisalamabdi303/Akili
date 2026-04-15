import React from 'react';
import { ShoppingCart, PawPrint } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = () => {
  return (
    <motion.nav 
      initial={{ y: -20 }} 
      animate={{ y: 0 }} 
      transition={{ duration: 0.3 }}
      className="bg-white shadow-md sticky top-0 z-10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        <div className="flex items-center space-x-2">
          <PawPrint className="w-8 h-8 text-cyan-500" />
          <span className="text-2xl font-bold text-gray-900 tracking-wider">PetVerse</span>
        </div>
        <div className="flex items-center space-x-6">
          <a href="#" className="text-gray-600 hover:text-cyan-500 transition duration-150">Shop</a>
          <a href="#" className="text-gray-600 hover:text-cyan-500 transition duration-150">About</a>
          <a href="#" className="text-gray-600 hover:text-cyan-500 transition duration-150">Contact</a>
          <button className="relative p-2 rounded-full bg-cyan-50 text-cyan-600 hover:bg-cyan-100 transition duration-150">
            <ShoppingCart className="w-6 h-6" />
            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full ring-2 ring-white bg-red-500"></span>
          </button>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;