import React from "react";
import { cn } from "../../utils/helpers";

export function Marquee({
  children,
  speed = "normal", // "fast", "normal", "slow"
  reverse = false,
  pauseOnHover = true,
  className = "",
}) {
  const speedClass = {
    fast: "animate-[marquee_15s_linear_infinite]",
    normal: "animate-[marquee_25s_linear_infinite]",
    slow: "animate-[marquee_45s_linear_infinite]",
  };

  const reverseSpeedClass = {
    fast: "animate-[marquee-reverse_15s_linear_infinite]",
    normal: "animate-[marquee-reverse_25s_linear_infinite]",
    slow: "animate-[marquee-reverse_45s_linear_infinite]",
  };

  const anim = reverse ? reverseSpeedClass[speed] : speedClass[speed];

  return (
    <div className={cn("overflow-hidden flex w-full select-none mask-marquee", className)}>
      <div
        className={cn(
          "flex min-w-full shrink-0 items-center justify-around gap-8",
          anim,
          pauseOnHover && "hover:[animation-play-state:paused]"
        )}
      >
        {children}
      </div>
      <div
        aria-hidden="true"
        className={cn(
          "flex min-w-full shrink-0 items-center justify-around gap-8",
          anim,
          pauseOnHover && "hover:[animation-play-state:paused]"
        )}
      >
        {children}
      </div>
    </div>
  );
}
