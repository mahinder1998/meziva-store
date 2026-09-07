"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";

// 👇 Add/remove slides here. Each slide needs a desktop + mobile image.
// If you only add ONE slide, the slider auto-hides arrows/dots.
const slides = [
  {
    id: 1,
    desktopImage: "/images/hero/hero-desktop-1.jpg",
    mobileImage: "/images/hero/hero-mobile-1.jpg",
    alt: "Meziva Hydrating Lip Balm - SPF 30 Protection",
    heading: "Lip Care Made for Indian Summers",
    subheading: "SPF 30 | Mango Butter | Vitamin E",
    ctaText: "Shop Now",
    ctaLink: "/shop",
  },
  {
    id: 2,
    desktopImage: "/images/hero/hero-desktop-2.jpg",
    mobileImage: "/images/hero/hero-mobile-2.jpg",
    alt: "Meziva Berry Blast Lip Balm",
    heading: "New: Berry Blast Flavour",
    subheading: "Deeply Nourishing. Naturally Tinted.",
    ctaText: "Explore",
    ctaLink: "/shop",
  },
];

export default function HeroBanner() {
  const [current, setCurrent] = useState(0);
  const hasMultipleSlides = slides.length > 1;

  const goToNext = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
  }, []);

  const goToPrev = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  // Auto-play only if more than 1 slide
  useEffect(() => {
    if (!hasMultipleSlides) return;
    const timer = setInterval(goToNext, 5000);
    return () => clearInterval(timer);
  }, [hasMultipleSlides, goToNext]);

  if (!slides.length) return null;

  return (
    <section className="relative w-full overflow-hidden bg-cream">
      <div className="relative w-full h-[70vh] md:h-[85vh]">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              index === current ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            {/* Desktop Image */}
            <div className="hidden md:block relative w-full h-full">
              <Image
                src={slide.desktopImage}
                alt={slide.alt}
                fill
                priority={index === 0}
                sizes="100vw"
                className="object-cover"
              />
            </div>

            {/* Mobile Image */}
            <div className="block md:hidden relative w-full h-full">
              <Image
                src={slide.mobileImage}
                alt={slide.alt}
                fill
                priority={index === 0}
                sizes="100vw"
                className="object-cover"
              />
            </div>

            {/* Overlay content */}
            <div className="absolute inset-0 bg-black/20 flex items-center">
              <div className="container-x">
                <div className="max-w-md text-white">
                  <h1 className="text-3xl md:text-5xl font-semibold mb-3">
                    {slide.heading}
                  </h1>
                  <p className="text-sm md:text-lg mb-6 opacity-90">
                    {slide.subheading}
                  </p>
                  <Link
                    href={slide.ctaLink}
                    className="inline-block bg-white text-charcoal px-6 py-3 text-sm uppercase tracking-widest2 hover:bg-gold hover:text-white transition-colors"
                  >
                    {slide.ctaText}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Prev/Next Arrows - only if multiple slides */}
        {hasMultipleSlides && (
          <>
            <button
              onClick={goToPrev}
              aria-label="Previous slide"
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white text-charcoal w-9 h-9 rounded-full flex items-center justify-center transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M15 18l-6-6 6-6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              onClick={goToNext}
              aria-label="Next slide"
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white text-charcoal w-9 h-9 rounded-full flex items-center justify-center transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M9 6l6 6-6 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </>
        )}

        {/* Dots - only if multiple slides */}
        {hasMultipleSlides && (
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrent(index)}
                aria-label={`Go to slide ${index + 1}`}
                className={`h-2 rounded-full transition-all ${
                  index === current
                    ? "w-6 bg-white"
                    : "w-2 bg-white/50 hover:bg-white/80"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}