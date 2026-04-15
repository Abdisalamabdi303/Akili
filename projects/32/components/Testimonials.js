import React from 'react';

const Testimonials = () => {
  return (
    <section className="bg-gray-100 py-12" id="testimonials">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">What Our Patients Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-yellow-500">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.486 3.486l-.707.707L20.97 13.75l-4.06-4.06L14.486 5.486zM18 9a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-lg">"The staff is very friendly and the care provided is top-notch."</p>
              <h3 className="mt-2 text-xl font-bold">John Doe</h3>
              <p className="text-gray-500">Patient</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-yellow-500">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.486 3.486l-.707.707L20.97 13.75l-4.06-4.06L14.486 5.486zM18 9a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-lg">"I highly recommend this dental clinic for all your oral health needs."</p>
              <h3 className="mt-2 text-xl font-bold">Jane Smith</h3>
              <p className="text-gray-500">Patient</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-yellow-500">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.486 3.486l-.707.707L20.97 13.75l-4.06-4.06L14.486 5.486zM18 9a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-lg">"The dental team is professional and always goes above and beyond."</p>
              <h3 className="mt-2 text-xl font-bold">Mike Johnson</h3>
              <p className="text-gray-500">Patient</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;