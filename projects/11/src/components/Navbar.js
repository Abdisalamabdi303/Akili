import React from 'react';
import { motion } from 'framer-motion';
import { PawPrint } from 'lucide-react';

const Navbar = () => {
  const navItems = ['Shop', 'About', 'Contact'];

  return (
    <motion.nav 
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white shadow-md sticky top-0 z-10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <PawPrint className="text-indigo-600 w-6 h-6" />
            <span className="text-2xl font-bold text-gray-900">PetParadise</span>
          </div>
          <div className="space-x-8 font-medium hidden md:flex">
            {navItems.map((item) => (
              <motion.a 
                key={item} 
                href={`#${item.toLowerCase()}`} 
                className="text-gray-600 hover:text-indigo-600 transition duration-150"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {item}
              </motion.a>
            ))}
          </div>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-indigo-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-indigo-700 transition duration-300"
          >
            Shop Now
          </motion.button>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;