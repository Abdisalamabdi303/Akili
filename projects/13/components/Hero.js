import React from 'react';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 1.5,
      ease: "easeOut",
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};

const Hero = () => {
  return (
    <motion.div 
      className="bg-indigo-50 p-10 rounded-xl shadow-xl mb-12 border-t-4 border-indigo-600"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.h1 
        className="text-5xl font-extrabold text-gray-900 mb-4"
        variants={itemVariants}
      >
        Welcome to PetParadise
      </motion.h1>
      <motion.p 
        className="text-xl text-gray-600 mb-6 max-w-3xl"
        variants={itemVariants}
      >
        Find the best toys, food, and accessories for your beloved furry, scaly, or feathered friends. Quality care starts here!
      </motion.p>
      <motion.button 
        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-lg text-white bg-pink-500 hover:bg-pink-600 transition duration-300 transform hover:scale-[1.02]"
        variants={itemVariants}
      >
        Shop Now
        <Zap className="ml-2 w-5 h-5" />
      </motion.button>
    </motion.div>
  );
};

export default Hero;