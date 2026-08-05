'use client';

import React from 'react';
import { useTheme } from '@/providers/ThemeProvider';
import { useAuth } from '@/providers/AuthProvider';
import Link from 'next/link';

export const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();

  return (
    <nav className="h-16 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 px-6 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-8">
        <Link href="/dashboard" className="text-xl font-black tracking-wider text-indigo-600 dark:text-indigo-400">
          FINT
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer"
          aria-label="Toggle Theme"
        >
          {theme === 'light' ? (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
            </svg>
          )}
        </button>

        {user ? (
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{user.name}</span>
            <button
              onClick={logout}
              className="text-xs text-rose-600 dark:text-rose-400 font-medium hover:underline cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <Link href="/login" className="text-sm font-medium text-indigo-600 hover:underline">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};