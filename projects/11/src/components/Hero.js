import React from 'react';
import { motion } from 'framer-motion';
import { Dog, Cat, Fish } from 'lucide-react';

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
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <motion.section 
      className="bg-gray-50 py-20 sm:py-32 border-b border-indigo-100"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.h1 
          variants={itemVariants}
          className="text-6xl font-extrabold text-gray-900 mb-4 leading-tight"
        >
          Welcome to PetParadise
        </motion.h1>
        <motion.p 
          variants={itemVariants}
          className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto mb-8"
        >
          Discover the best toys, food, and accessories for your beloved furry, scaly, and feathered friends. Quality care starts here.
        </motion.p>
        <motion.div 
          variants={itemVariants}
          className="flex justify-center space-x-6"
        >
          <motion.div 
            className="flex flex-col items-center p-6 bg-white rounded-xl shadow-lg transform hover:scale-[1.02] transition duration-300"
            whileHover={{ scale: 1.03 }}
          >
            <Dog className="w-16 h-16 text-amber-500 mb-3" />
            <h3 className="text-xl font-semibold text-gray-800">Dog Supplies</h3>
            <p className="text-sm text-gray-500">Toys, Beds, & More</p>
          </motion.div>
          <motion.div 
            className="flex flex-col items-center p-6 bg-white rounded-xl shadow-lg transform hover:scale-[1.02] transition duration-300"
            whileHover={{ scale: 1.03 }}
          >
            <Cat className="w-16 h-16 text-pink-500 mb-3" />
            <h3 className="text-xl font-semibold text-gray-800">Cat Essentials</h3>
            <p className="text-sm text-gray-500">Scratchers & Treats</p>
          </motion.div>
          <motion.div 
            className="flex flex-col items-center p-6 bg-white rounded-xl shadow-lg transform hover:scale-[1.02] transition duration-300"
            whileHover={{ scale: 1.03 }}
          >
            <Fish className="w-16 h-16 text-blue-500 mb-3" />
            <h3 className="text-xl font-semibold text-gray-800">Aquarium Gear</h3>
            <p className="text-sm text-gray-500">Filters & Decor</p>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Hero;