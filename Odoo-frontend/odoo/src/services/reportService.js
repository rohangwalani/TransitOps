import api from './api';

export const reportService = {
  exportFleetReport: async () => {
    const response = await api.get('/api/reports/export', {
      responseType: 'blob', // Important: indicates that the response is a file
    });
    return response.data;
  },
};

export default reportService;
