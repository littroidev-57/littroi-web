import React from "react";

export function Loader({ size = "md", className = "" }) {
  const sizeMap = {
    sm: "w-5 h-5 border-2",
    md: "w-8 h-8 border-3",
    lg: "w-12 h-12 border-4"
  };

  return (
    <div className={`flex items-center justify-center p-6 ${className}`}>
      <div
        className={`${sizeMap[size]} border-brand-primary/20 border-t-brand-primary rounded-full animate-spin`}
      />
    </div>
  );
}
