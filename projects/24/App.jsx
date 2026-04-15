import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';

// Mock data for demonstration
const mockProducts = [
  { id: 1, name: "Premium Dog Food", description: "Nutritious, grain-free food for active dogs.", price: 49.99, imageUrl: "dog.jpg" },
  { id: 2, name: "Interactive Cat Toys", description: "Engaging toys to keep your feline friends happy and stimulated.", price: 29.50, imageUrl: "cat.jpg" },
  { id: 3, name: "Luxury Fish Tank Decor", description: "Beautiful, safe decor for your aquatic pets.", price: 79.99, imageUrl: "fish.jpg" },
  { id: 4, name: "Bird Seed Mix", description: "High-quality seeds for vibrant and healthy birds.", price: 19.99, imageUrl: "bird.jpg" },
];

function App() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Navbar */}
      <Navbar />
      
      {/* Hero Section */}
      <Hero />

      {/* Featured Products Section */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12 border-b-4 border-cyan-300 inline-block pb-1 mx-auto">
            Featured Picks
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {mockProducts.map(product => (
              <ProductCard 
                key={product.id}
                name={product.name}
                description={product.description}
                price={product.price}
                imageUrl={product.imageUrl}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="bg-cyan-700 py-8 mt-10">
        <div className="max-w-7xl mx-auto px-4 text-center text-white">
          <p className="text-sm">&copy; {new Date().getFullYear()} PetVerse. All rights reserved. Built with React & Tailwind CSS.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;