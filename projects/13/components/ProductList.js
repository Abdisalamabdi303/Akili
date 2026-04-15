import React from 'react';
import ProductCard from './ProductCard';
import { motion } from 'framer-motion';

// Mock Data
const mockProducts = [
  { id: 1, name: "Premium Dog Food", price: 49.99, description: "High-quality, grain-free food for active dogs.", imageUrl: "dog_food.jpg" },
  { id: 2, name: "Interactive Cat Toy", price: 19.50, description: "Engaging toys to keep your feline friend entertained.", imageUrl: "cat_toy.jpg" },
  { id: 3, name: "Luxury Fish Tank Decor", price: 89.99, description: "Beautiful, handcrafted decor for your aquatic pets.", imageUrl: "fish_decor.jpg" },
  { id: 4, name: "Bird Perch & Cage", price: 35.00, description: "Sturdy and safe perches for all types of birds.", imageUrl: "bird_cage.jpg" },
  { id: 5, name: "Natural Grooming Kit", price: 29.99, description: "Organic shampoo and brushes for healthy skin and coat.", imageUrl: "grooming_kit.jpg" },
];

const ProductList = () => {
  return (
    <div>
      <h2 className="text-4xl font-bold text-gray-900 mb-8 border-b pb-3">Featured Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {mockProducts.map(product => (
          <ProductCard 
            key={product.id}
            name={product.name}
            price={product.price}
            description={product.description}
            imageUrl={product.imageUrl}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductList;