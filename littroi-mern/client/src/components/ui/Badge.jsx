import React from "react";
import { cn } from "../../utils/helpers";

export function Badge({
  children,
  variant = "default", // default, primary, accent, lime, outline
  className = "",
  size = "md"
}) {
  const base = "inline-flex items-center font-medium rounded-full tracking-wide uppercase transition-colors";
  
  const sizes = {
    sm: "text-[10px] px-2.5 py-0.5",
    md: "text-xs px-3.5 py-1",
    lg: "text-sm px-4 py-1.5"
  };

  const variants = {
    default: "bg-white/5 text-brand-muted border border-white/10",
    primary: "bg-brand-primary/10 text-brand-accent border border-brand-primary/30",
    accent: "bg-brand-accent/10 text-brand-accent border border-brand-accent/30",
    lime: "bg-brand-lime/10 text-brand-lime border border-brand-lime/30",
    outline: "bg-transparent text-brand-text border border-white/20"
  };

  return (
    <span className={cn(base, sizes[size], variants[variant], className)}>
      {children}
    </span>
  );
}
