import React from 'react';
import FinancialDesplegableComponent from './FinancialDesplegableComponent';

const MonthlyDataComponent = ({ month }) => {

  // Función para obtener el nombre del mes en base a `month`
  const getMonthName = (offset) => {
    const date = new Date();
    date.setMonth(date.getMonth() + offset);
    const month = date.toLocaleString('es-ES', { month: 'long' });
    return month.charAt(0).toUpperCase() + month.slice(1);
  };

  const currentMonthName = getMonthName(month);

  return (
    <div className={`w-60 bg-gray-800 rounded-lg p-4 shadow-lg text-center ${month === 0 ? 'border-2 border-yellow-500' : ''}`}>
      <h3 className="font-bold text-2xl mb-2">{currentMonthName}</h3>
      <label>Balance</label>
      <div>
        <label className='text-2xl text-blue-500'>$350k</label>
      </div>
      <FinancialDesplegableComponent title="Ingresos" amount="400" isIncome={true} />
      <FinancialDesplegableComponent title="Egresos" amount="50" isIncome={false} />
    </div>
  );
};

export default MonthlyDataComponent;
