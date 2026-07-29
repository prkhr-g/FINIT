'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function AiPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-[28px] font-bold tracking-[-0.02em] text-slate-900 dark:text-white">FINT AI Assistant</h1>
        <Button variant="primary">
          Refresh Data
        </Button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card hoverable>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Net Worth</span>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-bold text-slate-900 dark:text-white">₹12,48,500</span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold block mt-1">+4.2% from last month</span>
          </div>
        </Card>

        <Card hoverable>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Monthly Savings</span>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-bold text-slate-900 dark:text-white">₹45,200</span>
            <span className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold block mt-1">75% of monthly goal</span>
          </div>
        </Card>

        <Card hoverable>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Monthly Expenses</span>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-bold text-slate-900 dark:text-white">₹28,400</span>
            <span className="text-xs text-rose-600 dark:text-rose-400 font-semibold block mt-1">-1.8% from last month</span>
          </div>
        </Card>

        <Card hoverable>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">FINT Score</span>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-bold text-slate-900 dark:text-white">765 / 900</span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold block mt-1">Excellent Health</span>
          </div>
        </Card>
      </div>

      <Card>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Detailed Analytics & Insights</h2>
        <div className="h-64 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-center text-slate-400 dark:text-slate-600 text-sm bg-slate-50/50 dark:bg-slate-900/50">
          Visual chart data for FINT AI Assistant will render here.
        </div>
      </Card>
    </div>
  );
}