'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import { financeService } from '@/services/finance.service';
import { scoreService, ScoreResult } from '@/services/score.service';
import { useAuth } from '@/providers/AuthProvider';

const fmt = (n: number) =>
  `₹${Math.round(n).toLocaleString('en-IN')}`;

const fmtShort = (n: number) => {
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
  if (n >= 1000) return `₹${(n / 1000).toFixed(1)}K`;
  return `₹${Math.round(n)}`;
};

interface DashboardStats {
  monthlyIncome: number;
  monthlyExpense: number;
  netWorth: number;
  activeGoals: number;
  recentExpenses: { id: string; title: string; amount: number; category: string; expenseDate?: string }[];
  expenseByCategory: Record<string, number>;
  totalBalance: number;
}

const CATEGORY_ICONS: Record<string, string> = {
  food: '🍽️',
  transport: '🚗',
  shopping: '🛍️',
  entertainment: '🎬',
  health: '💊',
  utilities: '⚡',
  education: '📚',
  other: '📋',
};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Mock bar chart heights for visual
const BAR_HEIGHTS = [40, 55, 35, 65, 50, 70, 45, 80, 60, 90, 75, 95];

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = React.useState<DashboardStats | null>(null);
  const [score, setScore] = React.useState<ScoreResult | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [isDarkMode, setIsDarkMode] = React.useState(true);

  React.useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

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
        const totalBalance = assetsTotal + investTotal + accountTotal;

        const activeGoals = goalList.filter(
          (g) => (g.status ?? 'ACTIVE') === 'ACTIVE'
        ).length;

        const recentExpenses = [...expenseList]
          .sort((a, b) => {
            const da = a.expenseDate ? new Date(a.expenseDate).getTime() : 0;
            const db = b.expenseDate ? new Date(b.expenseDate).getTime() : 0;
            return db - da;
          })
          .slice(0, 5);

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
          totalBalance,
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

  const topCategories = stats
    ? Object.entries(stats.expenseByCategory)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 4)
    : [];

  // Saving goal: use score as proxy, else 72% as demo
  const savingGoalPct = score?.score ? Math.min(Math.round((score.score / 1000) * 100), 99) : 72;
  const circumference = 2 * Math.PI * 36;
  const dashOffset = circumference - (savingGoalPct / 100) * circumference;

  const currentMonth = new Date().getMonth();

  return (
    <div className={`${styles.page} ${isDarkMode ? styles.darkTheme : styles.lightTheme}`}>
      {/* ── OVERVIEW HEADER ── */}
      <div className={styles.overviewHeader}>
        <div className={styles.overviewLeft}>
          <h2 className={styles.overviewTitle}>Overview</h2>
          <p className={styles.overviewSub}>
            Welcome back, <strong>{firstName}</strong>. Your portfolio is growing.
          </p>
        </div>
        <div className={styles.overviewActions}>
          <button className={`${styles.actionBtn} ${styles.actionBtnPrimary}`}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            Send
          </button>
          <button className={styles.actionBtn}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
            Request
          </button>
          <button className={styles.actionBtn}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
            Bills
          </button>
          <button className={styles.iconBtn} onClick={() => setIsDarkMode(prev => !prev)} title="Toggle theme">
            {isDarkMode ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            )}
          </button>
          <Link href="/notifications" className={styles.iconBtn} title="Notifications">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
          </Link>
          <Link href="/profile" className={styles.iconBtn} title="Profile">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </Link>
        </div>
      </div>

      {/* ── MAIN GRID ── */}
      <div className={styles.mainGrid}>
        {/* ── LEFT COLUMN ── */}
        <div className={styles.leftCol}>

          {/* Total Ledger Balance Card */}
          <div className={styles.balanceCard}>
            <div className={styles.balanceLabel}>TOTAL LEDGER BALANCE</div>
            <div className={styles.balanceTrend}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4adc8c" strokeWidth="2.5"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
              <span className={styles.balanceTrendText}>+4.2%</span>
            </div>
            <div className={styles.balanceAmount}>
              {loading ? '…' : stats?.totalBalance ? fmt(stats.totalBalance) : '₹0'}
            </div>
            {/* Bar Chart */}
            <div className={styles.barChart}>
              {BAR_HEIGHTS.map((h, i) => (
                <div key={i} className={styles.barWrapper}>
                  <div
                    className={`${styles.bar} ${i === currentMonth ? styles.barActive : ''}`}
                    style={{ height: `${h}%` }}
                  />
                  <span className={styles.barLabel}>{MONTHS[i].slice(0, 1)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Stats Strip */}
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statLabel}>MONTHLY INCOME</div>
              <div className={styles.statVal}>
                {loading ? '—' : stats?.monthlyIncome ? fmtShort(stats.monthlyIncome) : '—'}
              </div>
              <div className={styles.statNote}>
                {stats?.monthlyIncome ? 'All sources' : 'No data yet'}
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statLabel}>MONTHLY EXPENSE</div>
              <div className={styles.statVal}>
                {loading ? '—' : stats?.monthlyExpense ? fmtShort(stats.monthlyExpense) : '—'}
              </div>
              <div className={styles.statNote}>
                {stats?.monthlyExpense ? 'Total logged' : 'No data yet'}
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statLabel}>NET WORTH</div>
              <div className={styles.statVal}>
                {loading ? '—' : stats?.netWorth !== undefined ? fmtShort(stats.netWorth) : '—'}
              </div>
              <div className={styles.statNote}>
                {stats?.netWorth ? 'Assets − liabilities' : 'No data yet'}
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statLabel}>ACTIVE GOALS</div>
              <div className={styles.statVal}>
                {loading ? '—' : stats?.activeGoals ?? 0}
              </div>
              <div className={styles.statNote}>
                {stats?.activeGoals ? 'Goals in progress' : 'No goals set'}
              </div>
            </div>
          </div>

          {/* Bottom two cards */}
          <div className={styles.bottomRow}>
            {/* Net worth over time */}
            <div className={styles.bottomCard}>
              <h3 className={styles.cardTitle}>Net worth over time</h3>
              {stats?.netWorth ? (
                <div className={styles.miniLineChart}>
                  <svg width="100%" height="80" viewBox="0 0 200 80" preserveAspectRatio="none">
                    <polyline
                      points="0,70 30,60 60,65 90,45 120,50 150,30 180,35 200,20"
                      fill="none"
                      stroke="var(--accent-blue)"
                      strokeWidth="2"
                    />
                    <linearGradient id="netFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--accent-blue)" stopOpacity="0.3"/>
                      <stop offset="100%" stopColor="var(--accent-blue)" stopOpacity="0"/>
                    </linearGradient>
                    <polygon
                      points="0,80 0,70 30,60 60,65 90,45 120,50 150,30 180,35 200,20 200,80"
                      fill="url(#netFill)"
                    />
                  </svg>
                </div>
              ) : (
                <div className={styles.emptyBox}>
                  <p>Add a few months of data in Finance to see your net worth trend here.</p>
                </div>
              )}
            </div>

            {/* Spending by category */}
            <div className={styles.bottomCard}>
              <h3 className={styles.cardTitle}>Spending by category</h3>
              {topCategories.length > 0 ? (
                <div className={styles.categoryList}>
                  {topCategories.map(([cat, amt]) => {
                    const maxAmt = topCategories[0][1];
                    const pct = maxAmt > 0 ? Math.round((amt / maxAmt) * 100) : 0;
                    const icon = CATEGORY_ICONS[cat.toLowerCase()] ?? '📋';
                    return (
                      <div key={cat} className={styles.categoryRow}>
                        <span className={styles.catIcon}>{icon}</span>
                        <div className={styles.catInfo}>
                          <div className={styles.catName}>{cat.replace(/_/g, ' ').toLowerCase()}</div>
                          <div className={styles.catBar}>
                            <div className={styles.catBarFill} style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                        <span className={styles.catAmt}>{fmtShort(amt)}</span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className={styles.emptyBox}>
                  <p>Log a few expenses in Finance to see your spending breakdown here.</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div className={styles.activityCard}>
            <div className={styles.activityHeader}>
              <h3 className={styles.cardTitle}>Recent Activity</h3>
              <Link href="/finance" className={styles.viewAll}>View All</Link>
            </div>
            <div className={styles.activityTableHeader}>
              <span>Merchant / Details</span>
              <span>Date</span>
              <span>Amount</span>
            </div>
            {loading ? (
              <p className={styles.emptyText}>Loading…</p>
            ) : stats?.recentExpenses?.length ? (
              stats.recentExpenses.map((e) => {
                const icon = CATEGORY_ICONS[e.category?.toLowerCase()] ?? '📋';
                return (
                  <div key={e.id} className={styles.activityRow}>
                    <div className={styles.activityLeft}>
                      <div className={styles.activityIcon}>{icon}</div>
                      <div>
                        <div className={styles.activityName}>{e.title}</div>
                        <div className={styles.activitySub}>
                          {e.category.replace(/_/g, ' ').toLowerCase()}
                        </div>
                      </div>
                    </div>
                    <div className={styles.activityDate}>
                      {e.expenseDate
                        ? new Date(e.expenseDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                        : '—'}
                    </div>
                    <div className={styles.activityAmt}>−{fmt(e.amount)}</div>
                  </div>
                );
              })
            ) : (
              <p className={styles.emptyText}>No transactions yet. Add one in Finance.</p>
            )}
          </div>
        </div>

        {/* ── RIGHT COLUMN ── */}
        <div className={styles.rightCol}>

          {/* Saving Goal Donut */}
          <div className={styles.goalCard}>
            <div className={styles.goalLabel}>SAVING GOAL: FINT TARGET</div>
            <div className={styles.donutWrapper}>
              <svg width="100" height="100" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="36" fill="none" stroke="var(--ring-bg)" strokeWidth="10"/>
                <circle
                  cx="50" cy="50" r="36"
                  fill="none"
                  stroke="var(--accent-blue)"
                  strokeWidth="10"
                  strokeDasharray={circumference}
                  strokeDashoffset={dashOffset}
                  strokeLinecap="round"
                  transform="rotate(-90 50 50)"
                />
              </svg>
              <div className={styles.donutCenter}>
                <span className={styles.donutPct}>{savingGoalPct}%</span>
              </div>
            </div>
            <div className={styles.goalFooter}>
              <div className={styles.goalProgress}>
                {score?.score ? fmt(score.score) : '₹3,500'} of{' '}
                {score?.score ? fmt(1000) : '₹5,000'} saved
              </div>
              <Link href="/goals" className={styles.goalLink}>Add Funds</Link>
            </div>
          </div>

          {/* FINT Score Card */}
          <div className={styles.scoreCard}>
            <div className={styles.scoreLabel}>FINT SCORE</div>
            <div className={styles.scoreVal}>
              {loading ? '…' : score?.score ?? '—'}
            </div>
            {score && (
              <div className={styles.scoreGrade}>
                Grade {score.grade} · {score.risk} Risk
              </div>
            )}
            {score?.recommendations?.[0] && (
              <p className={styles.scoreRec}>{score.recommendations[0]}</p>
            )}
            <Link href="/score" className={styles.scoreLinkBtn}>See breakdown →</Link>
          </div>

          {/* Linked Wallets / Accounts */}
          <div className={styles.walletsCard}>
            <div className={styles.walletsHeader}>
              <h3 className={styles.cardTitle}>Linked Accounts</h3>
              <button className={styles.addBtn}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              </button>
            </div>
            <div className={styles.walletsList}>
              <div className={`${styles.walletItem} ${styles.walletBlue}`}>
                <div className={styles.walletIcon}>🏦</div>
                <div className={styles.walletInfo}>
                  <div className={styles.walletName}>Main Savings</div>
                  <div className={styles.walletBank}>Primary Bank</div>
                </div>
                <div className={styles.walletAmt}>
                  {loading ? '—' : stats?.totalBalance ? fmtShort(stats.totalBalance * 0.6) : '₹0'}
                </div>
              </div>
              <div className={styles.walletItem}>
                <div className={styles.walletIcon}>📈</div>
                <div className={styles.walletInfo}>
                  <div className={styles.walletName}>Investments</div>
                  <div className={styles.walletBank}>Portfolio</div>
                </div>
                <div className={styles.walletAmt}>
                  {loading ? '—' : stats?.netWorth ? fmtShort(stats.netWorth * 0.3) : '₹0'}
                </div>
              </div>
              <div className={styles.walletItem}>
                <div className={styles.walletIcon}>💳</div>
                <div className={styles.walletInfo}>
                  <div className={styles.walletName}>Daily Expenses</div>
                  <div className={styles.walletBank}>Credit Card</div>
                </div>
                <div className={styles.walletAmt}>
                  {loading ? '—' : stats?.monthlyExpense ? fmtShort(stats.monthlyExpense) : '₹0'}
                </div>
              </div>
            </div>
          </div>

          {/* Pro Tip */}
          <div className={styles.proTipCard}>
            <div className={styles.proTipLabel}>PRO TIP</div>
            <p className={styles.proTipText}>
              {score?.recommendations?.[1] ??
                'You could save more by automating your monthly investments. Set up a SIP today!'}
            </p>
          </div>

          {/* Contact Support */}
          <div className={styles.supportCard}>
            <p className={styles.supportText}>Need any help with your Ledger?</p>
            <button className={styles.supportBtn}>Contact Support</button>
          </div>
        </div>
      </div>
    </div>
  );
}