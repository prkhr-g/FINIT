import { SCORE_BANDS } from '@/lib/simulation'

export default function ScoreBands() {
  return (
    <section className="block">
      <div className="section-head">
        <div className="sec-index">02</div>
        <div>
          <div className="eyebrow">Score Bands</div>
          <h2>One number, 0–1000 — but it's the band that tells the story.</h2>
          <p>
            Rebuilt every month from the ten pillars above. Never a credit-bureau proxy — always a live read of financial behaviour.
          </p>
        </div>
      </div>

      <div className="band-ledger">
        {SCORE_BANDS.map((band, idx) => (
          <div key={idx} className="band-row">
            <span className="band-range">{band.min}–{band.max}</span>
            <span className="band-dot" style={{ background: band.color }} />
            <span className="band-grade">{band.grade} · {band.status}</span>
            <span className="band-desc">{band.description}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
