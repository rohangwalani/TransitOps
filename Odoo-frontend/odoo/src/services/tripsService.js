import api from './api';

export const tripsService = {
  getAll: async () => {
    const res = await api.get('/api/trips');
    return res.data;
  },

  search: async (params = {}) => {
    const res = await api.get('/api/trips/search', { params });
    return res.data;
  },

  getById: async (id) => {
    const res = await api.get(`/api/trips/${id}`);
    return res.data;
  },

  create: async (trip) => {
    const res = await api.post('/api/trips', trip);
    return res.data;
  },

  dispatch: async (id) => {
    const res = await api.post(`/api/trips/${id}/dispatch`);
    return res.data;
  },

  complete: async (id, payload = {}) => {
    const res = await api.post(`/api/trips/${id}/complete`, payload);
    return res.data;
  },

  cancel: async (id, reason) => {
    const res = await api.post(`/api/trips/${id}/cancel`, null, {
      params: reason ? { reason } : {},
    });
    return res.data;
  },

  delete: async (id) => {
    await api.delete(`/api/trips/${id}`);
    return id;
  },
};

export default tripsService;
