import api from './axios';

const getAllUsers = () => {
  return api.get('/users');
};

const getUserById = (id) => {
  return api.get(`/users/${id}`);
};

const updateUser = (id, data) => {
  return api.put(`/users/${id}`, data);
};

const deleteUser = (id) => {
  return api.delete(`/users/${id}`);
};

const UserService = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};

export default UserService;
