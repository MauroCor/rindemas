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
    <nav className={`flex items-center ${isLoginPage ? 'justify-center' : 'justify-between'} bg-gray-800 p-4`}>
      {isLoginPage && (
        <div className={'text-2xl font-bold text-green-200'}>Stage Money</div>
      )}
      {!isLoginPage && (
        <div
          className='text-xl font-bold text-green-200 sm:text-left text-center pr-1'>
          <span className="block sm:inline">Stage </span>
          <span className="block sm:inline">Money</span>
        </div>
      )}

      {!isLoginPage && (
        <div className="flex-1 flex justify-center space-x-4">
          <NavLink
            to="/fijos"
            className={({ isActive }) =>
              isActive ? "text-blue-500 font-bold text-lg" : "text-white"
            }
          >
            Fijo
          </NavLink>

          <NavLink
            to="/tarjetas"
            className={({ isActive }) =>
              isActive ? "text-blue-500 font-bold text-lg" : "text-white"
            }
          >
            Tarjeta
          </NavLink>

          <NavLink
            to="/ahorros"
            className={({ isActive }) =>
              isActive ? "text-blue-500 font-bold text-lg" : "text-white"
            }
          >
            Ahorro
          </NavLink>
        </div>
      )}

      {!isLoginPage && userFullName && (
        <UserMenu userName={userFullName} handleLogout={handleLogout} />
      )}
    </nav>
  );
};

export default NavbarComponent;