import React, { useState, useEffect } from 'react';
import { formatPrice } from '../utils/numbers';
import { putSaving } from '../services/saving';
import { MODAL_STYLES, MODAL_BORDER_STYLES, LABEL_STYLES, INPUT_STYLES, TEXT_COLORS } from '../utils/styles';

const RecordDetailModal = ({ isOpen, onClose, record, onUpdate, onConfirm }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedRecord, setEditedRecord] = useState({});
  const [loading, setLoading] = useState(false);

  const formatNumber = (num) => {
    if (!num) return '';
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const parseNumber = (str) => {
    return str.replace(/\./g, '');
  };

  useEffect(() => {
    if (record && !isEditing) {
      const baseManual = record.manual_obtained ?? record.obtained;
      setEditedRecord({ 
        ...record,
        final_amount: record.final_amount || 0,
        obtained: record.obtained || 0,
        manual_obtained: record.manual_obtained,
        manual_obtained_text: (baseManual !== null && baseManual !== undefined && baseManual !== '') ? formatNumber(baseManual) : '',
        qty_text: record.qty === 0 || record.qty ? String(record.qty) : ''
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
      
      if (record.type === 'flex') {
        const manualFromText = editedRecord.manual_obtained_text ? parseFloat(parseNumber(editedRecord.manual_obtained_text)) : null;
        const manualCandidate = editedRecord.manual_obtained != null ? editedRecord.manual_obtained : manualFromText;
        const manualOrObtained = (manualCandidate == null || Number.isNaN(parseFloat(manualCandidate))) ? editedRecord.obtained : manualCandidate;
        updateData = {
          id: record.id,
          type: 'flex',
          month_date: record.monthDate,
          manual_obtained: parseFloat(manualOrObtained) || 0
        };
        if (editedRecord.name !== record.name) {
          updateData.name = editedRecord.name;
        }
      } else if (record.type === 'fijo') {
        updateData = {
          ...record,
          id: record.id,
          name: editedRecord.name,
          invested: parseFloat(editedRecord.invested) || 0,
          obtained: parseFloat(editedRecord.final_amount) || 0
        };
        delete updateData.qty;
        delete updateData.final_amount;
        delete updateData.manual_obtained;
        delete updateData.month_date;
      } else if (record.type === 'var') {
        const manualFromText = editedRecord.manual_obtained_text ? parseFloat(parseNumber(editedRecord.manual_obtained_text)) : null;
        const manualCandidate = editedRecord.manual_obtained != null ? editedRecord.manual_obtained : manualFromText;
        const manualOrObtained = (
          manualCandidate == null || Number.isNaN(parseFloat(manualCandidate))
        ) ? editedRecord.obtained : manualCandidate;
        updateData = {
          id: record.id,
          type: 'var',
          month_date: record.monthDate,
          manual_obtained: parseFloat(manualOrObtained) || 0,
          qty: editedRecord.qty === '' ? 0 : (parseFloat(editedRecord.qty) || 0)
        };
      }
      await putSaving(updateData);
      onUpdate(updateData);
      setIsEditing(false);
      onClose();
    } catch (error) {
      // Error updating record
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    setLoading(true);
    try {
      const payload = {
        id: record.id,
        type: record.type,
        month_date: record.monthDate,
        projection: false
      };
      await putSaving(payload);
      onConfirm(payload);
      onClose();
    } catch (error) {
      // Error confirming record
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    const baseManual = record.manual_obtained ?? record.obtained;
    setEditedRecord({ 
      ...record,
      final_amount: record.final_amount || 0,
      obtained: record.obtained || 0,
      manual_obtained: record.manual_obtained,
      manual_obtained_text: (baseManual !== null && baseManual !== undefined && baseManual !== '') ? formatNumber(baseManual) : '',
      qty_text: record.qty === 0 || record.qty ? String(record.qty) : ''
    });
    setIsEditing(false);
  };


  if (!isOpen || !record) return null;

  const isProjection = record.projection === true;

  return (
    <div className="fixed inset-0 z-40">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="absolute inset-0 flex items-start justify-center pt-4 px-4 overflow-y-auto">
        <div className="w-full max-w-sm rounded-2xl shadow-2xl my-4" style={MODAL_STYLES}>
          <div className="flex items-center justify-center px-6 py-4 border-b" style={MODAL_BORDER_STYLES}>
            <h3 className="text-lg font-semibold" style={{color: TEXT_COLORS.primary}}>📈 Detalle del Ahorro</h3>
          </div>
          <div className="px-6 py-5">

            <div>
              <div className="space-y-1 text-left pl-20">
                  <div className="py-1">
                    <p className="text-sm">
                      <span className="font-medium" style={{color: TEXT_COLORS.secondary}}>Tipo:</span> 
                      <span className="ml-1" style={{color: TEXT_COLORS.primary}}>
                        {record.type === 'fijo' ? 'Renta Fija' : record.type === 'flex' ? 'Renta Pasiva' : 'Renta Variable'}
                      </span>
                    </p>
                  </div>

                <div className="py-1">
                  {isEditing && (record.type === 'fijo' || record.type === 'flex') ? (
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

                <div className="py-1">
                  <p className="text-sm">
                    <span className="font-medium" style={{color: TEXT_COLORS.secondary}}>Desde:</span> 
                    <span className="ml-1" style={{color: TEXT_COLORS.primary}}>
                      {record.date_from ? 
                        `${String(new Date(record.date_from + '-01').getUTCMonth() + 1).padStart(2, '0')}-${new Date(record.date_from + '-01').getUTCFullYear()}` 
                        : 'No especificada'}
                    </span>
                  </p>
                </div>

                <div className="py-1">
                  <p className="text-sm">
                    <span className="font-medium" style={{color: TEXT_COLORS.secondary}}>Hasta:</span> 
                    <span className="ml-1" style={{color: TEXT_COLORS.primary}}>
                      {record.date_to ? 
                        `${String(new Date(record.date_to + '-01').getUTCMonth() + 1).padStart(2, '0')}-${new Date(record.date_to + '-01').getUTCFullYear()}` 
                        : 'No especificada'}
                    </span>
                  </p>
                </div>

                <div className="py-1">
                  <p className="text-sm">
                    <span className="font-medium" style={{color: TEXT_COLORS.secondary}}>Monto Inicial:</span> 
                    <span className="ml-1" style={{color: TEXT_COLORS.primary}}>
                      {formatPrice(record.invested, record.ccy)}
                    </span>
                  </p>
                </div>
                

                {(record.type === 'flex' || record.type === 'var') && (
                  <div className="py-1">
                {isEditing ? (
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium" style={{color: TEXT_COLORS.secondary}}>Monto Actual:</span>
                    <input
                      type="text"
                      value={editedRecord.manual_obtained_text ?? ''}
                      onChange={(e) => {
                        const cleanValue = parseNumber(e.target.value).slice(0, 12);
                        const formatted = formatNumber(cleanValue);
                        setEditedRecord({
                          ...editedRecord,
                          manual_obtained_text: formatted
                        });
                      }}
                      onBlur={(e) => {
                        const cleanValue = parseNumber(e.target.value);
                        const num = cleanValue === '' ? null : parseFloat(cleanValue);
                        setEditedRecord({
                          ...editedRecord,
                          manual_obtained: Number.isFinite(num) ? num : null,
                          manual_obtained_text: cleanValue === '' ? '' : formatNumber(cleanValue)
                        });
                      }}
                      className="px-2 rounded border text-sm w-24" style={INPUT_STYLES}
                    />
                      </div>
                    ) : (
                      <p className="text-sm">
                        <span className="font-medium" style={{color: TEXT_COLORS.secondary}}>Monto Actual:</span> 
                        <span className="ml-1" style={{
                          color: (record.type === 'flex' && record.projection) ? '#7C3AED' : TEXT_COLORS.primary
                        }}>
                          {formatPrice(record.manual_obtained || record.obtained, record.ccy)}
                        </span>
                        {(record.type === 'flex' && record.projection) && (
                          <span className="ml-1 text-xs" style={{color: '#7C3AED'}}>
                            (proyección)
                          </span>
                        )}
                      </p>
                    )}
                  </div>
                )}

                {/* Monto Actual - Para Renta Variable
                {record.type === 'var' && (
                  <div className="py-1">
                    {isEditing ? (
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium" style={{color: TEXT_COLORS.secondary}}>Monto Actual:</span>
                        <input
                          type="text"
                          value={formatNumber(editedRecord.obtained)}
                          onInput={(e) => {
                            const cleanValue = parseNumber(e.target.value).slice(0, 9);
                            e.target.value = formatNumber(cleanValue);
                            setEditedRecord({...editedRecord, obtained: parseFloat(cleanValue) || 0});
                          }}
                          onChange={(e) => {
                            const cleanValue = parseNumber(e.target.value);
                            setEditedRecord({...editedRecord, obtained: parseFloat(cleanValue) || 0});
                          }}
                          className="px-2 rounded border text-sm w-24" style={INPUT_STYLES}
                        />
                      </div>
                    ) : (
                      <p className="text-sm">
                        <span className="font-medium" style={{color: TEXT_COLORS.secondary}}>Monto Actual:</span> 
                        <span className="ml-1" style={{color: record.projection ? '#7C3AED' : TEXT_COLORS.primary}}>
                          {formatPrice(record.obtained, 'USD')}
                        </span>
                        {record.projection && (
                          <span className="ml-1 text-xs" style={{color:'#7C3AED'}}>(proyección)</span>
                        )}
                      </p>
                    )}
                  </div>
                )} */}

                {record.type === 'fijo' && (
                  <div className="py-1">
                    {isEditing ? (
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium" style={{color: TEXT_COLORS.secondary}}>Monto Final:</span>
                          <input
                            type="text"
                            value={formatNumber(editedRecord.final_amount || 0)}
                            onInput={(e) => {
                              const cleanValue = parseNumber(e.target.value).slice(0, 9);
                              e.target.value = formatNumber(cleanValue);
                              setEditedRecord({...editedRecord, final_amount: parseFloat(cleanValue) || 0});
                            }}
                            onChange={(e) => {
                              const cleanValue = parseNumber(e.target.value);
                              setEditedRecord({...editedRecord, final_amount: parseFloat(cleanValue) || 0});
                            }}
                            className="px-2 rounded border text-sm w-24" style={INPUT_STYLES}
                          />
                        </div>
                    ) : (
                      <p className="text-sm">
                        <span className="font-medium" style={{color: TEXT_COLORS.secondary}}>Monto Final:</span> 
                        <span className="ml-1" style={{color: isProjection ? '#7C3AED' : TEXT_COLORS.primary}}>
                          {formatPrice(editedRecord.final_amount || 0, record.ccy)}
                        </span>
                        {isProjection && (
                          <span className="ml-1 text-xs" style={{color:'#7C3AED'}}>(proyección)</span>
                        )}
                      </p>
                    )}
                  </div>
                )}

                <div className="py-1">
                  <p className="text-sm">
                    <span className="font-medium" style={{color: TEXT_COLORS.secondary}}>TNA:</span> 
                    <span className="ml-1" style={{color: TEXT_COLORS.primary}}>{Math.round(record.tna)}%</span>
                  </p>
                </div>
              </div>

              {record.type === 'var' && (
                <div className="py-1 text-left pl-20">
                  {isEditing ? (
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium" style={{color: TEXT_COLORS.secondary}}>Cantidad:</span>
                      <input
                        className="px-2 rounded border text-sm w-24"
                        style={INPUT_STYLES}
                        type="text"
                        inputMode="decimal"
                        autoComplete="off"
                        value={editedRecord.qty_text ?? ''}
                        onChange={(e) => {
                          let v = e.target.value;
                          if (!/^\d*(?:\.?\d*)?$/.test(v)) return;
                          if (v.includes('.')) {
                            const [i, d] = v.split('.');
                            if (d && d.length > 9) v = `${i}.${d.slice(0, 9)}`;
                          }
                          setEditedRecord({
                            ...editedRecord,
                            qty_text: v,
                            qty: v === '' || v === '.' ? 0 : parseFloat(v)
                          });
                        }}
                      />
                    </div>
                  ) : (
                    <p className="text-sm">
                      <span className="font-medium" style={{color: TEXT_COLORS.secondary}}>Cantidad:</span> 
                      <span className="ml-1" style={{color: TEXT_COLORS.primary}}>{parseFloat(record.qty).toFixed(6)}</span>
                    </p>
                  )}
                </div>
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
                {isProjection && (
                  <button
                    onClick={handleConfirm}
                    disabled={loading}
                    className="px-3 py-2 rounded text-white" 
                    style={{background:'#10B981', opacity: loading ? 0.6 : 1}}
                  >
                    {loading ? 'Confirmando...' : 'Confirmar'}
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecordDetailModal;
