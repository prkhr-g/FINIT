export default function Copilot() {
  return (
    <section className="block" id="copilot">
      <div className="section-head">
        <div>
          <div className="eyebrow">AI Copilot</div>
          <h2>An advisor that never sleeps — and never guesses.</h2>
          <p>
            Every answer is grounded in the ten pillars above, not generic articles. Escalate to a verified human expert whenever the question needs one.
          </p>
        </div>
      </div>

      <div className="copilot-grid">
        <div className="copilot-card">
          <div className="copilot-q-label">Asked just now</div>
          <div className="copilot-question">
            &ldquo;Can I afford a ₹90L home loan without breaking my retirement plan?&rdquo;
          </div>
          <div className="copilot-answer">
            At your current FINIT Score of <b>718</b>, a ₹90L loan pushes EMI-to-income past the 35% safety line. Projected retirement corpus would fall by roughly a tenth by 2050.
            <br /><br />
            <span className="rec">Recommendation:</span> cap the loan near ₹72L, or defer six months to raise the down payment — both keep the score above 700.
          </div>
          <div className="copilot-tags">
            <span className="copilot-tag">Debt Health</span>
            <span className="copilot-tag">Retirement</span>
            <span className="copilot-tag">Cash Flow</span>
          </div>
        </div>

        <div className="copilot-feats">
          <div className="copilot-feat">
            <h4>Grounded in your data</h4>
            <p>Every answer references your income, spending, holdings and goals — with the pillar cited.</p>
          </div>

          <div className="copilot-feat">
            <h4>Explainable, not black-box</h4>
            <p>See exactly which factors moved the score, and why the copilot recommends what it does.</p>
          </div>

          <div className="copilot-feat">
            <h4>Human-in-the-loop</h4>
            <p>Escalate any conversation to a SEBI-registered advisor — the AI never advises alone on regulated actions.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
