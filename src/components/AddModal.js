import React, { useEffect, useState } from 'react';
import { useAddModal } from './AddModalContext';
import OptionSelectorComponent from './OptionSelectorComponent';
import DropComponent from './DropComponent';
import InputNumberComponent from './InputNumberComponent';
import MonthDropComponent from './MonthDropComponent';
import DropdownComponent from './DropdownComponent';
import InputComponent from './InputComponent';
import DropdownSavingComponent from './DropdownSavingComponent';
import InputPercentComponent from './InputPercentComponent';
import InputPriceComponent from './InputPriceComponent';
import InputQuantityComponent from './InputQuantityComponent';
import FixedIncomeCalculatorModal from './FixedIncomeCalculatorModal';
import SwitchComponent from './SwitchComponent';
import { postFixedCost, putFixedCost } from '../services/fixedCost';
import { postIncome, putIncome } from '../services/income';
import { postCardSpend } from '../services/cardSpend';
import { postSaving, putSaving } from '../services/saving';

const AddModal = () => {
  const { isOpen, closeAddModal, selectedOption } = useAddModal();
  const [tab, setTab] = useState('Ingreso');
  const [successMessage, setSuccessMessage] = useState('');

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [ccy, setCcy] = useState('ARS');
  const [invested, setInvested] = useState('');
  const [obtained, setObtained] = useState('');
  const [desdeValue, setDesdeValue] = useState('');
  const [hastaValue, setHastaValue] = useState('');
  const [cuotas, setCuotas] = useState('1');
  const [plazo, setPlazo] = useState('fijo');
  const [tna, setTna] = useState('');
  const [qty, setQty] = useState('');
  const [cripto, setCripto] = useState(false);
  const [showCalc, setShowCalc] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  

  useEffect(() => {
    if (isOpen) {
      setTab(selectedOption || 'Ingreso');
    }
  }, [isOpen, selectedOption]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const iconFor = (t) => (t === 'Ingreso' ? '💸' : t === 'Egreso' ? '🧾' : t === 'Tarjeta' ? '💳' : '📈');
  const titleFor = (t) => (t === 'Tarjeta' ? 'Agregar gasto con tarjeta' : `Agregar ${t}`);

  const validate = () => {
    const has = (v) => v !== '' && v !== null && v !== undefined;
    if (tab === 'Ingreso' || tab === 'Egreso') {
      return has(name) && has(price) && has(desdeValue) && (hastaValue === '' || hastaValue >= desdeValue);
    }
    if (tab === 'Tarjeta') {
      return has(name) && has(price) && has(cuotas) && has(desdeValue);
    }
    // Ahorro
    if (plazo === 'fijo') {
      return has(name) && has(invested) && has(obtained) && has(desdeValue) && (hastaValue === '' || hastaValue >= desdeValue);
    }
    if (plazo === 'flex') {
      return has(name) && has(invested) && has(tna) && has(desdeValue) && (hastaValue === '' || hastaValue >= desdeValue);
    }
    // var
    return has(name) && has(invested) && has(qty) && has(desdeValue);
  };

  if (!isOpen) return null;

  const onClose = () => {
    setName(''); 
    setPrice(''); 
    setCcy('ARS'); 
    setInvested(''); 
    setObtained(''); 
    setDesdeValue(''); 
    setHastaValue(''); 
    setCuotas('1'); 
    setTna(''); 
    setQty(''); 
    setCripto(false);
    setPlazo('fijo');
    setShowCalc(false);
    closeAddModal();
  };

  const handleSubmit = async (keepOpen = false) => {
    let data = {};
    let isUpdate = false;
    let sectionName = '';
    
    try {
      switch (tab) {
        case 'Egreso':
          data = { name, price: parseInt(price), ccy, date_from: desdeValue, date_to: hastaValue || null };
          if (data.date_to < data.date_from) { alert('Error: La fecha fin debe ser mayor a la fecha inicio.'); return; }
          sectionName = 'Egresos';
          try { await postFixedCost(data); } catch { await putFixedCost(data); isUpdate = true; }
          break;
        case 'Ingreso':
          data = { name, price: parseInt(price), ccy, date_from: desdeValue, date_to: hastaValue || null };
          if (data.date_to < data.date_from) { alert('Error: La fecha fin debe ser mayor a la fecha inicio.'); return; }
          sectionName = 'Ingresos';
          try { await postIncome(data); } catch { await putIncome(data); isUpdate = true; }
          break;
        case 'Tarjeta':
          data = { name, price: parseInt(price), fees: parseInt(cuotas), date_from: desdeValue };
          sectionName = 'Tarjeta';
          await postCardSpend(data);
          break;
        case 'Ahorro':
          data = {
            name,
            type: plazo,
            invested: parseInt(invested),
            ccy: plazo === 'var' ? 'USD' : ccy,
            obtained: parseInt(obtained),
            date_from: desdeValue,
            date_to: hastaValue === '' ? null : hastaValue,
            tna: parseFloat(tna),
            qty,
            crypto: cripto
          };
          sectionName = 'Ahorros';
          try { await postSaving(data); }
          catch { if (data.type !== 'fijo') { await putSaving(data); isUpdate = true; } else { console.error('Error creando ahorro fijo'); } }
          break;
        default:
          throw new Error('Opción no válida');
      }
      
      // Mostrar mensaje de éxito
      const action = isUpdate ? 'actualizado' : 'agregado';
      setSuccessMessage(`${name} fue ${action} en ${sectionName}`);
      setTimeout(() => setSuccessMessage(''), 3000);
      // Notificar a la app para refrescar datos sin F5
      try {
        window.dispatchEvent(new CustomEvent('app:data-updated', { detail: { sectionName } }));
      } catch (e) {
        // noop
      }
      
      // Limpiar campos pero NO cerrar modal
      setName(''); setPrice(''); setCcy('ARS'); setInvested(''); setObtained(''); setDesdeValue(''); setHastaValue(''); setCuotas('1'); setTna(''); setQty(''); setCripto(false);
      
    } catch (error) {
      console.error('Error al enviar los datos:', error);
      alert('Error: Revise los datos ingresados 🧐');
    }
  };

  return (
    <div className="fixed inset-0 z-40">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="absolute inset-0 flex items-start justify-center pt-12 px-4">
        <div className="flex items-start gap-3">
          <div className="w-full max-w-2xl rounded-2xl shadow-2xl" style={{ background: '#0F172A', color: '#F3F4F6', border: '1px solid #1F2937' }}>
          <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: '#1F2937' }}>
            <div className="flex items-center gap-2">
              <span className="text-xl" aria-hidden>{iconFor(tab)}</span>
              <div>
                <h3 className="text-lg font-semibold">{titleFor(tab)}</h3>
              </div>
            </div>
          </div>

          <div className="px-6 py-5 space-y-4">
            {successMessage && (
              <div className="bg-green-600 text-white px-4 py-2 rounded-lg text-center">
                {successMessage}
              </div>
            )}
            <div className="p-0 flex items-center gap-2">
              <OptionSelectorComponent selectedOption={tab} setSelectedOption={setTab} />
            </div>

            {(tab === 'Ingreso' || tab === 'Egreso') && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex flex-col">
                    <label className="text-sm text-left mb-1 ml-11" style={{color:'#FFFFFF'}}>Nombre</label>
                    <DropComponent plhdr={tab === 'Ingreso' ? 'Ej: Sueldo' : 'Ej: Alquiler'} onChange={(e) => setName(e.target.value)} value={name} type={tab === 'Ingreso' ? 'income' : 'fixedCost'} />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm text-left mb-1 ml-11" style={{color:'#FFFFFF'}}>Monto</label>
                    <InputPriceComponent value={price} onChange={(e) => setPrice(e.target.value)} currency={ccy} onCurrencyChange={(e) => setCcy(e.target.value)} compactCurrency={true} />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm text-left mb-1 ml-11" style={{color:'#FFFFFF'}}>Desde</label>
                    <MonthDropComponent type='Desde' value={desdeValue} onChange={setDesdeValue} />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm text-left mb-1 ml-11" style={{color:'#FFFFFF'}}>Hasta (Opcional)</label>
                    <MonthDropComponent type='Hasta' value={hastaValue} onChange={setHastaValue} />
                  </div>
                </div>
              </>
            )}

            {tab === 'Tarjeta' && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <InputComponent name="Nombre" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej: Heladera" />
                  <div className="flex flex-col">
                    <label className="text-sm text-left mb-1 ml-11" style={{color:'#FFFFFF'}}>Monto</label>
                    <InputNumberComponent value={price} onChange={(e) => setPrice(e.target.value)} />
                  </div>
                  <DropdownComponent value={cuotas} onChange={(e) => setCuotas(e.target.value)} />
                  <div className="flex flex-col">
                    <label className="text-sm text-left mb-1 ml-11" style={{color:'#FFFFFF'}}>Desde</label>
                    <MonthDropComponent type='DesdeTarj' value={desdeValue} onChange={setDesdeValue} />
                  </div>
                </div>
              </>
            )}

            {tab === 'Ahorro' && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <DropdownSavingComponent value={plazo} onChange={(e) => setPlazo(e.target.value)} />
                  {plazo === 'var' ? (
                    <div className="flex flex-col">
                      <label className="text-sm text-left mb-1 ml-11" style={{color:'#FFFFFF'}}>¿Criptomoneda?</label>
                      <div className='flex justify-center'>
                        <SwitchComponent value={cripto} onToggle={setCripto} optionA="NO" optionB="SÍ" />
                      </div>
                    </div>
                  ) : (
                    <InputComponent 
                      name="Nombre" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)} 
                      placeholder={plazo === 'fijo' ? "Ej: Lecap" : plazo === 'flex' ? "Ej: Staking" : "Ej: Nombre"} 
                    />
                  )}
                </div>
                {plazo === 'fijo' && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="flex flex-col">
                        <label className="text-sm text-left mb-1 ml-11" style={{color:'#FFFFFF'}}>Monto inicial</label>
                        <InputPriceComponent value={invested} onChange={(e) => setInvested(e.target.value)} currency={ccy} onCurrencyChange={(e) => setCcy(e.target.value)} compactCurrency={true} />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm text-left mb-1 ml-11" style={{color:'#FFFFFF'}}>Monto final</label>
                        <InputPriceComponent 
                          value={obtained} 
                          onChange={(e) => setObtained(e.target.value)} 
                          currency={ccy} 
                          onCurrencyChange={(e) => setCcy(e.target.value)} 
                          appendButton={true}
                          appendContent={'📟'}
                          onAppendClick={() => setShowCalc(true)}
                          compactCurrency={true}
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm text-left mb-1 ml-11" style={{color:'#FFFFFF'}}>Desde</label>
                        <MonthDropComponent type='Desde' value={desdeValue} onChange={setDesdeValue} />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm text-left mb-1 ml-11" style={{color:'#FFFFFF'}}>Hasta (Opcional)</label>
                        <MonthDropComponent type='Hasta' value={hastaValue} onChange={setHastaValue} />
                      </div>
                    </div>
                  </>
                )}
                {plazo === 'flex' && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="flex flex-col">
                        <label className="text-sm text-left mb-1 ml-11" style={{color:'#FFFFFF'}}>Monto inicial</label>
                        <InputPriceComponent value={invested} onChange={(e) => setInvested(e.target.value)} currency={ccy} onCurrencyChange={(e) => setCcy(e.target.value)} compactCurrency={true} />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm text-left mb-1 ml-11" style={{color:'#FFFFFF'}}>TNA</label>
                        <InputPercentComponent value={tna} onChange={(e) => setTna(e.target.value)} />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm text-left mb-1 ml-11" style={{color:'#FFFFFF'}}>Desde</label>
                        <MonthDropComponent type='Desde' value={desdeValue} onChange={setDesdeValue} />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm text-left mb-1 ml-11" style={{color:'#FFFFFF'}}>Hasta (Opcional)</label>
                        <MonthDropComponent type='Hasta' value={hastaValue} onChange={setHastaValue} />
                      </div>
                    </div>
                  </>
                )}
                {plazo === 'var' && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="flex flex-col">
                        <label className="text-sm text-left mb-1 ml-11" style={{color:'#FFFFFF'}}>Ticker</label>
                        <DropComponent plhdr="Ej: AAPL" onChange={(e) => setName(e.target.value)} value={name} cripto={cripto} type='savingVar' />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm text-left mb-1 ml-11" style={{color:'#FFFFFF'}}>Monto</label>
                        <InputNumberComponent value={invested} onChange={(e) => setInvested(e.target.value)} placeholder='Ej: u$s 350' />
                        <p className='text-[12px] text-center !-mt-1' style={{ color: '#9CA3AF' }}>Monto en dólares (USDT).</p>
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm text-left mb-1 ml-11" style={{color:'#FFFFFF'}}>Cantidad</label>
                        <InputQuantityComponent value={qty} onChange={(e) => setQty(e.target.value)} />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm text-left mb-1 ml-11" style={{color:'#FFFFFF'}}>Desde</label>
                        <MonthDropComponent type='Desde' value={desdeValue} onChange={setDesdeValue} />
                      </div>
                    </div>
                  </>
                )}
              </>
            )}
          </div>

          <div className="flex justify-end gap-2 px-6 py-4 border-t" style={{ borderColor: '#1F2937' }}>
            <button onClick={onClose} className="px-3 py-2 rounded hover:bg-gray-700">Cerrar</button>
            <button onClick={() => handleSubmit(false)} disabled={!validate()} className="px-3 py-2 rounded text-white" style={{ background: '#14B8A6', opacity: validate()?1:0.6 }}>Guardar</button>
          </div>
          </div>
          {showCalc && tab === 'Ahorro' && plazo === 'fijo' && (
            <FixedIncomeCalculatorModal
              isOpen={true}
              onClose={() => setShowCalc(false)}
              initialAmount={invested || ''}
              onApply={(finalAmount) => setObtained(String(finalAmount))}
              inline={!isMobile}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AddModal;


