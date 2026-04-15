import React from 'react';
import { motion } from 'framer-motion';
import { Heart, PawPrint } from 'lucide-react';

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

const Hero = () => {
  return (
    <section className="bg-amber-50 py-20 sm:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            className="text-6xl sm:text-7xl font-extrabold text-gray-900 mb-4 leading-tight"
            variants={itemVariants}
          >
            Love Your Pets, Love Your Home
          </motion.h1>
          <motion.p
            className="mt-4 text-xl text-gray-600 mb-8 max-w-3xl mx-auto"
            variants={itemVariants}
          >
            Discover the warmest, most wholesome products and supplies for your beloved companions. Modern care, natural quality.
          </motion.p>
          <motion.div
            className="flex justify-center space-x-4"
            variants={itemVariants}
          >
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 10px 15px -3px rgba(0, 224, 255, 0.4)" }}
              whileTap={{ scale: 0.98 }}
              className="bg-cyan-500 text-white font-bold text-lg px-8 py-3 rounded-full shadow-xl hover:bg-cyan-600 transition duration-300 transform"
            >
              Shop Pets
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 10px 15px -3px rgba(0, 224, 255, 0.4)" }}
              whileTap={{ scale: 0.98 }}
              className="bg-white text-cyan-600 border-2 border-cyan-300 font-bold text-lg px-8 py-3 rounded-full shadow-lg hover:bg-cyan-50 transition duration-300 transform"
            >
              Explore Deals
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;