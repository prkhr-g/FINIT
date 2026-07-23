'use client';

import React from 'react';
import styles from './page.module.css';
import { financeService, IncomeEntry, ExpenseEntry } from '@/services/finance.service';

type Tab = 'income' | 'expense';

const INCOME_CATEGORIES = ['SALARY', 'BUSINESS', 'RENTAL', 'FREELANCE', 'INTEREST', 'DIVIDEND', 'PENSION', 'OTHER'];
const INCOME_FREQUENCIES = ['DAILY', 'WEEKLY', 'MONTHLY', 'QUARTERLY', 'YEARLY', 'ONE_TIME'];
const EXPENSE_CATEGORIES = ['FOOD', 'TRAVEL', 'SHOPPING', 'MEDICAL', 'RENT', 'UTILITIES', 'EDUCATION', 'ENTERTAINMENT', 'INVESTMENT', 'EMI', 'OTHER'];
const PAYMENT_METHODS = ['CASH', 'CARD', 'UPI', 'NET_BANKING', 'CHEQUE', 'OTHER'];

export default function FinancePage() {
  const [tab, setTab] = React.useState<Tab>('income');

  const [incomes, setIncomes] = React.useState<IncomeEntry[]>([]);
  const [expenses, setExpenses] = React.useState<ExpenseEntry[]>([]);
  const [loadingList, setLoadingList] = React.useState(true);

  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);

  // Income form state
  const [incomeForm, setIncomeForm] = React.useState({
    source: '',
    category: 'SALARY',
    amount: '',
    frequency: 'MONTHLY',
  });

  // Expense form state
  const [expenseForm, setExpenseForm] = React.useState({
    title: '',
    category: 'FOOD',
    amount: '',
    paymentMethod: 'UPI',
  });

  const loadData = React.useCallback(async () => {
    setLoadingList(true);
    try {
      const [inc, exp] = await Promise.all([
        financeService.getIncomes(),
        financeService.getExpenses(),
      ]);
      setIncomes(inc);
      setExpenses(exp);
    } catch {
      // Non-fatal on first load (e.g. brand new user with nothing yet) —
      // lists just stay empty, no error banner needed for a GET.
    } finally {
      setLoadingList(false);
    }
  }, []);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const resetMessages = () => {
    setError(null);
    setSuccess(null);
  };

  const handleAddIncome = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();
    if (!incomeForm.source.trim() || !incomeForm.amount) {
      setError('Please fill in source and amount.');
      return;
    }
    setSubmitting(true);
    try {
      await financeService.addIncome({
        source: incomeForm.source.trim(),
        category: incomeForm.category,
        amount: Number(incomeForm.amount),
        frequency: incomeForm.frequency,
      });
      setSuccess('Income added.');
      setIncomeForm({ source: '', category: 'SALARY', amount: '', frequency: 'MONTHLY' });
      loadData();
    } catch (err: any) {
      setError(err.message || 'Could not add income.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();
    if (!expenseForm.title.trim() || !expenseForm.amount) {
      setError('Please fill in title and amount.');
      return;
    }
    setSubmitting(true);
    try {
      await financeService.addExpense({
        title: expenseForm.title.trim(),
        category: expenseForm.category,
        amount: Number(expenseForm.amount),
        paymentMethod: expenseForm.paymentMethod,
      });
      setSuccess('Expense added.');
      setExpenseForm({ title: '', category: 'FOOD', amount: '', paymentMethod: 'UPI' });
      loadData();
    } catch (err: any) {
      setError(err.message || 'Could not add expense.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteIncome = async (id: string) => {
    try {
      await financeService.deleteIncome(id);
      setIncomes((prev) => prev.filter((i) => i.id !== id));
    } catch {
      setError('Could not delete that income entry.');
    }
  };

  const handleDeleteExpense = async (id: string) => {
    try {
      await financeService.deleteExpense(id);
      setExpenses((prev) => prev.filter((e) => e.id !== id));
    } catch {
      setError('Could not delete that expense entry.');
    }
  };

  const incomeTotal = incomes.reduce((sum, i) => sum + Number(i.amount), 0);
  const expenseTotal = expenses.reduce((sum, e) => sum + Number(e.amount), 0);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Finance</h1>
          <p className={styles.subtitle}>
            Add your income and expenses here — this data powers your FINT Score.
          </p>
        </div>
      </div>

      <div className={styles.tabRow}>
        <button
          className={`${styles.tab} ${tab === 'income' ? styles.tabActive : ''}`}
          onClick={() => { setTab('income'); resetMessages(); }}
        >
          INCOME
        </button>
        <button
          className={`${styles.tab} ${tab === 'expense' ? styles.tabActive : ''}`}
          onClick={() => { setTab('expense'); resetMessages(); }}
        >
          EXPENSE
        </button>
      </div>

      <div className={styles.layout}>
        {tab === 'income' ? (
          <form className={styles.formCard} onSubmit={handleAddIncome}>
            <h2 className={styles.formTitle}>Add income</h2>

            <div className={styles.field}>
              <label className={styles.label}>SOURCE</label>
              <input
                className={styles.input}
                placeholder="e.g. Company salary"
                value={incomeForm.source}
                onChange={(e) => setIncomeForm({ ...incomeForm, source: e.target.value })}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>CATEGORY</label>
              <select
                className={styles.select}
                value={incomeForm.category}
                onChange={(e) => setIncomeForm({ ...incomeForm, category: e.target.value })}
              >
                {INCOME_CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className={styles.row2}>
              <div className={styles.field}>
                <label className={styles.label}>AMOUNT (₹)</label>
                <input
                  className={styles.input}
                  type="number"
                  min="0"
                  placeholder="0"
                  value={incomeForm.amount}
                  onChange={(e) => setIncomeForm({ ...incomeForm, amount: e.target.value })}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>FREQUENCY</label>
                <select
                  className={styles.select}
                  value={incomeForm.frequency}
                  onChange={(e) => setIncomeForm({ ...incomeForm, frequency: e.target.value })}
                >
                  {INCOME_FREQUENCIES.map((f) => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>
            </div>

            <button className={styles.submitBtn} type="submit" disabled={submitting}>
              {submitting ? 'Adding…' : 'Add income'}
            </button>
            {error && <p className={styles.errorText}>{error}</p>}
            {success && <p className={styles.successText}>{success}</p>}
          </form>
        ) : (
          <form className={styles.formCard} onSubmit={handleAddExpense}>
            <h2 className={styles.formTitle}>Add expense</h2>

            <div className={styles.field}>
              <label className={styles.label}>TITLE</label>
              <input
                className={styles.input}
                placeholder="e.g. Grocery shopping"
                value={expenseForm.title}
                onChange={(e) => setExpenseForm({ ...expenseForm, title: e.target.value })}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>CATEGORY</label>
              <select
                className={styles.select}
                value={expenseForm.category}
                onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value })}
              >
                {EXPENSE_CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className={styles.row2}>
              <div className={styles.field}>
                <label className={styles.label}>AMOUNT (₹)</label>
                <input
                  className={styles.input}
                  type="number"
                  min="0"
                  placeholder="0"
                  value={expenseForm.amount}
                  onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>PAYMENT METHOD</label>
                <select
                  className={styles.select}
                  value={expenseForm.paymentMethod}
                  onChange={(e) => setExpenseForm({ ...expenseForm, paymentMethod: e.target.value })}
                >
                  {PAYMENT_METHODS.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
            </div>

            <button className={styles.submitBtn} type="submit" disabled={submitting}>
              {submitting ? 'Adding…' : 'Add expense'}
            </button>
            {error && <p className={styles.errorText}>{error}</p>}
            {success && <p className={styles.successText}>{success}</p>}
          </form>
        )}

        <div className={styles.listCard}>
          <div className={styles.listHeader}>
            <h2 className={styles.listTitle}>
              {tab === 'income' ? 'Your income sources' : 'Your expenses'}
            </h2>
            <span className={styles.listTotal}>
              ₹{(tab === 'income' ? incomeTotal : expenseTotal).toLocaleString('en-IN')}
            </span>
          </div>

          {loadingList ? (
            <div className={styles.emptyState}>Loading…</div>
          ) : tab === 'income' ? (
            incomes.length === 0 ? (
              <div className={styles.emptyState}>
                No income sources yet. Add one on the left to get started.
              </div>
            ) : (
              <div className={styles.entryList}>
                {incomes.map((i) => (
                  <div key={i.id} className={styles.entryRow}>
                    <div className={styles.entryMain}>
                      <span className={styles.entryTitle}>{i.source}</span>
                      <span className={styles.entryMeta}>{i.category} · {i.frequency}</span>
                    </div>
                    <div className={styles.entryRight}>
                      <span className={styles.entryAmount}>₹{Number(i.amount).toLocaleString('en-IN')}</span>
                      <button className={styles.deleteBtn} onClick={() => handleDeleteIncome(i.id)}>
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : expenses.length === 0 ? (
            <div className={styles.emptyState}>
              No expenses logged yet. Add one on the left to get started.
            </div>
          ) : (
            <div className={styles.entryList}>
              {expenses.map((e) => (
                <div key={e.id} className={styles.entryRow}>
                  <div className={styles.entryMain}>
                    <span className={styles.entryTitle}>{e.title}</span>
                    <span className={styles.entryMeta}>{e.category} · {e.paymentMethod}</span>
                  </div>
                  <div className={styles.entryRight}>
                    <span className={styles.entryAmount}>₹{Number(e.amount).toLocaleString('en-IN')}</span>
                    <button className={styles.deleteBtn} onClick={() => handleDeleteExpense(e.id)}>
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
