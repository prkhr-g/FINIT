'use client'

import { useEffect, useState } from 'react'
import ScrollReveal from './ScrollReveal'

const recommendations = [
  { label: 'Pay down credit card balance', impact: 'High impact', points: '+15 pts', tone: 'high' },
  { label: 'Close the emergency fund gap', impact: 'Medium impact', points: '+9 pts', tone: 'medium' },
  { label: 'Review recurring subscriptions', impact: 'Low impact', points: '+4 pts', tone: 'low' },
]

function ProjectionDemo() {
  const [months, setMonths] = useState(3)
  const fraction = (months - 1) / 11
  const x = 120 + 180 * fraction
  const y = 54 - 44 * fraction
  const score = Math.round(719 + months * 4.5 + (months >= 6 ? 6 : 0))
  const date = new Date(2026, 6 + months).toLocaleString('en-US', { month: 'short', year: 'numeric' })
  const [afterSavings, setAfterSavings] = useState(false)
  const bars = afterSavings ? [30, 70, 18, 82] : [40, 55, 30, 65]

  return <div className="feature-callout feature-forecast">
    <div className="feature-toast"><span>✦</span><div><strong>Score projected {score}</strong><small>{months} months from now</small></div></div>
    <div className="forecast-grid">
      <div>
        <div className="feature-heading" id="forecast-engine"><span>03</span><strong>Forecast Engine</strong></div>
        <div className="projection-head"><strong>719 <i>→</i> <em>{score}</em></strong><span>{months} months ahead</span></div>
        <div className="projection-chart">
          <svg viewBox="0 0 300 100" preserveAspectRatio="none" aria-label={`Projected FINIT score ${score}`}>
            <path className="projection-actual" d="M0,80 40,72 80,74 120,54" />
            <path className="projection-future" d={`M120,54 L${x},${y}`} />
            <circle cx={x} cy={y} r="4" />
          </svg>
          <span className="projection-tooltip" style={{ left: `${x / 3}%`, top: `${y}%` }}>{score} Score · {date}</span>
        </div>
        <input aria-label="Projection timeframe" type="range" min="1" max="12" value={months} onChange={(event) => setMonths(Number(event.target.value))} />
        <div className="range-labels"><span>1 mo</span><span>6 mo</span><span>12 mo</span></div>
      </div>
      <div className="simulation-panel">
        <div className="feature-heading" id="simulation-engine"><span>04</span><strong>Simulation Engine</strong></div>
        <div className="segmented-control">
          <button className={!afterSavings ? 'active' : ''} onClick={() => setAfterSavings(false)}>Now</button>
          <button className={afterSavings ? 'active' : ''} onClick={() => setAfterSavings(true)}>+20% savings</button>
        </div>
        <div className="simulation-bars">{bars.map((height, index) => <span key={index} style={{ height: `${height}%` }} />)}</div>
      </div>
    </div>
  </div>
}

function RecommendationDemo() {
  const [checked, setChecked] = useState<boolean[]>([false, false, true])
  return <div className="recommendation-card">
    <div className="feature-toast feature-toast--top"><span>✦</span><div><strong>New recommendation ready</strong><small>just now</small></div></div>
    {recommendations.map((item, index) => <label className={`recommendation ${checked[index] ? 'checked' : ''}`} key={item.label}>
      <input type="checkbox" checked={checked[index]} onChange={() => setChecked((current) => current.map((value, itemIndex) => itemIndex === index ? !value : value))} />
      <span className="recommendation-label">{item.label}</span><span className={`impact-pill ${item.tone}`}>{item.impact}</span><strong>{item.points}</strong>
    </label>)}
  </div>
}

function ScoreDemo() {
  return <div className="score-demo"><div className="score-ring"><svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="50" /><circle className="score-ring-value" cx="60" cy="60" r="50" /></svg><strong>719</strong></div><span className="score-up">↑ 24 pts this month</span><div className="score-tiles">{[['Income', '₹86,400'], ['Expenses', '₹52,150'], ['Debt', '₹1,84,000'], ['Savings', '₹4,32,000']].map(([label, value]) => <div key={label}><small>{label}</small><strong>{value}</strong></div>)}</div></div>
}

function TrackDemo() {
  const transactions = [['Amazon', 'Shopping', '-₹7,050', 'Today'], ['Salary deposit', 'Income', '+₹86,400', 'Jul 28'], ['Electricity bill', 'Utilities', '-₹10,000', 'Jul 26'], ['Transfer to savings', 'Savings', '-₹70,000', 'Jul 25']]
  return <div className="feature-callout track-callout"><div className="track-grid"><div><div className="feature-heading" id="reports"><span>07</span><strong>Reports</strong></div><div className="transaction-feed">{transactions.map(([name, category, amount, date]) => <div className="transaction" key={name}><span className="transaction-icon">{category === 'Income' ? '↗' : '•'}</span><div><strong>{name}</strong><small>{category}</small></div><div><strong className={amount.startsWith('+') ? 'positive' : ''}>{amount}</strong><small>{date}</small></div></div>)}</div></div><div className="advisor-card"><div className="feature-heading" id="advisor-access"><span>08</span><strong>Advisor Access</strong></div><div className="advisor-scores"><div><small>Client</small><strong>719</strong></div><span>→</span><div><small>Advisor</small><strong>719</strong></div></div><p><span className="sharing-switch" /> Shared with advisor</p><div className="advisor-activity"><div><small>Last synced</small><strong>Today, 09:42</strong></div><div><small>Shared view</small><strong>Full financial snapshot</strong></div></div></div></div></div>
}

