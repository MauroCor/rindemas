import apiRequest from './apiClient';

export const getUser = () => {
  return apiRequest('/api/user/')
    .then(data => data.json());
};
