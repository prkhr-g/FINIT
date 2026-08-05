import FinitIcon from '@/components/FinitIcon'

const solutions = [
  { icon: 'map', title: 'One financial picture', description: 'FINIT connects income, cash flow, debt, savings, protection and behaviour in a single score.' },
  { icon: 'spark', title: 'Clear next steps', description: 'It shows the gaps with the greatest impact, so you know exactly where to focus first.' },
  { icon: 'growth', title: 'Decisions you can test', description: 'Use the simulation engine to see the financial effect of a choice before you make it.' },
]

export default function ProblemSolutions() {
  return (
    <section className="block problem-solutions">
      <div className="problem-panel">
        <div className="problem-copy"><div className="eyebrow">The problem</div><h2>Every Indian makes financial decisions. Almost nobody gets personal guidance.</h2><p>Google, friends, YouTube, banks and expensive advisors only show a slice of the answer. None of them understand your entire financial life.</p></div>
        <div className="solution-list"><h3 className="solution-list-title">How FINIT helps</h3>{solutions.map((solution) => <article className="solution-card" key={solution.title}><FinitIcon name={solution.icon as Parameters<typeof FinitIcon>[0]['name']} /><div><h3>{solution.title}</h3><p>{solution.description}</p></div></article>)}</div>
      </div>
    </section>
  )
}
