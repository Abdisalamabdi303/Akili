import React from 'react';
import { motion } from 'framer-motion';

const PetStoreLandingPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Navigation Bar */}
      <header className="bg-white shadow-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-indigo-600 tracking-tight">PetParadise</h1>
          <nav>
            <a href="#products" className="text-gray-600 hover:text-indigo-600 transition duration-300 ml-6">Products</a>
            <a href="#about" className="text-gray-600 hover:text-indigo-600 transition duration-300 ml-6">About Us</a>
            <a href="#contact" className="text-gray-600 hover:text-indigo-600 transition duration-300 ml-6">Contact</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <motion.section 
        className="bg-indigo-50 py-20 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-4xl mx-auto px-4">
          <motion.h2 
            className="text-6xl font-extrabold text-gray-900 mb-4"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            The Best Pets, The Best Care
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-600 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Discover premium, healthy, and adorable supplies for your beloved companions from the best in the industry.
          </motion.p>
          <motion.a 
            href="#products"
            className="inline-block bg-indigo-600 text-white text-lg font-semibold px-10 py-3 rounded-full shadow-lg hover:bg-indigo-700 transition duration-300 transform hover:scale-105"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            Shop Now
          </motion.a>
        </div>
      </motion.section>

      {/* Products Section */}
      <section id="products" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12 border-b-4 border-indigo-500 inline-block pb-1 mx-auto">Featured Products</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Product Card 1 */}
            <motion.div 
              className="bg-white rounded-xl shadow-xl overflow-hidden hover:shadow-2xl transition duration-300"
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <img 
                src="https://images.unsplash.com/photo-1543467306-599245d1e226?w=600&q=80" 
                alt="Dog Food" 
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Premium Dog Food</h3>
                <p className="text-gray-600 mb-4">Nutritious and delicious food for your best friend.</p>
                <div className="flex justify-between items-center">
                    <span className="text-3xl font-extrabold text-indigo-600">$49.99</span>
                    <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition">Add to Cart</button>
                </div>
              </div>
            </motion.div>

            {/* Product Card 2 */}
            <motion.div 
              className="bg-white rounded-xl shadow-xl overflow-hidden hover:shadow-2xl transition duration-300"
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <img 
                src="https://images.unsplash.com/photo-1561786543-38b01e713055?w=600&q=80" 
                alt="Cat Toys" 
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Interactive Cat Toys</h3>
                <p className="text-gray-600 mb-4">Engaging toys to keep your feline friend happy and playful.</p>
                <div className="flex justify-between items-center">
                    <span className="text-3xl font-extrabold text-indigo-600">$29.99</span>
                    <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition">Add to Cart</button>
                </div>
              </div>
            </motion.div>

            {/* Product Card 3 */}
            <motion.div 
              className="bg-white rounded-xl shadow-xl overflow-hidden hover:shadow-2xl transition duration-300"
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <img 
                src="https://images.unsplash.com/photo-1518477212461-8d2d5c663663?w=600&q=80" 
                alt="Fish Food" 
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Tropical Fish Food</h3>
                <p className="text-gray-600 mb-4">High-quality nutrition for vibrant, healthy aquatic life.</p>
                <div className="flex justify-between items-center">
                    <span className="text-3xl font-extrabold text-indigo-600">$35.50</span>
                    <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition">Add to Cart</button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2 
            className="text-4xl font-bold text-center text-gray-900 mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            Our Commitment to Pet Wellness
          </motion.h2>
          <div className="text-center max-w-3xl mx-auto text-lg text-gray-700 space-y-4">
            <p>At PetParadise, we believe that pets are family. We are dedicated to sourcing the highest quality, ethically produced food, toys, and accessories to ensure our animals live happy, healthy, and long lives.</p>
            <p>We focus on natural ingredients and sustainable practices, ensuring that every item we offer meets the high standards your pets deserve.</p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-white">
        <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2 
            className="text-4xl font-bold text-gray-900 mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            Get In Touch
          </motion.h2>
          <p className="text-xl text-gray-600 mb-8">Have questions about our products or services? We are here to help!</p>
          <div className="space-y-4">
            <p className="text-lg font-semibold text-indigo-600">Email us: support@petparadise.com</p>
            <p className="text-lg font-semibold text-indigo-600">Call us: (555) PET-LOVE</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>&copy; {new Date().getFullYear()} PetParadise. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default PetStoreLandingPage;