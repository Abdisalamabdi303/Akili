import React from 'react';

function Hero() {
  return (
    <section className="bg-cya text-white py-20 px-4 flex justify-center items-center">
      <div className="text-center max-w-3xl">
        <h1 className="text-5xl font-bold mb-4">Welcome to Our Pet Store</h1>
        <p className="text-xl mb-8">Find the perfect pet for your family.</p>
        <button className="bg-white text-cya py-2 px-6 rounded hover:bg-gray-200">Shop Now</button>
      </div>
    </section>
  );
}

export default Hero;