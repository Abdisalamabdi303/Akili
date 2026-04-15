import React from 'react';
import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      className="bg-cyan-500 text-white p-8 flex items-center justify-center"
    >
      <div>
        <h1 className="text-4xl font-bold">Hello! I'm a Software Developer</h1>
        <p className="mt-2">I build modern, scalable web applications using the latest technologies.</p>
      </div>
    </motion.section>
  );
};

export default Hero;