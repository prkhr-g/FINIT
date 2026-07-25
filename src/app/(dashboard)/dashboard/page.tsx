'use client';

import React from 'react';
import Link from 'next/link';
import styles from './page.module.css';
import { financeService } from '@/services/finance.service';
import { scoreService, ScoreResult } from '@/services/score.service';
import { useAuth } from '@/providers/AuthProvider';

const fmt = (n: number) =>
  `₹${Math.round(n).toLocaleString('en-IN')}`;

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'GOOD MORNING';
  if (h < 17) return 'GOOD AFTERNOON';
  return 'GOOD EVENING';
}

interface DashboardStats {
  monthlyIncome: number;
  monthlyExpense: number;
  netWorth: number;
  activeGoals: number;
  recentExpenses: { id: string; title: string; amount: number; category: string; expenseDate?: string }[];
  expenseByCategory: Record<string, number>;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = React.useState<DashboardStats | null>(null);
  const [score, setScore] = React.useState<ScoreResult | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const load = async () => {
      try {
        const [incomes, expenses, assets, investments, accounts, loans, goals, scoreData] =
          await Promise.allSettled([
            financeService.getIncomes(),
            financeService.getExpenses(),
            financeService.getAssets(),
            financeService.getInvestments(),
            financeService.getAccounts(),
            financeService.getLoans(),
            financeService.getGoals(),
            scoreService.getCurrent(),
          ]);

        const incomeList = incomes.status === 'fulfilled' ? incomes.value : [];
        const expenseList = expenses.status === 'fulfilled' ? expenses.value : [];
        const assetList = assets.status === 'fulfilled' ? assets.value : [];
        const investList = investments.status === 'fulfilled' ? investments.value : [];
        const accountList = accounts.status === 'fulfilled' ? accounts.value : [];
        const loanList = loans.status === 'fulfilled' ? loans.value : [];
        const goalList = goals.status === 'fulfilled' ? goals.value : [];

        const monthlyIncome = incomeList.reduce((s, e) => s + (Number(e.amount) || 0), 0);
        const monthlyExpense = expenseList.reduce((s, e) => s + (Number(e.amount) || 0), 0);

        const assetsTotal = assetList.reduce((s, e) => s + (Number(e.currentValue) || 0), 0);
        const investTotal = investList.reduce(
          (s, e) => s + (Number(e.currentPrice) || 0) * (Number(e.quantity) || 1),
          0
        );
        const accountTotal = accountList.reduce((s, e) => s + (Number(e.currentBalance) || 0), 0);
        const loanTotal = loanList.reduce((s, e) => s + (Number(e.remainingBalance) || 0), 0);
        const netWorth = assetsTotal + investTotal + accountTotal - loanTotal;

        const activeGoals = goalList.filter(
          (g) => (g.status ?? 'ACTIVE') === 'ACTIVE'
        ).length;

        // Recent 5 expenses sorted by date
        const recentExpenses = [...expenseList]
          .sort((a, b) => {
            const da = a.expenseDate ? new Date(a.expenseDate).getTime() : 0;
            const db = b.expenseDate ? new Date(b.expenseDate).getTime() : 0;
            return db - da;
          })
          .slice(0, 5);

        // Expense by category
        const expenseByCategory: Record<string, number> = {};
        expenseList.forEach((e) => {
          const cat = e.category || 'OTHER';
          expenseByCategory[cat] = (expenseByCategory[cat] || 0) + (Number(e.amount) || 0);
        });

        setStats({
          monthlyIncome,
          monthlyExpense,
          netWorth,
          activeGoals,
          recentExpenses,
          expenseByCategory,
        });

        if (scoreData.status === 'fulfilled') {
          setScore(scoreData.value);
        }
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const firstName = user?.name?.split(' ')[0] ?? 'there';

  // Top 4 spending categories
  const topCategories = stats
    ? Object.entries(stats.expenseByCategory)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 4)
    : [];

  const scoreVal = score?.score ?? null;
  const fillDeg = scoreVal !== null ? (scoreVal / 1000) * 360 : 0;

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.headerBackground}></div>
      <div className={styles.contentWrapper}>
        <header className={styles.header}>
          <div className={styles.greetingContainer}>
            <span className={styles.greetingSub}>{getGreeting()}</span>
            <h1 className={styles.greetingTitle}>{firstName}, where things stand.</h1>
          </div>
          <div className={styles.profileContainer}>
            <button className={styles.notifBtn}>
              <span className={styles.notifDot}></span>
            </button>
            <div className={styles.avatar}>
              {(user?.name ?? 'U').slice(0, 2).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Score card */}
        <div className={`${styles.card} ${styles.scoreCard}`}>
          <div
            className={styles.scoreGauge}
            style={{ ['--fill-deg' as string]: `${fillDeg}deg` }}
          >
            <div className={styles.scoreContent}>
              <span className={styles.scoreValue}>
                {loading ? '…' : scoreVal ?? '—'}
              </span>
            </div>
          </div>
          <div className={styles.scoreInfo}>
            <div className={styles.cardLabel}>FINT SCORE</div>
            {loading ? (
              <h2 className={styles.scoreTitle}>Loading…</h2>
            ) : score ? (
              <>
                <h2 className={styles.scoreTitle}>
                  Grade {score.grade} · {score.risk} Risk
                </h2>
                <p className={styles.scoreDesc}>
                  {score.recommendations?.[0] ?? 'Your financial health is being tracked.'}
                </p>
                <Link href="/score" className={styles.actionLink}>
                  See full breakdown →
                </Link>
              </>
            ) : (
              <>
                <h2 className={styles.scoreTitle}>No score yet</h2>
                <p className={styles.scoreDesc}>
                  Add your income, expenses, and savings in the Finance section to generate your FINT Score.
                </p>
                <Link href="/finance" className={styles.actionLink}>
                  Add finance data &rarr;
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Stats strip */}
        <div className={`${styles.card} ${styles.statsContainer}`}>
          <div className={styles.statItem}>
            <div className={styles.cardLabel}>MONTHLY INCOME</div>
            <div className={styles.statValue}>
              {loading ? '…' : stats?.monthlyIncome ? fmt(stats.monthlyIncome) : '—'}
            </div>
            <div className={styles.statSub}>
              {stats?.monthlyIncome ? 'Total across all sources' : 'No data yet'}
            </div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.cardLabel}>MONTHLY EXPENSE</div>
            <div className={styles.statValue}>
              {loading ? '…' : stats?.monthlyExpense ? fmt(stats.monthlyExpense) : '—'}
            </div>
            <div className={styles.statSub}>
              {stats?.monthlyExpense ? 'Total logged expenses' : 'No data yet'}
            </div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.cardLabel}>NET WORTH</div>
            <div className={styles.statValue}>
              {loading ? '…' : stats?.netWorth !== undefined ? fmt(stats.netWorth) : '—'}
            </div>
            <div className={styles.statSub}>
              {stats?.netWorth ? 'Assets + investments − loans' : 'No data yet'}
            </div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.cardLabel}>ACTIVE GOALS</div>
            <div className={styles.statValue}>
              {loading ? '…' : stats?.activeGoals ?? 0}
            </div>
            <div className={styles.statSub}>
              {stats?.activeGoals ? 'Goals in progress' : 'No goals set'}
            </div>
          </div>
        </div>

        <div className={styles.bottomGrid}>
          {/* Spending by category */}
          <div className={styles.activityCard}>
            <h3 className={styles.cardTitle}>Spending by category</h3>
            {loading ? (
              <div className={styles.emptyStateBox}><p>Loading…</p></div>
            ) : topCategories.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingTop: '8px' }}>
                {topCategories.map(([cat, amt]) => {
                  const maxAmt = topCategories[0][1];
                  const pct = maxAmt > 0 ? Math.round((amt / maxAmt) * 100) : 0;
                  return (
                    <div key={cat}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                        <span style={{ textTransform: 'capitalize' }}>{cat.replace(/_/g, ' ').toLowerCase()}</span>
                        <span style={{ fontWeight: 600 }}>{fmt(amt)}</span>
                      </div>
                      <div style={{ background: 'var(--border-card, #e5e7eb)', borderRadius: '4px', height: '6px' }}>
                        <div style={{ width: `${pct}%`, background: '#4274d9', borderRadius: '4px', height: '100%' }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className={styles.emptyStateBox}>
                <p>Log a few expenses in Finance to see your spending breakdown here.</p>
              </div>
            )}
          </div>

          {/* AI Recommendations */}
          <div className={styles.aiCard}>
            <div className={styles.aiHeader}>
              <span>✦</span> AI RECOMMENDATION
            </div>
            {loading ? (
              <p className={styles.emptyText}>Loading…</p>
            ) : score?.recommendations?.length ? (
              <ul style={{ margin: 0, paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {score.recommendations.map((r, i) => (
                  <li key={i} style={{ fontSize: '13px', lineHeight: '1.5' }}>{r}</li>
                ))}
              </ul>
            ) : (
              <>
                <h3 className={styles.cardTitle}>No recommendations yet</h3>
                <p className={styles.emptyText}>
                  Once you add your finance details, AI will analyze your data and give you personalized recommendations here.
                </p>
              </>
            )}
          </div>

          {/* Recent activity */}
          <div className={styles.activityCard}>
            <div className={styles.activityHeader}>
              <h3 className={styles.cardTitle}>Recent activity</h3>
              <Link href="/finance" className={styles.viewAll}>View all</Link>
            </div>
            {loading ? (
              <p className={styles.emptyText}>Loading…</p>
            ) : stats?.recentExpenses?.length ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingTop: '4px' }}>
                {stats.recentExpenses.map((e) => (
                  <div key={e.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 500 }}>{e.title}</div>
                      <div style={{ fontSize: '12px', opacity: 0.6, textTransform: 'capitalize' }}>
                        {e.category.replace(/_/g, ' ').toLowerCase()}
                        {e.expenseDate ? ` · ${new Date(e.expenseDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}` : ''}
                      </div>
                    </div>
                    <span style={{ fontWeight: 600, fontSize: '14px' }}>−{fmt(e.amount)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className={styles.emptyText}>
                No transactions yet. Add one in Finance to see it here.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}