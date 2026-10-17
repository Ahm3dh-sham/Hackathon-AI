"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";

interface CountUpProps {
  end: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  decimals?: number;
  className?: string;
}

/**
 * Combines DavidHDev/react-bits CountUp pattern with greensock/GSAP tweening.
 */
export const CountUp: React.FC<CountUpProps> = ({
  end,
  suffix = "",
  prefix = "",
  duration = 1.8,
  decimals = 0,
  className = "",
}) => {
  const spanRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!spanRef.current) return;
    const obj = { val: 0 };
    const tween = gsap.to(obj, {
      val: end,
      duration,
      ease: "power3.out",
      onUpdate: () => {
        if (spanRef.current) {
          spanRef.current.textContent = `${prefix}${obj.val.toFixed(decimals)}${suffix}`;
        }
      },
    });

    return () => {
      tween.kill();
    };
  }, [end, suffix, prefix, duration, decimals]);

  return (
    <span ref={spanRef} className={className}>
      {prefix}0{suffix}
    </span>
  );
};
