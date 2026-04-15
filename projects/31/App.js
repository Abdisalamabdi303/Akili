import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import About from './components/About';
import Contact from './components/Contact';

const App = () => {
  return (
    <div className="bg-black text-white">
      <Navbar />
      <Hero />
      <Services />
      <About />
      <Contact />
    </div>
  );
};

export default App;