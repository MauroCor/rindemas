import React from 'react';
import { MODAL_STYLES, MODAL_BORDER_STYLES, TEXT_COLORS } from '../../utils/styles';

const UserForm = ({ 
  showCreateForm, 
  editingUser, 
  formData, 
  loading,
  onInputChange, 
  onSubmit, 
  onCancel 
}) => {
  if (!showCreateForm) return null;

  const isFormValid = () => {
    if (editingUser) {
      return formData.first_name.trim() && 
             formData.last_name.trim() && 
             formData.username.trim() && 
             formData.email.trim();
    } else {
      return formData.first_name.trim() && 
             formData.last_name.trim() && 
             formData.username.trim() && 
             formData.email.trim() && 
             formData.password.trim();
    }
  };

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/60" onClick={onCancel} />
      <div className="absolute inset-0 flex items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl shadow-2xl" style={MODAL_STYLES}>
          <div className="px-5 py-3 border-b text-center" style={MODAL_BORDER_STYLES}>
            <h3 className="text-lg font-semibold" style={{color: editingUser ? '#60A5FA' : '#16A085'}}>
              {editingUser ? 'Actualizar Usuario' : 'Crear Usuario'}
            </h3>
          </div>
          <form onSubmit={onSubmit} className="px-5 py-4 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1" style={{color: TEXT_COLORS.primary}}>Nombre</label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={onInputChange}
                autoComplete="off"
                style={{
                  background: '#2D3748',
                  color: '#F3F4F6',
                  border: '1px solid #1F2937'
                }}
                className="w-full px-3 py-2 rounded-lg focus:outline-none focus:border-teal-500 text-base"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{color: TEXT_COLORS.primary}}>Apellido</label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={onInputChange}
                autoComplete="off"
                style={{
                  background: '#2D3748',
                  color: '#F3F4F6',
                  border: '1px solid #1F2937'
                }}
                className="w-full px-3 py-2 rounded-lg focus:outline-none focus:border-teal-500 text-base"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{color: TEXT_COLORS.primary}}>Usuario</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={onInputChange}
                autoComplete="off"
                style={{
                  background: '#2D3748',
                  color: '#F3F4F6',
                  border: '1px solid #1F2937'
                }}
                className="w-full px-3 py-2 rounded-lg focus:outline-none focus:border-teal-500 text-base"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{color: TEXT_COLORS.primary}}>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={onInputChange}
                autoComplete="off"
                style={{
                  background: '#2D3748',
                  color: '#F3F4F6',
                  border: '1px solid #1F2937'
                }}
                className="w-full px-3 py-2 rounded-lg focus:outline-none focus:border-teal-500 text-base"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{color: TEXT_COLORS.primary}}>
                Contraseña {editingUser && '(dejar vacío para mantener actual)'}
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={onInputChange}
                autoComplete="off"
                style={{
                  background: '#2D3748',
                  color: '#F3F4F6',
                  border: '1px solid #1F2937'
                }}
                className="w-full px-3 py-2 rounded-lg focus:outline-none focus:border-teal-500 text-base"
                required={!editingUser}
              />
            </div>
          </form>
          <div className="flex justify-center gap-2 px-5 py-3 border-t" style={MODAL_BORDER_STYLES}>
            <button
              type="button"
              onClick={onCancel}
              className="px-3 py-2 rounded hover:bg-gray-700"
              style={{color: TEXT_COLORS.primary}}
            >
              Cancelar
            </button>
            <button
              type="submit"
              onClick={onSubmit}
              disabled={loading || !isFormValid()}
              className="px-3 py-2 rounded text-white"
              style={{ 
                background: '#16A085',
                opacity: (loading || !isFormValid()) ? 0.6 : 1,
                cursor: (loading || !isFormValid()) ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Guardando...' : (editingUser ? 'Actualizar' : 'Crear')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserForm;
