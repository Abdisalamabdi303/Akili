import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6 mt-12">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div>
          <p>&copy; {new Date().getFullYear()} Dental Clinic. All rights reserved.</p>
        </div>
        <div>
          <a href="tel:+1234567890" className="text-white hover:text-gray-300 mx-2">Call Us</a>
          <a href="mailto:info@dentalclinic.com" className="text-white hover:text-gray-300 mx-2">Email Us</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;