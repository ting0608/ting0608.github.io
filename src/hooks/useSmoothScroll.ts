import { useLayoutEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

let lenis: Lenis | null = null

export function getLenis() {
  return lenis
}

/** Scroll to a section id with Lenis momentum, or native smooth scroll as fallback. */
export function scrollToSection(id: string) {
  const target = document.getElementById(id)
  if (!target) return

  if (lenis) {
    lenis.scrollTo(target, { duration: 1.15 })
    return
  }

  target.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export function useSmoothScroll() {
  useLayoutEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    const instance = new Lenis({
      duration: 1.12,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.6,
    })
    lenis = instance

    instance.on('scroll', ScrollTrigger.update)

    const onTick = (time: number) => {
      instance.raf(time * 1000)
    }
    gsap.ticker.add(onTick)
    gsap.ticker.lagSmoothing(0)

    const onResize = () => ScrollTrigger.refresh()
    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('resize', onResize)
      gsap.ticker.remove(onTick)
      instance.destroy()
      lenis = null
    }
  }, [])
}
