import React from 'react';
import { PawPrint } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 mt-12">
      <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center border-b border-gray-700 pb-6">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <h4 className="text-2xl font-bold text-white mb-2">PetParadise</h4>
            <p className="text-gray-400 text-sm">Caring for Pets, Enriching Lives</p>
          </div>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-400 hover:text-indigo-400 transition">Privacy Policy</a>
            <a href="#" className="text-gray-400 hover:text-indigo-400 transition">Terms of Service</a>
            <a href="#" className="text-gray-400 hover:text-indigo-400 transition">FAQ</a>
          </div>
        </div>
        <div className="mt-6 pt-4 text-center border-t border-gray-700">
            <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} PetParadise. All rights reserved. Powered by Love.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;