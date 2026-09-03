import React from "react";
import { ArrowUpRight } from "lucide-react";
import { Button } from "../ui/Button";
import { SITE_CONFIG } from "../../utils/constants";

export function BookCallButton({
  variant = "primary",
  size = "md",
  className = "",
  label = "Book a Call",
  showIcon = true
}) {
  return (
    <Button
      variant={variant}
      size={size}
      href={SITE_CONFIG.calendlyUrl}
      className={className}
      icon={showIcon ? <ArrowUpRight size={16} /> : null}
      iconPosition="right"
    >
      {label}
    </Button>
  );
}
