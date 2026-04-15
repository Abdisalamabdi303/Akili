import React from 'react';
import { motion } from 'framer-motion';
import { Zap, ArrowRight } from 'lucide-react';

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
    <section className="py-20 sm:py-32 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            className="text-6xl sm:text-7xl lg:text-8xl font-extrabold text-gray-900 mb-4 leading-tight"
            variants={itemVariants}
          >
            Launch Your Vision Today
          </motion.h1>
          <motion.p
            className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto mb-10"
            variants={itemVariants}
          >
            The most modern and vibrant platform to bring your brightest ideas to life with stunning design and seamless functionality.
          </motion.p>
          <motion.div variants={itemVariants}>
            <a
              href="#"
              className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-full shadow-xl text-white bg-indigo-600 hover:bg-indigo-700 transition duration-300 transform hover:scale-[1.02]"
            >
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;