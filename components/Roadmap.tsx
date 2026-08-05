export default function Roadmap() {
  const steps = [
    { num: 1, title: 'Bank account linking', desc: 'Real cash-flow and savings data replace estimates.' },
    { num: 2, title: 'Credit bureau integration', desc: 'Direct feed for credit health — no manual entry.' },
    { num: 3, title: 'Investment & insurance sync', desc: 'Live holdings and coverage instead of self-declared values.' },
    { num: 4, title: 'EPF & NPS integration', desc: 'Retirement readiness computed from actual contributions.' },
    { num: 5, title: 'Business financials', desc: 'For self-employed and business-owner profiles, with consent.' }
  ]

  return (
    <section className="block">
      <div className="section-head">
        <div className="sec-index">07</div>
        <div>
          <div className="eyebrow">Roadmap</div>
          <h2>Toward a fully automated, objective score.</h2>
          <p>
            Each future version replaces a self-reported input with a verified one — always with the user's consent.
          </p>
        </div>
      </div>

      <div className="road-list">
        {steps.map((item) => (
          <div key={item.num} className="road-row">
            <div className="road-num">{item.num}</div>
            <div>
              <h4>{item.title}</h4>
              <p>{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
