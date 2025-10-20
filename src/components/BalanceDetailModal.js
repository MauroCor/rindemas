import React, { useState, useEffect } from 'react';
import { formatPrice } from '../utils/numbers';
import { putIncome } from '../services/income';
import { putFixedCost } from '../services/fixedCost';
import { putCardSpend } from '../services/cardSpend';
import { MODAL_STYLES, MODAL_BORDER_STYLES, INPUT_STYLES, TEXT_COLORS } from '../utils/styles';

const BalanceDetailModal = ({ isOpen, onClose, record, onUpdate, recordType }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedRecord, setEditedRecord] = useState({});
  const [loading, setLoading] = useState(false);

  const formatNumber = (num) => {
    if (!num) return '';
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const parseNumber = (str) => {
    if (!str) return '';
    return str.replace(/\./g, '');
  };

  useEffect(() => {
    if (record && !isEditing) {
      const amount = record.amount || record.price || 0;
      setEditedRecord({ 
        ...record,
        name: record.name || '',
        amount: amount,
        amount_text: formatNumber(amount)
      });
    }
  }, [record, isEditing]);

  useEffect(() => {
    if (isOpen) {
      setIsEditing(false);
    }
  }, [isOpen]);

  const handleSave = async () => {
    setLoading(true);
    try {
      let updateData;
      
      if (recordType === 'income') {
        updateData = {
          name: editedRecord.name,
          date_from: record.monthDate,
          price: parseFloat(parseNumber(editedRecord.amount_text))
        };
        await putIncome(record.id, updateData);
      } else if (recordType === 'expense') {
        updateData = {
          name: editedRecord.name,
          date_from: record.monthDate,
          price: parseFloat(parseNumber(editedRecord.amount_text))
        };
        await putFixedCost(record.id, updateData);
      } else if (recordType === 'card') {
        const monthdate = record.monthDate || record.monthdate || '';
        updateData = {
          name: editedRecord.name,
          monthdate,
          price: parseFloat(parseNumber(editedRecord.amount_text)) || 0
        };
        await putCardSpend(record.id, updateData);
      }
      
      onUpdate(updateData);
      setIsEditing(false);
      onClose();
    } catch (error) {
      // Error silencioso en producción
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    const amount = record.amount || record.price || 0;
    setEditedRecord({ 
      ...record,
      name: record.name || '',
      amount: amount,
      amount_text: formatNumber(amount)
    });
    setIsEditing(false);
  };

  if (!isOpen || !record) return null;

  const getTitle = () => {
    switch (recordType) {
      case 'income':
        return '💰 Detalle del Ingreso';
      case 'expense':
        return '🧾 Detalle del Egreso';
      case 'card':
        return '💳 Detalle de Gasto con Tarjeta';
      default:
        return '📊 Detalle';
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'No especificada';
    const date = new Date(dateStr + '-01');
    return `${String(date.getUTCMonth() + 1).padStart(2, '0')}-${date.getUTCFullYear()}`;
  };

  const getInstallmentText = () => {
    if (recordType !== 'card' || !record.installment) return '';
    const parts = record.installment.split('/');
    if (parts.length === 2) {
      return `${parts[0]} de ${parts[1]}`;
    }
    return record.installment;
  };

  const getAmountPerInstallment = () => (recordType === 'card' 
    ? formatPrice((record.pricePerInstallment ?? record.price ?? 0), 'ARS') 
    : '');

  return (
    <div className="fixed inset-0 z-40">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="absolute inset-0 flex items-start justify-center pt-4 px-4 overflow-y-auto">
        <div className="w-full max-w-sm rounded-2xl shadow-2xl my-4" style={MODAL_STYLES}>
          <div className="flex items-center justify-center px-6 py-4 border-b" style={MODAL_BORDER_STYLES}>
            <h3 className="text-lg font-semibold" style={{color: TEXT_COLORS.primary}}>{getTitle()}</h3>
          </div>
          <div className="px-6 py-5">
            <div className="space-y-1 text-left pl-20">
              
              {/* Nombre */}
              <div className="py-1">
                {isEditing ? (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium" style={{color: TEXT_COLORS.secondary}}>Nombre:</span>
                    <input
                      type="text"
                      value={editedRecord.name || ''}
                      onChange={(e) => setEditedRecord({...editedRecord, name: e.target.value})}
                      className="px-2 rounded border text-sm w-32" style={INPUT_STYLES}
                    />
                  </div>
                ) : (
                  <p className="text-sm">
                    <span className="font-medium" style={{color: TEXT_COLORS.secondary}}>Nombre:</span> 
                    <span className="ml-1" style={{color: TEXT_COLORS.primary}}>{record.name}</span>
                  </p>
                )}
              </div>

              {/* Fecha desde */}
              <div className="py-1">
                <p className="text-sm">
                  <span className="font-medium" style={{color: TEXT_COLORS.secondary}}>Desde:</span> 
                  <span className="ml-1" style={{color: TEXT_COLORS.primary}}>
                    {formatDate(record.date_from)}
                  </span>
                </p>
              </div>

              {/* Fecha hasta - solo para ingresos y egresos */}
              {recordType !== 'card' && (
                <div className="py-1">
                  <p className="text-sm">
                    <span className="font-medium" style={{color: TEXT_COLORS.secondary}}>Hasta:</span> 
                    <span className="ml-1" style={{color: TEXT_COLORS.primary}}>
                      {formatDate(record.date_to)}
                    </span>
                  </p>
                </div>
              )}

              {/* Monto */}
              <div className="py-1">
                {isEditing ? (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium" style={{color: TEXT_COLORS.secondary}}>
                      {recordType === 'card' ? 'Monto total:' : 'Monto:'}
                    </span>
                    <input
                      type="text"
                      value={editedRecord.amount_text || ''}
                      onChange={(e) => {
                        const cleanValue = parseNumber(e.target.value).slice(0, 12);
                        const formatted = formatNumber(cleanValue);
                        setEditedRecord({
                          ...editedRecord,
                          amount_text: formatted
                        });
                      }}
                      onBlur={(e) => {
                        const cleanValue = parseNumber(e.target.value);
                        const num = cleanValue === '' ? 0 : parseFloat(cleanValue);
                        setEditedRecord({
                          ...editedRecord,
                          amount: Number.isFinite(num) ? num : 0,
                          amount_text: cleanValue === '' ? '' : formatNumber(cleanValue)
                        });
                      }}
                      className="px-2 rounded border text-sm w-24" style={INPUT_STYLES}
                    />
                  </div>
                ) : (
                  <p className="text-sm">
                    <span className="font-medium" style={{color: TEXT_COLORS.secondary}}>
                      {recordType === 'card' ? 'Monto total:' : 'Monto:'}
                    </span> 
                    <span className="ml-1" style={{color: TEXT_COLORS.primary}}>
                      {formatPrice(record.amount || record.price, 'ARS')}
                    </span>
                  </p>
                )}
              </div>

              {/* Campos específicos para tarjeta */}
              {recordType === 'card' && (
                <>
                  <div className="py-1">
                    <p className="text-sm">
                      <span className="font-medium" style={{color: TEXT_COLORS.secondary}}>Cuota:</span> 
                      <span className="ml-1" style={{color: TEXT_COLORS.primary}}>
                        {getInstallmentText()}
                      </span>
                    </p>
                  </div>
                  
                  <div className="py-1">
                    <p className="text-sm">
                      <span className="font-medium" style={{color: TEXT_COLORS.secondary}}>Valor de cuota:</span> 
                      <span className="ml-1" style={{color: TEXT_COLORS.primary}}>
                        {getAmountPerInstallment()}
                      </span>
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2 px-6 py-4 border-t" style={MODAL_BORDER_STYLES}>
            {isEditing ? (
              <>
                <button
                  onClick={handleCancel}
                  className="px-3 py-2 rounded hover:bg-gray-700"
                  style={{color: TEXT_COLORS.primary}}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="px-3 py-2 rounded text-white" 
                  style={{background: TEXT_COLORS.accent, opacity: loading ? 0.6 : 1}}
                >
                  {loading ? 'Guardando...' : 'Guardar'}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={onClose}
                  className="px-3 py-2 rounded hover:bg-gray-700"
                  style={{color: TEXT_COLORS.primary}}
                >
                  Cerrar
                </button>
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-3 py-2 rounded text-white" 
                  style={{background:'#3B82F6'}}
                >
                  Editar
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BalanceDetailModal;
