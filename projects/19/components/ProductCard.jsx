import React from 'react';
import { motion } from 'framer-motion';

const ProductCard = ({ name, price, imageUrl }) => {
  return (
    <motion.div 
      className="bg-white rounded-xl shadow-2xl overflow-hidden transition duration-300 hover:shadow-cyan-300/50 hover:scale-[1.02]"
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <div className="h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
        {/* Placeholder for image */}
        <div className="w-full h-full bg-cyan-100 flex items-center justify-center text-cyan-600 font-bold text-lg">
          {name.charAt(0)}
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{name}</h3>
        <p className="text-2xl font-extrabold text-cyan-600 mb-4">${price.toFixed(2)}</p>
        <button className="w-full bg-cyan-500 text-white py-3 rounded-lg font-semibold hover:bg-cyan-600 transition duration-300 shadow-lg hover:shadow-cyan-400">
          Add to Cart
        </button>
      </div>
    </motion.div>
  );
};

export default ProductCard;