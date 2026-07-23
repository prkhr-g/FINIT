'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarItem {
  name: string;
  path: string;
  icon: React.ReactNode;
}

export const Sidebar: React.FC = () => {
  const pathname = usePathname();

  const menuItems: SidebarItem[] = [
    { name: 'Dashboard', path: '/dashboard', icon: <span className="text-lg">📊</span> },
    { name: 'Finance', path: '/finance', icon: <span className="text-lg">💼</span> },
    { name: 'Income', path: '/income', icon: <span className="text-lg">💵</span> },
    { name: 'Expense', path: '/expense', icon: <span className="text-lg">📉</span> },
    { name: 'Assets', path: '/assets', icon: <span className="text-lg">🏠</span> },
    { name: 'Loans', path: '/loans', icon: <span className="text-lg">💳</span> },
    { name: 'Investments', path: '/investments', icon: <span className="text-lg">📈</span> },
    { name: 'Insurance', path: '/insurance', icon: <span className="text-lg">🛡️</span> },
    { name: 'Retirement', path: '/retirement', icon: <span className="text-lg">👴</span> },
    { name: 'Goals', path: '/goals', icon: <span className="text-lg">🎯</span> },
    { name: 'Accounts', path: '/accounts', icon: <span className="text-lg">🏦</span> },
    { name: 'FINT Score', path: '/score', icon: <span className="text-lg">💯</span> },
    { name: 'Analytics', path: '/analytics', icon: <span className="text-lg">🧬</span> },
    { name: 'Reports', path: '/reports', icon: <span className="text-lg">📑</span> },
    { name: 'FINT AI', path: '/ai', icon: <span className="text-lg">🤖</span> },
  ];

  return (
    <aside className="w-64 border-r border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 flex flex-col h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto">
      <div className="p-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900'
              }`}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>
    </aside>
  );
};