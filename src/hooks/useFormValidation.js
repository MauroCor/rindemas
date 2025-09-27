import { useState, useCallback } from 'react';

export const useFormValidation = () => {
  const [errors, setErrors] = useState({});

  const validateRequired = useCallback((value, fieldName) => {
    if (!value || value.toString().trim() === '') {
      setErrors(prev => ({ ...prev, [fieldName]: `${fieldName} es obligatorio` }));
      return false;
    }
    setErrors(prev => {
      const { [fieldName]: removed, ...rest } = prev;
      return rest;
    });
    return true;
  }, []);

  const validateDateRange = useCallback((dateFrom, dateTo) => {
    if (dateTo && dateTo < dateFrom) {
      setErrors(prev => ({ ...prev, dateRange: 'La fecha fin debe ser mayor a la fecha inicio' }));
      return false;
    }
    setErrors(prev => {
      const { dateRange: removed, ...rest } = prev;
      return rest;
    });
    return true;
  }, []);

  const validateNumber = useCallback((value, fieldName, min = 0) => {
    const numValue = Number(value);
    if (isNaN(numValue) || numValue < min) {
      setErrors(prev => ({ 
        ...prev, 
        [fieldName]: `${fieldName} debe ser un número válido${min > 0 ? ` mayor a ${min}` : ''}` 
      }));
      return false;
    }
    setErrors(prev => {
      const { [fieldName]: removed, ...rest } = prev;
      return rest;
    });
    return true;
  }, []);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const hasErrors = Object.keys(errors).length > 0;

  return {
    errors,
    validateRequired,
    validateDateRange,
    validateNumber,
    clearErrors,
    hasErrors
  };
};
