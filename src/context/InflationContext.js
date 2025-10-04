import React, { createContext, useContext, useMemo, useState } from 'react';
import { annualToMonthly, cumulativeIndex } from '../utils/numbers';

const InflationContext = createContext();

export const InflationProvider = ({ children }) => {
  // Modo simple: una inflación anual fija que se convierte a mensual
  // Guardamos la entrada del usuario como string para evitar ceros a la izquierda no deseados
  const [annualInflationPercentInput, setAnnualInflationPercentInput] = useState('0');
  const [enabledReal, setEnabledReal] = useState(false);

  const monthlyInflation = useMemo(() => {
    const annualNumber = parseFloat(annualInflationPercentInput || '0');
    const m = annualToMonthly(isFinite(annualNumber) ? annualNumber : 0);
    // devolvemos un generador simple; los consumidores deberán cortar al largo de labels
    return { constantMonthlyRate: m };
  }, [annualInflationPercentInput]);

  const buildCpiIndex = (length) => {
    const r = monthlyInflation.constantMonthlyRate || 0;
    const series = Array.from({ length }, () => r);
    return cumulativeIndex(series);
  };

  return (
    <InflationContext.Provider value={{
      annualInflationPercentInput,
      setAnnualInflationPercentInput,
      enabledReal,
      setEnabledReal,
      buildCpiIndex,
    }}>
      {children}
    </InflationContext.Provider>
  );
};

export const useInflation = () => useContext(InflationContext);


