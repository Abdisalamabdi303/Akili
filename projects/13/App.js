import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductList from './components/ProductList';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />
      <main className="container mx-auto p-4 md:p-8">
        <Hero />
        <ProductList />
      </main>
      <Footer />
    </div>
  );
}

export default App;