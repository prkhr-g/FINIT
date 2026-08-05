import api from './api';

export const reportsService = {
  generateReport: async (params: any) => {
    return api.post('/reports/generate', params);
  },
  listReports: async () => {
    return api.get('/reports');
  },
};