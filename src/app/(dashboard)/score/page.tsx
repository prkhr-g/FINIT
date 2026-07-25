'use client';

import React from 'react';
import Link from 'next/link';
import styles from './page.module.css';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { scoreService, ScoreResult, ScoreHistory } from '@/services/score.service';

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

function fillClass(score: number, styles: Record<string, string>) {
  if (score < 50) return styles.fillWeak;
  if (score < 75) return styles.fillMid;
  return styles.fillGood;
}

function tintClass(index: number, styles: Record<string, string>) {
  return styles[`trackTint${index % 4}`];
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

  const fillDeg = scoreData ? (scoreData.score / 1000) * 360 : 0;

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

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>FINT Score</h1>
          <p className={styles.subtitle}>Evaluate your financial health quotient.</p>
        </div>
        <button
          className={styles.recalcBtn}
          onClick={handleRecalculate}
          disabled={recalculating}
        >
          {recalculating && <span className={styles.spinner} />}
          {recalculating ? 'Recalculating...' : 'Recalculate Score'}
        </button>
      </div>

      {error && (
        <div className={styles.missingBanner} style={{ borderColor: 'var(--red, #ef4444)' }}>
          <span className={styles.missingIcon}>✕</span>
          <p className={styles.missingText}>{error}</p>
        </div>
      )}

      {/* ---- Summary ---- */}
      <div className={styles.summaryCard}>
        <div
          className={styles.scoreGauge}
          style={{ ['--fill-deg' as string]: `${fillDeg}deg` }}
        >
          <div className={styles.scoreContent}>
            <span className={styles.scoreValue}>{scoreData ? scoreData.score : '—'}</span>
            <span className={styles.scoreOutOf}>
              OF {scoreData ? 1000 : 1000}
            </span>
          </div>
        </div>
        <div className={styles.summaryInfo}>
          <div className={styles.gradeRow}>
            {scoreData ? (
              <>
                <span className={styles.gradeBadge}>GRADE {scoreData.grade}</span>
                <span className={styles.riskBadge}>Risk: {scoreData.risk}</span>
              </>
            ) : (
              <span className={styles.riskBadge}>No data yet</span>
            )}
          </div>
          <h2 className={styles.statusLine}>
            {scoreData
              ? scoreData.recommendations?.[0] ?? 'Score calculated successfully.'
              : 'Score not calculated yet'}
          </h2>
          <p className={styles.deltaLine}>
            {scoreData && delta !== null ? (
              <>
                <span className={delta >= 0 ? styles.deltaUp : styles.deltaDown}>
                  {delta >= 0 ? '↑' : '↓'} {Math.abs(delta)} points
                </span>{' '}
                since last calculation
              </>
            ) : scoreData ? (
              `Calculated ${new Date(scoreData.calculatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`
            ) : (
              'Add your finance data and hit Recalculate to generate your first score.'
            )}
          </p>
        </div>
      </div>

      {/* ---- Missing data banner ---- */}
      {hasMissingData && (
        <div className={styles.missingBanner}>
          <span className={styles.missingIcon}>⚠</span>
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
      <div className={styles.pillarsCard}>
        <h2 className={styles.sectionTitle}>Pillar breakdown</h2>
        {sortedPillars.length ? (
          sortedPillars.map((pillar, index) => (
            <div key={pillar.pillar} className={styles.pillarRow}>
              <div className={styles.pillarTop}>
                <div>
                  <span className={styles.pillarName}>
                    {PILLAR_LABELS[pillar.pillar] ?? pillar.pillar}
                  </span>
                  <span className={styles.pillarWeight}>· {pillar.weight}% weight</span>
                </div>
                <span
                  className={styles.pillarScore}
                  style={{
                    color:
                      pillar.score < 50 ? 'var(--red)'
                      : pillar.score < 75 ? '#e8a23d'
                      : 'var(--green)',
                  }}
                >
                  {pillar.score}/100
                </span>
              </div>
              <div className={`${styles.pillarTrack} ${tintClass(index, styles)}`}>
                <div
                  className={`${styles.pillarFill} ${fillClass(pillar.score, styles)}`}
                  style={{ width: `${pillar.score}%` }}
                />
              </div>
              {pillar.remarks && (
                <p className={styles.pillarTip}>{pillar.remarks}</p>
              )}
            </div>
          ))
        ) : (
          Object.entries(PILLAR_LABELS).map(([key, name], index) => (
            <div key={key} className={styles.pillarRow}>
              <div className={styles.pillarTop}>
                <span className={styles.pillarName}>{name}</span>
                <span className={styles.pillarScore} style={{ color: 'var(--text-muted)' }}>
                  —
                </span>
              </div>
              <div className={`${styles.pillarTrack} ${tintClass(index, styles)}`}>
                <div className={styles.pillarFill} style={{ width: '0%' }} />
              </div>
            </div>
          ))
        )}
      </div>

      {/* ---- AI Recommendations ---- */}
      {scoreData?.recommendations && scoreData.recommendations.length > 1 && (
        <div className={styles.pillarsCard} style={{ marginTop: '16px' }}>
          <h2 className={styles.sectionTitle}>Recommendations</h2>
          <ul style={{ margin: 0, paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {scoreData.recommendations.map((r, i) => (
              <li key={i} style={{ fontSize: '14px', lineHeight: '1.6' }}>{r}</li>
            ))}
          </ul>
        </div>
      )}

      {/* ---- History trend ---- */}
      <div className={styles.trendCard}>
        <h2 className={styles.sectionTitle}>Score history</h2>
        {history.length >= 2 ? (
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={history}>
              <CartesianGrid stroke="var(--border-card)" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 12, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 1000]} tick={{ fontSize: 12, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <Tooltip />
              <Line type="monotone" dataKey="score" stroke="#4274d9" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className={styles.chartEmpty}>
            {history.length === 1
              ? 'Recalculate your score a few more times to see your trend here.'
              : 'Recalculate your score a few times over the coming weeks to see your trend here.'}
          </div>
        )}
      </div>

      {/* ---- Methodology ---- */}
      <div className={styles.methodologyCard}>
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
      </div>
    </div>
  );
}