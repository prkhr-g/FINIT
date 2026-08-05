'use client';

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}) => {
  const baseStyle =
    'inline-flex items-center justify-center font-medium tracking-tight rounded-lg transition-all duration-150 active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-950 cursor-pointer disabled:opacity-50 disabled:pointer-events-none';

  const variants = {
    primary:
      'bg-indigo-600 hover:bg-indigo-500 text-white focus:ring-indigo-500 shadow-[0_1px_0_0_rgba(255,255,255,0.15)_inset,0_2px_6px_-1px_rgba(79,70,229,0.4)]',
    secondary:
      'bg-rose-600 hover:bg-rose-500 text-white focus:ring-rose-500 shadow-[0_1px_0_0_rgba(255,255,255,0.15)_inset,0_2px_6px_-1px_rgba(225,29,72,0.4)]',
    outline:
      'border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300 bg-transparent',
    ghost:
      'hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-300 bg-transparent',
    danger:
      'bg-red-600 hover:bg-red-500 text-white focus:ring-red-500 shadow-[0_1px_0_0_rgba(255,255,255,0.15)_inset,0_2px_6px_-1px_rgba(220,38,38,0.4)]',
  };

  const sizes = {
    sm: 'gap-1.5 px-3 py-1.5 text-xs',
    md: 'gap-2 px-4 py-2 text-sm',
    lg: 'gap-2 px-5 py-2.5 text-base',
  };

  return (
    <button
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};