import React from 'react';
import './styles.css';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-3xl font-bold text-center mb-6">Welcome to Our Pet Store</h1>
        <p className="text-center mb-4">Find the best quality and convenient pet products here.</p>
        <div className="flex justify-center">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Shop Now
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;