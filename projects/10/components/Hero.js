import React from 'react';
import { motion } from 'framer-motion';
import { PawPrint, Dog, Cat, Fish } from 'lucide-react';

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
    <section className="bg-gray-50 py-20 sm:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.h1
          className="text-6xl font-extrabold text-gray-900 mb-4 leading-tight"
          initial="hidden"
          animate="visible"
          variants={itemVariants}
        >
          The Happiest Place for Your Furry Friends
        </motion.h1>
        <motion.p
          className="mt-4 text-xl text-gray-600 mb-10 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          variants={itemVariants}
        >
          Discover the best toys, nutrition, and accessories for dogs, cats, and fish from trusted sources.
        </motion.p>
        <motion.div
          className="flex justify-center space-x-6"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.button
            className="px-8 py-3 bg-amber-500 text-white text-lg font-semibold rounded-full shadow-lg hover:bg-amber-600 transition duration-300 transform hover:scale-105"
            variants={itemVariants}
          >
            Shop Now
          </motion.button>
          <motion.button
            className="px-8 py-3 bg-white border border-amber-500 text-amber-600 text-lg font-semibold rounded-full shadow-lg hover:bg-amber-50 transition duration-300 transform hover:scale-105"
            variants={itemVariants}
          >
            Explore Pets
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;