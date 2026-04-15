import React from 'react';
import { motion } from 'framer-motion';

const ProductCard = ({ name, description, imageUrl, price }) => {
  return (
    <motion.div
      className="bg-white rounded-xl shadow-2xl overflow-hidden transition duration-300 hover:shadow-cyan-400/50 hover:scale-[1.02] group"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <img
        src={imageUrl}
        alt={name}
        className="w-full h-48 object-cover border-b border-cyan-200"
      />
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{name}</h3>
        <p className="text-gray-600 mb-4 text-sm">{description}</p>
        <div className="flex justify-between items-center mt-4">
          <span className="text-2xl font-extrabold text-cyan-600">${price}</span>
          <button className="bg-cyan-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-cyan-600 transition duration-300 shadow-md">
            Add to Cart
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;