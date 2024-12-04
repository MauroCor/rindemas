import apiRequest from './apiClient';

export const getUser = () => {
  return apiRequest('/api/user/', 'GET', null, true)
    .then(data => data.json());
};
