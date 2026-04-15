import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import FeatureCard from './components/FeatureCard';

function App() {
  return (
    <div className="min-h-screen bg-amber-50 font-sans">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <Hero />

      {/* Features Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-12 border-b-4 border-cyan-300 inline-block pb-1 mx-auto">
          Our Featured Collections
        </h2>
        <FeatureCard />
      </main>

      {/* Simple Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-10">
        <div className="max-w-7xl mx-auto text-center">
          <p>&copy; {new Date().getFullYear()} PetHaven. Warm care for your best friends.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;