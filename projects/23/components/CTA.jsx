import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const CTA = () => {
  return (
    <section className="py-24 bg-cyan-50">
      <div className="container mx-auto px-4 text-center">
        <motion.h2
          className="text-5xl font-bold text-gray-900 mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Ready to Start Building?
        </motion.h2>
        <motion.p
          className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          Join the revolution and experience the power of a modern, intuitive platform today.
        </p>
        <button className="px-10 py-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:bg-indigo-700 transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-300">
          Start Your Free Trial
        </button>
    </button>
);

export default CallToAction;
```

### Putting It All Together (index.js)

To see the final result, you would combine these components in your main file:

```javascript
import React from 'react';
import CallToAction from './CallToAction';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header Placeholder (Optional) */}
      <header className="bg-white shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-800">Modern Platform Demo</h1>
      </header>

      {/* Main Content Sections */}
      <main className="container mx-auto px-4 py-12 space-y-16">
        
        {/* Hero Section */}
        <section className="py-10 bg-white shadow-xl rounded-xl">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-6 text-center">
            The Future of Digital Creation
          </h2>
          <p className="text-xl text-gray-600 mb-8 text-center max-w-3xl mx-auto">
            Unlock unparalleled creativity with our cutting-edge, user-friendly digital tools designed for tomorrow's challenges.
          </p>
        </section>

        {/* Features Section */}
        <section className="space-y-10">
          <h2 className="text-3xl font-bold text-gray-800 text-center">
            Why Choose Us?
          </h2>
          
          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            
            <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-indigo-500 transition duration-300 hover:shadow-2xl">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-indigo-100 rounded-full">
                    <svg xmlns="http://www.w3.5/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Intuitive Design</h3>
              <p className="text-gray-600">A seamless interface that lets you focus purely on your vision, reducing complexity and boosting productivity.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-indigo-500 transition duration-300 hover:shadow-2xl">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-indigo-100 rounded-full">
                    <svg xmlns="http://www.w3.5/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4m10-16l-4 4m4-4l-4 4" />
                    </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Powerful Tools</h3>
              <p className="text-gray-600">Access a suite of powerful tools that empower you to bring any complex idea to life with precision and ease.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-indigo-500 transition duration-300 hover:shadow-2xl">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-indigo-100 rounded-full">
                    <svg xmlns="http://www.w3.5/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" stroke