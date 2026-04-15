import React from 'react';
import { motion } from 'framer-motion';

const Contact = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      className="bg-cyan-500 text-white p-8 flex items-center justify-center"
    >
      <div>
        <h2 className="text-3xl font-bold">Contact</h2>
        <p className="mt-4">Feel free to reach out with any questions or inquiries.</p>
        {/* Add contact form here */}
      </div>
    </motion.section>
  );
};

export default Contact;