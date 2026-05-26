import { scrollToSection } from '../hooks/useSmoothScroll'

type ScrollHintProps = {
  targetId: string
  label?: string
}

export function ScrollHint({ targetId, label = 'Scroll down to next' }: ScrollHintProps) {
  const scrollTo = () => scrollToSection(targetId)

  return (
    <button type="button" className="scroll-hint" onClick={scrollTo}>
      <span>{label}</span>
      <span className="scroll-hint-arrow" aria-hidden="true">
        ↓
      </span>
    </button>
  )
}
