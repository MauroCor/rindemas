import React, { useState } from 'react';
import CarouselComponent from '../components/CarouselComponent';
import ButtonComponent from '../components/ButtonComponent';
import { Link } from 'react-router-dom';

const FijosScreen = () => {
  const [currentMonth, setCurrentMonth] = useState(0);

  const handleNext = () => setCurrentMonth(currentMonth + 1);
  const handlePrev = () => setCurrentMonth(currentMonth - 1);

  const resetToCurrentMonth = () => setCurrentMonth(0);

  return (
    <div className="dark bg-gray-900 text-white min-h-screen">
      <div className="relative p-4">
        <div className="flex justify-center items-center flex-wrap space-x-2">
          <ButtonComponent onClick={handlePrev} text="<" />
          <Link className="bg-blue-600 rounded-full px-4 py-2 hover:bg-blue-500" to="/agregar">+ Agregar</Link>
          <ButtonComponent onClick={resetToCurrentMonth} text="Mes actual" />
          <ButtonComponent onClick={handleNext} text=">" />
        </div>

        <CarouselComponent currentMonth={currentMonth} />
      </div>
    </div>
  );
};

export default FijosScreen;
