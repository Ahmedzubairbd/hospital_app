"use client";
import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Images
const images = [
  "/assets/SHR01117.jpg",
  "/assets/SHR01093.jpg",
  "/assets/SHR01055.jpg",
];

const AUTOPLAY_MS = 3000;
const SLIDE_DURATION_MS = 250;

const BasicSlider = () => {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);

  const next = () => {
    setDirection(1);
    setIndex((i) => (i + 1) % images.length);
  };

  const prev = () => {
    setDirection(-1);
    setIndex((i) => (i - 1 + images.length) % images.length);
  };

  useEffect(() => {
    const id = setInterval(next, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, []);

  const variants = useMemo(
    () => ({
      enter: (d: 1 | -1) => ({ x: d * 50, opacity: 0 }),
      center: { x: 0, opacity: 1 },
      exit: (d: 1 | -1) => ({ x: -d * 50, opacity: 0 }),
    }),
    [],
  );

  return (
    <div
      style={{
        width: "100%",
        aspectRatio: 3 / 1,
        position: "relative",
        overflow: "hidden",
        borderRadius: 10,
        // backgroundColor: "rgba(0,0,0,0.33)",
      }}
    >
      <AnimatePresence custom={direction} mode="popLayout">
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
            backgroundImage: `url(${images[index]})`,
            backgroundSize: "cover",
            // backgroundPosition: "center",
            // backgroundAttachment: "fixed",
            borderRadius: 10,
          }}
        />
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
          // cursor: "pointer",
        }}
      >
        ›
      </button>
    </div>
  );
};

export default BasicSlider;
