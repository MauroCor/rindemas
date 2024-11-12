import { base_url } from "./config";

const url = `${base_url}/api/income/`


export const getIncomes = async () => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch income:", error);
    throw error;
  }
};

export const postIncome = async (data) => {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error('Failed to post income');
    }

    return await response.json();
  } catch (error) {
    console.error('Error posting income:', error);
    throw error;
  }
};

export const patchIncome = async (data) => {
  try {
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to patch income');
    }

    return response;
  } catch (error) {
    console.error('Error patching income:', error);
    throw error;
  }
};

export default getIncomes;