import FinitIcon from '@/components/FinitIcon'
import Link from 'next/link'

const features = [
  { icon: 'score', name: 'Score Engine', description: 'Recalculates your financial health score the moment your accounts change.', anchor: 'score-engine' },
  { icon: 'brief', name: 'Dashboard', description: 'Income, expenses, debt and savings brought together in one live view.', anchor: 'dashboard' },
  { icon: 'growth', name: 'Forecast Engine', description: 'Project your score forward and see what is coming next.', anchor: 'forecast-engine' },
  { icon: 'map', name: 'Simulation Engine', description: 'Test an extra 20% in savings before you make the decision.', anchor: 'simulation-engine' },
  { icon: 'spark', name: 'AI Recommendations', description: 'Get ranked, specific actions based on their potential point impact.', anchor: 'ai-recommendations' },
  { icon: 'chat', name: 'Notifications', description: 'Know when your score shifts, a bill is due, or a new action is ready.', anchor: 'notifications' },
  { icon: 'calendar', name: 'Reports', description: 'Keep an automatic, categorized record of every transaction.', anchor: 'reports' },
  { icon: 'shield', name: 'Advisor Access', description: 'Share the same live financial picture with the person advising you.', anchor: 'advisor-access' },
]

export default function FeatureGrid() {
  return (
    <section className="block features-block" id="features">
      <div className="section-head"><div><div className="eyebrow">The FINIT system</div><h2>Every part of your financial life, working as one picture.</h2></div></div>
      <div className="feature-grid">{features.map((feature) => <Link className="feature-card" href={`/features#${feature.anchor}`} key={feature.name}><FinitIcon name={feature.icon as Parameters<typeof FinitIcon>[0]['name']} /><div className="feature-card-body"><h3>{feature.name}</h3><p>{feature.description}</p></div><span className="feature-arrow" aria-hidden="true"><svg viewBox="0 0 20 20" fill="none"><path d="M3 10h12M11 5l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg></span></Link>)}</div>
    </section>
  )
}
