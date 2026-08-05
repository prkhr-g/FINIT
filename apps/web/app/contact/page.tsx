'use client'

import { useState } from 'react'
import HeartbeatSpine from '@/components/HeartbeatSpine'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    query: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.name && formData.email && formData.query) {
      setSubmitted(true)
    }
  }

  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <HeartbeatSpine />
      <Header />

      <div className="wrap">
        <section className="block" style={{ padding: '60px 0 80px' }}>
          <div style={{ maxWidth: '680px', margin: '0 auto 36px' }}>
            <h1
              style={{
                fontFamily: 'var(--f-display)',
                fontSize: '44px',
                fontWeight: 800,
                letterSpacing: '-1px',
                lineHeight: 1.15,
              }}
            >
              Get in <em style={{ fontStyle: 'normal', color: 'var(--saffron)' }}>touch.</em>
            </h1>
            <p
              style={{
                marginTop: '12px',
                fontSize: '15px',
                color: 'var(--text-mid)',
                maxWidth: '540px',
                lineHeight: 1.6,
              }}
            >
              Have questions about the FINIT Score, enterprise plans, or simulations? Send us your query below.
            </p>
          </div>

          <div
            style={{
              maxWidth: '680px',
              margin: '0 auto',
              background: 'var(--ink-2)',
              border: '1px solid var(--hair)',
              borderTop: '3px dashed var(--saffron)',
              borderRadius: '2px',
              padding: '36px',
            }}
          >
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '24px 12px' }}>
                <div className="eyebrow" style={{ color: 'var(--teal)' }}>
                  [ MESSAGE SENT ]
                </div>
                <h3
                  style={{
                    fontFamily: 'var(--f-display)',
                    fontSize: '24px',
                    fontWeight: 700,
                    marginTop: '8px',
                    color: 'var(--ivory)',
                  }}
                >
                  Thank you, {formData.name}!
                </h3>
                <p
                  style={{
                    color: 'var(--text-mid)',
                    marginTop: '12px',
                    fontSize: '14px',
                    lineHeight: '1.6',
                  }}
                >
                  Your query has been received. Our team will get back to you at{' '}
                  <strong style={{ color: 'var(--saffron)' }}>{formData.email}</strong> shortly.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false)
                    setFormData({ name: '', email: '', query: '' })
                  }}
                  className="btn btn-ghost"
                  style={{ marginTop: '24px' }}
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div>
                  <label
                    htmlFor="name"
                    style={{
                      display: 'block',
                      fontFamily: 'var(--f-mono)',
                      fontSize: '11px',
                      letterSpacing: '1px',
                      textTransform: 'uppercase',
                      color: 'var(--text-mid)',
                      marginBottom: '8px',
                      fontWeight: 600,
                    }}
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    placeholder="Your Full Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    style={{
                      width: '100%',
                      background: 'rgba(14, 21, 56, 0.6)',
                      border: '1px solid var(--hair)',
                      borderRadius: '2px',
                      padding: '12px 16px',
                      color: 'var(--ivory)',
                      fontFamily: 'var(--f-body)',
                      fontSize: '14px',
                      outline: 'none',
                    }}
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    style={{
                      display: 'block',
                      fontFamily: 'var(--f-mono)',
                      fontSize: '11px',
                      letterSpacing: '1px',
                      textTransform: 'uppercase',
                      color: 'var(--text-mid)',
                      marginBottom: '8px',
                      fontWeight: 600,
                    }}
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    style={{
                      width: '100%',
                      background: 'rgba(14, 21, 56, 0.6)',
                      border: '1px solid var(--hair)',
                      borderRadius: '2px',
                      padding: '12px 16px',
                      color: 'var(--ivory)',
                      fontFamily: 'var(--f-body)',
                      fontSize: '14px',
                      outline: 'none',
                    }}
                  />
                </div>

                <div>
                  <label
                    htmlFor="query"
                    style={{
                      display: 'block',
                      fontFamily: 'var(--f-mono)',
                      fontSize: '11px',
                      letterSpacing: '1px',
                      textTransform: 'uppercase',
                      color: 'var(--text-mid)',
                      marginBottom: '8px',
                      fontWeight: 600,
                    }}
                  >
                    Query
                  </label>
                  <textarea
                    id="query"
                    required
                    rows={5}
                    placeholder="How can we help you?"
                    value={formData.query}
                    onChange={(e) => setFormData({ ...formData, query: e.target.value })}
                    style={{
                      width: '100%',
                      background: 'rgba(14, 21, 56, 0.6)',
                      border: '1px solid var(--hair)',
                      borderRadius: '2px',
                      padding: '12px 16px',
                      color: 'var(--ivory)',
                      fontFamily: 'var(--f-body)',
                      fontSize: '14px',
                      outline: 'none',
                      resize: 'vertical',
                    }}
                  />
                </div>

                <div style={{ marginTop: '8px' }}>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ width: '100%', textAlign: 'center', boxShadow: 'none', transform: 'none' }}
                  >
                    Send Message →
                  </button>
                </div>
              </form>
            )}
          </div>
        </section>

        <Footer />
      </div>
    </main>
  )
}
