import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { postToken } from '../services/login';

const Login = () => {
  const { login } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const token = await postToken(username, password);

      if (token) {
        login(token);  // Guarda token context y localStorage
        navigate('/fijos');
      }
    } catch (error) {
      alert('Error: Revisa tus credenciales.');
    }
  };

  return (
    <div className="flex items-start justify-center min-h-screen bg-gray-900">
      <div className="max-w-md w-full bg-gray-800 p-8 rounded-lg shadow-xl mt-24">
        <h2 className="text-center text-3xl font-extrabold text-white">Bienvenido de nuevo</h2>
        <p className="mt-4 text-center text-gray-400">Inicia sesión para continuar</p>
        <form onSubmit={handleLogin} className="mt-8 space-y-6">
          <div>
            <label className="sr-only" htmlFor="username">Nombre de usuario</label>
            <input
              id="username"
              type="text"
              placeholder="Nombre de usuario"
              className="appearance-none relative block w-full px-3 py-3 border border-gray-700 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mt-4">
            <label className="sr-only" htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              placeholder="Contraseña"
              className="appearance-none relative block w-full px-3 py-3 border border-gray-700 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-500 hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Iniciar sesión
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
