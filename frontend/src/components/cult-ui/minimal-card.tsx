"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const MinimalCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { children?: React.ReactNode }
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-[20px] bg-[#fffdf8] p-5 no-underline transition-all duration-200 border border-[#d8d0c1]",
      "shadow-[0px_1px_1px_0px_rgba(0,0,0,0.05),0px_1px_1px_0px_rgba(255,252,240,0.5)_inset,0px_0px_0px_1px_hsla(0,0%,100%,0.1)_inset,0px_0px_1px_0px_rgba(28,27,26,0.3)]",
      "hover:border-[#80643d]/70 hover:shadow-[0_12px_28px_rgba(61,51,37,0.1)]",
      className
    )}
    {...props}
  >
    {children}
  </div>
));
MinimalCard.displayName = "MinimalCard";

const MinimalCardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    style={{ fontFamily: "var(--display)" }}
    className={cn(
      "text-xl font-bold leading-snug text-[#292720] tracking-tight",
      className
    )}
    {...props}
  />
));
MinimalCardTitle.displayName = "MinimalCardTitle";

const MinimalCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-xs text-[#625e54] mt-1.5 leading-relaxed", className)}
    {...props}
  />
));
MinimalCardDescription.displayName = "MinimalCardDescription";

export { MinimalCard, MinimalCardTitle, MinimalCardDescription };
