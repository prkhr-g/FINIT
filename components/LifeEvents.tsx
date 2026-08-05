import FinitIcon from '@/components/FinitIcon'

const events = ['New job', 'Marriage', 'Having a child', 'Buying a home', 'Starting a business', 'Education', 'Retirement', 'Inheritance']
const eventIcons: Parameters<typeof FinitIcon>[0]['name'][] = ['growth', 'people', 'people', 'home', 'growth', 'brief', 'calendar', 'shield']

export default function LifeEvents() {
  return (
    <section className="block life-events" id="life-events">
      <div className="section-head"><div><div className="eyebrow">Life events</div><h2>Life changes. So should your financial plan.</h2><p>Each milestone changes your money. FINIT helps you prepare before it does.</p></div></div>
      <div className="event-grid">{events.map((event, index) => <div className="event-card" key={event}><FinitIcon name={eventIcons[index]} /><h3>{event}</h3></div>)}</div>
    </section>
  )
}
