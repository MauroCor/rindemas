import React, { useState, useEffect } from "react";
import { useExchangeRate } from "../context/ExchangeRateContext";

const ExchangeRateModal = ({ isOpen, onClose }) => {
  const { updateExchangeRate } = useExchangeRate();
  const [rateType, setRateType] = useState("cripto");
  const [operation, setOperation] = useState("compra");
  const [exchangeRate, setExchangeRate] = useState("");
  const [tempExchangeRate, setTempExchangeRate] = useState("");

  const fetchExchangeRate = async (type, op) => {
    const url = `https://dolarapi.com/v1/dolares/${type}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      const data = await response.json();
      const rate = parseInt(data[op]);
      setExchangeRate(rate);
      setTempExchangeRate(rate);
    } catch (error) {
      console.error("Error fetching exchange rate:", error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchExchangeRate(rateType, operation);
    }
  }, [rateType, operation, isOpen]);

  const handleAccept = () => {
    if (tempExchangeRate) {
      updateExchangeRate(parseInt(tempExchangeRate));
    }
    onClose();
  };

  const handleClose = () => {
    setTempExchangeRate(exchangeRate);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-2xl shadow-2xl max-w-sm w-full mx-4" style={{background:'#1F2937', border:'1px solid #374151'}}>
        <div className="p-6">
          <h2 className="text-lg font-bold text-white text-center mb-6">Cotización del Dólar</h2>
          
          <div className="space-y-5 flex flex-col items-center">
            <div className="w-40">
              <label className="block text-xs font-medium text-gray-300 mb-1 text-center">Tipo de cotización</label>
              <select
                className="w-full px-3 py-1 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-1 focus:ring-teal-500 text-center text-sm"
                value={rateType}
                onChange={(e) => setRateType(e.target.value)}
              >
                <option value="blue">Blue</option>
                <option value="oficial">Oficial</option>
                <option value="cripto">Cripto</option>
              </select>
            </div>

            <div className="w-40">
              <label className="block text-xs font-medium text-gray-300 mb-1 text-center">Operación</label>
              <div className="flex items-center justify-center space-x-2">
                <button
                  className={`px-3 py-1.5 rounded font-medium transition-all duration-200 text-sm ${
                    operation === "compra"
                      ? "bg-teal-500 text-white"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                  onClick={() => setOperation("compra")}
                >
                  Compra
                </button>
                <button
                  className={`px-3 py-1.5 rounded font-medium transition-all duration-200 text-sm ${
                    operation === "venta"
                      ? "bg-teal-500 text-white"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                  onClick={() => setOperation("venta")}
                >
                  Venta
                </button>
              </div>
            </div>

            <div className="w-40">
              <label className="block text-xs font-medium text-gray-300 mb-1 text-center">Cotización</label>
              <input
                type="text"
                className="w-full px-3 py-1 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-1 focus:ring-teal-500 text-center text-sm"
                value={tempExchangeRate ? `$ ${tempExchangeRate.toLocaleString()}` : ""}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^\d]/g, "");
                  setTempExchangeRate(value ? parseInt(value) : "");
                }}
                placeholder="Ingresa la cotización"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-center space-x-3 p-6 pt-0">
          <button
            onClick={handleClose}
            className="px-4 py-1.5 rounded font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 transition-all duration-200 text-sm"
          >
            Cerrar
          </button>
          <button
            onClick={handleAccept}
            className="px-4 py-1.5 rounded font-medium text-white bg-teal-500 hover:bg-teal-600 transition-all duration-200 text-sm"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExchangeRateModal;
