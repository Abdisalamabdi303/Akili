import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductHighlights from './components/ProductHighlights';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';

const App = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <Hero />
      <ProductHighlights />
      <Testimonials />
      <Footer />
    </div>
  );
};

export default App;