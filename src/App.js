import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './navegation/PrivateRoute';

import NavbarComponent from './components/NavbarComponent';
import FijosScreen from './pages/FijosScreen';
import AddScreen from './pages/AddScreen';
import CardScreen from './pages/CardScreen';
import SavingScreen from './pages/SavingScreen';
import Login from './components/LoginComponent';
import Footer from './components/FooterComponent';
import { ExchangeRateProvider } from './context/ExchangeRateContext';
import InfoScreen from './pages/InfoScreen';

const App = () => (
  <AuthProvider>
    <ExchangeRateProvider>
      <BrowserRouter basename="/stagemoney-fe">
        <NavbarComponent />
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/" element={<Navigate to="/fijos" />} />

          <Route
            path="/fijos"
            element={
              <PrivateRoute>
                <FijosScreen />
              </PrivateRoute>
            }
          />
          <Route
            path="/agregar"
            element={
              <PrivateRoute>
                <AddScreen />
              </PrivateRoute>
            }
          />
          <Route
            path="/tarjetas"
            element={
              <PrivateRoute>
                <CardScreen />
              </PrivateRoute>
            }
          />
          <Route
            path="/ahorros"
            element={
              <PrivateRoute>
                <SavingScreen />
              </PrivateRoute>
            }
          />
          <Route
            path="/info"
            element={
              <PrivateRoute>
                <InfoScreen />
              </PrivateRoute>
            }
          />
        </Routes>
        <Footer />
      </BrowserRouter>
    </ExchangeRateProvider>
  </AuthProvider>
);

export default App;
