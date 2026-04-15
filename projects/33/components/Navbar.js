import React from 'react';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-lg p-4 flex justify-between items-center">
      <div className="text-xl font-bold">PetStore</div>
      <ul className="flex space-x-4">
        <li><a href="#home" className="hover:text-gray-700">Home</a></li>
        <li><a href="#products" className="hover:text-gray-700">Products</a></li>
        <li><a href="#about" className="hover:text-gray-700">About</a></li>
        <li><a href="#contact" className="hover:text-gray-700">Contact</a></li>
      </ul>
    </nav>
  );
};

export default Navbar;