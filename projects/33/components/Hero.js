import React from 'react';

const Hero = () => {
  return (
    <section className="bg-gray-100 py-24 flex justify-center items-center">
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Welcome to PetStore</h1>
        <p className="text-lg text-gray-700 mb-8">Find the best pet products and services for your furry friends.</p>
        <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
          Shop Now
        </button>
      </div>
    </section>
  );
};

export default Hero;