import api from './api';

export const fuelService = {
  getAll: async () => {
    const res = await api.get('/api/fuel');
    return res.data;
  },

  search: async (params = {}) => {
    const res = await api.get('/api/fuel/search', { params });
    return res.data;
  },

  getById: async (id) => {
    const res = await api.get(`/api/fuel/${id}`);
    return res.data;
  },

  create: async (log) => {
    const res = await api.post('/api/fuel', log);
    return res.data;
  },

  update: async (id, log) => {
    const res = await api.put(`/api/fuel/${id}`, log);
    return res.data;
  },

  delete: async (id) => {
    await api.delete(`/api/fuel/${id}`);
    return id;
  },

  getSummary: async () => {
    const res = await api.get('/api/fuel/summary');
    return res.data;
  },
};

export default fuelService;
