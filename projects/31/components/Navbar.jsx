import React from 'react';
import { LucideMenu } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="bg-black p-4 flex justify-between items-center">
      <div className="text-white text-lg font-bold">Dental Clinic</div>
      <ul className="flex space-x-4">
        <li><a href="#home" className="text-white hover:text-amber-500">Home</a></li>
        <li><a href="#services" className="text-white hover:text-amber-500">Services</a></li>
        <li><a href="#about" className="text-white hover:text-amber-500">About</a></li>
        <li><a href="#contact" className="text-white hover:text-amber-500">Contact</a></li>
      </ul>
    </nav>
  );
};

export default Navbar;