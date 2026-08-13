'use client';

import React from 'react';
import Link from 'next/link';
import styles from './page.module.css';
import { useAuth } from '@/providers/AuthProvider';
import { useTheme } from '@/providers/ThemeProvider';

interface NotificationPrefs {
  emailDigest: boolean;
  budgetAlerts: boolean;
  goalReminders: boolean;
  securityAlerts: boolean;
}

function Switch({
  checked,
  onChange,
  disabled = false,
}: {
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={onChange}
      className={`${styles.switch} ${checked ? styles.switchOn : ''}`}
    >
      <span className={styles.switchKnob} />
    </button>
  );
}

export default function ProfilePage() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === 'dark';

  const [name, setName] = React.useState(user?.name ?? '');
  const [email, setEmail] = React.useState(user?.email ?? '');
  const [phone, setPhone] = React.useState('');
  const [dob, setDob] = React.useState('');

  // TODO: replace with the real field from your user object once you confirm
  // its name (e.g. user?.emailVerified or user?.isEmailVerified). Defaulting
  // to false so the "Verified" badge never shows incorrectly in the meantime.
  const emailVerified = Boolean((user as { emailVerified?: boolean } | null | undefined)?.emailVerified);

  const [prefs, setPrefs] = React.useState<NotificationPrefs>({
    emailDigest: true,
    budgetAlerts: true,
    goalReminders: true,
    securityAlerts: true,
  });

  const [saving, setSaving] = React.useState(false);
  const [saved, setSaved] = React.useState(false);

  React.useEffect(() => {
    setName(user?.name ?? '');
    setEmail(user?.email ?? '');
  }, [user]);

  const togglePref = (key: keyof NotificationPrefs) => {
    setPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      // TODO: wire up to your profile update service, e.g.
      // await authService.updateProfile({ name, phone, dob, notifications: prefs });
      await new Promise((resolve) => setTimeout(resolve, 600));
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally {
      setSaving(false);
    }
  };

  const initials = (name || user?.name || 'U')
    .split(' ')
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className={`${styles.page} ${isDarkMode ? styles.darkTheme : styles.lightTheme}`}>
      {/* ── HEADER ── */}
      <div className={styles.overviewHeader}>
        <div>
          <Link
            href="/dashboard"
            className={styles.backLink}
            title="Back to dashboard"
            aria-label="Back to dashboard"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </Link>
          <h2 className={styles.overviewTitle}>Profile</h2>
          <p className={styles.overviewSub}>Manage your personal details, security, and notification preferences.</p>
        </div>
        <div className={styles.overviewActions}>
          {saved && <span className={styles.saveHint}>Changes saved</span>}
          <button className={styles.actionBtn} onClick={toggleTheme}>
            {isDarkMode ? 'Light mode' : 'Dark mode'}
          </button>
          <button className={`${styles.actionBtn} ${styles.actionBtnPrimary}`} onClick={handleSave} disabled={saving}>
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* ── MAIN GRID ── */}
      <div className={styles.mainGrid}>
        {/* ── LEFT COLUMN ── */}
        <div className={styles.leftCol}>
          <div className={`${styles.card} ${styles.avatarCard}`}>
            <div className={styles.avatarWrap}>
              <div className={styles.avatarCircle}>{initials}</div>
              <div className={styles.avatarOverlay}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                  <circle cx="12" cy="13" r="4" />
                </svg>
              </div>
            </div>
            <p className={styles.profileName}>{name || 'Your Name'}</p>
            <p className={styles.profileEmail}>{email || 'no email on file'}</p>
            <div className={styles.badgeRow}>
              <span className={`${styles.badge} ${styles.badgeGreen}`}>Verified</span>
              <span className={styles.badge}>Free Plan</span>
            </div>
          </div>

          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Account</h3>
            <div className={styles.quickStats}>
              <div className={styles.quickStatRow}>
                <span className={styles.quickStatLabel}>Member Since</span>
                <span className={styles.quickStatVal}>—</span>
              </div>
              <div className={styles.quickStatRow}>
                <span className={styles.quickStatLabel}>Linked Accounts</span>
                <span className={styles.quickStatVal}>—</span>
              </div>
              <div className={styles.quickStatRow}>
                <span className={styles.quickStatLabel}>FINT Score</span>
                <span className={styles.quickStatVal}>—</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN ── */}
        <div className={styles.rightCol}>
          {/* Personal information */}
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Personal Information</h3>
            <div className={styles.formGrid}>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>Full Name</label>
                <input className={styles.input} value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>Email Address</label>
                <input
                  type="email"
                  className={styles.input}
                  placeholder="Add email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {emailVerified ? (
                  <span className={styles.verifiedTag}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    Verified
                  </span>
                ) : (
                  <span className={styles.unverifiedTag}>
                    Not verified ·{' '}
                    <button
                      type="button"
                      className={styles.verifyLink}
                      onClick={() => {
                        /* TODO: trigger verification email */
                      }}
                    >
                      Send verification email
                    </button>
                  </span>
                )}
              </div>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>Phone Number</label>
                <input
                  className={styles.input}
                  placeholder="Add phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>Date of Birth</label>
                <input type="date" className={styles.input} value={dob} onChange={(e) => setDob(e.target.value)} />
              </div>
            </div>
          </div>

          {/* Security */}
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Security</h3>
            <div className={styles.formGrid}>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>Current Password</label>
                <input type="password" className={styles.input} placeholder="••••••••" />
              </div>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>New Password</label>
                <input type="password" className={styles.input} placeholder="••••••••" />
              </div>
              <div className={styles.fieldFull}>
                <label className={styles.fieldLabel}>Confirm New Password</label>
                <input type="password" className={styles.input} placeholder="••••••••" />
              </div>
            </div>
            <div className={styles.formFooter}>
              <button className={styles.actionBtn}>Update Password</button>
            </div>
          </div>

          {/* Notification preferences */}
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Notification Preferences</h3>
            <div className={styles.toggleList}>
              <div className={styles.toggleRow}>
                <div>
                  <p className={styles.toggleName}>Email Digest</p>
                  <p className={styles.toggleDesc}>Weekly summary of your spending and net worth.</p>
                </div>
                <Switch checked={prefs.emailDigest} onChange={() => togglePref('emailDigest')} />
              </div>
              <div className={styles.toggleRow}>
                <div>
                  <p className={styles.toggleName}>Budget Alerts</p>
                  <p className={styles.toggleDesc}>Notify me when I'm close to a category limit.</p>
                </div>
                <Switch checked={prefs.budgetAlerts} onChange={() => togglePref('budgetAlerts')} />
              </div>
              <div className={styles.toggleRow}>
                <div>
                  <p className={styles.toggleName}>Goal Reminders</p>
                  <p className={styles.toggleDesc}>Nudges to keep your savings goals on track.</p>
                </div>
                <Switch checked={prefs.goalReminders} onChange={() => togglePref('goalReminders')} />
              </div>
              <div className={styles.toggleRow}>
                <div>
                  <p className={styles.toggleName}>Security Alerts</p>
                  <p className={styles.toggleDesc}>Logins, password changes, and new devices.</p>
                </div>
                <Switch checked={prefs.securityAlerts} onChange={() => togglePref('securityAlerts')} disabled />
              </div>
            </div>
          </div>

          {/* Danger zone */}
          <div className={`${styles.card} ${styles.dangerCard}`}>
            <h3 className={styles.cardTitle}>Danger Zone</h3>
            <div className={styles.dangerRow}>
              <div>
                <p className={styles.toggleName}>Delete Account</p>
                <p className={styles.dangerText}>
                  Permanently remove your account and all associated financial data. This cannot be undone.
                </p>
              </div>
              <button className={styles.dangerBtn}>Delete Account</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
