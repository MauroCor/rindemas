import React from 'react';
import App from './App';
import './index.css';
import { createRoot } from 'react-dom/client'
import { InflationProvider } from './context/InflationContext';

createRoot(document.getElementById('root')).render(
  <InflationProvider>
    <App />
  </InflationProvider>
)
