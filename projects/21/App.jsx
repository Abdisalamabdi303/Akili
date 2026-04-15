import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';

function App() {
  return (
    <div className="min-h-screen bg-white font-sans antialiased">
      <Navbar />
      <main>
        <Hero />
        {/* Placeholder for other sections */}
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 text-center">
                <h2 className="text-4xl font-bold text-gray-900">Features Coming Soon</h2>
            </div>
        </section>
      </main>
    </div>
  );
}

export default App;