import React from 'react';
import { MODAL_STYLES, MODAL_BORDER_STYLES, TEXT_COLORS } from '../utils/styles';

const InfoModal = ({ isOpen, onClose, title = 'Información', message = '' }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-40">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="absolute inset-0 flex items-start justify-center pt-4 px-4 overflow-y-auto">
        <div className="w-full max-w-sm rounded-2xl shadow-2xl my-4" style={MODAL_STYLES}>
          <div className="flex items-center justify-center px-6 py-4 border-b" style={MODAL_BORDER_STYLES}>
            <h3 className="text-lg font-semibold" style={{color: TEXT_COLORS.primary}}>{title}</h3>
          </div>
          <div className="px-6 py-5 text-sm" style={{color:'#D1D5DB'}}>
            {message}
          </div>
          <div className="flex justify-end gap-2 px-6 py-4 border-t" style={MODAL_BORDER_STYLES}>
            <button onClick={onClose} className="px-3 py-2 rounded text-white" style={{background:'#14B8A6'}}>Cerrar</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoModal;


