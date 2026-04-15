import React from 'react';
import { motion } from 'framer-motion';

const Navbar = () => {
  return (
    <motion.nav
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-cyan-500 p-4 flex justify-between items-center"
    >
      <div>
        <h2 className="text-white text-lg font-bold">My Portfolio</h2>
      </div>
      <ul className="flex space-x-4">
        <li><a href="#about" className="text-white hover:text-gray-300">About</a></li>
        <li><a href="#projects" className="text-white hover:text-gray-300">Projects</a></li>
        <li><a href="#contact" className="text-white hover:text-gray-300">Contact</a></li>
      </ul>
    </motion.nav>
  );
};

export default Navbar;