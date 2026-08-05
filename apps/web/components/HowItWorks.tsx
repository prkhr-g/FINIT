import FinitIcon from '@/components/FinitIcon'

const steps = [
  ['map', 'Understand', 'FINIT learns about your income, expenses, loans, investments, goals and family.'],
  ['score', 'Assess', 'Receive your personalised FINIT Score and see the strengths and gaps behind it.'],
  ['spark', 'Improve', 'Follow a prioritised AI action plan built around the moves that matter most.'],
  ['chat', 'Decide', 'Ask FINIT about the home, car, career move or investment you are considering.'],
  ['growth', 'Grow', 'Track progress over time as every better decision strengthens your financial future.'],
]

export default function HowItWorks() {
  return (
    <section className="block how-it-works" id="how-it-works">
      <div className="section-head">
        <div>
          <div className="eyebrow">How FINIT works</div>
          <h2>One financial life. A clearer way forward.</h2>
          <p>FINIT turns your complete financial picture into the context, confidence and next action for every decision.</p>
        </div>
      </div>
      <div className="journey-grid">
        {steps.map(([icon, title, description]) => (
          <article className="journey-step" key={title}>
            <FinitIcon name={icon as Parameters<typeof FinitIcon>[0]['name']} /><h3>{title}</h3><p>{description}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
