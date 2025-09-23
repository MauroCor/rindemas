import React from 'react';

const ConfirmDialog = ({ open, title = 'Confirmar', message, confirmText = 'Confirmar', cancelText = 'Cancelar', onConfirm, onCancel }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/60" onClick={onCancel} />
      <div className="absolute inset-0 flex items-center justify-center px-4">
        <div className="w-full max-w-sm rounded-2xl shadow-2xl" style={{ background: '#0F172A', color: '#F3F4F6', border: '1px solid #1F2937' }}>
          <div className="px-5 py-3 border-b text-center" style={{ borderColor: '#1F2937' }}>
            <h3 className="text-base font-semibold">{title}</h3>
          </div>
          <div className="px-5 py-4 text-sm text-center" style={{color:'#D1D5DB'}}>
            {message}
          </div>
          <div className="flex justify-center gap-2 px-5 py-3 border-t" style={{ borderColor: '#1F2937' }}>
            <button onClick={onCancel} className="px-3 py-2 rounded hover:bg-gray-700" style={{color:'#E5E7EB'}}> {cancelText} </button>
            <button onClick={onConfirm} className="px-3 py-2 rounded text-white" style={{ background: '#14B8A6' }}> {confirmText} </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;


