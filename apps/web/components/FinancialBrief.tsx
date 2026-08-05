import FinitIcon from '@/components/FinitIcon'

export default function FinancialBrief() {
  return (
    <section className="block financial-brief" id="brief">
      <div className="section-head"><div><div className="eyebrow">Today&apos;s financial brief</div><h2>Your dashboard should tell you what matters now.</h2><p>Not another collection of balances. A living briefing that explains what changed, what it means and what you can do next.</p></div></div>
      <div className="brief-panel">
        <div className="brief-heading"><span className="brief-icon"><FinitIcon name="brief" /></span>Good morning, Raj.<small>Here&apos;s what changed since your last visit.</small></div>
        <ul className="brief-list">
          <li><span>01</span><p>Your salary was credited. You spent <b>₹8,200 less</b> than last month.</p></li>
          <li><span>02</span><p>Your FINIT Score increased by <b>6 points</b>. You can safely increase your SIP by <b>₹2,500/month</b>.</p></li>
          <li><span>03</span><p>Home-loan rates have fallen. Refinancing could save you up to <b>₹9.8 lakh</b>.</p></li>
          <li><span>04</span><p>You&apos;re now <b>84% ready</b> to buy the home you&apos;re planning.</p></li>
        </ul>
        <div className="brief-prompt">What financial decision would you like to make today?</div>
      </div>
    </section>
  )
}
