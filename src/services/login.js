import apiRequest from './apiClient';

export const postToken = (username, password) => {
  return apiRequest('/api/token/', 'POST', { username, password }, true)
    .then(data => data.json())
    .then(json => json.access);
};
