import React from 'react';
import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <section className="bg-amber-500 text-black py-24 flex justify-center items-center">
      <div className="max-w-3xl px-6 text-center">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-4xl font-bold mb-4"
        >
          Welcome to Our Dental Clinic
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-lg mb-8"
        >
          Providing the best dental care for your smile.
        </motion.p>
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="bg-black text-white px-6 py-3 rounded hover:bg-amber-500 hover:text-black"
        >
          Schedule an Appointment
        </motion.button>
      </div>
    </section>
  );
};

export default Hero;