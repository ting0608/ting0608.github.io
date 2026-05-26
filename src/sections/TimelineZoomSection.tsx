import { forwardRef, useLayoutEffect, useRef, useState, type CSSProperties } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  timelineFrames,
  timelineRevealClipPaths,
  type TimelineFrame,
} from '../data/timelineZoom'
import './TimelineZoomSection.css'

gsap.registerPlugin(ScrollTrigger)

const TIMELINE_FRAME_SCROLL_VH = 100
const SEGMENT_DURATION = 1
const ZOOM_START = 1.4

/** Shell frame for layers — images are set only via GSAP (avoids React/src flash). */
const LAYER_SHELL_FRAME: TimelineFrame = {
  year: '',
  caption: '',
  color: '#1b262c',
  maskShape: 'circle',
}

function getRevealClosed(frame: TimelineFrame) {
  return timelineRevealClipPaths[frame.maskShape].closed
}

function getRevealOpen(frame: TimelineFrame) {
  return timelineRevealClipPaths[frame.maskShape].open
}

type LayerElements = {
  root: HTMLDivElement
  image: HTMLImageElement
  label: HTMLSpanElement
}

const TimelineLayer = forwardRef<
  HTMLDivElement,
  { frame: TimelineFrame; className?: string }
>(function TimelineLayer({ frame, className }, ref) {
  return (
    <div
      ref={ref}
      className={`timeline-zoom-layer timeline-zoom-placeholder${frame.image ? ' has-image' : ''}${className ? ` ${className}` : ''}`}
      style={{ '--frame-color': frame.color } as CSSProperties}
    >
      <img
        className={`timeline-zoom-placeholder-image${frame.image ? '' : ' is-hidden'}`}
        src={frame.image}
        alt={frame.image ? frame.caption : ''}
        loading="lazy"
        decoding="async"
      />
      <span className="timeline-zoom-placeholder-label">Photo · {frame.year}</span>
    </div>
  )
})

