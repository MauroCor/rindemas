import React, { useState, useEffect } from 'react';
import { logError } from '../utils/logger';
import { createUser, updateUser, deleteUser, toggleUserStatus } from '../services/admin';
import apiRequest from '../services/apiClient';
import SpinnerComponent from '../components/SpinnerComponent';
import ConfirmDialog from '../components/ConfirmDialog';
import { MODAL_STYLES, MODAL_BORDER_STYLES, TEXT_COLORS } from '../utils/styles';

const AdminScreen = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [showToggleConfirm, setShowToggleConfirm] = useState(false);
  const [userToToggle, setUserToToggle] = useState(null);
  const [showUserCreated, setShowUserCreated] = useState(false);
  const [createdUser, setCreatedUser] = useState(null);
  const [copied, setCopied] = useState(false);
  const [showUserEdited, setShowUserEdited] = useState(false);
  const [editedUser, setEditedUser] = useState(null);
  const [showUserToggled, setShowUserToggled] = useState(false);
  const [toggledUser, setToggledUser] = useState(null);
  const [hasAccess, setHasAccess] = useState(true);
  const [editedUserData, setEditedUserData] = useState(null);
  const [toggledUserData, setToggledUserData] = useState(null);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    password: ''
  });

  // Cargar usuarios
  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await apiRequest('/api/users/', 'GET', null, true)
        .then(data => data.json());
      
      // Ordenar usuarios: superusuarios primero, luego por nombre
      const sortedUsers = (response.users || []).sort((a, b) => {
        // Primero por is_superuser (true primero)
        if (a.is_superuser !== b.is_superuser) {
          return b.is_superuser - a.is_superuser;
        }
        // Luego por nombre alfabéticamente
        const nameA = a.full_name || `${a.first_name || ''} ${a.last_name || ''}`.trim() || a.username;
        const nameB = b.full_name || `${b.first_name || ''} ${b.last_name || ''}`.trim() || b.username;
        return nameA.localeCompare(nameB);
      });
      
      setUsers(sortedUsers);
      setTotalUsers(response.total || 0);
    } catch (error) {
      // Si es error 403, ocultar todo el contenido
      if (error.status === 403) {
        setHasAccess(false);
        setUsers([]);
        setTotalUsers(0);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Manejar formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      first_name: '',
      last_name: '',
      username: '',
      email: '',
      password: ''
    });
    setEditingUser(null);
    setShowCreateForm(false);
  };

  // Crear usuario
  const handleCreateUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createUser(formData);
      // Usar datos del formulario directamente
      setCreatedUser(formData);
      await loadUsers();
      resetForm();
      setShowUserCreated(true);
    } catch (error) {
      // Error silencioso en producción
    } finally {
      setLoading(false);
    }
  };

  // Editar usuario
  const handleEditUser = (user) => {
    setEditingUser(user);
    setFormData({
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      username: user.username || '',
      email: user.email || '',
      password: ''
    });
    setShowCreateForm(true);
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const updateData = { ...formData };
      if (!updateData.password) {
        delete updateData.password; // No enviar password vacío
      }
      await updateUser(editingUser.id, updateData);
      setEditedUser(editingUser);
      setEditedUserData(updateData);
      setShowCreateForm(false);
      setEditingUser(null);
      resetForm();
      setShowUserEdited(true);
      await loadUsers();
    } catch (error) {
      // Error silencioso en producción
    } finally {
      setLoading(false);
    }
  };

  // Eliminar usuario
  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setDeleteConfirmText('');
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (deleteConfirmText.toLowerCase() !== 'eliminar') return;
    
    setLoading(true);
    try {
      await deleteUser(userToDelete.id);
      await loadUsers();
    } catch (error) {
      // Error silencioso en producción
    } finally {
      setLoading(false);
      setShowDeleteConfirm(false);
      setUserToDelete(null);
      setDeleteConfirmText('');
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
    setUserToDelete(null);
    setDeleteConfirmText('');
  };

  // Activar/Desactivar usuario
  const handleToggleUserClick = (user) => {
    setUserToToggle(user);
    setShowToggleConfirm(true);
  };

  const handleToggleConfirm = async () => {
    setLoading(true);
    try {
      await toggleUserStatus(userToToggle.id, userToToggle.is_active);
      setToggledUser(userToToggle);
      setToggledUserData({ is_active: !userToToggle.is_active });
      setShowToggleConfirm(false);
      setUserToToggle(null);
      setShowUserToggled(true);
      await loadUsers(); // Refrescar la página
    } catch (error) {
      // Error silencioso en producción
    } finally {
      setLoading(false);
    }
  };

  const handleToggleCancel = () => {
    setShowToggleConfirm(false);
    setUserToToggle(null);
  };

  // Cerrar modal de usuario creado
  const handleCloseUserCreated = () => {
    setShowUserCreated(false);
    setCreatedUser(null);
    setCopied(false);
  };

  const handleCloseUserEdited = () => {
    setShowUserEdited(false);
    setEditedUser(null);
    setEditedUserData(null);
  };

  const handleCloseUserToggled = () => {
    setShowUserToggled(false);
    setToggledUser(null);
    setToggledUserData(null);
  };

  // Función unificada para generar mensajes de usuario
  const generateUserMessage = (user, type, data = {}) => {
    if (!user) return '';
    
    const firstName = user.first_name || user.username || 'Usuario';
    const username = user.username || 'N/A';
    
    // Saludo común
    const greeting = `¡Hola ${firstName}! 👋`;
    
    // Despedida común
    const closing = `Cualquier consulta es bienvenida, estamos para asesorar.

Saludos,

Equipo Rinde+.`;
    
    // Contenido específico según el tipo
    let content = '';
    
    switch (type) {
      case 'created':
        const password = user.password || 'N/A';
        content = `Tu cuenta Rinde+ ha sido creada. ¡Proyecta tu evolución! 🚀

Acceso:
• Link: maurocor.github.io/rindemas/
• Usuario: ${username}
• Contraseña: ${password}

💡 Actualizar esta contraseña genérica.
Puedes hacerlo al iniciar sesión en: Usuario > Perfil > Cambiar contraseña.`;
        break;
        
      case 'edited':
        const changes = [];
        if (data.first_name) changes.push(`• Nombre: ${data.first_name}`);
        if (data.last_name) changes.push(`• Apellido: ${data.last_name}`);
        if (data.username) changes.push(`• Usuario: ${data.username}`);
        if (data.email) changes.push(`• Email: ${data.email}`);
        if (data.password) changes.push(`• Contraseña: ${data.password}`);
        
        content = `Actualizamos los datos de tu cuenta Rinde+.

Cambios realizados:
${changes.join('\n')}`;
        break;
        
      case 'toggled':
        const isActivated = data.is_active;
        content = isActivated ? 
          '✅ Tu cuenta Rinde+ ha sido activada.' : 
          '😔 Sentimos informar que su cuenta Rinde+ ha sido desactivada temporalmente.';
        break;
        
      default:
        return '';
    }
    
    return `${greeting}

${content}

${closing}`;
  };

  // Funciones específicas que usan la función unificada
  const generateCreatedUserMessage = (user) => generateUserMessage(user, 'created');
  const generateEditedUserMessage = (user, editedData) => generateUserMessage(user, 'edited', editedData);
  const generateToggledUserMessage = (user, toggledData) => generateUserMessage(user, 'toggled', toggledData);

  // Función unificada para copiar mensajes
  const handleCopyMessage = async (message) => {
    if (!message) return;
    
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      // Error silencioso en producción
    }
  };

  // Función para generar mailto con subject y body
  const generateMailtoLink = (email, message) => {
    if (!email || !message) return `mailto:${email}`;
    
    const subject = 'Cuenta Rinde+';
    const encodedSubject = encodeURIComponent(subject);
    const encodedBody = encodeURIComponent(message);
    
    // Asegurar que no haya espacios ni símbolos sin codificar
    const cleanEmail = email.trim();
    const cleanSubject = encodedSubject.replace(/\+/g, '%2B'); // Codificar el + en "Rinde+"
    const cleanBody = encodedBody;
    
    // Construir el mailto sin espacios
    const mailto = `mailto:${cleanEmail}?subject=${cleanSubject}&body=${cleanBody}`;
    
    // Eliminar cualquier espacio que pueda haber quedado
    return mailto.replace(/\s/g, '');
  };

  // Funciones específicas de copiado
  const handleCopyCreatedMessage = async () => {
    if (!createdUser) return;
    const message = generateCreatedUserMessage(createdUser);
    await handleCopyMessage(message);
  };

  const handleCopyEditedMessage = async () => {
    if (!editedUser || !editedUserData) return;
    const message = generateEditedUserMessage(editedUser, editedUserData);
    await handleCopyMessage(message);
  };

  const handleCopyToggledMessage = async () => {
    if (!toggledUser || !toggledUserData) return;
    const message = generateToggledUserMessage(toggledUser, toggledUserData);
    await handleCopyMessage(message);
  };

  // Validar si todos los campos requeridos están completos
  const isFormValid = () => {
    if (editingUser) {
      // Para editar, solo validar campos básicos (password es opcional)
      return formData.first_name.trim() && 
             formData.last_name.trim() && 
             formData.username.trim() && 
             formData.email.trim();
    } else {
      // Para crear, todos los campos son requeridos
      return formData.first_name.trim() && 
             formData.last_name.trim() && 
             formData.username.trim() && 
             formData.email.trim() && 
             formData.password.trim();
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {hasAccess ? (
          <>
            <h1 className="text-3xl font-bold mb-8 text-center">Administrar usuarios</h1>

            {/* Contenido de usuarios */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            {/* Botón crear usuario */}
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Usuarios ({totalUsers})</h2>
                <button
                  onClick={() => setShowCreateForm(true)}
                  aria-label="Crear usuario"
                  className="inline-flex items-center gap-2 text-white rounded-full text-sm px-4 py-2 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-0 transition"
                  style={{background: '#16A085'}}
                  onMouseEnter={(e) => e.target.style.background = '#138D75'}
                  onMouseLeave={(e) => e.target.style.background = '#16A085'}
                >
                  <span className="inline-block w-5 h-5 rounded-full bg-white/20 text-center leading-5">+</span>
                  Crear usuario
                </button>
            </div>

            {/* Tabla de usuarios */}
            <div className="bg-gray-800 rounded-lg overflow-hidden">
              {loading ? (
                <div className="p-8">
                  <SpinnerComponent />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-700">
                      <tr>
                        <th className="px-4 py-3 text-center">ID</th>
                        <th className="px-4 py-3 text-center">Usuario</th>
                        <th className="px-4 py-3 text-center">Nombre</th>
                        <th className="px-4 py-3 text-center">Email</th>
                        <th className="px-4 py-3 text-center">Activo</th>
                        <th className="px-4 py-3 text-center">Superusuario</th>
                        <th className="px-4 py-3 text-center">Registro</th>
                        <th className="px-4 py-3 text-center">Login</th>
                        <th className="px-4 py-3 text-center">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => {
                        // Función para formatear fechas
                        const formatDate = (dateString) => {
                          if (!dateString) return 'N/A';
                          const date = new Date(dateString);
                          return date.toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit'
                          });
                        };

                        return (
                          <tr key={user.id} className="border-t border-gray-700 hover:bg-gray-750">
                            <td className="px-4 py-3 text-center">{user.id}</td>
                            <td className="px-4 py-3 text-center">{user.username}</td>
                            <td className="px-4 py-3 text-center">{user.full_name || `${user.first_name || ''} ${user.last_name || ''}`.trim()}</td>
                            <td className="px-4 py-3 text-center">{user.email}</td>
                            <td className="px-4 py-3 text-center">
                              <span className={`px-2 py-1 rounded text-xs ${
                                user.is_active ? 'text-white' : 'bg-red-600 text-red-100'
                              }`} style={user.is_active ? {background: '#16A085'} : {}}>
                                {user.is_active ? 'Sí' : 'No'}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <span className={`px-2 py-1 rounded text-xs ${
                                user.is_superuser ? 'text-white' : 'bg-gray-600 text-gray-300'
                              }`} style={user.is_superuser ? {background: '#16A085'} : {}}>
                                {user.is_superuser ? 'Sí' : 'No'}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-300 text-center">
                              {formatDate(user.date_joined)}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-300 text-center">
                              {formatDate(user.last_login)}
                            </td>
                            <td className="px-4 py-3 text-center">
                              <div className="flex space-x-2 justify-center">
                                <button
                                  onClick={() => handleEditUser(user)}
                                  className="text-blue-400 hover:text-blue-300 text-sm"
                                >
                                  Editar
                                </button>
                        <button
                          onClick={() => handleToggleUserClick(user)}
                          className={`text-sm ${
                            user.is_active
                              ? 'text-orange-400 hover:text-orange-300'
                              : 'hover:opacity-80'
                          }`}
                          style={!user.is_active ? {color: '#16A085'} : {}}
                        >
                          {user.is_active ? 'Desactivar' : 'Activar'}
                        </button>
                                {!user.is_superuser && (
                                  <button
                                    onClick={() => handleDeleteClick(user)}
                                    className="text-red-400 hover:text-red-300 text-sm"
                                  >
                                    Eliminar
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Modal crear/editar usuario */}
        {showCreateForm && (
          <div className="fixed inset-0 z-50">
            <div className="absolute inset-0 bg-black/60" onClick={resetForm} />
            <div className="absolute inset-0 flex items-center justify-center px-4">
              <div className="w-full max-w-md rounded-2xl shadow-2xl" style={MODAL_STYLES}>
                <div className="px-5 py-3 border-b text-center" style={MODAL_BORDER_STYLES}>
                  <h3 className="text-lg font-semibold" style={{color: editingUser ? '#60A5FA' : '#16A085'}}>
                    {editingUser ? 'Actualizar Usuario' : 'Crear Usuario'}
                  </h3>
                </div>
                <form onSubmit={editingUser ? handleUpdateUser : handleCreateUser} className="px-5 py-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{color: TEXT_COLORS.primary}}>Nombre</label>
                    <input
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleInputChange}
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
                      onChange={handleInputChange}
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
                      onChange={handleInputChange}
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
                      onChange={handleInputChange}
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
                      Contraseña {editingUser && '(dejar vacío para no cambiar)'}
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
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
                    onClick={resetForm}
                    className="px-3 py-2 rounded hover:bg-gray-700"
                    style={{color: TEXT_COLORS.primary}}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    onClick={editingUser ? handleUpdateUser : handleCreateUser}
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
        )}

        {/* Modal confirmar eliminación */}
        {showDeleteConfirm && userToDelete && (
          <div className="fixed inset-0 z-50">
            <div className="absolute inset-0 bg-black/60" onClick={handleDeleteCancel} />
            <div className="absolute inset-0 flex items-center justify-center px-4">
              <div className="w-full max-w-sm rounded-2xl shadow-2xl" style={MODAL_STYLES}>
                <div className="px-5 py-3 border-b text-center" style={MODAL_BORDER_STYLES}>
                  <h3 className="text-lg font-semibold" style={{color: '#EF4444'}}>Eliminar Usuario</h3>
                </div>
                <div className="px-5 py-4 text-base text-center" style={{color: TEXT_COLORS.muted}}>
                  <p className="mb-4">
                    ¿Eliminar usuario{' '}
                    <span className="font-bold" style={{color: TEXT_COLORS.primary}}>
                      {userToDelete.full_name || `${userToDelete.first_name || ''} ${userToDelete.last_name || ''}`.trim()} ({userToDelete.username})
                    </span>
                    ?
                  </p>
                  <div className="mb-4">
                    <input
                      type="text"
                      value={deleteConfirmText}
                      onChange={(e) => setDeleteConfirmText(e.target.value)}
                      style={{
                        background: '#2D3748',
                        color: '#F3F4F6',
                        border: '1px solid #1F2937'
                      }}
                      className="w-full px-3 py-2 rounded-lg focus:outline-none focus:border-red-500 text-base"
                      placeholder="Escriba 'eliminar' para confirmar"
                      autoFocus
                    />
                  </div>
                </div>
                <div className="flex justify-center gap-2 px-5 py-3 border-t" style={MODAL_BORDER_STYLES}>
                  <button 
                    onClick={handleDeleteCancel} 
                    className="px-3 py-2 rounded hover:bg-gray-700" 
                    style={{color: TEXT_COLORS.primary}}
                  >
                    Cancelar
                  </button>
                  <button 
                    onClick={handleDeleteConfirm}
                    disabled={deleteConfirmText.toLowerCase() !== 'eliminar' || loading}
                    className="px-3 py-2 rounded text-white"
                    style={{ 
                      background: '#EF4444',
                      opacity: (deleteConfirmText.toLowerCase() === 'eliminar' && !loading) ? 1 : 0.6
                    }}
                  >
                    {loading ? 'Eliminando...' : 'Aceptar'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal confirmar activar/desactivar */}
        {showToggleConfirm && userToToggle && (
          <div className="fixed inset-0 z-50">
            <div className="absolute inset-0 bg-black/60" onClick={handleToggleCancel} />
            <div className="absolute inset-0 flex items-center justify-center px-4">
              <div className="w-full max-w-sm rounded-2xl shadow-2xl" style={MODAL_STYLES}>
                <div className="px-5 py-3 border-b text-center" style={MODAL_BORDER_STYLES}>
                  <h3 className="text-lg font-semibold" style={{color: userToToggle.is_active ? '#F59E0B' : '#16A085'}}>
                    {userToToggle.is_active ? 'Desactivar Usuario' : 'Activar Usuario'}
                  </h3>
                </div>
                <div className="px-5 py-4 text-base text-center" style={{color: TEXT_COLORS.muted}}>
                  <p className="mb-4">
                    ¿{userToToggle.is_active ? 'Desactivar' : 'Activar'} usuario{' '}
                    <span className="font-bold" style={{color: TEXT_COLORS.primary}}>
                      {userToToggle.full_name || `${userToToggle.first_name || ''} ${userToToggle.last_name || ''}`.trim()} ({userToToggle.username})
                    </span>
                    ?
                  </p>
                  <p className="text-sm" style={{color: TEXT_COLORS.secondary}}>
                    {userToToggle.is_active 
                      ? 'El usuario no podrá acceder a la aplicación hasta que sea reactivado.'
                      : 'El usuario podrá acceder a la aplicación nuevamente.'
                    }
                  </p>
                </div>
                <div className="flex justify-center gap-2 px-5 py-3 border-t" style={MODAL_BORDER_STYLES}>
                  <button 
                    onClick={handleToggleCancel} 
                    className="px-3 py-2 rounded hover:bg-gray-700" 
                    style={{color: TEXT_COLORS.primary}}
                  >
                    Cancelar
                  </button>
                  <button 
                    onClick={handleToggleConfirm}
                    disabled={loading}
                    className="px-3 py-2 rounded text-white"
                    style={{ 
                      background: userToToggle.is_active ? '#F59E0B' : '#16A085',
                      opacity: loading ? 0.6 : 1
                    }}
                  >
                    {loading ? 'Procesando...' : (userToToggle.is_active ? 'Desactivar' : 'Activar')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal usuario creado */}
        {showUserCreated && createdUser && (
          <div className="fixed inset-0 z-50">
            <div className="absolute inset-0 bg-black/60" onClick={handleCloseUserCreated} />
            <div className="absolute inset-0 flex items-center justify-center px-4">
              <div className="w-full max-w-lg rounded-2xl shadow-2xl" style={MODAL_STYLES}>
                <div className="px-5 py-3 border-b text-center" style={MODAL_BORDER_STYLES}>
                  <h3 className="text-lg font-semibold" style={{color: '#16A085'}}>
                    Usuario Creado
                  </h3>
                </div>
                <div className="px-5 py-4" style={{color: TEXT_COLORS.muted}}>
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-base" style={{color: TEXT_COLORS.primary}}>
                      Informar al cliente:
                    </p>
                    <button
                      onClick={handleCopyCreatedMessage}
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
{generateCreatedUserMessage(createdUser)}
                    </pre>
                  </div>
                  <p className="text-sm mt-4 text-center" style={{color: TEXT_COLORS.secondary}}>
                    Enviar por <a 
                      href={generateMailtoLink(createdUser?.email, generateCreatedUserMessage(createdUser))}
                      className="text-teal-400 hover:text-teal-300 underline"
                    >
                      email
                    </a>
                  </p>
                </div>
                <div className="flex justify-center px-5 py-3 border-t" style={MODAL_BORDER_STYLES}>
                  <button
                    onClick={handleCloseUserCreated}
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

        {/* Modal Usuario Editado */}
        {showUserEdited && (
          <div className="fixed inset-0 z-50">
            <div className="absolute inset-0 bg-black/60" onClick={handleCloseUserEdited} />
            <div className="absolute inset-0 flex items-center justify-center px-4">
              <div className="w-full max-w-lg rounded-2xl shadow-2xl" style={MODAL_STYLES}>
                <div className="px-5 py-3 border-b text-center" style={MODAL_BORDER_STYLES}>
                  <h3 className="text-lg font-semibold" style={{color: '#16A085'}}>
                    Usuario Editado
                  </h3>
                </div>
                <div className="px-5 py-4" style={{color: TEXT_COLORS.muted}}>
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-base" style={{color: TEXT_COLORS.primary}}>
                      Informar al cliente:
                    </p>
                    <button
                      onClick={handleCopyEditedMessage}
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
{generateEditedUserMessage(editedUser, editedUserData)}
                    </pre>
                  </div>
                  <p className="text-sm mt-4 text-center" style={{color: TEXT_COLORS.secondary}}>
                    Enviar por <a 
                      href={generateMailtoLink(editedUserData?.email || editedUser?.email, generateEditedUserMessage(editedUser, editedUserData))}
                      className="text-teal-400 hover:text-teal-300 underline"
                    >
                      email
                    </a>
                  </p>
                </div>
                <div className="flex justify-center px-5 py-3 border-t" style={MODAL_BORDER_STYLES}>
                  <button
                    onClick={handleCloseUserEdited}
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

        {/* Modal Usuario Desactivado/Activado */}
        {showUserToggled && (
          <div className="fixed inset-0 z-50">
            <div className="absolute inset-0 bg-black/60" onClick={handleCloseUserToggled} />
            <div className="absolute inset-0 flex items-center justify-center px-4">
              <div className="w-full max-w-lg rounded-2xl shadow-2xl" style={MODAL_STYLES}>
                <div className="px-5 py-3 border-b text-center" style={MODAL_BORDER_STYLES}>
                  <h3 className="text-lg font-semibold" style={{color: toggledUserData?.is_active ? '#16A085' : '#F59E0B'}}>
                    Usuario {toggledUserData?.is_active ? 'Activado' : 'Desactivado'}
                  </h3>
                </div>
                <div className="px-5 py-4" style={{color: TEXT_COLORS.muted}}>
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-base" style={{color: TEXT_COLORS.primary}}>
                      Informar al cliente:
                    </p>
                    <button
                      onClick={handleCopyToggledMessage}
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
{generateToggledUserMessage(toggledUser, toggledUserData)}
                    </pre>
                  </div>
                  <p className="text-sm mt-4 text-center" style={{color: TEXT_COLORS.secondary}}>
                    Enviar por <a 
                      href={generateMailtoLink(toggledUser?.email, generateToggledUserMessage(toggledUser, toggledUserData))}
                      className="text-teal-400 hover:text-teal-300 underline"
                    >
                      email
                    </a>
                  </p>
                </div>
                <div className="flex justify-center px-5 py-3 border-t" style={MODAL_BORDER_STYLES}>
                  <button
                    onClick={handleCloseUserToggled}
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
          </>
        ) : null}
      </div>
    </div>
  );
};

export default AdminScreen;


