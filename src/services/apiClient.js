import { base_url } from "./config";

let sessionExpired = false;
let sessionExpiredCallback = null;

export const setSessionExpiredCallback = (callback) => {
  sessionExpiredCallback = callback;
};

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

    if (response.status === 401 && !sessionExpired && !login) {
      sessionExpired = true;
      localStorage.removeItem('token');
      
      if (sessionExpiredCallback) {
        sessionExpiredCallback();
      }
      
      throw new Error('Unauthorized or expired token');
    }

    if (!response.ok) {
      const errorBodyText = await response.text();
      let parsedBody = null;
      try {
        parsedBody = errorBodyText ? JSON.parse(errorBodyText) : null;
      } catch (_) {
        // keep as text if not JSON
      }
      const err = new Error(`HTTP error ${response.status}`);
      err.status = response.status;
      err.data = parsedBody ?? errorBodyText;
      console.error('Error response body:', err.data);
      throw err;
    }

    return response;
  } catch (error) {
    console.error('API request error:', error.message);
    throw error;
  }
};

export default apiRequest;
