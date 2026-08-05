'use client'

import { useEffect, useState, useRef } from 'react'

export default function Tracking() {
  const [animated, setAnimated] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setAnimated(true)
          observer.unobserve(el)
        }
      },
      { threshold: 0.15 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section className="block" id="tracking" ref={sectionRef}>
      <div className="section-head">
        <div>
          <div className="eyebrow">Monthly Tracking</div>
          <h2>The score updates every month — and shows its work.</h2>
          <p>
            Trends, peer benchmarking and milestone badges keep the goal visible, not just the number.
          </p>
        </div>
      </div>

      <div className="track-grid">
        <div className="spark-panel">
          <div className="spark-label">6-Month Trend</div>
          
          <svg viewBox="0 0 480 140" style={{ width: '100%' }}>
            <path 
              d="M 10,110 L 90,95 L 170,100 L 250,70 L 330,55 L 410,32" 
              fill="none" 
              stroke="var(--teal)" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              style={{
                strokeDasharray: 500,
                strokeDashoffset: animated ? 0 : 500,
                transition: 'stroke-dashoffset 2.8s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            />
            <circle 
              cx="410" 
              cy="32" 
              r="4" 
              fill="var(--teal)" 
              style={{
                opacity: animated ? 1 : 0,
                transform: animated ? 'scale(1)' : 'scale(0)',
                transformOrigin: '410px 32px',
                transition: 'opacity 0.8s ease 2.4s, transform 0.8s ease 2.4s'
              }}
            />
            <text x="10" y="130" fontFamily="IBM Plex Mono" fontSize="10" fill="var(--text-low)">FEB</text>
            <text x="405" y="130" fontFamily="IBM Plex Mono" fontSize="10" fill="var(--text-low)">JUL</text>
          </svg>

          <div className="badge-row">
            <span className="track-badge">6-Month Streak</span>
            <span className="track-badge">Debt Reduced 12%</span>
            <span className="track-badge">Emergency Fund +2mo</span>
          </div>
        </div>

        <div className="bench-row">
          <div className="bench-item">
            <div className="bl">
              <span>You</span>
              <span>718</span>
            </div>
            <div className="bench-track">
              <div 
                className="bench-fill" 
                style={{ 
                  width: animated ? '72%' : '0%', 
                  background: 'var(--saffron)',
                  transition: 'width 2.4s cubic-bezier(0.16, 1, 0.3, 1) 0.6s'
                }} 
              />
            </div>
          </div>

          <div className="bench-item">
            <div className="bl">
              <span>Peer Average</span>
              <span>662</span>
            </div>
            <div className="bench-track">
              <div 
                className="bench-fill" 
                style={{ 
                  width: animated ? '66%' : '0%', 
                  background: 'var(--text-low)',
                  transition: 'width 2.4s cubic-bezier(0.16, 1, 0.3, 1) 1.0s'
                }} 
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
