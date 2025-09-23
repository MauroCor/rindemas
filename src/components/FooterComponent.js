import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-4 text-center">
      <p className="text-sm">
        © {new Date().getFullYear()} Rinde+. Todos los derechos reservados.
      </p>
      <p className="text-xs mt-1">
        Desarrollado con ❤️ por <a href="https://github.com/maurocor" className="text-blue-400 underline">maurocor</a>.
      </p>
    </footer>
  );
};

export default Footer;
