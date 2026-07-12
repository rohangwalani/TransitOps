import api from './api';

export const vehiclesService = {
  getAll: async () => {
    const res = await api.get('/api/vehicles');
    return res.data;
  },

  search: async (params = {}) => {
    const res = await api.get('/api/vehicles/search', { params });
    return res.data; // Page<VehicleResponseDTO>
  },

  getById: async (id) => {
    const res = await api.get(`/api/vehicles/${id}`);
    return res.data;
  },

  create: async (vehicle) => {
    const res = await api.post('/api/vehicles', vehicle);
    return res.data;
  },

  update: async (id, vehicle) => {
    const res = await api.put(`/api/vehicles/${id}`, vehicle);
    return res.data;
  },

  updateStatus: async (id, status) => {
    const res = await api.patch(`/api/vehicles/${id}/status`, null, { params: { status } });
    return res.data;
  },

  delete: async (id) => {
    await api.delete(`/api/vehicles/${id}`);
    return id;
  },
};

export default vehiclesService;
