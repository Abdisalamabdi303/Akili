import React from 'react';

function Testimonials() {
  return (
    <section className="bg-cya py-20 px-4 text-white">
      <h2 className="text-3xl font-bold mb-8">Customer Testimonials</h2>
      <div className="flex justify-center items-center flex-col">
        <blockquote className="text-lg mb-4">
          "The best pet store I've ever visited! Highly recommend!"
          <footer>- John Doe, Pet Owner</footer>
        </blockquote>
        <blockquote className="text-lg mb-4">
          "Great selection and friendly staff. Love shopping here!"
          <footer>- Jane Smith, Pet Owner</footer>
        </blockquote>
      </div>
    </section>
  );
}

export default Testimonials;