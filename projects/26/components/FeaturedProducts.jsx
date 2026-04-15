import React from 'react';

function FeaturedProducts() {
  return (
    <section className="bg-white py-20 px-4">
      <h2 className="text-cya text-3xl font-bold mb-8">Featured Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {/* Product 1 */}
        <div className="bg-gray-100 p-4 rounded flex justify-center items-center flex-col">
          <img src="https://via.placeholder.com/200" alt="Product 1" />
          <h3 className="text-cya text-xl font-bold mt-2">Product 1</h3>
          <p className="text-gray-600">$9.99</p>
          <button className="bg-cya text-white py-2 px-4 rounded hover:bg-cya/80 mt-4">Add to Cart</button>
        </div>
        {/* Product 2 */}
        <div className="bg-gray-100 p-4 rounded flex justify-center items-center flex-col">
          <img src="https://via.placeholder.com/200" alt="Product 2" />
          <h3 className="text-cya text-xl font-bold mt-2">Product 2</h3>
          <p className="text-gray-600">$19.99</p>
          <button className="bg-cya text-white py-2 px-4 rounded hover:bg-cya/80 mt-4">Add to Cart</button>
        </div>
        {/* Product 3 */}
        <div className="bg-gray-100 p-4 rounded flex justify-center items-center flex-col">
          <img src="https://via.placeholder.com/200" alt="Product 3" />
          <h3 className="text-cya text-xl font-bold mt-2">Product 3</h3>
          <p className="text-gray-600">$29.99</p>
          <button className="bg-cya text-white py-2 px-4 rounded hover:bg-cya/80 mt-4">Add to Cart</button>
        </div>
      </div>
    </section>
  );
}

export default FeaturedProducts;