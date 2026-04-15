import React from 'react';

const ProductHighlights = () => {
  return (
    <section className="bg-white py-24 flex justify-center items-center">
      <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="bg-gray-100 p-6 rounded-lg text-center">
          <h2 className="text-xl font-bold mb-4">High-Quality Products</h2>
          <p className="text-gray-700">We offer only the best products for your pets.</p>
        </div>
        <div className="bg-gray-100 p-6 rounded-lg text-center">
          <h2 className="text-xl font-bold mb-4">Fast Delivery</h2>
          <p className="text-gray-700">Enjoy fast and reliable delivery to your doorstep.</p>
        </div>
        <div className="bg-gray-100 p-6 rounded-lg text-center">
          <h2 className="text-xl font-bold mb-4">Customer Support</h2>
          <p className="text-gray-700">Our team is always ready to help with any questions.</p>
        </div>
      </div>
    </section>
  );
};

export default ProductHighlights;