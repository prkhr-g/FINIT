'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './layout.module.css';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Finance', path: '/finance' },
    { name: 'FINT score', path: '/score' },
    { name: 'AI advisor', path: '/ai' },
    { name: 'Reports', path: '/reports' },
    { name: 'Settings', path: '/settings' },
  ];

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <div className={styles.logo}>FINT</div>
        <nav>
          {navItems.map((item) => {
            const isActive = pathname === item.path || (pathname === '/' && item.path === '/dashboard');
            return (
              <Link 
                key={item.name} 
                href={item.path}
                className={`${styles.navItem} ${isActive ? styles.active : ''}`}
              >
                <span className={styles.navIcon}></span>
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
}
