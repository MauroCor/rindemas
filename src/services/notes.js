import apiRequest from './apiClient';

export const getNotes = (monthDate) => {
  return apiRequest(`/api/notes/${monthDate}/`)
    .then(data => data.json());
};

export const postNote = (data) => {
  return apiRequest('/api/notes/', 'POST', data)
    .then(response => response.json());
};

export const deleteNote = (id) => {
  return apiRequest(`/api/notes/${id}/`, 'DELETE');
};
