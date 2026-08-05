'use client';

import React from 'react';
import { useTheme } from '@/providers/ThemeProvider';

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '', showLabel = true }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer border shadow-xs ${
        theme === 'dark'
          ? 'bg-slate-800/90 hover:bg-slate-700 text-amber-300 border-slate-700/80'
          : 'bg-white hover:bg-slate-100 text-indigo-950 border-slate-200'
      } ${className}`}
      title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} mode`}
      aria-label="Toggle theme mode"
    >
      {theme === 'dark' ? (
        <>
          <svg className="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 24 24">
            <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {showLabel && <span>Light Mode</span>}
        </>
      ) : (
        <>
          <svg className="w-4 h-4 text-indigo-600 fill-current" viewBox="0 0 24 24">
            <path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {showLabel && <span>Dark Mode</span>}
        </>
      )}
    </button>
  );
};
