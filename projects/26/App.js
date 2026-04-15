import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import FeaturedProducts from './components/FeaturedProducts';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <div className="bg-cya min-h-screen">
        <Navbar />
        <Hero />
        <FeaturedProducts />
        <Testimonials />
        <Footer />
      </div>
    </Router>
  );
}

export default App;