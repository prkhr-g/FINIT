import api from './api';

export const financeService = {
  getSummary: async () => {
    return api.get('/finance/summary');
  },
  getTransactions: async (params?: any) => {
    return api.get('/finance/transactions', { params });
  },
  addTransaction: async (data: any) => {
    return api.post('/finance/transactions', data);
  },
};