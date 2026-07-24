'use client';

import React from 'react';
import Link from 'next/link';
import styles from './page.module.css';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

interface Pillar {
  key: string;
  name: string;
  weight: number;
  score: number; // 0-100
}

interface ScoreData {
  score: number;
  maxScore: number;
  grade: string;
  riskBand: string;
  status: string;
  delta: number; // vs previous period
  pillars: Pillar[];
  history: { date: string; score: number }[];
  hasMissingData: boolean;
  missingAreas: { label: string; href: string }[];
}

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

  // Stays null until wired to GET /score, GET /score/history.
  // Replace this effect with the real fetch once the API contract is confirmed.
  const [scoreData, setScoreData] = React.useState<ScoreData | null>(null);

  React.useEffect(() => {
    // TODO: replace with real API call
    // const res = await fetch('/api/score'); setScoreData(await res.json());
    setLoading(false);
  }, []);

  const handleRecalculate = async () => {
    setRecalculating(true);
    try {
      // TODO: await fetch('/api/score/calculate', { method: 'POST' })
      await new Promise((r) => setTimeout(r, 1200));
    } finally {
      setRecalculating(false);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  const sortedPillars = scoreData
    ? [...scoreData.pillars].sort((a, b) => a.score - b.score)
    : [];

  const fillDeg = scoreData ? (scoreData.score / scoreData.maxScore) * 360 : 0;

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

      {/* ---- Summary ---- */}
      <div className={styles.summaryCard}>
        <div
          className={styles.scoreGauge}
          style={{ ['--fill-deg' as string]: `${fillDeg}deg` }}
        >
          <div className={styles.scoreContent}>
            <span className={styles.scoreValue}>{scoreData ? scoreData.score : '—'}</span>
            <span className={styles.scoreOutOf}>
              OF {scoreData ? scoreData.maxScore : 1000}
            </span>
          </div>
        </div>
        <div className={styles.summaryInfo}>
          <div className={styles.gradeRow}>
            {scoreData ? (
              <>
                <span className={styles.gradeBadge}>GRADE {scoreData.grade}</span>
                <span className={styles.riskBadge}>Risk: {scoreData.riskBand}</span>
              </>
            ) : (
              <span className={styles.riskBadge}>No data yet</span>
            )}
          </div>
          <h2 className={styles.statusLine}>
            {scoreData ? scoreData.status : 'Score not calculated yet'}
          </h2>
          <p className={styles.deltaLine}>
            {scoreData ? (
              <>
                <span className={scoreData.delta >= 0 ? styles.deltaUp : styles.deltaDown}>
                  {scoreData.delta >= 0 ? '↑' : '↓'} {Math.abs(scoreData.delta)} points
                </span>{' '}
                since last calculation
              </>
            ) : (
              'Add your finance data and hit Recalculate to generate your first score.'
            )}
          </p>
        </div>
      </div>

      {/* ---- Missing data banner ---- */}
      {scoreData?.hasMissingData && (
        <div className={styles.missingBanner}>
          <span className={styles.missingIcon}>⚠</span>
          <div>
            <p className={styles.missingText}>
              Your score reflects missing data, not necessarily financial distress —
              a few pillars haven't been filled in yet.
            </p>
            <div className={styles.missingLinks}>
              {scoreData.missingAreas.map((area) => (
                <Link key={area.href} href={area.href} className={styles.missingLink}>
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
            <div key={pillar.key} className={styles.pillarRow}>
              <div className={styles.pillarTop}>
                <div>
                  <span className={styles.pillarName}>{pillar.name}</span>
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
              {pillar.score < 75 && (
                <p className={styles.pillarTip}>
                  Improve this by logging more data in the {pillar.name} section.
                </p>
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

      {/* ---- History trend ---- */}
      <div className={styles.trendCard}>
        <h2 className={styles.sectionTitle}>Score history</h2>
        {scoreData?.history?.length ? (
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={scoreData.history}>
              <CartesianGrid stroke="var(--border-card)" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 12, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <Tooltip />
              <Line type="monotone" dataKey="score" stroke="#4274d9" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className={styles.chartEmpty}>
            Recalculate your score a few times over the coming weeks to see your trend here.
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
            (e.g. no live credit bureau integration yet, and retirement projections don't account
            for compounding). Scores recompute monthly, or on demand via Recalculate.
          </div>
        )}
      </div>
    </div>
  );
}