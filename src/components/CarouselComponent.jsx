import React, { useState } from 'react';
import MonthlyDataComponent from './MonthlyDataComponent';

const CarouselComponent = () => {
  const [currentMonth, setCurrentMonth] = useState(0);

  const handleNext = () => setCurrentMonth(currentMonth + 1);
  const handlePrev = () => setCurrentMonth(currentMonth - 1);

  return (
    <div className="relative flex justify-center items-center mt-8 space-x-4">
      {/* Botón de retroceso anclado al centro izquierda */}
      <button onClick={handlePrev} className="absolute left-0 text-white text-2xl">
        {"<"}
      </button>

      {/* Contenedor de meses en el carrusel */}
      <div className="flex space-x-4">
        <MonthlyDataComponent month={currentMonth - 1} />
        <MonthlyDataComponent month={currentMonth} />
        <MonthlyDataComponent month={currentMonth + 1} />
      </div>

      {/* Botón de avance anclado al centro derecha */}
      <button onClick={handleNext} className="absolute right-0 text-white text-2xl">
        {">"}
      </button>
    </div>
  );
};

export default CarouselComponent;
