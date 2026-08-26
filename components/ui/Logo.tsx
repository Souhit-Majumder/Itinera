import React from "react";
import clsx from "clsx";

interface LogoProps {
  className?: string;
  variant?: 'full' | 'icon';
}

export function Logo({ className, variant = 'full' }: LogoProps) {
  if (variant === 'icon') {
    return (
      <div className={clsx("overflow-hidden relative", className)}>
        <img 
          src="/logo.png" 
          alt="Itinera" 
          className="absolute left-0 top-0 h-full w-auto max-w-none object-cover object-left" 
        />
      </div>
    );
  }

  return (
    <img 
      src="/logo.png" 
      alt="Itinera" 
      className={clsx("object-contain", className || "h-8 w-auto")} 
    />
  );
}
