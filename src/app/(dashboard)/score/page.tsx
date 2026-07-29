'use client';

import React from 'react';
import Link from 'next/link';
import styles from './page.module.css';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { scoreService, ScoreResult, ScoreHistory } from '@/services/score.service';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

const PILLAR_LABELS: Record<string, string> = {
  income: 'Income Stability',
  cashflow: 'Cash Flow',
  debt: 'Debt Health',
  credit: 'Credit Health',
  savings: 'Savings',
  emergencyFund: 'Emergency Fund',
  insurance: 'Insurance',
  investments: 'Investments',
  retirement: 'Retirement',
  behaviour: 'Financial Behaviour',
};

// Material Symbols icon per pillar
const PILLAR_ICONS: Record<string, string> = {
  income: 'account_balance',
  cashflow: 'water_drop',
  debt: 'credit_card_off',
  credit: 'credit_score',
  savings: 'savings',
  emergencyFund: 'emergency',
  insurance: 'shield',
  investments: 'trending_up',
  retirement: 'event_available',
  behaviour: 'psychology',
};

// Insight card accent icons, cycled per recommendation
const INSIGHT_ICONS = ['trending_down', 'savings', 'shield', 'lightbulb', 'bolt'];

type Tier = 'critical' | 'watch' | 'stable' | 'excellent';

function tierFor(score: number): Tier {
  if (score < 50) return 'critical';
  if (score < 75) return 'watch';
  if (score < 90) return 'stable';
  return 'excellent';
}

const TIER_LABEL: Record<Tier, string> = {
  critical: 'CRITICAL',
  watch: 'NEEDS ATTENTION',
  stable: 'STABLE',
  excellent: 'EXCELLENT',
};

const TIER_TEXT_CLASS: Record<Tier, string> = {
  critical: 'tierCritical',
  watch: 'tierWatch',
  stable: 'tierStable',
  excellent: 'tierExcellent',
};

const TIER_BG_CLASS: Record<Tier, string> = {
  critical: 'bgTierCritical',
  watch: 'bgTierWatch',
  stable: 'bgTierStable',
  excellent: 'bgTierExcellent',
};

const TIER_FILL_CLASS: Record<Tier, string> = {
  critical: 'fillCritical',
  watch: 'fillWatch',
  stable: 'fillStable',
  excellent: 'fillExcellent',
};

const TIER_BADGE_CLASS: Record<Tier, string> = {
  critical: 'badgeCritical',
  watch: 'badgeWatch',
  stable: 'badgeStable',
  excellent: 'badgeExcellent',
};

function cx(styles: Record<string, string>, ...keys: string[]) {
  return keys.map((k) => styles[k]).filter(Boolean).join(' ');
}

