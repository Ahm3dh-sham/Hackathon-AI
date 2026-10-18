"use client";

import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import {
  BlueprintDisplay,
  BlueprintTab,
  ProjectStateBlueprint,
} from "@/components/BlueprintDisplay";
import { DecryptedText } from "@/components/react-bits/DecryptedText";
import { SpotlightCard } from "@/components/react-bits/SpotlightCard";
import { CountUp } from "@/components/react-bits/CountUp";
import { FlyoverIntroOverlay } from "@/components/FlyoverShowcase";
import {
  ArrowLeft,
  Loader2,
  Quote,
  CheckCircle2,
  Layers,
  Cpu,
  Users,
  Presentation,
} from "lucide-react";

const PRESET_BRIEFS = [
  {
    label: "Campus Food Rescue",
    prompt: "Students want to rescue surplus campus meals before they go to waste.",
  },
  {
    label: "AI Medical Triage",
    prompt:
      "Build an autonomous multi-modal AI triage assistant for rural emergency clinics with real-time symptom risk scoring and HL7 FHIR sync.",
  },
  {
    label: "Scope-3 Carbon Ledger",
    prompt:
      "Create an automated Scope-3 supply chain carbon emissions tracker that ingests supplier invoices and predicts reduction pathways.",
  },
  {
    label: "Zero-Trust Smart Contract Auditor",
    prompt:
      "Design a real-time Solidity & Rust smart contract vulnerability scanner that detects reentrancy and flash-loan vectors before deployment.",
  },
];

