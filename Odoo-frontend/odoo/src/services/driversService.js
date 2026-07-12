import api from './api';

export const driversService = {
  getAll: async () => {
    const res = await api.get('/api/drivers');
    return res.data;
  },

  search: async (params = {}) => {
    const res = await api.get('/api/drivers/search', { params });
    return res.data;
  },

  getById: async (id) => {
    const res = await api.get(`/api/drivers/${id}`);
    return res.data;
  },

  create: async (driver) => {
    const res = await api.post('/api/drivers', driver);
    return res.data;
  },

  update: async (id, driver) => {
    const res = await api.put(`/api/drivers/${id}`, driver);
    return res.data;
  },

  updateStatus: async (id, status) => {
    const res = await api.patch(`/api/drivers/${id}/status`, null, { params: { status } });
    return res.data;
  },

  getExpiringLicenses: async (daysAhead = 30) => {
    const res = await api.get('/api/drivers/expiring-licenses', { params: { daysAhead } });
    return res.data;
  },

  delete: async (id) => {
    await api.delete(`/api/drivers/${id}`);
    return id;
  },
};

export default driversService;
