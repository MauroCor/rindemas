import React, { useContext, useState } from 'react';
import logoRindePlus from '../images/logo-rindemas.png';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { postToken } from '../services/login';
import Footer from './FooterComponent';

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
        navigate('/balance');
      }
    } catch (error) {
      alert('Error: Revisa tus credenciales.');
    }
  };

  return (
    <div className="h-screen flex flex-col overflow-y-auto" style={{background:'#111827'}}>
      <div className="flex-1 flex items-start justify-center pt-32 pb-32">
        <div className="max-w-md w-full p-8 rounded-2xl shadow-2xl" style={{background:'#1F2937', border:'1px solid #374151'}}>
          <div className="text-center mb-8">
            <img
              src={logoRindePlus}
              alt="Rinde+"
              className="mx-auto mb-4"
              style={{height:'56px'}}
            />
            <h2 className="sr-only">Rinde+</h2>
            <p className="mt-2 text-sm" style={{color:'#9CA3AF'}}>Proyectá tu evolución.</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2" style={{color:'#F3F4F6'}}>
                Usuario
              </label>
              <input
                id="username"
                type="text"
                autoComplete='off'
                placeholder="Ingresa tu usuario"
                className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-200"
                style={{ background:'#2D3748', color:'#F3F4F6', border:'1px solid #1F2937' }}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2" style={{color:'#F3F4F6'}}>
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                autoComplete='off'
                placeholder="Ingresa tu contraseña"
                className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-200"
                style={{ background:'#2D3748', color:'#F3F4F6', border:'1px solid #1F2937' }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 px-4 rounded-lg font-medium text-white transition-all duration-200 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                style={{background:'#14B8A6'}}
              >
                Iniciar Sesión
              </button>
            </div>
          </form>
          
          <div className="mt-8 text-center">
            <p className="text-xs" style={{color:'#6B7280'}}>
              ¿Primera vez? Contacta al administrador para obtener acceso
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
