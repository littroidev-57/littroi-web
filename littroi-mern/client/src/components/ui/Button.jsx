import React from "react";
import { Link } from "react-router-dom";
import { cn } from "../../utils/helpers";

export function Button({
  children,
  variant = "primary", // primary, outline, glow, ghost, lime
  size = "md", // sm, md, lg
  className = "",
  to,
  href,
  onClick,
  icon,
  iconPosition = "right",
  disabled = false,
  type = "button",
  ...props
}) {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-full transition-all duration-300 select-none focus:outline-none focus:ring-2 focus:ring-brand-primary/50 disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden";

  const sizeStyles = {
    sm: "text-xs px-4 py-2 gap-1.5",
    md: "text-sm px-6 py-3 gap-2",
    lg: "text-base px-8 py-4 gap-2.5",
  };

  const variantStyles = {
    primary: "bg-brand-primary text-white hover:bg-brand-primary-hover shadow-lg shadow-brand-primary/25 hover:shadow-brand-primary/40 hover:-translate-y-0.5",
    outline: "bg-transparent text-white border border-white/20 hover:border-white/50 hover:bg-white/5 hover:-translate-y-0.5",
    glow: "bg-gradient-to-r from-brand-primary to-brand-accent text-white shadow-lg shadow-brand-primary/30 hover:shadow-brand-accent/40 hover:scale-[1.02]",
    lime: "bg-brand-lime text-black font-semibold hover:bg-[#b5e024] shadow-lg shadow-brand-lime/20 hover:shadow-brand-lime/40 hover:-translate-y-0.5",
    ghost: "bg-transparent text-brand-muted hover:text-white hover:bg-white/5",
    card: "bg-white/5 text-white border border-white/10 hover:bg-white/10 hover:border-white/20"
  };

  const combinedStyles = cn(
    baseStyles,
    sizeStyles[size],
    variantStyles[variant],
    className
  );

  const content = (
    <>
      {icon && iconPosition === "left" && (
        <span className="transition-transform duration-300 group-hover:-translate-x-0.5">{icon}</span>
      )}
      <span>{children}</span>
      {icon && iconPosition === "right" && (
        <span className="transition-transform duration-300 group-hover:translate-x-1">{icon}</span>
      )}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={combinedStyles} {...props}>
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a
        href={href}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
        className={combinedStyles}
        {...props}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={combinedStyles}
      {...props}
    >
      {content}
    </button>
  );
}
