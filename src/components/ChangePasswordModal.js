import React, { useState } from 'react';
import { MODAL_STYLES, MODAL_BORDER_STYLES, TEXT_COLORS, INPUT_STYLES } from '../utils/styles';
import { changePassword } from '../services/user';
import { handleApiError } from '../utils/errorHandler';

const ChangePasswordModal = ({ isOpen, onClose, onSuccess }) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  if (!isOpen) return null;

  const resetFields = () => {
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setError('');
    setShowOld(false);
    setShowNew(false);
    setShowConfirm(false);
  };

  const handleClose = () => {
    resetFields();
    onClose();
  };

  const apply = async () => {
    setError('');
    if (!oldPassword || !newPassword) {
      setError('Complete los campos requeridos.');
      return;
    }
    if (newPassword.length < 5) {
      setError('La nueva contraseña debe tener al menos 5 caracteres.');
      return;
    }
    if (confirmPassword && newPassword !== confirmPassword) {
      setError('La confirmación no coincide.');
      return;
    }
    setLoading(true);
    try {
      const res = await changePassword({ old_password: oldPassword, new_password: newPassword, confirm_password: confirmPassword || undefined });
      if (res && res.detail) {
        onSuccess(res.detail);
      } else {
        onSuccess('Password updated.');
      }
      handleClose();
    } catch (e) {
      const msg = (e && e.message) ? String(e.message) : '';
      if (msg.includes('Status: 400')) {
        setError('Credenciales incorrectas.');
      } else {
        setError('Ocurrió un error. Intenta nuevamente.');
      }
      handleApiError(e, 'changePassword');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-40">
      <div className="absolute inset-0 bg-black/60" onClick={handleClose} />
      <div className="absolute inset-0 flex items-start justify-center pt-4 px-4 overflow-y-auto">
        <div className="w-full max-w-sm rounded-2xl shadow-2xl my-4" style={MODAL_STYLES}>
          <div className="flex items-center justify-center px-6 py-4 border-b" style={MODAL_BORDER_STYLES}>
            <h3 className="text-lg font-semibold" style={{color: TEXT_COLORS.primary}}>Cambiar contraseña</h3>
          </div>
          <div className="px-6 py-5 space-y-3">
            <div className="relative">
              <input 
                type={showOld ? 'text' : 'password'} 
                value={oldPassword} 
                onChange={(e)=>setOldPassword(e.target.value)} 
                placeholder="Contraseña actual" 
                className="w-full px-3 py-2 rounded pr-10" 
                style={INPUT_STYLES} 
              />
              <button 
                type="button" 
                onClick={()=>setShowOld(!showOld)} 
                className="absolute inset-y-0 right-2 my-auto h-8 px-2 rounded hover:bg-gray-700"
                aria-label={showOld ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-gray-300">
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7S2 12 2 12Z" stroke="currentColor" strokeWidth="1.5"/>
                  <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5"/>
                </svg>
              </button>
            </div>
            <div className="relative">
              <input 
                type={showNew ? 'text' : 'password'} 
                value={newPassword} 
                onChange={(e)=>setNewPassword(e.target.value)} 
                placeholder="Nueva contraseña" 
                className="w-full px-3 py-2 rounded pr-10" 
                style={INPUT_STYLES} 
              />
              <button 
                type="button" 
                onClick={()=>setShowNew(!showNew)} 
                className="absolute inset-y-0 right-2 my-auto h-8 px-2 rounded hover:bg-gray-700"
                aria-label={showNew ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-gray-300">
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7S2 12 2 12Z" stroke="currentColor" strokeWidth="1.5"/>
                  <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5"/>
                </svg>
              </button>
            </div>
            <div className="relative">
              <input 
                type={showConfirm ? 'text' : 'password'} 
                value={confirmPassword} 
                onChange={(e)=>setConfirmPassword(e.target.value)} 
                placeholder="Reingresar nueva contraseña" 
                className="w-full px-3 py-2 rounded pr-10" 
                style={INPUT_STYLES} 
              />
              <button 
                type="button" 
                onClick={()=>setShowConfirm(!showConfirm)} 
                className="absolute inset-y-0 right-2 my-auto h-8 px-2 rounded hover:bg-gray-700"
                aria-label={showConfirm ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-gray-300">
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7S2 12 2 12Z" stroke="currentColor" strokeWidth="1.5"/>
                  <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5"/>
                </svg>
              </button>
            </div>
            {error && (<div className="text-sm" style={{color:'#FCA5A5'}}>{error}</div>)}
          </div>
          <div className="flex justify-end gap-2 px-6 py-4 border-t" style={MODAL_BORDER_STYLES}>
            <button onClick={handleClose} className="px-3 py-2 rounded hover:bg-gray-700" style={{color: TEXT_COLORS.primary}}>Cancelar</button>
            <button onClick={apply} disabled={loading} className="px-3 py-2 rounded text-white" style={{background:'#27AE60', opacity: loading?0.6:1}}>Aplicar</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordModal;


