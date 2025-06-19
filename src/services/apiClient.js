import { base_url } from "./config";

let sessionExpired = false;

const apiRequest = async (endpoint, method = 'GET', data = null, login = false) => {
  const url = `${base_url}${endpoint}`;

  try {
    const token = localStorage.getItem('token');

    const options = {
      method,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: data ? JSON.stringify(data) : null,
    };

    const response = await fetch(url, options);

    if (response.status === 401 && !sessionExpired  && !login) {
      sessionExpired = true;
      alert('Sesión vencida, vuelva a ingresar.');
      localStorage.removeItem('token');
      if (window.location.pathname !== '/login') {
        window.location.href = '/stagemoney-fe/login';
      }
      throw new Error('Unauthorized or expired token');
    }

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('Error response body:', errorBody);
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return response;
  } catch (error) {
    console.error('API request error:', error.message);
    throw error;
  }
};

export default apiRequest;
