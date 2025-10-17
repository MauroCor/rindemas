import { useContext, useState } from 'react';
import logoRindePlus from '../images/logo-rindemas.png';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { postToken } from '../services/login';
import Footer from './FooterComponent';

const Login = () => {
  const { login } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsLoading(true);
    
    try {
      const token = await postToken(username, password);

      if (token) {
        setMessage('Ingresando...');
        login(token);  // Guarda token context y localStorage
        setTimeout(() => {
          navigate('/balance');
        }, 1000);
      }
    } catch (error) {
      setMessage('Credenciales incorrectas.');
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col overflow-y-auto" style={{background:'#111827'}}>
      <div className="flex-1 flex items-start justify-center pt-32 pb-32">
        <div className="max-w-md p-8 rounded-2xl shadow-2xl" style={{background:'#1F2937', border:'1px solid #374151'}}>
          <div className="text-center mb-8">
            <img
              src={logoRindePlus}
              alt="Rinde+"
              className="mx-auto mb-1"
              style={{height:'56px'}}
            />
            <h2 className="sr-only">Rinde+</h2>
            <p className="mt-1 text-base" style={{color:'#9CA3AF'}}>- Proyectá tu evolución -</p>
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
                style={{ background:'#2D3748', color:'#F3F4F6', border:'1px solid #16A085' }}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2" style={{color:'#F3F4F6'}}>
                Contraseña
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete='off'
                  placeholder="Ingresa tu contraseña"
                  className="w-full px-4 py-3 rounded-lg pr-12 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-200"
                  style={{ background:'#2D3748', color:'#F3F4F6', border:'1px solid #16A085' }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-2 my-auto h-9 px-2 rounded hover:bg-gray-700"
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-gray-300">
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7S2 12 2 12Z" stroke="currentColor" strokeWidth="1.5"/>
                    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5"/>
                  </svg>
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-lg font-medium text-white transition-all duration-200 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{background:'#16A085'}}
              >
                {isLoading ? 'Ingresando...' : 'Iniciar Sesión'}
              </button>
              
              {message && (
                <p 
                  className={`mt-3 text-sm text-center font-medium ${
                    message.includes('incorrectas') ? 'text-red-400' : 'text-teal-400'
                  }`}
                >
                  {message}
                </p>
              )}
            </div>
          </form>
          
          <div className="mt-8 text-center">
            <p className="text-xs" style={{color:'#6B7280'}}>
              ¿Primera vez? Contacta al <a
                href="mailto:maurocorrales4@gmail.com?subject=Rinde%2B%20Solicitud%20Usuario&body=Hola!%20Solicito%20una%20cuenta%20personal%20para%20Rinde%2B.%0A%0AMis%20datos%20son:%0ANombre:%20%0AApellido%20(Opcional):%20%0AEmail%20(Opcional):%0ANombre%20de%20usuario%20deseado%20(Opcional):%0AMe%20gustaria%20recibir%20asesoramiento%20personalizado:%20S%C3%8D%20/%20No.%0A%0AGracias.%20Saludos!"
                className="text-teal-400 underline hover:text-teal-300"
                style={{color:'#16A085'}}
              >administrador</a> para obtener acceso.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
