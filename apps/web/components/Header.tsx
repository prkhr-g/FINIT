import Link from 'next/link'

export default function Header() {
  return (
    <header className="nav">
      <div className="nav-inner">
        <Link href="/" className="wordmark">FINIT</Link>
        <nav className="nav-links">
          <Link href="/features">Features</Link>
          <Link href="/stories">Stories</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/faq">FAQs</Link>
        </nav>
        <Link href="/signup" className="btn btn-primary">Get my score →</Link>
      </div>
    </header>
  )
}