export function TimelineZoomSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const pinRef = useRef<HTMLDivElement>(null)
  const baseLayerRef = useRef<HTMLDivElement>(null)
  const incomingLayerRef = useRef<HTMLDivElement>(null)
  const yearRef = useRef<HTMLParagraphElement>(null)
  const captionRef = useRef<HTMLParagraphElement>(null)
  const preparedSegmentRef = useRef(-1)
  const [activeIndex, setActiveIndex] = useState(0)
  const [reducedMotion, setReducedMotion] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  useLayoutEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = () => setReducedMotion(media.matches)
    onChange()
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  useLayoutEffect(() => {
    if (reducedMotion) return

    const section = sectionRef.current
    const pin = pinRef.current
    const baseLayer = baseLayerRef.current
    const incomingLayer = incomingLayerRef.current
    const year = yearRef.current
    const caption = captionRef.current

    if (!section || !pin || !baseLayer || !incomingLayer || !year || !caption) {
      return
    }

    const base: LayerElements = {
      root: baseLayer,
      image: baseLayer.querySelector('img')!,
      label: baseLayer.querySelector('.timeline-zoom-placeholder-label')!,
    }
    const incoming: LayerElements = {
      root: incomingLayer,
      image: incomingLayer.querySelector('img')!,
      label: incomingLayer.querySelector('.timeline-zoom-placeholder-label')!,
    }

    const prepareSegment = (index: number) => {
      const frame = timelineFrames[index]
      if (!frame) return

      const closed = getRevealClosed(frame)

      if (index > 0) {
        gsap.set(base.root, { opacity: 1 })
        applyFrameToLayer(base, timelineFrames[index - 1])
      } else {
        gsap.set(base.root, { opacity: 0 })
      }

      // Mask closed first, then swap image — prevents next photo flashing early
      gsap.set(incoming.root, {
        clipPath: closed,
        webkitClipPath: closed,
        scale: ZOOM_START,
      })
      applyFrameToLayer(incoming, frame)

      year.textContent = frame.year
      caption.textContent = frame.caption
      preparedSegmentRef.current = index
      setActiveIndex(index)
    }

    prepareSegment(0)

    const refresh = () => ScrollTrigger.refresh()
    window.addEventListener('load', refresh)
    window.addEventListener('resize', refresh)

    const ctx = gsap.context(() => {
      gsap.set([year, caption], { opacity: 0, y: 28 })

      const scrollDistance = () =>
        window.innerHeight * (timelineFrames.length * TIMELINE_FRAME_SCROLL_VH) / 100

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${scrollDistance()}`,
          scrub: 1.15,
          pin,
          pinSpacing: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const frameCount = timelineFrames.length
            const index = Math.min(frameCount - 1, Math.floor(self.progress * frameCount))

            if (preparedSegmentRef.current !== index) {
              prepareSegment(index)
            }
          },
        },
      })

      timelineFrames.forEach((frame, index) => {
        const start = index

        tl.add(() => prepareSegment(index), start)

        tl.fromTo(
          incoming.root,
          {
            clipPath: getRevealClosed(frame),
            webkitClipPath: getRevealClosed(frame),
          },
          {
            clipPath: getRevealOpen(frame),
            webkitClipPath: getRevealOpen(frame),
            duration: SEGMENT_DURATION,
            ease: 'power3.inOut',
            immediateRender: false,
          },
          start,
        )

        tl.fromTo(
          incoming.root,
          { scale: ZOOM_START },
          { scale: 1, duration: SEGMENT_DURATION, ease: 'power3.out', immediateRender: false },
          start,
        )

        tl.fromTo(
          year,
          { opacity: 0, y: 28 },
          { opacity: 1, y: 0, duration: 0.38, ease: 'power2.out' },
          start + 0.12,
        )

        tl.fromTo(
          caption,
          { opacity: 0, y: 22 },
          { opacity: 1, y: 0, duration: 0.38, ease: 'power2.out' },
          start + 0.18,
        )

        if (index < timelineFrames.length - 1) {
          tl.to(
            [year, caption],
            { opacity: 0, y: -16, duration: 0.2, ease: 'power1.in' },
            start + SEGMENT_DURATION - 0.15,
          )
        }
      })

      refresh()
    }, sectionRef)

    return () => {
      window.removeEventListener('load', refresh)
      window.removeEventListener('resize', refresh)
      preparedSegmentRef.current = -1
      ctx.revert()
    }
  }, [reducedMotion])

  return (
    <section
      id="timeline"
      ref={sectionRef}
      className={`timeline-zoom${reducedMotion ? ' timeline-zoom--static' : ''}`}
      aria-label="Experience timeline"
    >
      <div ref={pinRef} className="timeline-zoom-pin">
        {!reducedMotion ? (
          <p className="timeline-zoom-hint">Scroll to zoom through years</p>
        ) : null}
        <div className="timeline-zoom-rail-line" aria-hidden />
        <ol className="timeline-zoom-rail" aria-label="Timeline years">
          {timelineFrames.map((frame, index) => (
            <li
              key={frame.year}
              className={`timeline-zoom-rail-item${index === activeIndex ? ' is-active' : ''}`}
            >
              {frame.year}
            </li>
          ))}
        </ol>

        <div className="timeline-zoom-stage">
          <TimelineLayer
            ref={baseLayerRef}
            frame={LAYER_SHELL_FRAME}
            className="timeline-zoom-layer--base"
          />
          <TimelineLayer
            ref={incomingLayerRef}
            frame={LAYER_SHELL_FRAME}
            className="timeline-zoom-layer--incoming"
          />
          <div className="timeline-zoom-vignette" aria-hidden />
        </div>

        <div className="timeline-zoom-ui">
          <p ref={yearRef} className="timeline-zoom-year" data-timeline-year />
          <p ref={captionRef} className="timeline-zoom-caption" data-timeline-caption />
        </div>
      </div>

      {reducedMotion ? (
        <ul className="timeline-zoom-static-list">
          {timelineFrames.map((frame) => (
            <li key={frame.year} className="timeline-zoom-static-item">
              <TimelineLayer frame={frame} />
              <p className="timeline-zoom-year">{frame.year}</p>
              <p className="timeline-zoom-caption">{frame.caption}</p>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  )
}

function applyFrameToLayer(layer: LayerElements, frame: TimelineFrame) {
  layer.root.style.setProperty('--frame-color', frame.color)
  layer.root.classList.toggle('has-image', Boolean(frame.image))
  layer.label.textContent = `Photo · ${frame.year}`

  if (frame.image) {
    layer.image.src = frame.image
    layer.image.alt = frame.caption
    layer.image.classList.remove('is-hidden')
  } else {
    layer.image.removeAttribute('src')
    layer.image.classList.add('is-hidden')
  }
}
