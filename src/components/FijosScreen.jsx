import React, { useState } from 'react';
import NavbarComponent from './NavbarComponent';
import CarouselComponent from './CarouselComponent';
import ButtonPrevComponent from './ButtonPrevComponent';
import ButtonNextComponent from './ButtonNextComponent';

const FijosScreen = () => {
  const [currentMonth, setCurrentMonth] = useState(0);

  const handleNext = () => setCurrentMonth(currentMonth + 1);
  const handlePrev = () => setCurrentMonth(currentMonth - 1);

  return (
    <div className="dark bg-gray-900 text-white min-h-screen">
      <NavbarComponent />
      
      <div className="relative p-4">
        <ButtonPrevComponent onClick={handlePrev} />
        
        <button className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white rounded-full px-4 py-2">
          + Agregar
        </button>

        <ButtonNextComponent onClick={handleNext} />

        <CarouselComponent currentMonth={currentMonth} />
      </div>
    </div>
  );
};

export default FijosScreen;
