import React from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './navegation/PrivateRoute';

import NavbarComponent from './components/NavbarComponent';
import ResultScreen from './pages/ResultScreen';
import SavingScreen from './pages/SavingScreen';
import Login from './components/LoginComponent';
import Footer from './components/FooterComponent';
import { ExchangeRateProvider } from './context/ExchangeRateContext';
import HelpScreen from './pages/HelpScreen';
import BalanceScreen from './pages/BalanceScreen';
import AdminScreen from './pages/AdminScreen';
import AddModal from './components/AddModal';
import { AddModalProvider } from './components/AddModalContext';
import { SessionProvider, useSession } from './context/SessionContext';
import SessionExpiredModal from './components/SessionExpiredModal';
import { setSessionExpiredCallback } from './services/apiClient';

const AppContent = () => {
  const { showSessionExpired, hideSessionExpired, isSessionExpired } = useSession();

  // Configurar el callback para sesión vencida
  React.useEffect(() => {
    setSessionExpiredCallback(showSessionExpired);
  }, [showSessionExpired]);

  return (
    <BrowserRouter basename="/rindemas">
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/" element={<Navigate to="/balance" />} />
        <Route
          path="/balance"
          element={
            <PrivateRoute>
              <NavbarComponent />
              <BalanceScreen />
              <Footer />
            </PrivateRoute>
          }
        />

        <Route
          path="/saldo"
          element={
            <PrivateRoute>
              <NavbarComponent />
              <ResultScreen />
              <Footer />
            </PrivateRoute>
          }
        />
        <Route
          path="/ahorro"
          element={
            <PrivateRoute>
              <NavbarComponent />
              <SavingScreen />
              <Footer />
            </PrivateRoute>
          }
        />
        <Route
          path="/ayuda"
          element={
            <PrivateRoute>
              <NavbarComponent />
              <HelpScreen />
              <Footer />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <NavbarComponent />
              <AdminScreen />
              <Footer />
            </PrivateRoute>
          }
        />
      </Routes>
      <AddModal />
      <SessionExpiredModal isOpen={isSessionExpired} onClose={hideSessionExpired} />
    </BrowserRouter>
  );
};

const App = () => (
  <AuthProvider>
    <ExchangeRateProvider>
      <AddModalProvider>
        <SessionProvider>
          <AppContent />
        </SessionProvider>
      </AddModalProvider>
    </ExchangeRateProvider>
  </AuthProvider>
);

export default App;
