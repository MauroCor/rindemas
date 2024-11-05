import React, { useState } from 'react';
import NavbarComponent from '../components/NavbarComponent';
import CarouselComponent from '../components/CarouselComponent';
import ButtonComponent from '../components/ButtonComponent';

const FijosScreen = () => {
  const [currentMonth, setCurrentMonth] = useState(0);

  const handleNext = () => setCurrentMonth(currentMonth + 1);
  const handlePrev = () => setCurrentMonth(currentMonth - 1);

  const resetToCurrentMonth = () => setCurrentMonth(0);

  return (
    <div className="dark bg-gray-900 text-white min-h-screen">
      <NavbarComponent />

      <div className="relative p-4">
        <div className="flex justify-center items-center flex-wrap space-x-2">
          <ButtonComponent onClick={handlePrev} text="<" />
          <ButtonComponent onClick={1} text="+ Agregar" />
          <ButtonComponent onClick={resetToCurrentMonth} text="Mes actual" />
          <ButtonComponent onClick={handleNext} text=">"/>
        </div>

        <CarouselComponent currentMonth={currentMonth} />
      </div>
    </div>
  );
};

export default FijosScreen;
