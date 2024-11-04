import React, { useState } from 'react';
import NavbarComponent from './NavbarComponent';
import CarouselComponent from './CarouselComponent';

const FijosScreen = () => {
  const [viewMode, setViewMode] = useState('actual'); // Cambia entre 'actual' y 'macro'

  return (
    <div>
      <NavbarComponent />
      <div className="p-4">
        <button className="btn btn-primary mb-4">+ Agregar</button>
        <div className="flex justify-around mb-4">
          <button onClick={() => setViewMode('actual')}>Mes actual</button>
          <button onClick={() => setViewMode('macro')}>Trimestre</button>
        </div>

        {viewMode === 'macro' ? (
          <CarouselComponent />
        ) : (
          <div>Vista Actual (pendiente)</div>
        )}
      </div>
    </div>
  );
};

export default FijosScreen;
