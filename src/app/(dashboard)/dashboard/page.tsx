'use client';

import React from 'react';
import Link from 'next/link';
import styles from './page.module.css';

export default function DashboardPage() {
  return (
    <div>
      <header className={styles.header}>
        <div className={styles.greetingContainer}>
          <span className={styles.greetingSub}>GOOD EVENING</span>
          <h1 className={styles.greetingTitle}>Aarav, here's where things stand.</h1>
        </div>
        <div className={styles.profileContainer}>
          <button className={styles.notifBtn}>
            <span className={styles.notifDot}></span>
            {/* Optional icon inside button if needed, left blank to match design simplicity */}
          </button>
          <div className={styles.avatar}>AR</div>
        </div>
      </header>

      <div className={`${styles.card} ${styles.scoreCard}`}>
        <div className={styles.scoreGauge}>
          <div className={styles.scoreContent}>
            <span className={styles.scoreValue}>782</span>
            <span className={styles.scoreGrade}>GRADE A</span>
          </div>
        </div>
        <div className={styles.scoreInfo}>
          <div className={styles.cardLabel}>FINT SCORE</div>
          <h2 className={styles.scoreTitle}>Excellent financial health</h2>
          <p className={styles.scoreDesc}>
            Aapka score pichle quarter se <strong>24 points</strong> improve hua hai — savings rate aur investment diversity dono strong hain. Emergency fund thoda peeche hai.
          </p>
          <div className={styles.badge}>
            <span className={styles.badgeDot}></span>
            Risk level: Low
          </div>
        </div>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.cardLabel}>MONTHLY INCOME</div>
          <div className={styles.statValue}>₹1,25,000</div>
          <div className={styles.statSub}>Same as last month</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.cardLabel}>MONTHLY EXPENSE</div>
          <div className={styles.statValue}>₹68,400</div>
          <div className={`${styles.statSub} ${styles.red}`}>↑ 8% vs last month</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.cardLabel}>NET WORTH</div>
          <div className={styles.statValue}>₹18.4L</div>
          <div className={`${styles.statSub} ${styles.green}`}>↑ 18% YoY</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.cardLabel}>ACTIVE GOALS</div>
          <div className={styles.statValue}>3</div>
          <div className={`${styles.statSub} ${styles.green}`}>2 on track</div>
        </div>
      </div>

      <div className={styles.bottomGrid}>
        <div className={styles.aiCard}>
          <div className={styles.aiHeader}>
            <span>✦</span> AI RECOMMENDATION
          </div>
          <h3 className={styles.aiTitle}>Your emergency fund needs attention</h3>
          <p className={styles.aiDesc}>
            Aapka expense-to-income ratio pichle mahine se 8% badha hai. Emergency fund ko 6 mahine tak badhane se score aur behtar ho sakta hai.
          </p>
        </div>

        <div className={styles.activityCard}>
          <div className={styles.activityHeader}>
            <h3 className={styles.activityTitle}>Recent activity</h3>
            <Link href="/activity" className={styles.viewAll}>View all</Link>
          </div>
          <div className={styles.activityList}>
            <div className={styles.activityItem}>
              <div className={styles.activityIcon}>🛒</div>
              <div className={styles.activityDetails}>
                <div className={styles.activityName}>Groceries — Big Bazaar</div>
                <div className={styles.activityDate}>18 Jul</div>
              </div>
              <div className={`${styles.activityAmount} ${styles.negative}`}>
                -₹3,200
              </div>
            </div>
            <div className={styles.activityItem}>
              <div className={styles.activityIcon}>💰</div>
              <div className={styles.activityDetails}>
                <div className={styles.activityName}>Salary credited</div>
                <div className={styles.activityDate}>17 Jul</div>
              </div>
              <div className={`${styles.activityAmount} ${styles.positive}`}>
                +₹1,25,000
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}