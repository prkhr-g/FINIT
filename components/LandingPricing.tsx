import Link from 'next/link'

const plans = [
  { name: 'Starter', price: 'Free', detail: 'Your monthly FINIT Score.' },
  { name: 'Member', price: '₹499', detail: 'Full simulation & AI layer.', popular: true },
  { name: 'Family Office', price: '₹4,999', detail: 'Multi-account stewardship.' },
]

export default function LandingPricing() {
  return (
    <section className="block landing-pricing" id="plans">
      <div className="section-head"><div><div className="eyebrow">Membership</div><h2>A plan for the financial life you are building.</h2></div></div>
      <div className="plan-preview-grid">
        {plans.map((plan) => <div className={`plan-preview ${plan.popular ? 'is-popular' : ''}`} key={plan.name}>{plan.popular && <span className="plan-preview-tag">Popular</span>}<span className="plan-preview-name">{plan.name}</span><strong>{plan.price}{plan.price !== 'Free' && <small>/month</small>}</strong><p>{plan.detail}</p><Link href="/pricing" className="btn btn-ghost plan-preview-button">{plan.name === 'Starter' ? 'Get started' : plan.name === 'Member' ? 'Start free trial' : 'Talk to us'} →</Link></div>)}
      </div>
      <Link href="/pricing" className="btn btn-ghost pricing-link">Learn more about plans →</Link>
    </section>
  )
}
