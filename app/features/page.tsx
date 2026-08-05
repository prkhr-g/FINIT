import type { Metadata } from 'next'
import FeaturesExperience from '@/components/FeaturesExperience'
import Footer from '@/components/Footer'
import Header from '@/components/Header'

export const metadata: Metadata = {
  title: 'FINIT Features — Your financial health, explained',
  description: 'Explore the eight FINIT engines that analyze, plan, improve, and track your financial health.',
}

export default function FeaturesPage() {
  return (
    <main className="features-page relative min-h-screen">
      <Header />
      <FeaturesExperience />
      <div className="wrap"><Footer /></div>
    </main>
  )
}
