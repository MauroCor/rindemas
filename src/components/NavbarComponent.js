import React, { useContext, useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import UserMenu from './UserMenuComponent';
import { getUser } from '../services/user';

const NavbarComponent = () => {
  const { logout } = useContext(AuthContext);
  const isLoginPage = useLocation().pathname === '/login';

  const [userFullName, setUserFullName] = useState('');

  const handleLogout = () => {
    logout();
  };

  useEffect(() => {
    if (!isLoginPage) {
      const fetchUser = async () => {
        try {
          const user = await getUser();
          setUserFullName(user.full_name);
        } catch (error) {
          console.error('Error al obtener el usuario:', error);
        }
      };

      fetchUser();
    }
  }, [isLoginPage]);

  return (
    <nav className="flex items-center justify-between bg-gray-800 p-4">
      <div className="text-lg font-bold text-white">Stage Money</div>

      <div className="flex-1 flex justify-center space-x-4">
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

      {!isLoginPage && userFullName && (
        <UserMenu userName={userFullName} handleLogout={handleLogout} />
      )}
    </nav>
  );
};

export default NavbarComponent;
