import React from "react";
import { ArrowLeft } from "lucide-react";
import { SEO } from "../utils/seo";
import { Button } from "../components/ui/Button";

export function NotFound() {
  return (
    <>
      <SEO title="404 — Page Not Found" />
      <div className="min-h-[80vh] flex items-center justify-center pt-24 px-4">
        <div className="max-w-md text-center space-y-6">
          <span className="text-7xl font-display font-extrabold text-brand-primary">404</span>
          <h1 className="text-3xl font-display font-bold text-white">Frame Not Found</h1>
          <p className="text-brand-muted text-sm leading-relaxed">
            The page you are looking for has been moved, renamed, or doesn't exist in our current directory.
          </p>
          <div className="pt-2">
            <Button to="/" variant="primary" size="md" icon={<ArrowLeft size={16} />} iconPosition="left">
              Return to Homepage
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
