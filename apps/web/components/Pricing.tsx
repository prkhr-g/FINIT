export default function Pricing() {
  return (
    <section className="block" id="pricing">
      <div className="section-head">
        <div className="sec-index">09</div>
        <div>
          <div className="eyebrow">Membership</div>
          <h2>One price. The plan grows with the pillars you need.</h2>
          <p>Illustrative pricing for this prototype.</p>
        </div>
      </div>

      <span className="price-note">— for discussion, not final —</span>

      <div className="price-grid">
        {/* Starter */}
        <div className="price-card">
          <div className="price-name">Starter</div>
          <div className="price-amount">Free</div>
          <div className="price-tag">Your monthly FINIT Score.</div>

          <ul className="price-feats">
            <li>Monthly score &amp; grade</li>
            <li>Basic pillar breakdown</li>
            <li>Limited simulations</li>
          </ul>

          <a href="/signup" className="btn btn-ghost">
            Get started
          </a>
        </div>

        {/* Member (Popular) */}
        <div className="price-card popular">
          <span className="popular-tag">Popular</span>
          <div className="price-name">Member</div>
          <div className="price-amount">
            ₹499<span>/month</span>
          </div>
          <div className="price-tag">Full simulation &amp; AI layer.</div>

          <ul className="price-feats">
            <li>Unlimited simulations</li>
            <li>Full AI diagnosis</li>
            <li>Monthly tracking &amp; badges</li>
          </ul>

          <a href="/signup" className="btn btn-primary">
            Start free trial
          </a>
        </div>

        {/* Family Office */}
        <div className="price-card">
          <div className="price-name">Family Office</div>
          <div className="price-amount">
            ₹4,999<span>/month</span>
          </div>
          <div className="price-tag">Multi-account stewardship.</div>

          <ul className="price-feats">
            <li>Everything in Member</li>
            <li>Multiple linked profiles</li>
            <li>Priority data integrations</li>
          </ul>

          <a href="/contact" className="btn btn-ghost">
            Talk to us
          </a>
        </div>
      </div>
    </section>
  )
}
