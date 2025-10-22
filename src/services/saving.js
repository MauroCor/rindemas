import apiRequest from './apiClient';

export const getSavings = (queryParam = '', includeProjections = false) => {
  const projectionParam = includeProjections ? '?projection=true' : '?projection=false';
  const fullQuery = queryParam ? `${queryParam}&projection=${includeProjections}` : projectionParam;
  return apiRequest(`/api/saving/${fullQuery}`)
    .then(data => data.json());
};

export const postSaving = (data) => {
  return apiRequest('/api/saving/', 'POST', data);
};

export const patchSaving = (id, data) => {
  return apiRequest(`/api/saving/${id}/`, 'PATCH', data);
};

export const putSaving = (id, data) => {
  return apiRequest(`/api/saving/${id}/`, 'PUT', data);
};

export const deleteSaving = (id) => {
  return apiRequest(`/api/saving/${id}/`, 'DELETE');
};
