import api from './api';

export const authService = {
  login: async (email, password) => {
    const response = await api.post('/api/auth/login', { email, password });
    return response.data; // { token, id, name, email, roles }
  },

  signup: async (payload) => {
    const response = await api.post('/api/auth/signup', payload);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    return JSON.parse(localStorage.getItem('user') || 'null');
  },

  isAuthenticated: () => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    return !!(user?.token);
  },
};

export default authService;
