import React from 'react';
import { MODAL_STYLES, MODAL_BORDER_STYLES, TEXT_COLORS } from '../utils/styles';

const UserProfileModal = ({ isOpen, onClose, user, onChangePassword }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-40">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="absolute inset-0 flex items-start justify-center pt-4 px-4 overflow-y-auto">
        <div className="w-full max-w-sm rounded-2xl shadow-2xl my-4" style={MODAL_STYLES}>
          <div className="flex items-center justify-center px-6 py-4 border-b" style={MODAL_BORDER_STYLES}>
            <h3 className="text-lg font-semibold" style={{color: TEXT_COLORS.primary}}>Perfil de usuario</h3>
          </div>
          <div className="px-6 py-5">
            <div className="space-y-2 text-left">
              <p className="text-sm"><span className="font-medium" style={{color: TEXT_COLORS.secondary}}>Nombre:</span> <span style={{color: TEXT_COLORS.primary}}>{user?.full_name || '-'}</span></p>
              <p className="text-sm"><span className="font-medium" style={{color: TEXT_COLORS.secondary}}>Email:</span> <span style={{color: TEXT_COLORS.primary}}>{user?.email || '-'}</span></p>
              <p className="text-sm"><span className="font-medium" style={{color: TEXT_COLORS.secondary}}>Usuario:</span> <span style={{color: TEXT_COLORS.primary}}>{user?.username || '-'}</span></p>
              <div className="pt-1">
                <button onClick={() => { onClose(); onChangePassword(); }} className="px-2 rounded text-white text-sm" style={{background:'#16A085'}}>Cambiar contraseña</button>
              </div>
              <div className="pt-4" />
              <p className="text-xs" style={{color:'#6B7280'}}>
                ¿Consultas? Contacta al <a
                  href="mailto:maurocorrales4@gmail.com?subject=Rinde%2B%20Consultas."
                  className="text-teal-400 underline hover:text-teal-300"
                  style={{color:'#16A085'}}
                >administrador</a>.
              </p>
            </div>
          </div>
          <div className="flex justify-end gap-2 px-6 py-4 border-t" style={MODAL_BORDER_STYLES}>
            <button onClick={onClose} className="px-3 py-2 rounded hover:bg-gray-700" style={{color: TEXT_COLORS.primary}}>Cerrar</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileModal;


