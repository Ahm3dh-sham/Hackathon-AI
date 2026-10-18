"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize2,
  Film,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { CarouselNavigator } from "@/components/carousel-navigator";

export const KEYFRAMES = [
  { t: 0.0, label: "0.0s · Hero Low-Angle Start", phase: "FLIGHT START", img: "/flyover/stills/still-0.0s.png" },
  { t: 1.6, label: "1.6s · Cruise & Section 01", phase: "CRUISE SPEED", img: "/flyover/stills/still-1.6s.png" },
  { t: 2.5, label: "2.5s · Lifted Cards & Edge Chips", phase: "3D PARALLAX LIFT", img: "/flyover/stills/still-2.5s.png" },
  { t: 5.0, label: "5.0s · Multi-Agent Crew & Dossier", phase: "STEADY GLIDE", img: "/flyover/stills/still-5.0s.png" },
  { t: 6.5, label: "6.5s · Testimonial 112px Lift", phase: "TESTIMONIAL 30°", img: "/flyover/stills/still-6.5s.png" },
  { t: 9.3, label: "9.3s · Overhead Full-Page Strip", phase: "OVERHEAD STRIP", img: "/flyover/stills/still-9.3s.png" },
  { t: 11.0, label: "11.0s · End Card & Closing Title", phase: "END CARD HOLD", img: "/flyover/stills/still-11.0s.png" },
];

const getPhaseLabel = (t: number) => {
  if (t < 7.75) return "01 / CONTINUOUS GLIDE (0.0s – 8.2s)";
  if (t < 9.25) return "02 / LOG-SCALE RISE (7.75s – 9.25s)";
  if (t < 9.47) return "03 / OVERHEAD STRIP (9.25s – 9.47s)";
  if (t < 9.97) return "04 / HERO CARD DIVE (9.47s – 9.97s)";
  return "05 / END TITLE CARD (9.97s – 14.5s)";
};

interface FlyoverIntroOverlayProps {
  isOpen: boolean;
  onEnterLandingPage: () => void;
}

/**
 * Full-viewport 3D WebGL2 Fly-Over Showcase that opens FIRST when the link is opened,
 * plays the 14.5s 3D fly-over, and then transitions smoothly into the actual landing page.
 */
