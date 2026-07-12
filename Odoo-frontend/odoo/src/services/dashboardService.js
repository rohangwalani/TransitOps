import api from './api';

export const dashboardService = {
  getKpis: async () => {
    const res = await api.get('/api/dashboard/kpis');
    return res.data;
  },

  getSummary: async () => {
    const res = await api.get('/api/dashboard/summary');
    return res.data;
  },
};

export default dashboardService;
