import React, { useState } from 'react';

const MonthlyDataComponent = ({ month }) => {
  const [showIngresos, setShowIngresos] = useState(false);
  const [showEgresos, setShowEgresos] = useState(false);

  // Función para obtener el nombre del mes en base a `month`
  const getMonthName = (offset) => {
    const date = new Date();
    date.setMonth(date.getMonth() + offset);
    return date.toLocaleString('es-ES', { month: 'long' });
  };

  const currentMonthName = getMonthName(month);

  return (
    <div className="w-60 bg-gray-800 rounded-lg p-4 shadow-lg text-center">
      <h3 className="font-bold text-xl mb-2">{currentMonthName}</h3>
      <div>Balance: $X</div>
      
      <div>
        <div onClick={() => setShowIngresos(!showIngresos)} className="cursor-pointer mt-2">
          Ingresos: $X
        </div>
        {showIngresos && (
          <div className="grid grid-cols-2 mt-2 gap-2">
            <div>Nombre</div>
            <div>Monto</div>
          </div>
        )}
      </div>

      <div>
        <div onClick={() => setShowEgresos(!showEgresos)} className="cursor-pointer mt-2">
          Egresos: $X
        </div>
        {showEgresos && (
          <div className="grid grid-cols-2 mt-2 gap-2">
            <div>Nombre</div>
            <div>Monto</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MonthlyDataComponent;
