const testimonials = [
  { quote: 'FINIT gave me one place to see the trade-offs behind my home-loan decision. It made the next step obvious.', name: 'Rhea S.', initials: 'RS', detail: 'Product designer, Bengaluru', topic: 'Home loan clarity' },
  { quote: 'I had a credit score, but no view of my actual financial health. The emergency-fund gap was the wake-up call.', name: 'Karan M.', initials: 'KM', detail: 'Consultant, Mumbai', topic: 'Financial health' },
  { quote: 'The score is useful because it explains itself. I could see exactly what to improve, month by month.', name: 'Nandita P.', initials: 'NP', detail: 'Founder, Delhi NCR', topic: 'Better each month' },
]

export default function Testimonials() {
  return (
    <section className="block testimonials-block" id="stories">
      <div className="section-head"><div><div className="eyebrow">Member Stories</div><h2>Clarity makes better financial decisions possible.</h2></div></div>
      <div className="testimonial-grid">
        {testimonials.map((testimonial) => <figure className="testimonial-card" key={testimonial.name}>
          <div className="testimonial-card-top"><span className="testimonial-topic">{testimonial.topic}</span><span className="quote-mark" aria-hidden="true">&ldquo;</span></div>
          <blockquote>{testimonial.quote}</blockquote>
          <figcaption><span className="testimonial-avatar">{testimonial.initials}</span><span><strong>{testimonial.name}</strong><span>{testimonial.detail}</span></span></figcaption>
        </figure>)}
      </div>
    </section>
  )
}
