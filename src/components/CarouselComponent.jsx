import React from 'react';
import MonthlyDataComponent from './MonthlyDataComponent';

const CarouselComponent = ({ currentMonth }) => {
  return (
    <div className="relative flex justify-center items-center mt-16 space-x-4">
      <div className="flex space-x-4">
        <MonthlyDataComponent month={currentMonth - 1} />
        <MonthlyDataComponent month={currentMonth} />
        <MonthlyDataComponent month={currentMonth + 1} />
      </div>
    </div>
  );
};

export default CarouselComponent;
