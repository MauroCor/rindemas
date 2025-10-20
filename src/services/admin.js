import apiRequest from './apiClient';

// Obtener lista de usuarios
export const getUsers = () => {
  return apiRequest('/api/users/', 'GET', null, true)
    .then(data => data.json())
    .then(response => response.users || []);
};

// Crear nuevo usuario
export const createUser = (userData) => {
  return apiRequest('/api/users/', 'POST', userData, true)
    .then(data => data.json());
};

// Actualizar usuario
export const updateUser = (userId, userData) => {
  return apiRequest(`/api/users/${userId}/`, 'PUT', userData, true)
    .then(data => data.json());
};

// Eliminar usuario
export const deleteUser = (userId) => {
  return apiRequest(`/api/users/${userId}/`, 'DELETE', null, true)
    .then(data => data.json());
};

// Activar/Desactivar usuario
export const toggleUserStatus = (userId, isActive) => {
  return apiRequest(`/api/users/${userId}/`, 'PATCH', { is_active: !isActive }, true)
    .then(data => data.json());
};
