import React, { useState, useEffect } from 'react';
import { createUser, updateUser, deleteUser, toggleUserStatus } from '../services/admin';
import apiRequest from '../services/apiClient';
import SpinnerComponent from '../components/SpinnerComponent';
import UserTable from '../components/admin/UserTable';
import UserForm from '../components/admin/UserForm';
import UserModals from '../components/admin/UserModals';
import { sortUsers, copyToClipboard } from '../utils/adminUtils';
import { logError } from '../utils/logger';

const AdminScreen = () => {
  const [uiState, setUiState] = useState({
    loading: false,
    showCreateForm: false,
    showDeleteConfirm: false,
    showToggleConfirm: false,
    showUserCreated: false,
    showUserEdited: false,
    showUserToggled: false,
    copied: false,
    hasAccess: true,
    backendError: '',
    editBackendError: '',
    toggleBackendError: ''
  });
  
  const [userState, setUserState] = useState({
    users: [],
    totalUsers: 0,
    editingUser: null,
    userToDelete: null,
    userToToggle: null,
    createdUser: null,
    editedUser: null,
    toggledUser: null,
    editedUserData: null,
    toggledUserData: null
  });
  
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    password: ''
  });
  
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  const loadUsers = async () => {
    setUiState(prev => ({ ...prev, loading: true }));
    try {
      const response = await apiRequest('/api/users/', 'GET', null, true)
        .then(data => data.json());
      
      const sortedUsers = sortUsers(response.users || []);
      
      setUserState(prev => ({
        ...prev,
        users: sortedUsers,
        totalUsers: response.total || 0
      }));
    } catch (error) {
      if (error.status === 403) {
        setUiState(prev => ({ ...prev, hasAccess: false }));
        setUserState(prev => ({ ...prev, users: [], totalUsers: 0 }));
      }
    } finally {
      setUiState(prev => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

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
    setUserState(prev => ({ ...prev, editingUser: null }));
    setUiState(prev => ({ ...prev, showCreateForm: false, backendError: '' }));
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setUiState(prev => ({ ...prev, loading: true, backendError: '' }));
    try {
      await createUser(formData);
      setUserState(prev => ({ ...prev, createdUser: formData }));
      await loadUsers();
      resetForm();
      setUiState(prev => ({ ...prev, showUserCreated: true }));
    } catch (error) {
      setUiState(prev => ({ ...prev, backendError: 'Error al crear usuario. Verifique los datos.' }));
    } finally {
      setUiState(prev => ({ ...prev, loading: false }));
    }
  };

  const handleEditUser = (user) => {
    setUserState(prev => ({ ...prev, editingUser: user }));
    setFormData({
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      username: user.username || '',
      email: user.email || '',
      password: ''
    });
    setUiState(prev => ({ ...prev, showCreateForm: true }));
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    if (!userState.editingUser) return;
    
    setUiState(prev => ({ ...prev, loading: true, editBackendError: '' }));
    try {
      await updateUser(userState.editingUser.id, formData);
      setUserState(prev => ({
        ...prev,
        editedUser: userState.editingUser,
        editedUserData: formData
      }));
      await loadUsers();
      resetForm();
      setUiState(prev => ({ ...prev, showUserEdited: true }));
    } catch (error) {
      setUiState(prev => ({ ...prev, editBackendError: 'Error al actualizar usuario. Verifique los datos.' }));
    } finally {
      setUiState(prev => ({ ...prev, loading: false }));
    }
  };

  const handleDeleteClick = (user) => {
    setUserState(prev => ({ ...prev, userToDelete: user }));
    setUiState(prev => ({ ...prev, showDeleteConfirm: true }));
    setDeleteConfirmText('');
  };

  const handleDeleteConfirm = async () => {
    if (deleteConfirmText.toLowerCase() !== 'eliminar' || !userState.userToDelete) return;
    
    setUiState(prev => ({ ...prev, loading: true }));
    try {
      await deleteUser(userState.userToDelete.id);
      await loadUsers();
    } catch (error) {
      // Error silencioso en producción
    } finally {
      setUiState(prev => ({ ...prev, loading: false, showDeleteConfirm: false }));
      setUserState(prev => ({ ...prev, userToDelete: null }));
      setDeleteConfirmText('');
    }
  };

  const handleDeleteCancel = () => {
    setUiState(prev => ({ ...prev, showDeleteConfirm: false }));
    setUserState(prev => ({ ...prev, userToDelete: null }));
    setDeleteConfirmText('');
  };

  const handleToggleUserClick = (user) => {
    setUserState(prev => ({ ...prev, userToToggle: user }));
    setUiState(prev => ({ ...prev, showToggleConfirm: true }));
  };

  const handleToggleConfirm = async () => {
    if (!userState.userToToggle) return;
    
    setUiState(prev => ({ ...prev, loading: true, toggleBackendError: '' }));
    try {
      await toggleUserStatus(userState.userToToggle.id, userState.userToToggle.is_active);
      setUserState(prev => ({
        ...prev,
        toggledUser: userState.userToToggle,
        toggledUserData: { is_active: !userState.userToToggle.is_active }
      }));
      setUiState(prev => ({
        ...prev,
        showToggleConfirm: false,
        showUserToggled: true
      }));
      setUserState(prev => ({ ...prev, userToToggle: null }));
      await loadUsers();
    } catch (error) {
      setUiState(prev => ({ ...prev, toggleBackendError: 'Error al cambiar estado del usuario.' }));
    } finally {
      setUiState(prev => ({ ...prev, loading: false }));
    }
  };

  const handleToggleCancel = () => {
    setUiState(prev => ({ ...prev, showToggleConfirm: false }));
    setUserState(prev => ({ ...prev, userToToggle: null }));
  };

  const handleCloseUserCreated = () => {
    setUiState(prev => ({
      ...prev,
      showUserCreated: false,
      copied: false
    }));
    setUserState(prev => ({ ...prev, createdUser: null }));
  };

  const handleCloseUserEdited = () => {
    setUiState(prev => ({ ...prev, showUserEdited: false }));
    setUserState(prev => ({
      ...prev,
      editedUser: null,
      editedUserData: null
    }));
  };

  const handleCloseUserToggled = () => {
    setUiState(prev => ({ ...prev, showUserToggled: false }));
    setUserState(prev => ({
      ...prev,
      toggledUser: null,
      toggledUserData: null
    }));
  };

  const handleCopyMessage = async (message) => {
    const success = await copyToClipboard(message);
    if (success) {
      setUiState(prev => ({ ...prev, copied: true }));
      setTimeout(() => {
        setUiState(prev => ({ ...prev, copied: false }));
      }, 2000);
    }
  };

  const handleDeleteConfirmChange = (e) => {
    setDeleteConfirmText(e.target.value);
  };

  const handleSubmit = userState.editingUser ? handleUpdateUser : handleCreateUser;

  if (!uiState.hasAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{background: '#1F2937'}}>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-400 mb-4">Acceso Denegado</h1>
          <p className="text-gray-400">No tienes permisos para acceder a esta sección.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{background: '#1F2937', color: '#F3F4F6'}}>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2">Panel de Administración</h1>
            <p className="text-gray-400">Gestiona usuarios y configuraciones del sistema</p>
          </div>

          <div className="bg-gray-800 rounded-lg shadow-lg">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Usuarios ({userState.totalUsers})</h2>
                <button
                  onClick={() => setUiState(prev => ({ ...prev, showCreateForm: true }))}
                  className="px-4 py-2 rounded-md text-white"
                  style={{background: '#16A085'}}
                >
                  Crear Usuario
                </button>
              </div>

              {uiState.loading ? (
                <div className="flex justify-center py-8">
                  <SpinnerComponent />
                </div>
              ) : (
                <UserTable
                  users={userState.users}
                  onEditUser={handleEditUser}
                  onToggleUser={handleToggleUserClick}
                  onDeleteUser={handleDeleteClick}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <UserForm
        showCreateForm={uiState.showCreateForm}
        editingUser={userState.editingUser}
        formData={formData}
        loading={uiState.loading}
        backendError={uiState.backendError}
        editBackendError={uiState.editBackendError}
        onInputChange={handleInputChange}
        onSubmit={handleSubmit}
        onCancel={resetForm}
      />

      <UserModals
        showUserCreated={uiState.showUserCreated}
        createdUser={userState.createdUser}
        copied={uiState.copied}
        onCloseUserCreated={handleCloseUserCreated}
        onCopyMessage={handleCopyMessage}
        showUserEdited={uiState.showUserEdited}
        editedUser={userState.editedUser}
        editedUserData={userState.editedUserData}
        onCloseUserEdited={handleCloseUserEdited}
        showUserToggled={uiState.showUserToggled}
        toggledUser={userState.toggledUser}
        toggledUserData={userState.toggledUserData}
        onCloseUserToggled={handleCloseUserToggled}
        showDeleteConfirm={uiState.showDeleteConfirm}
        userToDelete={userState.userToDelete}
        deleteConfirmText={deleteConfirmText}
        onDeleteConfirmChange={handleDeleteConfirmChange}
        onDeleteConfirm={handleDeleteConfirm}
        onDeleteCancel={handleDeleteCancel}
        showToggleConfirm={uiState.showToggleConfirm}
        userToToggle={userState.userToToggle}
        toggleBackendError={uiState.toggleBackendError}
        onToggleConfirm={handleToggleConfirm}
        onToggleCancel={handleToggleCancel}
      />
    </div>
  );
};

export default AdminScreen;