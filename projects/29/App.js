import React from 'react';
import { motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Projects from './components/Projects';
import Contact from './components/Contact';

function App() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="bg-cyan-500 min-h-screen flex flex-col items-center justify-center"
    >
      <Navbar />
      <Hero />
      <Projects />
      <Contact />
    </motion.div>
  );
}

export default App;