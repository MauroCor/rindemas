import React, { useState } from 'react';
import MonthlyDataComponent from './MonthlyDataComponent';

const CarouselComponent = () => {
  const [currentMonth, setCurrentMonth] = useState(0);

  const handleNext = () => setCurrentMonth(currentMonth + 1);
  const handlePrev = () => setCurrentMonth(currentMonth - 1);

  return (
    <div className="relative flex justify-center items-center mt-32 space-x-4">
      {/* Botón de retroceso anclado al centro izquierda */}
      <button
        onClick={handlePrev}
        className="absolute left-20 text-white text-2xl rounded-full bg-blue-600 w-10 h-10">
        {"<"}
      </button>

      {/* Contenedor de meses en el carrusel */}
      <div className="flex space-x-4">
        <MonthlyDataComponent month={currentMonth - 1} />
        <MonthlyDataComponent month={currentMonth} />
        <MonthlyDataComponent month={currentMonth + 1} />
      </div>

      {/* Botón de avance anclado al centro derecha */}
      <button
        onClick={handleNext}
        className="absolute right-20 text-white text-2xl rounded-full bg-blue-600 w-10 h-10">
        {">"}
      </button>
    </div>
  );
};

export default CarouselComponent;
