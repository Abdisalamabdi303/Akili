import React from 'react';
import { motion } from 'framer-motion';

const ProductCard = ({ name, description, price, imageUrl }) => {
  return (
    <motion.div 
      className="bg-white rounded-xl shadow-xl overflow-hidden transition duration-300 hover:shadow-2xl hover:scale-[1.02] border border-gray-100"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
    >
      <div className="relative overflow-hidden">
        <img 
          src={imageUrl} 
          alt={name} 
          className="w-full h-48 object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-2">{name}</h3>
          <p className="text-gray-600 mb-4 text-sm">{description}</p>
          <div className="flex justify-between items-center mt-4">
            <span className="text-2xl font-extrabold text-cyan-600">${price.toFixed(2)}</span>
            <button className="px-4 py-2 bg-cyan-500 text-white text-sm font-semibold rounded-full hover:bg-cyan-600 transition duration-300 shadow-md">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;