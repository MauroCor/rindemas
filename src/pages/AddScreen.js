import React, { useState } from 'react';
import ButtonComponent from '../components/ButtonComponent';
import DropComponent from '../components/DropComponent';
import InputPriceComponent from '../components/InputPriceComponent';
import MonthDropComponent from '../components/MonthDropComponent';
import OptionSelectorComponent from '../components/OptionSelectorComponent';


const AddScreen = () => {
  const [selectedOption, setSelectedOption] = useState('Ingreso');
  const [desdeValue, setDesdeValue] = useState();

  return (
    <div>
      <h1 className='font-bold text-center text-xl mt-2'>¿Qué deseas agregar?</h1>
      <div className="p-4">
        <OptionSelectorComponent selectedOption={selectedOption} setSelectedOption={setSelectedOption} />

        <div className="max-w-xs mx-auto space-y-4">

          {selectedOption === 'Ingreso' && (
            <>
              <div className="flex flex-col">
                <label className="text-xs text-left mb-1 ml-10">Nombre</label>
                <DropComponent plhdr='Ej: Sueldo' />
              </div>
            </>
          )}

          {selectedOption === 'Egreso' && (
            <>
              <div className="flex flex-col">
                <label className="text-xs text-left mb-1 ml-10">Nombre</label>
                <DropComponent plhdr='Ej: Alquiler' />
              </div>
            </>
          )}
          {selectedOption != 'Tarjeta' && (
            <>
              <div className="flex flex-col">
                <label className="text-xs text-left mb-1 ml-10">Monto</label>
                <InputPriceComponent />
              </div>
              <div className="flex flex-col">
                <label className="text-xs text-left mb-1 ml-10">Desde</label>
                <MonthDropComponent type="Desde" value={desdeValue} onChange={setDesdeValue} />
              </div>
              <div className="flex flex-col">
                <label className="text-xs text-left mb-1 ml-10">Hasta (Opcional)</label>
                <MonthDropComponent />
              </div>
            </>
          )}

          {selectedOption === 'Tarjeta' && (
            <h1>Muy pronto...</h1>
          )}

          <div className="flex justify-center mt-4">
            <ButtonComponent onClick={1} text="OK" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddScreen;