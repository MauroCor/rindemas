import React from 'react';
import { useExchangeRate } from '../context/ExchangeRateContext';

const ExchangeRateDisplay = () => {
  const { exchangeRate } = useExchangeRate();

  return (
    <div className="bg-gray-600 px-1 py-1 border-gray-950 text-white text-xs">
      USD: {exchangeRate ? `$${exchangeRate.toLocaleString()}` : "..."}
    </div>
  );
};

export default ExchangeRateDisplay;
