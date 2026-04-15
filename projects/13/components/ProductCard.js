import React from 'react';
import { motion } from 'framer-motion';

const ProductCard = ({ name, price, description, imageUrl }) => {
  return (
    <motion.div 
      className="bg-white rounded-xl shadow-lg overflow-hidden transform transition duration-300 hover:shadow-2xl hover:scale-[1.02] border border-gray-100"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      {/* Placeholder for Image - In a real app, this would be an actual image */}
      <div className="h-48 bg-gray-200 flex items-center justify-center overflow-hidden">
        <div className="text-gray-500 text-lg font-semibold p-4">Image Placeholder</div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{name}</h3>
        <p className="text-gray-500 mb-4 line-clamp-3">{description}</p>
        <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100">
          <span className="text-2xl font-extrabold text-indigo-600">${price.toFixed(2)}</span>
          <button className="bg-pink-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-pink-600 transition duration-300 shadow-md">
            Add to Cart
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;