export default function Home() {
  // Show the Embedded 3D Fly-Over Showcase FIRST when the link is opened, then reveal the landing page
  const [showFlyoverIntro, setShowFlyoverIntro] = useState(true);
  const [brief, setBrief] = useState(
    "Students want to rescue surplus campus meals before they go to waste."
  );
  const [teamSize, setTeamSize] = useState<number>(4);
  const [dossierTab, setDossierTab] = useState<BlueprintTab>("research");
  const [activeAgentIdx, setActiveAgentIdx] = useState<number>(-1);
  const [completedUpTo, setCompletedUpTo] = useState<number>(-1);
  const [statusState, setStatusState] = useState<"idle" | "running" | "done">("idle");
  const [outputTitle, setOutputTitle] = useState("Campus food rescue");
  const [snapshotTag, setSnapshotTag] = useState("SAMPLE");
  const [isReady, setIsReady] = useState(false);

  // Live LangGraph AI Blueprint State
  const [blueprintData, setBlueprintData] = useState<ProjectStateBlueprint | null>(null);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const heroCopyRef = useRef<HTMLDivElement>(null);
  const previewWindowRef = useRef<HTMLDivElement>(null);
  const liveBlueprintRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("capture") === "1") {
      setShowFlyoverIntro(false);
    }
  }, []);

  // Listen for top navbar "#talkscript" clicks to open the TalkScript & PPT studio immediately
  useEffect(() => {
    const handleHashOrClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest('a[href="#talkscript"]');
      if (target) {
        e.preventDefault();
        handlePlayAndGenerate("talkscript");
      }
    };
    document.addEventListener("click", handleHashOrClick);
    return () => document.removeEventListener("click", handleHashOrClick);
  });

  // GSAP Entrance Animation when the actual landing page opens after the 3D Fly-Over Intro
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("capture") === "1" || showFlyoverIntro) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      if (heroCopyRef.current) {
        tl.fromTo(
          heroCopyRef.current.children,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.65, stagger: 0.08 }
        );
      }
      if (previewWindowRef.current) {
        tl.fromTo(
          previewWindowRef.current,
          { y: 18, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.75 },
          "-=0.4"
        );
      }
    });
    return () => ctx.revert();
  }, [showFlyoverIntro]);

  const deriveProjectLabel = (text: string) => {
    const normalized = text.trim().replace(/[“”"']/g, "");
    if (!normalized) return "Your project idea";
    const words = normalized.split(/\s+/).slice(0, 5).join(" ");
    return words.length < normalized.length ? `${words}…` : words;
  };

  // Interactive "Play the flow" + Real AI Blueprint & TalkScript Generation
  const handlePlayAndGenerate = async (targetTab: BlueprintTab = "research") => {
    if (statusState === "running" || isGeneratingAI || !brief.trim()) {
      if (blueprintData) {
        setDossierTab(targetTab);
        liveBlueprintRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      return;
    }

    setDossierTab(targetTab);
    setError(null);
    setStatusState("running");
    setIsReady(false);
    setActiveAgentIdx(-1);
    setCompletedUpTo(-1);
    setOutputTitle("Reading your problem…");
    setSnapshotTag("MAPPING");
    setIsGeneratingAI(true);

    const fetchPromise = fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        problem_statement: brief.trim(),
        team_size: teamSize,
      }),
    });

    for (let i = 0; i < 4; i++) {
      setActiveAgentIdx(i);
      await new Promise((r) => setTimeout(r, 380));
      setCompletedUpTo(i);
    }
    setActiveAgentIdx(-1);

    try {
      const response = await fetchPromise;
      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || "Generation failed. Please try again.");
      }
      const data: ProjectStateBlueprint = await response.json();
      setBlueprintData(data);
      setOutputTitle(data.product_spec?.project_name || deriveProjectLabel(brief));
      setSnapshotTag("AI READY");
      setIsReady(true);
      setStatusState("done");

      setTimeout(() => {
        liveBlueprintRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 150);
    } catch (err: any) {
      setOutputTitle(deriveProjectLabel(brief));
      setSnapshotTag("ILLUSTRATIVE");
      setIsReady(true);
      setStatusState("done");
      setError(err.message || "Could not connect to AI backend.");
    } finally {
      setIsGeneratingAI(false);
    }
  };

  return (
    <>
      {/* ================= FIRST-LOAD 3D WEBGL2 FLY-OVER INTRO SHOWCASE ================= */}
      <FlyoverIntroOverlay
        isOpen={showFlyoverIntro}
        onEnterLandingPage={() => setShowFlyoverIntro(false)}
      />

      {/* ================= HERO SECTION (Editorial Warm Linen + 3D Layer Markers) ================= */}
      <section className="hero section-wrap" id="top" aria-labelledby="hero-title">
        <div className="hero-copy" ref={heroCopyRef}>
          <p className="eyebrow">
            <span className="eyebrow-dot"></span>{" "}
            <DecryptedText text="THE HACKATHON STARTING LINE" speed={24} />
          </p>
          <h1 id="hero-title">
            A bold idea deserves <span className="headline-accent">a build plan.</span>
          </h1>
          <p className="hero-description">
            Turn a raw problem statement into a complete project blueprint—shaped by a crew of
            specialist AI agents, ready for your team to build in fifteen seconds.
          </p>
          <div className="hero-actions">
            <a
              className="button button-primary"
              href="#product"
              data-layer="hero-button"
            >
              See a blueprint take shape <span aria-hidden="true">↗</span>
            </a>
            <a className="text-link" href="#workflow">
              Meet your agent crew <span aria-hidden="true">↓</span>
            </a>
          </div>

          {/* Live Telemetry Counters (React Bits CountUp + GSAP) */}
          <div className="grid grid-cols-3 gap-4 pt-6 mt-6 border-t border-[#463c2b]/15 max-w-md">
            <div>
              <p className="font-serif text-3xl font-bold text-[#292720] leading-none">
                <CountUp end={14.8} decimals={1} suffix="s" />
              </p>
              <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#726d62]">
                SYNTHESIS SPEED
              </span>
            </div>
            <div>
              <p className="font-serif text-3xl font-bold text-[#394b3f] leading-none">
                <CountUp end={4} suffix=" Agents" />
              </p>
              <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#726d62]">
                LANGGRAPH CREW
              </span>
            </div>
            <div>
              <p className="font-serif text-3xl font-bold text-[#80643d] leading-none">
                <CountUp end={96} suffix="%" />
              </p>
              <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#726d62]">
                MVP FEASIBILITY
              </span>
            </div>
          </div>

          <div className="hero-proof" aria-label="HackForge AI process">
            <div className="proof-symbols" aria-hidden="true">
              <span>P</span>
              <span>A</span>
              <span>D</span>
              <span>R</span>
            </div>
            <p>
              <strong>One shared brief.</strong> Four specialist perspectives.
              <br />
              <span>One plan your team can rally around.</span>
            </p>
          </div>
        </div>

        <div className="hero-visual" id="product">
          <div className="orbit orbit-one" aria-hidden="true"></div>
          <div className="orbit orbit-two" aria-hidden="true"></div>
          <div className="spark spark-a" aria-hidden="true">
            ✳
          </div>
          <div className="spark spark-b" aria-hidden="true">
            +
          </div>

          <div
            className="preview-window"
            ref={previewWindowRef}
            data-layer="hero-mockup"
          >
            <div className="preview-topbar">
              <div className="window-controls" aria-hidden="true">
                <i></i>
                <i></i>
                <i></i>
              </div>
              <span className="preview-app-title">
                <span className="mini-mark">H</span> HACKFORGE{" "}
                <span className="muted-slash">/</span> BLUEPRINT STUDIO
              </span>
              <span className="demo-badge">
                <span></span> LIVE AI STUDIO
              </span>
            </div>

            <div className="preview-inner">
              <div className="preview-heading-row">
                <div>
                  <p className="micro-label">
                    NEW PROJECT <span className="micro-dot">/</span> 00:15
                  </p>
                  <h2>
                    Your idea, <span>in formation.</span>
                  </h2>
                </div>
                <span className="preview-version">01</span>
              </div>

              {/* Quick Preset Pills */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                {PRESET_BRIEFS.map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => {
                      setBrief(item.prompt);
                      setOutputTitle(item.label);
                    }}
                    className={`px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider border transition-colors ${
                      brief === item.prompt
                        ? "bg-[#394b3f] text-[#fffdf8] border-[#394b3f]"
                        : "bg-[#f7f4ed] text-[#5e5a50] border-[#d8cfc0] hover:border-[#80643d]"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              <label className="brief-label" htmlFor="brief-input">
                THE CHALLENGE
              </label>
              <div className="brief-box">
                <span className="quote-mark" aria-hidden="true">
                  “
                </span>
                <textarea
                  id="brief-input"
                  maxLength={500}
                  value={brief}
                  onChange={(e) => setBrief(e.target.value)}
                  aria-describedby="brief-note brief-count"
                  placeholder="Enter your hackathon problem statement..."
                />
                <div className="brief-meta">
                  <span id="brief-note">Enter any hackathon problem statement</span>
                  <span id="brief-count">{brief.length} / 500</span>
                </div>
              </div>

              {/* NEW INPUT: NO. OF TEAMMATES FOR TALKSCRIPT & PPT */}
              <div className="mt-3 p-3 bg-[#f7f4ed] border border-[#d8cfc0] flex flex-wrap items-center justify-between gap-2">
                <label
                  htmlFor="team-size-input"
                  className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#292720] font-bold flex items-center gap-1.5"
                >
                  <Users className="w-3.5 h-3.5 text-[#80643d]" /> NO. OF TEAMMATES (TALKSCRIPT &amp; PPT)
                </label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setTeamSize(num)}
                      className={`w-6 h-6 text-[11px] font-mono font-bold border transition-colors ${
                        teamSize === num
                          ? "bg-[#394b3f] text-[#fffdf8] border-[#394b3f]"
                          : "bg-[#fffdf8] text-[#5e5a50] border-[#d8cfc0] hover:border-[#80643d]"
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                  <input
                    id="team-size-input"
                    type="number"
                    min={1}
                    max={10}
                    value={teamSize}
                    onChange={(e) =>
                      setTeamSize(Math.max(1, Math.min(10, Number(e.target.value) || 1)))
                    }
                    className="w-12 h-6 px-1.5 text-xs font-mono font-bold bg-[#fffdf8] border border-[#c9b99d] text-[#292720] text-center"
                    aria-label="Number of teammates"
                  />
                </div>
              </div>

              <div className="agents-bar">
                <div className="agents-bar-heading">
                  <span className="micro-label">SPECIALIST AGENTS</span>
                  <span
                    className={`agent-status ${
                      statusState === "running"
                        ? "is-running"
                        : statusState === "done"
                        ? "is-done"
                        : ""
                    }`}
                    id="agent-status"
                  >
                    <i></i>{" "}
                    {statusState === "running"
                      ? "MAPPING THE BRIEF"
                      : statusState === "done"
                      ? "BLUEPRINT COMPLETE"
                      : "READY TO MAP"}
                  </span>
                </div>
                <div className="agent-track" aria-label="Four specialist agents">
                  {[
                    { key: "product", code: "P", label: "PRODUCT", cls: "icon-product" },
                    { key: "architecture", code: "A", label: "ARCH", cls: "icon-architecture" },
                    { key: "design", code: "D", label: "DESIGN", cls: "icon-design" },
                    { key: "delivery", code: "R", label: "DELIVERY", cls: "icon-delivery" },
                  ].map((node, index) => {
                    const isActive = activeAgentIdx === index;
                    const isComplete = completedUpTo >= index && activeAgentIdx !== index;
                    return (
                      <React.Fragment key={node.key}>
                        <div
                          className={`agent-node ${isActive ? "is-active" : ""} ${
                            isComplete ? "is-complete" : ""
                          }`}
                          data-agent={node.key}
                        >
                          <span className={`node-icon ${node.cls}`}>{node.code}</span>
                          <span>{node.label}</span>
                        </div>
                        {index < 3 && <span className="track-line" aria-hidden="true"></span>}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>

              <div
                className={`blueprint-card ${isReady ? "is-ready" : ""}`}
                id="demo-output"
                aria-live="polite"
                aria-busy={isGeneratingAI}
              >
                <div className="blueprint-card-head">
                  <div className="blueprint-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none">
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
                    <p className="micro-label">BLUEPRINT SNAPSHOT</p>
                    <h3 id="output-title">{outputTitle}</h3>
                  </div>
                  <span className="snapshot-tag" id="snapshot-tag">
                    {snapshotTag}
                  </span>
                </div>
                <div className="snapshot-grid" id="snapshot-grid">
                  <div className="snapshot-item">
                    <span>01 / PRODUCT</span>
                    <strong>
                      {isReady
                        ? blueprintData?.research_data?.domain_category ||
                          "Problem and user framing"
                        : "Meal rescue, matched in minutes"}
                    </strong>
                  </div>
                  <div className="snapshot-item">
                    <span>02 / MVP SCOPE</span>
                    <strong>
                      {isReady
                        ? `${blueprintData?.product_spec?.mvp_features?.length || 4} Core MVP Features`
                        : "Post · claim · pickup"}
                    </strong>
                  </div>
                  <div className="snapshot-item">
                    <span>03 / TALKSCRIPT &amp; PPT</span>
                    <strong>
                      {teamSize} Teammate{teamSize > 1 ? "s" : ""} · 8-Slide Deck
                    </strong>
                  </div>
                </div>
                <div className="preview-footer flex-wrap gap-2">
                  <span className="illustrative-note">
                    <span>i</span>{" "}
                    {isGeneratingAI
                      ? "Running LangGraph Multi-Agent Pipeline..."
                      : "Powered by live LangGraph multi-agent engine"}
                  </span>
                  <div className="flex items-center gap-2 ml-auto">
                    <button
                      type="button"
                      onClick={() => handlePlayAndGenerate("talkscript")}
                      disabled={isGeneratingAI}
                      className="px-3 py-2 text-[11px] font-mono font-bold uppercase tracking-wider bg-[#80643d] hover:bg-[#68512f] text-[#fffdf8] transition-colors inline-flex items-center gap-1.5"
                    >
                      <Presentation className="w-3.5 h-3.5" />
                      TalkScript &amp; PPT
                    </button>
                    <button
                      className="run-demo"
                      id="run-demo"
                      type="button"
                      onClick={() => handlePlayAndGenerate("research")}
                      disabled={isGeneratingAI}
                    >
                      {isGeneratingAI ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          Forging Blueprint...
                        </>
                      ) : isReady ? (
                        <>
                          Generate again <span aria-hidden="true">↗</span>
                        </>
                      ) : (
                        <>
                          Play the flow <span aria-hidden="true">↗</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
              {error && (
                <p className="text-xs text-rose-700 font-semibold mt-2 text-right">{error}</p>
              )}
              <p className="demo-disclaimer">
                Enter your problem statement &amp; number of teammates above, then click &ldquo;Play
                the flow&rdquo; or &ldquo;TalkScript &amp; PPT&rdquo;.
              </p>
            </div>
          </div>

          <div className="float-chip chip-top" data-layer="hero-chip-top">
            <span className="chip-dot"></span> IDEAS → ACTION
          </div>
          <div className="float-chip chip-bottom" data-layer="hero-chip-bottom">
            <span className="chip-icon">✳</span> Built for the build weekend
          </div>
        </div>
      </section>

      {/* ================= GENERATED LIVE BLUEPRINT DISPLAY (Editorial Studio Dossier) ================= */}
      {blueprintData && (
        <section
          ref={liveBlueprintRef}
          id="live-blueprint-output"
          className="section-wrap py-12 space-y-4"
        >
          <div className="flex items-center justify-between">
            <button
              onClick={() => setBlueprintData(null)}
              className="inline-flex items-center gap-2 text-xs font-bold text-[#394b3f] hover:text-[#68512f] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Close Blueprint Dossier
            </button>
            <span className="font-mono text-[10px] tracking-[0.12em] text-[#725a36] uppercase">
              HACKFORGE / GENERATED ARCHITECTURE &amp; TALKSCRIPT DOSSIER
            </span>
          </div>

          <div className="border border-[#d9d0c2] bg-[#fffdf8] shadow-[0_28px_72px_rgba(61,51,37,0.14)] overflow-hidden">
            <div className="preview-topbar">
              <div className="window-controls" aria-hidden="true">
                <i></i>
                <i></i>
                <i></i>
              </div>
              <span className="preview-app-title">
                <span className="mini-mark">H</span> HACKFORGE{" "}
                <span className="muted-slash">/</span> PROJECT BLUEPRINT &amp; TALKSCRIPT DOSSIER
              </span>
              <span className="demo-badge">
                <span></span> VERIFIED OUTPUT
              </span>
            </div>
            <div className="p-6 sm:p-8 bg-[#f7f4ed]/60">
              <BlueprintDisplay
                data={blueprintData}
                teamSize={teamSize}
                onTeamSizeChange={setTeamSize}
                initialTab={dossierTab}
                onReset={() => setBlueprintData(null)}
              />
            </div>
          </div>
        </section>
      )}

      {/* ================= TICKER BAND ================= */}
      <section className="ticker-band" aria-label="HackForge AI blueprint components">
        <div className="ticker-track" aria-hidden="true">
          <span>FROM BRIEF</span>
          <b>✳</b>
          <span>TO PRODUCT SCOPE</span>
          <b>✳</b>
          <span>TO SYSTEM DESIGN</span>
          <b>✳</b>
          <span>TO BUILD ROADMAP</span>
          <b>✳</b>
          <span>FROM BRIEF</span>
          <b>✳</b>
          <span>TO PRODUCT SCOPE</span>
          <b>✳</b>
          <span>TO SYSTEM DESIGN</span>
          <b>✳</b>
          <span>TO BUILD ROADMAP</span>
          <b>✳</b>
        </div>
      </section>

      {/* ================= SECTION 01: WORKFLOW (With Lifted Feature Cards & Edge Chips) ================= */}
      <section
        className="workflow section-wrap section-pad relative"
        id="workflow"
        aria-labelledby="workflow-title"
      >
        <div className="section-heading split-heading">
          <div>
            <p className="eyebrow">
              <span className="section-index">01</span> A CLEARER WAY TO START
            </p>
            <h2 id="workflow-title">
              From “what if?”
              <br />
              <span>to “let’s build.”</span>
            </h2>
          </div>
          <div className="space-y-4">
            <p className="section-intro">
              HackForge gives a promising prompt the structure it needs. Each specialist adds a
              different lens, so your team can move from open questions to aligned next steps.
            </p>
            {/* Section 01 Floating Chips that lift to ~200px and stand up 54° at 1.35-2.7s */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <span
                data-layer="sec2-chip-left"
                className="inline-flex items-center gap-2 px-3.5 py-2 bg-[#fffdf8] border border-[#cab99f] shadow-[0_12px_28px_rgba(61,51,37,0.1)] font-mono text-[11px] font-medium text-[#292720]"
              >
                <Layers className="w-3.5 h-3.5 text-[#80643d]" /> LANGGRAPH · STATEFUL PIPELINE
              </span>
              <span
                data-layer="sec2-chip-right"
                className="inline-flex items-center gap-2 px-3.5 py-2 bg-[#394b3f] border border-[#394b3f] shadow-[0_12px_28px_rgba(41,39,32,0.14)] font-mono text-[11px] font-medium text-[#fffdf8]"
              >
                <Cpu className="w-3.5 h-3.5 text-[#d4b483]" /> SCHEMA + REST API + MASTER PROMPT
              </span>
            </div>
          </div>
        </div>

        <div className="workflow-steps">
          <SpotlightCard
            as="article"
            className="workflow-step step-highlight"
            data-layer="sec2-card-1"
          >
            <div className="step-top">
              <span className="step-number">01</span>
              <span className="step-icon" aria-hidden="true">
                ↘
              </span>
            </div>
            <h3>Decode the brief</h3>
            <p>
              Surface the real problem, who feels it, and the constraints hiding between the lines.
            </p>
            <div className="mt-4 p-2.5 bg-[#f7f4ed] border border-[#dcd2c0] font-mono text-[10px] text-[#5e5a50] flex items-center justify-between">
              <span>FEASIBILITY SCORE</span>
              <strong className="text-[#394b3f]">94 / 100 · VERIFIED</strong>
            </div>
            <span className="step-foot mt-4 block">
              INPUT <b>·</b> YOUR CHALLENGE
            </span>
          </SpotlightCard>

          <SpotlightCard as="article" className="workflow-step">
            <div className="step-top">
              <span className="step-number">02</span>
              <span className="step-icon" aria-hidden="true">
                ⌘
              </span>
            </div>
            <h3>Shape the product</h3>
            <p>
              Turn an opportunity into a focused concept, a clear promise, and a sensible MVP.
            </p>
            <div className="mt-4 p-2.5 bg-[#fffdf8] border border-[#dcd2c0] font-mono text-[10px] text-[#5e5a50] flex items-center justify-between">
              <span>24-48H MVP SCOPE</span>
              <strong className="text-[#80643d]">4 CORE FLOWS</strong>
            </div>
            <span className="step-foot mt-4 block">
              LENS <b>·</b> PRODUCT
            </span>
          </SpotlightCard>

          <SpotlightCard
            as="article"
            className="workflow-step"
            data-layer="sec2-card-2"
          >
            <div className="step-top">
              <span className="step-number">03</span>
              <span className="step-icon" aria-hidden="true">
                ⌬
              </span>
            </div>
            <h3>Map the build</h3>
            <p>
              Connect the experience to the system, the work to the roadmap, and the team to a plan.
            </p>
            <div className="mt-4 p-2.5 bg-[#fffdf8] border border-[#dcd2c0] font-mono text-[10px] text-[#5e5a50] flex items-center justify-between">
              <span>DB + ENDPOINTS</span>
              <strong className="text-[#394b3f]">SQL + OPENAPI 3.1</strong>
            </div>
            <span className="step-foot mt-4 block">
              LENSES <b>·</b> DESIGN + ARCH
            </span>
          </SpotlightCard>

          <SpotlightCard as="article" className="workflow-step">
            <div className="step-top">
              <span className="step-number">04</span>
              <span className="step-icon" aria-hidden="true">
                ↗
              </span>
            </div>
            <h3>Get to making</h3>
            <p>
              Leave the ideation loop with project guidance your crew can discuss, refine, and
              execute.
            </p>
            <div className="mt-4 p-2.5 bg-[#fffdf8] border border-[#dcd2c0] font-mono text-[10px] text-[#5e5a50] flex items-center justify-between">
              <span>BUILDER PROMPT</span>
              <strong className="text-[#80643d]">CURSOR · BOLT · V0</strong>
            </div>
            <span className="step-foot mt-4 block">
              OUTPUT <b>·</b> SHARED BLUEPRINT
            </span>
          </SpotlightCard>
        </div>
        <div className="workflow-rail" aria-hidden="true">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </section>

      {/* ================= SECTION 02: AGENTS ================= */}
      <section className="agents-section section-pad" id="agents" aria-labelledby="agents-title">
        <div className="agents-layout section-wrap">
          <div className="agents-copy">
            <p className="eyebrow">
              <span className="section-index">02</span> YOUR MULTI-AGENT CREW
            </p>
            <h2 id="agents-title">
              Four minds.
              <br />
              <span>One shared mission.</span>
            </h2>
            <p className="section-intro">
              Not a wall of generic suggestions. A coordinated set of specialist roles that work
              through the same problem from different angles.
            </p>
            <a className="text-link light-link" href="#blueprint">
              See what they make <span aria-hidden="true">↓</span>
            </a>
            <div className="crew-orbit" aria-hidden="true">
              <div className="orbit-ring"></div>
              <div className="orbit-center">
                <span>HF</span>
              </div>
              <span className="orbit-avatar orbit-p">P</span>
              <span className="orbit-avatar orbit-a">A</span>
              <span className="orbit-avatar orbit-d">D</span>
              <span className="orbit-avatar orbit-r">R</span>
              <span className="orbit-tick tick-one"></span>
              <span className="orbit-tick tick-two"></span>
            </div>
          </div>
          <div className="agent-list">
            <article className="agent-card" data-layer="agents-card-1">
              <span className="agent-card-icon product-agent">P</span>
              <div className="agent-card-body">
                <div className="agent-card-title">
                  <h3>Product strategist</h3>
                  <span>01 / DISCOVER</span>
                </div>
                <p>
                  Finds the user need, sharpens the value proposition, and keeps the MVP honest.
                </p>
              </div>
              <span className="agent-card-arrow" aria-hidden="true">
                ↗
              </span>
            </article>
            <article className="agent-card" data-layer="agents-card-2">
              <span className="agent-card-icon architect-agent">A</span>
              <div className="agent-card-body">
                <div className="agent-card-title">
                  <h3>Systems architect</h3>
                  <span>02 / STRUCTURE</span>
                </div>
                <p>
                  Connects product choices to a practical technical architecture and buildable
                  stack.
                </p>
              </div>
              <span className="agent-card-arrow" aria-hidden="true">
                ↗
              </span>
            </article>
            <article className="agent-card">
              <span className="agent-card-icon designer-agent">D</span>
              <div className="agent-card-body">
                <div className="agent-card-title">
                  <h3>Experience designer</h3>
                  <span>03 / EXPERIENCE</span>
                </div>
                <p>
                  Maps the important flows and makes the intended experience tangible for the team.
                </p>
              </div>
              <span className="agent-card-arrow" aria-hidden="true">
                ↗
              </span>
            </article>
            <article className="agent-card">
              <span className="agent-card-icon delivery-agent">R</span>
              <div className="agent-card-body">
                <div className="agent-card-title">
                  <h3>Delivery planner</h3>
                  <span>04 / EXECUTION</span>
                </div>
                <p>Turns scope into a sensible sequence, milestones, and a credible demo path.</p>
              </div>
              <span className="agent-card-arrow" aria-hidden="true">
                ↗
              </span>
            </article>
          </div>
        </div>
      </section>

      {/* ================= SECTION 03: THE OUTPUT ================= */}
      <section
        className="blueprint-section section-wrap section-pad"
        id="blueprint"
        aria-labelledby="blueprint-title"
      >
        <div className="section-heading split-heading">
          <div>
            <p className="eyebrow">
              <span className="section-index">03</span> THE OUTPUT
            </p>
            <h2 id="blueprint-title">
              A project plan with
              <br />
              <span>its sleeves rolled up.</span>
            </h2>
          </div>
          <p className="section-intro">
            One coherent blueprint to help your team decide what to build, how it fits together,
            and what to tackle first—not four disconnected takes.
          </p>
        </div>
        <div className="deliverables-layout">
          <div className="deliverable-visual">
            <div className="doc-paper" data-layer="deliverable-paper">
              <div className="doc-topline">
                <span>HACKFORGE / PROJECT BLUEPRINT</span>
                <span>HF—001</span>
              </div>
              <div className="doc-cover">
                <div className="doc-sigil" aria-hidden="true">
                  ✳
                </div>
                <span className="doc-kicker">
                  PROJECT BLUEPRINT <i>·</i> v1.0
                </span>
                <h3>
                  Campus
                  <br />
                  <em>food rescue.</em>
                </h3>
                <p>Make good food find its people.</p>
              </div>
              <div className="doc-index">
                <span>
                  <b>01</b> Product vision <i>........</i> 02
                </span>
                <span>
                  <b>02</b> MVP features <i>...........</i> 04
                </span>
                <span>
                  <b>03</b> System design <i>.........</i> 07
                </span>
                <span>
                  <b>04</b> Build roadmap <i>.........</i> 10
                </span>
              </div>
            </div>
            <div className="deliverable-side-note">
              <span className="side-note-line"></span>
              <span>
                Specific enough to start.
                <br />
                <strong>Flexible enough to improve.</strong>
              </span>
            </div>
          </div>
          <div className="deliverable-list">
            <article className="deliverable-row">
              <span className="deliverable-number">01</span>
              <div>
                <h3>Product scope</h3>
                <p>
                  Problem framing, target users, value proposition, and a focused first version.
                </p>
              </div>
              <span className="deliverable-arrow" aria-hidden="true">
                ↗
              </span>
            </article>
            <article className="deliverable-row">
              <span className="deliverable-number">02</span>
              <div>
                <h3>Feature map</h3>
                <p>
                  Core capabilities, user flows, dependencies, and the right place to draw the MVP
                  line.
                </p>
              </div>
              <span className="deliverable-arrow" aria-hidden="true">
                ↗
              </span>
            </article>
            <article className="deliverable-row">
              <span className="deliverable-number">03</span>
              <div>
                <h3>Technical architecture</h3>
                <p>
                  Key components and how they connect, with implementation guidance to ground the
                  choices.
                </p>
              </div>
              <span className="deliverable-arrow" aria-hidden="true">
                ↗
              </span>
            </article>
            <article className="deliverable-row">
              <span className="deliverable-number">04</span>
              <div>
                <h3>Build roadmap &amp; Builder Prompt</h3>
                <p>
                  Prioritized milestones and a master AI coding prompt to turn the project plan
                  into a hackathon-ready execution path.
                </p>
              </div>
              <span className="deliverable-arrow" aria-hidden="true">
                ↗
              </span>
            </article>
          </div>
        </div>

        {/* ================= EDITORIAL BUILDER TESTIMONIAL CARD (Lifts 22->112px at 5.45-6.3s) ================= */}
        <div className="mt-20">
          <div
            data-layer="testimonial-card"
            className="border border-[#cfc4b2] bg-[#fffdf8] p-8 sm:p-11 shadow-[0_26px_68px_rgba(41,39,32,0.12)] relative"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
              <div className="space-y-4 max-w-3xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#f3ede2] border border-[#d8cfc0] font-mono text-[11px] uppercase tracking-[0.14em] text-[#80643d]">
                  <Quote className="w-3.5 h-3.5" /> FIELD REPORT · GRAND PRIZE FINALIST TEAM
                </div>
                <blockquote className="font-serif text-2xl sm:text-4xl text-[#292720] leading-[1.18] font-semibold">
                  “We walked into the weekend with a two-sentence problem statement. Fifteen
                  seconds later, HackForge handed us our Postgres schema, FastAPI routes, and
                  scoped MVP. <em className="text-[#80643d] font-normal">We shipped 18 hours early.</em>”
                </blockquote>
                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-full bg-[#394b3f] text-[#fffdf8] font-serif font-bold text-lg inline-flex items-center justify-center">
                      AV
                    </span>
                    <div>
                      <strong className="block text-sm text-[#292720]">Aria Vance</strong>
                      <span className="font-mono text-[11px] text-[#726d62]">
                        LEAD SYSTEMS ARCHITECT · STANFORD TREEHACKS WINNER
                      </span>
                    </div>
                  </div>
                  <span className="hidden sm:inline text-[#d5cbb8]">|</span>
                  <span className="inline-flex items-center gap-1.5 font-mono text-xs text-[#394b3f] font-semibold">
                    <CheckCircle2 className="w-4 h-4" /> 14.2s Blueprint Synthesis · 4/4 Agents
                  </span>
                </div>
              </div>

              <div className="lg:w-64 shrink-0 border-t lg:border-t-0 lg:border-l border-[#e3dacb] pt-6 lg:pt-0 lg:pl-8 space-y-3">
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#726d62]">
                  EXPORTED DOSSIER METRICS
                </p>
                <div className="p-3 bg-[#f7f4ed] border border-[#ded5c5]">
                  <span className="font-mono text-[10px] text-[#726d62] block">ARCHITECTURE</span>
                  <strong className="font-serif text-xl text-[#292720]">6 Tables · 8 Routes</strong>
                </div>
                <div className="p-3 bg-[#f7f4ed] border border-[#ded5c5]">
                  <span className="font-mono text-[10px] text-[#726d62] block">BUILDER PROMPT</span>
                  <strong className="font-serif text-xl text-[#394b3f]">Cursor &amp; Bolt Ready</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SECTION 04: BENEFITS BAND ================= */}
      <section className="benefits-band section-pad" aria-labelledby="benefits-title">
        <div className="section-wrap benefits-inner">
          <div className="benefits-heading">
            <p className="eyebrow">
              <span className="section-index">04</span> WHY PLAN WITH HACKFORGE
            </p>
            <h2 id="benefits-title">
              Make room for
              <br />
              <span>the fun part.</span>
            </h2>
            <p>
              Less time circling the prompt. More time building something your team believes in.
            </p>
          </div>
          <div className="benefit-points">
            <article data-layer="benefit-card-1">
              <span className="benefit-mark">01</span>
              <div>
                <h3>Start with a sharper idea</h3>
                <p>Make the problem, user, and project promise clear before the code begins.</p>
              </div>
            </article>
            <article>
              <span className="benefit-mark">02</span>
              <div>
                <h3>Keep the scope buildable</h3>
                <p>Give the big vision a realistic first cut your team can actually take on.</p>
              </div>
            </article>
            <article>
              <span className="benefit-mark">03</span>
              <div>
                <h3>Build from shared context</h3>
                <p>Get product, design, architecture, and execution on the same page.</p>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* ================= FINAL CTA ================= */}
      <section className="final-cta section-wrap section-pad" id="start" aria-labelledby="final-title">
        <div className="cta-stamp" aria-hidden="true">
          <span>H</span>
          <i>✳</i>
        </div>
        <p className="eyebrow">
          <span className="eyebrow-dot"></span> YOUR NEXT GREAT BUILD STARTS HERE
        </p>
        <h2 id="final-title">
          Bring the prompt.
          <br />
          <span>Leave with a plan.</span>
        </h2>
        <p className="cta-description">
          Give your hackathon idea a team of specialist perspectives—and a blueprint that points
          toward the first commit.
        </p>
        <a className="button button-primary cta-button" href="#product">
          Open Blueprint Studio <span aria-hidden="true">↗</span>
        </a>
        <p className="cta-note">
          HackForge AI live multi-agent blueprint generation is connected above in the Blueprint
          Studio.
        </p>
      </section>
    </>
  );
}
