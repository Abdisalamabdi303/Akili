import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 mt-12">
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-white text-lg font-semibold mb-4">PetParadise</p>
        <p className="text-gray-400 text-sm">
          &copy; {new Date().getFullYear()} PetParadise. All rights reserved.
        </p>
        <p className="text-gray-500 text-xs mt-2">
          Committed to happy pets and a healthier planet.
        </p>
      </div>
    </footer>
  );
};

export default Footer;