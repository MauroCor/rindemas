import React from 'react';

const NavbarComponent = () => (
  <nav className="flex items-center justify-between bg-gray-800 p-4">
    <div className="text-lg font-bold text-white">Stage Money</div>
    <div className="flex space-x-4">
      <button className="text-white">Fijos</button>
      <button className="text-white">Tarjetas</button>
      <button className="text-white">Ahorros</button>
    </div>
  </nav>
);

export default NavbarComponent;
