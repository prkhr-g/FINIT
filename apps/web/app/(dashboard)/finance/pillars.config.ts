import { financeService } from '@/services/finance.service';

export type FieldType = 'text' | 'number' | 'select' | 'date' | 'textarea';

// Every finance record from the backend — shape varies per pillar, so the
// generic UI only relies on `id` being present and reads the rest dynamically.
export type FinanceEntry = { id: string } & Record<string, string | number | undefined>;

export interface FieldConfig {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  options?: string[];
  defaultValue?: string;
  step?: string;
  suffix?: string; // e.g. "% p.a."
}

export interface PillarConfig {
  key: string;
  label: string;
  icon: string;
  tagline: string;
  emptyMessage: string;
  formTitle: string;
  sumLabel: string;
  fields: FieldConfig[];
  list: () => Promise<FinanceEntry[]>;
  create: (data: Record<string, string | number>) => Promise<FinanceEntry>;
  remove: (id: string) => Promise<void>;
  getTitle: (e: FinanceEntry) => string;
  getMeta: (e: FinanceEntry) => string;
  getAmount: (e: FinanceEntry) => number;
  getProgress?: (e: FinanceEntry) => number | null; // 0-1, only goals use this
}

const INCOME_CATEGORIES = ['SALARY', 'BUSINESS', 'RENTAL', 'FREELANCE', 'INTEREST', 'DIVIDEND', 'PENSION', 'OTHER'];
const INCOME_FREQUENCIES = ['DAILY', 'WEEKLY', 'MONTHLY', 'QUARTERLY', 'YEARLY', 'ONE_TIME'];
const EXPENSE_CATEGORIES = ['FOOD', 'TRAVEL', 'SHOPPING', 'MEDICAL', 'RENT', 'UTILITIES', 'EDUCATION', 'ENTERTAINMENT', 'INVESTMENT', 'EMI', 'OTHER'];
const PAYMENT_METHODS = ['CASH', 'CARD', 'UPI', 'NET_BANKING', 'CHEQUE', 'OTHER'];
const ACCOUNT_TYPES = ['SAVINGS', 'CURRENT', 'WALLET', 'CREDIT'];
const ACCOUNT_STATUS = ['ACTIVE', 'INACTIVE'];
const ASSET_TYPES = ['CASH', 'SAVINGS', 'FIXED_DEPOSIT', 'PROPERTY', 'VEHICLE', 'GOLD', 'STOCKS', 'CRYPTO', 'OTHER'];
const INVESTMENT_TYPES = ['STOCKS', 'MUTUAL_FUND', 'ETF', 'NPS', 'PPF', 'FIXED_DEPOSIT', 'CRYPTO', 'OTHER'];
const LOAN_TYPES = ['HOME', 'CAR', 'EDUCATION', 'PERSONAL', 'BUSINESS', 'OTHER'];
const INSURANCE_TYPES = ['HEALTH', 'LIFE', 'VEHICLE', 'TRAVEL', 'HOME', 'OTHER'];
const GOAL_TYPES = ['EMERGENCY_FUND', 'HOUSE', 'CAR', 'MARRIAGE', 'EDUCATION', 'VACATION', 'RETIREMENT', 'OTHER'];

// The service layer is fully typed per-pillar (IncomeEntry, LoanEntry, ...),
// but the UI below treats every pillar generically. These adapters bridge
// the two without resorting to `any`.
function toList<T extends { id: string }>(fn: () => Promise<T[]>) {
  return () => fn() as unknown as Promise<FinanceEntry[]>;
}
function toCreate<C, T>(fn: (data: C) => Promise<T>) {
  return (data: Record<string, string | number>) =>
    fn(data as unknown as C) as unknown as Promise<FinanceEntry>;
}
function toRemove(fn: (id: string) => Promise<void>) {
  return fn;
}

// Small formatting helpers — every value pulled off a FinanceEntry is
// `string | number | undefined`, so these coerce consistently to string.
const str = (v?: string | number): string => (v === undefined || v === null || v === '' ? '' : String(v));
const titleCase = (v?: string | number) => {
  const s = str(v);
  return s ? s.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()) : '';
};
const joinMeta = (parts: (string | undefined)[]) => parts.filter(Boolean).join(' · ');

