import React from 'react';
import { motion } from 'framer-motion';

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
    <section id="hero" className="bg-gray-50 py-20 sm:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.h1
          className="text-6xl sm:text-7xl font-extrabold text-gray-900 mb-4 leading-tight"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          Discover the <span className="text-cyan-600">Joy</span> of Pet Parenthood
        </motion.h1>
        <motion.p
          className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto mb-10"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          Find the best food, toys, and care for your furry, scaly, or feathered friends. Premium quality delivered right to your door.
        </motion.p>
        <motion.a
          href="#products"
          className="inline-flex items-center px-8 py-3 border border-transparent text-lg font-semibold rounded-full shadow-xl text-white bg-cyan-500 hover:bg-cyan-600 transition duration-300 transform hover:scale-[1.02]"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          Shop Our Collection
        </motion.a>
      </div>
    </section>
  );
};

export default Hero;