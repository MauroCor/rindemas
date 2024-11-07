export const getIncomes = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5050/api/income/');
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
  
  export default getIncomes;