import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.8,
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
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 max-w-4xl text-center">
        <motion.h1
          className="text-6xl font-extrabold text-gray-900 mb-4 leading-tight"
          initial="hidden"
          animate="visible"
          variants={itemVariants}
        >
          Launch Your Vision with Modern Design
        </motion.h1>
        <motion.p
          className="text-xl text-gray-600 mb-10"
          initial="hidden"
          animate="visible"
          variants={itemVariants}
        >
          The future of web applications, built with bright cyan energy and modern aesthetics.
        </motion.p>
        <motion.a
          href="#features"
          className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-full shadow-lg 
                     text-white bg-cyan-500 hover:bg-cyan-600 transition duration-300 transform hover:scale-[1.02]"
          variants={itemVariants}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Explore Features
          <ArrowRight className="ml-2 h-5 w-5" />
        </motion.a>
      </div>
    </section>
  );
};

export default Hero;