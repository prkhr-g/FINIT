'use client'

import { useEffect, useRef, useState } from 'react'

export default function Hero() {
  const [displayScore, setDisplayScore] = useState(0)
  const [animatedDash, setAnimatedDash] = useState(0)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = cardRef.current
    if (!element) return

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      setAnimatedDash(316)
      const start = performance.now()
      const tick = (now: number) => {
        const progress = Math.min((now - start) / 1200, 1)
        setDisplayScore(Math.round((1 - Math.pow(1 - progress, 3)) * 742))
        if (progress < 1) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
      observer.unobserve(element)
    }, { threshold: 0.15 })

    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return (
    <section className="hero">
      <div>
        <div className="eyebrow">India&apos;s Financial Intelligence Platform</div>
        <h1>Every great financial decision <em>starts here.</em></h1>
        <p>Understand your financial life, improve your FINIT Score, and get personalised AI guidance for every important decision—from buying a home to building long-term wealth.</p>
        <div className="hero-ctas">
          <a href="/signup" className="btn btn-primary">Get my FINIT Score →</a>
          <a href="#how-it-works" className="btn btn-ghost">See how it works</a>
        </div>
        <div className="trust-strip">
          <div className="trust-item"><span className="t1">Understand</span><span className="t2">Your complete picture</span></div>
          <div className="trust-item"><span className="t1">Improve</span><span className="t2">With clear next steps</span></div>
          <div className="trust-item"><span className="t1">Decide</span><span className="t2">With confidence</span></div>
        </div>
      </div>

      <div className="score-card" ref={cardRef}>
        <div className="score-card-head"><span className="score-card-title">FINIT Score™ — sample profile</span><span className="live-tag"><span className="live-dot" />Live</span></div>
        <div className="gauge-row">
          <div className="gauge-wrap"><svg viewBox="0 0 160 160"><circle cx="80" cy="80" r="70" fill="none" stroke="var(--ink-3)" strokeWidth="9" /><circle cx="80" cy="80" r="70" fill="none" stroke="var(--saffron)" strokeWidth="9" strokeLinecap="round" strokeDasharray={`${animatedDash} 439.8`} style={{ transition: 'stroke-dasharray 1.2s cubic-bezier(0.16, 1, 0.3, 1)', filter: 'drop-shadow(0 0 5px rgba(66,116,217,0.5))' }} /></svg><div className="gauge-center"><div className="gauge-score">{displayScore}</div><div className="gauge-sub">OF 1000</div></div></div>
          <div className="gauge-side"><div className="side-row"><span className="side-label">GRADE</span><span className="side-value">A · Strong</span></div><div className="side-row"><span className="side-label">READINESS</span><span className="side-value">84% Home ready</span></div><div className="side-row"><span className="side-label">FINIT PULSE</span><span className="side-value up">+6 pts</span></div><div className="side-row"><span className="side-label">NEXT STEP</span><span className="side-value">Grow SIP</span></div></div>
        </div>
        <div className="grade-line">Strong on income and investments. Your next highest-impact move: <b>build your emergency fund</b>.</div>
      </div>
    </section>
  )
}
