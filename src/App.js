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
import AddModal from './components/AddModal';
import { AddModalProvider } from './components/AddModalContext';

const App = () => (
  <AuthProvider>
    <ExchangeRateProvider>
      <AddModalProvider>
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
        </Routes>
        <AddModal />
      </BrowserRouter>
      </AddModalProvider>
    </ExchangeRateProvider>
  </AuthProvider>
);

export default App;
