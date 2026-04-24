import api from './axios';

const login = (email, password) => {
  return api.post('/auth/login', { email, password });
};

const register = (name, email, password, role) => {
  return api.post('/auth/register', { name, email, password, role });
};

const logout = () => {
  localStorage.removeItem('jwt_token');
  localStorage.removeItem('user');
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem('user'));
};

const AuthService = {
  login,
  register,
  logout,
  getCurrentUser,
};

export default AuthService;
