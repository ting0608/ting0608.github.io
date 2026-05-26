import { useEffect, useState } from "react";
import { CollageFloatingText } from "./CollageFloatingText";
import { carouselSlides } from "../data/carousel";

const INTERVAL_MS = 10000;

export function ImageCarousel() {
  const slides = carouselSlides;
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;

    const timer = window.setInterval(() => {
      setActiveIndex((i) => (i + 1) % slides.length);
    }, INTERVAL_MS);

    return () => window.clearInterval(timer);
  }, [slides.length]);

  return (
    <div
      className="collage-carousel"
      role="region"
      aria-label="Photo collage carousel"
    >
      <div className="collage-stage">
        <CollageFloatingText layout={slides[activeIndex].layout} />
        <div className="collage-board">
          {slides.map((slide, index) => (
            <div
              key={slide.layout}
              className={`collage-slide collage-layout-${slide.layout}${
                index === activeIndex ? " is-active" : ""
              }`}
              aria-hidden={index !== activeIndex}
            >
              {slide.images.map((image) => (
                <figure key={image.src} className="collage-cell">
                  <img src={image.src} alt={image.alt} loading="lazy" />
                </figure>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="carousel-dots" role="tablist" aria-label="Collage sets">
        {slides.map((slide, index) => (
          <button
            key={slide.layout}
            type="button"
            role="tab"
            aria-selected={index === activeIndex}
            aria-label={`Show collage set ${index + 1}`}
            className={index === activeIndex ? "is-active" : undefined}
            onClick={() => setActiveIndex(index)}
          />
        ))}
      </div>
    </div>
  );
}
