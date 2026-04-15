import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductGrid from './components/ProductGrid';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <Navbar />
      <main>
        <Hero />
        <ProductGrid />
        {/* Placeholder for About and Contact sections */}
        <section id="about" className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 text-center">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Story</h2>
                <p className="text-lg text-gray-600">Committed to providing the highest quality care and the best products for your beloved pets.</p>
            </div>
        </section>
      </main>
      <footer id="contact" className="bg-gray-800 text-white p-8 mt-10">
        <div className="max-w-7xl mx-auto text-center">
          <p>&copy; {new Date().getFullYear()} PetParadise. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;