import Link from 'next/link'

export default function Footer() {
  return (
    <>
      <section className="final-cta" id="get-score">
        <div className="eyebrow">Every feature calculates, explains, improves, or monitors the score.</div>
        <h2>Know your FINIT Score.</h2>
        <p>This is the operating system for financial wellbeing — not just a number.</p>
        <Link href="/signup" className="btn btn-primary">Get my score →</Link>
      </section>
      <footer>
        <div className="footer-grid">
          <div className="footer-brand"><Link href="/" className="wordmark">FINIT</Link><p>Every feature calculates, explains, improves, or monitors the FINIT Score.</p></div>
          <div className="footer-col"><h5>Product</h5><Link href="/features">Features</Link><Link href="/features">FINIT Score</Link><Link href="/features">Simulation &amp; Copilot</Link><Link href="/pricing">Membership</Link><Link href="/pricing">Pricing</Link></div>
          <div className="footer-col"><h5>Company</h5><Link href="/#about">About</Link><Link href="/features">How it works</Link><Link href="/contact">Contact</Link><Link href="/faq">FAQ</Link></div>
          <div className="footer-col"><h5>Legal</h5><span>Privacy</span><span>Terms</span><span>Disclosures</span></div>
        </div>
        <div className="footer-bottom"><span>© 2026 FINIT Technologies — Next.js Edition</span><span>FINIT Score™, FINIT Age™, FINIT Risk™, FINIT Pulse™, FINIT Forecast™</span></div>
      </footer>
    </>
  )
}
