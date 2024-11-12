import { base_url } from "./config";

const url = `${base_url}/api/card-spend/`


export const getCardSpends = async () => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch card spend:", error);
    throw error;
  }
};

export const postCardSpend = async (data) => {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to post card spend');
    }

    return await response.json();
  } catch (error) {
    console.error('Error posting card spend:', error);
    throw error;
  }
};

export const deleteCardSpend = async (id) => {
  try {
    const response = await fetch(`${url}${id}/`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete card spend');
    }

    return response
  } catch (error) {
    console.error('Error deleting card spend:', error);
    throw error;
  }
};

export default getCardSpends;