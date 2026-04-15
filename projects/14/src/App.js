import React from 'react';
import Navbar from './components/Navbar';
import ProductCard from './components/ProductCard';
import { motion } from 'framer-motion';

// Mock data for the pet store
const mockProducts = [
  { id: 1, name: 'Dog Food Premium', price: 45.99, imageUrl: 'https://images.unsplash.com/photo-1543467357-d7317d230d98?q=80&w=197&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8f3TY3M%3D' },
  { id: 2, name: 'Cat Treats Gourmet', price: 29.50, imageUrl: 'https://images.unsplash.com/photo-1586432193372-c33e7e941a20?q=80&w=197&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8f3TY3M%3D' },
  { id: 3, name: 'Fish Flakes Deluxe', price: 19.99, imageUrl: 'https://images.unsplash.com/photo-1591183776008-7c5e85d29143?q=80&w=197&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8f3TY3M%3D' },
  { id: 4, name: 'Bird Seeds Mix', price: 35.00, imageUrl: 'https://images.unsplash.com/photo-1517148367882-213643219337?q=80&w=197&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8f3TY3M%3D' },
];

const App = () => {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />
      
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <motion.h1 
          className="text-4xl font-extrabold text-gray-900 mb-10 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Our Pet Paradise
        </motion.h1>

        <h2 className="text-2xl font-bold text-gray-700 mb-6 border-b pb-2">Featured Pets & Supplies</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {mockProducts.map(product => (
            <ProductCard 
              key={product.id} 
              name={product.name} 
              price={product.price} 
              imageUrl={product.imageUrl} 
            />
          ))}
        </div>
      </main>

      <footer className="bg-gray-800 mt-12">
        <div className="max-w-7xl mx-auto py-6 px-4 text-center text-gray-400">
          &copy; {new Date().getFullYear()} PetStore. Built with React, Tailwind & Framer Motion.
        </div>
      </footer>
    </div>
  );
};

export default App;