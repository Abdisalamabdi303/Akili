import React from 'react';

const Testimonials = () => {
  return (
    <section className="bg-gray-100 py-24 flex justify-center items-center">
      <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-lg text-center shadow-md">
          <p className="text-gray-700">"The best pet store I've ever visited. Highly recommend!"</p>
          <h3 className="text-xl font-bold mt-4">John Doe</h3>
        </div>
        <div className="bg-white p-6 rounded-lg text-center shadow-md">
          <p className="text-gray-700">"Great service and products. I'm a loyal customer!"</p>
          <h3 className="text-xl font-bold mt-4">Jane Smith</h3>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;