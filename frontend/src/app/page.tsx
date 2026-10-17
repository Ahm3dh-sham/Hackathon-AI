"use client";

import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { InputForm } from "@/components/InputForm";
import { BlueprintDisplay, ProjectStateBlueprint } from "@/components/BlueprintDisplay";
import { SpotlightCard } from "@/components/react-bits/SpotlightCard";
import { DecryptedText } from "@/components/react-bits/DecryptedText";
import { CountUp } from "@/components/react-bits/CountUp";
import LoginPage, { isValidEmailClient } from "@/components/ui/auth-04";
import {
  ArrowLeft,
  LogOut,
  UserCheck,
  Sparkles,
  Loader2,
  Sun,
  Moon,
} from "lucide-react";

const WORKFLOW_STEPS = [
  {
    num: "01",
    icon: "↘",
    title: "Decode the brief",
    desc: "Surface the real problem, who feels it, and the constraints hiding between the lines.",
    footLeft: "INPUT",
    footRight: "YOUR CHALLENGE",
    highlight: true,
  },
  {
    num: "02",
    icon: "⌘",
    title: "Shape the product",
    desc: "Turn an opportunity into a focused concept, a clear promise, and a sensible MVP.",
    footLeft: "LENS",
    footRight: "PRODUCT",
    highlight: false,
  },
  {
    num: "03",
    icon: "⌬",
    title: "Map the build",
    desc: "Connect the experience to the system, the work to the roadmap, and the team to a plan.",
    footLeft: "LENSES",
    footRight: "DESIGN + ARCH",
    highlight: false,
  },
  {
    num: "04",
    icon: "↗",
    title: "Get to making",
    desc: "Leave the ideation loop with project guidance your crew can discuss, refine, and execute.",
    footLeft: "OUTPUT",
    footRight: "SHARED BLUEPRINT",
    highlight: false,
  },
];

const AGENT_CARDS = [
  {
    letter: "P",
    name: "Product strategist",
    stage: "01 / DISCOVER",
    desc: "Finds the user need, sharpens the value proposition, and keeps the MVP honest.",
    colorClass: "border-[#d5fa70]/40 text-[#d5fa70]",
  },
  {
    letter: "A",
    name: "Systems architect",
    stage: "02 / STRUCTURE",
    desc: "Connects product choices to a practical technical architecture and buildable stack.",
    colorClass: "border-[#aaa0ff]/40 text-[#aaa0ff]",
  },
  {
    letter: "D",
    name: "Experience designer",
    stage: "03 / EXPERIENCE",
    desc: "Maps the important flows and makes the intended experience tangible for the team.",
    colorClass: "border-[#8ce9d4]/40 text-[#8ce9d4]",
  },
  {
    letter: "R",
    name: "Delivery planner",
    stage: "04 / EXECUTION",
    desc: "Turns scope into a sensible sequence, milestones, and a credible demo path.",
    colorClass: "border-[#ffbf92]/40 text-[#ffbf92]",
  },
];

const DELIVERABLES = [
  {
    num: "01",
    title: "Product scope",
    desc: "Problem framing, target users, value proposition, and a focused first version.",
  },
  {
    num: "02",
    title: "Feature map",
    desc: "Core capabilities, user flows, dependencies, and the right place to draw the MVP line.",
  },
  {
    num: "03",
    title: "Technical architecture",
    desc: "Key components and how they connect, with implementation guidance to ground the choices.",
  },
  {
    num: "04",
    title: "Build roadmap & AI Builder Prompt",
    desc: "Prioritized milestones and a copy-paste master prompt to turn the plan into working code.",
  },
];

const BENEFITS = [
  {
    num: "01",
    title: "Start with a sharper idea",
    desc: "Make the problem, user, and project promise clear before the code begins.",
  },
  {
    num: "02",
    title: "Keep the scope buildable",
    desc: "Give the big vision a realistic first cut your team can actually take on.",
  },
  {
    num: "03",
    title: "Build from shared context",
    desc: "Get product, design, architecture, and execution on the same page.",
  },
];

