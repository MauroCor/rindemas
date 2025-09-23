import React, { useState } from 'react';
import FinancialDropComponent from './FinancialDropComponent';
import { formatPrice } from '../utils/numbers';

const SavingDataComponent = ({ monthData, onDeleteSaving, onPatchSaving, exRate }) => {

  const getMonthName = (dateStr) => {
    const month = parseInt(dateStr.split('-')[1], 10) - 1;
    const monthName = new Date(2024, month).toLocaleString('es-ES', { month: 'long' });
    return monthName.charAt(0).toUpperCase() + monthName.slice(1);
  };

  function isCurrentYearMonth(ym) {
    const current = new Date().toISOString().slice(0, 7);
    return ym === current;
  };

  const monthName = getMonthName(monthData.date);
  const currentMonth = isCurrentYearMonth(monthData.date)

  // Liquidez proyectable: solo vencimientos del mes (no RP/RV en curso)
  const monthLiquid = monthData.saving
    .filter((saving) => saving.date_to === monthData.date)
    .reduce((total, saving) => total + (saving.ccy == 'ARS' ? saving.obtained : saving.obtained * exRate), 0);

  // Disponible informativo (RP/RV líquidos en curso) — no entra al carry del modo proyección
  const availableLiquidInfo = monthData.saving
    .filter((saving) => saving.liquid && saving.type !== 'fijo' && saving.date_to !== monthData.date)
    .reduce((total, saving) => total + (saving.ccy == 'ARS' ? saving.obtained : saving.obtained * exRate), 0);

  // Notas locales (solo restan del No invertido del mes)
  const notesKey = `savings_notes_${monthData.date}`;
  const stored = (() => {
    try { return JSON.parse(localStorage.getItem(notesKey) || '[]'); } catch { return []; }
  })();
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [newNoteAmount, setNewNoteAmount] = useState('');
  const [newNoteText, setNewNoteText] = useState('');
  const [notes, setNotes] = useState(Array.isArray(stored) ? stored : []);

  const totalNotesAmount = Array.isArray(notes)
    ? notes.reduce((sum, n) => sum + (Number(n.amount) || 0), 0)
    : 0;

  const notInvestedRemaining = Math.max(0, (Number(monthLiquid) || 0) - totalNotesAmount);
  const availableTotal = availableLiquidInfo + notInvestedRemaining;

  const addNote = () => {
    const amt = Number(String(newNoteAmount).replace(/[^0-9]/g, ''));
    if (!amt || amt <= 0) return;
    const note = { id: Date.now(), amount: amt, text: (newNoteText || '').slice(0, 60) };
    const next = [...notes, note];
    localStorage.setItem(notesKey, JSON.stringify(next));
    setNotes(next);
    setNewNoteAmount('');
    setNewNoteText('');
  };

  const deleteNote = (id) => {
    const next = notes.filter(n => n.id !== id);
    localStorage.setItem(notesKey, JSON.stringify(next));
    setNotes(next);
  };

  return (
    <div className={`w-60 rounded-xl p-4 shadow-lg text-center ${currentMonth ? 'border border-teal-500' : 'border border-gray-700'}`} style={{background:'#1F2937', color:'#F3F4F6'}}>
      <h3 className="font-bold text-2xl mb-4">{monthName}</h3>
      <div className="mb-3">
        <label>Total</label>
        <div>
          <label className='text-2xl font-bold' style={{color:'#14B8A6'}}>{formatPrice(monthData.total, 'ARS')}</label>
        </div>
      </div>
      <FinancialDropComponent title="Disponible" data={{...monthData, total: availableTotal}} isIncome={true} initialOpen={false} onDelete={(id) => onDeleteSaving(id)} onPatch={(id, data) => onPatchSaving(id, data, monthData.date)} />
      {(monthLiquid > 0) && (
        <div className="mt-2 text-[11px] relative flex items-center justify-center" style={{color:'#9CA3AF'}}>
          <div className="text-center w-full">
            No invertido: <span className='font-semibold' style={{color:'#F3F4F6'}}>{formatPrice(notInvestedRemaining, 'ARS')}</span>
          </div>
          <button
            className="absolute right-2 -mt-1 rounded p-1 hover:bg-gray-700"
            title="Agregar/Ver anotaciones"
            onClick={()=> setShowNotesModal(true)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4"><path fill="#D1D5DB" d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1.003 1.003 0 0 0 0-1.42l-2.34-2.34a1.003 1.003 0 0 0-1.42 0l-1.83 1.83 3.75 3.75 1.84-1.82z"/></svg>
          </button>
        </div>
      )}

      {showNotesModal && (
        <div className="fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/60" onClick={()=>setShowNotesModal(false)} />
          <div className="absolute inset-0 flex items-start justify-center pt-20 px-4">
            <div className="w-full max-w-md rounded-2xl shadow-2xl" style={{ background: '#0F172A', color: '#F3F4F6', border: '1px solid #1F2937' }}>
              <div className="px-6 py-4 border-b text-center" style={{ borderColor: '#1F2937' }}>
                <h3 className="text-lg font-semibold">Dinero no invertido</h3>
              </div>
              <div className="px-6 py-5 space-y-3">
                <div className="text-center text-base font-semibold" style={{color:'#D1D5DB'}}>Anotaciones</div>
                <div className="space-y-2 max-h-48 overflow-auto pr-1">
                  {Array.isArray(notes) && notes.length > 0 && (
                    notes.map(n => (
                      <div key={n.id} className="flex items-center justify-between px-2 py-1 rounded border" style={{background:'#111827', borderColor:'#374151', color:'#D1D5DB'}}>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold" style={{color:'#F3F4F6'}}>{formatPrice(n.amount, 'ARS')}</span>
                          {n.text && <span className="italic text-xs">{n.text}</span>}
                        </div>
                        <button className="w-5 h-5 rounded hover:bg-gray-700 flex items-center justify-center" onClick={()=>deleteNote(n.id)} title="Eliminar">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-3 h-3"><path fill="#93C5FD" d="M18.3 5.71 12 12.01l-6.3-6.3-1.41 1.41 6.3 6.3-6.3 6.3 1.41 1.41 6.3-6.3 6.3 6.3 1.41-1.41-6.3-6.3 6.3-6.3z"/></svg>
                        </button>
                      </div>
                    ))
                  )}
                </div>
                <div className="flex items-center justify-center gap-2 pt-2">
                  <input
                    type="text"
                    value={newNoteAmount}
                    onChange={(e)=>setNewNoteAmount(e.target.value)}
                    placeholder="$ ..."
                    className="rounded px-2 py-1 text-sm w-28 text-center"
                    style={{background:'#2D3748', color:'#F3F4F6', border:'1px solid #1F2937'}}
                  />
                  <input
                    type="text"
                    value={newNoteText}
                    onChange={(e)=>setNewNoteText(e.target.value)}
                    placeholder="Anotación"
                    className="rounded px-2 py-1 text-sm w-44"
                    style={{background:'#2D3748', color:'#F3F4F6', border:'1px solid #1F2937'}}
                  />
                  <button className="w-7 h-7 rounded text-white flex items-center justify-center" style={{background:'#14B8A6'}} onClick={addNote}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4"><path fill="#fff" d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                  </button>
                </div>
              </div>
              <div className="flex justify-center gap-2 px-6 py-4 border-t" style={{ borderColor: '#1F2937' }}>
                <button onClick={()=>setShowNotesModal(false)} className="px-3 py-2 rounded hover:bg-gray-700">Cerrar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SavingDataComponent;
