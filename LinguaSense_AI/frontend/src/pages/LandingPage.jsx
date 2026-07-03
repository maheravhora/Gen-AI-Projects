import Hero from '../components/landing/Hero'
import Features from '../components/landing/Features'
import Stats from '../components/landing/Stats'
import Testimonials from '../components/landing/Testimonials'
import FAQ from '../components/landing/FAQ'

export default function LandingPage() {
  return (
    <div className="relative overflow-hidden">
      <Hero />
      <Features />
      <Stats />
      <Testimonials />
      <FAQ />
    </div>
  )
}
