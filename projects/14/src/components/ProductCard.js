import React from 'react';
import { motion } from 'framer-motion';

const ProductCard = ({ name, price, imageUrl }) => {
  return (
    <motion.div 
      className="bg-white rounded-xl shadow-lg overflow-hidden transform transition duration-300 hover:shadow-xl hover:scale-[1.02] border border-gray-100"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <div className="h-48 bg-gray-200 overflow-hidden">
        <img 
          src={imageUrl} 
          alt={name} 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-2 truncate">{name}</h3>
        <p className="text-2xl font-bold text-indigo-600 mb-4">${price.toFixed(2)}</p>
        <button className="w-full bg-orange-500 text-white py-2 rounded-lg font-semibold hover:bg-orange-600 transition duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-orange-300">
          Add to Cart
        </button>
      </div>
    </motion.div>
  );
};

export default ProductCard;