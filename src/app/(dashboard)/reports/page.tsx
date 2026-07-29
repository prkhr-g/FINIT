'use client';

import React from 'react';
import styles from './page.module.css';
import {
  Landmark,
  Wallet,
  TrendingUp,
  Shield,
  CalendarDays,
  MoreVertical,
  LineChart,
  Home,
  CloudDownload,
  GraduationCap,
} from 'lucide-react';

// ---------------------------------------------------------------------------
// Types
//
// Nothing is wired up to a real data source yet, so every section below
// renders from an empty array and falls back to an empty state. Swap the
// empty defaults for fetched data (financeService / scoreService calls,
// same pattern as the Dashboard and Finance pages) once it's ready.
// ---------------------------------------------------------------------------

interface SummaryStat {
  id: string;
  label: string;
  value: string;
  delta: string;
  deltaTone: 'positive' | 'negative' | 'neutral';
  icon: React.ElementType;
  iconTone: 'primary' | 'tertiary' | 'error';
}

interface ChartSeriesPoint {
  month: string;
  assets: number;
  liabilities: number;
}

interface CategoryYield {
  id: string;
  label: string;
  yieldPct: number;
  barPct: number;
  tone: 'tertiary' | 'primary' | 'secondary' | 'muted';
}

interface CashFlowMonth {
  month: string;
  amountLabel: string;
  tone: 'surplus' | 'deficit';
  intensity: number; // 0-100, drives opacity of the surplus/deficit tint
}

interface Milestone {
  id: string;
  name: string;
  icon: React.ElementType;
  iconTone: 'tertiary' | 'primary' | 'secondary';
  targetDate: string;
  account: string;
  progressPct?: number;
  amountLabel?: string;
  actionLabel: string;
}

// ---------------------------------------------------------------------------
// Data (empty for now — replace with real values once available)
// ---------------------------------------------------------------------------

