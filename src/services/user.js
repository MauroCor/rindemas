import apiRequest from './apiClient';

export const getUser = () => {
  return apiRequest('/api/user/', 'GET', null, true)
    .then(data => data.json());
};

export const changePassword = async ({ old_password, new_password, confirm_password }) => {
  const res = await apiRequest('/api/users/me/change-password/', 'POST', {
    old_password,
    new_password,
    confirm_password
  });
  return res.json();
};
