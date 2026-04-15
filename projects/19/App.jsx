import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';

// Mock Data for demonstration
const mockProducts = [
  { id: 1, name: "Premium Dog Food", price: 49.99, imageUrl: "dog.jpg" },
  { id: 2, name: "Cat Treats Deluxe", price: 29.50, imageUrl: "cat.jpg" },
  { id: 3, name: "Fish Tank Decor", price: 65.00, imageUrl: "fish.jpg" },
  { id: 4, name: "Bird Perch Set", price: 35.99, imageUrl: "bird.jpg" },
];

function App() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <Hero />

      {/* Main Content / Product Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-4xl font-bold text-gray-900 mb-8 border-b-4 border-cyan-400 inline-block pb-1">Featured Supplies</h2>
        
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

      {/* Footer (Simple for now) */}
      <footer className="bg-gray-800 text-white mt-12">
        <div className="max-w-7xl mx-auto py-6 text-center">
            <p>&copy; {new Date().getFullYear()} PetStore. Built with React & Cyan Magic.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;