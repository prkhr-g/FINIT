import FinitIcon from '@/components/FinitIcon'

const experts = [
  { name: 'Ananya Rao, CFP', initials: 'AR', focus: 'Tax & Retirement', description: 'Build a tax-efficient plan for today while protecting the life you want later.', registration: 'SEBI RIA · INA200XXXXXX', icon: 'growth' },
  { name: 'Vikram Shetty, CA', initials: 'VS', focus: 'Business Finance', description: 'Make the numbers behind your business work harder for your personal goals.', registration: 'ICAI · 452XXX', icon: 'brief' },
  { name: 'Priya Menon, CFA', initials: 'PM', focus: 'Investment Strategy', description: 'Turn long-term goals into a diversified plan you can stay confident in.', registration: 'SEBI RIA · INA200YYYYYY', icon: 'map' },
] as const

export default function Experts() {
  return (
    <section className="block" id="experts">
      <div className="section-head">
        <div>
          <div className="eyebrow">Verified Experts</div>
          <h2>Humans, when it actually matters.</h2>
          <p>Every advisor is SEBI-registered, background-verified and paid transparently — no commissions, no hidden incentives.</p>
        </div>
      </div>

      <div className="expert-grid">
        {experts.map((expert) => (
          <article className="expert-card" key={expert.name}>
            <div className="expert-card-top"><span className="expert-avatar">{expert.initials}</span><span className="expert-icon"><FinitIcon name={expert.icon} /></span></div>
            <div className="expert-name">{expert.name}</div>
            <div className="expert-focus">{expert.focus}</div>
            <p>{expert.description}</p>
            <div className="expert-reg"><span className="expert-verified-dot" aria-hidden="true" />{expert.registration}</div>
          </article>
        ))}
      </div>
    </section>
  )
}
