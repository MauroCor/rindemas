import React from 'react';
import NavbarComponent from '../components/NavbarComponent';
import ButtonComponent from '../components/ButtonComponent';
import DesplegableComponent from '../components/DesplegableComponent';

const AddScreen = () => {

  return (
    <div className="dark bg-gray-900 text-white min-h-screen">
      <NavbarComponent />
      <div className="flex justify-center items-center flex-wrap space-x-4 p-4">
        <ButtonComponent onClick={1} text="Ingreso" />
        <ButtonComponent onClick={1} text="Egreso" />
        <ButtonComponent onClick={1} text="Gasto con tarjeta" />
        <ButtonComponent onClick={1} text="Ahorro" />
      </div>

      <DesplegableComponent title="Name" />
    </div>
  );
};

export default AddScreen;
