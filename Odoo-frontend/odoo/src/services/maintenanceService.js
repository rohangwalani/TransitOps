import api from './api';

export const maintenanceService = {
  getAll: async () => {
    const res = await api.get('/api/maintenance');
    return res.data;
  },

  search: async (params = {}) => {
    const res = await api.get('/api/maintenance/search', { params });
    return res.data;
  },

  getById: async (id) => {
    const res = await api.get(`/api/maintenance/${id}`);
    return res.data;
  },

  create: async (task) => {
    const res = await api.post('/api/maintenance', task);
    return res.data;
  },

  update: async (id, task) => {
    const res = await api.put(`/api/maintenance/${id}`, task);
    return res.data;
  },

  activate: async (id) => {
    const res = await api.post(`/api/maintenance/${id}/activate`);
    return res.data;
  },

  complete: async (id, actualCost) => {
    const res = await api.post(`/api/maintenance/${id}/complete`, null, {
      params: actualCost != null ? { actualCost } : {},
    });
    return res.data;
  },

  delete: async (id) => {
    await api.delete(`/api/maintenance/${id}`);
    return id;
  },
};

export default maintenanceService;
