import React, { useEffect, useMemo, useState } from 'react';

const sanitizeDecimal = (value) => {
  const cleaned = String(value).replace(/[^0-9.,]/g, '').replace(',', '.');
  // Permite solo un punto decimal
  const parts = cleaned.split('.');
  if (parts.length <= 1) return cleaned;
  return parts[0] + '.' + parts.slice(1).join('');
};

const sanitizeInteger = (value) => String(value).replace(/[^0-9]/g, '');

const FixedIncomeCalculatorModal = ({ isOpen, onClose, onApply, initialAmount, inline = false }) => {
  const [amount, setAmount] = useState('');
  const [tna, setTna] = useState('');
  const [days, setDays] = useState('');

  useEffect(() => {
    if (isOpen) {
      setAmount(initialAmount || '');
      setTna('');
      setDays('');
    }
  }, [isOpen, initialAmount]);

  const parsedAmount = useMemo(() => {
    const n = Number(sanitizeInteger(amount));
    return isFinite(n) ? n : 0;
  }, [amount]);

  const parsedTna = useMemo(() => {
    const n = Number(sanitizeDecimal(tna));
    return isFinite(n) ? n : 0;
  }, [tna]);

  const parsedDays = useMemo(() => {
    const n = Number(sanitizeInteger(days));
    return isFinite(n) ? n : 0;
  }, [days]);

  const { yieldAmount, finalAmount } = useMemo(() => {
    const yearly = parsedTna / 100;
    const y = parsedAmount * yearly * (parsedDays / 365);
    const f = parsedAmount + y;
    return { yieldAmount: isFinite(y) ? y : 0, finalAmount: isFinite(f) ? f : 0 };
  }, [parsedAmount, parsedTna, parsedDays]);

  if (!isOpen) return null;

  const canApply = parsedAmount > 0 && parsedTna > 0 && parsedDays > 0;

  const Card = (
      <div className="w-full max-w-xs rounded-2xl shadow-2xl" style={{ background: '#0F172A', color: '#F3F4F6', border: '2px solid #3B82F6', boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)' }}>
        <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: '#1F2937' }}>
          <div className="flex items-center gap-2 text-sm font-semibold">
            <span aria-hidden>📟</span>
            <span>Calculadora renta fija</span>
          </div>
          <button className="w-7 h-7 rounded hover:bg-gray-700 flex items-center justify-center" onClick={onClose} title="Cerrar">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4"><path fill="#93C5FD" d="M18.3 5.71 12 12.01l-6.3-6.3-1.41 1.41 6.3 6.3-6.3 6.3 1.41 1.41 6.3-6.3 6.3 6.3 1.41-1.41-6.3-6.3 6.3-6.3z"/></svg>
          </button>
        </div>

        <div className="px-3 py-3 space-y-2">
          <div className="flex flex-col">
            <label className="text-sm mb-1" style={{color:'#FFFFFF'}}>Monto inicial</label>
            <input
              className="rounded px-2 py-1.5 text-sm w-full"
              style={{background:'#111827', color:'#F3F4F6', border:'1px solid #1F2937'}}
              placeholder="$ ..."
              value={amount}
              onChange={(e)=>{ const v = e.target.value.replace(/\D/g,'').slice(0,9); setAmount(v); }}
              inputMode="numeric"
              pattern="[0-9]*"
              onKeyDown={(e)=>{ const isCombo = e.ctrlKey || e.metaKey; const ok = isCombo || ['Backspace','Tab','ArrowLeft','ArrowRight','Delete','Enter'].includes(e.key) || /[0-9]/.test(e.key); if(!ok){ e.preventDefault(); } }}
              onInput={(e)=>{ const v = e.target.value.replace(/\D/g,'').slice(0,9); e.target.value = v; setAmount(v); }}
              onPaste={(e)=>{ e.preventDefault(); const t = (e.clipboardData || window.clipboardData).getData('text'); const onlyDigits = String(t).replace(/[^0-9]/g,'').slice(0,9); setAmount(onlyDigits); }}
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col">
              <label className="text-sm mb-1" style={{color:'#FFFFFF'}}>TNA</label>
              <input
                className="rounded px-2 py-1.5 text-sm w-full"
                style={{background:'#111827', color:'#F3F4F6', border:'1px solid #1F2937'}}
                placeholder="% ..."
                value={tna}
                onChange={(e)=>{ const value = e.target.value.slice(0,4).replace(/[^0-9,]/g,'').replace(/(,.*)(,)/,'$1'); setTna(value); }}
                inputMode="decimal"
                pattern="[0-9]*[.,]?[0-9]*"
                onKeyDown={(e)=>{ const isCombo = e.ctrlKey || e.metaKey; const ok = isCombo || ['Backspace','Tab','ArrowLeft','ArrowRight','Delete','Enter',','].includes(e.key) || /[0-9]/.test(e.key); if(!ok){ e.preventDefault(); } }}
                onInput={(e)=>{ const value = e.target.value.slice(0,4).replace(/[^0-9,]/g,'').replace(/(,.*)(,)/,'$1'); e.target.value = value; setTna(value); }}
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm mb-1" style={{color:'#FFFFFF'}}>Días</label>
              <input
                className="rounded px-2 py-1.5 text-sm w-full"
                style={{background:'#111827', color:'#F3F4F6', border:'1px solid #1F2937'}}
                placeholder="Ej: 30"
                value={days}
                onChange={(e)=>{ const v = e.target.value.replace(/\D/g,'').slice(0,3); setDays(v); }}
                inputMode="numeric"
                pattern="[0-9]*"
                onKeyDown={(e)=>{ const isCombo = e.ctrlKey || e.metaKey; const ok = isCombo || ['Backspace','Tab','ArrowLeft','ArrowRight','Delete','Enter'].includes(e.key) || /[0-9]/.test(e.key); if(!ok){ e.preventDefault(); } }}
                onInput={(e)=>{ const v = e.target.value.replace(/\D/g,'').slice(0,3); e.target.value = v; setDays(v); }}
                onPaste={(e)=>{ e.preventDefault(); const t = (e.clipboardData || window.clipboardData).getData('text'); const onlyDigits = String(t).replace(/[^0-9]/g,'').slice(0,3); setDays(onlyDigits); }}
              />
            </div>
          </div>

          {canApply && (
            <div className="mt-2 space-y-1 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Rendimiento</span>
                <div className="flex items-center gap-2 font-semibold">
                  <span style={{color:'#F3F4F6'}}>{yieldAmount.toLocaleString('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 })}</span>
                  <span className="text-xs px-1.5 py-0.5 rounded" style={{background:'#0B1220', border:'1px solid #1F2937', color:'#93C5FD'}}>
                    {((parsedTna) * (parsedDays/365)).toFixed(2)}%
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Monto final</span>
                <span className="font-bold" style={{color:'#27AE60'}}>{finalAmount.toLocaleString('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 })}</span>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between gap-2 px-4 py-3 border-t" style={{ borderColor: '#1F2937' }}>
          <button
            className="px-3 py-2 rounded hover:bg-gray-700"
            onClick={() => { setAmount(''); setTna(''); setDays(''); }}
          >
            Limpiar
          </button>
          <button
            disabled={!canApply}
            className="px-3 py-2 rounded text-white"
            style={{ background: '#27AE60', opacity: canApply?1:0.6 }}
            onClick={() => { onApply(Math.round(finalAmount)); onClose(); }}
          >
            Aplicar
          </button>
        </div>
      </div>
  );

  if (inline) {
    return (
      <div className="ml-3" style={{ marginTop: '0.25rem' }}>
        {Card}
      </div>
    );
  }

  return (
    <div className="fixed z-50" style={{ top: '4.5rem', right: '1.5rem' }}>
      {Card}
    </div>
  );
};

export default FixedIncomeCalculatorModal;


