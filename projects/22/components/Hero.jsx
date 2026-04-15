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
    <motion.section 
      className="py-20 bg-gray-50"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.h1 
          variants={itemVariants}
          className="text-6xl font-extrabold text-gray-900 mb-4 leading-tight"
        >
          Launch Your Vision with <span className="text-cyan-600">Modern Design</span>
        </motion.h1>
        <motion.p 
          variants={itemVariants}
          className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto mb-8"
        >
          Experience the perfect blend of bright cyan energy and warm, inviting aesthetics for your next great project.
        </motion.p>
        <motion.div 
          variants={itemVariants}
          className="flex justify-center space-x-4"
        >
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 10px 20px rgba(52, 211, 153, 0.3)" }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 text-lg font-semibold text-white bg-cyan-500 rounded-full shadow-lg hover:bg-cyan-600 transition duration-300 transform"
          >
            Get Started Now
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 10px 20px rgba(52, 211, 153, 0.3)" }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 text-lg font-semibold text-cyan-600 border-2 border-cyan-300 bg-white rounded-full hover:bg-cyan-50 transition duration-300"
          >
            Learn More
          </motion.button>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Hero;