export const FlyoverIntroOverlay: React.FC<FlyoverIntroOverlayProps> = ({
  isOpen,
  onEnterLandingPage,
}) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const triggerSmoothExit = () => {
    if (isClosing) return;
    setIsClosing(true);
    iframeRef.current?.contentWindow?.postMessage(
      { type: "flyover-cmd", action: "pause" },
      "*"
    );
    if (overlayRef.current) {
      gsap.to(overlayRef.current, {
        opacity: 0,
        scale: 1.02,
        duration: 0.65,
        ease: "power3.inOut",
        onComplete: () => {
          setIsClosing(false);
          onEnterLandingPage();
        },
      });
    } else {
      onEnterLandingPage();
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    const onMessage = (e: MessageEvent) => {
      if (!e.data) return;
      if (e.data.type === "flyover-time") {
        setCurrentTime(e.data.t);
        setIsPlaying(e.data.playing);
      } else if (e.data.type === "flyover-ended") {
        // Automatically transition to the actual landing page a moment after the 14.5s fly-over finishes
        setTimeout(() => {
          triggerSmoothExit();
        }, 550);
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [isOpen, isClosing]);

  if (!isOpen) return null;

  const sendCommand = (cmd: Record<string, any>) => {
    iframeRef.current?.contentWindow?.postMessage({ type: "flyover-cmd", ...cmd }, "*");
  };

  const handleTogglePlay = () => {
    sendCommand({ action: isPlaying ? "pause" : "play" });
  };

  const handleSeek = (t: number) => {
    setCurrentTime(t);
    sendCommand({ action: "seek", t });
  };

  const handleToggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    sendCommand({ action: "mute", muted: next });
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] bg-[#f2f3f6] flex flex-col justify-between overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-label="HackForge AI 3D WebGL2 Fly-Over Showcase"
    >
      {/* Top Studio Header Bar */}
      <div className="preview-topbar shrink-0 border-b border-[#d8cfc0] bg-[#eee9df] px-4 sm:px-8 py-3">
        <div className="flex items-center gap-3">
          <div className="window-controls" aria-hidden="true">
            <i></i>
            <i></i>
            <i></i>
          </div>
          <span className="preview-app-title">
            <span className="mini-mark">H</span> HACKFORGE AI{" "}
            <span className="muted-slash">/</span> 3D WEBGL2 FLY-OVER SHOWCASE
          </span>
        </div>

        <span className="font-mono text-[11px] tracking-[0.1em] text-[#68512f] hidden md:inline">
          {getPhaseLabel(currentTime)}
        </span>

        <button
          type="button"
          onClick={triggerSmoothExit}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#394b3f] hover:bg-[#68512f] text-[#fffdf8] text-xs font-extrabold uppercase tracking-wider shadow-[0_8px_24px_rgba(41,39,32,0.18)] transition-all"
        >
          Open Landing Page <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Center 1440×1152 WebGL2 3D Viewport */}
      <div className="relative flex-1 w-full flex items-center justify-center bg-[#f2f3f6] overflow-hidden p-2 sm:p-4">
        <div className="relative h-full max-w-full aspect-[1440/1152] bg-[#f9fbfb] shadow-[0_28px_80px_rgba(26,33,51,0.14)] border border-[#d8cfc0] overflow-hidden">
          <iframe
            ref={iframeRef}
            src="/flyover/index.html?embed=1&autoplay=1"
            title="HackForge AI 14.5s 3D WebGL2 Fly-Over Intro"
            className="w-full h-full border-0 block"
            allow="autoplay"
          />
        </div>
      </div>

      {/* Bottom Interactive Scrubber & Keyframe Bar */}
      <div className="shrink-0 bg-[#fffdf8] border-t border-[#d8cfc0] px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-col gap-2.5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleTogglePlay}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#394b3f] hover:bg-[#2d3c32] text-[#fffdf8] text-xs font-extrabold uppercase tracking-wider transition-colors"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                {isPlaying ? "Pause" : "Play"}
              </button>
              <button
                type="button"
                onClick={() => handleSeek(0)}
                className="inline-flex items-center gap-1 px-2.5 py-2 bg-[#f7f4ed] hover:bg-[#eee9df] text-[#292720] border border-[#d5cbb8] text-xs font-bold uppercase tracking-wider transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" /> 0.0s
              </button>
              <button
                type="button"
                onClick={handleToggleMute}
                className="inline-flex items-center gap-1 px-2.5 py-2 bg-[#f7f4ed] hover:bg-[#eee9df] text-[#292720] border border-[#d5cbb8] text-xs font-bold uppercase tracking-wider transition-colors"
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                {isMuted ? "Muted" : "Sound"}
              </button>
            </div>

            <div className="flex items-center gap-3 flex-1 min-w-[220px] max-w-xl">
              <span className="font-mono text-xs font-bold text-[#394b3f] w-12 text-right">
                {currentTime.toFixed(2)}s
              </span>
              <input
                type="range"
                min={0}
                max={14.5}
                step={0.01}
                value={currentTime}
                onChange={(e) => handleSeek(parseFloat(e.target.value))}
                className="w-full accent-[#80643d] cursor-pointer h-1.5 bg-[#dfd7c8] rounded-lg"
                aria-label="Scrub 14.5 second 3D fly-over intro timeline"
              />
              <span className="font-mono text-xs text-[#726d62] w-12">14.50s</span>
            </div>

            <div className="flex items-center gap-1.5">
              {KEYFRAMES.map((kf) => {
                const isNear = Math.abs(currentTime - kf.t) < 0.25;
                return (
                  <button
                    key={kf.t}
                    type="button"
                    onClick={() => handleSeek(kf.t)}
                    className={`px-2 py-1 text-[10px] font-mono transition-all border ${
                      isNear
                        ? "bg-[#80643d] text-[#fffdf8] border-[#80643d] font-bold"
                        : "bg-[#f7f4ed] text-[#292720] border-[#d8cfc0] hover:border-[#80643d]"
                    }`}
                  >
                    {kf.t}s
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface FlyoverShowcaseProps {
  onOpenFullscreenIntro?: () => void;
}

export const FlyoverShowcase: React.FC<FlyoverShowcaseProps> = ({
  onOpenFullscreenIntro,
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [activeStillIdx, setActiveStillIdx] = useState(0);
  const [isCaptureMode, setIsCaptureMode] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("capture") === "1") {
        setIsCaptureMode(true);
      }
    }
  }, []);

  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.data && e.data.type === "flyover-time") {
        setCurrentTime(e.data.t);
        setIsPlaying(e.data.playing);
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  if (isCaptureMode) return null;

  const sendCommand = (cmd: Record<string, any>) => {
    iframeRef.current?.contentWindow?.postMessage({ type: "flyover-cmd", ...cmd }, "*");
  };

  const handleTogglePlay = () => {
    sendCommand({ action: isPlaying ? "pause" : "play" });
  };

  const handleSeek = (t: number) => {
    setCurrentTime(t);
    sendCommand({ action: "seek", t });
  };

  const handleToggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    sendCommand({ action: "mute", muted: next });
  };

  return (
    <section
      id="flyover-showcase"
      className="section-wrap section-pad"
      aria-labelledby="flyover-heading"
    >
      <div className="section-heading split-heading">
        <div>
          <p className="eyebrow">
            <span className="section-index">3D</span> WEBGL2 CINEMATIC FLY-OVER · 1440×1152 @ 60FPS
          </p>
          <h2 id="flyover-heading">
            One continuous lens.
            <br />
            <span>Zero cuts. Pure depth.</span>
          </h2>
        </div>
        <div className="space-y-4">
          <p className="section-intro">
            Experience the 14.5-second 3D WebGL2 architectural fly-over of HackForge AI—featuring
            40-tap golden-angle disc depth of field, 16x anisotropic mipmaps, lifted 3D UI cards
            with cast studio shadows, and procedural sound design.
          </p>
          {onOpenFullscreenIntro && (
            <button
              type="button"
              onClick={onOpenFullscreenIntro}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#394b3f] hover:bg-[#68512f] text-[#fffdf8] text-xs font-extrabold uppercase tracking-wider transition-colors"
            >
              <Maximize2 className="w-3.5 h-3.5" /> Launch Fullscreen 3D Fly-Over Intro
            </button>
          )}
        </div>
      </div>

      {/* Main Studio Film Window */}
      <div className="border border-[#d8cfc0] bg-[#fffdf8] shadow-[0_30px_80px_rgba(41,39,32,0.14)] overflow-hidden">
        {/* Top Studio Bar */}
        <div className="preview-topbar">
          <div className="window-controls" aria-hidden="true">
            <i></i>
            <i></i>
            <i></i>
          </div>
          <span className="preview-app-title">
            <span className="mini-mark">H</span> HACKFORGE{" "}
            <span className="muted-slash">/</span> WEBGL2 3D FLY-OVER FILM (1440×1152 · 60FPS)
          </span>
          <div className="flex items-center gap-3">
            <span className="font-mono text-[11px] tracking-[0.08em] text-[#68512f] hidden sm:inline">
              {getPhaseLabel(currentTime)}
            </span>
            <a
              href="/flyover/index.html"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono uppercase tracking-wider bg-[#f3ede2] hover:bg-[#e5dccb] text-[#292720] border border-[#d6ccb8] transition-colors"
            >
              <Maximize2 className="w-3 h-3" /> Full 1440×1152 Canvas
            </a>
          </div>
        </div>

        {/* Embedded 5:4 (1440x1152) WebGL2 Canvas Viewport */}
        <div className="relative w-full bg-[#f2f3f6] aspect-[5/4] max-h-[760px] mx-auto overflow-hidden border-b border-[#e2d9c8]">
          <iframe
            ref={iframeRef}
            src="/flyover/index.html?embed=1"
            title="HackForge AI 14.5s 3D WebGL2 Fly-Over"
            className="w-full h-full border-0 block"
            allow="autoplay"
          />
        </div>

        {/* Interactive Scrubber & Keyframe Bar */}
        <div className="p-5 sm:p-6 bg-[#f7f4ed] space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={handleTogglePlay}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#394b3f] hover:bg-[#2d3c32] text-[#fffdf8] text-xs font-extrabold uppercase tracking-wider transition-colors"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                {isPlaying ? "Pause Film" : "Play 14.5s Fly-Over"}
              </button>
              <button
                type="button"
                onClick={() => handleSeek(0)}
                className="inline-flex items-center gap-1.5 px-3 py-2.5 bg-[#fffdf8] hover:bg-[#eee9df] text-[#292720] border border-[#d5cbb8] text-xs font-bold uppercase tracking-wider transition-colors"
                title="Restart at 0.0s"
              >
                <RotateCcw className="w-3.5 h-3.5" /> 0.0s
              </button>
              <button
                type="button"
                onClick={handleToggleMute}
                className="inline-flex items-center gap-1.5 px-3 py-2.5 bg-[#fffdf8] hover:bg-[#eee9df] text-[#292720] border border-[#d5cbb8] text-xs font-bold uppercase tracking-wider transition-colors"
                title="Toggle procedural studio audio (whooshes at 8.66s & 9.80s, hit at 9.97s)"
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                {isMuted ? "Muted" : "Audio On"}
              </button>
            </div>

            <div className="flex items-center gap-3 flex-1 min-w-[240px] max-w-xl">
              <span className="font-mono text-xs font-semibold text-[#394b3f] w-14 text-right">
                {currentTime.toFixed(2)}s
              </span>
              <input
                type="range"
                min={0}
                max={14.5}
                step={0.01}
                value={currentTime}
                onChange={(e) => handleSeek(parseFloat(e.target.value))}
                className="w-full accent-[#80643d] cursor-pointer h-1.5 bg-[#dfd7c8] rounded-lg"
                aria-label="Scrub 14.5 second 3D fly-over timeline"
              />
              <span className="font-mono text-xs text-[#726d62] w-12">14.50s</span>
            </div>
          </div>

          {/* 7 Required Keyframe Timestamp Jump Buttons */}
          <div className="pt-2 border-t border-[#e4dccd] flex flex-wrap items-center justify-between gap-2">
            <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#68512f] flex items-center gap-1.5">
              <Film className="w-3.5 h-3.5" /> Keyframe Stills (seek(t)):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {KEYFRAMES.map((kf, idx) => {
                const isNear = Math.abs(currentTime - kf.t) < 0.25;
                return (
                  <button
                    key={kf.t}
                    type="button"
                    onClick={() => {
                      handleSeek(kf.t);
                      setActiveStillIdx(idx);
                    }}
                    className={`px-2.5 py-1 text-[11px] font-mono transition-all border ${
                      isNear
                        ? "bg-[#80643d] text-[#fffdf8] border-[#80643d] font-bold"
                        : "bg-[#fffdf8] text-[#292720] border-[#d8cfc0] hover:border-[#80643d]"
                    }`}
                  >
                    {kf.t}s
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 7 Captured Keyframe Stills Inspection Carousel */}
      <div className="mt-10 border border-[#d8cfc0] bg-[#fffdf8] p-6 sm:p-8 shadow-[0_20px_54px_rgba(41,39,32,0.08)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#e5decfe6]">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#80643d] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> VERIFIED GPU KEYFRAME STILLS (0s, 1.6s, 2.5s, 5s, 6.5s, 9.3s, 11s)
            </p>
            <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-[#292720] mt-1">
              {KEYFRAMES[activeStillIdx].label}
            </h3>
          </div>
          <CarouselNavigator
            totalSlides={KEYFRAMES.length}
            currentSlide={activeStillIdx}
            onSlideChange={(idx) => {
              setActiveStillIdx(idx);
              handleSeek(KEYFRAMES[idx].t);
            }}
            autoPlayDelay={6000}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6 items-center">
          <div className="lg:col-span-8 bg-[#f2f3f6] border border-[#d8cfc0] overflow-hidden">
            <img
              src={KEYFRAMES[activeStillIdx].img}
              alt={KEYFRAMES[activeStillIdx].label}
              className="w-full h-auto block"
            />
          </div>
          <div className="lg:col-span-4 space-y-3">
            <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#726d62]">
              SELECT STILL TO INSPECT &amp; SEEK
            </p>
            <div className="space-y-2">
              {KEYFRAMES.map((kf, idx) => (
                <button
                  key={kf.t}
                  type="button"
                  onClick={() => {
                    setActiveStillIdx(idx);
                    handleSeek(kf.t);
                  }}
                  className={`w-full text-left px-3.5 py-2.5 border transition-all flex items-center justify-between ${
                    activeStillIdx === idx
                      ? "bg-[#394b3f] text-[#fffdf8] border-[#394b3f]"
                      : "bg-[#f7f4ed] text-[#292720] border-[#dcd3c4] hover:border-[#80643d]"
                  }`}
                >
                  <span className="text-xs font-bold">{kf.label}</span>
                  <span
                    className={`font-mono text-[10px] px-1.5 py-0.5 ${
                      activeStillIdx === idx
                        ? "bg-[#fffdf8]/15 text-[#e6d3b3]"
                        : "bg-[#fffdf8] text-[#80643d]"
                    }`}
                  >
                    {kf.phase}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