const summaryStats: SummaryStat[] = [];
const chartSeries: ChartSeriesPoint[] = [];
const categoryYields: CategoryYield[] = [];
const cashFlowMonths: CashFlowMonth[] = [];
const milestones: Milestone[] = [];

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function ReportsPage() {
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Reports</h1>
      </div>

      <div className={styles.content}>
        <SummaryRow stats={summaryStats} />
        <GrowthChart data={chartSeries} />
        <div className={styles.twoColGrid}>
          <YieldByCategory categories={categoryYields} />
          <CashFlowHeatmap months={cashFlowMonths} />
        </div>
        <MilestonesTable milestones={milestones} />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Executive summary cards
// ---------------------------------------------------------------------------

function SummaryRow({ stats }: { stats: SummaryStat[] }) {
  if (stats.length === 0) {
    // Placeholder card slots so the layout doesn't jump once data arrives —
    // swap this block for `stats.map(...)` below when ready.
    const slots: { label: string; icon: React.ElementType }[] = [
      { label: 'Total Asset Value', icon: Landmark },
      { label: 'Monthly Net Savings', icon: Wallet },
      { label: 'Annualized ROI', icon: TrendingUp },
      { label: 'Debt-to-Asset Ratio', icon: Shield },
    ];
    return (
      <section className={styles.summaryGrid}>
        {slots.map((slot) => (
          <div key={slot.label} className={styles.summaryCard}>
            <div className={styles.summaryCardHead}>
              <span className={`${styles.summaryIconWrap} ${styles.iconPrimary}`}>
                <slot.icon size={18} />
              </span>
              <span className={`${styles.summaryDelta} ${styles.deltaNeutral}`}>--</span>
            </div>
            <p className={styles.summaryLabel}>{slot.label}</p>
            <h3 className={styles.summaryValue}>No data yet</h3>
          </div>
        ))}
      </section>
    );
  }

  const iconToneClass: Record<SummaryStat['iconTone'], string> = {
    primary: styles.iconPrimary,
    tertiary: styles.iconTertiary,
    error: styles.iconError,
  };
  const deltaToneClass: Record<SummaryStat['deltaTone'], string> = {
    positive: styles.deltaPositive,
    negative: styles.deltaNegative,
    neutral: styles.deltaNeutral,
  };

  return (
    <section className={styles.summaryGrid}>
      {stats.map((stat) => (
        <div key={stat.id} className={styles.summaryCard}>
          <div className={styles.summaryCardHead}>
            <span className={`${styles.summaryIconWrap} ${iconToneClass[stat.iconTone]}`}>
              <stat.icon size={18} />
            </span>
            <span className={`${styles.summaryDelta} ${deltaToneClass[stat.deltaTone]}`}>
              {stat.delta}
            </span>
          </div>
          <p className={styles.summaryLabel}>{stat.label}</p>
          <h3 className={styles.summaryValue}>{stat.value}</h3>
        </div>
      ))}
    </section>
  );
}

// ---------------------------------------------------------------------------
// Portfolio growth chart
// ---------------------------------------------------------------------------

function GrowthChart({ data }: { data: ChartSeriesPoint[] }) {
  return (
    <section className={styles.chartSection}>
      <div className={styles.chartHeader}>
        <div>
          <h2 className={styles.sectionTitle}>Portfolio Growth Dynamics</h2>
          <p className={styles.subtitle}>Asset appreciation vs. liability amortization (LTM)</p>
        </div>
        <div className={styles.chartLegend}>
          <div className={styles.legendItem}>
            <span className={`${styles.legendDot} ${styles.legendDotPrimary}`} />
            <span className={styles.legendLabel}>Total Assets</span>
          </div>
          <div className={styles.legendItem}>
            <span className={`${styles.legendDot} ${styles.legendDotError}`} />
            <span className={styles.legendLabel}>Total Liabilities</span>
          </div>
        </div>
      </div>

      {data.length === 0 ? (
        <div className={styles.chartEmpty}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
            <LineChart size={28} style={{ opacity: 0.5 }} />
            <p style={{ margin: 0 }}>No data yet</p>
            <p style={{ margin: 0, maxWidth: '30ch', opacity: 0.7 }}>
              Connect an account or import a statement to see asset and liability trends here.
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className={styles.chartBody}>
            {/*
              Once `data` is populated, plot ChartSeriesPoint[] here — e.g.
              with recharts (LineChart/Area) or by generating an SVG path
              from the values.
            */}
          </div>
          <div className={styles.chartAxis}>
            {data.map((point) => (
              <span key={point.month}>{point.month}</span>
            ))}
          </div>
        </>
      )}
    </section>
  );
}

// ---------------------------------------------------------------------------
// Yield by category
// ---------------------------------------------------------------------------

function YieldByCategory({ categories }: { categories: CategoryYield[] }) {
  const toneClass: Record<CategoryYield['tone'], string> = {
    tertiary: styles.yieldFillTertiary,
    primary: styles.yieldFillPrimary,
    secondary: styles.yieldFillSecondary,
    muted: styles.yieldFillMuted,
  };

  return (
    <div className={styles.yieldCard}>
      <div className={styles.chartHeader} style={{ marginBottom: '2rem' }}>
        <h3 className={styles.sectionTitle} style={{ margin: 0 }}>
          Yield by Category
        </h3>
        <MoreVertical size={18} style={{ cursor: 'pointer', color: 'var(--on-surface-variant)' }} />
      </div>

      {categories.length === 0 ? (
        <p className={styles.insightEmpty} style={{ textAlign: 'center', padding: '24px 0' }}>
          No data yet
        </p>
      ) : (
        <div className={styles.yieldRows}>
          {categories.map((cat) => (
            <div key={cat.id}>
              <div className={styles.yieldRowHead}>
                <span>{cat.label}</span>
                <span className={styles.yieldPct}>{cat.yieldPct}%</span>
              </div>
              <div className={styles.yieldTrack}>
                <div
                  className={`${styles.yieldFill} ${toneClass[cat.tone]}`}
                  style={{ width: `${cat.barPct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Monthly cash flow heatmap
// ---------------------------------------------------------------------------

function CashFlowHeatmap({ months }: { months: CashFlowMonth[] }) {
  return (
    <div className={styles.heatmapCard}>
      <div className={styles.chartHeader} style={{ marginBottom: '2rem' }}>
        <h3 className={styles.sectionTitle} style={{ margin: 0 }}>
          Monthly Cash Flow Heatmap
        </h3>
        <div className={styles.heatmapLegend}>
          <span>Deficit</span>
          <div className={styles.heatmapSwatches}>
            <div className={`${styles.heatmapSwatch} ${styles.heatmapSwatchDeficit}`} />
            <div className={`${styles.heatmapSwatch} ${styles.heatmapSwatchFaint}`} />
            <div className={`${styles.heatmapSwatch} ${styles.heatmapSwatchMid}`} />
            <div className={`${styles.heatmapSwatch} ${styles.heatmapSwatchFull}`} />
          </div>
          <span>Surplus</span>
        </div>
      </div>

      {months.length === 0 ? (
        <div className={styles.heatmapGrid}>
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className={styles.heatmapCellEmpty}>
              <span className={styles.heatmapMonth} style={{ opacity: 0.5 }}>
                --
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.heatmapGrid}>
          {months.map((m) => (
            <div
              key={m.month}
              className={m.tone === 'surplus' ? styles.heatmapCellSurplus : styles.heatmapCellDeficit}
              style={{ opacity: 0.3 + (m.intensity / 100) * 0.7 }}
            >
              <span className={styles.heatmapMonth}>{m.month}</span>
              <span className={styles.heatmapAmount}>{m.amountLabel}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Upcoming milestones table
// ---------------------------------------------------------------------------

function MilestonesTable({ milestones }: { milestones: Milestone[] }) {
  const iconToneClass: Record<Milestone['iconTone'], string> = {
    tertiary: styles.tierExcellent,
    primary: styles.tierStable,
    secondary: styles.tierWatch,
  };

  return (
    <section className={styles.milestonesSection}>
      <div className={styles.milestonesHeader}>
        <div>
          <h3 className={styles.milestonesTitle}>Upcoming Milestones & Actions</h3>
          <p className={styles.milestonesSubtitle}>Projected goal completion and scheduled transfers</p>
        </div>
        <button className={styles.scheduleBtn}>
          <CalendarDays size={16} />
          Manage Schedule
        </button>
      </div>

      <table className={styles.table}>
        <thead className={styles.tableHead}>
          <tr>
            <th>Event Name</th>
            <th>Target Date</th>
            <th>Assigned Account</th>
            <th>Amount / Progress</th>
            <th style={{ textAlign: 'right' }}>Action</th>
          </tr>
        </thead>
        <tbody className={styles.tableBody}>
          {milestones.length === 0 ? (
            <tr>
              <td colSpan={5} className={styles.tableEmpty}>
                No upcoming milestones yet
              </td>
            </tr>
          ) : (
            milestones.map((m) => (
              <tr key={m.id}>
                <td>
                  <div className={styles.eventCell}>
                    <m.icon size={18} className={iconToneClass[m.iconTone]} />
                    <span>{m.name}</span>
                  </div>
                </td>
                <td>{m.targetDate}</td>
                <td>
                  <span className={styles.accountChip}>{m.account}</span>
                </td>
                <td>
                  {typeof m.progressPct === 'number' ? (
                    <>
                      <div className={styles.progressTrack}>
                        <div className={styles.progressFill} style={{ width: `${m.progressPct}%` }} />
                      </div>
                      <span className={styles.progressLabel}>{m.progressPct}% funded</span>
                    </>
                  ) : (
                    <span style={{ fontFamily: 'var(--font-mono)' }}>{m.amountLabel}</span>
                  )}
                </td>
                <td style={{ textAlign: 'right' }}>
                  <button className={styles.actionBtn}>{m.actionLabel}</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </section>
  );
}

// Icons referenced only in comments/data above but kept imported for when
// real milestone data supplies them: Home, CloudDownload, GraduationCap.
export const milestoneIconLibrary = { Home, CloudDownload, GraduationCap };
