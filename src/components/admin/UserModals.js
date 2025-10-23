import React from 'react';
import { MODAL_STYLES, MODAL_BORDER_STYLES, TEXT_COLORS } from '../../utils/styles';
import { 
  generateCreatedUserMailto,
  generateEditedUserMailto, 
  generateToggledUserMailto
} from '../../utils/emailUtils';

const UserModals = ({
  showUserCreated,
  createdUser,
  copied,
  onCloseUserCreated,
  onCopyMessage,
  showUserEdited,
  editedUser,
  editedUserData,
  onCloseUserEdited,
  showUserToggled,
  toggledUser,
  toggledUserData,
  onCloseUserToggled,
  showDeleteConfirm,
  userToDelete,
  deleteConfirmText,
  onDeleteConfirmChange,
  onDeleteConfirm,
  onDeleteCancel,
  showToggleConfirm,
  userToToggle,
  onToggleConfirm,
  onToggleCancel
}) => {
  return (
    <>
      {showUserCreated && createdUser && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/60" onClick={onCloseUserCreated} />
          <div className="absolute inset-0 flex items-center justify-center px-4">
            <div className="w-full max-w-lg rounded-2xl shadow-2xl" style={MODAL_STYLES}>
              <div className="px-5 py-3 border-b text-center" style={MODAL_BORDER_STYLES}>
                <h3 className="text-lg font-semibold" style={{color: '#16A085'}}>Usuario Creado</h3>
              </div>
              <div className="px-5 py-4" style={{color: TEXT_COLORS.muted}}>
                <div className="flex justify-between items-center mb-4">
                  <p className="text-base" style={{color: TEXT_COLORS.primary}}>Informar al cliente:</p>
                  <button
                    onClick={() => onCopyMessage(generateCreatedUserMailto(createdUser, true))}
                    className="flex items-center gap-2 px-3 py-1 rounded text-sm hover:bg-gray-700 transition-colors"
                    style={{color: TEXT_COLORS.primary}}
                  >
                    {copied ? (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Copiado
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Copiar
                      </>
                    )}
                  </button>
                </div>
                <div className="bg-gray-800 rounded-lg p-4 border relative" style={{borderColor: '#374151'}}>
                  <p className="text-sm font-mono text-left whitespace-pre-wrap">
                    {generateCreatedUserMailto(createdUser, true)}
                  </p>
                </div>
                <p className="text-sm mt-4 text-center" style={{color: TEXT_COLORS.secondary}}>
                  Enviar por <a 
                    href={generateCreatedUserMailto(createdUser)}
                    className="text-teal-400 hover:text-teal-300 underline"
                  >
                    email
                  </a>
                </p>
              </div>
              <div className="flex justify-center px-5 py-3 border-t" style={MODAL_BORDER_STYLES}>
                <button
                  onClick={onCloseUserCreated}
                  className="px-4 py-2 rounded text-white"
                  style={{background: '#16A085'}}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showUserEdited && editedUser && editedUserData && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/60" onClick={onCloseUserEdited} />
          <div className="absolute inset-0 flex items-center justify-center px-4">
            <div className="w-full max-w-lg rounded-2xl shadow-2xl" style={MODAL_STYLES}>
              <div className="px-5 py-3 border-b text-center" style={MODAL_BORDER_STYLES}>
                <h3 className="text-lg font-semibold" style={{color: TEXT_COLORS.primary}}>Usuario Editado</h3>
              </div>
              <div className="px-5 py-4" style={{color: TEXT_COLORS.muted}}>
                <div className="flex justify-between items-center mb-4">
                  <p className="text-base" style={{color: TEXT_COLORS.primary}}>Informar al cliente:</p>
                  <button
                    onClick={() => onCopyMessage(generateEditedUserMailto(editedUser, editedUserData, true))}
                    className="flex items-center gap-2 px-3 py-1 rounded text-sm hover:bg-gray-700 transition-colors"
                    style={{color: TEXT_COLORS.primary}}
                  >
                    {copied ? (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Copiado
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Copiar
                      </>
                    )}
                  </button>
                </div>
                <div className="bg-gray-800 rounded-lg p-4 border relative" style={{borderColor: '#374151'}}>
                  <p className="text-sm font-mono text-left whitespace-pre-wrap">
                    {generateEditedUserMailto(editedUser, editedUserData, true)}
                  </p>
                </div>
                <p className="text-sm mt-4 text-center" style={{color: TEXT_COLORS.secondary}}>
                  Enviar por <a 
                    href={generateEditedUserMailto(editedUser, editedUserData)}
                    className="text-teal-400 hover:text-teal-300 underline"
                  >
                    email
                  </a>
                </p>
              </div>
              <div className="flex justify-center px-5 py-3 border-t" style={MODAL_BORDER_STYLES}>
                <button
                  onClick={onCloseUserEdited}
                  className="px-4 py-2 rounded text-white"
                  style={{background: '#16A085'}}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showUserToggled && toggledUser && toggledUserData && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/60" onClick={onCloseUserToggled} />
          <div className="absolute inset-0 flex items-center justify-center px-4">
            <div className="w-full max-w-lg rounded-2xl shadow-2xl" style={MODAL_STYLES}>
              <div className="px-5 py-3 border-b text-center" style={MODAL_BORDER_STYLES}>
                <h3 className="text-lg font-semibold" style={{color: toggledUserData?.is_active ? '#16A085' : '#F59E0B'}}>
                  Usuario {toggledUserData?.is_active ? 'Activado' : 'Desactivado'}
                </h3>
              </div>
              <div className="px-5 py-4" style={{color: TEXT_COLORS.muted}}>
                <div className="flex justify-between items-center mb-4">
                  <p className="text-base" style={{color: TEXT_COLORS.primary}}>Informar al cliente:</p>
                  <button
                    onClick={() => onCopyMessage(generateToggledUserMailto(toggledUser, toggledUserData, true))}
                    className="flex items-center gap-2 px-3 py-1 rounded text-sm hover:bg-gray-700 transition-colors"
                    style={{color: TEXT_COLORS.primary}}
                  >
                    {copied ? (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Copiado
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Copiar
                      </>
                    )}
                  </button>
                </div>
                <div className="bg-gray-800 rounded-lg p-4 border relative" style={{borderColor: '#374151'}}>
                  <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono">
                    {generateToggledUserMailto(toggledUser, toggledUserData, true)}
                  </pre>
                </div>
                <p className="text-sm mt-4 text-center" style={{color: TEXT_COLORS.secondary}}>
                  Enviar por <a 
                    href={generateToggledUserMailto(toggledUser, toggledUserData)}
                    className="text-teal-400 hover:text-teal-300 underline"
                  >
                    email
                  </a>
                </p>
              </div>
              <div className="flex justify-center px-5 py-3 border-t" style={MODAL_BORDER_STYLES}>
                <button
                  onClick={onCloseUserToggled}
                  className="px-4 py-2 rounded text-white"
                  style={{background: '#16A085'}}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirm && userToDelete && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/60" onClick={onDeleteCancel} />
          <div className="relative flex items-center justify-center min-h-screen p-4">
            <div className="w-full max-w-md rounded-2xl shadow-2xl" style={MODAL_STYLES}>
              <div className="px-5 py-3 border-b text-center" style={MODAL_BORDER_STYLES}>
                <h3 className="text-lg font-semibold text-red-400">Confirmar Eliminación</h3>
              </div>
              <div className="px-5 py-4 text-center" style={{color: TEXT_COLORS.muted}}>
                <p className="text-base mb-4">
                  ¿Estás seguro de que deseas eliminar al usuario{' '}
                  <span className="font-bold text-red-400">
                    {userToDelete.first_name || userToDelete.username}
                  </span>?
                </p>
                <p className="text-sm mb-4" style={{color: TEXT_COLORS.secondary}}>
                  Esta acción no se puede deshacer.
                </p>
                <input
                  type="text"
                  placeholder="Escribe 'ELIMINAR' para confirmar"
                  value={deleteConfirmText}
                  onChange={onDeleteConfirmChange}
                  className="w-full px-3 py-2 rounded-md border"
                  style={{background: '#2D3748', color: '#F3F4F6', borderColor: '#4B5563'}}
                />
              </div>
              <div className="flex justify-center gap-2 px-5 py-3 border-t" style={MODAL_BORDER_STYLES}>
                <button
                  onClick={onDeleteCancel}
                  className="px-4 py-2 rounded-md border"
                  style={{color: TEXT_COLORS.primary, borderColor: '#4B5563'}}
                >
                  Cancelar
                </button>
                <button
                  onClick={onDeleteConfirm}
                  disabled={deleteConfirmText !== 'ELIMINAR'}
                  className="px-4 py-2 rounded-md text-white disabled:opacity-50"
                  style={{background: '#EF4444'}}
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showToggleConfirm && userToToggle && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/60" onClick={onToggleCancel} />
          <div className="relative flex items-center justify-center min-h-screen p-4">
            <div className="w-full max-w-md rounded-2xl shadow-2xl" style={MODAL_STYLES}>
              <div className="px-5 py-3 border-b text-center" style={MODAL_BORDER_STYLES}>
                <h3 className="text-lg font-semibold" style={{color: userToToggle.is_active ? '#F59E0B' : '#16A085'}}>
                  {userToToggle.is_active ? 'Desactivar Usuario' : 'Activar Usuario'}
                </h3>
              </div>
              <div className="px-5 py-4 text-center" style={{color: TEXT_COLORS.muted}}>
                <p className="text-base">
                  ¿Estás seguro de que deseas{' '}
                  <span className="font-bold" style={{color: userToToggle.is_active ? '#F59E0B' : '#16A085'}}>
                    {userToToggle.is_active ? 'desactivar' : 'activar'}
                  </span>{' '}
                  al usuario{' '}
                  <span className="font-bold" style={{color: TEXT_COLORS.primary}}>
                    {userToToggle.first_name || userToToggle.username}
                  </span>?
                </p>
              </div>
              <div className="flex justify-center gap-2 px-5 py-3 border-t" style={MODAL_BORDER_STYLES}>
                <button
                  onClick={onToggleCancel}
                  className="px-4 py-2 rounded-md border"
                  style={{color: TEXT_COLORS.primary, borderColor: '#4B5563'}}
                >
                  Cancelar
                </button>
                <button
                  onClick={onToggleConfirm}
                  className="px-4 py-2 rounded-md text-white"
                  style={{background: userToToggle.is_active ? '#F59E0B' : '#16A085'}}
                >
                  {userToToggle.is_active ? 'Desactivar' : 'Activar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserModals;
