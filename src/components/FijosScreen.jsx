import React, { useState } from 'react';
import NavbarComponent from './NavbarComponent';
import CarouselComponent from './CarouselComponent';

const FijosScreen = () => {
  const [viewMode, setViewMode] = useState('macro'); // Cambia entre 'actual' y 'macro'

  return (
    <div className="dark bg-gray-900 text-white min-h-screen">
      <NavbarComponent />
      <div className="relative p-4">
        {/* Botón "+ Agregar" alineado a la esquina superior izquierda */}
        <button className="absolute top-4 left-4 bg-blue-600 text-white rounded-full px-4 py-2">
          + Agregar
        </button>
        
        {/* Botones de Vista alineados a la esquina superior derecha */}
        <div className="absolute top-4 right-4 flex space-x-2">
          <button
            onClick={() => setViewMode('actual')}
            className={`px-4 py-2 rounded ${viewMode === 'actual' ? 'bg-blue-600' : 'bg-gray-700'}`}
          >
            Vista Actual
          </button>
          <button
            onClick={() => setViewMode('macro')}
            className={`px-4 py-2 rounded ${viewMode === 'macro' ? 'bg-blue-600' : 'bg-gray-700'}`}
          >
            Vista Macro
          </button>
        </div>

        {/* Render del carrusel */}
        {viewMode === 'macro' ? (
          <CarouselComponent />
        ) : (
          <div className="text-center mt-8">Vista Actual (pendiente)</div>
        )}
      </div>
    </div>
  );
};

export default FijosScreen;
