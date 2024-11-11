import { NavLink } from 'react-router-dom';

const NavbarComponent = () => (
  <nav className="flex items-center justify-between bg-gray-800 p-4 mb-6">
    <div className="text-lg font-bold">Stage Money</div>
    <div className="flex space-x-4">
      <NavLink
        to="/fijos"
        className={({ isActive }) =>
          isActive ? "text-blue-500 font-bold" : "text-white"
        }
      >
        Fijos
      </NavLink>
      <NavLink
        to="/tarjetas"
        className={({ isActive }) =>
          isActive ? "text-blue-500 font-bold" : "text-white"
        }
      >
        Tarjetas
      </NavLink>
      <NavLink
        to="/ahorros"
        className={({ isActive }) =>
          isActive ? "text-blue-500 font-bold" : "text-white"
        }
      >
        Ahorros
      </NavLink>
    </div>
  </nav>
);

export default NavbarComponent;
