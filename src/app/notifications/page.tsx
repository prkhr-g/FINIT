'use client';

import React from 'react';
import styles from './page.module.css';
import { useTheme } from '@/providers/ThemeProvider';

/* ──────────────────────────────────────────────
   Types — mirrors what the backend eventually returns
   (GET /notifications, PATCH /notifications/read-all)
   ────────────────────────────────────────────── */
interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'INFO' | 'REMINDER' | 'WARNING' | 'ALERT';
  isRead: boolean;
  createdAt: string;
}

const TYPE_ICON: Record<string, string> = {
  INFO: 'ℹ️',
  REMINDER: '⏰',
  WARNING: '⚠️',
  ALERT: '🚨',
};

function timeAgo(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

export default function NotificationsPage() {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

  // Design-only page — no backend wiring yet. Starts empty; swap this
  // state for a real fetch to GET /notifications once the service layer
  // is ready.
  const [notifications, setNotifications] = React.useState<AppNotification[]>([]);
  const [loading, setLoading] = React.useState(false);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 500);
  };

  const handleMarkAllRead = () => {
    if (unreadCount === 0) return;
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  return (
    <div className={`${styles.page} ${isDarkMode ? styles.darkTheme : styles.lightTheme}`}>
      {/* ── HEADER ── */}
      <div className={styles.overviewHeader}>
        <div className={styles.overviewLeft}>
          <h2 className={styles.overviewTitle}>Notifications</h2>
          <p className={styles.overviewSub}>
            {unreadCount > 0 ? `${unreadCount} unread` : 'You\u2019re all caught up.'}
          </p>
        </div>
        <div className={styles.overviewActions}>
          <button className={styles.actionBtn} onClick={handleRefresh} disabled={loading}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
            {loading ? 'Refreshing…' : 'Refresh'}
          </button>
          <button
            className={`${styles.actionBtn} ${styles.actionBtnPrimary}`}
            onClick={handleMarkAllRead}
            disabled={unreadCount === 0}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            Mark all read
          </button>
        </div>
      </div>

      {/* ── LIST ── */}
      <div className={styles.listCard}>
        {loading ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyStateTitle}>Loading notifications…</div>
          </div>
        ) : notifications.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyStateTitle}>No notifications yet</div>
            <p className={styles.emptyStateText}>
              Budget alerts, EMI reminders, and monthly reports will show up here.
            </p>
          </div>
        ) : (
          <div className={styles.list}>
            {notifications.map((n) => (
              <div key={n.id} className={`${styles.item} ${!n.isRead ? styles.itemUnread : ''}`}>
                <div className={styles.itemIcon}>{TYPE_ICON[n.type] ?? '🔔'}</div>
                <div className={styles.itemBody}>
                  <div className={styles.itemTop}>
                    <div className={styles.itemTitle}>{n.title}</div>
                    <div className={styles.itemTime}>{timeAgo(n.createdAt)}</div>
                  </div>
                  <p className={styles.itemMessage}>{n.message}</p>
                </div>
                {!n.isRead && <div className={styles.unreadDot} />}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
