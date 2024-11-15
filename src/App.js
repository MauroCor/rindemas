import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './navegation/PrivateRoute';

import NavbarComponent from './components/NavbarComponent';
import FijosScreen from './pages/FijosScreen';
import AddScreen from './pages/AddScreen';
import CardScreen from './pages/CardScreen';
import SaveScreen from './pages/SaveScreen';
import Login from './components/LoginComponent';

const App = () => (
  <AuthProvider>
    <BrowserRouter basename="/sm">
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
              <SaveScreen />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);

export default App;
