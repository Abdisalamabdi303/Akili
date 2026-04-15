import React from 'react';
import { motion } from 'framer-motion';

const ProductCard = ({ name, description, imageUrl, price }) => {
  return (
    <motion.div 
      className="bg-white rounded-xl shadow-lg overflow-hidden transition duration-300 hover:shadow-xl hover:scale-[1.02] group"
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <img 
        src={imageUrl} 
        alt={name} 
        className="w-full h-48 object-cover"
      />
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{name}</h3>
        <p className="text-gray-600 mb-4 text-sm line-clamp-3">{description}</p>
        <div className="flex justify-between items-center mt-4">
          <span className="text-2xl font-extrabold text-amber-600">${price.toFixed(2)}</span>
          <button className="flex items-center bg-amber-100 text-amber-700 font-semibold py-2 px-4 rounded-lg hover:bg-amber-200 transition duration-300">
            Add to Cart
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;