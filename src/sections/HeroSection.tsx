import { FistBumpButton } from '../components/FistBumpButton'
import { ImageCarousel } from '../components/ImageCarousel'
import { RevealText } from '../components/RevealText'
import { ScrollHint } from '../components/ScrollHint'
import { TypingAnimation } from '../components/TypingAnimation'

export function HeroSection() {
  return (
    <section id="hero" className="section hero-section">
      <div className="section-inner">
        <RevealText as="div" className="hero-title-row" delay={0}>
          <h1 className="hero-title">Welcome to tingcccc&apos;s profile</h1>
          <FistBumpButton />
        </RevealText>
        <RevealText delay={120}>
          <TypingAnimation />
        </RevealText>
        <ImageCarousel />
      </div>
      <ScrollHint targetId="quotes" />
    </section>
  )
}
