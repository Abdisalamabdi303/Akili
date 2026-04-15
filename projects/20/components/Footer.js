import React from 'react';
import { PawPrint, Mail, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 mt-12">
      <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center border-b border-gray-700 pb-6">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <h3 className="text-2xl font-bold text-white mb-2">PetParadise</h3>
            <p className="text-gray-400 text-sm">Caring for pets, enriching lives.</p>
          </div>
          <div className="flex space-x-6">
            <div className="flex items-center space-x-2 text-gray-400">
              <PawPrint className="w-5 h-5 text-indigo-400" />
              <a href="#" className="hover:text-white transition">About Us</a>
            </div>
            <div className="flex items-center space-x-2 text-gray-400">
              <Mail className="w-5 h-5" />
              <a href="mailto:info@petparadise.com" className="hover:text-white transition">Contact</a>
            </div>
            <div className="flex items-center space-x-2 text-gray-400">
              <Phone className="w-5 h-5" />
              <a href="tel:1234567890" className="hover:text-white transition">Call Us</a>
            </div>
          </div>
        </div>
        <div className="mt-6 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} PetParadise. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;