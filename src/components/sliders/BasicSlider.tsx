"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type SliderItem = { imageUrl: string; title?: string; link?: string };

const FALLBACK_SLIDES: SliderItem[] = [
  { imageUrl: "/assets/SHR01117.jpg" },
  { imageUrl: "/assets/SHR01093.jpg" },
  { imageUrl: "/assets/SHR01055.jpg" },
];

const AUTOPLAY_MS = 3000;
const SLIDE_DURATION_MS = 250;

function normalizeSlides(input: unknown): SliderItem[] {
  if (!Array.isArray(input)) return [];
  const normalized: SliderItem[] = [];
  for (const item of input) {
    if (!item || typeof item !== "object") continue;
    const imageUrl =
      typeof (item as { imageUrl?: unknown }).imageUrl === "string"
        ? (item as { imageUrl: string }).imageUrl.trim()
        : "";
    if (!imageUrl) continue;
    const title =
      typeof (item as { title?: unknown }).title === "string"
        ? (item as { title: string }).title.trim()
        : "";
    const link =
      typeof (item as { link?: unknown }).link === "string"
        ? (item as { link: string }).link.trim()
        : "";
    normalized.push({
      imageUrl,
      title: title || undefined,
      link: link || undefined,
    });
  }
  return normalized;
}

const BasicSlider = () => {
  const [slides, setSlides] = useState<SliderItem[]>([]);
  const [hasRemoteConfig, setHasRemoteConfig] = useState(false);
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const res = await fetch(
          "/api/cms/pages?" + new URLSearchParams({ q: "home-sliders" }),
          { cache: "no-store" }
        );
        if (!res.ok) throw new Error("Failed to load slides");
        const json = await res.json();
        const page = Array.isArray(json)
          ? json.find(
              (p: any) => p?.slug === "home-sliders" && (p.published ?? true)
            )
          : null;
        if (!active) return;
        if (!page) {
          setHasRemoteConfig(false);
          setSlides([]);
          return;
        }
        setHasRemoteConfig(true);
        if (typeof page.body === "string" && page.body) {
          try {
            const parsed = JSON.parse(page.body);
            setSlides(normalizeSlides(parsed));
          } catch {
            setSlides([]);
          }
        } else {
          setSlides([]);
        }
      } catch {
        if (!active) return;
        setHasRemoteConfig(false);
        setSlides([]);
      }
    }
    void load();
    return () => {
      active = false;
    };
  }, []);

  const activeSlides = hasRemoteConfig ? slides : FALLBACK_SLIDES;
  const slideCount = activeSlides.length;

  useEffect(() => {
    if (slideCount === 0) {
      setIndex(0);
      return;
    }
    if (index >= slideCount) {
      setIndex(0);
    }
  }, [index, slideCount]);

  const next = useCallback(() => {
    if (slideCount <= 1) return;
    setDirection(1);
    setIndex((i) => (i + 1) % slideCount);
  }, [slideCount]);

  const prev = useCallback(() => {
    if (slideCount <= 1) return;
    setDirection(-1);
    setIndex((i) => (i - 1 + slideCount) % slideCount);
  }, [slideCount]);

  useEffect(() => {
    if (slideCount <= 1) return;
    const id = setInterval(next, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [next, slideCount]);

  const variants = useMemo(
    () => ({
      enter: (d: 1 | -1) => ({ x: d * 50, opacity: 0 }),
      center: { x: 0, opacity: 1 },
      exit: (d: 1 | -1) => ({ x: -d * 50, opacity: 0 }),
    }),
    []
  );

  if (slideCount === 0) return null;

  const current = activeSlides[index] ?? activeSlides[0];
  const isExternal = Boolean(current.link?.startsWith("http"));
  const slideContent = current.title ? (
    <div
      style={{
        position: "absolute",
        inset: "auto 0 0 0",
        padding: "18px 20px",
        background:
          "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.6) 100%)",
        color: "#fff",
        fontSize: 18,
        fontWeight: 600,
        letterSpacing: 0.2,
      }}
    >
      {current.title}
    </div>
  ) : null;

  return (
    <div
      style={{
        width: "100%",
        aspectRatio: 3 / 1,
        position: "relative",
        overflow: "hidden",
        borderRadius: 10,
      }}
    >
      <AnimatePresence custom={direction} mode="popLayout">
        {current.link ? (
          <motion.a
            key={index}
            custom={direction}
            initial="enter"
            animate="center"
            exit="exit"
            variants={variants}
            transition={{ duration: SLIDE_DURATION_MS / 1000 }}
            href={current.link}
            target={isExternal ? "_blank" : undefined}
            rel={isExternal ? "noreferrer" : undefined}
            aria-label={current.title || "Home slide"}
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `url(${current.imageUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              borderRadius: 10,
              textDecoration: "none",
              zIndex: 0,
            }}
          >
            {slideContent}
          </motion.a>
        ) : (
          <motion.div
            key={index}
            custom={direction}
            initial="enter"
            animate="center"
            exit="exit"
            variants={variants}
            transition={{ duration: SLIDE_DURATION_MS / 1000 }}
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `url(${current.imageUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              borderRadius: 10,
              zIndex: 0,
            }}
          >
            {slideContent}
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={prev}
        aria-label="Previous slide"
        style={{
          position: "absolute",
          top: "50%",
          left: 16,
          transform: "translateY(-50%)",
          background: "rgba(5, 5, 5, 0.6)",
          border: "none",
          borderRadius: 4,
          padding: "8px 12px",
          cursor: "pointer",
          color: "#fff",
          zIndex: 1,
        }}
      >
        ‹
      </button>

      <button
        type="button"
        onClick={next}
        aria-label="Next slide"
        style={{
          position: "absolute",
          top: "50%",
          right: 16,
          transform: "translateY(-50%)",
          background: "rgba(5, 5, 5, 0.6)",
          border: "none",
          borderRadius: 4,
          padding: "8px 12px",
          cursor: "pointer",
          color: "#fff",
          zIndex: 1,
        }}
      >
        ›
      </button>
    </div>
  );
};

export default BasicSlider;
