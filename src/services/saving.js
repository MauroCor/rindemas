import apiRequest from './apiClient';

export const getSavings = (queryParam = '') => {
  return apiRequest(`/api/saving/${queryParam}`)
    .then(data => data.json());
};

export const postSaving = (data) => {
  return apiRequest('/api/saving/', 'POST', data);
};

export const patchSaving = (id, data) => {
  return apiRequest(`/api/saving/${id}/`, 'PATCH', data);
};

export const putSaving = (data) => {
  return apiRequest('/api/saving/', 'PUT', data);
};

export const deleteSaving = (id) => {
  return apiRequest(`/api/saving/${id}/`, 'DELETE');
};
