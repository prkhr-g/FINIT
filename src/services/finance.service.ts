import api from './api';

// ── Response unwrapper ────────────────────────────────────────────────────────
// All finance GET /list endpoints return { data: T[], total: number }.
// This helper extracts just the array so callers get a flat list.
const unwrap = (res: any): any => {
  if (Array.isArray(res)) return res;
  return res?.data ?? [];
};

// ── Income ──────────────────────────────────────────────────────────────────
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

// ── Expense ──────────────────────────────────────────────────────────────────
export interface ExpenseEntry {
  id: string;
  title: string;
  category: string;
  amount: number;
  paymentMethod: string;
  expenseDate?: string;
  notes?: string;
}

// ── Financial Account ─────────────────────────────────────────────────────────
export interface AccountEntry {
  id: string;
  bankName: string;
  accountName: string;
  accountType: string;
  currentBalance: number;
  status: string;
}

// ── Asset ────────────────────────────────────────────────────────────────────
export interface AssetEntry {
  id: string;
  name: string;
  assetType: string;
  purchaseValue: number;
  currentValue: number;
}

// ── Investment ───────────────────────────────────────────────────────────────
export interface InvestmentEntry {
  id: string;
  name: string;
  investmentType: string;
  quantity?: number;
  buyPrice: number;
  currentPrice: number;
  broker?: string;
}

// ── Loan ─────────────────────────────────────────────────────────────────────
export interface LoanEntry {
  id: string;
  lenderName: string;
  loanType: string;
  principalAmount: number;
  interestRate: number;
  emiAmount: number;
  remainingBalance: number;
  startDate: string;
}

// ── Insurance ─────────────────────────────────────────────────────────────────
export interface InsuranceEntry {
  id: string;
  provider: string;
  insuranceType: string;
  premiumAmount: number;
  coverageAmount: number;
  startDate: string;
  policyNumber?: string;
}

// ── Retirement ────────────────────────────────────────────────────────────────
export interface RetirementEntry {
  id: string;
  currentAge: number;
  targetRetirementAge?: number;
  currentSavings: number;
  targetCorpus: number;
  monthlyContribution: number;
  expectedReturnRate: number;
}

// ── Financial Goal ────────────────────────────────────────────────────────────
export interface GoalEntry {
  id: string;
  title: string;
  goalType: string;
  targetAmount: number;
  currentAmount?: number;
  deadline?: string;
  status?: string;
}

