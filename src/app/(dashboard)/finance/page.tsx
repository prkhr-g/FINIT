'use client';

import React from 'react';
import styles from './page.module.css';
import { PILLARS, FieldConfig, FinanceEntry } from './pillars.config';


type DataMap = Record<string, FinanceEntry[]>;

const fmt = (n: number) => `₹${Math.round(n).toLocaleString('en-IN')}`;

// Guarantees an array no matter what the API actually returned (undefined,
// null, a wrapped object, etc.) — this is the last line of defense so the
// page can never crash with "X.reduce is not a function" again.
const asArray = (v: unknown): FinanceEntry[] => (Array.isArray(v) ? v : []);

function buildInitialForm(fields: FieldConfig[]) {
  const initial: Record<string, string> = {};
  fields.forEach((f) => {
    initial[f.name] = f.defaultValue ?? '';
  });
  return initial;
}

export default function FinancePage() {
  const [activeKey, setActiveKey] = React.useState(PILLARS[0].key);
  const active = PILLARS.find((p) => p.key === activeKey) ?? PILLARS[0];

  const [data, setData] = React.useState<DataMap>({});
  const [loadingAll, setLoadingAll] = React.useState(true);

  const [form, setForm] = React.useState<Record<string, string>>(() => buildInitialForm(active.fields));
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);

  const loadAll = React.useCallback(async () => {
    setLoadingAll(true);
    const results = await Promise.allSettled(PILLARS.map((p) => p.list()));
    const next: DataMap = {};
    PILLARS.forEach((p, i) => {
      const r = results[i];
      next[p.key] = r.status === 'fulfilled' ? asArray(r.value) : [];
    });
    setData(next);
    setLoadingAll(false);
  }, []);

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial data load on mount, not a render-driven cascade
    loadAll();
  }, [loadAll]);

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- resetting the form when the user switches pillar tabs
    setForm(buildInitialForm(active.fields));
    setError(null);
    setSuccess(null);
  }, [activeKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const entries = React.useMemo(() => asArray(data[active.key]), [data, active.key]);

  const total = React.useMemo(
    () => entries.reduce((sum, e) => sum + active.getAmount(e), 0),
    [entries, active]
  );

  // ---- Overview strip, computed once all pillars have loaded ----
  const assetsTotal = asArray(data.assets).reduce((s, e) => s + (Number(e.currentValue) || 0), 0);
  const investmentsTotal = asArray(data.investments).reduce(
    (s, e) => s + (Number(e.currentPrice) || 0) * (Number(e.quantity) || 1),
    0
  );
  const accountsTotal = asArray(data.accounts).reduce((s, e) => s + (Number(e.currentBalance) || 0), 0);
  const loansTotal = asArray(data.loans).reduce((s, e) => s + (Number(e.remainingBalance) || 0), 0);
  const netWorth = assetsTotal + investmentsTotal + accountsTotal - loansTotal;
  const hasAnyFinanceData = assetsTotal > 0 || investmentsTotal > 0 || accountsTotal > 0 || loansTotal > 0;

  const incomeTotal = asArray(data.income).reduce((s, e) => s + (Number(e.amount) || 0), 0);
  const expenseTotal = asArray(data.expense).reduce((s, e) => s + (Number(e.amount) || 0), 0);
  const cashFlow = incomeTotal - expenseTotal;
  const hasCashFlowData = incomeTotal > 0 || expenseTotal > 0;

  const coverageTotal = asArray(data.insurance).reduce((s, e) => s + (Number(e.coverageAmount) || 0), 0);

  const goalsList = asArray(data.goals);
  const activeGoals = goalsList.filter((g) => (g.status ?? 'ACTIVE') === 'ACTIVE').length;
  const goalsTarget = goalsList.reduce((s, e) => s + (Number(e.targetAmount) || 0), 0);
  const goalsSaved = goalsList.reduce((s, e) => s + (Number(e.currentAmount) || 0), 0);
  const goalsProgress = goalsTarget > 0 ? Math.min(1, goalsSaved / goalsTarget) : 0;

  const handleChange = (name: string, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const missing = active.fields.find((f) => f.required && !String(form[f.name] ?? '').trim());
    if (missing) {
      setError(`Please fill in ${missing.label.toLowerCase()}.`);
      return;
    }

    const payload: Record<string, string | number> = {};
    active.fields.forEach((f) => {
      const raw = form[f.name];
      if (raw === undefined || raw === '') return;
      payload[f.name] = f.type === 'number' ? Number(raw) : raw;
    });

    setSubmitting(true);
    try {
      await active.create(payload);
      setSuccess(`${active.label.slice(0, -1) || active.label} added.`);
      setForm(buildInitialForm(active.fields));
      loadAll();
    } catch (err) {
      setError(err instanceof Error ? err.message : `Could not add ${active.label.toLowerCase()}.`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    const prev = asArray(data[active.key]);
    setData((d) => ({ ...d, [active.key]: prev.filter((e) => e.id !== id) }));
    try {
      await active.remove(id);
    } catch {
      setData((d) => ({ ...d, [active.key]: prev }));
      setError(`Could not remove that entry.`);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Finance Command Center</h1>
      </div>

      <div className={styles.overviewGrid}>
        <div className={styles.overviewCard}>
          <div className={styles.overviewCardTop}>
            <span className={styles.overviewLabel}>NET WORTH</span>
            <span className={styles.overviewIcon}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </div>
          <span className={styles.overviewValue}>
            {loadingAll ? '—' : fmt(netWorth)}
          </span>
          <span className={styles.overviewSub}>
            {loadingAll ? 'Loading…' : hasAnyFinanceData ? 'Accounts + assets + investments − loans' : 'No accounts, assets, or loans yet'}
          </span>
        </div>
        <div className={styles.overviewCard}>
          <div className={styles.overviewCardTop}>
            <span className={styles.overviewLabel}>CASH FLOW</span>
            <span className={styles.overviewIcon}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </div>
          <span className={`${styles.overviewValue} ${cashFlow < 0 ? styles.negative : ''}`}>
            {loadingAll ? '—' : `${cashFlow >= 0 ? '+' : '−'}${fmt(Math.abs(cashFlow))}`}
          </span>
          <span className={styles.overviewSub}>
            {loadingAll ? 'Loading…' : hasCashFlowData ? `${fmt(incomeTotal)} in · ${fmt(expenseTotal)} out` : 'No income or expenses logged yet'}
          </span>
        </div>
        <div className={styles.overviewCard}>
          <div className={styles.overviewCardTop}>
            <span className={styles.overviewLabel}>INSURANCE COVER</span>
            <span className={styles.overviewIcon}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </div>
          <span className={styles.overviewValue}>{loadingAll ? '—' : fmt(coverageTotal)}</span>
          <span className={styles.overviewSub}>
            {loadingAll ? 'Loading…' : `${asArray(data.insurance).length} active ${asArray(data.insurance).length === 1 ? 'policy' : 'policies'}`}
          </span>
        </div>
        <div className={styles.overviewCard}>
          <div className={styles.overviewCardTop}>
            <span className={styles.overviewLabel}>GOALS</span>
            <span className={styles.overviewIcon}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </div>
          <span className={styles.overviewValue}>{loadingAll ? '—' : `${activeGoals} active`}</span>
          <div className={styles.overviewProgressTrack}>
            <div className={styles.overviewProgressFill} style={{ width: `${Math.round(goalsProgress * 100)}%` }} />
          </div>
          <span className={styles.overviewSub}>
            {loadingAll ? 'Loading…' : goalsTarget > 0 ? `${fmt(goalsSaved)} of ${fmt(goalsTarget)} saved` : 'No goals set yet'}
          </span>
        </div>
      </div>

      <div className={styles.tabRow}>
        {PILLARS.map((p) => (
          <button
            key={p.key}
            className={`${styles.tab} ${activeKey === p.key ? styles.tabActive : ''}`}
            onClick={() => setActiveKey(p.key)}
          >
            <span className={styles.tabIcon}>{p.icon}</span>
            {p.label.toUpperCase()}
          </button>
        ))}
      </div>

      <p className={styles.tagline}>{active.tagline}</p>

      <div className={styles.layout} key={activeKey}>
        <form className={styles.formCard} onSubmit={handleSubmit}>
          <h2 className={styles.formTitle}>{active.formTitle}</h2>

          {active.fields.map((f) => (
            <div className={styles.field} key={f.name}>
              <label className={styles.label}>{f.label}</label>
              {f.type === 'select' ? (
                <select
                  className={styles.select}
                  value={form[f.name] ?? ''}
                  onChange={(e) => handleChange(f.name, e.target.value)}
                >
                  {(f.options ?? []).map((o) => (
                    <option key={o} value={o}>
                      {o.replace(/_/g, ' ')}
                    </option>
                  ))}
                </select>
              ) : (
                <div className={styles.inputWrap}>
                  <input
                    className={styles.input}
                    type={f.type === 'number' ? 'number' : f.type === 'date' ? 'date' : 'text'}
                    min={f.type === 'number' ? '0' : undefined}
                    step={f.type === 'number' ? 'any' : undefined}
                    placeholder={f.placeholder}
                    value={form[f.name] ?? ''}
                    onChange={(e) => handleChange(f.name, e.target.value)}
                  />
                  {f.suffix && <span className={styles.inputSuffix}>{f.suffix}</span>}
                </div>
              )}
            </div>
          ))}

          <button className={styles.submitBtn} type="submit" disabled={submitting}>
            {submitting ? 'Adding…' : active.formTitle}
          </button>
          {error && <p className={styles.errorText}>{error}</p>}
          {success && <p className={styles.successText}>{success}</p>}
        </form>

        <div className={styles.listCard}>
          <div className={styles.listHeader}>
            <h2 className={styles.listTitle}>{active.label}</h2>
            <span className={styles.listTotal}>
              {active.sumLabel} · {fmt(total)}
            </span>
          </div>

          {loadingAll ? (
            <div className={styles.emptyState}>Loading…</div>
          ) : entries.length === 0 ? (
            <div className={styles.emptyState}>{active.emptyMessage}</div>
          ) : (
            <div className={styles.entryList}>
              {entries.map((e) => {
                const progress = active.getProgress ? active.getProgress(e) : null;
                return (
                  <div key={e.id} className={styles.entryRow}>
                    <div className={styles.entryMain}>
                      <span className={styles.entryTitle}>{active.getTitle(e)}</span>
                      <span className={styles.entryMeta}>{active.getMeta(e)}</span>
                      {progress !== null && (
                        <div className={styles.entryProgressTrack}>
                          <div className={styles.entryProgressFill} style={{ width: `${Math.round(progress * 100)}%` }} />
                        </div>
                      )}
                    </div>
                    <div className={styles.entryRight}>
                      <span className={styles.entryAmount}>{fmt(active.getAmount(e))}</span>
                      <button className={styles.deleteBtn} onClick={() => handleDelete(e.id)}>
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
