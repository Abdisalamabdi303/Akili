import React from 'react';
import { motion } from 'framer-motion';

const Contact = () => {
  return (
    <section className="bg-black text-white py-24 flex justify-center items-center" id="contact">
      <div className="max-w-3xl px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-3xl font-bold mb-8"
        >
          Contact Us
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-lg mb-8"
        >
          Have any questions? Feel free to contact us.
        </motion.p>
        <motion.form
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="flex flex-col space-y-4"
        >
          <input type="text" placeholder="Name" className="bg-white p-3 rounded" />
          <input type="email" placeholder="Email" className="bg-white p-3 rounded" />
          <textarea placeholder="Message" className="bg-white p-3 rounded"></textarea>
          <button type="submit" className="bg-black text-white px-6 py-3 rounded hover:bg-amber-500 hover:text-black">
            Send Message
          </button>
        </motion.form>
      </div>
    </section>
  );
};

export default Contact;