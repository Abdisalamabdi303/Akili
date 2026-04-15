import React from 'react';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

const Hero = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <motion.header 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="bg-gray-50 py-20 sm:py-32 border-b border-cyan-100"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.h1 
          variants={itemVariants}
          className="text-6xl md:text-7xl font-extrabold text-gray-900 mb-4 leading-tight"
        >
          The Brightest Place for <span className="text-cyan-600">Pet Essentials</span>
        </motion.h1>
        <motion.p 
          variants={itemVariants}
          className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto mb-8"
        >
          Discover premium, healthy, and playful products for your beloved companions. Everything you need, delivered with love.
        </motion.p>
        <motion.div 
          variants={itemVariants}
          className="flex justify-center space-x-4"
        >
          <a 
            href="#" 
            className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-full shadow-lg text-white bg-cyan-500 hover:bg-cyan-600 transition duration-300 transform hover:scale-105"
          >
            Shop Now
          </a>
          <a 
            href="#" 
            className="inline-flex items-center px-8 py-3 border border-cyan-300 text-base font-medium rounded-full text-cyan-700 bg-white hover:bg-cyan-50 transition duration-300"
          >
            Explore Pets
          </a>
        </motion.div>
      </div>
    </motion.header>
  );
};

export default Hero;