import React, { useState, useEffect } from "react";

const ExchangeRateComponent = ({ onApply }) => {
  const [rateType, setRateType] = useState("blue");
  const [operation, setOperation] = useState("compra");
  const [exchangeRate, setExchangeRate] = useState("");

  const fetchExchangeRate = async (type, op) => {
    const url = `https://dolarapi.com/v1/dolares/${type}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      const data = await response.json();
      const rate = data[op];
      setExchangeRate(rate);
      if (onApply) onApply(rate);
    } catch (error) {
      console.error("Error fetching exchange rate:", error);
    }
  };

  useEffect(() => {
    fetchExchangeRate(rateType, operation);
  }, [rateType, operation]);

  const handleApply = () => {
    if (onApply) onApply(exchangeRate);
  };

  return (
    <div className="flex flex-col items-center bg-gray-800 p-1 rounded-lg w-28 space-y-2">
      <div className="flex items-center justify-between w-full space-x-1">
        <select
          className="bg-gray-700 text-white text-xs rounded p-1 px-[5px] ml-[3px]"
          value={rateType}
          onChange={(e) => setRateType(e.target.value)}
        >
          <option value="blue">Blue</option>
          <option value="oficial">Oficial</option>
          <option value="cripto">Cripto</option>
        </select>
        <div
          className={`relative w-16 h-5 flex items-center bg-gray-600 rounded-full px-1 cursor-pointer ${operation === "venta" ? "justify-end" : "justify-start"}`}
          onClick={() => setOperation(operation === "compra" ? "venta" : "compra")}
        >
          <div className="w-4 h-4 bg-blue-400 rounded-full transition-transform" />
          <span
            className={`absolute text-xs text-white transform -translate-x-1/2 top-[55%] -translate-y-1/2 ${operation === "compra" ? "left-[35%]" : "left-[66%]"
              }`}
          >
            {operation === "compra" ? "C" : "V"}
          </span>
        </div>
      </div>
      <div className="flex items-center justify-between space-x-2">
        <input
          type="text"
          className="bg-gray-700 text-white text-xs rounded p-1 w-16 text-center"
          value={exchangeRate ? `$ ${exchangeRate.toLocaleString()}` : ""}
          onChange={(e) => {
            const value = e.target.value.replace(/[^\d]/g, "");
            setExchangeRate(value ? parseInt(value) : "");
          }}
          placeholder="Cotización"
        />
        <button
          className="bg-blue-500 text-white text-xs rounded px-2 py-1 hover:bg-blue-600"
          onClick={handleApply}
        >
          ✓
        </button>
      </div>
    </div>
  );
};

export default ExchangeRateComponent;
