import React from 'react';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  return (
    <motion.nav 
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white shadow-lg sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <span className="text-2xl font-bold text-cyan-600 tracking-wider">
              BrandName
            </span>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <a href="#features" className="text-gray-600 hover:text-cyan-600 px-3 py-2 rounded-md text-sm font-medium transition duration-150">Features</a>
              <a href="#pricing" className="text-gray-600 hover:text-cyan-600 px-3 py-2 rounded-md text-sm font-medium transition duration-150">Pricing</a>
              <a href="#contact" className="text-gray-600 hover:text-cyan-600 px-3 py-2 rounded-md text-sm font-medium transition duration-150">Contact</a>
            </div>
          </div>
          <div className="md:hidden">
            <button className="text-gray-600 hover:text-cyan-600 focus:outline-none">
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;