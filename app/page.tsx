import Header from '@/components/Header'
import Hero from '@/components/Hero'
import ProblemSolutions from '@/components/ProblemSolutions'
import FeatureGrid from '@/components/FeatureGrid'
import FinancialBrief from '@/components/FinancialBrief'
import HowItWorks from '@/components/HowItWorks'
import Copilot from '@/components/Copilot'
import LifeEvents from '@/components/LifeEvents'
import Experts from '@/components/Experts'
import Tracking from '@/components/Tracking'
import Trust from '@/components/Trust'
import Testimonials from '@/components/Testimonials'
import Footer from '@/components/Footer'
import ScrollReveal from '@/components/ScrollReveal'

export default function Home() {
  return (
    <main className="landing-page relative min-h-screen">
      <Header />
      <div className="wrap">
        <Hero />
        <ScrollReveal delay={20}><ProblemSolutions /></ScrollReveal>
        <ScrollReveal delay={20}><HowItWorks /></ScrollReveal>
        <ScrollReveal delay={20}><FeatureGrid /></ScrollReveal>
        <ScrollReveal delay={20}><FinancialBrief /></ScrollReveal>
        <ScrollReveal delay={20}><Copilot /></ScrollReveal>
        <ScrollReveal delay={20}><LifeEvents /></ScrollReveal>
        <ScrollReveal delay={20}><Experts /></ScrollReveal>
        <ScrollReveal delay={20}><Tracking /></ScrollReveal>
        <ScrollReveal delay={20}><Trust /></ScrollReveal>
        <ScrollReveal delay={20}><Testimonials /></ScrollReveal>
        <ScrollReveal delay={20}><Footer /></ScrollReveal>
      </div>
    </main>
  )
}