export default function ScorePage() {
  const [loading, setLoading] = React.useState(true);
  const [recalculating, setRecalculating] = React.useState(false);
  const [methodologyOpen, setMethodologyOpen] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const [scoreData, setScoreData] = React.useState<ScoreResult | null>(null);
  const [history, setHistory] = React.useState<{ date: string; score: number }[]>([]);

  // Fetch current score + history in parallel on mount
  React.useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [scoreRes, historyRes] = await Promise.allSettled([
        scoreService.getCurrent(),
        scoreService.getHistory(),
      ]);

      if (scoreRes.status === 'fulfilled') {
        setScoreData(scoreRes.value);
      }

      if (historyRes.status === 'fulfilled') {
        const mapped = (historyRes.value as ScoreHistory[]).map((h) => ({
          date: new Date(h.calculatedAt).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
          }),
          score: h.score,
        }));
        setHistory(mapped);
      }

      setLoading(false);
    };

    load();
  }, []);

  const handleRecalculate = async () => {
    setRecalculating(true);
    setError(null);
    try {
      const result = await scoreService.recalculate();
      setScoreData(result);
      // Refresh history too
      const historyRes = await scoreService.getHistory();
      const mapped = historyRes.map((h) => ({
        date: new Date(h.calculatedAt).toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
        }),
        score: h.score,
      }));
      setHistory(mapped);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not recalculate score. Please add finance data first.');
    } finally {
      setRecalculating(false);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading your score…</div>;
  }

  // Pillars sorted worst→best for display
  const pillars = scoreData?.factors ?? [];
  const sortedPillars = [...pillars].sort((a, b) => a.score - b.score);

  // Gauge geometry — score is out of 1000, mapped onto a 0-100 arc
  const RADIUS = 45;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
  const pct = scoreData ? Math.min(Math.max(scoreData.score / 1000, 0), 1) : 0;
  const dashOffset = CIRCUMFERENCE * (1 - pct);
  const overallTier = scoreData ? tierFor(scoreData.score / 10) : 'watch';

  // Delta: score now vs previous history entry
  const prevScore = history.length >= 2 ? history[history.length - 2].score : null;
  const delta = scoreData && prevScore !== null ? scoreData.score - prevScore : null;

  // Missing data areas — pillars with score < 10 are likely unpopulated
  const missingAreas = pillars
    .filter((p) => p.score < 10)
    .map((p) => ({
      label: PILLAR_LABELS[p.pillar] ?? p.pillar,
      href: '/finance',
    }));
  const hasMissingData = missingAreas.length > 0;

  const insights = scoreData?.recommendations ?? [];

  return (
    <div className={styles.page}>
      {/* Fonts used by this design: Inter, JetBrains Mono, Material Symbols */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
      />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
      />

      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>FINT Score</h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <ThemeToggle showLabel />
          <button
            className={styles.recalcBtn}
            onClick={handleRecalculate}
            disabled={recalculating}
          >
            {recalculating ? (
              <span className={styles.spinner} />
            ) : (
              <span className={styles.icon}>refresh</span>
            )}
            {recalculating ? 'Recalculating...' : 'Recalculate Score'}
          </button>
        </div>
      </div>

      {error && (
        <div className={styles.errorBanner}>
          <span className={styles.icon}>error</span>
          <p className={styles.missingText}>{error}</p>
        </div>
      )}

      <div className={styles.bentoGrid}>
        {/* ---- Score gauge ---- */}
        <section className={styles.gaugeSection}>
          <div className={styles.gaugeWrap}>
            <svg className={styles.gaugeSvg} viewBox="0 0 100 100">
              <circle
                className={styles.gaugeTrack}
                cx="50" cy="50" r={RADIUS}
                fill="none" stroke="currentColor" strokeWidth="8"
              />
              {scoreData && (
                <circle
                  className={styles.gaugeFill}
                  cx="50" cy="50" r={RADIUS}
                  fill="none"
                  stroke="url(#fintGaugeGradient)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={CIRCUMFERENCE}
                  strokeDashoffset={dashOffset}
                />
              )}
              <defs>
                <linearGradient id="fintGaugeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#2e5bff" />
                  <stop offset="100%" stopColor="#48d9ff" />
                </linearGradient>
              </defs>
            </svg>
            <div className={styles.gaugeCenter}>
              <span className={styles.gaugeScore}>{scoreData ? scoreData.score : '—'}</span>
              <span className={styles.gaugeOutOf}>of 1000</span>
            </div>
          </div>

          {scoreData ? (
            <>
              <div className={cx(styles, 'statusPill', TIER_BG_CLASS[overallTier])}>
                <span
                  className={styles.statusDot}
                  style={{ background: `var(--${overallTier === 'critical' ? 'error' : overallTier === 'watch' ? 'secondary' : overallTier === 'stable' ? 'primary' : 'tertiary'})` }}
                />
                <span className={styles[TIER_TEXT_CLASS[overallTier]]}>
                  GRADE {scoreData.grade} · Risk: {scoreData.risk}
                </span>
              </div>
              <p className={styles.gaugeCaption}>
                {delta !== null ? (
                  <>
                    Your score has {delta >= 0 ? 'increased' : 'decreased'} by{' '}
                    <span className={styles[delta >= 0 ? 'tierExcellent' : 'tierCritical']}>
                      {delta >= 0 ? '+' : ''}{delta} points
                    </span>{' '}
                    since your last calculation.
                  </>
                ) : (
                  scoreData.recommendations?.[0] ?? 'Score calculated successfully.'
                )}
              </p>
            </>
          ) : (
            <p className={styles.gaugeEmpty}>
              Add your finance data and hit Recalculate to generate your first score.
            </p>
          )}
        </section>

        {/* ---- Improvement Insights ---- */}
        <section className={styles.insightsSection}>
          <h4 className={styles.sectionTitle}>
            <span className={styles.icon} style={{ color: 'var(--primary)' }}>lightbulb</span>
            Improvement Insights
          </h4>
          {insights.length ? (
            <ul className={styles.insightList}>
              {insights.map((rec, i) => {
                const icon = INSIGHT_ICONS[i % INSIGHT_ICONS.length];
                const tiers: Tier[] = ['stable', 'excellent', 'watch', 'critical'];
                const tier = tiers[i % tiers.length];
                return (
                  <li
                    key={i}
                    className={styles.insightItem}
                    style={{ borderLeftColor: `var(--${tier === 'critical' ? 'error' : tier === 'watch' ? 'secondary' : tier === 'stable' ? 'primary' : 'tertiary'})` }}
                  >
                    <span className={styles.insightIconWrap}>
                      <span className={styles.icon}>{icon}</span>
                    </span>
                    <p className={styles.insightText}>{rec}</p>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className={styles.insightEmpty}>
              Recommendations will appear here once your score has been calculated.
            </p>
          )}
        </section>

        {/* ---- Grade Analysis ---- */}
        <section className={styles.gradeSection}>
          <div className={styles.gradeContainer}>
            <div className={styles.gradeInfo}>
              <h3 className={styles.gradeTitle}>Grade Analysis</h3>
              <p className={styles.gradeSubtitle}>
                Current Standing: {scoreData ? `Grade ${scoreData.grade}` : 'No Grade Yet'}
              </p>
            </div>
            <div className={styles.gradeList}>
              {[
                { grade: 'A', label: 'Excellent' },
                { grade: 'B', label: 'Good' },
                { grade: 'C', label: 'Average' },
                { grade: 'D', label: 'Below' },
                { grade: 'E', label: 'Critical' },
              ].map((item) => {
                const isActive = scoreData ? scoreData.grade?.toUpperCase() === item.grade : false;
                const displayLabel = isActive ? 'Current' : item.label;
                return (
                  <div key={item.grade} className={styles.gradeItem}>
                    <div className={cx(styles, 'gradeCircle', isActive ? 'gradeCircleActive' : '')}>
                      {item.grade}
                    </div>
                    <span className={cx(styles, 'gradeItemLabel', isActive ? 'gradeItemLabelActive' : '')}>
                      {displayLabel}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ---- Missing data banner ---- */}
        {hasMissingData && (
          <div className={styles.missingBanner}>
            <span className={styles.icon} style={{ color: 'var(--primary)' }}>info</span>
            <div>
              <p className={styles.missingText}>
                Your score reflects missing data, not necessarily financial distress —
                a few pillars haven&apos;t been filled in yet.
              </p>
              <div className={styles.missingLinks}>
                {missingAreas.map((area) => (
                  <Link key={area.label} href={area.href} className={styles.missingLink}>
                    Add {area.label} →
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ---- Pillar breakdown ---- */}
        <section className={styles.pillarSection}>
          <div className={styles.pillarHeader}>
            <h4 className={styles.sectionTitle} style={{ margin: 0 }}>Pillar Breakdown</h4>
          </div>
          <div className={styles.pillarList}>
            {sortedPillars.length ? (
              sortedPillars.map((pillar) => {
                const tier = tierFor(pillar.score);
                return (
                  <div key={pillar.pillar} className={styles.pillarRow}>
                    <div className={styles.pillarNameCol}>
                      <span className={styles.icon} style={{ color: 'var(--outline)' }}>
                        {PILLAR_ICONS[pillar.pillar] ?? 'radio_button_unchecked'}
                      </span>
                      <span>
                        <span className={styles.pillarName}>
                          {PILLAR_LABELS[pillar.pillar] ?? pillar.pillar}
                        </span>
                        <span className={styles.pillarWeight}>{pillar.weight}% weight</span>
                      </span>
                    </div>
                    <div className={styles.pillarTrack}>
                      <div
                        className={cx(styles, 'pillarFill', TIER_FILL_CLASS[tier])}
                        style={{ width: `${pillar.score}%` }}
                      />
                    </div>
                    <div className={cx(styles, 'pillarScore', TIER_TEXT_CLASS[tier])}>
                      {pillar.score}
                    </div>
                    <div className={styles.pillarBadgeWrap}>
                      <span className={cx(styles, 'pillarBadge', TIER_BADGE_CLASS[tier])}>
                        {TIER_LABEL[tier]}
                      </span>
                    </div>
                    {pillar.remarks && (
                      <p className={styles.pillarTip}>{pillar.remarks}</p>
                    )}
                  </div>
                );
              })
            ) : (
              Object.entries(PILLAR_LABELS).map(([key, name]) => (
                <div key={key} className={styles.pillarRow}>
                  <div className={styles.pillarNameCol}>
                    <span className={styles.icon} style={{ color: 'var(--outline)' }}>
                      {PILLAR_ICONS[key] ?? 'radio_button_unchecked'}
                    </span>
                    <span>
                      <span className={styles.pillarName}>{name}</span>
                    </span>
                  </div>
                  <div className={styles.pillarTrack}>
                    <div className={styles.pillarFill} style={{ width: '0%' }} />
                  </div>
                  <div className={styles.pillarScore} style={{ color: 'var(--on-surface-variant)' }}>—</div>
                  <div className={styles.pillarBadgeWrap} />
                </div>
              ))
            )}
          </div>
        </section>

        {/* ---- History trend ---- */}
        <section className={styles.trendSection}>
          <h4 className={styles.sectionTitle}>Score History</h4>
          {history.length >= 2 ? (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={history}>
                <CartesianGrid stroke="#1A2433" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#c4c5d9' }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 1000]} tick={{ fontSize: 12, fill: '#c4c5d9' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    background: '#0A1220',
                    border: '1px solid #1A2433',
                    borderRadius: 8,
                    color: '#dce2f2',
                  }}
                />
                <Line type="monotone" dataKey="score" stroke="#2e5bff" strokeWidth={2.5} dot={{ fill: '#48d9ff', r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className={styles.chartEmpty}>
              {history.length === 1
                ? 'Recalculate your score a few more times to see your trend here.'
                : 'Recalculate your score a few times over the coming weeks to see your trend here.'}
            </div>
          )}
        </section>

        {/* ---- Methodology ---- */}
        <section className={styles.methodologySection}>
          <button
            className={styles.methodologyToggle}
            onClick={() => setMethodologyOpen((v) => !v)}
          >
            How is this calculated?
            <span className={`${styles.methodologyIcon} ${methodologyOpen ? styles.methodologyIconOpen : ''}`}>
              ▾
            </span>
          </button>
          {methodologyOpen && (
            <div className={styles.methodologyBody}>
              Your FINT Score is calculated across 10 weighted pillars — Income Stability, Cash Flow,
              Debt Health, Credit Health, Savings, Emergency Fund, Insurance, Investments, Retirement,
              and Financial Behaviour. Some pillars use proxy signals rather than real bureau data
              (e.g. no live credit bureau integration yet, and retirement projections don&apos;t account
              for compounding). Scores recompute monthly, or on demand via Recalculate.
            </div>
          )}
        </section>

        {/* ---- Footer meta ---- */}
        <footer className={styles.footer}>
          <p>
            {scoreData
              ? `Last recalculation: ${new Date(scoreData.calculatedAt).toLocaleString('en-IN', {
                  day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit',
                })}`
              : 'No recalculation yet'}
          </p>
          <p>FINT Financial Ecosystem · Encrypted environment</p>
        </footer>
      </div>
    </div>
  );
}