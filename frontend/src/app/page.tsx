"use client";

import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { BlueprintDisplay, ProjectStateBlueprint } from "@/components/BlueprintDisplay";
import { DecryptedText } from "@/components/react-bits/DecryptedText";
import { ArrowLeft, Loader2 } from "lucide-react";

export default function Home() {
  const [brief, setBrief] = useState(
    "Students want to rescue surplus campus meals before they go to waste."
  );
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

  // GSAP Entrance Animation (Starred Repo: greensock/GSAP)
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      if (heroCopyRef.current) {
        tl.fromTo(
          heroCopyRef.current.children,
          { y: 24, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, stagger: 0.1 }
        );
      }
      if (previewWindowRef.current) {
        tl.fromTo(
          previewWindowRef.current,
          { y: 22, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8 },
          "-=0.4"
        );
      }
    });
    return () => ctx.revert();
  }, []);

  const deriveProjectLabel = (text: string) => {
    const normalized = text.trim().replace(/[“”"']/g, "");
    if (!normalized) return "Your project idea";
    const words = normalized.split(/\s+/).slice(0, 5).join(" ");
    return words.length < normalized.length ? `${words}…` : words;
  };

  // Interactive "Play the flow" + Real AI Blueprint Generation
  const handlePlayAndGenerate = async () => {
    if (statusState === "running" || isGeneratingAI || !brief.trim()) return;

    setError(null);
    setStatusState("running");
    setIsReady(false);
    setActiveAgentIdx(-1);
    setCompletedUpTo(-1);
    setOutputTitle("Reading your problem…");
    setSnapshotTag("MAPPING");
    setIsGeneratingAI(true);

    // Kick off the real FastAPI + LangGraph request in parallel with the 4-agent visual trace
    const fetchPromise = fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ problem_statement: brief.trim() }),
    });

    for (let i = 0; i < 4; i++) {
      setActiveAgentIdx(i);
      await new Promise((r) => setTimeout(r, 450));
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
      // Still complete the preview snapshot even if backend errors
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
      {/* ================= HERO SECTION (Exact Manus Reference Structure) ================= */}
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
            specialist AI agents, ready for your team to build.
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href="#product">
              See a blueprint take shape <span aria-hidden="true">↗</span>
            </a>
            <a className="text-link" href="#workflow">
              Meet your agent crew <span aria-hidden="true">↓</span>
            </a>
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

          <div className="preview-window" ref={previewWindowRef}>
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
                    NEW PROJECT <span className="micro-dot">/</span> 00:42
                  </p>
                  <h2>
                    Your idea, <span>in formation.</span>
                  </h2>
                </div>
                <span className="preview-version">01</span>
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
                    <span>03 / BUILD PATH</span>
                    <strong>
                      {isReady
                        ? "Architecture + Master Prompt"
                        : "Web app + live inventory"}
                    </strong>
                  </div>
                </div>
                <div className="preview-footer">
                  <span className="illustrative-note">
                    <span>i</span>{" "}
                    {isGeneratingAI
                      ? "Running LangGraph Multi-Agent Pipeline..."
                      : "Powered by live LangGraph multi-agent engine"}
                  </span>
                  <button
                    className="run-demo"
                    id="run-demo"
                    type="button"
                    onClick={handlePlayAndGenerate}
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
              {error && (
                <p className="text-xs text-rose-700 font-semibold mt-2 text-right">{error}</p>
              )}
              <p className="demo-disclaimer">
                Type any hackathon problem statement above and click &ldquo;Play the flow&rdquo; to
                generate a full blueprint.
              </p>
            </div>
          </div>

          <div className="float-chip chip-top">
            <span className="chip-dot"></span> IDEAS → ACTION
          </div>
          <div className="float-chip chip-bottom">
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
              HACKFORGE / GENERATED ARCHITECTURE DOSSIER
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
                <span className="muted-slash">/</span> PROJECT BLUEPRINT DOSSIER
              </span>
              <span className="demo-badge">
                <span></span> VERIFIED OUTPUT
              </span>
            </div>
            <div className="p-6 sm:p-8 bg-[#f7f4ed]/60">
              <BlueprintDisplay data={blueprintData} onReset={() => setBlueprintData(null)} />
            </div>
          </div>
        </section>
      )}

      {/* ================= TICKER BAND (Exact Manus Reference) ================= */}
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

      {/* ================= SECTION 01: WORKFLOW (Exact Manus Reference) ================= */}
      <section
        className="workflow section-wrap section-pad"
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
          <p className="section-intro">
            HackForge gives a promising prompt the structure it needs. Each specialist adds a
            different lens, so your team can move from open questions to aligned next steps.
          </p>
        </div>
        <div className="workflow-steps">
          <article className="workflow-step step-highlight">
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
            <span className="step-foot">
              INPUT <b>·</b> YOUR CHALLENGE
            </span>
          </article>
          <article className="workflow-step">
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
            <span className="step-foot">
              LENS <b>·</b> PRODUCT
            </span>
          </article>
          <article className="workflow-step">
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
            <span className="step-foot">
              LENSES <b>·</b> DESIGN + ARCH
            </span>
          </article>
          <article className="workflow-step">
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
            <span className="step-foot">
              OUTPUT <b>·</b> SHARED BLUEPRINT
            </span>
          </article>
        </div>
        <div className="workflow-rail" aria-hidden="true">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </section>

      {/* ================= SECTION 02: AGENTS (Exact Manus Reference) ================= */}
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
            <article className="agent-card">
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
            <article className="agent-card">
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

      {/* ================= SECTION 03: THE OUTPUT (Exact Manus Reference) ================= */}
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
            <div className="doc-paper">
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
              <div className="doc-stamp">
                DEMO
                <br />
                PREVIEW
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
      </section>

      {/* ================= SECTION 04: BENEFITS BAND (Exact Manus Reference) ================= */}
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
            <article>
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

      {/* ================= FINAL CTA (Exact Manus Reference) ================= */}
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
          Explore the interactive preview <span aria-hidden="true">↗</span>
        </a>
        <p className="cta-note">
          HackForge AI live multi-agent blueprint generation is connected above in the Blueprint
          Studio.
        </p>
      </section>
    </>
  );
}
