import React, { useState, useEffect } from "react";
import { useExchangeRate } from "../context/ExchangeRateContext";
import { MODAL_STYLES, MODAL_BORDER_STYLES, LABEL_STYLES, INPUT_STYLES, TEXT_COLORS } from '../utils/styles';

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
      // Error fetching exchange rate
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
    <div className="fixed inset-0 z-40">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="absolute inset-0 flex items-start justify-center pt-4 px-4 overflow-y-auto">
        <div className="w-full max-w-sm rounded-2xl shadow-2xl my-4" style={MODAL_STYLES}>
          <div className="flex items-center justify-center px-6 py-4 border-b" style={MODAL_BORDER_STYLES}>
            <h2 className="text-lg font-semibold" style={{color: TEXT_COLORS.primary}}>💱 Cotización del Dólar</h2>
          </div>
          <div className="px-6 py-5">
          
            <div className="space-y-5 flex flex-col items-center">
              <div className="w-40">
                <label className="text-sm text-center mb-1" style={LABEL_STYLES}>Tipo de cotización</label>
                <select
                  className="w-full px-3 py-2 rounded text-center text-sm"
                  style={INPUT_STYLES}
                  value={rateType}
                  onChange={(e) => setRateType(e.target.value)}
                >
                  <option value="blue">Blue</option>
                  <option value="oficial">Oficial</option>
                  <option value="cripto">Cripto</option>
                </select>
              </div>

              <div className="w-40">
                <label className="text-sm text-center mb-1" style={LABEL_STYLES}>Operación</label>
                <div className="flex items-center justify-center space-x-2">
                  <button
                    className={`px-3 py-2 rounded font-medium transition-all duration-200 text-sm ${
                      operation === "compra"
                        ? "text-white"
                        : "hover:opacity-80"
                    }`}
                    style={{
                      background: operation === "compra" ? TEXT_COLORS.accent : '#374151',
                      color: operation === "compra" ? '#FFFFFF' : TEXT_COLORS.secondary
                    }}
                    onClick={() => setOperation("compra")}
                  >
                    Compra
                  </button>
                  <button
                    className={`px-3 py-2 rounded font-medium transition-all duration-200 text-sm ${
                      operation === "venta"
                        ? "text-white"
                        : "hover:opacity-80"
                    }`}
                    style={{
                      background: operation === "venta" ? TEXT_COLORS.accent : '#374151',
                      color: operation === "venta" ? '#FFFFFF' : TEXT_COLORS.secondary
                    }}
                    onClick={() => setOperation("venta")}
                  >
                    Venta
                  </button>
                </div>
              </div>

              <div className="w-40">
                <label className="text-sm text-center mb-1" style={LABEL_STYLES}>Cotización</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 rounded text-center text-sm"
                  style={INPUT_STYLES}
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

          <div className="flex justify-end gap-2 px-6 py-4 border-t" style={MODAL_BORDER_STYLES}>
            <button 
              onClick={handleClose} 
              className="px-3 py-2 rounded hover:bg-gray-700"
              style={{color: TEXT_COLORS.primary}}
            >
              Cerrar
            </button>
            <button 
              onClick={handleAccept} 
              className="px-3 py-2 rounded text-white" 
              style={{background: TEXT_COLORS.accent}}
            >
              Aceptar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExchangeRateModal;
