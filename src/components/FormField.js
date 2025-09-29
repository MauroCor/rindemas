import React from 'react';
import { LABEL_STYLES, INPUT_STYLES } from '../utils/styles';

const FormField = ({ 
  label, 
  name, 
  value, 
  onChange, 
  type = 'text', 
  placeholder, 
  error, 
  required = false,
  className = '',
  inputClassName = '',
  ...props 
}) => {
  return (
    <div className={`flex flex-col ${className}`}>
      <label className="text-sm text-center mb-1" style={LABEL_STYLES}>
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`text-center p-2 rounded-lg ${inputClassName}`}
        style={{
          ...INPUT_STYLES,
          ...(error && { borderColor: '#EF4444' })
        }}
        {...props}
      />
      {error && (
        <span className="text-red-400 text-xs mt-1 text-center">{error}</span>
      )}
    </div>
  );
};

export default FormField;
