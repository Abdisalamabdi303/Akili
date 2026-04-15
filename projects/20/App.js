import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans antialiased">
      <Navbar />
      <main className="pt-16">
        <Hero />
        {/* Placeholder for more sections if needed later */}
      </main>
      <Footer />
    </div>
  );
}

export default App;