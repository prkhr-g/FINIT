import Link from 'next/link'

export default function AboutContact() {
  return (
    <section className="block about-contact" id="about">
      <div className="section-head"><div><div className="eyebrow">Built for Better Money Decisions</div><h2>Financial wellbeing should be understandable, not intimidating.</h2></div></div>
      <div className="about-contact-panel"><div><p>FINIT is building a more complete and explainable view of financial health — one that helps people see where they stand, understand what is affecting them, and take the next useful step.</p><p>Our score brings income, cash flow, savings, debt, protection and long-term goals into one practical system. Every recommendation is designed to be clear, traceable and grounded in the person behind the numbers.</p><span className="about-contact-note">Questions about the FINIT Score, plans, partnerships or the product? We would love to hear from you.</span></div><Link href="/contact" className="btn btn-ghost">Get in touch →</Link></div>
    </section>
  )
}
