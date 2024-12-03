import apiRequest from './apiClient';

export const getCardSpends = () => {
  return apiRequest('/api/card-spend/')
    .then(data => data.json());
};

export const postCardSpend = (data) => {
  return apiRequest('/api/card-spend/', 'POST', data);
};

export const deleteCardSpend = (id) => {
  return apiRequest(`/api/card-spend/${id}/`, 'DELETE');
};
