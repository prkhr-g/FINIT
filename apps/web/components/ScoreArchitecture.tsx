import { PILLARS } from '@/lib/simulation'

export default function ScoreArchitecture() {
  return (
    <section className="block" id="architecture">
      <div className="section-head">
        <div className="sec-index">01</div>
        <div>
          <div className="eyebrow">Score Architecture</div>
          <h2>Ten pillars. One weighted score.</h2>
          <p>
            Unlike a bureau score that looks only at borrowing behaviour, FINIT reads the full financial picture — and weights each pillar by how much it actually predicts long-term wellbeing.
          </p>
        </div>
      </div>

      <div className="arch-table">
        <div className="arch-row head">
          <span>Pillar</span>
          <span>Weight</span>
          <span>What it measures</span>
        </div>

        {PILLARS.map((p) => (
          <div key={p.id} className="arch-row">
            <span className="arch-name">{p.name}</span>
            <span className="arch-weight">{p.weight}%</span>
            <span className="arch-desc">{p.description}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