export default function Home() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [blueprintData, setBlueprintData] = useState<ProjectStateBlueprint | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editorialMode, setEditorialMode] = useState(false);

  // Interactive Hero Preview Studio state (matching reference site main.js + live AI trigger)
  const [studioBrief, setStudioBrief] = useState(
    "Students want to rescue surplus campus meals before they go to waste."
  );
  const [demoRunning, setDemoRunning] = useState(false);
  const [demoStep, setDemoStep] = useState<number>(-1);
  const [demoComplete, setDemoComplete] = useState(false);
  const [snapshotTitle, setSnapshotTitle] = useState("Campus food rescue");
  const [snapshotTag, setSnapshotTag] = useState("SAMPLE");

  const heroCopyRef = useRef<HTMLDivElement>(null);
  const heroVisualRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.removeItem("hackforge_user");
    const syncAuth = () => {
      const saved = sessionStorage.getItem("hackforge_verified_email");
      if (saved && isValidEmailClient(saved)) {
        setUserEmail(saved);
      } else {
        sessionStorage.removeItem("hackforge_verified_email");
        setUserEmail(null);
      }
      setAuthChecked(true);
    };
    syncAuth();
    window.addEventListener("hackforge-auth-change", syncAuth);
    return () => window.removeEventListener("hackforge-auth-change", syncAuth);
  }, []);

  // GSAP Entrance Animations (Starred Repo: greensock/GSAP)
  useEffect(() => {
    if (!userEmail) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      if (heroCopyRef.current) {
        tl.fromTo(
          heroCopyRef.current.children,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.75, stagger: 0.12 }
        );
      }
      if (heroVisualRef.current) {
        tl.fromTo(
          heroVisualRef.current,
          { y: 26, opacity: 0, rotate: 1.5 },
          { y: 0, opacity: 1, rotate: 0.35, duration: 0.85 },
          "-=0.45"
        );
      }
    });
    return () => ctx.revert();
  }, [userEmail]);

  const handleLogin = (email: string) => {
    const finalEmail = email.trim().toLowerCase();
    if (!isValidEmailClient(finalEmail)) return;
    sessionStorage.setItem("hackforge_verified_email", finalEmail);
    setUserEmail(finalEmail);
    window.dispatchEvent(new Event("hackforge-auth-change"));
  };

  const handleSignOut = () => {
    sessionStorage.removeItem("hackforge_verified_email");
    localStorage.removeItem("hackforge_user");
    setUserEmail(null);
    window.dispatchEvent(new Event("hackforge-auth-change"));
  };

  // Reference site interactive "Play the flow" simulation
  const handlePlayStudioDemo = async () => {
    if (demoRunning) return;
    setDemoRunning(true);
    setDemoComplete(false);
    setSnapshotTitle("Reading your problem…");
    setSnapshotTag("DEMO RUN");

    for (let i = 0; i < 4; i++) {
      setDemoStep(i);
      await new Promise((r) => setTimeout(r, 450));
    }

    const words = studioBrief
      .trim()
      .replace(/[“”"']/g, "")
      .split(/\s+/)
      .slice(0, 5)
      .join(" ");
    setSnapshotTitle(words || "Your project idea");
    setSnapshotTag("READY");
    setDemoStep(4);
    setDemoComplete(true);
    setDemoRunning(false);
  };

  // Real AI Multi-Agent Generation
  const handleGenerate = async (problemStatement: string) => {
    setIsLoading(true);
    setError(null);

    const studioSection = document.getElementById("forge-studio");
    if (studioSection) {
      studioSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problem_statement: problemStatement }),
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || "Generation failed. Please try again.");
      }

      const data: ProjectStateBlueprint = await response.json();
      setBlueprintData(data);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred while generating the blueprint.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!authChecked) {
    return null;
  }

  // Render Watermelon auth-04 Login Page when not signed in
  if (!userEmail) {
    return (
      <div className="relative z-10 max-w-5xl mx-auto px-4 py-8">
        <LoginPage
          brandName="HackForge AI"
          onLogin={(email) => handleLogin(email)}
        />
      </div>
    );
  }

  return (
    <div
      className={`transition-colors duration-500 ${
        editorialMode
          ? "theme-editorial bg-[#f7f4ed] text-[#292720]"
          : "text-[#f0f2e9]"
      }`}
    >
      {/* Top Session & Palette Bar */}
      <div className="max-w-7xl mx-auto px-6 pt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs">
          <UserCheck className="w-3.5 h-3.5 text-[#d5fa70]" />
          <span className="font-dm-mono text-[11px] opacity-80">
            BUILDER SESSION: <strong className="text-white">{userEmail}</strong>
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setEditorialMode((v) => !v)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 font-dm-mono text-[11px] transition-colors"
            title="Switch between Cyber Acid Dark & Old-Money Editorial Linen palette"
          >
            {editorialMode ? (
              <>
                <Moon className="w-3.5 h-3.5 text-[#80643d]" />
                <span>Cyber Acid Mode</span>
              </>
            ) : (
              <>
                <Sun className="w-3.5 h-3.5 text-[#d5fa70]" />
                <span>Editorial Linen Mode</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleSignOut}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-rose-500/20 border border-white/10 hover:border-rose-500/40 font-dm-mono text-[11px] transition-colors"
          >
            <LogOut className="w-3 h-3" />
            Sign Out
          </button>
        </div>
      </div>

      {/* ================= HERO SECTION (Reference: hackforge-vetymgot.manus.space) ================= */}
      <section
        className="max-w-7xl mx-auto px-6 py-14 lg:py-20 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center"
        aria-labelledby="hero-title"
      >
        {/* Left Column: Hero Copy */}
        <div ref={heroCopyRef} className="lg:col-span-6 space-y-6">
          <p className="font-dm-mono text-[11px] tracking-[0.15em] uppercase text-[#d5fa70] flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-[#d5fa70] shadow-[0_0_12px_rgba(213,250,112,0.8)]" />
            <DecryptedText text="THE HACKATHON STARTING LINE" speed={25} />
          </p>

          <h1
            id="hero-title"
            className="font-editorial text-5xl sm:text-6xl lg:text-[74px] font-semibold tracking-[-0.04em] leading-[0.98]"
          >
            A bold idea deserves{" "}
            <span className="relative inline-block text-[#d5fa70] italic font-normal">
              a build plan.
              <span className="absolute left-0 right-1 -bottom-1.5 h-[3px] bg-gradient-to-r from-[#d5fa70] via-[#aaa0ff] to-transparent opacity-80" />
            </span>
          </h1>

          <p className="text-base sm:text-lg text-[#adb5b4] leading-relaxed max-w-xl">
            Turn a raw problem statement into a complete project blueprint—shaped by a crew of
            specialist AI agents, ready for your team to build.
          </p>

          <div className="flex flex-wrap items-center gap-6 pt-2">
            <a
              href="#forge-studio"
              className="inline-flex items-center justify-center gap-4 min-h-[52px] px-6 bg-[#d5fa70] hover:bg-[#e2ff96] text-[#0a0d13] text-xs font-extrabold tracking-wide transition-all hover:-translate-y-0.5 shadow-xl shadow-[#d5fa70]/15"
            >
              <span>See a blueprint take shape</span>
              <span aria-hidden="true" className="text-base">
                ↗
              </span>
            </a>

            <a
              href="#workflow"
              className="inline-flex items-center gap-3 text-xs font-bold text-gray-200 hover:text-[#d5fa70] transition-colors"
            >
              <span>Meet your agent crew</span>
              <span aria-hidden="true" className="text-[#d5fa70] text-base">
                ↓
              </span>
            </a>
          </div>

          {/* Hero Proof Symbols (P A D R) */}
          <div className="flex items-center gap-4 pt-6">
            <div className="flex pl-1" aria-hidden="true">
              <span className="grid w-8 h-8 -ml-1.5 place-items-center rounded-full border-2 border-[#0a0d13] bg-[#d5fa70] text-[#0a0d13] font-display-grotesk text-[11px] font-extrabold">
                P
              </span>
              <span className="grid w-8 h-8 -ml-1.5 place-items-center rounded-full border-2 border-[#0a0d13] bg-[#aaa0ff] text-[#0a0d13] font-display-grotesk text-[11px] font-extrabold">
                A
              </span>
              <span className="grid w-8 h-8 -ml-1.5 place-items-center rounded-full border-2 border-[#0a0d13] bg-[#8ce9d4] text-[#0a0d13] font-display-grotesk text-[11px] font-extrabold">
                D
              </span>
              <span className="grid w-8 h-8 -ml-1.5 place-items-center rounded-full border-2 border-[#0a0d13] bg-[#34444a] text-[#f0f2e9] font-display-grotesk text-[11px] font-extrabold">
                R
              </span>
            </div>
            <p className="text-xs leading-relaxed text-gray-200">
              <strong className="font-extrabold text-white">One shared brief.</strong> Four
              specialist perspectives.
              <br />
              <span className="text-gray-400">One plan your team can rally around.</span>
            </p>
          </div>
        </div>

        {/* Right Column: Interactive HACKFORGE / BLUEPRINT STUDIO Preview Window */}
        <div id="product" className="lg:col-span-6 relative">
          {/* Decorative Orbits & Sparks */}
          <div
            className="hidden sm:block absolute -top-4 -right-4 w-36 h-36 rounded-full border border-[#d5fa70]/15 pointer-events-none"
            aria-hidden="true"
          />
          <div
            className="hidden sm:block absolute -bottom-6 -right-10 w-48 h-48 rounded-full border border-[#aaa0ff]/15 pointer-events-none"
            aria-hidden="true"
          />
          <div
            className="hidden sm:block absolute -top-3 left-[18%] text-[#d5fa70] text-2xl hf-spin-slow pointer-events-none"
            aria-hidden="true"
          >
            ✳
          </div>

          {/* Preview Window */}
          <div
            ref={heroVisualRef}
            className="relative z-10 border border-white/20 bg-[#10151c]/95 backdrop-blur-xl shadow-[0_32px_90px_rgba(0,0,0,0.55)]"
          >
            {/* Window Topbar */}
            <div className="flex h-10 items-center justify-between px-4 border-b border-white/10 bg-[#141a22]">
              <div className="flex gap-1.5" aria-hidden="true">
                <i className="w-2 h-2 rounded-full bg-[#e38872]" />
                <i className="w-2 h-2 rounded-full bg-[#e4bc63]" />
                <i className="w-2 h-2 rounded-full bg-[#77ba84]" />
              </div>
              <span className="font-dm-mono text-[10px] tracking-[0.1em] text-gray-300 flex items-center">
                <span className="inline-grid w-4 h-4 mr-1.5 place-items-center bg-[#d5fa70] text-[#0a0d13] font-display-grotesk text-[10px] font-extrabold">
                  H
                </span>
                HACKFORGE <span className="px-1.5 text-gray-600">/</span> BLUEPRINT STUDIO
              </span>
              <span className="flex items-center gap-1.5 font-dm-mono text-[9px] tracking-[0.1em] text-gray-400">
                <span className="w-1.5 h-1.5 rounded-full bg-[#d5fa70] animate-ping" />
                LIVE AI ENGINE
              </span>
            </div>

            {/* Window Inner */}
            <div className="p-6 space-y-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-dm-mono text-[10px] tracking-[0.12em] text-gray-400">
                    NEW PROJECT <span className="px-1 text-[#d5fa70]">/</span> 00:42
                  </p>
                  <h2 className="mt-1 font-editorial text-2xl sm:text-3xl font-semibold text-white">
                    Your idea, <span className="text-[#d5fa70] italic">in formation.</span>
                  </h2>
                </div>
                <span className="font-dm-mono text-xs text-gray-500">01</span>
              </div>

              <div>
                <label
                  htmlFor="brief-input"
                  className="block mb-2 font-dm-mono text-[10px] tracking-[0.12em] text-gray-400"
                >
                  THE CHALLENGE
                </label>
                <div className="relative p-3.5 border border-white/15 bg-[#0c1117]">
                  <span
                    className="absolute top-2 left-2.5 text-[#d5fa70] font-editorial text-3xl leading-none opacity-80"
                    aria-hidden="true"
                  >
                    “
                  </span>
                  <textarea
                    id="brief-input"
                    maxLength={240}
                    rows={2}
                    value={studioBrief}
                    onChange={(e) => setStudioBrief(e.target.value)}
                    className="block w-full resize-none pl-5 pr-2 py-1 bg-transparent border-0 text-xs text-gray-200 focus:outline-none leading-relaxed"
                  />
                  <div className="flex justify-between pt-2 mt-1 border-t border-white/10 font-dm-mono text-[9px] text-gray-500">
                    <span>Interactive problem statement</span>
                    <span>{studioBrief.length} / 240</span>
                  </div>
                </div>
              </div>

              {/* Specialist Agents Track */}
              <div className="space-y-2.5">
                <div className="flex justify-between items-center font-dm-mono text-[9px] tracking-[0.1em]">
                  <span className="text-gray-400">SPECIALIST AGENTS</span>
                  <span
                    className={`inline-flex items-center gap-1.5 ${
                      demoRunning || isLoading
                        ? "text-[#aaa0ff]"
                        : demoComplete
                        ? "text-[#8ce9d4]"
                        : "text-[#d5fa70]"
                    }`}
                  >
                    <i className="w-1.5 h-1.5 rounded-full bg-current" />
                    {isLoading
                      ? "FORGING REAL AI BLUEPRINT..."
                      : demoRunning
                      ? "MAPPING THE BRIEF"
                      : demoComplete
                      ? "PREVIEW COMPLETE"
                      : "READY TO MAP"}
                  </span>
                </div>

                <div className="flex items-center justify-between font-dm-mono text-[8px] tracking-[0.1em] text-gray-400 pt-1">
                  {[
                    { code: "P", label: "PRODUCT", color: "text-[#d5fa70]" },
                    { code: "A", label: "ARCH", color: "text-[#aaa0ff]" },
                    { code: "D", label: "DESIGN", color: "text-[#8ce9d4]" },
                    { code: "R", label: "DELIVERY", color: "text-[#ffbf92]" },
                  ].map((node, idx) => {
                    const isActive = demoStep === idx;
                    const isDone = demoStep > idx;
                    return (
                      <React.Fragment key={node.code}>
                        <div className="grid justify-items-center gap-1.5 min-w-[48px]">
                          <span
                            className={`grid w-7 h-7 place-items-center rounded-full border text-[11px] font-bold transition-all ${
                              isActive
                                ? "bg-[#d5fa70] text-[#0a0d13] border-[#d5fa70] shadow-[0_0_16px_rgba(213,250,112,0.4)]"
                                : isDone
                                ? "bg-[#8ce9d4] text-[#0a0d13] border-[#8ce9d4]"
                                : `border-white/15 bg-[#141a22] ${node.color}`
                            }`}
                          >
                            {node.code}
                          </span>
                          <span>{node.label}</span>
                        </div>
                        {idx < 3 && (
                          <span className="w-full h-px mb-4 bg-gradient-to-r from-[#d5fa70]/40 to-white/10" />
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>

              {/* Blueprint Snapshot Card */}
              <div
                className={`p-4 border transition-colors ${
                  demoComplete
                    ? "border-[#8ce9d4]/50 bg-gradient-to-br from-[#8ce9d4]/10 to-[#121a1e]/90"
                    : "border-[#d5fa70]/25 bg-gradient-to-br from-[#d5fa70]/10 to-[#121a1e]/90"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="grid w-8 h-8 place-items-center text-[#d5fa70]">
                    <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
                      <path
                        d="M5 4.8h9.4L19 9.4v9.8H5V4.8Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M14 5v5h5M8.5 13h7M8.5 16h5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-dm-mono text-[8px] tracking-[0.12em] text-gray-400">
                      BLUEPRINT SNAPSHOT
                    </p>
                    <h3 className="font-display-grotesk text-sm font-semibold text-white">
                      {snapshotTitle}
                    </h3>
                  </div>
                  <span className="ml-auto px-2 py-1 border border-[#d5fa70]/30 font-dm-mono text-[8px] tracking-[0.1em] text-[#d5fa70]">
                    {snapshotTag}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-3.5">
                  <div className="p-2.5 bg-black/40 flex flex-col gap-1">
                    <span className="font-dm-mono text-[8px] text-gray-400">01 / PRODUCT</span>
                    <strong className="text-[10px] text-gray-200 font-semibold leading-snug">
                      {demoComplete ? "Problem & user framing" : "Meal rescue, matched in minutes"}
                    </strong>
                  </div>
                  <div className="p-2.5 bg-black/40 flex flex-col gap-1">
                    <span className="font-dm-mono text-[8px] text-gray-400">02 / MVP SCOPE</span>
                    <strong className="text-[10px] text-gray-200 font-semibold leading-snug">
                      {demoComplete ? "First features to validate" : "Post · claim · pickup"}
                    </strong>
                  </div>
                  <div className="p-2.5 bg-black/40 flex flex-col gap-1">
                    <span className="font-dm-mono text-[8px] text-gray-400">03 / BUILD PATH</span>
                    <strong className="text-[10px] text-gray-200 font-semibold leading-snug">
                      {demoComplete ? "Architecture + Master Prompt" : "Web app + live inventory"}
                    </strong>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 mt-4 pt-3 border-t border-white/10">
                  <button
                    type="button"
                    onClick={handlePlayStudioDemo}
                    disabled={demoRunning}
                    className="inline-flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/15 text-white font-dm-mono text-[10px] tracking-wider transition-all"
                  >
                    <span>{demoComplete ? "Play again" : "Play the flow"}</span>
                    <span aria-hidden="true">↗</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleGenerate(studioBrief)}
                    disabled={isLoading || !studioBrief.trim()}
                    className="inline-flex items-center gap-2 px-3.5 py-2 bg-[#d5fa70] hover:bg-[#e2ff96] text-[#0a0d13] font-extrabold text-[11px] transition-all shadow-md"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Forging AI Blueprint...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Forge Live AI Blueprint ↗</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Chips from Reference */}
          <div className="hidden sm:flex absolute -top-3 -right-5 z-20 items-center gap-2 px-3 py-2 border border-white/15 bg-[#141b22] text-gray-200 font-dm-mono text-[9px] tracking-[0.1em] shadow-xl">
            <span className="w-2 h-2 rounded-full bg-[#d5fa70] shadow-[0_0_8px_#d5fa70]" />
            IDEAS → ACTION
          </div>
          <div className="hidden sm:flex absolute -bottom-4 -left-5 z-20 items-center gap-2 px-3 py-2 border border-white/15 bg-[#141b22] text-gray-300 font-dm-mono text-[9px] shadow-xl">
            <span className="text-[#d5fa70] text-xs">✳</span> Built for the build weekend
          </div>
        </div>
      </section>

      {/* ================= MOVING TICKER BAND (Reference: ticker-band) ================= */}
      <section
        className="overflow-hidden border-y border-black/20 bg-[#d5fa70] text-[#0a0d13]"
        aria-label="HackForge AI blueprint components"
      >
        <div className="hf-ticker-track font-extrabold" aria-hidden="true">
          <span>FROM BRIEF</span>
          <b>✳</b>
          <span>TO PRODUCT SCOPE</span>
          <b>✳</b>
          <span>TO SYSTEM DESIGN</span>
          <b>✳</b>
          <span>TO BUILD ROADMAP</span>
          <b>✳</b>
          <span>TO AI BUILDER PROMPT</span>
          <b>✳</b>
          <span>FROM BRIEF</span>
          <b>✳</b>
          <span>TO PRODUCT SCOPE</span>
          <b>✳</b>
          <span>TO SYSTEM DESIGN</span>
          <b>✳</b>
          <span>TO BUILD ROADMAP</span>
          <b>✳</b>
          <span>TO AI BUILDER PROMPT</span>
          <b>✳</b>
        </div>
      </section>

      {/* ================= LIVE LANGGRAPH AI BLUEPRINT FORGE WORKSPACE (#forge-studio) ================= */}
      <section id="forge-studio" className="max-w-5xl mx-auto px-6 py-20 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <p className="font-dm-mono text-[10px] tracking-[0.14em] uppercase text-[#d5fa70] flex items-center gap-2 mb-3">
              <span className="text-gray-500">00</span> LIVE MULTI-AGENT STUDIO
            </p>
            <h2 className="font-editorial text-4xl sm:text-5xl font-semibold tracking-tight">
              Forge your live{" "}
              <span className="text-[#d5fa70] italic font-normal">project blueprint.</span>
            </h2>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="px-4 py-2.5 border border-white/10 bg-white/5">
              <div className="font-dm-mono text-lg font-bold text-[#d5fa70]">
                <CountUp end={5} />
              </div>
              <div className="font-dm-mono text-[9px] text-gray-400 uppercase tracking-wider">
                AI Agents
              </div>
            </div>
            <div className="px-4 py-2.5 border border-white/10 bg-white/5">
              <div className="font-dm-mono text-lg font-bold text-[#aaa0ff]">
                <CountUp end={4} />
              </div>
              <div className="font-dm-mono text-[9px] text-gray-400 uppercase tracking-wider">
                Output Tabs
              </div>
            </div>
            <div className="px-4 py-2.5 border border-white/10 bg-white/5">
              <div className="font-dm-mono text-lg font-bold text-[#8ce9d4]">
                <CountUp end={100} suffix="%" />
              </div>
              <div className="font-dm-mono text-[9px] text-gray-400 uppercase tracking-wider">
                Live Export
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="text-xs font-bold underline">
              Dismiss
            </button>
          </div>
        )}

        {blueprintData ? (
          <div className="space-y-4">
            <button
              onClick={() => setBlueprintData(null)}
              className="inline-flex items-center gap-2 text-xs font-semibold text-[#d5fa70] hover:underline transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Forge Another Blueprint
            </button>
            <BlueprintDisplay data={blueprintData} onReset={() => setBlueprintData(null)} />
          </div>
        ) : (
          <InputForm onSubmit={handleGenerate} isLoading={isLoading} />
        )}
      </section>

      {/* ================= SECTION 01: WORKFLOW (Reference: #workflow) ================= */}
      <section
        id="workflow"
        className="max-w-7xl mx-auto px-6 py-20 border-t border-white/10"
        aria-labelledby="workflow-title"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-14">
          <div className="lg:col-span-7">
            <p className="font-dm-mono text-[10px] tracking-[0.14em] text-[#d5fa70] mb-4">
              <span className="text-gray-500 pr-2">01</span> A CLEARER WAY TO START
            </p>
            <h2
              id="workflow-title"
              className="font-editorial text-4xl sm:text-6xl font-semibold tracking-tight leading-[1.02]"
            >
              From “what if?”
              <br />
              <span className="text-gray-500 italic font-normal">to “let’s build.”</span>
            </h2>
          </div>
          <p className="lg:col-span-5 text-sm text-gray-400 leading-relaxed">
            HackForge gives a promising prompt the structure it needs. Each specialist adds a
            different lens, so your team can move from open questions to aligned next steps.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border border-white/15">
          {WORKFLOW_STEPS.map((step, idx) => (
            <SpotlightCard
              key={step.num}
              spotlightColor="rgba(213, 250, 112, 0.14)"
              className={`rounded-none border-0 ${
                idx < 3 ? "lg:border-r border-b lg:border-b-0 border-white/15" : ""
              } p-6 flex flex-col justify-between min-h-[250px] bg-transparent`}
            >
              <div className="flex items-center justify-between">
                <span className="font-dm-mono text-xs text-gray-500">{step.num}</span>
                <span className="grid w-8 h-8 place-items-center border border-[#d5fa70]/35 text-[#d5fa70] text-base">
                  {step.icon}
                </span>
              </div>
              <div className="my-8">
                <h3 className="font-display-grotesk text-xl font-semibold text-white mb-2.5">
                  {step.title}
                </h3>
                <p className="text-xs text-gray-400 leading-relaxed">{step.desc}</p>
              </div>
              <span className="font-dm-mono text-[9px] tracking-[0.1em] text-gray-500">
                {step.footLeft} <b className="text-[#d5fa70] px-1">·</b> {step.footRight}
              </span>
            </SpotlightCard>
          ))}
        </div>
      </section>

      {/* ================= SECTION 02: YOUR MULTI-AGENT CREW (Reference: #agents) ================= */}
      <section
        id="agents"
        className="bg-[#101720]/90 border-y border-white/10 py-24"
        aria-labelledby="agents-title"
      >
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-6">
            <p className="font-dm-mono text-[10px] tracking-[0.14em] text-[#d5fa70]">
              <span className="text-gray-500 pr-2">02</span> YOUR MULTI-AGENT CREW
            </p>
            <h2
              id="agents-title"
              className="font-editorial text-4xl sm:text-6xl font-semibold tracking-tight leading-[1.02]"
            >
              Four minds.
              <br />
              <span className="text-gray-500 italic font-normal">One shared mission.</span>
            </h2>
            <p className="text-sm text-gray-400 leading-relaxed max-w-md">
              Not a wall of generic suggestions. A coordinated set of specialist roles that work
              through the same problem from different angles.
            </p>
            <a
              href="#blueprint"
              className="inline-flex items-center gap-2 text-xs font-bold text-gray-200 hover:text-[#d5fa70] transition-colors pt-2"
            >
              <span>See what they make</span>
              <span className="text-[#d5fa70] text-base">↓</span>
            </a>

            {/* Orbital Diagram (Reference: crew-orbit) */}
            <div className="relative w-56 h-56 mt-8" aria-hidden="true">
              <div className="absolute inset-4 rounded-full border border-white/15" />
              <div className="absolute inset-10 rounded-full border border-dashed border-[#d5fa70]/25 hf-spin-slow" />
              <div className="absolute inset-16 rounded-full border border-white/10" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 grid w-14 h-14 place-items-center rounded-full border border-[#d5fa70]/50 bg-[#151e25] text-[#d5fa70] font-display-grotesk font-bold">
                HF
              </div>
              <span className="absolute top-2 left-1/2 -translate-x-1/2 grid w-8 h-8 place-items-center rounded-full bg-[#d5fa70] text-[#0a0d13] font-display-grotesk text-xs font-extrabold">
                P
              </span>
              <span className="absolute top-1/2 right-1 -translate-y-1/2 grid w-8 h-8 place-items-center rounded-full bg-[#aaa0ff] text-[#0a0d13] font-display-grotesk text-xs font-extrabold">
                A
              </span>
              <span className="absolute bottom-2 left-1/2 -translate-x-1/2 grid w-8 h-8 place-items-center rounded-full bg-[#8ce9d4] text-[#0a0d13] font-display-grotesk text-xs font-extrabold">
                D
              </span>
              <span className="absolute top-1/2 left-1 -translate-y-1/2 grid w-8 h-8 place-items-center rounded-full bg-[#ffbf92] text-[#0a0d13] font-display-grotesk text-xs font-extrabold">
                R
              </span>
            </div>
          </div>

          <div className="lg:col-span-7 border-t border-white/15">
            {AGENT_CARDS.map((agent) => (
              <article
                key={agent.letter}
                className="group grid grid-cols-[48px_1fr_24px] gap-4 items-center min-h-[116px] py-5 border-b border-white/15 hover:px-3 hover:bg-white/[0.03] transition-all"
              >
                <span
                  className={`grid w-11 h-11 place-items-center border font-display-grotesk text-base font-bold ${agent.colorClass}`}
                >
                  {agent.letter}
                </span>
                <div>
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="font-display-grotesk text-lg font-semibold text-white">
                      {agent.name}
                    </h3>
                    <span className="font-dm-mono text-[9px] tracking-[0.12em] text-gray-500">
                      {agent.stage}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1.5 max-w-lg leading-relaxed">
                    {agent.desc}
                  </p>
                </div>
                <span
                  className="text-gray-500 group-hover:text-[#d5fa70] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all text-base"
                  aria-hidden="true"
                >
                  ↗
                </span>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ================= SECTION 03: THE OUTPUT (Reference: #blueprint) ================= */}
      <section
        id="blueprint"
        className="max-w-7xl mx-auto px-6 py-24"
        aria-labelledby="blueprint-title"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-16">
          <div className="lg:col-span-7">
            <p className="font-dm-mono text-[10px] tracking-[0.14em] text-[#d5fa70] mb-4">
              <span className="text-gray-500 pr-2">03</span> THE OUTPUT
            </p>
            <h2
              id="blueprint-title"
              className="font-editorial text-4xl sm:text-6xl font-semibold tracking-tight leading-[1.02]"
            >
              A project plan with
              <br />
              <span className="text-gray-500 italic font-normal">its sleeves rolled up.</span>
            </h2>
          </div>
          <p className="lg:col-span-5 text-sm text-gray-400 leading-relaxed">
            One coherent blueprint to help your team decide what to build, how it fits together,
            and what to tackle first—not four disconnected takes.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 items-center">
          {/* Rotated Blueprint Paper Visual (Reference: doc-paper) */}
          <div className="lg:col-span-5 relative flex items-center justify-center py-6">
            <div className="relative w-full max-w-[390px] min-h-[370px] p-6 border border-black/20 bg-[#e9eddf] text-[#1b231e] shadow-[14px_18px_0_rgba(213,250,112,0.22),0_25px_64px_rgba(0,0,0,0.35)] -rotate-2">
              <div className="flex justify-between pb-3 border-b border-black/20 font-dm-mono text-[9px] tracking-[0.1em] text-[#525c53]">
                <span>HACKFORGE / PROJECT BLUEPRINT</span>
                <span>HF—001</span>
              </div>
              <div className="relative min-h-[195px] pt-7 border-b border-black/20">
                <div className="absolute top-6 right-0 text-[#6c9630] text-3xl" aria-hidden="true">
                  ✳
                </div>
                <span className="font-dm-mono text-[9px] text-[#5e6d57]">
                  PROJECT BLUEPRINT <i className="text-[#729c39] not-italic">·</i> v2.0
                </span>
                <h3 className="my-4 font-editorial text-5xl font-semibold leading-[0.95] tracking-tight">
                  Campus
                  <br />
                  <em className="text-[#6c9630] italic">food rescue.</em>
                </h3>
                <p className="text-xs text-[#626b62]">Make good food find its people.</p>
              </div>
              <div className="grid gap-2.5 pt-4 font-dm-mono text-[9px] text-[#49534b]">
                <div className="flex justify-between">
                  <span>
                    <b className="text-[#6c9630] mr-2">01</b> Product vision
                  </span>
                  <span>02</span>
                </div>
                <div className="flex justify-between">
                  <span>
                    <b className="text-[#6c9630] mr-2">02</b> MVP features
                  </span>
                  <span>04</span>
                </div>
                <div className="flex justify-between">
                  <span>
                    <b className="text-[#6c9630] mr-2">03</b> System design
                  </span>
                  <span>07</span>
                </div>
                <div className="flex justify-between">
                  <span>
                    <b className="text-[#6c9630] mr-2">04</b> Builder prompt
                  </span>
                  <span>10</span>
                </div>
              </div>
              <div className="absolute right-4 bottom-20 px-2.5 py-1.5 border border-[#6c9630]/60 text-[#688239] font-dm-mono text-[8px] leading-tight tracking-[0.12em] text-center rotate-6">
                LIVE AI
                <br />
                ENGINE
              </div>
            </div>
          </div>

          {/* Deliverable Rows */}
          <div className="lg:col-span-7 border-t border-white/15">
            {DELIVERABLES.map((item) => (
              <article
                key={item.num}
                className="group grid grid-cols-[36px_1fr_20px] gap-4 items-start py-6 border-b border-white/15"
              >
                <span className="font-dm-mono text-xs text-[#d5fa70] pt-1">{item.num}</span>
                <div>
                  <h3 className="font-display-grotesk text-lg font-semibold text-white">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-400 mt-1.5 max-w-md leading-relaxed">
                    {item.desc}
                  </p>
                </div>
                <span
                  className="text-gray-500 group-hover:text-[#d5fa70] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
                  aria-hidden="true"
                >
                  ↗
                </span>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ================= SECTION 04: WHY PLAN WITH HACKFORGE (Reference: benefits-band) ================= */}
      <section
        className="bg-[#151e24]/90 border-y border-white/10 py-24"
        aria-labelledby="benefits-title"
      >
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5">
            <p className="font-dm-mono text-[10px] tracking-[0.14em] text-[#d5fa70] mb-4">
              <span className="text-gray-500 pr-2">04</span> WHY PLAN WITH HACKFORGE
            </p>
            <h2
              id="benefits-title"
              className="font-editorial text-4xl sm:text-6xl font-semibold tracking-tight leading-[1.02]"
            >
              Make room for
              <br />
              <span className="text-gray-500 italic font-normal">the fun part.</span>
            </h2>
            <p className="text-sm text-gray-400 mt-5 max-w-sm leading-relaxed">
              Less time circling the prompt. More time building something your team believes in.
            </p>
          </div>

          <div className="lg:col-span-7 border-t border-white/15">
            {BENEFITS.map((b) => (
              <article
                key={b.num}
                className="grid grid-cols-[44px_1fr] gap-4 py-6 border-b border-white/15"
              >
                <span className="font-dm-mono text-xs text-[#d5fa70]">{b.num}</span>
                <div>
                  <h3 className="font-display-grotesk text-lg font-semibold text-white">
                    {b.title}
                  </h3>
                  <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">{b.desc}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FINAL CTA SECTION (Reference: #start) ================= */}
      <section
        id="start"
        className="max-w-4xl mx-auto px-6 py-24 text-center space-y-6"
        aria-labelledby="final-title"
      >
        <div
          className="relative grid w-12 h-12 mx-auto place-items-center border border-[#d5fa70]/40 text-[#d5fa70] font-display-grotesk text-xl font-bold"
          aria-hidden="true"
        >
          <span>H</span>
          <i className="absolute -top-2 -right-2.5 text-[#d5fa70] text-sm not-italic">✳</i>
        </div>

        <p className="font-dm-mono text-[10px] tracking-[0.14em] text-[#d5fa70] flex items-center justify-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#d5fa70]" />
          YOUR NEXT GREAT BUILD STARTS HERE
        </p>

        <h2
          id="final-title"
          className="font-editorial text-5xl sm:text-7xl font-semibold tracking-tight leading-[0.98]"
        >
          Bring the prompt.
          <br />
          <span className="text-[#d5fa70] italic font-normal">Leave with a plan.</span>
        </h2>

        <p className="text-sm text-gray-400 max-w-md mx-auto leading-relaxed">
          Give your hackathon idea a team of specialist perspectives—and a blueprint that points
          toward the first commit.
        </p>

        <div className="pt-2">
          <a
            href="#forge-studio"
            className="inline-flex items-center justify-center gap-4 min-h-[52px] px-7 bg-[#d5fa70] hover:bg-[#e2ff96] text-[#0a0d13] text-xs font-extrabold tracking-wide transition-all hover:-translate-y-0.5 shadow-xl shadow-[#d5fa70]/15"
          >
            <span>Launch Live Blueprint Studio</span>
            <span aria-hidden="true" className="text-base">
              ↗
            </span>
          </a>
        </div>
      </section>
    </div>
  );
}
