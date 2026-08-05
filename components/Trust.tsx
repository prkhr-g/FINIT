import FinitIcon from '@/components/FinitIcon'

const trustPillars = [
  { icon: 'shield', number: '01', title: 'Private by design', description: 'Your financial life stays protected from the moment you choose to connect it.', points: ['Consent-first connections', 'Encrypted in transit and at rest'] },
  { icon: 'score', number: '02', title: 'Always explainable', description: 'Clear reasoning replaces black-box scores and recommendations.', points: ['Every score change has a named pillar', 'See what data shapes each recommendation'] },
  { icon: 'brief', number: '03', title: 'Yours, always', description: 'You stay in control of the information that helps FINIT work for you.', points: ['Export or disconnect sources anytime', 'Never sold to advertisers or brokers'] },
] as const

export default function Trust() {
  return (
    <section className="block" id="trust">
      <div className="section-head">
        <div>
          <div className="eyebrow">Trust</div>
          <h2>Every integration is opt-in.</h2>
          <p>Nothing connects without explicit consent, and every recommendation traces back to a specific pillar.</p>
        </div>
      </div>

      <div className="trust-grid">
        {trustPillars.map((pillar) => (
          <article className="trust-card" key={pillar.title}>
            <div className="trust-card-top">
              <span className="trust-card-number">{pillar.number}</span>
              <span className="trust-icon"><FinitIcon name={pillar.icon} /></span>
            </div>
            <h3>{pillar.title}</h3>
            <p>{pillar.description}</p>
            <ul>{pillar.points.map((point) => <li key={point}>{point}</li>)}</ul>
          </article>
        ))}
      </div>
    </section>
  )
}
