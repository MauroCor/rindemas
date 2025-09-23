import React, { useContext, useState, useEffect } from 'react';
import logoRindePlus from '../images/logo-rindemas.png';
import logoRindePlusMobile from '../images/logo-rindemas-mobile.png';
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
    <nav className={`flex items-center ${isLoginPage ? 'justify-center' : 'justify-between'} px-4 py-2 sticky top-0 z-20`} style={{background:'#111827', boxShadow:'0 6px 24px rgba(0,0,0,0.25)'}}>
      {isLoginPage && (
        <img
          src={logoRindePlus}
          alt="Rinde+"
          className="h-6 hidden sm:block"
        />
      )}
      {isLoginPage && (
        <img
          src={logoRindePlusMobile}
          alt="Rinde+"
          className="h-6 block sm:hidden"
        />
      )}
      {!isLoginPage && (
        <img
          src={logoRindePlus}
          alt="Rinde+"
          className="h-6 hidden sm:block"
        />
      )}
      {!isLoginPage && (
        <img
          src={logoRindePlusMobile}
          alt="Rinde+"
          className="h-6 block sm:hidden"
        />
      )}

      {!isLoginPage && (
        <div className="flex-1 flex justify-center space-x-4">
          <NavLink
            to="/balance"
            className={({ isActive }) =>
              isActive
                ? "font-bold text-lg text-white border border-teal-500 rounded-full px-2 py-1"
                : "text-white hover:text-gray-200 px-2 py-1"
            }
          >
            Balance
          </NavLink>
          <NavLink
            to="/saldo"
            className={({ isActive }) =>
              isActive
                ? "font-bold text-lg text-white border border-teal-500 rounded-full px-2 py-1"
                : "text-white hover:text-gray-200 px-2 py-1"
            }
          >
            Saldo
          </NavLink>

          

          <NavLink
            to="/ahorro"
            className={({ isActive }) =>
              isActive
                ? "font-bold text-lg text-white border border-teal-500 rounded-full px-2 py-1"
                : "text-white hover:text-gray-200 px-2 py-1"
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