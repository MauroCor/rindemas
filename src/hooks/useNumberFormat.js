import { useCallback } from 'react';

export const useNumberFormat = () => {
  const formatNumber = useCallback((num) => {
    if (!num) return '';
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }, []);

  const parseNumber = useCallback((str) => {
    return str.replace(/\./g, '');
  }, []);

  const formatCurrency = useCallback((amount, currency = 'ARS') => {
    if (!amount) return `$0`;
    const formatted = formatNumber(amount);
    return currency === 'USD' ? `U$S ${formatted}` : `$ ${formatted}`;
  }, [formatNumber]);

  const validateDecimal = useCallback((value, maxDecimals = 9) => {
    const regex = new RegExp(`^\\d*(?:\\.?\\d{0,${maxDecimals}})?$`);
    return regex.test(value);
  }, []);

  const cleanNumberInput = useCallback((value, maxDecimals = 9) => {
    if (!validateDecimal(value, maxDecimals)) return value;
    
    if (value.includes('.')) {
      const [integer, decimal] = value.split('.');
      const limitedDecimal = decimal ? decimal.slice(0, maxDecimals) : '';
      return `${integer}${limitedDecimal ? '.' + limitedDecimal : ''}`;
    }
    
    return value;
  }, [validateDecimal]);

  return {
    formatNumber,
    parseNumber,
    formatCurrency,
    validateDecimal,
    cleanNumberInput
  };
};
