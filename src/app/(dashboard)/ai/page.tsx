'use client';

import React from 'react';
import Link from 'next/link';
import styles from './page.module.css';
import { useAuth } from '@/providers/AuthProvider';
import { useTheme } from '@/providers/ThemeProvider';

/* ──────────────────────────────────────────────
   Types — mirrors what AiModule's services return
   ────────────────────────────────────────────── */
interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  text: string;
  figures?: { label: string; value: string; tone?: 'up' | 'down' | 'flag' }[];
  createdAt: string;
}

interface Recommendation {
  id: string;
  title: string;
  note: string;
  confidence: 'High' | 'Medium' | 'Low';
}

const QUICK_ACTIONS = [
  { key: 'simulate', label: 'Run simulation' },
  { key: 'forecast', label: 'Build forecast' },
  { key: 'advisory', label: 'Ask advisory' },
];

export default function AiAdvisorPage() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

  // New page — no seeded conversation or insights. Everything below is
  // populated as the real services (ChatService, ContextBuilderService,
  // recommendation/forecast engines) return data.
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [recommendations, setRecommendations] = React.useState<Recommendation[]>([]);
  const [confidence, setConfidence] = React.useState<{ level: string; sessionCount: number } | null>(null);
  const [forecast, setForecast] = React.useState<{ monthlyChangePct: number; note: string } | null>(null);
  const [input, setInput] = React.useState('');
  const [thinking, setThinking] = React.useState(false);

  const firstName = user?.name?.split(' ')[0] ?? 'there';

  const handleSend = () => {
    if (!input.trim()) return;
    const now = new Date().toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' });
    setMessages((prev) => [...prev, { id: `u-${Date.now()}`, role: 'user', text: input.trim(), createdAt: now }]);
    setInput('');
    setThinking(true);
    // TODO: wire to ChatService / ContextBuilderService and replace this
    // with the real response (and update recommendations/confidence/forecast
    // from whatever the backend returns alongside it).
    setTimeout(() => {
      setThinking(false);
    }, 900);
  };

  const handleClear = () => {
    setMessages([]);
    setThinking(false);
  };

  return (
    <div className={`${styles.page} ${isDarkMode ? styles.darkTheme : styles.lightTheme}`}>
      {/* ── HEADER ── */}
      <div className={styles.overviewHeader}>
        <div className={styles.overviewLeft}>
          <h2 className={styles.overviewTitle}>AI Advisor</h2>
          <p className={styles.overviewSub}>
            Ask about your money, {firstName} — run a simulation, or check your forecast.
          </p>
        </div>
        <div className={styles.overviewActions}>
          <button className={`${styles.actionBtn} ${styles.actionBtnPrimary}`} onClick={handleClear}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            New chat
          </button>
          <button className={styles.actionBtn} onClick={handleClear}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14z"/></svg>
            Clear
          </button>
          <Link href="/profile" className={styles.iconBtn} title="Profile">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </Link>
        </div>
      </div>

      {/* ── MAIN GRID ── */}
      <div className={styles.mainGrid}>
        {/* ── LEFT: CHAT ── */}
        <div className={styles.leftCol}>
          <div className={styles.chatCard}>
            <div className={styles.chatThread}>
              {messages.length === 0 && !thinking && (
                <div className={styles.emptyState}>
                  <div className={styles.emptyStateTitle}>Start the conversation</div>
                  <p className={styles.emptyStateText}>
                    Ask about your SIP, retirement runway, or expenses — or try one of the prompts below.
                  </p>
                </div>
              )}
              {messages.map((m) => (
                <div key={m.id} className={`${styles.messageRow} ${m.role === 'user' ? styles.messageUser : styles.messageAi}`}>
                  <div className={styles.messageWho}>{m.role === 'user' ? firstName : 'Advisor'}</div>
                  <div className={styles.messageBubble}>
                    <p className={styles.messageText}>{m.text}</p>
                    {m.figures?.map((f, i) => (
                      <div key={i} className={styles.figureLine}>
                        <span>{f.label}</span>
                        <span className={`${styles.figureVal} ${f.tone === 'flag' ? styles.figureFlag : f.tone === 'up' ? styles.figureUp : ''}`}>
                          {f.value}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className={styles.messageTime}>{m.createdAt}</div>
                </div>
              ))}
              {thinking && (
                <div className={`${styles.messageRow} ${styles.messageAi}`}>
                  <div className={styles.messageWho}>Advisor</div>
                  <div className={styles.messageBubble}>
                    <p className={styles.messageText}>Thinking…</p>
                  </div>
                </div>
              )}
            </div>

            <div className={styles.composer}>
              <div className={styles.chips}>
                {QUICK_ACTIONS.map((a) => (
                  <button key={a.key} className={styles.chip}>{a.label}</button>
                ))}
              </div>
              <div className={styles.inputRow}>
                <input
                  type="text"
                  value={input}
                  placeholder="Ask your advisor anything…"
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                />
                <button className={styles.sendBtn} onClick={handleSend}>
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT: INSIGHTS ── */}
        <div className={styles.rightCol}>
          <div className={styles.confidenceCard}>
            <div className={styles.confidenceLabel}>ADVISORY CONFIDENCE</div>
            {confidence ? (
              <>
                <div className={styles.confidenceVal}>{confidence.level}</div>
                <div className={styles.confidenceGrade}>Based on {confidence.sessionCount} sessions this month</div>
              </>
            ) : (
              <>
                <div className={styles.confidenceValMuted}>—</div>
                <div className={styles.confidenceGrade}>No sessions yet this month</div>
              </>
            )}
            <p className={styles.confidenceNote}>
              Recommendations factor in your current SIP, expense pattern, and emergency fund status.
            </p>
          </div>

          <div className={styles.forecastCard}>
            <div className={styles.forecastLabel}>SAVINGS FORECAST · 12MO</div>
            {forecast ? (
              <>
                <div className={styles.forecastVal}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4adc8c" strokeWidth="2.5"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
                  {forecast.monthlyChangePct > 0 ? '+' : ''}{forecast.monthlyChangePct}% / mo
                </div>
                <div className={styles.forecastNote}>{forecast.note}</div>
              </>
            ) : (
              <div className={styles.forecastNote}>Ask the advisor a question to generate your first forecast.</div>
            )}
          </div>

          <div className={styles.recCard}>
            <div className={styles.recHeader}>
              <h3 className={styles.cardTitle}>Recommendations</h3>
            </div>
            {recommendations.length > 0 ? (
              <div className={styles.recList}>
                {recommendations.map((r) => (
                  <div key={r.id} className={styles.recItem}>
                    <div className={styles.recTop}>
                      <div className={styles.recTitle}>{r.title}</div>
                      <span className={`${styles.recBadge} ${r.confidence === 'High' ? styles.recBadgeHigh : styles.recBadgeMed}`}>
                        {r.confidence}
                      </span>
                    </div>
                    <div className={styles.recNote}>{r.note}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p className={styles.recEmptyText}>Recommendations will show up here once the advisor has enough context.</p>
            )}
          </div>

          <div className={styles.proTipCard}>
            <div className={styles.proTipLabel}>PRO TIP</div>
            <p className={styles.proTipText}>
              Ask the advisor to simulate a change before you make it — it checks the effect on your other goals first.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
