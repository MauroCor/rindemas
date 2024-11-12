import { base_url } from "./config";

const url = `${base_url}/api/fixed-cost/`


export const getFixedCosts = async () => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch fixed costs:", error);
    throw error;
  }
};

export const postFixedCost = async (data) => {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to post fixed cost');
    }

    return await response.json();
  } catch (error) {
    console.error('Error posting fixed cost:', error);
    throw error;
  }
};

export const patchFixedCost = async (data) => {
  try {
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to patch fixed cost');
    }

    return response;
  } catch (error) {
    console.error('Error patching fixed cost:', error);
    throw error;
  }
};

export default getFixedCosts;