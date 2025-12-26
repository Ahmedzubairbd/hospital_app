"use client";

import * as React from "react";
import { motion } from "framer-motion";

/**
 * MotionPage wraps its children with a subtle entrance animation.
 * Keep this lightweight so it doesn't interfere with page-level motion.
 */
export default function MotionPage({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      {children}
    </motion.section>
  );
}
