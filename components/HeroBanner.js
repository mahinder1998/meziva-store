"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useCallback, useRef } from "react";

// 👇 Add/remove slides here. Each slide needs a desktop + mobile image.
// Text fields (eyebrow, heading, subheading, ctaText) are optional — leave
// them out entirely for a clean image-only slide.
//
// Every slide is clickable and takes the customer to `link` (defaults to
// /shop if not set).
//
// IMPORTANT: set desktopWidth/desktopHeight and mobileWidth/mobileHeight to
// match your actual image file dimensions (in pixels) — this lets the image
// render at its true, uncropped aspect ratio instead of being force-cropped.
const slides = [
  {
    id: 1,
    desktopImage: "/images/banner-desk.png",
    desktopWidth: 1920,
    desktopHeight: 800,
    mobileImage: "/images/banner-mobile.png",
    mobileWidth: 750,
    mobileHeight: 1000,
    alt: "Meziva Hydrating Lip Balm - SPF 30 Protection",
    link: "/shop",
  },
  // {
  //   id: 2,
  //   desktopImage: "/images/hero/hero-desktop-2.jpg",
  //   desktopWidth: 1920,
  //   desktopHeight: 800,
  //   mobileImage: "/images/hero/hero-mobile-2.jpg",
  //   mobileWidth: 750,
  //   mobileHeight: 1000,
  //   alt: "Meziva Berry Blast Lip Balm",
  //   link: "/shop",
  //   eyebrow: "Just Launched",
  //   heading: "Berry Blast has arrived",
  //   subheading: "Deeply nourishing, naturally tinted",
  //   ctaText: "Explore",
  // },
];

const AUTOPLAY_MS = 5000;

export default function HeroBanner() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const hasMultipleSlides = slides.length > 1;
  const touchStartX = useRef(null);

  const goToNext = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
  }, []);

  const goToPrev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    if (!hasMultipleSlides || isPaused) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    const timer = setInterval(goToNext, AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [hasMultipleSlides, isPaused, goToNext]);

  useEffect(() => {
    if (!hasMultipleSlides) return;
    const handleKey = (e) => {
      if (e.key === "ArrowRight") goToNext();
      if (e.key === "ArrowLeft") goToPrev();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [hasMultipleSlides, goToNext, goToPrev]);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 50) {
      delta > 0 ? goToPrev() : goToNext();
    }
    touchStartX.current = null;
  };

  if (!slides.length) return null;

  return (
    <section
      className="relative w-full overflow-hidden bg-cream"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={(e) => {
        setIsPaused(true);
        handleTouchStart(e);
      }}
      onTouchEnd={(e) => {
        handleTouchEnd(e);
        setIsPaused(false);
      }}
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured products"
    >
      {/* Grid stacking instead of position:absolute — each slide occupies the
          same grid cell, so slides layer on top of each other for the
          crossfade without forcing a fixed height or cropping the image. */}
      <div className="relative w-full grid">
        {slides.map((slide, index) => {
          const hasContent = Boolean(slide.heading);
          const href = slide.link || "/shop";

          return (
            <div
              key={slide.id}
              className={`col-start-1 row-start-1 transition-opacity duration-700 ease-in-out ${
                index === current ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
              }`}
              aria-hidden={index !== current}
            >
              {/* Entire slide is one clickable link — image, overlay and
                  text all navigate to `href` when tapped/clicked. */}
              <Link href={href} className="relative w-full block group">
                {/* Desktop Image — natural aspect ratio, no cropping */}
                <Image
                  src={slide.desktopImage}
                  alt={slide.alt || "Meziva Beauty"}
                  width={slide.desktopWidth}
                  height={slide.desktopHeight}
                  priority={index === 0}
                  sizes="100vw"
                  className="hidden md:block w-full h-auto"
                />

                {/* Mobile Image — natural aspect ratio, no cropping */}
                <Image
                  src={slide.mobileImage}
                  alt={slide.alt || "Meziva Beauty"}
                  width={slide.mobileWidth}
                  height={slide.mobileHeight}
                  priority={index === 0}
                  sizes="100vw"
                  className="block md:hidden w-full h-auto"
                />

                {/* Gradient overlay — only needed when there's text to read over the image */}
                {hasContent && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent" />
                )}

                {/* Content — fully skipped if slide has no heading (image-only slide) */}
                {hasContent && (
                  <div className="absolute inset-0 flex items-end md:items-center pb-16 md:pb-0">
                    <div className="container-x">
                      <div className="max-w-lg text-white">
                        {slide.eyebrow && (
                          <p className="text-xs md:text-sm uppercase tracking-widest3 text-white/80 mb-3">
                            {slide.eyebrow}
                          </p>
                        )}
                        <h1 className="font-serif text-4xl md:text-6xl leading-[1.1] mb-4">
                          {slide.heading}
                        </h1>
                        {slide.subheading && (
                          <p className="text-sm md:text-base tracking-widest2 uppercase text-white/85 mb-8">
                            {slide.subheading}
                          </p>
                        )}
                        {slide.ctaText && (
                          <span className="inline-block border border-white px-8 py-3 text-sm uppercase tracking-widest2 text-white group-hover:bg-wine group-hover:border-wine transition-colors duration-300">
                            {slide.ctaText}
                          </span>
                        )}

                        <p className="mt-5 text-[11px] md:text-xs tracking-widest2 uppercase text-white/70">
                          Free Shipping · Cash on Delivery · 7-Day Returns
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </Link>
            </div>
          );
        })}

        {/* Prev/Next Arrows - only if multiple slides */}
        {hasMultipleSlides && (
          <>
            <button
              onClick={goToPrev}
              aria-label="Previous slide"
              className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-wine hover:text-white text-charcoal w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              onClick={goToNext}
              aria-label="Next slide"
              className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-wine hover:text-white text-charcoal w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </>
        )}

        {/* Dots - only if multiple slides */}
        {hasMultipleSlides && (
          <div
            className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2.5"
            role="tablist"
            aria-label="Slide navigation"
          >
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrent(index)}
                aria-label={`Go to slide ${index + 1}`}
                aria-selected={index === current}
                role="tab"
                className={`h-[3px] rounded-full transition-all duration-300 ${
                  index === current
                    ? "w-8 bg-white"
                    : "w-4 bg-white/50 hover:bg-white/80"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
