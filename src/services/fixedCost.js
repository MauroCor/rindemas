import apiRequest from './apiClient';

export const getFixedCosts = (queryParam = '') => {
  return apiRequest(`/api/fixed-cost/${queryParam}`)
    .then(data => data.json());
};

export const postFixedCost = (data) => {
  return apiRequest('/api/fixed-cost/', 'POST', data);
};

export const patchFixedCost = (data) => {
  return apiRequest('/api/fixed-cost/', 'PATCH', data);
};

export const putFixedCost = (data) => {
  return apiRequest('/api/fixed-cost/', 'PUT', data);
};
