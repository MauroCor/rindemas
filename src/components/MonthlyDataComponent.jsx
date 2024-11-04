import React, { useState } from 'react';

const MonthlyDataComponent = ({ month }) => {
  const [showIngresos, setShowIngresos] = useState(false);
  const [showEgresos, setShowEgresos] = useState(false);

  const getMonthName = (offset) => {
    const date = new Date(); // Obtiene la fecha actual
    date.setMonth(date.getMonth() + offset); // Ajusta el mes según el offset
    return date.toLocaleString('es-ES', { month: 'long' }); // Retorna el nombre del mes en español
  };

  const currentMonthName = getMonthName(month);

  return (
    <div className="monthly-data p-4 border">
      <div>{currentMonthName}</div>
      <div>Balance: $X</div>

      <div>
        <div onClick={() => setShowIngresos(!showIngresos)}>Ingresos: $X</div>
        {showIngresos && (
          <div className="grid grid-cols-2">
            {/* Aquí iteras los ingresos */}
            <div>Nombre</div>
            <div>Monto</div>
          </div>
        )}
      </div>

      <div>
        <div onClick={() => setShowEgresos(!showEgresos)}>Egresos: $X</div>
        {showEgresos && (
          <div className="grid grid-cols-2">
            {/* Aquí iteras los egresos */}
            <div>Nombre</div>
            <div>Monto</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MonthlyDataComponent;