function LivePreview() {
  const months = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D']
  return <section className="live-preview"><div className="wrap"><div className="features-section-head"><div><h2>See it live.</h2><p>Real accounts, real trends, real numbers — this is what opens when you log in.</p></div></div><div className="app-window"><div className="window-bar"><i /><i /><i /><span>app.finit.com/dashboard</span></div><div className="app-shell"><aside><b>FINIT<sup>™</sup></b>{['• Dashboard', 'Finance', 'FINIT score', 'AI advisor', 'Reports', 'Settings'].map((item, index) => <span className={index === 0 ? 'selected' : ''} key={item}>{item}</span>)}</aside><div className="app-content"><div className="app-title"><div><h3>Overview</h3><p>Welcome back — your portfolio is up 4.2% this month.</p></div><div><button>→ Send</button><button>Request</button><button>Bills</button></div></div><div className="app-top-grid"><div className="app-card"><small>Total ledger balance <b>↗ +4.2%</b></small><strong>₹1,84,320</strong><div className="mini-bars">{[34,46,28,58,50,62,44,72,64,56,82,70].map((height, index) => <span className={index === 6 ? 'accent' : ''} key={index} style={{ height: `${height}%` }} />)}</div><div className="months">{months.map((month, index) => <i key={index}>{month}</i>)}</div></div><div className="app-card goal"><small>Saving goal · FINIT target</small><div className="goal-ring">72%</div><p>₹43,200 of ₹60,000 saved</p><a>Add funds →</a></div></div><div className="metrics">{[['Monthly income','₹86,400','↑6%'],['Monthly expense','₹52,150','↓3%'],['Net worth','₹9,84,600',''],['Active goals','3','on track'],['FINIT score','742','/ 1000']].map(([label,value,note]) => <div key={label}><small>{label}</small><strong>{value} <em>{note}</em></strong>{label === 'FINIT score' && <span className="tiny-progress" />}</div>)}</div><div className="app-bottom-grid"><div className="app-card"><small>Net worth over time</small><p>₹7.2L → ₹9.8L in 6 months</p></div><div className="app-card spending"><small>Spending by category</small>{[['Housing','62%','38%'],['Food','36%','22%'],['Transport','24%','15%'],['Other','40%','25%']].map(([label,width,value]) => <div key={label}><span>{label}</span><i><b style={{ width }} /></i><span>{value}</span></div>)}</div><div className="app-card"><small>Linked accounts</small>{['Main savings  ₹4,32,000','Investments  ₹2,18,400','Credit card  −₹12,450'].map((text) => <p key={text}>{text}</p>)}</div></div></div></div></div></div></section>
}

export default function FeaturesExperience() {
  useEffect(() => {
    const hash = window.location.hash
    if (!hash) return

    let timer: number | undefined
    const frame = window.requestAnimationFrame(() => {
      timer = window.setTimeout(() => {
        const target = document.getElementById(decodeURIComponent(hash.slice(1)))
        if (!target) return
        const top = target.getBoundingClientRect().top + window.scrollY - (window.innerHeight - target.offsetHeight) / 2
        window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' })
      }, 600)
    })

    return () => {
      window.cancelAnimationFrame(frame)
      if (timer) window.clearTimeout(timer)
    }
  }, [])

  return <>
    <header className="features-hero"><div className="wrap"><span className="category-badge">Features</span><h1>Everything inside <em>FINIT.</em></h1><p>Eight engines, working together to score, explain, forecast, and improve your financial health.</p></div></header>
    <section className="features-categories" id="features"><div className="wrap"><div className="features-section-head"><div><h2>What&apos;s inside.</h2><p>Eight engines, shown the way you&apos;d actually use them.</p></div></div>
      <ScrollReveal rootMargin="0px" threshold={0.25}><article className="feature-category analyze"><div className="category-label"><span>Analyze</span><p>See exactly where you stand.</p></div><div className="category-split"><div><p className="feature-description">A real-time score across ten weighted pillars, plus income, expenses, debt, and savings in one live view — no switching between apps.</p><FeatureList items={[["01", "Score Engine", "Recalculates the moment your accounts change."], ["02", "Dashboard", "Income, expenses, debt and savings, one screen."]]} /></div><ScoreDemo /></div></article></ScrollReveal>
      <ScrollReveal rootMargin="0px" threshold={0.25}><article className="feature-category plan"><div className="category-label"><span>Plan</span><p>See what&apos;s coming next.</p></div><p className="feature-description">Drag the slider to project your score, or flip the switch to see what an extra 20% in savings actually does.</p><ProjectionDemo /></article></ScrollReveal>
      <ScrollReveal rootMargin="0px" threshold={0.25}><article className="feature-category improve"><div className="category-label"><span>Improve</span><p>See what to do about it.</p></div><div className="category-split reverse"><RecommendationDemo /><div><p className="feature-description">Ranked, specific actions — check one off as you complete it, and we&apos;ll notify you the moment your score reflects it.</p><FeatureList items={[["05", "AI Recommendations", "Ranked by point impact, not generic advice."], ["06", "Notifications", "A score shift, a bill due, a new action — instantly."]]} /></div></div></article></ScrollReveal>
      <ScrollReveal rootMargin="0px" threshold={0.25}><article className="feature-category track"><div className="category-label"><span>Track</span><p>Keep a record, and stay accountable.</p></div><p className="feature-description">Every transaction, categorized automatically — plus a live feed your advisor can see too.</p><TrackDemo /></article></ScrollReveal>
    </div></section><ScrollReveal rootMargin="0px" threshold={0.25}><LivePreview /></ScrollReveal>
  </>
}

function FeatureList({ items }: { items: [string, string, string][] }) { return <ul className="feature-list">{items.map(([number, title, body]) => <li id={title.toLowerCase().replaceAll(' ', '-')} key={number}><span>{number}</span><div><strong>{title}</strong><p>{body}</p></div></li>)}</ul> }
