'use client';

import React from 'react';
import Link from 'next/link';
import styles from './page.module.css';
import { useAuth } from '@/providers/AuthProvider';
import { useTheme } from '@/providers/ThemeProvider';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [financeData, setFinanceData] = React.useState<null | {
    score: number;
    grade: string;
    monthlyIncome: number;
    monthlyExpense: number;
    netWorth: number;
    activeGoals: number;
    netWorthTrend: { month: string; value: number }[];
    spendingByCategory: { category: string; amount: number }[];
  }>(null);

  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  const rawName = user?.name || user?.email?.split('@')[0] || 'there';
  const displayName = rawName.charAt(0).toUpperCase() + rawName.slice(1);
  const initials = user ? getInitials(displayName) : '?';

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.greetingContainer}>
    <span className={styles.greetingSub}>GOOD EVENING</span>
    <h1 className={styles.greetingTitle}>
      <span className={styles.greetingName}>{displayName}</span>
      <span className={styles.greetingRest}>, where things stand.</span>
    </h1>
  </div>
        <div className={styles.profileContainer}>
          <button
            className={styles.themeToggle}
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          <button className={styles.notifBtn}>
            <span className={styles.notifDot}></span>
          </button>
          <div className={styles.avatar}>{initials}</div>
        </div>
      </header>

      <div className={`${styles.card} ${styles.scoreCard}`}>
        <div className={styles.scoreGauge}>
          <div className={styles.scoreContent}>
            {financeData ? (
              <>
                <span className={styles.scoreValue}>{financeData.score}</span>
                <span className={styles.scoreGrade}>GRADE {financeData.grade}</span>
              </>
            ) : (
              <span className={styles.scoreValue}>—</span>
            )}
          </div>
        </div>
        <div className={styles.scoreInfo}>
          <div className={styles.cardLabel}>FINT SCORE</div>
          {financeData ? (
            <>
              <h2 className={styles.scoreTitle}>Excellent financial health</h2>
              <p className={styles.scoreDesc}>
                Aapka score pichle quarter se <strong>24 points</strong> improve hua hai.
              </p>
            </>
          ) : (
            <>
              <h2 className={styles.scoreTitle}>No score yet</h2>
              <p className={styles.scoreDesc}>
                Add your income, expenses, and savings in the Finance section to generate your FINT Score.
              </p>
              <Link href="/finance" className={styles.viewAll}>Add finance data →</Link>
            </>
          )}
        </div>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.cardLabel}>MONTHLY INCOME</div>
          <div className={styles.statValue}>
            {financeData ? `₹${financeData.monthlyIncome.toLocaleString('en-IN')}` : '—'}
          </div>
          <div className={styles.statSub}>{financeData ? 'Same as last month' : 'No data yet'}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.cardLabel}>MONTHLY EXPENSE</div>
          <div className={styles.statValue}>
            {financeData ? `₹${financeData.monthlyExpense.toLocaleString('en-IN')}` : '—'}
          </div>
          <div className={styles.statSub}>{financeData ? '↑ 8% vs last month' : 'No data yet'}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.cardLabel}>NET WORTH</div>
          <div className={styles.statValue}>
            {financeData ? `₹${financeData.netWorth}L` : '—'}
          </div>
          <div className={styles.statSub}>{financeData ? '↑ 18% YoY' : 'No data yet'}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.cardLabel}>ACTIVE GOALS</div>
          <div className={styles.statValue}>{financeData ? financeData.activeGoals : '0'}</div>
          <div className={styles.statSub}>{financeData ? '2 on track' : 'No goals set'}</div>
        </div>
      </div>

      <div className={styles.chartsGrid}>
        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <h3 className={styles.chartTitle}>Net worth over time</h3>
          </div>
          {financeData?.netWorthTrend?.length ? (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={financeData.netWorthTrend}>
                <CartesianGrid stroke="#eee" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#8a8a8a' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#8a8a8a' }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#4274d9" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className={styles.chartEmpty}>
              Add a few months of data in Finance to see your net worth trend here.
            </div>
          )}
        </div>

        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <h3 className={styles.chartTitle}>Spending by category</h3>
          </div>
          {financeData?.spendingByCategory?.length ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={financeData.spendingByCategory}>
                <CartesianGrid stroke="#eee" vertical={false} />
                <XAxis dataKey="category" tick={{ fontSize: 12, fill: '#8a8a8a' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#8a8a8a' }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="amount" fill="#95ccdd" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className={styles.chartEmpty}>
              Log a few expenses in Finance to see your spending breakdown here.
            </div>
          )}
        </div>
      </div>

      <div className={styles.bottomGrid}>
        <div className={styles.aiCard}>
          <div className={styles.aiHeader}>
            <span>✦</span> AI RECOMMENDATION
          </div>
          {financeData ? (
            <>
              <h3 className={styles.aiTitle}>Your emergency fund needs attention</h3>
              <p className={styles.aiDesc}>
                Aapka expense-to-income ratio pichle mahine se 8% badha hai.
              </p>
            </>
          ) : (
            <>
              <h3 className={styles.aiTitle}>No recommendations yet</h3>
              <p className={styles.aiDesc}>
                Once you add your finance details, AI will analyze your data and give you personalized recommendations here.
              </p>
            </>
          )}
        </div>

        <div className={styles.activityCard}>
          <div className={styles.activityHeader}>
            <h3 className={styles.activityTitle}>Recent activity</h3>
            <Link href="/activity" className={styles.viewAll}>View all</Link>
          </div>
          <div className={styles.activityList}>
            {financeData ? (
              <>{/* real transaction items go here once fetched */}</>
            ) : (
              <p className={styles.activityDate}>No transactions yet. Add one in Finance to see it here.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}