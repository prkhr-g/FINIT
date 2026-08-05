'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { financeService } from '@/services/finance.service';
import { scoreService } from '@/services/score.service';

const fmt = (n: number) => `₹${Math.round(n).toLocaleString('en-IN')}`;

export default function ProfilePage() {
  const [netWorth, setNetWorth] = useState(0);
  const [monthlySavings, setMonthlySavings] = useState(0);
  const [monthlyExpenses, setMonthlyExpenses] = useState(0);
  const [fintScore, setFintScore] = useState(0);
  const [scoreGrade, setScoreGrade] = useState('');
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [incomes, expenses, assets, investments, accounts, loans, scoreRes] = await Promise.all([
        financeService.getIncomes(),
        financeService.getExpenses(),
        financeService.getAssets(),
        financeService.getInvestments(),
        financeService.getAccounts(),
        financeService.getLoans(),
        scoreService.getCurrent(),
      ]);

      const totalAssets = 
        (Array.isArray(assets) ? assets : []).reduce((s, a) => s + Number(a.currentValue || 0), 0) + 
        (Array.isArray(investments) ? investments : []).reduce((s, i) => s + (Number(i.currentPrice || 0) * Number(i.quantity || 1)), 0) + 
        (Array.isArray(accounts) ? accounts : []).reduce((s, a) => s + Number(a.currentBalance || 0), 0);
      
      const totalLoans = (Array.isArray(loans) ? loans : []).reduce((s, l) => s + Number(l.remainingBalance || 0), 0);
      const inc = (Array.isArray(incomes) ? incomes : []).reduce((s, i) => s + Number(i.amount || 0), 0);
      const exp = (Array.isArray(expenses) ? expenses : []).reduce((s, e) => s + Number(e.amount || 0), 0);

      setNetWorth(totalAssets - totalLoans);
      setMonthlySavings(inc - exp);
      setMonthlyExpenses(exp);
      setFintScore(scoreRes?.score || 0);
      setScoreGrade(scoreRes?.grade || 'N/A');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Profile Settings</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage personal information and KYC details.</p>
        </div>
        <Button variant="primary" onClick={loadData} disabled={loading}>
          {loading ? 'Refreshing...' : 'Refresh Data'}
        </Button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card hoverable>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Net Worth</span>
            <span className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 text-sm">📈</span>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-bold text-slate-900 dark:text-white">{loading ? '...' : fmt(netWorth)}</span>
          </div>
        </Card>

        <Card hoverable>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Monthly Savings</span>
            <span className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 text-sm">💰</span>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-bold text-slate-900 dark:text-white">{loading ? '...' : fmt(monthlySavings)}</span>
          </div>
        </Card>

        <Card hoverable>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Monthly Expenses</span>
            <span className="p-2 rounded-lg bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 text-sm">📉</span>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-bold text-slate-900 dark:text-white">{loading ? '...' : fmt(monthlyExpenses)}</span>
          </div>
        </Card>

        <Card hoverable>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">FINT Score</span>
            <span className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 text-sm">💯</span>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-bold text-slate-900 dark:text-white">{loading ? '...' : fintScore}</span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold block mt-1">Grade: {scoreGrade}</span>
          </div>
        </Card>
      </div>

      <Card>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Detailed Analytics & Insights</h2>
        <div className="h-64 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-center text-slate-400 dark:text-slate-600 text-sm bg-slate-50/50 dark:bg-slate-900/50">
          Visual chart data for Profile Settings will render here.
        </div>
      </Card>
    </div>
  );
}