import React, { useState } from 'react';
import ButtonComponent from '../components/ButtonComponent';
import DropComponent from '../components/DropComponent';
import InputPriceComponent from '../components/InputPriceComponent';
import MonthDropComponent from '../components/MonthDropComponent';
import OptionSelectorComponent from '../components/OptionSelectorComponent';
import { postFixedCost } from '../services/fixedCost';
import { postIncome } from '../services/income';

const AddScreen = () => {
  const [selectedOption, setSelectedOption] = useState('Ingreso');
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [desdeValue, setDesdeValue] = useState('');
  const [hastaValue, setHastaValue] = useState('');

  const handleSubmit = async () => {
    const data = {
      name,
      price: parseInt(price),
      date_from: desdeValue,
      date_to: hastaValue || null,
    };
    console.log(data)
    try {
      if (selectedOption === 'Egreso') {
        await postFixedCost(data);
      } else if (selectedOption === 'Ingreso') {
        await postIncome(data);
      }
      alert('Enviado correctamente');
    } catch (error) {
      alert('Error al enviar los datos');
    }
  };

  return (
    <div>
      <h1 className='font-bold text-center text-xl mt-2'>¿Qué deseas agregar?</h1>
      <div className="p-4">
        <OptionSelectorComponent selectedOption={selectedOption} setSelectedOption={setSelectedOption} />

        <div className="max-w-xs mx-auto space-y-4">
          {(selectedOption === 'Ingreso' || selectedOption === 'Egreso') && (
            <>
              <div className="flex flex-col">
                <label className="text-xs text-left mb-1 ml-10">Nombre</label>
                <DropComponent plhdr={selectedOption === 'Ingreso' ? 'Ej: Sueldo' : 'Ej: Alquiler'}
                  onChange={(e) => setName(e.target.value)}
                  type={selectedOption === 'Ingreso' ? 'income' : 'fixedCost'} />
              </div>

              <div className="flex flex-col">
                <label className="text-xs text-left mb-1 ml-10">Monto</label>
                <InputPriceComponent value={price} onChange={(e) => setPrice(e.target.value)} />
              </div>

              <div className="flex flex-col">
                <label className="text-xs text-left mb-1 ml-10">Desde</label>
                <MonthDropComponent type='Desde' value={desdeValue} onChange={setDesdeValue} />
              </div>

              <div className="flex flex-col">
                <label className="text-xs text-left mb-1 ml-10">Hasta (Opcional)</label>
                <MonthDropComponent type='Hasta' value={hastaValue} onChange={setHastaValue} />
              </div>
            </>
          )}

          {selectedOption === 'Tarjeta' && <h1>Muy pronto...</h1>}

          <div className="flex justify-center mt-4">
            <ButtonComponent onClick={handleSubmit} text="OK" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddScreen;
