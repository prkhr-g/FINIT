import HeartbeatSpine from '@/components/HeartbeatSpine'
import Header from '@/components/Header'
import Testimonials from '@/components/Testimonials'
import Footer from '@/components/Footer'

export default function StoriesPage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <HeartbeatSpine />
      <Header />

      <div className="wrap">
        <Testimonials />
        <Footer />
      </div>
    </main>
  )
}
