'use client'

import { useState } from 'react'
import HeartbeatSpine from '@/components/HeartbeatSpine'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const faqs = [
  {
    question: 'What is the FINIT Score™?',
    answer:
      'The FINIT Score™ is your complete financial wellbeing score (0–1000). It looks at ten key areas like income, savings, debt, cash flow, and habits — not just your borrowing history.',
  },
  {
    question: 'How is FINIT different from a credit score?',
    answer:
      'Credit scores focus on your risk to lenders. FINIT measures your overall financial health and gives you actionable steps to improve.',
  },
  {
    question: 'Is my data secure?',
    answer:
      'Yes. We use bank-grade encryption, never store your passwords, and only connect accounts with your explicit permission. You can disconnect anytime.',
  },
  {
    question: 'How often does my score update?',
    answer:
      'Your score updates every month with your latest financial activity.',
  },
  {
    question: 'What is the FINIT Simulation Engine?',
    answer:
      'It lets you test “what-if” scenarios (like saving more or paying off debt) and see the instant impact on your score.',
  },
  {
    question: 'How does the AI Copilot work?',
    answer:
      'The AI gives personalized answers based on your data. For complex needs, you can instantly connect to a SEBI-registered advisor.',
  },
]

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const toggleIndex = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <HeartbeatSpine />
      <Header />

      <div className="wrap">
        <section className="block" style={{ padding: '60px 0 80px' }}>
          <div style={{ maxWidth: '780px', margin: '0 auto 36px' }}>
            <h1
              style={{
                fontFamily: 'var(--f-display)',
                fontSize: '44px',
                fontWeight: 800,
                letterSpacing: '-1px',
                lineHeight: 1.15,
              }}
            >
              Frequently Asked <em style={{ fontStyle: 'normal', color: 'var(--saffron)' }}>Questions.</em>
            </h1>
          </div>

          <div
            style={{
              maxWidth: '780px',
              margin: '0 auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index
              return (
                <div
                  key={index}
                  style={{
                    background: 'var(--ink-2)',
                    border: '1px solid var(--hair)',
                    borderLeft: isOpen ? '3px solid var(--saffron)' : '1px solid var(--hair)',
                    borderRadius: '2px',
                    overflow: 'hidden',
                    transition: 'border-color 0.2s ease',
                  }}
                >
                  <button
                    onClick={() => toggleIndex(index)}
                    style={{
                      width: '100%',
                      padding: '20px 24px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: 'none',
                      border: 'none',
                      color: 'var(--ivory)',
                      fontFamily: 'var(--f-display)',
                      fontSize: '17px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      textAlign: 'left',
                      gap: '16px',
                    }}
                  >
                    <span>{faq.question}</span>
                    <span
                      style={{
                        fontFamily: 'var(--f-mono)',
                        fontSize: '18px',
                        color: isOpen ? 'var(--saffron)' : 'var(--text-low)',
                        transition: 'transform 0.2s ease',
                        transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                      }}
                    >
                      +
                    </span>
                  </button>
                  {isOpen && (
                    <div
                      style={{
                        padding: '0 24px 22px 24px',
                        color: 'var(--text-mid)',
                        fontSize: '14px',
                        lineHeight: 1.65,
                        borderTop: '1px dashed var(--hair)',
                        paddingTop: '16px',
                      }}
                    >
                      {faq.answer}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </section>

        <Footer />
      </div>
    </main>
  )
}