// Backend routes live under /finance/* — these must match NestJS controllers.
// All GET list calls return { data: T[], total: number } — unwrap() flattens them.
export const financeService = {
  // Income → /finance/income
  getIncomes: (): Promise<IncomeEntry[]> =>
    api.get('/finance/income').then(unwrap),
  addIncome: (data: Omit<IncomeEntry, 'id'>): Promise<IncomeEntry> =>
    api.post('/finance/income', data),
  updateIncome: (id: string, data: Partial<Omit<IncomeEntry, 'id'>>): Promise<IncomeEntry> =>
    api.patch(`/finance/income/${id}`, data),
  deleteIncome: (id: string): Promise<void> =>
    api.delete(`/finance/income/${id}`),

  // Expense → /finance/expense
  getExpenses: (): Promise<ExpenseEntry[]> =>
    api.get('/finance/expense').then(unwrap),
  addExpense: (data: Omit<ExpenseEntry, 'id'>): Promise<ExpenseEntry> =>
    api.post('/finance/expense', data),
  updateExpense: (id: string, data: Partial<Omit<ExpenseEntry, 'id'>>): Promise<ExpenseEntry> =>
    api.patch(`/finance/expense/${id}`, data),
  deleteExpense: (id: string): Promise<void> =>
    api.delete(`/finance/expense/${id}`),

  // Financial Accounts → /finance/financial-account
  getAccounts: (): Promise<AccountEntry[]> =>
    api.get('/finance/financial-account').then(unwrap),
  addAccount: (data: Omit<AccountEntry, 'id'>): Promise<AccountEntry> =>
    api.post('/finance/financial-account', data),
  updateAccount: (id: string, data: Partial<Omit<AccountEntry, 'id'>>): Promise<AccountEntry> =>
    api.patch(`/finance/financial-account/${id}`, data),
  deleteAccount: (id: string): Promise<void> =>
    api.delete(`/finance/financial-account/${id}`),

  // Assets → /finance/asset
  getAssets: (): Promise<AssetEntry[]> =>
    api.get('/finance/asset').then(unwrap),
  addAsset: (data: Omit<AssetEntry, 'id'>): Promise<AssetEntry> =>
    api.post('/finance/asset', data),
  updateAsset: (id: string, data: Partial<Omit<AssetEntry, 'id'>>): Promise<AssetEntry> =>
    api.patch(`/finance/asset/${id}`, data),
  deleteAsset: (id: string): Promise<void> =>
    api.delete(`/finance/asset/${id}`),

  // Investments → /finance/investment
  getInvestments: (): Promise<InvestmentEntry[]> =>
    api.get('/finance/investment').then(unwrap),
  addInvestment: (data: Omit<InvestmentEntry, 'id'>): Promise<InvestmentEntry> =>
    api.post('/finance/investment', data),
  updateInvestment: (id: string, data: Partial<Omit<InvestmentEntry, 'id'>>): Promise<InvestmentEntry> =>
    api.patch(`/finance/investment/${id}`, data),
  deleteInvestment: (id: string): Promise<void> =>
    api.delete(`/finance/investment/${id}`),

  // Loans → /finance/loan
  getLoans: (): Promise<LoanEntry[]> =>
    api.get('/finance/loan').then(unwrap),
  addLoan: (data: Omit<LoanEntry, 'id'>): Promise<LoanEntry> =>
    api.post('/finance/loan', data),
  updateLoan: (id: string, data: Partial<Omit<LoanEntry, 'id'>>): Promise<LoanEntry> =>
    api.patch(`/finance/loan/${id}`, data),
  deleteLoan: (id: string): Promise<void> =>
    api.delete(`/finance/loan/${id}`),

  // Insurance → /finance/insurance
  getInsurances: (): Promise<InsuranceEntry[]> =>
    api.get('/finance/insurance').then(unwrap),
  addInsurance: (data: Omit<InsuranceEntry, 'id'>): Promise<InsuranceEntry> =>
    api.post('/finance/insurance', data),
  updateInsurance: (id: string, data: Partial<Omit<InsuranceEntry, 'id'>>): Promise<InsuranceEntry> =>
    api.patch(`/finance/insurance/${id}`, data),
  deleteInsurance: (id: string): Promise<void> =>
    api.delete(`/finance/insurance/${id}`),

  // Retirement → /finance/retirement
  getRetirements: (): Promise<RetirementEntry[]> =>
    api.get('/finance/retirement').then(unwrap),
  addRetirement: (data: Omit<RetirementEntry, 'id'>): Promise<RetirementEntry> =>
    api.post('/finance/retirement', data),
  updateRetirement: (id: string, data: Partial<Omit<RetirementEntry, 'id'>>): Promise<RetirementEntry> =>
    api.patch(`/finance/retirement/${id}`, data),
  deleteRetirement: (id: string): Promise<void> =>
    api.delete(`/finance/retirement/${id}`),

  // Financial Goals → /finance/financial-goal
  getGoals: (): Promise<GoalEntry[]> =>
    api.get('/finance/financial-goal').then(unwrap),
  addGoal: (data: Omit<GoalEntry, 'id'>): Promise<GoalEntry> =>
    api.post('/finance/financial-goal', data),
  updateGoal: (id: string, data: Partial<Omit<GoalEntry, 'id'>>): Promise<GoalEntry> =>
    api.patch(`/finance/financial-goal/${id}`, data),
  deleteGoal: (id: string): Promise<void> =>
    api.delete(`/finance/financial-goal/${id}`),
};
