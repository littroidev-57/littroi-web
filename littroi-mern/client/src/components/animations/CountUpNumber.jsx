import React, { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

/**
 * High-performance Number Count-Up Transition Component
 * Inspired by Apple, Stripe, and Linear interactive metrics
 */
export function CountUpNumber({
  value,
  duration = 2.2,
  delay = 0,
  className = ""
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const [displayValue, setDisplayValue] = useState(() => {
    // Initial zero state with preserved prefix/suffix
    const stringVal = String(value).trim();
    const match = stringVal.match(/^([^0-9.]*)([0-9,.]+)(.*)$/);
    if (!match) return "0";
    return `${match[1] || ""}0${match[3] || ""}`;
  });

  useEffect(() => {
    if (!isInView) return;

    const stringVal = String(value).trim();
    const match = stringVal.match(/^([^0-9.]*)([0-9,.]+)(.*)$/);

    if (!match) {
      setDisplayValue(stringVal);
      return;
    }

    const prefix = match[1] || "";
    const numStr = match[2] || "0";
    const suffix = match[3] || "";

    const hasComma = numStr.includes(",");
    const isDecimal = numStr.includes(".");
    const decimalPlaces = isDecimal ? numStr.split(".")[1].length : 0;
    const targetNum = parseFloat(numStr.replace(/,/g, "")) || 0;

    let startTime = null;
    let animationFrameId = null;

    const timeoutId = setTimeout(() => {
      const step = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);

        // Smooth cubic bezier easing: cubic-bezier(0.16, 1, 0.3, 1)
        const t = progress;
        // Approximation of easeOutExpo for ultra smooth landing
        const easeProgress = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
        const currentVal = targetNum * easeProgress;

        let formattedNum = isDecimal
          ? currentVal.toFixed(decimalPlaces)
          : Math.floor(currentVal).toString();

        if (hasComma) {
          const parts = formattedNum.split(".");
          parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          formattedNum = parts.join(".");
        }

        setDisplayValue(`${prefix}${formattedNum}${suffix}`);

        if (progress < 1) {
          animationFrameId = requestAnimationFrame(step);
        } else {
          setDisplayValue(stringVal);
        }
      };

      animationFrameId = requestAnimationFrame(step);
    }, delay * 1000);

    return () => {
      clearTimeout(timeoutId);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [isInView, value, duration, delay]);

  return (
    <span ref={ref} className={`inline-block tabular-nums ${className}`}>
      {displayValue}
    </span>
  );
}

export default CountUpNumber;