export const PILLARS: PillarConfig[] = [
  {
    key: 'income',
    label: 'Income',
    icon: '↑',
    tagline: 'Every rupee coming in — salary, business, rentals, and more.',
    emptyMessage: 'No income sources yet. Add one on the left to get started.',
    formTitle: 'Add income',
    sumLabel: 'Total income',
    fields: [
      { name: 'source', label: 'SOURCE', type: 'text', required: true, placeholder: 'e.g. Company salary' },
      { name: 'category', label: 'CATEGORY', type: 'select', options: INCOME_CATEGORIES, defaultValue: 'SALARY' },
      { name: 'amount', label: 'AMOUNT (₹)', type: 'number', required: true },
      { name: 'frequency', label: 'FREQUENCY', type: 'select', options: INCOME_FREQUENCIES, defaultValue: 'MONTHLY' },
    ],
    list: toList(financeService.getIncomes),
    create: toCreate(financeService.addIncome),
    remove: toRemove(financeService.deleteIncome),
    getTitle: (e) => str(e.source),
    getMeta: (e) => joinMeta([titleCase(e.category), titleCase(e.frequency)]),
    getAmount: (e) => Number(e.amount) || 0,
  },
  {
    key: 'expense',
    label: 'Expense',
    icon: '↓',
    tagline: 'Everything you spend — track it here so nothing slips through.',
    emptyMessage: 'No expenses logged yet. Add one on the left to get started.',
    formTitle: 'Add expense',
    sumLabel: 'Total expense',
    fields: [
      { name: 'title', label: 'TITLE', type: 'text', required: true, placeholder: 'e.g. Grocery shopping' },
      { name: 'category', label: 'CATEGORY', type: 'select', options: EXPENSE_CATEGORIES, defaultValue: 'FOOD' },
      { name: 'amount', label: 'AMOUNT (₹)', type: 'number', required: true },
      { name: 'paymentMethod', label: 'PAYMENT METHOD', type: 'select', options: PAYMENT_METHODS, defaultValue: 'UPI' },
    ],
    list: toList(financeService.getExpenses),
    create: toCreate(financeService.addExpense),
    remove: toRemove(financeService.deleteExpense),
    getTitle: (e) => str(e.title),
    getMeta: (e) => joinMeta([titleCase(e.category), titleCase(e.paymentMethod)]),
    getAmount: (e) => Number(e.amount) || 0,
  },
  {
    key: 'accounts',
    label: 'Accounts',
    icon: '⌘',
    tagline: 'Bank accounts and wallets where your money actually sits.',
    emptyMessage: 'No accounts added yet. Add one on the left to get started.',
    formTitle: 'Add account',
    sumLabel: 'Total balance',
    fields: [
      { name: 'bankName', label: 'BANK NAME', type: 'text', required: true, placeholder: 'e.g. HDFC Bank' },
      { name: 'accountName', label: 'ACCOUNT NAME', type: 'text', required: true, placeholder: 'e.g. Primary savings' },
      { name: 'accountType', label: 'ACCOUNT TYPE', type: 'select', options: ACCOUNT_TYPES, defaultValue: 'SAVINGS' },
      { name: 'currentBalance', label: 'CURRENT BALANCE (₹)', type: 'number', required: true },
      { name: 'status', label: 'STATUS', type: 'select', options: ACCOUNT_STATUS, defaultValue: 'ACTIVE' },
    ],
    list: toList(financeService.getAccounts),
    create: toCreate(financeService.addAccount),
    remove: toRemove(financeService.deleteAccount),
    getTitle: (e) => str(e.accountName),
    getMeta: (e) => joinMeta([str(e.bankName), titleCase(e.accountType)]),
    getAmount: (e) => Number(e.currentBalance) || 0,
  },
  {
    key: 'assets',
    label: 'Assets',
    icon: '◆',
    tagline: 'Property, gold, vehicles — what you own and what it is worth today.',
    emptyMessage: 'No assets added yet. Add one on the left to get started.',
    formTitle: 'Add asset',
    sumLabel: 'Total value',
    fields: [
      { name: 'name', label: 'NAME', type: 'text', required: true, placeholder: 'e.g. 2BHK Apartment' },
      { name: 'assetType', label: 'ASSET TYPE', type: 'select', options: ASSET_TYPES, defaultValue: 'PROPERTY' },
      { name: 'purchaseValue', label: 'PURCHASE VALUE (₹)', type: 'number', required: true },
      { name: 'currentValue', label: 'CURRENT VALUE (₹)', type: 'number', required: true },
    ],
    list: toList(financeService.getAssets),
    create: toCreate(financeService.addAsset),
    remove: toRemove(financeService.deleteAsset),
    getTitle: (e) => str(e.name),
    getMeta: (e) => titleCase(e.assetType),
    getAmount: (e) => Number(e.currentValue) || 0,
  },
  {
    key: 'investments',
    label: 'Investments',
    icon: '▲',
    tagline: 'Stocks, mutual funds, and everything working for your future.',
    emptyMessage: 'No investments added yet. Add one on the left to get started.',
    formTitle: 'Add investment',
    sumLabel: 'Portfolio value',
    fields: [
      { name: 'name', label: 'NAME', type: 'text', required: true, placeholder: 'e.g. Nifty 50 Index Fund' },
      { name: 'investmentType', label: 'TYPE', type: 'select', options: INVESTMENT_TYPES, defaultValue: 'MUTUAL_FUND' },
      { name: 'quantity', label: 'QUANTITY / UNITS', type: 'number', placeholder: 'optional' },
      { name: 'buyPrice', label: 'BUY PRICE (₹)', type: 'number', required: true },
      { name: 'currentPrice', label: 'CURRENT PRICE (₹)', type: 'number', required: true },
    ],
    list: toList(financeService.getInvestments),
    create: toCreate(financeService.addInvestment),
    remove: toRemove(financeService.deleteInvestment),
    getTitle: (e) => str(e.name),
    getMeta: (e) => joinMeta([titleCase(e.investmentType), str(e.broker)]),
    getAmount: (e) => (Number(e.currentPrice) || 0) * (Number(e.quantity) || 1),
  },
  {
    key: 'loans',
    label: 'Loans',
    icon: '▽',
    tagline: 'What you owe — EMIs, interest rates, and outstanding balances.',
    emptyMessage: 'No loans added yet. Add one on the left to get started.',
    formTitle: 'Add loan',
    sumLabel: 'Outstanding',
    fields: [
      { name: 'lenderName', label: 'LENDER', type: 'text', required: true, placeholder: 'e.g. SBI Home Loan' },
      { name: 'loanType', label: 'LOAN TYPE', type: 'select', options: LOAN_TYPES, defaultValue: 'PERSONAL' },
      { name: 'principalAmount', label: 'PRINCIPAL (₹)', type: 'number', required: true },
      { name: 'interestRate', label: 'INTEREST RATE', type: 'number', required: true, suffix: '% p.a.' },
      { name: 'emiAmount', label: 'EMI AMOUNT (₹)', type: 'number', required: true },
      { name: 'remainingBalance', label: 'REMAINING BALANCE (₹)', type: 'number', required: true },
      { name: 'startDate', label: 'START DATE', type: 'date', required: true },
    ],
    list: toList(financeService.getLoans),
    create: toCreate(financeService.addLoan),
    remove: toRemove(financeService.deleteLoan),
    getTitle: (e) => str(e.lenderName),
    getMeta: (e) => joinMeta([titleCase(e.loanType), e.interestRate !== undefined ? `${e.interestRate}% p.a.` : undefined]),
    getAmount: (e) => Number(e.remainingBalance) || 0,
  },
  {
    key: 'insurance',
    label: 'Insurance',
    icon: '❖',
    tagline: 'Health, life, and asset cover that protects everything else.',
    emptyMessage: 'No policies added yet. Add one on the left to get started.',
    formTitle: 'Add policy',
    sumLabel: 'Total coverage',
    fields: [
      { name: 'provider', label: 'PROVIDER', type: 'text', required: true, placeholder: 'e.g. HDFC Life' },
      { name: 'insuranceType', label: 'TYPE', type: 'select', options: INSURANCE_TYPES, defaultValue: 'HEALTH' },
      { name: 'premiumAmount', label: 'PREMIUM (₹)', type: 'number', required: true },
      { name: 'coverageAmount', label: 'COVERAGE (₹)', type: 'number', required: true },
      { name: 'startDate', label: 'START DATE', type: 'date', required: true },
    ],
    list: toList(financeService.getInsurances),
    create: toCreate(financeService.addInsurance),
    remove: toRemove(financeService.deleteInsurance),
    getTitle: (e) => str(e.provider),
    getMeta: (e) => joinMeta([titleCase(e.insuranceType), str(e.policyNumber)]),
    getAmount: (e) => Number(e.coverageAmount) || 0,
  },
  {
    key: 'retirement',
    label: 'Retirement',
    icon: '○',
    tagline: 'The corpus you are building for the day you stop working.',
    emptyMessage: 'No retirement plan added yet. Add one on the left to get started.',
    formTitle: 'Add retirement plan',
    sumLabel: 'Current savings',
    fields: [
      { name: 'currentAge', label: 'CURRENT AGE', type: 'number', required: true },
      { name: 'targetRetirementAge', label: 'TARGET RETIREMENT AGE', type: 'number', placeholder: 'optional' },
      { name: 'currentSavings', label: 'CURRENT SAVINGS (₹)', type: 'number', required: true },
      { name: 'targetCorpus', label: 'TARGET CORPUS (₹)', type: 'number', required: true },
      { name: 'monthlyContribution', label: 'MONTHLY CONTRIBUTION (₹)', type: 'number', required: true },
      { name: 'expectedReturnRate', label: 'EXPECTED RETURN', type: 'number', required: true, suffix: '% p.a.' },
    ],
    list: toList(financeService.getRetirements),
    create: toCreate(financeService.addRetirement),
    remove: toRemove(financeService.deleteRetirement),
    getTitle: (e) => `Retirement plan · age ${str(e.currentAge)}`,
    getMeta: (e) =>
      joinMeta([
        e.targetRetirementAge !== undefined ? `Target by age ${e.targetRetirementAge}` : undefined,
        e.expectedReturnRate !== undefined ? `${e.expectedReturnRate}% p.a.` : undefined,
      ]),
    getAmount: (e) => Number(e.currentSavings) || 0,
  },
  {
    key: 'goals',
    label: 'Goals',
    icon: '✦',
    tagline: 'The milestones you are saving toward, and how close you are.',
    emptyMessage: 'No goals set yet. Add one on the left to get started.',
    formTitle: 'Add goal',
    sumLabel: 'Saved so far',
    fields: [
      { name: 'title', label: 'TITLE', type: 'text', required: true, placeholder: 'e.g. Emergency fund' },
      { name: 'goalType', label: 'GOAL TYPE', type: 'select', options: GOAL_TYPES, defaultValue: 'EMERGENCY_FUND' },
      { name: 'targetAmount', label: 'TARGET AMOUNT (₹)', type: 'number', required: true },
      { name: 'currentAmount', label: 'CURRENT AMOUNT (₹)', type: 'number', placeholder: 'optional' },
      { name: 'deadline', label: 'DEADLINE', type: 'date', placeholder: 'optional' },
    ],
    list: toList(financeService.getGoals),
    create: toCreate(financeService.addGoal),
    remove: toRemove(financeService.deleteGoal),
    getTitle: (e) => str(e.title),
    getMeta: (e) => {
      const deadline = e.deadline
        ? `by ${new Date(str(e.deadline)).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}`
        : undefined;
      return joinMeta([titleCase(e.goalType), deadline]);
    },
    getAmount: (e) => Number(e.currentAmount) || 0,
    getProgress: (e) => {
      const target = Number(e.targetAmount) || 0;
      if (!target) return null;
      return Math.min(1, (Number(e.currentAmount) || 0) / target);
    },
  },
];
