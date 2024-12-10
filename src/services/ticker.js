import apiRequest from './apiClient';

export const getTicker = (queryParam = '') => {
  return apiRequest(`/api/ticker/${queryParam}`)
    .then(data => data.json());
};
