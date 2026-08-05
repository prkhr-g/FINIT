'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-widest">Admin Panel</span>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">Admin Control Center</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">System-wide stats, operations, and telemetry.</p>
        </div>
        <Button variant="secondary">
          Execute Audit
        </Button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <span className="text-sm font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Total Users</span>
          <span className="text-4xl font-extrabold text-slate-900 dark:text-white block mt-2">1,248</span>
        </Card>
        <Card>
          <span className="text-sm font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Monthly Active</span>
          <span className="text-4xl font-extrabold text-slate-900 dark:text-white block mt-2">982</span>
        </Card>
        <Card>
          <span className="text-sm font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Platform Revenue</span>
          <span className="text-4xl font-extrabold text-slate-900 dark:text-white block mt-2">₹1,84,000</span>
        </Card>
      </div>

      <Card>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Operations Logs & Audit</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-500 dark:text-slate-400">
            <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-700 dark:text-slate-300">
              <tr>
                <th className="px-6 py-3 font-semibold rounded-l-lg">Event</th>
                <th className="px-6 py-3 font-semibold">User</th>
                <th className="px-6 py-3 font-semibold">Status</th>
                <th className="px-6 py-3 font-semibold rounded-r-lg">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              <tr>
                <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">API Key Rotated</td>
                <td className="px-6 py-4">admin@fint.com</td>
                <td className="px-6 py-4"><span className="px-2 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400">Success</span></td>
                <td className="px-6 py-4">Just now</td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">Backup Generated</td>
                <td className="px-6 py-4">System Cron</td>
                <td className="px-6 py-4"><span className="px-2 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400">Success</span></td>
                <td className="px-6 py-4">2 hours ago</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}