import { base_url } from "./config";

const url = `${base_url}/api/token/`


export const postToken = async (username, password) => {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 'username': username, 'password': password }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to get token');
      }
  
      const data = await response.json();
      return data.access;
    } catch (error) {
      console.error('Error posting token:', error);
      throw error;
    }
  };
  