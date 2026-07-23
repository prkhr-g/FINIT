import api from './api';

// Matches the real backend routes in fint-backend (src/finance/*) —
// the previous version of this file called /finance/summary and
// /finance/transactions, which don't exist on the backend at all.
// Each finance category is its own resource, exactly like the backend.

export interface IncomeEntry {
  id: string;
  source: string;
  category: string;
  amount: number;
  frequency: string;
  startDate?: string;
  endDate?: string;
  notes?: string;
}

export interface ExpenseEntry {
  id: string;
  title: string;
  category: string;
  amount: number;
  paymentMethod: string;
  expenseDate?: string;
  notes?: string;
}

export const financeService = {
  // Income
  getIncomes: (): Promise<IncomeEntry[]> => api.get('/income'),
  addIncome: (data: Omit<IncomeEntry, 'id'>): Promise<IncomeEntry> => api.post('/income', data),
  updateIncome: (id: string, data: Partial<Omit<IncomeEntry, 'id'>>): Promise<IncomeEntry> =>
    api.patch(`/income/${id}`, data),
  deleteIncome: (id: string): Promise<void> => api.delete(`/income/${id}`),

  // Expense
  getExpenses: (): Promise<ExpenseEntry[]> => api.get('/expense'),
  addExpense: (data: Omit<ExpenseEntry, 'id'>): Promise<ExpenseEntry> => api.post('/expense', data),
  updateExpense: (id: string, data: Partial<Omit<ExpenseEntry, 'id'>>): Promise<ExpenseEntry> =>
    api.patch(`/expense/${id}`, data),
  deleteExpense: (id: string): Promise<void> => api.delete(`/expense/${id}`),
};
