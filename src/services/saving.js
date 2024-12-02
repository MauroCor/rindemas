import { base_url } from "./config";

const url = `${base_url}/api/saving/`


export const getSavings = async (queryParam = '') => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token not found');
    }

    const response = await fetch(`${url}${queryParam}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('Error response body:', errorBody);
      throw new Error('Failed to get savings');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};

export const postSaving = async (data) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token not found');
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('Error response body:', errorBody);
      throw new Error('Failed to post saving');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const deleteSaving = async (id) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token not found');
    }
    
    const response = await fetch(`${url}${id}/`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      const errorBody = await response.text();
      console.error('Error response body:', errorBody);
      throw new Error('Failed to delete saving');
    }

    return response
  } catch (error) {
    throw error;
  }
};

export const patchSaving = async (id, data) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token not found');
    }
    
    const response = await fetch(`${url}${id}/`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('Error response body:', errorBody);
      throw new Error('Failed to patch saving');
    }

    return response
  } catch (error) {
    throw error;
  }
};

export const putSaving = async (data) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token not found');
    }

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('Error response body:', errorBody);
      throw new Error('Failed to put saving');
    }

    return response;
  } catch (error) {
    throw error;
  }
};

export default getSavings;