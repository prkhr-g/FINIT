'use client';

import React from 'react';
import styles from './page.module.css';
import { useAuth } from '@/providers/AuthProvider';
import { User, Globe, ShieldCheck, Camera, Info } from 'lucide-react';

const CURRENCIES = [
  { value: 'INR', label: 'INR - Indian Rupee (₹)' },
  { value: 'USD', label: 'USD - United States Dollar ($)' },
  { value: 'EUR', label: 'EUR - Euro (€)' },
  { value: 'GBP', label: 'GBP - British Pound Sterling (£)' },
  { value: 'JPY', label: 'JPY - Japanese Yen (¥)' },
];

const TIMEZONES = [
  { value: 'Asia/Kolkata', label: '(GMT+05:30) India Standard Time' },
  { value: 'America/New_York', label: '(GMT-05:00) Eastern Time' },
  { value: 'Europe/London', label: '(GMT+00:00) London' },
  { value: 'Asia/Singapore', label: '(GMT+08:00) Singapore' },
  { value: 'Asia/Tokyo', label: '(GMT+09:00) Tokyo' },
];

interface ProfileForm {
  firstName: string;
  lastName: string;
  email: string;
  currency: string;
  timezone: string;
}

export default function SettingsPage() {
  const { user } = useAuth();

  const initialForm = React.useMemo<ProfileForm>(() => {
    const [first = '', ...rest] = (user?.name ?? '').split(' ');
    return {
      firstName: first,
      lastName: rest.join(' '),
      email: user?.email ?? '',
      currency: 'INR',
      timezone: 'Asia/Kolkata',
    };
  }, [user]);

  const [form, setForm] = React.useState<ProfileForm>(initialForm);
  const [saving, setSaving] = React.useState(false);
  const [savedAt, setSavedAt] = React.useState<Date | null>(null);

  // Keep the form in sync if the auth user loads in after first render.
  React.useEffect(() => {
    setForm(initialForm);
  }, [initialForm]);

  const handleChange = (field: keyof ProfileForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setSavedAt(null);
  };

  const handleDiscard = () => {
    setForm(initialForm);
    setSavedAt(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      // TODO: wire up to a settings/profile service once one exists —
      // e.g. await profileService.update(form)
      await new Promise((resolve) => setTimeout(resolve, 400));
      setSavedAt(new Date());
    } finally {
      setSaving(false);
    }
  };

  const initials = `${form.firstName?.[0] ?? ''}${form.lastName?.[0] ?? ''}`.toUpperCase();

  return (
    <form className={styles.page} onSubmit={handleSave}>
      <div className={styles.header}>
        <h1 className={styles.title}>Account Settings</h1>
      </div>

      {/* ── Profile Identity ── */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionIcon}>
            <User size={20} />
          </span>
          <h3 className={styles.sectionTitle}>Profile Identity</h3>
        </div>

        <div className={styles.panel}>
          <div className={styles.profileRow}>
            <div className={styles.avatarWrap}>
              {user?.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img className={styles.avatarImg} src={user.avatarUrl} alt="" />
              ) : (
                <div className={styles.avatarPlaceholder}>{initials || '—'}</div>
              )}
              <button
                type="button"
                className={styles.avatarUploadBtn}
                title="Change photo"
              >
                <Camera size={14} />
              </button>
            </div>

            <div className={styles.profileFields}>
              <div className={styles.formGrid}>
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="firstName">
                    First Name
                  </label>
                  <input
                    id="firstName"
                    className={styles.input}
                    type="text"
                    placeholder="First name"
                    value={form.firstName}
                    onChange={(e) => handleChange('firstName', e.target.value)}
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="lastName">
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    className={styles.input}
                    type="text"
                    placeholder="Last name"
                    value={form.lastName}
                    onChange={(e) => handleChange('lastName', e.target.value)}
                  />
                </div>
              </div>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="email">
                  Email Address
                </label>
                <input
                  id="email"
                  className={styles.input}
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <hr className={styles.divider} />

      {/* ── Financial Localization ── */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionIcon}>
            <Globe size={20} />
          </span>
          <h3 className={styles.sectionTitle}>Financial Localization</h3>
        </div>

        <div className={styles.panel}>
          <div className={styles.formGrid}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="currency">
                Preferred Currency
              </label>
              <select
                id="currency"
                className={styles.select}
                value={form.currency}
                onChange={(e) => handleChange('currency', e.target.value)}
              >
                {CURRENCIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="timezone">
                Timezone
              </label>
              <select
                id="timezone"
                className={styles.select}
                value={form.timezone}
                onChange={(e) => handleChange('timezone', e.target.value)}
              >
                {TIMEZONES.map((tz) => (
                  <option key={tz.value} value={tz.value}>
                    {tz.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.infoBox}>
            <span className={styles.infoIcon}>
              <Info size={18} />
            </span>
            <p className={styles.infoText}>
              Adjusting your localization will update chart timestamps and reporting
              valuations across FINT once this is connected to your data.
            </p>
          </div>
        </div>
      </section>

      <hr className={styles.divider} />

      {/* ── Security Essentials ── */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionIcon}>
            <ShieldCheck size={20} />
          </span>
          <h3 className={styles.sectionTitle}>Security Essentials</h3>
        </div>

        <div className={styles.panel}>
          <div className={styles.settingsRow}>
            <div className={styles.rowInfo}>
              <p className={styles.rowTitle}>Change Password</p>
              <p className={styles.rowNote}>No password change on record yet</p>
            </div>
            <button type="button" className={styles.btnOutline}>
              Update
            </button>
          </div>

          <div className={styles.rowDivider} />

          <div className={styles.settingsRow}>
            <div className={styles.rowInfo}>
              <div className={styles.rowTitleLine}>
                <p className={styles.rowTitle}>Two-Factor Authentication</p>
                <span className={`${styles.badge} ${styles.badgeInactive}`}>Not Set Up</span>
              </div>
              <p className={styles.rowNote}>Secure your account with a TOTP app</p>
            </div>
            <button type="button" className={styles.btnOutline}>
              Set Up
            </button>
          </div>

          <div className={styles.rowDivider} />

          <div className={styles.settingsRow}>
            <div className={styles.rowInfo}>
              <p className={styles.rowTitle}>Active Sessions</p>
              <p className={styles.rowNote}>No session data yet</p>
            </div>
            <button type="button" className={styles.btnDanger}>
              Sign Out Everywhere
            </button>
          </div>
        </div>
      </section>

      {/* ── Actions ── */}
      <div className={styles.actionsBar}>
        {savedAt && <span className={styles.savedNote}>Saved</span>}
        <button type="button" className={styles.btnText} onClick={handleDiscard}>
          Discard Changes
        </button>
        <button type="submit" className={styles.btnPrimary} disabled={saving}>
          {saving ? 'Saving…' : 'Save Configuration'}
        </button>
      </div>
    </form>
  );
}
