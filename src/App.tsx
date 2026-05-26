import { GlassSidebar } from './components/GlassSidebar'
import { useSmoothScroll } from './hooks/useSmoothScroll'
import { HeroSection } from './sections/HeroSection'
import { QuotesSection } from './sections/QuotesSection'
import { TimelineZoomSection } from './sections/TimelineZoomSection'
import { WorkSection } from './sections/WorkSection'
import './App.css'

function App() {
  useSmoothScroll()

  return (
    <>
      <GlassSidebar />
      <main className="app">
        <HeroSection />
        <QuotesSection />
        <TimelineZoomSection />
        <WorkSection />
      </main>
    </>
  )
}

export default App
