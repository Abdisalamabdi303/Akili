import React from 'react';
import ProductCard from './ProductCard';
import { motion } from 'framer-motion';

const productsData = [
  { id: 1, name: "Premium Dog Food", description: "Wholesome nutrition for active dogs.", imageUrl: "https://images.unsplash.com/photo-1587127624433?q=80&w=600&auto=format&fit=crop", price: 49.99 },
  { id: 2, name: "Luxury Cat Bed", description: "Soft, cozy, and stylish for your feline friend.", imageUrl: "https://images.unsplash.com/photo-1591509146105?q=80&w=600&auto=format&fit=crop", price: 35.50 },
  { id: 3, name: "Ocean Fish Tank", description: "Stunning setup for your tropical aquatic life.", imageUrl: "https://images.unsplash.com/photo-1544753289-661e1a606435?q=80&w=600&auto=format&fit=crop", price: 89.99 },
  { id: 4, name: "Interactive Toy Set", description: "Engaging toys to keep your pet happy and entertained.", imageUrl: "https://images.unsplash.com/photo-1543281170-244104146d52?q=80&w=600&auto=format&fit=crop", price: 29.95 },
];

const ProductGrid = () => {
  return (
    <section id="products" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2 
          className="text-4xl font-bold text-center text-gray-900 mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          Featured Products
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {productsData.map(product => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;