import React, { createContext, useState, useContext, useEffect } from 'react';

const ExchangeRateContext = createContext();

export const ExchangeRateProvider = ({ children }) => {
  const [exchangeRate, setExchangeRate] = useState('');

  const updateExchangeRate = (rate) => {
    setExchangeRate(rate);
  };

  useEffect(() => {
    const fetchExchangeRate = async () => {
      const url = `https://dolarapi.com/v1/dolares/cripto`;
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }
        const data = await response.json();
        const rate = parseInt(data['compra']);
        setExchangeRate(rate);
      } catch (error) {
        console.error("Error fetching exchange rate:", error);
      }
    };

    fetchExchangeRate();
  }, []);

  return (
    <ExchangeRateContext.Provider value={{ exchangeRate, updateExchangeRate }}>
      {children}
    </ExchangeRateContext.Provider>
  );
};

export const useExchangeRate = () => useContext(ExchangeRateContext);
