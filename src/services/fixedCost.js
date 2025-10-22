import apiRequest from './apiClient';

export const getFixedCosts = (queryParam = '') => {
  return apiRequest(`/api/fixed-cost/${queryParam}`)
    .then(data => data.json());
};

export const postFixedCost = (data) => {
  return apiRequest('/api/fixed-cost/', 'POST', data);
};

export const patchFixedCost = (id, data) => {
  return apiRequest(`/api/fixed-cost/${id}/`, 'PATCH', data);
};

export const putFixedCost = (id, data) => {
  return apiRequest(`/api/fixed-cost/${id}/`, 'PUT', data);
};
