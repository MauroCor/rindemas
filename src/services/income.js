import apiRequest from './apiClient';

export const getIncomes = (queryParam = '') => {
  return apiRequest(`/api/income/${queryParam}`)
    .then(data => data.json());
};

export const postIncome = (data) => {
  return apiRequest('/api/income/', 'POST', data);
};

export const patchIncome = (data) => {
  return apiRequest('/api/income/', 'PATCH', data);
};

export const putIncome = (data) => {
  return apiRequest('/api/income/', 'PUT', data);
};
