"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextureCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  variant?: "warm" | "minimal" | "retro" | "dark";
}

const TextureCard = React.forwardRef<HTMLDivElement, TextureCardProps>(
  ({ className, variant = "warm", children, ...props }, ref) => {
    const variantStyles = {
      warm: "border-[#d8d0c1] bg-[#fffdf8] shadow-[0_20px_50px_rgba(61,51,37,0.08)]",
      minimal: "border-[#e0d8ca] bg-[#fdfbf7] shadow-[0_12px_32px_rgba(41,39,32,0.06)]",
      retro: "border-[#725a36] bg-[#f5ede0] shadow-[0_24px_60px_rgba(114,90,54,0.12)]",
      dark: "border-[#3f3b33] bg-[#292720] text-[#f7f4ed] shadow-[0_24px_60px_rgba(0,0,0,0.35)]",
    }[variant];

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-[24px] border",
          variantStyles,
          className
        )}
        {...props}
      >
        <div className="rounded-[23px] border border-black/5">
          <div className="rounded-[22px] border border-[#fffdf8]/60">
            <div className="rounded-[21px] border border-[#d8d0c1]/40">
              <div className="w-full rounded-[20px] bg-gradient-to-b from-[#fffdf8] to-[#f8f5ee]/80 text-[#292720]">
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);
TextureCard.displayName = "TextureCard";

const TextureCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("p-6 pb-3 border-b border-[#eee7da]/80", className)}
    {...props}
  />
));
TextureCardHeader.displayName = "TextureCardHeader";

const TextureCardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    style={{ fontFamily: "var(--display)" }}
    className={cn(
      "text-2xl font-bold leading-tight text-[#292720]",
      className
    )}
    {...props}
  />
));
TextureCardTitle.displayName = "TextureCardTitle";

const TextureCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-xs text-[#625e54] mt-1 leading-relaxed", className)}
    {...props}
  />
));
TextureCardDescription.displayName = "TextureCardDescription";

const TextureCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6", className)} {...props} />
));
TextureCardContent.displayName = "TextureCardContent";

const TextureCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-center justify-between gap-3 px-6 py-4 border-t border-[#eee7da]/80 bg-[#f7f4ed]/50",
      className
    )}
    {...props}
  />
));
TextureCardFooter.displayName = "TextureCardFooter";

export {
  TextureCard,
  TextureCardHeader,
  TextureCardTitle,
  TextureCardDescription,
  TextureCardContent,
  TextureCardFooter,
};
