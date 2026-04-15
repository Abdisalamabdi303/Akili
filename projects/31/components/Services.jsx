import React from 'react';
import { motion } from 'framer-motion';

const Services = () => {
  return (
    <section className="bg-black text-white py-24 flex justify-center items-center" id="services">
      <div className="max-w-3xl px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-3xl font-bold mb-8"
        >
          Our Services
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="bg-amber-500 p-6 rounded shadow-lg"
          >
            <h3 className="text-xl font-bold mb-2">Teeth Cleaning</h3>
            <p>Regular cleanings to keep your teeth healthy.</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="bg-amber-500 p-6 rounded shadow-lg"
          >
            <h3 className="text-xl font-bold mb-2">Dental Implants</h3>
            <p>Replace missing teeth with durable implants.</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 1.5 }}
            className="bg-amber-500 p-6 rounded shadow-lg"
          >
            <h3 className="text-xl font-bold mb-2">Root Canals</h3>
            <p>Relieve tooth pain with root canal treatment.</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Services;