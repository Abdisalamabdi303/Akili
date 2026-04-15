import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';

function App() {
  return (
    <div className="min-h-screen bg-gray-900 font-sans">
      {/* Navbar */}
      <Navbar />
      
      {/* Hero Section */}
      <main>
        <Hero />
        {/* Placeholder content for scrolling */}
        <div className="min-h-[100vh] bg-gray-800 flex items-center justify-center p-20">
            <h2 className="text-3xl text-white">More Content Below</h2>
        </div>
      </main>
    </div>
  );
}

export default App;