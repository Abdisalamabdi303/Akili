import React from 'react';
import { motion } from 'framer-motion';

const About = () => {
  return (
    <section className="bg-amber-500 text-black py-24 flex justify-center items-center" id="about">
      <div className="max-w-3xl px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-3xl font-bold mb-8"
        >
          About Us
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-lg mb-8"
        >
          We are dedicated to providing the highest quality dental care in a comfortable and welcoming environment.
        </motion.p>
      </div>
    </section>
  );
};

export default About;