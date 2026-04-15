import React from 'react';

const Services = () => {
  return (
    <section className="bg-white py-12" id="services">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Our Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-gray-100 p-6 rounded-lg shadow-md flex items-center space-x-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-blue-600">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L21 20.25m-1.5-4.5L15 20.25m-7.5-4.5L7.5 20.25M19.5 13.5V8.25a2.25 2.25 0 00-2.25-2.25h-15A2.25 2.25 0 001.5 8.25v5.25m18 0h-7.5a2.25 2.25 0 00-2.25 2.25v5.25m0 0a2.25 2.25 0 002.25 2.25H18A2.25 2.25 0 0020.25 13.5zm-7.5 4.5h7.5a2.25 2.25 0 010 4.5h-7.5a2.25 2.25 0 010-4.5z" />
            </svg>
            <div>
              <h3 className="text-xl font-bold">Dental Checkups</h3>
              <p>Regular checkups to ensure your oral health.</p>
            </div>
          </div>
          <div className="bg-gray-100 p-6 rounded-lg shadow-md flex items-center space-x-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-blue-600">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L21 20.25m-1.5-4.5L15 20.25m-7.5-4.5L7.5 20.25M19.5 13.5V8.25a2.25 2.25 0 00-2.25-2.25h-15A2.25 2.25 0 001.5 8.25v5.25m18 0h-7.5a2.25 2.25 0 00-2.25 2.25v5.25m0 0a2.25 2.25 0 002.25 2.25H18A2.25 2.25 0 0020.25 13.5zm-7.5 4.5h7.5a2.25 2.25 0 010 4.5h-7.5a2.25 2.25 0 010-4.5z" />
            </svg>
            <div>
              <h3 className="text-xl font-bold">Teeth Whitening</h3>
              <p>Get a brighter, healthier smile with our teeth whitening services.</p>
            </div>
          </div>
          <div className="bg-gray-100 p-6 rounded-lg shadow-md flex items-center space-x-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-blue-600">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L21 20.25m-1.5-4.5L15 20.25m-7.5-4.5L7.5 20.25M19.5 13.5V8.25a2.25 2.25 0 00-2.25-2.25h-15A2.25 2.25 0 001.5 8.25v5.25m18 0h-7.5a2.25 2.25 0 00-2.25 2.25v5.25m0 0a2.25 2.25 0 002.25 2.25H18A2.25 2.25 0 0020.25 13.5zm-7.5 4.5h7.5a2.25 2.25 0 010 4.5h-7.5a2.25 2.25 0 010-4.5z" />
            </svg>
            <div>
              <h3 className="text-xl font-bold">Crowns and Fillings</h3>
              <p>Restore your smile with durable crowns and fillings.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;