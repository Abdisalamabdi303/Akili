import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';

// Mock Data for demonstration
const mockProducts = [
  { id: 1, name: "Premium Dog Food", description: "Nutritious and delicious food for all breeds.", price: 45.99, imageUrl: "https://images.unsplash.com/photo-1587615383780-d5c83c649188?q=80&w=197&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8f3TY3M%3D" },
  { id: 2, name: "Interactive Cat Toy", description: "Engaging toys to keep your feline friend entertained.", price: 29.50, imageUrl: "https://images.unsplash.com/photo-1590173207179-19b4c60670a3?q=80&w=197&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8f3TY3M%3D" },
  { id: 3, name: "Luxury Fish Tank Decor", description: "Stunning decorations for the most beautiful aquatic homes.", price: 89.99, imageUrl: "https://images.unsplash.com/photo-1544432460-74b8e1611a2e?q=80&w=197&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8f3TY3M%3D" },
  { id: 4, name: "Puppy Grooming Kit", description: "Everything you need for a perfect puppy grooming session.", price: 35.00, imageUrl: "https://images.unsplash.com/photo-1580422166197-4e0d6e37d17b?q=80&w=197&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8f3TY3M%3D" },
];

const App = () => {
  return (
    <div className="min-h-screen bg-gray-50 font-sans antialiased">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <Hero />

      {/* Products Section */}
      <section id="products" className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12 border-b-4 border-cyan-300 inline-block pb-1 mx-auto">
            Featured Products
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
      <footer className="bg-cyan-700 mt-12 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-white">
          <p className="text-lg font-semibold mb-2">PetParadise</p>
          <p className="text-sm text-cyan-200">Bringing joy to pets and their families.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;