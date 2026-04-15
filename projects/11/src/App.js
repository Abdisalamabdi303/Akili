import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-white font-sans antialiased">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <main>
        <Hero />
        
        {/* Placeholder for more content */}
        <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 text-center">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Featured Products</h2>
                <p className="text-lg text-gray-600 mb-10">Explore our curated selection of premium pet essentials.</p>
                {/* In a real app, product cards would go here */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="p-6 bg-indigo-50 rounded-lg shadow-md border border-indigo-200">
                        <h3 className="text-xl font-semibold text-indigo-700">Premium Dog Food</h3>
                        <p className="text-gray-600 mt-2">Healthy, grain-free nutrition for happy dogs.</p>
                    </div>
                    <div className="p-6 bg-indigo-50 rounded-lg shadow-md border border-indigo-200">
                        <h3 className="text-xl font-semibold text-indigo-700">Interactive Toys</h3>
                        <p className="text-gray-600 mt-2">Engaging toys to keep pets happy and busy.</p>
                    </div>
                    <div className="p-6 bg-indigo-50 rounded-lg shadow-md border border-indigo-200">
                        <h3 className="text-xl font-semibold text-indigo-700">Aquarium Decor</h3>
                        <p className="text-gray-600 mt-2">Stunning decorations for your aquatic pets.</p>
                    </div>
                </div>
            </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;