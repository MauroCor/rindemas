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
import FixedIncomeCalculatorModal from './FixedIncomeCalculatorModal';
import SwitchComponent from './SwitchComponent';
import { postFixedCost } from '../services/fixedCost';
import { postIncome } from '../services/income';
import { postCardSpend } from '../services/cardSpend';
import { postSaving } from '../services/saving';
import { handleApiError } from '../utils/errorHandler';
import { MODAL_STYLES, MODAL_BORDER_STYLES, LABEL_STYLES, TEXT_COLORS } from '../utils/styles';
import { useForm } from '../hooks/useForm';
import { useNumberFormat } from '../hooks/useNumberFormat';

const Label = ({ children, className = "text-sm text-center mb-1" }) => (
  <label className={className} style={LABEL_STYLES}>{children}</label>
);

const AddModal = () => {
  const { isOpen, closeAddModal, selectedOption } = useAddModal();
  const [tab, setTab] = useState('Ingreso');
  const [successMessage, setSuccessMessage] = useState('');
  const [showCalc, setShowCalc] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [varQuote, setVarQuote] = useState(null);
  const [backendError, setBackendError] = useState('');

  const { values, setValue, reset: resetForm } = useForm({
    name: '',
    price: '',
    ccy: 'ARS',
    invested: '',
    obtained: '',
    desdeValue: '',
    hastaValue: '',
    cuotas: '1',
    plazo: 'fijo',
    tna: '',
    qty: '',
    cripto: false,
    projection: false
  });

  const { cleanNumberInput } = useNumberFormat();
  

  useEffect(() => {
    if (isOpen) {
      setTab(selectedOption || 'Ingreso');
    }
  }, [isOpen, selectedOption]);

  // Al cambiar de sección (tab) limpiamos el error de backend mostrado
  useEffect(() => {
    setBackendError('');
  }, [tab]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const extractQuoteFromDom = () => {
    try {
      const paragraphs = Array.from(document.querySelectorAll('p'));
      for (const p of paragraphs) {
        const txt = (p.textContent || '').trim();
        if (/\(.+\/USDT\)\s*-\s*U\$S\s*/i.test(txt)) {
          const numStr = txt.replace(/.*U\$S\s*/, '').replace(/[^0-9.,]/g, '');
          const normalized = numStr.replace(/\./g, '').replace(',', '.');
          const val = Number(normalized);
          if (!Number.isNaN(val) && val > 0) {
            setVarQuote(val);
            return;
          }
        }
      }
      setVarQuote(null);
    } catch (_) {
      // noop
    }
  };

  useEffect(() => {
    if (tab === 'Ahorro' && values.plazo === 'var') {
      const t = setTimeout(extractQuoteFromDom, 150);
      return () => clearTimeout(t);
    } else {
      setVarQuote(null);
    }
  }, [tab, values.plazo, values.name]);

  useEffect(() => {
    if (!(tab === 'Ahorro' && values.plazo === 'var')) return;
    const observer = new MutationObserver(() => {
      extractQuoteFromDom();
    });
    try {
      observer.observe(document.body, { childList: true, subtree: true });
    } catch (_) {}
    return () => {
      try { observer.disconnect(); } catch (_) {}
    };
  }, [tab, values.plazo]);

  const iconFor = (t) => (t === 'Ingreso' ? '💰' : t === 'Egreso' ? '🧾' : t === 'Tarjeta' ? '💳' : '📈');
  const titleFor = (t) => (t === 'Tarjeta' ? 'Agregar gasto con tarjeta' : `Agregar ${t}`);

  const validate = () => {
    const has = (v) => v !== '' && v !== null && v !== undefined;
    if (tab === 'Ingreso' || tab === 'Egreso') {
      return has(values.name) && has(values.price) && has(values.desdeValue) && (values.hastaValue === '' || values.hastaValue >= values.desdeValue);
    }
    if (tab === 'Tarjeta') {
      return has(values.name) && has(values.price) && has(values.cuotas) && has(values.desdeValue);
    }
    if (values.plazo === 'fijo') {
      return has(values.name) && has(values.invested) && has(values.obtained) && has(values.desdeValue) && (values.hastaValue === '' || values.hastaValue >= values.desdeValue);
    }
    if (values.plazo === 'flex') {
      return has(values.name) && has(values.invested) && has(values.tna) && has(values.desdeValue) && (values.hastaValue === '' || values.hastaValue >= values.desdeValue);
    }
    if (values.plazo === 'plan') {
      return has(values.name) && has(values.obtained) && has(values.desdeValue) && (values.hastaValue === '' || values.hastaValue >= values.desdeValue);
    }
    return has(values.name) && has(values.invested) && has(values.qty) && has(values.desdeValue);
  };

  if (!isOpen) return null;

  const onClose = () => {
    resetForm();
    setShowCalc(false);
    setBackendError('');
    closeAddModal();
  };

  const resetFormForIngresoEgreso = () => {
    setValue('name', '');
    setValue('price', '');
    setValue('ccy', 'ARS');
  };

  const handleSubmit = async () => {
    let data = {};
    let sectionName = '';
    
    try {
      switch (tab) {
        case 'Egreso':
          data = { name: values.name, price: parseInt(values.price), ccy: values.ccy, date_from: values.desdeValue, date_to: values.hastaValue || null };
          sectionName = 'Egresos';
          await postFixedCost(data);
          break;
        case 'Ingreso':
          data = { name: values.name, price: parseInt(values.price), ccy: values.ccy, date_from: values.desdeValue, date_to: values.hastaValue || null };
          sectionName = 'Ingresos';
          await postIncome(data);
          break;
        case 'Tarjeta':
          data = { name: values.name, price: parseInt(values.price), fees: parseInt(values.cuotas), date_from: values.desdeValue };
          sectionName = 'Tarjeta';
          await postCardSpend(data);
          break;
        case 'Ahorro':
          data = {
            name: values.name,
            type: values.plazo,
            invested: values.plazo === 'plan' ? 0 : parseInt(values.invested),
            ccy: values.plazo === 'var' ? 'USD' : values.ccy,
            obtained: parseInt(values.obtained),
            date_from: values.desdeValue,
            date_to: values.hastaValue === '' ? null : values.hastaValue,
            tna: values.plazo === 'plan' ? 0 : parseFloat(values.tna),
            qty: values.plazo === 'var' ? (values.qty === '' ? '' : Number(values.qty)) : values.qty,
            crypto: values.plazo === 'plan' ? false : values.cripto,
            projection: values.projection
          };
          sectionName = 'Ahorros';
          await postSaving(data);
          break;
        default:
          throw new Error('Opción no válida');
      }
      
      setSuccessMessage(`${values.name} fue agregado en ${sectionName}.`);
      setTimeout(() => setSuccessMessage(''), 3000);
      
      try {
        window.dispatchEvent(new CustomEvent('app:data-updated', { detail: { sectionName } }));
      } catch (e) {
        // noop
      }
      
      if (tab === 'Ingreso' || tab === 'Egreso') {
        resetFormForIngresoEgreso();
      } else {
        resetForm();
      }
      
    } catch (error) {
      const msg = handleApiError(error, 'handleSubmit');
      setBackendError(msg || 'Ocurrió un error');
    }
  };

  return (
    <div className="fixed inset-0 z-40">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="absolute inset-0 flex items-start justify-center pt-4 pb-4 px-4 overflow-y-auto">
        <div className="flex items-start gap-3 my-4">
          <div className="w-full max-w-2xl rounded-2xl shadow-2xl" style={MODAL_STYLES}>
          <div className="flex items-center justify-center px-6 py-4 border-b" style={MODAL_BORDER_STYLES}>
            <div className="flex items-center gap-2">
              <span className="text-xl" aria-hidden>{iconFor(tab)}</span>
              <div>
                <h3 className="text-lg font-semibold">{titleFor(tab)}</h3>
              </div>
            </div>
          </div>

          <div className="px-6 py-5 space-y-4 max-h-[60vh] md:max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
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
                    <Label>Nombre</Label>
                    <DropComponent plhdr={tab === 'Ingreso' ? 'Ej: Sueldo' : 'Ej: Alquiler'} onChange={(e) => setValue('name', e.target.value)} value={values.name} type={tab === 'Ingreso' ? 'income' : 'fixedCost'} />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm text-center mb-1" style={{color:'#FFFFFF'}}>Monto</label>
                    <InputPriceComponent value={values.price} onChange={(e) => setValue('price', e.target.value)} currency={values.ccy} onCurrencyChange={(e) => setValue('ccy', e.target.value)} compactCurrency={true} />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm text-center mb-1" style={{color:'#FFFFFF'}}>Desde</label>
                    <MonthDropComponent type='Desde' value={values.desdeValue} onChange={(value) => setValue('desdeValue', value)} />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm text-center mb-1" style={{color:'#FFFFFF'}}>Hasta</label>
                    <MonthDropComponent type='Hasta' value={values.hastaValue} onChange={(value) => setValue('hastaValue', value)} />
                  </div>
                </div>
              </>
            )}

            {tab === 'Tarjeta' && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <InputComponent name="Nombre" value={values.name} onChange={(e) => setValue('name', e.target.value)} placeholder="Ej: Heladera" />
                  <div className="flex flex-col">
                    <label className="text-sm text-center mb-1" style={{color:'#FFFFFF'}}>Monto</label>
                    <InputNumberComponent value={values.price} onChange={(e) => setValue('price', e.target.value)} />
                  </div>
                  <DropdownComponent value={values.cuotas} onChange={(e) => setValue('cuotas', e.target.value)} />
                  <div className="flex flex-col">
                    <label className="text-sm text-center mb-1" style={{color:'#FFFFFF'}}>Desde</label>
                    <MonthDropComponent type='DesdeTarj' value={values.desdeValue} onChange={(value) => setValue('desdeValue', value)} />
                  </div>
                </div>
              </>
            )}

            {tab === 'Ahorro' && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <DropdownSavingComponent value={values.plazo} onChange={(e) => setValue('plazo', e.target.value)} />
                  {values.plazo === 'var' ? (
                    <div className="flex flex-col">
                      <label className="text-sm text-center mb-1" style={{color:'#FFFFFF'}}>¿Criptomoneda?</label>
                      <div className='flex justify-center'>
                        <SwitchComponent value={values.cripto} onToggle={(value) => setValue('cripto', value)} optionA="NO" optionB="SÍ" />
                      </div>
                    </div>
                  ) : (
                    <InputComponent 
                      name="Nombre" 
                      value={values.name} 
                      onChange={(e) => setValue('name', e.target.value)} 
                      placeholder={values.plazo === 'fijo' ? "Ej: Lecap" : values.plazo === 'flex' ? "Ej: Staking" : values.plazo === 'plan' ? "Ej: Plan Casa" : "Ej: Nombre"} 
                    />
                  )}
                </div>
                {values.plazo === 'fijo' && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="flex flex-col">
                        <label className="text-sm text-center mb-1" style={{color:'#FFFFFF'}}>Monto inicial</label>
                        <InputPriceComponent value={values.invested} onChange={(e) => setValue('invested', e.target.value)} currency={values.ccy} onCurrencyChange={(e) => setValue('ccy', e.target.value)} compactCurrency={true} />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm text-center mb-1" style={{color:'#FFFFFF'}}>Monto final</label>
                        <InputPriceComponent 
                          value={values.obtained} 
                          onChange={(e) => setValue('obtained', e.target.value)} 
                          currency={values.ccy} 
                          onCurrencyChange={(e) => setValue('ccy', e.target.value)} 
                          appendButton={true}
                          appendContent={'📟'}
                          onAppendClick={() => setShowCalc(true)}
                          compactCurrency={true}
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm text-center mb-1" style={{color:'#FFFFFF'}}>Desde</label>
                        <MonthDropComponent type='Desde' value={values.desdeValue} onChange={(value) => setValue('desdeValue', value)} />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm text-center mb-1" style={{color:'#FFFFFF'}}>Hasta</label>
                        <MonthDropComponent type='Hasta' value={values.hastaValue} onChange={(value) => setValue('hastaValue', value)} />
                      </div>
                    </div>
                  </>
                )}
                {values.plazo === 'flex' && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="flex flex-col">
                        <label className="text-sm text-center mb-1" style={{color:'#FFFFFF'}}>Monto inicial</label>
                        <InputPriceComponent value={values.invested} onChange={(e) => setValue('invested', e.target.value)} currency={values.ccy} onCurrencyChange={(e) => setValue('ccy', e.target.value)} compactCurrency={true} />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm text-center mb-1" style={{color:'#FFFFFF'}}>TNA</label>
                        <InputPercentComponent value={values.tna} onChange={(e) => setValue('tna', e.target.value)} />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm text-center mb-1" style={{color:'#FFFFFF'}}>Desde</label>
                        <MonthDropComponent type='Desde' value={values.desdeValue} onChange={(value) => setValue('desdeValue', value)} />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm text-center mb-1" style={{color:'#FFFFFF'}}>Hasta</label>
                        <MonthDropComponent type='Hasta' value={values.hastaValue} onChange={(value) => setValue('hastaValue', value)} />
                      </div>
                    </div>
                  </>
                )}
                {values.plazo === 'var' && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="flex flex-col">
                        <label className="text-sm text-center mb-1" style={{color:'#FFFFFF'}}>Ticker</label>
                        <DropComponent
                          plhdr="Ej: AAPL"
                          onChange={(e) => {
                            const v = (e.target.value || '').toUpperCase();
                            setValue('name', v);
                            setTimeout(() => extractQuoteFromDom(), 0);
                          }}
                          value={values.name}
                          cripto={values.cripto}
                          type='savingVar'
                          onSearchResult={(res) => {
                            try {
                              if (res && res.price !== null && res.price !== undefined) {
                                const raw = String(res.price);
                                const normalized = raw.replace(/\s+/g,'').replace(/,/g,'');
                                const priceNum = Number(normalized);
                                if (Number.isFinite(priceNum) && priceNum > 0) {
                                  setVarQuote(priceNum);
                                }
                              }
                            } catch (_) {}
                          }}
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm text-center mb-1" style={{color:'#FFFFFF'}}>Monto</label>
                        <InputNumberComponent
                          value={values.invested}
                          onChange={(e) => {
                            const clean = e.target.value;
                            setValue('invested', clean);
                            if (values.plazo === 'var' && varQuote && Number(varQuote) > 0) {
                              const invNum = Number(clean || 0);
                              const q = invNum / Number(varQuote);
                              if (!Number.isNaN(q) && Number.isFinite(q)) {
                                setValue('qty', q === 0 ? '0' : q.toFixed(9).replace(/0+$/,'').replace(/\.$/,''));
                              }
                            }
                          }}
                          placeholder='Ej: u$s 350'
                        />
                        <p className='text-[12px] text-center !-mt-1' style={{ color: '#9CA3AF' }}>Monto en dólares (USDT).</p>
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm text-center mb-1" style={{color:'#FFFFFF'}}>Cantidad</label>
                        <input
                          className="text-center w-56 p-2 rounded-lg"
                          type="text"
                          inputMode="text"
                          autoComplete="off"
                          placeholder="Ej: 0.0000087"
                          value={values.qty}
                          onChange={(e) => {
                            const v = e.target.value;
                            const valid = values.plazo === 'var' 
                              ? /^\d*(?:[.,]?\d*)?$/.test(v)
                              : /^\d*(?:\.?\d*)?$/.test(v);
                            if (valid) {
                              if (values.plazo === 'var') {
                                setValue('qty', v);
                                
                                const normalizedV = v.replace(',', '.');
                                if (varQuote && Number(varQuote) > 0) {
                                  const qNum = Number(normalizedV || 0);
                                  const inv = qNum * Number(varQuote);
                                  if (!Number.isNaN(inv) && Number.isFinite(inv)) {
                                    setValue('invested', String(Math.round(inv)));
                                  }
                                }
                              } else {
                                let newV = cleanNumberInput(v, 9);
                                setValue('qty', newV);
                              }
                            }
                          }}
                          style={{background:'#2D3748', color:'#F3F4F6', border:'1px solid #1F2937', height:'2.5rem'}}
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm text-center mb-1" style={{color:'#FFFFFF'}}>Desde</label>
                        <MonthDropComponent type='Desde' value={values.desdeValue} onChange={(value) => setValue('desdeValue', value)} />
                      </div>
                    </div>
                  </>
                )}
                {values.plazo === 'plan' && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="flex flex-col">
                        <label className="text-sm text-center mb-1" style={{color:'#FFFFFF'}}>Monto mensual</label>
                        <InputPriceComponent value={values.obtained} onChange={(e) => setValue('obtained', e.target.value)} currency={values.ccy} onCurrencyChange={(e) => setValue('ccy', e.target.value)} compactCurrency={true} />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm text-center mb-1" style={{color:'#FFFFFF'}}>Desde</label>
                        <MonthDropComponent type='Desde' value={values.desdeValue} onChange={(value) => setValue('desdeValue', value)} />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm text-center mb-1" style={{color:'#FFFFFF'}}>Hasta</label>
                        <MonthDropComponent type='Hasta' value={values.hastaValue} onChange={(value) => setValue('hastaValue', value)} />
                      </div>
                    </div>
                  </>
                  )}
                </>
              )}
          </div>

          {backendError && (
            <div className="px-6 py-3 border-t" style={{ borderColor: '#1F2937' }}>
              <div className="text-red-400 text-sm text-center">{backendError}</div>
            </div>
          )}

          <div className="flex justify-end gap-2 px-6 py-4 border-t" style={{ borderColor: '#1F2937' }}>
            <button onClick={onClose} className="px-3 py-2 rounded hover:bg-gray-700">Cerrar</button>
            <button onClick={() => handleSubmit()} disabled={!validate()} className="px-3 py-2 rounded text-white" style={{ background: '#16A085', opacity: validate()?1:0.6 }}>Agregar</button>
          </div>
          </div>
          {showCalc && tab === 'Ahorro' && values.plazo === 'fijo' && (
            <FixedIncomeCalculatorModal
              isOpen={true}
              onClose={() => setShowCalc(false)}
              initialAmount={values.invested || ''}
              onApply={(finalAmount) => setValue('obtained', String(finalAmount))}
              inline={!isMobile}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AddModal;


