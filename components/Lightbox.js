"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";

// Self-contained lightbox: fullscreen image viewer with left/right
// navigation, swipe support, keyboard arrows/escape, and click-to-zoom
// (toggle) + scroll-to-zoom on desktop. No external dependency required.
export default function Lightbox({ images, initialIndex = 0, alt, onClose }) {
  const [index, setIndex] = useState(initialIndex);
  const [zoomed, setZoomed] = useState(false);
  const [origin, setOrigin] = useState("center center");
  const touchStartX = useRef(null);
  const containerRef = useRef(null);

  const goToNext = useCallback(() => {
    setZoomed(false);
    setIndex((i) => (i + 1) % images.length);
  }, [images.length]);

  const goToPrev = useCallback(() => {
    setZoomed(false);
    setIndex((i) => (i - 1 + images.length) % images.length);
  }, [images.length]);

  // Lock page scroll while open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Keyboard controls
  useEffect(() => {
    function handleKey(e) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") goToNext();
      if (e.key === "ArrowLeft") goToPrev();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose, goToNext, goToPrev]);

  function handleTouchStart(e) {
    touchStartX.current = e.touches[0].clientX;
  }
  function handleTouchEnd(e) {
    if (touchStartX.current === null || zoomed) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 50) {
      delta > 0 ? goToPrev() : goToNext();
    }
    touchStartX.current = null;
  }

  // Click-to-zoom: sets the zoom origin to where the user clicked, so it
  // zooms toward the point of interest rather than always the center.
  function handleImageClick(e) {
    if (!zoomed) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setOrigin(`${x}% ${y}%`);
    }
    setZoomed((z) => !z);
  }

  // Scroll wheel zoom (desktop) — toggles zoomed state based on scroll
  // direction, using the cursor position as the zoom origin.
  function handleWheel(e) {
    e.preventDefault();
    if (e.deltaY < 0) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setOrigin(`${x}% ${y}%`);
      setZoomed(true);
    } else {
      setZoomed(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label="Image viewer"
    >
      {/* Close button */}
      <button
        onClick={onClose}
        aria-label="Close image viewer"
        className="absolute top-4 right-4 md:top-6 md:right-6 z-20 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
        </svg>
      </button>

      {/* Counter */}
      {images.length > 1 && (
        <div className="absolute top-4 left-4 md:top-6 md:left-6 z-20 text-white/70 text-xs uppercase tracking-widest2">
          {index + 1} / {images.length}
        </div>
      )}

      {/* Zoom hint (desktop only) */}
      <div className="hidden md:block absolute bottom-6 left-1/2 -translate-x-1/2 z-20 text-white/50 text-xs uppercase tracking-widest2">
        {zoomed ? "Click or scroll to zoom out" : "Click or scroll to zoom in"}
      </div>

      {/* Prev/Next arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={goToPrev}
            aria-label="Previous image"
            className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            onClick={goToNext}
            aria-label="Next image"
            className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </>
      )}

      {/* Image stage */}
      <div
        ref={containerRef}
        className="relative w-full h-full flex items-center justify-center overflow-hidden px-4 py-16 md:px-20"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onWheel={handleWheel}
      >
        <div
          onClick={handleImageClick}
          className={`relative w-full h-full max-w-3xl transition-transform duration-300 ease-out ${
            zoomed ? "cursor-zoom-out" : "cursor-zoom-in"
          }`}
          style={{
            transform: zoomed ? "scale(2.2)" : "scale(1)",
            transformOrigin: origin,
          }}
        >
          <Image
            src={images[index]}
            alt={`${alt} ${index + 1}`}
            fill
            sizes="100vw"
            className="object-contain select-none"
            draggable={false}
            priority
          />
        </div>
      </div>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div className="absolute bottom-16 md:bottom-16 left-1/2 -translate-x-1/2 z-20 flex gap-2 px-4 max-w-full overflow-x-auto">
          {images.map((img, i) => (
            <button
              key={img}
              onClick={() => {
                setZoomed(false);
                setIndex(i);
              }}
              className={`relative w-12 h-14 md:w-14 md:h-16 shrink-0 border-2 transition-colors ${
                i === index ? "border-white" : "border-white/20 hover:border-white/50"
              }`}
            >
              <Image
                src={img}
                alt={`${alt} thumbnail ${i + 1}`}
                fill
                sizes="60px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
