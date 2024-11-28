import React, { useState } from 'react';
import ButtonComponent from '../components/ButtonComponent';
import DropComponent from '../components/DropComponent';
import InputNumberComponent from '../components/InputNumberComponent';
import MonthDropComponent from '../components/MonthDropComponent';
import OptionSelectorComponent from '../components/OptionSelectorComponent';
import { postFixedCost, putFixedCost } from '../services/fixedCost';
import { postIncome, putIncome } from '../services/income';
import { postCardSpend } from '../services/cardSpend';
import { postSaving } from '../services/saving';
import DropdownComponent from '../components/DropdownComponent';
import InputComponent from '../components/InputComponent';
import DropdownSavingComponent from '../components/DropdownSavingComponent';
import InputPercentComponent from '../components/InputPercentComponent';

const AddScreen = () => {
  const [selectedOption, setSelectedOption] = useState('Tarjeta');
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [invested, setInvested] = useState('');
  const [obtained, setObtained] = useState('');
  const [desdeValue, setDesdeValue] = useState('');
  const [hastaValue, setHastaValue] = useState('');
  const [cuotas, setCuotas] = useState('1');
  const [plazo, setPlazo] = useState('fijo');
  const [tna, setTna] = useState('');
  const [qty, setQty] = useState('');

  const handleSubmit = async () => {
    let data = {};
    try {
      switch (selectedOption) {
        case 'Egreso':
          data = {
            name,
            price: parseInt(price),
            date_from: desdeValue,
            date_to: hastaValue || null,
          };

          if (data.date_to < data.date_from) {
            alert('Error: La fecha fin debe ser mayor a la fecha inicio.');
          } else {
            try {
              await postFixedCost(data);
              setName('');
              setPrice('');
              const formattedDate = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`;
              setDesdeValue(formattedDate);
              setHastaValue('');
              alert(`Egreso agregado (${data.name}) ✔️`);
            } catch {
              await putFixedCost(data);
              setName('');
              setPrice('');
              const formattedDate = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`;
              setDesdeValue(formattedDate);
              setHastaValue('');
              alert(`Egreso actualizado (${data.name}) ✔️`);
            }
          }
          break;
        case 'Ingreso':
          data = {
            name,
            price: parseInt(price),
            date_from: desdeValue,
            date_to: hastaValue || null,
          };
          if (data.date_to < data.date_from) {
            alert('Error: La fecha fin debe ser mayor a la fecha inicio.');
          } else {
            try {
              await postIncome(data);
              setName('');
              setPrice('');
              const formattedDate = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`;
              setDesdeValue(formattedDate);
              setHastaValue('');
              alert(`Ingreso agregado (${data.name}) ✔️`);
            } catch {
              await putIncome(data);
              setName('');
              setPrice('');
              const formattedDate = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`;
              setDesdeValue(formattedDate);
              setHastaValue('');
              alert(`Ingreso actualizado (${data.name}) ✔️`);
            }
          }
          break;
        case 'Tarjeta':
          data = {
            name,
            price: parseInt(price),
            fees: parseInt(cuotas),
            date_from: desdeValue,
          };
          await postCardSpend(data);
          setName('');
          setPrice('');
          setCuotas('1');
          const formattedDate = `${new Date().getFullYear()}-${String(new Date().getMonth() + 2).padStart(2, '0')}`;
          setDesdeValue(formattedDate);
          alert(`Gasto de tarjeta agregado (${data.name}) ✔️`);
          break;
        case 'Ahorro':
          data = {
            name,
            type: plazo,
            invested: parseInt(invested),
            obtained: parseInt(obtained),
            date_from: desdeValue,
            date_to: hastaValue === "" ? null : hastaValue,
            tna: parseFloat(tna),
            qty
          };
          await postSaving(data);
          setName('');
          setPlazo('fijo');
          setTna('');
          setQty('');
          setInvested('');
          setObtained('');
          const fdate = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`;
          setDesdeValue(fdate);
          setHastaValue('');
          alert(`Ahorro agregado (${data.name}) ✔️`);
          break;
        default:
          throw new Error("Opción no válida");
      }
    } catch (error) {
      console.error("Error al enviar los datos:", error);
      alert('Error: Revise los datos ingresados.');
    }
  };

  return (
    <div className='min-h-screen bg-gray-900 py-8'>
      <h1 className='font-bold text-center text-xl mt-8 text-white'>¿Qué deseas agregar?</h1>
      <div className="p-4">
        <OptionSelectorComponent selectedOption={selectedOption} setSelectedOption={setSelectedOption} />

        <div className="max-w-xs mx-auto space-y-4">
          {(selectedOption === 'Ingreso' || selectedOption === 'Egreso') && (
            <>
              <h3 className="text-center mt-2 text-sm text-gray-300">
                Agrega o modifica un <span className='font-bold text-white'>{selectedOption.toLowerCase()}</span> por su nombre.</h3>
              <div className="flex flex-col">
                <label className="text-xs text-left mb-1 ml-11 text-white">Nombre</label>
                <DropComponent plhdr={selectedOption === 'Ingreso' ? 'Ej: Sueldo' : 'Ej: Alquiler'}
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  type={selectedOption === 'Ingreso' ? 'income' : 'fixedCost'} />
              </div>

              <div className="flex flex-col">
                <label className="text-xs text-left mb-1 ml-11 text-white">Monto</label>
                <InputNumberComponent value={price} onChange={(e) => setPrice(e.target.value)} />
              </div>

              <div className="flex flex-col">
                <label className="text-xs text-left mb-1 ml-11 text-white">Desde</label>
                <MonthDropComponent type='Desde' value={desdeValue} onChange={setDesdeValue} />
              </div>

              <div className="flex flex-col">
                <label className="text-xs text-left mb-1 ml-11 text-white">Hasta (Opcional)</label>
                <MonthDropComponent type='Hasta' value={hastaValue} onChange={setHastaValue} />
              </div>
            </>
          )}

          {selectedOption === 'Tarjeta' && (
            <>
              <h3 className="text-center mt-2 text-sm text-gray-300">Agrega un gasto de <span className='font-bold text-white'>tarjeta</span>.</h3>

              <InputComponent
                name="Nombre"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej: Heladera"
              />

              <div className="flex flex-col">
                <label className="text-xs text-left mb-1 ml-11 text-white">Monto</label>
                <InputNumberComponent value={price} onChange={(e) => setPrice(e.target.value)} />
              </div>

              <DropdownComponent value={cuotas} onChange={(e) => setCuotas(e.target.value)} />

              <div className="flex flex-col">
                <label className="text-xs text-left mb-1 ml-11 text-white">Desde</label>
                <MonthDropComponent type='DesdeTarj' value={desdeValue} onChange={setDesdeValue} />
              </div>
            </>
          )}

          {selectedOption === 'Ahorro' && (
            <>
              <h3 className="text-center mt-2 text-sm text-gray-300">Agrega un <span className='font-bold text-white'>ahorro</span> para invertir.</h3>

              <DropdownSavingComponent value={plazo} onChange={(e) => setPlazo(e.target.value)} />

              {plazo === 'fijo' && (
                <>
                  <p className='text-blue-400 text-[12px] text-center !mt-1'>Interés simple (plazo fijo, bono).</p>

                  <InputComponent
                    name="Nombre"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej: Lecap"
                  />

                  <div className="flex flex-col">
                    <label className="text-xs text-left mb-1 ml-11 text-white">Monto inicial</label>
                    <InputNumberComponent value={invested} onChange={(e) => setInvested(e.target.value)} />
                  </div>

                  <div className="flex flex-col">
                    <label className="text-xs text-left mb-1 ml-11 text-white">Monto final</label>
                    <InputNumberComponent value={obtained} onChange={(e) => setObtained(e.target.value)}
                      placeholder={"Ej: $400.000"} />
                  </div>

                  <div className="flex flex-col">
                    <label className="text-xs text-left mb-1 ml-11 text-white">Desde</label>
                    <MonthDropComponent type='Desde' value={desdeValue} onChange={setDesdeValue} />
                  </div>

                  <div className="flex flex-col">
                    <label className="text-xs text-left mb-1 ml-11 text-white">Hasta (Opcional)</label>
                    <MonthDropComponent type='Hasta' value={hastaValue} onChange={setHastaValue} />
                  </div>
                </>
              )}

              {plazo === 'flex' && (
                <>

                  <p className='text-blue-400 text-[12px] text-center !mt-1'>Interés compuesto (staking, billetera virtual).</p>

                  <InputComponent
                    name="Nombre"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej: Staking"
                  />

                  <div className="flex flex-col">
                    <label className="text-xs text-left mb-1 ml-11 text-white">Monto inicial</label>
                    <InputNumberComponent value={invested} onChange={(e) => setInvested(e.target.value)} />
                  </div>

                  <div className="flex flex-col">
                    <label className="text-xs text-left mb-1 ml-11 text-white">TNA</label>
                    <InputPercentComponent value={tna} onChange={(e) => setTna(e.target.value)}/>
                  </div>

                  <div className="flex flex-col">
                    <label className="text-xs text-left mb-1 ml-11 text-white">Desde</label>
                    <MonthDropComponent type='Desde' value={desdeValue} onChange={setDesdeValue} />
                  </div>

                  <div className="flex flex-col">
                    <label className="text-xs text-left mb-1 ml-11 text-white">Hasta (Opcional)</label>
                    <MonthDropComponent type='Hasta' value={hastaValue} onChange={setHastaValue} />
                  </div>
                </>
              )}

              {plazo === 'var' && (
                <>

                  <p className='text-blue-400 text-[12px] text-center !mt-1'>Interés variable (acciones, cedears, etfs).</p>

                  <InputComponent
                    name="Ticker"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej: AAPL"
                  />

                  <div className="flex flex-col">
                    <label className="text-xs text-left mb-1 ml-11 text-white">Monto</label>
                    <InputNumberComponent value={invested} onChange={(e) => setInvested(e.target.value)} />
                  </div>

                  <div className="flex flex-col">
                    <label className="text-xs text-left mb-1 ml-11 text-white">Cantidad</label>
                    <InputNumberComponent value={qty} onChange={(e) => setQty(e.target.value)}
                      placeholder={"Ej: 10 valores"} />
                  </div>

                  <div className="flex flex-col">
                    <label className="text-xs text-left mb-1 ml-11 text-white">Desde</label>
                    <MonthDropComponent type='Desde' value={desdeValue} onChange={setDesdeValue} />
                  </div>
                </>
              )}

            </>
          )}

          <div className="flex justify-center mt-4">
            <ButtonComponent onClick={handleSubmit} text="OK" className='text-white bg-blue-600 rounded-full hover:bg-blue-500 px-2 py-1' />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddScreen;
