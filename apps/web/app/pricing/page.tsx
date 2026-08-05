'use client'

import HeartbeatSpine from '@/components/HeartbeatSpine'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function PricingPage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <HeartbeatSpine />
      <Header />

      <div className="wrap">
        <section className="block" style={{ padding: '60px 0 80px' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 40px' }}>
            <h1
              style={{
                fontFamily: 'var(--f-display)',
                fontSize: '44px',
                fontWeight: 800,
                letterSpacing: '-1px',
                lineHeight: 1.15,
              }}
            >
              Choose a plan that’s <em style={{ fontStyle: 'normal', color: 'var(--saffron)' }}>right for you</em>
            </h1>
            <p
              style={{
                marginTop: '14px',
                fontSize: '16px',
                color: 'var(--text-mid)',
                lineHeight: 1.6,
              }}
            >
              Try our basic plan risk free for 30 days. Switch plans or cancel any time.
            </p>
          </div>

          {/* Top 3 Plan Cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '24px',
              maxWidth: '1100px',
              margin: '0 auto 60px',
            }}
          >
            {/* Card 1: Starter */}
            <div
              style={{
                background: 'var(--ink-2)',
                border: '1px solid var(--hair)',
                borderRadius: '12px',
                padding: '32px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
              }}
            >
              <div>
                <h3 style={{ fontFamily: 'var(--f-display)', fontSize: '20px', fontWeight: 700, color: 'var(--ivory)' }}>
                  Starter
                </h3>
                <div style={{ margin: '16px 0 6px' }}>
                  <span style={{ fontFamily: 'var(--f-display)', fontSize: '38px', fontWeight: 800, color: 'var(--ivory)' }}>
                    Free
                  </span>
                </div>
                <p style={{ color: 'var(--text-mid)', fontSize: '13px', marginBottom: '24px' }}>
                  Discover your FINIT Score.
                </p>

                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px 0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <li style={{ color: 'var(--text-mid)', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: 'var(--teal)' }}>•</span> Monthly FINIT Score
                  </li>
                  <li style={{ color: 'var(--text-mid)', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: 'var(--teal)' }}>•</span> Basic health dashboard
                  </li>
                  <li style={{ color: 'var(--text-mid)', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: 'var(--teal)' }}>•</span> AI copilot (10 chats/mo)
                  </li>
                </ul>
              </div>

              <button
                className="btn btn-ghost"
                style={{ width: '100%', textAlign: 'center', marginTop: '16px', borderRadius: '6px' }}
              >
                Get started →
              </button>
            </div>

            {/* Card 2: Member */}
            <div
              style={{
                background: 'var(--ink-2)',
                border: '1px solid var(--hair)',
                borderRadius: '12px',
                padding: '32px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontFamily: 'var(--f-display)', fontSize: '20px', fontWeight: 700, color: 'var(--ivory)' }}>
                    Member
                  </h3>
                  <span
                    style={{
                      fontFamily: 'var(--f-mono)',
                      fontSize: '10px',
                      fontWeight: 700,
                      letterSpacing: '1px',
                      textTransform: 'uppercase',
                      background: 'rgba(66, 116, 217, 0.2)',
                      color: 'var(--saffron)',
                      padding: '3px 8px',
                      borderRadius: '4px',
                      border: '1px solid rgba(66, 116, 217, 0.4)',
                    }}
                  >
                    POPULAR
                  </span>
                </div>

                <div style={{ margin: '16px 0 6px' }}>
                  <span style={{ fontFamily: 'var(--f-mono)', fontSize: '38px', fontWeight: 800, color: 'var(--ivory)' }}>
                    ₹499
                  </span>
                  <span style={{ color: 'var(--text-low)', fontSize: '13px', marginLeft: '6px' }}>/month</span>
                </div>
                <p style={{ color: 'var(--text-mid)', fontSize: '13px', marginBottom: '24px' }}>
                  The complete platform.
                </p>

                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px 0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <li style={{ color: 'var(--text-mid)', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: 'var(--teal)' }}>•</span> Unlimited AI copilot
                  </li>
                  <li style={{ color: 'var(--text-mid)', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: 'var(--teal)' }}>•</span> 1 expert call / month
                  </li>
                  <li style={{ color: 'var(--text-mid)', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: 'var(--teal)' }}>•</span> Goal tracking &amp; alerts
                  </li>
                  <li style={{ color: 'var(--text-mid)', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: 'var(--teal)' }}>•</span> Tax optimization tools
                  </li>
                </ul>
              </div>

              <button
                className="btn btn-ghost"
                style={{ width: '100%', textAlign: 'center', marginTop: '16px', borderRadius: '6px' }}
              >
                Start free trial →
              </button>
            </div>

            {/* Card 3: Family Office */}
            <div
              style={{
                background: 'var(--ink-2)',
                border: '1px solid var(--hair)',
                borderRadius: '12px',
                padding: '32px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
              }}
            >
              <div>
                <h3 style={{ fontFamily: 'var(--f-display)', fontSize: '20px', fontWeight: 700, color: 'var(--ivory)' }}>
                  Family Office
                </h3>

                <div style={{ margin: '16px 0 6px' }}>
                  <span style={{ fontFamily: 'var(--f-mono)', fontSize: '38px', fontWeight: 800, color: 'var(--ivory)' }}>
                    ₹4,999
                  </span>
                  <span style={{ color: 'var(--text-low)', fontSize: '13px', marginLeft: '6px' }}>/month</span>
                </div>
                <p style={{ color: 'var(--text-mid)', fontSize: '13px', marginBottom: '24px' }}>
                  Wealth stewardship.
                </p>

                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px 0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <li style={{ color: 'var(--text-mid)', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: 'var(--teal)' }}>•</span> Everything in Member
                  </li>
                  <li style={{ color: 'var(--text-mid)', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: 'var(--teal)' }}>•</span> Dedicated advisor
                  </li>
                  <li style={{ color: 'var(--text-mid)', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: 'var(--teal)' }}>•</span> Estate &amp; tax planning
                  </li>
                  <li style={{ color: 'var(--text-mid)', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: 'var(--teal)' }}>•</span> Priority expert access
                  </li>
                </ul>
              </div>

              <button
                className="btn btn-ghost"
                style={{ width: '100%', textAlign: 'center', marginTop: '16px', borderRadius: '6px' }}
              >
                Talk to us →
              </button>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </main>
  )
}
