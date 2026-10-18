"use client";

import * as React from "react";
import { Check, Copy } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

const ICON_SPRING = {
  type: "spring" as const,
  duration: 0.35,
  bounce: 0,
};

interface CopyButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
  className?: string;
  label?: string;
  copiedLabel?: string;
}

export function CopyButton({
  value,
  className,
  label = "Copy",
  copiedLabel = "Copied!",
  onClick,
  ...props
}: CopyButtonProps) {
  const [copied, setCopied] = React.useState(false);
  const shouldReduceMotion = useReducedMotion();

  const handleCopy = async (e: React.MouseEvent<HTMLButtonElement>) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
      onClick?.(e);
    } catch (err) {
      console.error("Failed to copy to clipboard", err);
    }
  };

  const motionProps = shouldReduceMotion
    ? {
        initial: { opacity: 1, scale: 1 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 1, scale: 1 },
      }
    : {
        initial: { opacity: 0, scale: 0.3, filter: "blur(3px)" },
        animate: { opacity: 1, scale: 1, filter: "blur(0px)" },
        exit: { opacity: 0, scale: 0.3, filter: "blur(3px)" },
        transition: ICON_SPRING,
      };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={cn(
        "inline-flex items-center gap-2 px-3.5 py-1.5 font-mono text-xs font-bold transition-all select-none",
        copied
          ? "bg-[#394b3f] text-[#fffdf8] border border-[#394b3f]"
          : "bg-[#fffdf8] text-[#292720] border border-[#c9b99d] hover:border-[#80643d] hover:bg-[#f7f4ed]",
        className
      )}
      {...props}
    >
      <AnimatePresence mode="wait" initial={false}>
        {copied ? (
          <motion.span
            key="check"
            {...motionProps}
            className="inline-flex items-center gap-1.5 text-[#d5fa70]"
          >
            <Check className="w-3.5 h-3.5" />
            <span>{copiedLabel}</span>
          </motion.span>
        ) : (
          <motion.span
            key="copy"
            {...motionProps}
            className="inline-flex items-center gap-1.5"
          >
            <Copy className="w-3.5 h-3.5 text-[#80643d]" />
            <span>{label}</span>
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
