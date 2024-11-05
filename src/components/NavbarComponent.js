import { Link } from 'react-router-dom';


const NavbarComponent = () => (
  <nav className="flex items-center justify-between bg-gray-800 p-4">
    <div className="text-lg font-bold">Stage Money</div>
    <div className="flex space-x-4">
      <Link to="/fijos">Fijos</Link>
      <Link to="/tarjetas">Tarjetas</Link>
      <Link to="/ahorros">Ahorros</Link>
    </div>
  </nav>
);

export default NavbarComponent;
