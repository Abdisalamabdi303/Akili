import React from 'react';

function Footer() {
  return (
    <footer className="bg-cya text-white py-4 px-4 flex justify-between items-center">
      <div>&copy; 2023 Pet Store. All rights reserved.</div>
      <ul className="flex space-x-4">
        <li><a href="#">Facebook</a></li>
        <li><a href="#">Instagram</a></li>
        <li><a href="#">Twitter</a></li>
      </ul>
    </footer>
  );
}

export default Footer;