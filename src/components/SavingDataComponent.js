import { useState, useEffect } from 'react';
import FinancialDropComponent from './FinancialDropComponent';
import { formatPrice } from '../utils/numbers';
import { getMonthName, isCurrentYearMonth } from '../utils/dateUtils';
import { getCardClassName, getCardStyle, TEXT_COLORS, BACKGROUND_COLORS, MODAL_STYLES, MODAL_BORDER_STYLES } from '../utils/styles';
import { getNotes, postNote, deleteNote } from '../services/notes';
import { handleApiError } from '../utils/errorHandler';

const SavingDataComponent = ({ monthData, onDeleteSaving, onPatchSaving, exRate }) => {

  const monthName = getMonthName(monthData.date);
  const currentMonth = isCurrentYearMonth(monthData.date);

  // Usar campos calculados del backend
  const monthLiquid = monthData.month_liquid || 0;

  const [showNotesModal, setShowNotesModal] = useState(false);
  const [newNoteAmount, setNewNoteAmount] = useState('');
  const [newNoteText, setNewNoteText] = useState('');
  const [newNoteReference, setNewNoteReference] = useState('');
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);

  // Cargar notas al montar el componente
  useEffect(() => {
    const loadNotes = async () => {
      try {
        setLoading(true);
        const notesData = await getNotes(monthData.date);
        setNotes(notesData || []);
      } catch (error) {
        handleApiError(error, 'loadNotes');
        setNotes([]);
      } finally {
        setLoading(false);
      }
    };
    
    loadNotes();
  }, [monthData.date]);

  // Usar campos calculados del backend
  const totalNotesAmount = monthData.total_notes_amount || 0;
  const notInvestedRemaining = monthData.not_invested_remaining || 0;
  const availableTotal = monthData.available_total || 0;

  const addNote = async () => {
    if (!newNoteText.trim()) return;
    
    try {
      const amount = Number(String(newNoteAmount).replace(/[^0-9]/g, '')) || 0;
      const noteData = {
        amount,
        text: newNoteText.trim().slice(0, 60),
        reference: newNoteReference || null,
        month_date: monthData.date
      };
      
      const newNote = await postNote(noteData);
      setNotes(prev => [...prev, newNote]);
      
      // Disparar evento para recargar datos del backend
      window.dispatchEvent(new CustomEvent('app:data-updated'));
      
      // Limpiar formulario
      setNewNoteAmount('');
      setNewNoteText('');
      setNewNoteReference('');
    } catch (error) {
      handleApiError(error, 'addNote');
    }
  };

  const handleDeleteNote = async (id) => {
    try {
      await deleteNote(id);
      setNotes(prev => prev.filter(n => n.id !== id));
      
      // Disparar evento para recargar datos del backend
      window.dispatchEvent(new CustomEvent('app:data-updated'));
    } catch (error) {
      handleApiError(error, 'deleteNote');
    }
  };

  return (
    <div className={`${getCardClassName(currentMonth)} px-4 pt-4 pb-2`} style={getCardStyle()}>
      <h3 className="font-bold text-2xl mb-4">{monthName}</h3>
      <div className="mb-3">
        <label>Total</label>
        <div>
          <label className='text-2xl font-bold' style={{color: TEXT_COLORS.accent}}>{formatPrice(monthData.total - totalNotesAmount, 'ARS')}</label>
        </div>
      </div>
      <FinancialDropComponent title="Disponible" data={{...monthData, total: availableTotal}} isIncome={true} initialOpen={true} onDelete={(id) => onDeleteSaving(id)} onPatch={(id, data) => onPatchSaving(id, data, monthData.date)} notes={notes} monthDate={monthData.date} />
      <div className="mt-2 text-[11px] relative flex items-center justify-center" style={{color: TEXT_COLORS.secondary}}>
        <div className="text-center w-full">
          {monthLiquid > 0 ? (
            <>
              No invertido: <span className='font-semibold' style={{color: TEXT_COLORS.primary}}>{formatPrice(notInvestedRemaining, 'ARS')}</span>
            </>
          ) : (
            <span className="invisible">No invertido: $0</span>
          )}
        </div>
        {monthLiquid > 0 && (
          <button
            className="absolute right-6 rounded p-1 hover:bg-gray-700"
            title="Agregar/Ver anotaciones"
            onClick={()=> {
              setNewNoteAmount(notInvestedRemaining.toString());
              setShowNotesModal(true);
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4"><path fill="#D1D5DB" d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1.003 1.003 0 0 0 0-1.42l-2.34-2.34a1.003 1.003 0 0 0-1.42 0l-1.83 1.83 3.75 3.75 1.84-1.82z"/></svg>
          </button>
        )}
      </div>

      {showNotesModal && (
        <div className="fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/60" onClick={()=>setShowNotesModal(false)} />
          <div className="absolute inset-0 flex items-start justify-center pt-20 px-4">
            <div className="w-full max-w-md md:max-w-lg rounded-2xl shadow-2xl" style={MODAL_STYLES}>
              <div className="px-6 py-4 border-b text-center" style={MODAL_BORDER_STYLES}>
                <h3 className="text-lg font-semibold">Registro del dinero no invertido</h3>
              </div>
              <div className="px-6 py-5 space-y-3">
                <div className="text-center text-base font-semibold" style={{color: TEXT_COLORS.muted}}>Anotaciones</div>
                <div className="space-y-2 max-h-48 overflow-auto pr-1">
                  {Array.isArray(notes) && notes.length > 0 && (
                    notes.map(n => (
                      <div key={n.id} className="flex items-center justify-between px-2 py-1 rounded border" style={{background: BACKGROUND_COLORS.primary, borderColor:'#374151', color: TEXT_COLORS.muted}}>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="font-semibold" style={{color: TEXT_COLORS.primary}}>{formatPrice(n.amount, 'ARS')}</span>
                          <span className="text-gray-300">-</span>
                          <span className="italic">{n.text || 'Sin descripción'}</span>
                          {n.reference && (
                            <>
                              <span className="text-gray-300">-</span>
                              <span className="text-xs px-1 py-0.5 rounded" style={{background:'#374151', color:'#9CA3AF'}}>{n.reference}</span>
                            </>
                          )}
                        </div>
                        <button className="w-5 h-5 rounded hover:bg-gray-700 flex items-center justify-center" onClick={()=>handleDeleteNote(n.id)} title="Eliminar">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-3 h-3"><path fill="#93C5FD" d="M18.3 5.71 12 12.01l-6.3-6.3-1.41 1.41 6.3 6.3-6.3 6.3 1.41 1.41 6.3-6.3 6.3 6.3 1.41-1.41-6.3-6.3 6.3-6.3z"/></svg>
                        </button>
                      </div>
                    ))
                  )}
                </div>
                <div className="pt-2">
                  <div className="grid gap-2 mb-2 pb-1 border-b" style={{gridTemplateColumns: '20% 40% 25% 10%', borderColor:'#4B5563'}}>
                    <span className="text-[10px] font-bold uppercase text-center" style={{color:'#9CA3AF'}}>MONTO</span>
                    <span className="text-[10px] font-bold uppercase text-center" style={{color:'#9CA3AF'}}>DEFINICIÓN</span>
                    <span className="text-[10px] font-bold uppercase text-center" style={{color:'#9CA3AF'}}>REFERENCIA</span>
                    <span></span>
                  </div>
                  <div className="grid gap-2" style={{gridTemplateColumns: '23% 40% 23% 7%'}}>
                    <input
                      type="text"
                      value={newNoteAmount ? newNoteAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') : ''}
                      onChange={(e) => {
                        const cleanValue = e.target.value.replace(/\./g, '').slice(0, 9);
                        setNewNoteAmount(cleanValue);
                      }}
                      onInput={(e) => {
                        const cleanValue = e.target.value.replace(/\./g, '').slice(0, 9);
                        e.target.value = cleanValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
                        setNewNoteAmount(cleanValue);
                      }}
                      placeholder="Ej: $ 100"
                      className="rounded px-2 py-1 text-[12px] text-center"
                      style={{background:'#2D3748', color:'#F3F4F6', border:'1px solid #1F2937'}}
                    />
                    <input
                      type="text"
                      value={newNoteText}
                      onChange={(e)=>setNewNoteText(e.target.value)}
                      placeholder="Ej: Reinvertido"
                      className="rounded px-2 py-1 text-[12px]"
                      style={{background:'#2D3748', color:'#F3F4F6', border:'1px solid #1F2937'}}
                    />
                    <select
                      value={newNoteReference}
                      onChange={(e)=>setNewNoteReference(e.target.value)}
                      className="rounded px-1 py-1 text-[9px]"
                      style={{background:'#2D3748', color:'#F3F4F6', border:'1px solid #1F2937'}}
                    >
                      <option value=""></option>
                      {monthData.saving && monthData.saving.map((saving, index) => (
                        <option key={index} value={saving.name}>
                          {saving.name}
                        </option>
                      ))}
                    </select>
                    <button className="w-6 h-6 my-1 rounded text-white flex items-center justify-center mx-auto" style={{background:'#14B8A6'}} onClick={addNote}>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4"><path fill="#fff" d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex justify-center gap-2 px-6 py-4 border-t" style={{ borderColor: '#1F2937' }}>
                <button onClick={()=>{
                  setShowNotesModal(false);
                  setNewNoteAmount('');
                  setNewNoteText('');
                  setNewNoteReference('');
                }} className="px-3 py-2 rounded hover:bg-gray-700">Cerrar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SavingDataComponent;
