import { base_url } from "./config";

const apiRequest = async (endpoint, method = 'GET', data = null, login = false) => {
  const url = `${base_url}${endpoint}`;

  try {
    const token = localStorage.getItem('token');

    if (!token && !login) {
      throw new Error('Token not found');
    }

    const options = {
      method,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: data ? JSON.stringify(data) : null,
    };

    const response = await fetch(url, options);

    if (response.status === 401) {
      console.error('Unauthorized: redirecting to login');
      window.location.href = '/sm/login';
      return;
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
