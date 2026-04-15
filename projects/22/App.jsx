import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Navbar */}
      <Navbar />
      
      {/* Hero Section */}
      <main>
        <Hero />
        {/* Placeholder for more content */}
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Features Section Coming Soon</h2>
            <div className="p-8 bg-white rounded-xl shadow-md">
                <p className="text-gray-600">This section will showcase the warm and modern details of the application.</p>
            </div>
        </div>
      </main>
    </div>
  );
}

export default App;