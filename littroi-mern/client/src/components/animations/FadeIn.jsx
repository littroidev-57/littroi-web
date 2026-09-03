import React from "react";
import { motion, useReducedMotion } from "framer-motion";

export function FadeIn({
  children,
  delay = 0,
  duration = 0.6,
  direction = "up", // "up", "down", "left", "right", "none"
  distance = 30,
  className = "",
  once = true,
  ...props
}) {
  const shouldReduceMotion = useReducedMotion();

  const directionOffsets = {
    up: { y: distance, x: 0 },
    down: { y: -distance, x: 0 },
    left: { x: distance, y: 0 },
    right: { x: -distance, y: 0 },
    none: { x: 0, y: 0 },
  };

  const offset = shouldReduceMotion ? { x: 0, y: 0 } : directionOffsets[direction] || { x: 0, y: 0 };

  return (
    <motion.div
      initial={{ opacity: 0, ...offset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once, margin: "-60px" }}
      transition={{
        duration: shouldReduceMotion ? 0.2 : duration,
        delay,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}
