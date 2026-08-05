'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import { PILLARS, DEFAULT_PILLAR_VALUES, calculateScoreResults } from '@/lib/simulation'

export default function SimulationEngine() {
  const [pillarValues, setPillarValues] = useState<Record<string, number>>(DEFAULT_PILLAR_VALUES)
  const [animatedScore, setAnimatedScore] = useState(0)
  const sectionRef = useRef<HTMLDivElement>(null)

  const handleSliderChange = (id: string, val: number) => {
    setPillarValues(prev => ({
      ...prev,
      [id]: val
    }))
  }

  const results = useMemo(() => {
    return calculateScoreResults(pillarValues, 30)
  }, [pillarValues])

  // Count up animated score when target results.score changes
  useEffect(() => {
    let animationFrameId: number
    const target = results.score
    const startValue = animatedScore
    const duration = 600
    const startTime = performance.now()

    const step = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setAnimatedScore(Math.round(startValue + eased * (target - startValue)))

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step)
      }
    }
    animationFrameId = requestAnimationFrame(step)

    return () => cancelAnimationFrame(animationFrameId)
  }, [results.score])

  // Radar Chart Calculations
  const cx = 100
  const cy = 100
  const maxR = 76
  const n = PILLARS.length

  const angleFor = (i: number) => (-90 + i * (360 / n)) * (Math.PI / 180)
  const pointFor = (i: number, r: number) => {
    const a = angleFor(i)
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)]
  }

  const radarPolygonPoints = useMemo(() => {
    return PILLARS.map((p, i) => {
      const val = pillarValues[p.id] || 0
      const [x, y] = pointFor(i, (val / 100) * maxR)
      return `${x},${y}`
    }).join(' ')
  }, [pillarValues])

  const circumference = 2 * Math.PI * 70
  const scoreFraction = Math.max(0, Math.min(1, results.score / 1000))
  const dashArray = `${scoreFraction * circumference} ${circumference}`

  return (
    <section className="block" id="simulate" ref={sectionRef}>
      <div className="section-head">
        <div className="sec-index">03</div>
        <div>
          <div className="eyebrow">Simulation Engine &amp; AI Diagnosis</div>
          <h2>Move a pillar. Watch the score think.</h2>
          <p>
            Test scenarios — increasing savings, repaying a loan, adding cover — before you act. The AI layer explains what's driving the score in real time.
          </p>
        </div>
      </div>

      <div className="sim-grid">
        {/* Sliders List */}
        <div className="sim-sliders">
          {PILLARS.map((p) => {
            const currentVal = pillarValues[p.id] || 0
            return (
              <div key={p.id} className="sim-row">
                <div>
                  <div className="sim-name">{p.name}</div>
                  <span className="sim-weight">{p.weight}% weight</span>
                </div>
                
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={currentVal}
                  onChange={(e) => handleSliderChange(p.id, Number(e.target.value))}
                  className="sim-slider"
                />

                <div className="sim-value">
                  {currentVal}
                </div>
              </div>
            )
          })}
        </div>

        {/* Readout Card */}
        <div className="sim-readout">
          <div className="sim-top">
            {/* SVG Radar */}
            <svg className="sim-radar" viewBox="0 0 200 200">
              {/* Background Grid Polygons */}
              {[0.33, 0.66, 1].map((f, idx) => {
                const pts = PILLARS.map((_, i) => pointFor(i, maxR * f).join(',')).join(' ')
                return (
                  <polygon
                    key={idx}
                    points={pts}
                    fill="none"
                    stroke="var(--hair)"
                    strokeWidth="1"
                  />
                )
              })}
              {/* Axis lines */}
              {PILLARS.map((_, i) => {
                const [x, y] = pointFor(i, maxR)
                return (
                  <line
                    key={i}
                    x1={cx}
                    y1={cy}
                    x2={x}
                    y2={y}
                    stroke="var(--hair)"
                    strokeWidth="1"
                  />
                )
              })}
              {/* Live Radar Polygon */}
              <polygon
                points={radarPolygonPoints}
                fill="rgba(66,116,217,0.22)"
                stroke="var(--saffron)"
                strokeWidth="1.6"
                style={{ transition: 'points 0.5s cubic-bezier(0.16, 1, 0.3, 1)' }}
              />
            </svg>

            {/* Score Ring */}
            <div style={{ flex: 1 }}>
              <div className="gauge-wrap" style={{ width: '110px', height: '110px' }}>
                <svg viewBox="0 0 160 160">
                  <circle cx="80" cy="80" r="70" fill="none" stroke="var(--ink-3)" strokeWidth="9" />
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    fill="none"
                    stroke={results.band.color}
                    strokeWidth="9"
                    strokeLinecap="round"
                    strokeDasharray={dashArray}
                    style={{ transition: 'stroke-dasharray 0.8s cubic-bezier(0.16, 1, 0.3, 1), stroke 0.4s ease' }}
                  />
                </svg>
                <div className="gauge-center">
                  <div 
                    className="gauge-score"
                    style={{ fontSize: '24px', color: results.band.color }}
                  >
                    {animatedScore}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="sim-metrics">
            <div className="sim-metric">
              <div className="sim-metric-label">Grade</div>
              <div className="sim-metric-value" style={{ color: results.band.color }}>
                {results.band.grade} · {results.band.status}
              </div>
            </div>

            <div className="sim-metric">
              <div className="sim-metric-label">FINIT Risk™</div>
              <div className="sim-metric-value">
                {results.riskLabel}
              </div>
            </div>

            <div className="sim-metric">
              <div className="sim-metric-label">FINIT Age™</div>
              <div className="sim-metric-value">
                {results.fintAge} yrs
              </div>
            </div>

            <div className="sim-metric">
              <div className="sim-metric-label">FINIT Forecast™</div>
              <div className="sim-metric-value">
                {results.forecast}
              </div>
            </div>
          </div>

          {/* AI Diagnosis Text */}
          <div 
            className="sim-diag"
            dangerouslySetInnerHTML={{ __html: results.diagnosisHtml }}
          />
        </div>
      </div>
    </section>
  )
}
