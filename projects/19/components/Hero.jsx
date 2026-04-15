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
      className="bg-cyan-50 pt-16 pb-20 text-center border-b border-cyan-200"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h1 
        className="text-6xl md:text-7xl font-extrabold text-gray-900 mb-4 leading-tight"
        variants={itemVariants}
      >
        The Future of Pet Care
      </motion.h1>
      <motion.p 
        className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto"
        variants={itemVariants}
      >
        Discover premium, healthy, and happy supplies for your beloved companions. Bright, modern, and safe.
      </motion.p>
      <motion.button
        className="inline-flex items-center justify-center px-10 py-4 text-lg font-bold text-gray-900 bg-cyan-500 hover:bg-cyan-600 transition duration-300 shadow-xl hover:shadow-2xl transform hover:scale-[1.02]"
        variants={itemVariants}
      >
        Shop Now <Zap className="w-5 h-5 ml-2" />
      </motion.button>
    </motion.div>
  );
};

export default Hero;