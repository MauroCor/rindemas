import React, { createContext, useContext, useState } from 'react';

const SessionContext = createContext();

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};

export const SessionProvider = ({ children }) => {
  const [isSessionExpired, setIsSessionExpired] = useState(false);

  const showSessionExpired = () => {
    setIsSessionExpired(true);
  };

  const hideSessionExpired = () => {
    setIsSessionExpired(false);
    // Redirigir al login después de cerrar el modal
    if (window.location.pathname !== '/login') {
      window.location.href = '/rindemas/login';
    }
  };

  return (
    <SessionContext.Provider value={{
      isSessionExpired,
      showSessionExpired,
      hideSessionExpired
    }}>
      {children}
    </SessionContext.Provider>
  );
};
