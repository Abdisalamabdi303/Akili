import React from 'react';
import { motion } from 'framer-motion';

// Unsplash image URL for the background
const heroImage = "https://images.unsplash.com/photo-1517312781387-603019464451?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaW5zaWdtb250fHx8fGVufDB8fHx8&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaW5zaWdtb250fHx8fGVufDB8fHx8";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 1.5,
      ease: "easeOut",
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};

function App() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Navigation Bar */}
      <header className="bg-white shadow-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-indigo-600">LandingPage</h1>
          <nav>
            <a href="#features" className="text-gray-600 hover:text-indigo-600 transition duration-300 mx-3">Features</a>
            <a href="#pricing" className="text-gray-600 hover:text-indigo-600 transition duration-300 mx-3">Pricing</a>
            <a href="#contact" className="text-gray-600 hover:text-indigo-600 transition duration-300 mx-3">Contact</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="pt-16 pb-20 bg-gray-100">
        <motion.div 
          className="relative overflow-hidden bg-cover bg-center shadow-xl"
          style={{ backgroundImage: `url(${heroImage})` }}
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
            <motion.h2 
              className="text-6xl md:text-7xl font-extrabold text-white mb-4 leading-tight"
              variants={itemVariants}
            >
              Launch Your Vision Today
            </motion.h2>
            <motion.p 
              className="text-xl md:text-2xl text-gray-200 mb-10 max-w-3xl mx-auto"
              variants={itemVariants}
            >
              The simplest way to build beautiful, responsive web applications with modern tools.
            </motion.p>
            <motion.button 
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg transition duration-300 transform hover:scale-105"
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started Free
            </motion.button>
          </div>
        </motion.div>
      </main>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2 
            className="text-4xl font-bold text-center text-gray-900 mb-12"
            variants={itemVariants}
          >
            Why Choose Us?
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <motion.div 
              className="bg-gray-50 p-6 rounded-lg shadow-md border-t-4 border-indigo-500 transition duration-300 hover:shadow-xl"
              variants={itemVariants}
            >
              <h3 className="text-2xl font-semibold text-gray-800 mb-3">Stunning Design</h3>
              <p className="text-gray-600">Beautifully crafted interfaces using Tailwind CSS for a pixel-perfect look.</p>
            </motion.div>
            <motion.div 
              className="bg-gray-50 p-6 rounded-lg shadow-md border-t-4 border-indigo-500 transition duration-300 hover:shadow-xl"
              variants={itemVariants}
            >
              <h3 className="text-2xl font-semibold text-gray-800 mb-3">Smooth Animations</h3>
              <p className="text-gray-600">Interactive experiences enhanced with Framer Motion for delightful user interactions.</p>
            </motion.div>
            <motion.div 
              className="bg-gray-50 p-6 rounded-lg shadow-md border-t-4 border-indigo-500 transition duration-300 hover:shadow-xl"
              variants={itemVariants}
            >
              <h3 className="text-2xl font-semibold text-gray-800 mb-3">Fast Development</h3>
              <p className="text-gray-600">Rapid prototyping and deployment with a modern React setup.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-800 text-white mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          <p>&copy; {new Date().getFullYear()} LandingPage. Built with React, Tailwind CSS & Framer Motion.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;