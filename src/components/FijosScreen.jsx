import React, { useState } from 'react';
import NavbarComponent from './NavbarComponent';
import CarouselComponent from './CarouselComponent';
import ButtonPrevComponent from './ButtonPrevComponent';
import ButtonNextComponent from './ButtonNextComponent';
import ButtonAddComponent from './ButtonAddComponent';
import ButtonCurrentMonthComponent from './ButtonCurrentMonthComponent';

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
          <ButtonPrevComponent onClick={handlePrev} />
          <ButtonAddComponent onClick={1} />
          <ButtonCurrentMonthComponent onClick={resetToCurrentMonth} />
          <ButtonNextComponent onClick={handleNext} />
        </div>

        <CarouselComponent currentMonth={currentMonth} />
      </div>
    </div>
  );
};

export default FijosScreen;
