import React, { useState } from 'react';
import MonthlyDataComponent from './MonthlyDataComponent';

const CarouselComponent = () => {
  const [currentMonth, setCurrentMonth] = useState(0); // Puedes manejar los meses como índices

  const handleNext = () => setCurrentMonth(currentMonth + 1);
  const handlePrev = () => setCurrentMonth(currentMonth - 1);

  return (
    <div className="carousel-container relative">
      <button onClick={handlePrev} className="absolute left-0">{"<"}</button>
      <div className="flex">
        <MonthlyDataComponent month={currentMonth - 1} />
        <MonthlyDataComponent month={currentMonth} />
        <MonthlyDataComponent month={currentMonth + 1} />
      </div>
      <button onClick={handleNext} className="absolute right-0">{">"}</button>
    </div>
  );
};

export default CarouselComponent;
