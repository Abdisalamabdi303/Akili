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
    <section className="bg-cyan-50 py-20 sm:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.h1
          className="text-6xl font-extrabold text-gray-900 mb-4 leading-tight"
          initial="hidden"
          animate="visible"
          variants={itemVariants}
        >
          The Happiest Pets Start Here
        </motion.h1>
        <motion.p
          className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Discover the best toys, food, and accessories for your beloved companion with our curated collection. Brighten their world today!
        </motion.p>
        <motion.a
          href="#products"
          className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-full shadow-lg text-white bg-cyan-600 hover:bg-cyan-700 transition duration-300 transform hover:scale-105"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.4 }}
        >
          Shop Now
          <Zap className="ml-2 w-5 h-5" />
        </motion.a>
      </div>
    </section>
  );
};

export default Hero;