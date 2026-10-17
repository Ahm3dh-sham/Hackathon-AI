"use client";

import React, { useEffect, useState } from "react";

interface DecryptedTextProps {
  text: string;
  speed?: number;
  className?: string;
}

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*<>[]{}";

/**
 * Inspired by DavidHDev/react-bits DecryptedText component.
 * Scrambles characters and progressively reveals the target string on mount and hover.
 */
export const DecryptedText: React.FC<DecryptedTextProps> = ({
  text,
  speed = 28,
  className = "",
}) => {
  const [displayText, setDisplayText] = useState(text);
  const [trigger, setTrigger] = useState(0);

  useEffect(() => {
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText(
        text
          .split("")
          .map((char, index) => {
            if (char === " ") return " ";
            if (index < iteration) return text[index];
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join("")
      );

      if (iteration >= text.length) {
        clearInterval(interval);
      }
      iteration += 1 / 2;
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, trigger]);

  return (
    <span
      onMouseEnter={() => setTrigger((t) => t + 1)}
      className={`inline-block cursor-default ${className}`}
    >
      {displayText}
    </span>
  );
};
