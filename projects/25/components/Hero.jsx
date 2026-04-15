import React from 'react';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

const Hero = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.section 
      className="py-20 bg-gray-900 text-white"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.h1 
          variants={itemVariants}
          className="text-6xl font-extrabold mb-4 leading-tight"
        >
          Launch Your Vision with <span className="text-cyan-400">Power</span>
        </motion.h1>
        <motion.p 
          variants={itemVariants}
          className="mt-6 text-xl text-gray-400 max-w-3xl mx-auto mb-8"
        >
          The future of web development, built with cutting-edge React and stunning Tailwind design. Experience unparalleled speed and elegance.
        </motion.p>
        <motion.div 
          variants={itemVariants}
          className="flex justify-center space-x-4"
        >
          <motion.a 
            href="#features"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-lg 
                       text-white bg-cyan-500 hover:bg-cyan-600 transition duration-300 transform hover:scale-105"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Get Started Free
          </motion.a>
          <motion.a 
            href="#pricing"
            className="inline-flex items-center px-6 py-3 border border-cyan-500 text-base font-medium rounded-full 
                       text-cyan-400 bg-transparent hover:bg-cyan-900 transition duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View Pricing
          </motion.a>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Hero;