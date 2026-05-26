import { useCallback, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import roadmapBg from "../assets/images/timeline/roadmap.svg";
import { getLenis } from "../hooks/useSmoothScroll";
import { trackButtonClick } from "../lib/analytics";
import { roadmapStops } from "../data/roadmapStops";
import "./RoadmapSection.css";

gsap.registerPlugin(ScrollTrigger);

const SCROLL_PER_STOP_VH = 100;
const FOCUS_SCALE = 1.08;
const MOBILE_BREAKPOINT_PX = 720;

function isMobileViewport() {
  return window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT_PX}px)`).matches;
}

function getFocusScale() {
  return isMobileViewport() ? 1.03 : FOCUS_SCALE;
}
/** Matches `roadmap.svg` viewBox for cover-sized artboard */
const ROADMAP_ASPECT = 1455 / 1081;
/** Hold full-road view at the start of the first stop before zooming in */
const INTRO_HOLD_RATIO = 0.28;
/** Extra timeline + scroll after 2026 so Work does not appear too early */
const END_HOLD_DURATION = 1;

function getTimelineDuration() {
  return roadmapStops.length + END_HOLD_DURATION;
}

function getActiveIndexFromTimeline(t: number) {
  if (t < INTRO_HOLD_RATIO) return 0;
  if (t < 1) return 0;
  if (t < 2) return 1;
  if (t < 3) return 2;
  if (t < 4) return 3;
  return 4;
}

/** Scroll position (timeline units) that best frames each stop when clicked. */
function getTimelineTimeForStop(index: number) {
  if (index === 0) {
    return INTRO_HOLD_RATIO + (1 - INTRO_HOLD_RATIO) * 0.65;
  }
  if (index === roadmapStops.length - 1) {
    return index + 0.45;
  }
  return index + 0.42;
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function getPanForStop(
  stop: (typeof roadmapStops)[number],
  index: number,
  stageWidth: number,
  stageHeight: number,
  viewWidth: number,
  viewHeight: number,
  stopCount: number,
) {
  const mobile = isMobileViewport();
  const scale = getFocusScale();
  const stopX = (stop.x / 100) * stageWidth;
  const stopY = (stop.y / 100) * stageHeight;

  // Edge stops: bias focus inward so we pan less and keep the road in frame
  const edgeT = stopCount > 1 ? index / (stopCount - 1) : 0.5;
  const focusX =
    viewWidth * (mobile ? 0.38 + 0.24 * edgeT : 0.36 + 0.28 * edgeT);
  const focusY = viewHeight * (mobile ? 0.4 : 0.5);

  let x = -(stopX - stageWidth / 2) * scale + (focusX - viewWidth / 2);
  let y = -(stopY - stageHeight / 2) * scale + (focusY - viewHeight / 2);

  const maxX = Math.max(0, (stageWidth * scale - viewWidth) / 2);
  const maxY = Math.max(0, (stageHeight * scale - viewHeight) / 2);

  if (maxX > 0) x = clamp(x, -maxX, maxX);
  else x = 0;

  if (maxY > 0) y = clamp(y, -maxY, maxY);
  else y = 0;

  return { x, y, scale };
}

export function RoadmapSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const stopRefs = useRef<(HTMLElement | null)[]>([]);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);
  const staticItemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  const scrollToStop = useCallback(
    (index: number) => {
      trackButtonClick(`roadmap_year_${roadmapStops[index].year}`)
      setActiveIndex(index);

      if (reducedMotion) {
        staticItemRefs.current[index]?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
        return;
      }

      const st = scrollTriggerRef.current;
      if (!st) return;

      const timelineDuration = getTimelineDuration();
      const progress = getTimelineTimeForStop(index) / timelineDuration;
      const y = st.start + progress * (st.end - st.start);

      const lenis = getLenis();
      if (lenis) {
        lenis.scrollTo(y, { duration: 1.1 });
        return;
      }

      window.scrollTo({ top: y, behavior: "smooth" });
    },
    [reducedMotion],
  );

  useLayoutEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    setReducedMotion(reduced);

    const section = sectionRef.current;
    const pin = pinRef.current;
    const stage = stageRef.current;
    if (!section || !pin || !stage || reduced) return;

    const stops = stopRefs.current.filter(Boolean) as HTMLElement[];
    const cards = cardRefs.current.filter(Boolean) as HTMLElement[];
    if (stops.length !== roadmapStops.length) return;

    const ctx = gsap.context(() => {
      const timelineDuration = getTimelineDuration();
      const scrollDistance =
        (window.innerHeight * timelineDuration * SCROLL_PER_STOP_VH) / 100;

      gsap.set(stage, { x: 0, y: 0, scale: 1 });
      gsap.set(stops, { scale: 0.72, opacity: 0.45 });
      gsap.set(cards, { opacity: 0, y: 12, scale: 0.92 });

      const measure = () => {
        const stageRect = stage.getBoundingClientRect();
        return roadmapStops.map((stop, index) =>
          getPanForStop(
            stop,
            index,
            stageRect.width,
            stageRect.height,
            pin.clientWidth,
            pin.clientHeight,
            roadmapStops.length,
          ),
        );
      };

      let pans = measure();

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: `+=${scrollDistance}`,
          pin,
          scrub: 0.85,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          onUpdate(self) {
            const t = self.progress * timelineDuration;
            setActiveIndex(getActiveIndexFromTimeline(t));
          },
        },
      });

      scrollTriggerRef.current = tl.scrollTrigger ?? null;

      const focusStop = (index: number, position: number, duration = 1) => {
        const pan = pans[index];

        tl.to(
          stage,
          {
            x: pan.x,
            y: pan.y,
            scale: pan.scale,
            duration,
            ease: "power2.inOut",
          },
          position,
        );

        stops.forEach((stopEl, stopIndex) => {
          const isActive = stopIndex === index;
          tl.to(
            stopEl,
            {
              scale: isActive ? 1 : 0.68,
              opacity: isActive ? 1 : 0.38,
              duration: duration * 0.55,
              ease: "power2.out",
            },
            position,
          );
        });

        cards.forEach((cardEl, cardIndex) => {
          const isActive = cardIndex === index;
          tl.to(
            cardEl,
            {
              opacity: isActive ? 1 : 0,
              y: isActive ? 0 : 10,
              scale: isActive ? 1 : 0.9,
              duration: duration * 0.45,
              ease: "power2.out",
            },
            position + duration * 0.12,
          );
        });
      };

      // First segment: show the full road, then ease into 2022 without clipping
      tl.to(
        stage,
        { x: 0, y: 0, scale: 1, duration: INTRO_HOLD_RATIO, ease: "none" },
        0,
      );
      focusStop(0, INTRO_HOLD_RATIO, 1 - INTRO_HOLD_RATIO);

      roadmapStops.forEach((_stop, index) => {
        if (index === 0) return;
        focusStop(index, index);
      });

      const lastPan = pans[roadmapStops.length - 1];
      tl.to(
        stage,
        {
          x: lastPan.x,
          y: lastPan.y,
          scale: lastPan.scale,
          duration: END_HOLD_DURATION,
          ease: "none",
        },
        roadmapStops.length - 1 + 1,
      );
      tl.to(
        cards[roadmapStops.length - 1],
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: END_HOLD_DURATION,
          ease: "none",
        },
        roadmapStops.length - 1 + 1,
      );
      tl.to(
        stops[roadmapStops.length - 1],
        { scale: 1, opacity: 1, duration: END_HOLD_DURATION, ease: "none" },
        roadmapStops.length - 1 + 1,
      );

      const onResize = () => {
        pans = measure();
        ScrollTrigger.refresh();
      };
      window.addEventListener("resize", onResize);
      window.addEventListener("orientationchange", onResize);

      return () => {
        window.removeEventListener("resize", onResize);
        window.removeEventListener("orientationchange", onResize);
      };
    }, section);

    return () => {
      scrollTriggerRef.current = null;
      ctx.revert();
    };
  }, []);

  const sectionHeight = reducedMotion
    ? undefined
    : `${getTimelineDuration() * SCROLL_PER_STOP_VH}vh`;

  return (
    <section
      ref={sectionRef}
      id="roadmap"
      className={`roadmap-section${reducedMotion ? " roadmap-section--static" : ""}`}
      style={sectionHeight ? { height: sectionHeight } : undefined}
      aria-label="Career roadmap"
    >
      {reducedMotion ? (
        <div className="section-inner">
          <h2>Roadmap</h2>
          <ul className="roadmap-static-list">
            {roadmapStops.map((stop, index) => (
              <li
                key={stop.year}
                ref={(el) => {
                  staticItemRefs.current[index] = el;
                }}
                className="roadmap-static-item"
              >
                <button
                  type="button"
                  className="roadmap-static-year"
                  onClick={() => scrollToStop(index)}
                  aria-label={`View ${stop.year}`}
                >
                  {stop.year}
                </button>
                <div>
                  <img src={stop.image} alt="" />
                  <h3>{stop.title}</h3>
                  <p>{stop.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div ref={pinRef} className="roadmap-pin">
          <div className="roadmap-ui">
            <h2 className="roadmap-heading">Roadmap</h2>
            <ol className="roadmap-rail" aria-label="Years">
              {roadmapStops.map((stop, index) => (
                <li key={stop.year}>
                  <button
                    type="button"
                    className={`roadmap-rail-item${index === activeIndex ? " is-active" : ""}`}
                    onClick={() => scrollToStop(index)}
                    aria-label={`Go to ${stop.year}`}
                    aria-current={index === activeIndex ? "true" : undefined}
                  >
                    {stop.year}
                  </button>
                </li>
              ))}
            </ol>
            <p className="roadmap-hint">Scroll to follow my journey</p>

            <div className="roadmap-mobile-detail" aria-live="polite">
              <img src={roadmapStops[activeIndex].image} alt="" />
              <div className="roadmap-mobile-detail-body">
                <h3>
                  {roadmapStops[activeIndex].year}.{" "}
                  {roadmapStops[activeIndex].title}
                </h3>
                <p>{roadmapStops[activeIndex].description}</p>
              </div>
            </div>
          </div>

          <div className="roadmap-viewport">
            <div
              ref={stageRef}
              className="roadmap-stage"
              style={
                {
                  "--roadmap-aspect": ROADMAP_ASPECT,
                } as React.CSSProperties
              }
            >
              <img
                className="roadmap-bg"
                src={roadmapBg}
                alt=""
                draggable={false}
              />
              <div className="roadmap-vignette" aria-hidden />
              {roadmapStops.map((stop, index) => (
                <article
                  key={stop.year}
                  ref={(el) => {
                    stopRefs.current[index] = el;
                  }}
                  className="roadmap-stop"
                  data-side={stop.side}
                  style={
                    {
                      "--stop-x": `${stop.x}%`,
                      "--stop-y": `${stop.y}%`,
                    } as React.CSSProperties
                  }
                >
                  <div
                    ref={(el) => {
                      cardRefs.current[index] = el;
                    }}
                    className="roadmap-stop-card"
                  >
                    <img src={stop.image} alt="" />
                    <h3>
                      {stop.year}. {stop.title}
                    </h3>
                    <p>{stop.description}</p>
                  </div>
                  <span className="roadmap-stop-connector" aria-hidden />
                  <button
                    type="button"
                    className="roadmap-stop-marker"
                    onClick={() => scrollToStop(index)}
                    aria-label={`Go to ${stop.year}: ${stop.title}`}
                    aria-current={index === activeIndex ? "true" : undefined}
                  >
                    {stop.year}
                  </button>
                  <span className="roadmap-stop-pin" aria-hidden />
                </article>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
