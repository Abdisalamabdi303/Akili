import React from 'react';
import { motion } from 'framer-motion';

const ProductCard = ({ name, description, price, imageUrl }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="bg-white rounded-xl shadow-xl overflow-hidden transform hover:shadow-2xl transition duration-300 border border-gray-100"
    >
      <div className="h-48 bg-gray-200 flex items-center justify-center overflow-hidden">
        {/* Placeholder for image */}
        <div className="w-full h-full bg-cyan-100 flex items-center justify-center text-gray-500 text-lg font-semibold">
          {name.split(' ')[0]} Image
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{name}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{description}</p>
        <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100">
          <span className="text-2xl font-extrabold text-cyan-600">${price.toFixed(2)}</span>
          <button className="px-4 py-2 bg-cyan-500 text-white text-sm font-semibold rounded-lg hover:bg-cyan-600 transition duration-200 shadow-md">
            Add to Cart
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;