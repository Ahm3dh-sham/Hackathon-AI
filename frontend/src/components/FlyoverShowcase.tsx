"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";

interface FlyoverIntroOverlayProps {
  isOpen: boolean;
  onEnterLandingPage: () => void;
}

/**
 * Full-screen 3D WebGL2 Fly-Over Intro with ZERO controls or UI chrome.
 * Plays automatically in full screen when the link is opened, locks access to
 * everything underneath while playing, and smoothly opens the landing page
 * once the 14.5-second fly-over completely finishes playing.
 */
export const FlyoverIntroOverlay: React.FC<FlyoverIntroOverlayProps> = ({
  isOpen,
  onEnterLandingPage,
}) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [isClosing, setIsClosing] = useState(false);

  // Lock page scrolling & interaction while the full-screen 3D fly-over is playing
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.scrollTo(0, 0);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const triggerSmoothExit = () => {
      if (isClosing) return;
      setIsClosing(true);
      if (overlayRef.current) {
        gsap.to(overlayRef.current, {
          opacity: 0,
          duration: 0.7,
          ease: "power2.inOut",
          onComplete: () => {
            document.body.style.overflow = "";
            setIsClosing(false);
            onEnterLandingPage();
          },
        });
      } else {
        document.body.style.overflow = "";
        onEnterLandingPage();
      }
    };

    const onMessage = (e: MessageEvent) => {
      if (e.data && e.data.type === "flyover-ended") {
        triggerSmoothExit();
      }
    };

    // Fallback safety timer at 15.2s in case iframe postMessage is delayed
    const fallbackTimer = setTimeout(() => {
      triggerSmoothExit();
    }, 15200);

    window.addEventListener("message", onMessage);
    return () => {
      clearTimeout(fallbackTimer);
      window.removeEventListener("message", onMessage);
    };
  }, [isOpen, isClosing, onEnterLandingPage]);

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[99999] w-screen h-screen bg-[#f2f3f6] overflow-hidden select-none"
      aria-label="HackForge AI 3D Fly-Over Intro"
    >
      <iframe
        src="/flyover/index.html?embed=1&autoplay=1"
        title="HackForge AI Fullscreen 3D Fly-Over"
        className="w-screen h-screen border-0 block pointer-events-none"
        allow="autoplay"
      />
    </div>
  );
};
