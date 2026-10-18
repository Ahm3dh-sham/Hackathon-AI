"use client";

import React, { useState, useEffect } from "react";
import {
  FileText,
  Layers,
  Cpu,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  Server,
  Database,
  Sparkles,
  Printer,
  Globe,
  ArrowRight,
  Terminal,
  Presentation,
  Users,
  Mic,
  Download,
  Clock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { CarouselNavigator } from "@/components/carousel-navigator";
import { CopyButton } from "@/components/cult-ui/copy-button";
import { MinimalCard, MinimalCardTitle, MinimalCardDescription } from "@/components/cult-ui/minimal-card";

export type BlueprintTab = "research" | "product" | "architecture" | "prompt" | "talkscript";

const TAB_ORDER: Array<BlueprintTab> = [
  "research",
  "product",
  "architecture",
  "prompt",
  "talkscript",
];

const TAB_LABELS: Record<BlueprintTab, string> = {
  research: "Research Analysis",
  product: "Product Specification",
  architecture: "Technical Architecture",
  prompt: "Builder Prompt",
  talkscript: "TalkScript & PPT",
};

export interface ProjectStateBlueprint {
  problem_statement: string;
  team_size?: number;
  research_data: {
    domain_category?: string;
    core_problem?: string;
    target_audience?: string[];
    key_pain_points?: string[];
    key_challenges?: string[];
    competitive_landscape?: string;
    unique_value_proposition?: string;
    feasibility_score?: number;
  };
  product_spec: {
    project_name?: string;
    tagline?: string;
    mvp_features?: Array<{ name?: string; title?: string; description: string; priority: string }>;
    phase2_features?: Array<{ name?: string; description?: string; priority?: string } | string>;
    user_stories?: string[];
    ux_workflow?: string[];
  };
  architecture_spec: {
    recommended_tech_stack?: Record<string, string>;
    tech_stack?: Record<string, string>;
    system_components?: Array<{ name: string; role: string; technologies: string[] }>;
    database_schema?: Array<{ table_name: string; description?: string; columns: string[] }>;
    api_endpoints?: Array<{
      method: string;
      path: string;
      description: string;
      request_body?: string;
      response_body?: string;
    }>;
    master_builder_prompt?: string;
  };
  builderPrompt?: string;
  current_step?: string;
}

export interface PitchSlide {
  number: number;
  kicker: string;
  title: string;
  subtitle: string;
  bullets: string[];
  highlightMetric: string;
  assignedTeammate: number;
  speakerNotes: string;
}

export interface TeammateScriptSegment {
  teammateNumber: number;
  roleTitle: string;
  slideNumbers: number[];
  durationLabel: string;
  openingHook: string;
  scriptParagraphs: string[];
  stageCue: string;
  handoffLine: string;
}

interface BlueprintDisplayProps {
  data: ProjectStateBlueprint;
  teamSize?: number;
  onTeamSizeChange?: (size: number) => void;
  initialTab?: BlueprintTab;
  onReset?: () => void;
}

const ROLE_TITLES = [
  "Vision & Problem Lead",
  "Product & Live Demo Driver",
  "Systems & AI Architect",
  "Backend, Data & Impact Lead",
  "UX Workflow & Frontend Lead",
  "Security, QA & Scale Lead",
  "Integration & API Specialist",
  "Domain Research & Strategy Lead",
  "DevOps & Cloud Telemetry Lead",
  "Commercialization & Closing Lead",
];

export function buildPitchSlides(data: ProjectStateBlueprint, teamSize: number): PitchSlide[] {
  const safeTeam = Math.max(1, Math.min(10, teamSize || data.team_size || 4));
  const title = data.product_spec?.project_name || "HackForge MVP";
  const domain = data.research_data?.domain_category || "AI-Native Multi-Agent Platform";
  const painPoints =
    data.research_data?.key_pain_points ||
    data.research_data?.key_challenges || [
      "Fragmented manual workflows and delayed response times",
      "Lack of real-time operational visibility across stakeholders",
      "High coordination overhead during time-critical events",
    ];
  const audience =
    data.research_data?.target_audience || [
      "Primary Domain End-Users & Operators",
      "Program Leads & Technical Coordinators",
      "Compliance & Operations Teams",
    ];
  const mvpFeatures =
    data.product_spec?.mvp_features?.map((f) => ({
      name: f.name || f.title || "Core Feature",
      description: f.description,
      priority: f.priority,
    })) || [];
  const techStack =
    data.architecture_spec?.recommended_tech_stack ||
    data.architecture_spec?.tech_stack || {
      frontend: "Next.js 14, TypeScript, Tailwind CSS",
      backend: "Python FastAPI, LangGraph Orchestrator",
      database: "PostgreSQL + pgvector, Redis",
      ai_models: "Google Gemini 2.5 Flash",
    };
  const tables = data.architecture_spec?.database_schema || [];
  const endpoints = data.architecture_spec?.api_endpoints || [];
  const workflow =
    data.product_spec?.ux_workflow || [
      "User submits a problem signal in the Studio portal",
      "4 Specialist AI Agents enrich, validate, and score priority",
      "Operators review actionable recommendations in real time",
      "One-click execution & automated audit export",
    ];

  const assignTeammate = (slideIndex: number, totalSlides: number) => {
    return Math.min(safeTeam, Math.floor((slideIndex * safeTeam) / totalSlides) + 1);
  };

  const rawSlides: Omit<PitchSlide, "assignedTeammate">[] = [
    {
      number: 1,
      kicker: `01 / EXECUTIVE VISION · ${domain.toUpperCase()}`,
      title: `${title}`,
      subtitle:
        data.product_spec?.tagline ||
        `Solving "${data.problem_statement}" with autonomous multi-agent execution.`,
      bullets: [
        `Problem Brief: ${data.problem_statement}`,
        `Domain Category: ${domain}`,
        `Built for rapid deployment by a ${safeTeam}-person engineering team`,
        `Feasibility Score: ${data.research_data?.feasibility_score || 94}/100 Verified`,
      ],
      highlightMetric: `${data.research_data?.feasibility_score || 94}% MVP Feasibility`,
      speakerNotes: `Open strong by introducing ${title} and stating the exact problem statement we are solving today.`,
    },
    {
      number: 2,
      kicker: "02 / THE CORE PROBLEM & BOTTLENECKS",
      title: "Why Current Approaches Fail",
      subtitle:
        data.research_data?.core_problem ||
        `Organizations tackling "${data.problem_statement}" suffer from fragmented handoffs and manual latency.`,
      bullets: painPoints.slice(0, 4),
      highlightMetric: "3.8x Faster Triage Needed",
      speakerNotes:
        "Highlight the human and operational cost of the status quo and why static tools fail under real-world pressure.",
    },
    {
      number: 3,
      kicker: "03 / TARGET AUDIENCE & MARKET DIFFERENTIATION",
      title: "Who We Serve & Why We Win",
      subtitle:
        data.research_data?.competitive_landscape ||
        `${title} replaces manual coordination with a deterministic, real-time multi-agent pipeline.`,
      bullets: [
        ...audience.slice(0, 3).map((a) => `Target Persona: ${a}`),
        data.research_data?.unique_value_proposition ||
          "Sub-15-second autonomous synthesis with human-in-the-loop verification.",
      ],
      highlightMetric: `${audience.length} Core User Personas`,
      speakerNotes:
        "Explain exactly who uses the product on day one and how our architecture differentiates from legacy tools.",
    },
    {
      number: 4,
      kicker: "04 / PRODUCT SPECIFICATION & MVP SCOPE",
      title: "Core MVP Capabilities",
      subtitle: "Scoped for high-reliability execution and immediate user impact.",
      bullets:
        mvpFeatures.length > 0
          ? mvpFeatures
              .slice(0, 4)
              .map((f) => `${f.name} [${f.priority}]: ${f.description}`)
          : [
              "Real-Time Signal Intake & Validation Portal",
              "Stateful 4-Agent Coordinator (LangGraph)",
              "Interactive Command Dashboard & Live Telemetry",
              "Automated Audit Receipt & PPT/PDF Export",
            ],
      highlightMetric: `${mvpFeatures.length || 4} P0/P1 MVP Modules`,
      speakerNotes:
        "Walk the judges through the 4 core features we prioritized for the hackathon MVP.",
    },
    {
      number: 5,
      kicker: "05 / USER EXPERIENCE & LIVE DEMO FLOW",
      title: "End-to-End User Journey",
      subtitle: "From raw input signal to verified action in four deterministic steps.",
      bullets: workflow.slice(0, 4).map((step, idx) => `Step 0${idx + 1}: ${step}`),
      highlightMetric: "< 15s End-to-End Flow",
      speakerNotes:
        "Transition to the live product walkthrough, showing how a user moves from input to resolution.",
    },
    {
      number: 6,
      kicker: "06 / TECHNICAL ARCHITECTURE & STACK",
      title: "Full-Stack System Topology",
      subtitle:
        "Engineered with modern, type-safe cloud-native primitives for low latency and high concurrency.",
      bullets: Object.entries(techStack)
        .slice(0, 5)
        .map(([k, v]) => `${k.replace("_", " ").toUpperCase()}: ${v}`),
      highlightMetric: "4-Node LangGraph DAG",
      speakerNotes:
        "Detail our frontend, backend, database, and AI model choices and why this stack scales.",
    },
    {
      number: 7,
      kicker: "07 / DATA MODEL & API CONTRACT",
      title: "Database Schema & REST Endpoints",
      subtitle: "Strict Pydantic v2 schema validation backed by relational & vector persistence.",
      bullets: [
        ...(tables.length > 0
          ? tables
              .slice(0, 2)
              .map((t) => `Table [${t.table_name}]: ${t.columns?.slice(0, 3).join(", ")}`)
          : ["Table [workspaces]: id, name, domain_category, team_size", "Table [intake_records]: id, raw_prompt, priority_score, status"]),
        ...(endpoints.length > 0
          ? endpoints
              .slice(0, 2)
              .map((ep) => `Endpoint [${ep.method} ${ep.path}]: ${ep.description}`)
          : ["POST /api/v1/intake — Triggers multi-agent synthesis pipeline", "GET /api/v1/records/{id} — Streams verified dossier & telemetry"]),
      ],
      highlightMetric: `${tables.length || 3} Tables · ${endpoints.length || 4} APIs`,
      speakerNotes:
        "Show the judges the real engineering depth under the hood: our SQL schema and REST API contract.",
    },
    {
      number: 8,
      kicker: "08 / ROADMAP, IMPACT & TEAM EXECUTION",
      title: "Phase 2 Scale & Closing Impact",
      subtitle: `Delivered by a coordinated ${safeTeam}-teammate crew ready for production pilot.`,
      bullets: [
        ...(data.product_spec?.phase2_features?.slice(0, 2).map((f) =>
          typeof f === "string" ? `Phase 2: ${f}` : `Phase 2 — ${f.name}: ${f.description}`
        ) || [
          "Phase 2: Predictive demand forecasting with time-series embeddings",
          "Phase 2: Multi-tenant enterprise RBAC, SSO, and webhook ecosystem",
        ]),
        `Immediate Impact: Eliminates manual triage bottlenecks for "${data.problem_statement}"`,
        `Ready for live Q&A and judge walkthrough`,
      ],
      highlightMetric: `${safeTeam} Teammates · Production Ready`,
      speakerNotes:
        "Close with our Phase 2 roadmap, measurable impact, and invite the judges for Q&A.",
    },
  ];

  return rawSlides.map((slide, idx) => ({
    ...slide,
    assignedTeammate: assignTeammate(idx, rawSlides.length),
  }));
}

export function buildTeamTalkScript(
  data: ProjectStateBlueprint,
  slides: PitchSlide[],
  teamSize: number
): TeammateScriptSegment[] {
  const safeTeam = Math.max(1, Math.min(10, teamSize || data.team_size || 4));
  const title = data.product_spec?.project_name || "HackForge MVP";
  const domain = data.research_data?.domain_category || "AI-Native Systems";
  const problem = data.problem_statement;
  const coreProblem =
    data.research_data?.core_problem ||
    `Teams addressing "${problem}" face fragmented coordination and slow manual triage.`;
  const totalPitchSeconds = 180; // Standard 3-minute (180s) hackathon pitch
  const secondsPerMember = Math.round(totalPitchSeconds / safeTeam);

  const segments: TeammateScriptSegment[] = [];

  for (let i = 1; i <= safeTeam; i++) {
    const memberSlides = slides.filter((s) => s.assignedTeammate === i);
    const slideNums =
      memberSlides.length > 0
        ? memberSlides.map((s) => s.number)
        : [Math.min(slides.length, i)];

    const roleTitle = ROLE_TITLES[(i - 1) % ROLE_TITLES.length];
    const startSec = (i - 1) * secondsPerMember;
    const endSec = i === safeTeam ? totalPitchSeconds : i * secondsPerMember;
    const formatTime = (sec: number) => {
      const m = Math.floor(sec / 60);
      const s = sec % 60;
      return `${m}:${s < 10 ? "0" : ""}${s}`;
    };

    const durationLabel = `${formatTime(startSec)} – ${formatTime(endSec)} (~${
      endSec - startSec
    }s)`;

    const paragraphs: string[] = [];

    if (i === 1) {
      paragraphs.push(
        `"Hello judges! We are the ${safeTeam}-person engineering team behind ${title}, operating in the ${domain} space. Today we are tackling a critical challenge: ${problem}"`
      );
      paragraphs.push(
        `"Right now, ${coreProblem} Specifically, operators struggle with ${
          data.research_data?.key_pain_points?.[0] ||
          "delayed manual triage and fragmented data handoffs"
        }, which costs valuable time when every second matters."`
      );
    }

    memberSlides.forEach((slide) => {
      if (slide.number === 1 && i === 1) return; // covered in hook
      if (slide.number === 2 && i === 1) return;
      paragraphs.push(
        `[On Slide ${slide.number} — ${slide.title}]: "${slide.subtitle} Specifically, we focus on ${slide.bullets
          .slice(0, 2)
          .join("; and ")}."`
      );
    });

    if (paragraphs.length === 0) {
      const refSlide = slides[(i - 1) % slides.length];
      paragraphs.push(
        `[Focus Area — ${refSlide.title}]: "Building on our core pipeline for ${title}, my focus was ensuring that ${refSlide.bullets[0] || "our system handles high-concurrency requests reliably"} while maintaining a ${data.research_data?.feasibility_score || 94}% feasibility score across the entire workflow."`
      );
    }

    const stageCue =
      i === 1
        ? "Stand center-left, display Slide 1 title card, make eye contact with the judging panel."
        : i === 2
        ? "Switch to the live application workspace / Slide 4–5 and trigger the real-time demo flow."
        : i === safeTeam
        ? "Advance to the final Architecture & Roadmap slide, summarize key metrics, and invite judge Q&A."
        : `Advance deck to Slide ${slideNums.join(", ")} and point out the system telemetry & architectural proof points.`;

    const handoffLine =
      i < safeTeam
        ? `"Now I'll hand it over to Teammate ${i + 1} (${
            ROLE_TITLES[i % ROLE_TITLES.length]
          }) to walk through Slide ${
            slides.find((s) => s.assignedTeammate === i + 1)?.number || Math.min(8, slideNums[slideNums.length - 1] + 1)
          }."`
        : `"Thank you! That concludes our pitch for ${title}—our ${safeTeam}-person team is now happy to answer your questions and show any part of the live system."`;

    segments.push({
      teammateNumber: i,
      roleTitle,
      slideNumbers: slideNums,
      durationLabel,
      openingHook:
        i === 1
          ? "Opening Hook & Problem Framing"
          : i === safeTeam
          ? "Technical Validation, Roadmap & Closing"
          : `Core Walkthrough: ${memberSlides.map((s) => s.title).join(" + ") || roleTitle}`,
      scriptParagraphs: paragraphs,
      stageCue,
      handoffLine,
    });
  }

  return segments;
}

export const BlueprintDisplay: React.FC<BlueprintDisplayProps> = ({
  data,
  teamSize: propTeamSize = 4,
  onTeamSizeChange,
  initialTab = "research",
  onReset,
}) => {
  const [activeTab, setActiveTab] = useState<BlueprintTab>(initialTab);
  const [promptCopied, setPromptCopied] = useState(false);
  const [scriptCopied, setScriptCopied] = useState(false);
  const [localTeamSize, setLocalTeamSize] = useState<number>(
    Math.max(1, Math.min(10, propTeamSize || data.team_size || 4))
  );
  const [activeSlideIdx, setActiveSlideIdx] = useState<number>(0);
  const [isExportingPPT, setIsExportingPPT] = useState<boolean>(false);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    if (propTeamSize && propTeamSize !== localTeamSize) {
      setLocalTeamSize(Math.max(1, Math.min(10, propTeamSize)));
    }
  }, [propTeamSize]);

  const handleTeamSizeUpdate = (nextSize: number) => {
    const clamped = Math.max(1, Math.min(10, nextSize));
    setLocalTeamSize(clamped);
    if (onTeamSizeChange) {
      onTeamSizeChange(clamped);
    }
  };

  const currentTabIndex = TAB_ORDER.indexOf(activeTab);
  const handleCarouselIndexChange = (index: number) => {
    const nextTab = TAB_ORDER[index];
    if (nextTab) setActiveTab(nextTab);
  };

  const title = data.product_spec?.project_name || "Hackathon Project Blueprint";
  const masterPrompt =
    data.builderPrompt ||
    data.architecture_spec?.master_builder_prompt ||
    buildFallbackPrompt(data);

  const slides = buildPitchSlides(data, localTeamSize);
  const talkScriptSegments = buildTeamTalkScript(data, slides, localTeamSize);
  const currentSlide = slides[activeSlideIdx] || slides[0];

  const talkScriptFullText = talkScriptSegments
    .map(
      (seg) =>
        `=== TEAMMATE ${seg.teammateNumber}: ${seg.roleTitle.toUpperCase()} ===\n` +
        `Slides: ${seg.slideNumbers.map((n) => `Slide ${n}`).join(", ")} | Time: ${seg.durationLabel}\n` +
        `Stage Cue: ${seg.stageCue}\n\n` +
        `${seg.scriptParagraphs.join("\n\n")}\n\n` +
        `Handoff: ${seg.handoffLine}\n`
    )
    .join("\n------------------------------------------------------------\n\n");

  // Download Real .PPTX Presentation via Browser PptxGenJS Bundle
  const handleDownloadPPTX = async () => {
    try {
      setIsExportingPPT(true);
      const PptxGenJS = await new Promise<any>((resolve, reject) => {
        if (typeof window !== "undefined" && (window as any).PptxGenJS) {
          resolve((window as any).PptxGenJS);
          return;
        }
        const script = document.createElement("script");
        script.src = "/pptxgen.bundle.js";
        script.async = true;
        script.onload = () => {
          if ((window as any).PptxGenJS) {
            resolve((window as any).PptxGenJS);
          } else {
            reject(new Error("PptxGenJS not found on window"));
          }
        };
        script.onerror = () => reject(new Error("Failed to load /pptxgen.bundle.js"));
        document.head.appendChild(script);
      });
      const pptx = new PptxGenJS();
      pptx.layout = "LAYOUT_16x9";
      pptx.author = "HackForge AI";
      pptx.company = "HackForge AI Blueprint Studio";
      pptx.subject = data.problem_statement;
      pptx.title = `${title} — Pitch Deck`;

      slides.forEach((slide) => {
        const s = pptx.addSlide();
        s.background = { color: "F7F4ED" };

        // Top editorial header bar
        s.addShape(pptx.ShapeType.rect, {
          x: 0,
          y: 0,
          w: "100%",
          h: 0.55,
          fill: { color: "292720" },
        });

        s.addText(`HACKFORGE AI // ${slide.kicker}`, {
          x: 0.5,
          y: 0.12,
          w: 6.5,
          h: 0.3,
          fontSize: 9,
          bold: true,
          color: "FFFDF8",
          fontFace: "Consolas",
        });

        s.addText(
          `TEAMMATE ${slide.assignedTeammate} OF ${localTeamSize}  |  SLIDE 0${slide.number} / 0${slides.length}`,
          {
            x: 6.5,
            y: 0.12,
            w: 3.0,
            h: 0.3,
            fontSize: 9,
            bold: true,
            align: "right",
            color: "D4B483",
            fontFace: "Consolas",
          }
        );

        // Slide Title
        s.addText(slide.title, {
          x: 0.5,
          y: 0.75,
          w: 6.8,
          h: 0.65,
          fontSize: 24,
          bold: true,
          color: "292720",
          fontFace: "Georgia",
        });

        // Metric Badge Pill on Top Right
        s.addShape(pptx.ShapeType.rect, {
          x: 7.45,
          y: 0.8,
          w: 2.05,
          h: 0.45,
          fill: { color: "394B3F" },
        });
        s.addText(slide.highlightMetric, {
          x: 7.45,
          y: 0.85,
          w: 2.05,
          h: 0.35,
          fontSize: 10,
          bold: true,
          align: "center",
          color: "FFFDF8",
          fontFace: "Consolas",
        });

        // Subtitle Box
        s.addText(slide.subtitle, {
          x: 0.5,
          y: 1.42,
          w: 9.0,
          h: 0.55,
          fontSize: 12,
          italic: true,
          color: "5E5A50",
          fontFace: "Georgia",
        });

        // Main Ivory Content Card
        s.addShape(pptx.ShapeType.rect, {
          x: 0.5,
          y: 2.05,
          w: 9.0,
          h: 2.55,
          fill: { color: "FFFDF8" },
          line: { color: "D8D0C1", width: 1 },
        });

        const bulletItems = slide.bullets.map((b, idx) => ({
          text: `0${idx + 1}.  ${b}`,
          options: {
            fontSize: 12,
            color: "292720",
            fontFace: "Arial",
            breakLine: true,
            paraSpaceAfter: 10,
          },
        }));

        s.addText(bulletItems, {
          x: 0.75,
          y: 2.22,
          w: 8.5,
          h: 2.2,
          valign: "top",
        });

        // Bottom Speaker Cue Footer Card
        s.addShape(pptx.ShapeType.rect, {
          x: 0.5,
          y: 4.75,
          w: 9.0,
          h: 0.6,
          fill: { color: "EEE9DF" },
          line: { color: "C9B99D", width: 1 },
        });

        s.addText(
          `SPEAKER CUE (TEAMMATE ${slide.assignedTeammate}): ${slide.speakerNotes}`,
          {
            x: 0.65,
            y: 4.85,
            w: 8.7,
            h: 0.4,
            fontSize: 9.5,
            bold: true,
            color: "725A36",
            fontFace: "Consolas",
          }
        );
      });

      const safeFileName = title.replace(/[^a-zA-Z0-9_-]/g, "_");
      await pptx.writeFile({ fileName: `${safeFileName}_Pitch_Deck.pptx` });
    } catch (err) {
      console.error("Failed to generate PPTX:", err);
      alert("Could not generate PowerPoint file. Please try again.");
    } finally {
      setIsExportingPPT(false);
    }
  };

  // Export Dedicated TalkScript PDF for N Teammates
  const handleExportTalkScriptPDF = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Please allow pop-ups to download the TalkScript PDF.");
      return;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${title} - ${localTeamSize}-Teammate TalkScript & Pitch Deck</title>
        <style>
          body {
            font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
            color: #292720;
            background: #f7f4ed;
            line-height: 1.6;
            padding: 36px;
            max-width: 920px;
            margin: 0 auto;
          }
          .header {
            border-bottom: 3px solid #394b3f;
            padding-bottom: 18px;
            margin-bottom: 26px;
          }
          .badge {
            display: inline-block;
            background: #394b3f;
            color: #fffdf8;
            padding: 4px 12px;
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            margin-bottom: 8px;
          }
          h1 {
            margin: 0 0 6px 0;
            color: #292720;
            font-size: 28px;
          }
          .subtitle {
            color: #5e5a50;
            font-size: 14px;
            margin: 0;
          }
          .section-title {
            font-size: 16px;
            font-weight: 700;
            color: #394b3f;
            border-bottom: 1px solid #d8d0c1;
            padding-bottom: 6px;
            margin: 26px 0 14px 0;
            text-transform: uppercase;
            letter-spacing: 0.06em;
          }
          .member-card {
            background: #fffdf8;
            border: 1px solid #c9b99d;
            border-left: 5px solid #394b3f;
            padding: 18px 20px;
            margin-bottom: 16px;
            page-break-inside: avoid;
          }
          .member-top {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid #eee9df;
            padding-bottom: 8px;
            margin-bottom: 10px;
          }
          .member-name {
            font-size: 16px;
            font-weight: 800;
            color: #292720;
          }
          .member-meta {
            font-family: Consolas, monospace;
            font-size: 12px;
            color: #80643d;
            font-weight: 700;
          }
          .script-box {
            background: #f7f4ed;
            border: 1px solid #e2dacb;
            padding: 12px 14px;
            font-size: 13.5px;
            color: #292720;
            margin-bottom: 10px;
          }
          .cue-line {
            font-size: 12px;
            color: #5e5a50;
            margin-top: 6px;
          }
          .slide-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
          }
          .slide-card {
            background: #fffdf8;
            border: 1px solid #d8d0c1;
            padding: 12px 14px;
            page-break-inside: avoid;
          }
          .footer {
            margin-top: 36px;
            text-align: center;
            font-size: 11px;
            color: #726d62;
            border-top: 1px solid #d8d0c1;
            padding-top: 12px;
          }
          @media print {
            body { padding: 16px; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <span class="badge">HACKFORGE AI · ${localTeamSize}-TEAMMATE TALKSCRIPT & PITCH DECK</span>
          <h1>${title} — Official Pitch TalkScript</h1>
          <p class="subtitle"><strong>Problem Statement:</strong> ${data.problem_statement}</p>
          <p class="subtitle" style="margin-top:4px;"><strong>Team Size:</strong> ${localTeamSize} Teammate${
      localTeamSize > 1 ? "s" : ""
    } | <strong>Total Pitch Duration:</strong> 3:00 Mins (8 Slides)</p>
        </div>

        <div class="section-title">Part 1: Speaker-by-Speaker Verbatim TalkScript (${localTeamSize} Teammates)</div>
        ${talkScriptSegments
          .map(
            (seg) => `
          <div class="member-card">
            <div class="member-top">
              <div class="member-name">Teammate ${seg.teammateNumber}: ${seg.roleTitle}</div>
              <div class="member-meta">Slides ${seg.slideNumbers.join(", ")} · ${seg.durationLabel}</div>
            </div>
            <div style="font-size:12px; font-weight:700; color:#394b3f; margin-bottom:8px;">
              Focus: ${seg.openingHook}
            </div>
            ${seg.scriptParagraphs
              .map((p) => `<div class="script-box">${p}</div>`)
              .join("")}
            <div class="cue-line"><strong>Stage / Demo Cue:</strong> ${seg.stageCue}</div>
            <div class="cue-line" style="color:#80643d;"><strong>Handoff Cue:</strong> ${seg.handoffLine}</div>
          </div>
        `
          )
          .join("")}

        <div class="section-title">Part 2: 8-Slide Presentation Deck Summary</div>
        <div class="slide-grid">
          ${slides
            .map(
              (s) => `
            <div class="slide-card">
              <div style="font-family:Consolas,monospace; font-size:10px; color:#80643d; font-weight:700;">
                SLIDE 0${s.number} · TEAMMATE ${s.assignedTeammate}
              </div>
              <div style="font-size:14px; font-weight:800; margin:4px 0;">${s.title}</div>
              <div style="font-size:12px; color:#5e5a50; margin-bottom:6px;">${s.subtitle}</div>
              <ul style="margin:0; padding-left:16px; font-size:11.5px;">
                ${s.bullets.map((b) => `<li>${b}</li>`).join("")}
              </ul>
            </div>
          `
            )
            .join("")}
        </div>

        <div class="footer">
          Generated by HackForge AI — Editorial Blueprint & Pitch Studio • Ready for Hackathon Stage Presentation
        </div>
        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 300);
          };
        </script>
      </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  const handleExportPDF = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Please allow pop-ups to export the Blueprint PDF.");
      return;
    }

    const painPoints =
      data.research_data?.key_pain_points ||
      data.research_data?.key_challenges || ["Manual overhead & friction"];
    const techStack =
      data.architecture_spec?.recommended_tech_stack ||
      data.architecture_spec?.tech_stack || {};

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${title} - HackForge AI Blueprint</title>
        <style>
          body {
            font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
            color: #292720;
            background: #f7f4ed;
            line-height: 1.6;
            padding: 40px;
            max-width: 900px;
            margin: 0 auto;
          }
          .header {
            border-bottom: 3px solid #394b3f;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .badge {
            display: inline-block;
            background: #eee9df;
            color: #725a36;
            border: 1px solid #c9b99d;
            padding: 4px 12px;
            font-size: 12px;
            font-weight: 700;
            text-transform: uppercase;
            margin-bottom: 8px;
          }
          h1 {
            margin: 0 0 8px 0;
            color: #292720;
            font-size: 28px;
          }
          .subtitle {
            color: #625e54;
            font-size: 14px;
            margin: 0;
          }
          .section {
            margin-bottom: 32px;
            page-break-inside: avoid;
          }
          .section-title {
            font-size: 18px;
            font-weight: 700;
            color: #394b3f;
            border-bottom: 1px solid #d8d0c1;
            padding-bottom: 6px;
            margin-bottom: 14px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }
          .grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
          }
          .card {
            background: #fffdf8;
            border: 1px solid #d8d0c1;
            padding: 16px;
            margin-bottom: 12px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
            font-size: 13px;
            background: #fffdf8;
          }
          th, td {
            border: 1px solid #d8d0c1;
            padding: 10px;
            text-align: left;
          }
          th {
            background: #eee9df;
            font-weight: 700;
            color: #292720;
          }
          .prompt-box {
            background: #fffdf8;
            color: #292720;
            padding: 20px;
            font-family: 'Consolas', 'Courier New', monospace;
            font-size: 11.5px;
            white-space: pre-wrap;
            word-wrap: break-word;
            border: 1px solid #c9b99d;
            line-height: 1.5;
          }
          .footer {
            margin-top: 50px;
            text-align: center;
            font-size: 11px;
            color: #726d62;
            border-top: 1px solid #d8d0c1;
            padding-top: 15px;
          }
          @media print {
            body { padding: 20px; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <span class="badge">${data.research_data?.domain_category || "Hackathon Project Blueprint"}</span>
          <h1>${title}</h1>
          <p class="subtitle"><strong>Problem Statement:</strong> ${data.problem_statement}</p>
        </div>

        <div class="section">
          <div class="section-title">1. Problem & Market Research Analysis</div>
          <div class="card">
            <strong>Core Problem:</strong>
            <p>${data.research_data?.core_problem || "Analysis completed."}</p>
            <strong>Feasibility Score:</strong> ${data.research_data?.feasibility_score || 94}/100
          </div>
          <div class="grid">
            <div class="card">
              <strong>Target Users:</strong>
              <ul>
                ${data.research_data?.target_audience?.map((u) => `<li>${u}</li>`).join("") || "<li>Developers & End-Users</li>"}
              </ul>
            </div>
            <div class="card">
              <strong>Key Pain Points Addressed:</strong>
              <ul>
                ${painPoints.map((p) => `<li>${p}</li>`).join("")}
              </ul>
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">2. Product Specification & MVP Features</div>
          <table>
            <thead>
              <tr>
                <th>Feature Name</th>
                <th>Priority</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              ${
                data.product_spec?.mvp_features
                  ?.map(
                    (f) => `
                <tr>
                  <td><strong>${f.name || f.title || "MVP Feature"}</strong></td>
                  <td>${f.priority}</td>
                  <td>${f.description}</td>
                </tr>
              `
                  )
                  .join("") || ""
              }
            </tbody>
          </table>
        </div>

        <div class="section">
          <div class="section-title">3. Recommended Tech Stack</div>
          <table>
            <thead>
              <tr>
                <th>Layer</th>
                <th>Technology</th>
              </tr>
            </thead>
            <tbody>
              ${Object.entries(techStack)
                .map(
                  ([k, v]) => `
                <tr>
                  <td><strong>${k.toUpperCase()}</strong></td>
                  <td>${v}</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
        </div>

        <div class="section">
          <div class="section-title">4. AI Builder Master Prompt</div>
          <div class="prompt-box">${masterPrompt.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</div>
        </div>

        <div class="footer">
          Generated by HackForge AI — Multi-Agent Hackathon Blueprint Engine
        </div>

        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 350);
          };
        </script>
      </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  const painPointsList =
    data.research_data?.key_pain_points ||
    data.research_data?.key_challenges || [
      "Sub-second ingestion and normalization of heterogeneous user inputs",
      "Deterministic state transitions with human-in-the-loop override auditability",
      "Mobile-first responsive clarity under high-concurrency hackathon demo loads",
    ];

  const techStackRecord =
    data.architecture_spec?.recommended_tech_stack ||
    data.architecture_spec?.tech_stack || {};

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500 text-[#292720]">
      {/* Header Banner — Warm Linen & Ivory Paper Card */}
      <div className="p-6 sm:p-8 bg-[#fffdf8] border border-[#d8d0c1] shadow-[0_18px_42px_rgba(61,51,37,0.08)] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="px-3 py-1 text-[11px] font-mono font-semibold uppercase tracking-wider bg-[#eee9df] text-[#725a36] border border-[#c9b99d]">
              {data.research_data?.domain_category || "AI System Blueprint"}
            </span>
            <span className="px-3 py-1 text-[11px] font-mono font-semibold uppercase tracking-wider bg-[#e8ede3] text-[#394b3f] border border-[#9cab95] flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Feasibility:{" "}
              {data.research_data?.feasibility_score || 94}/100
            </span>
            <span className="px-3 py-1 text-[11px] font-mono font-semibold uppercase tracking-wider bg-[#f4efe4] text-[#80643d] border border-[#d5c9b4] flex items-center gap-1.5">
              <Users className="w-3 h-3" /> Team: {localTeamSize} Teammate{localTeamSize > 1 ? "s" : ""}
            </span>
          </div>
          <h1
            style={{ fontFamily: "var(--display)" }}
            className="text-3xl sm:text-4xl font-bold text-[#292720] tracking-tight"
          >
            {title}
          </h1>
          <p className="text-sm text-[#625e54] max-w-2xl leading-relaxed">
            {data.problem_statement}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {onReset && (
            <button
              onClick={onReset}
              className="px-4 py-2.5 text-xs font-bold bg-[#eee9df] hover:bg-[#e5dfd4] text-[#302d25] border border-[#d3cbbd] transition-colors"
            >
              New Blueprint
            </button>
          )}

          <button
            onClick={() => setActiveTab("talkscript")}
            className="flex items-center gap-2 px-4 py-2.5 text-xs font-extrabold bg-[#80643d] hover:bg-[#68512f] text-[#fffdf8] shadow-sm transition-all"
          >
            <Presentation className="w-3.5 h-3.5" />
            Open TalkScript &amp; PPT
          </button>

          {/* PDF Export Button in Heritage Forest Green */}
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-2 px-5 py-2.5 text-xs font-extrabold bg-[#394b3f] hover:bg-[#4c604f] text-[#fffdf8] shadow-md shadow-[#394b3f]/15 transition-all hover:-translate-y-0.5"
          >
            <Printer className="w-3.5 h-3.5" />
            Export Blueprint (.pdf)
          </button>
        </div>
      </div>

      {/* Navigation Tabs + Watermelon Carousel Navigator */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between border-b border-[#dcd4c8] gap-3 pb-2 lg:pb-0">
        <div className="flex gap-1 sm:gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab("research")}
            className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === "research"
                ? "border-[#394b3f] text-[#292720] bg-[#eee9df]/70"
                : "border-transparent text-[#726d62] hover:text-[#292720] hover:bg-[#f8f5ee]"
            }`}
          >
            <FileText
              className={`w-4 h-4 ${
                activeTab === "research" ? "text-[#80643d]" : "text-[#817a6c]"
              }`}
            />
            Research Analysis
          </button>

          <button
            onClick={() => setActiveTab("product")}
            className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === "product"
                ? "border-[#394b3f] text-[#292720] bg-[#eee9df]/70"
                : "border-transparent text-[#726d62] hover:text-[#292720] hover:bg-[#f8f5ee]"
            }`}
          >
            <Layers
              className={`w-4 h-4 ${
                activeTab === "product" ? "text-[#80643d]" : "text-[#817a6c]"
              }`}
            />
            Product Specification
          </button>

          <button
            onClick={() => setActiveTab("architecture")}
            className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === "architecture"
                ? "border-[#394b3f] text-[#292720] bg-[#eee9df]/70"
                : "border-transparent text-[#726d62] hover:text-[#292720] hover:bg-[#f8f5ee]"
            }`}
          >
            <Cpu
              className={`w-4 h-4 ${
                activeTab === "architecture" ? "text-[#80643d]" : "text-[#817a6c]"
              }`}
            />
            Technical Architecture
          </button>

          <button
            onClick={() => setActiveTab("prompt")}
            className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === "prompt"
                ? "border-[#394b3f] text-[#292720] bg-[#eee9df]/70"
                : "border-transparent text-[#726d62] hover:text-[#292720] hover:bg-[#f8f5ee]"
            }`}
          >
            <Terminal
              className={`w-4 h-4 ${
                activeTab === "prompt" ? "text-[#80643d]" : "text-[#817a6c]"
              }`}
            />
            Builder Prompt
          </button>

          <button
            onClick={() => setActiveTab("talkscript")}
            className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === "talkscript"
                ? "border-[#394b3f] text-[#292720] bg-[#eee9df]/80"
                : "border-transparent text-[#726d62] hover:text-[#292720] hover:bg-[#f8f5ee]"
            }`}
          >
            <Presentation
              className={`w-4 h-4 ${
                activeTab === "talkscript" ? "text-[#80643d]" : "text-[#817a6c]"
              }`}
            />
            TalkScript
            <span className="ml-1 px-1.5 py-0.5 text-[10px] font-mono bg-[#394b3f] text-[#fffdf8]">
              PPT + {localTeamSize}P
            </span>
          </button>
        </div>

        <div className="flex items-center justify-end shrink-0 pb-1.5">
          <CarouselNavigator
            totalSlides={TAB_ORDER.length}
            currentIndex={currentTabIndex}
            onIndexChange={handleCarouselIndexChange}
          />
        </div>
      </div>

      {/* Tab 1: Research Analysis */}
      {activeTab === "research" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-[#fffdf8] border border-[#d8d0c1] shadow-sm space-y-4">
            <h3
              style={{ fontFamily: "var(--display)" }}
              className="text-2xl font-bold text-[#292720] flex items-center gap-2.5"
            >
              <AlertTriangle className="w-5 h-5 text-[#80643d]" /> Core Problem &amp; Market Analysis
            </h3>
            <p className="text-sm text-[#514d43] leading-relaxed">
              {data.research_data?.core_problem}
            </p>

            <h4 className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-[#725a36] pt-3">
              Competitive Landscape &amp; Differentiation
            </h4>
            <div className="p-4 bg-[#e8ede3]/75 border border-[#9cab95] text-sm text-[#292720] leading-relaxed">
              {data.research_data?.competitive_landscape ||
                data.research_data?.unique_value_proposition}
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-6 bg-[#fffdf8] border border-[#d8d0c1] shadow-sm">
              <h3
                style={{ fontFamily: "var(--display)" }}
                className="text-2xl font-bold text-[#292720] mb-3"
              >
                Target Audience Personas
              </h3>
              <ul className="space-y-2.5">
                {data.research_data?.target_audience?.map((user, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-sm text-[#514d43]">
                    <CheckCircle2 className="w-4 h-4 text-[#526a56] shrink-0 mt-0.5" />
                    <span>{user}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-6 bg-[#fffdf8] border border-[#d8d0c1] shadow-sm">
              <h3
                style={{ fontFamily: "var(--display)" }}
                className="text-2xl font-bold text-[#292720] mb-3"
              >
                Key Pain Points Addressed
              </h3>
              <ul className="space-y-2.5">
                {painPointsList.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-[#514d43]">
                    <span className="w-5 h-5 rounded-full bg-[#eee9df] text-[#725a36] border border-[#c9b99d] font-mono text-[10px] flex items-center justify-center shrink-0 mt-0.5 font-bold">
                      {idx + 1}
                    </span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Product Specification */}
      {activeTab === "product" && (
        <div className="space-y-6">
          <div className="p-6 bg-[#fffdf8] border border-[#d8d0c1] shadow-sm">
            <h3
              style={{ fontFamily: "var(--display)" }}
              className="text-2xl font-bold text-[#292720] mb-4 flex items-center gap-2"
            >
              <Sparkles className="w-5 h-5 text-[#80643d]" /> MVP Features (Hackathon Scope)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.product_spec?.mvp_features?.map((feat, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-[#f8f5ee] border border-[#dcd4c8] space-y-2 hover:border-[#80643d]/60 transition-colors"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-[#292720] text-sm">
                      {feat.name || feat.title}
                    </span>
                    <span
                      className={`text-[10px] font-mono px-2.5 py-0.5 uppercase font-bold ${
                        String(feat.priority).toLowerCase().includes("high") ||
                        String(feat.priority).includes("P0")
                          ? "bg-[#e8ede3] text-[#394b3f] border border-[#9cab95]"
                          : "bg-[#eee9df] text-[#725a36] border border-[#c9b99d]"
                      }`}
                    >
                      {feat.priority}
                    </span>
                  </div>
                  <p className="text-xs text-[#625e54] leading-relaxed">{feat.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-[#fffdf8] border border-[#d8d0c1] shadow-sm">
              <h3
                style={{ fontFamily: "var(--display)" }}
                className="text-2xl font-bold text-[#292720] mb-3"
              >
                User Stories
              </h3>
              <ul className="space-y-3">
                {data.product_spec?.user_stories?.map((story, idx) => (
                  <li
                    key={idx}
                    className="text-xs sm:text-sm text-[#514d43] p-3.5 bg-[#f8f5ee] border-l-2 border-[#394b3f]"
                  >
                    {story}
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-6 bg-[#fffdf8] border border-[#d8d0c1] shadow-sm">
              <h3
                style={{ fontFamily: "var(--display)" }}
                className="text-2xl font-bold text-[#292720] mb-3"
              >
                Step-by-Step UX Workflow
              </h3>
              <ol className="space-y-3">
                {(
                  data.product_spec?.ux_workflow || [
                    "User enters problem context in the Studio intake portal.",
                    "LangGraph 4-agent crew synthesizes research, product scope, and schema.",
                    "Team reviews architecture and exports PPT + TalkScript for pitch.",
                  ]
                ).map((step, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-[#514d43]">
                    <span className="w-6 h-6 rounded-full bg-[#394b3f] text-[#fffdf8] font-mono text-xs flex items-center justify-center shrink-0 font-bold">
                      {idx + 1}
                    </span>
                    <span className="pt-0.5">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Technical Architecture */}
      {activeTab === "architecture" && (
        <div className="space-y-6">
          {/* Interactive System Architecture Flow Diagram */}
          <div className="p-6 sm:p-8 bg-[#eee9df] border border-[#c9b99d] shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#725a36] font-bold">
                  System Topology &amp; Data Flow
                </span>
                <h3
                  style={{ fontFamily: "var(--display)" }}
                  className="text-2xl font-bold text-[#292720] mt-0.5"
                >
                  End-to-End Architecture Pipeline
                </h3>
              </div>
              <span className="px-3 py-1 text-[11px] font-mono bg-[#fffdf8] text-[#394b3f] border border-[#c9b99d] font-semibold">
                Production-Ready MVP
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-7 gap-3 items-center">
              <div className="p-4 bg-[#fffdf8] border border-[#c9b99d] text-center space-y-1.5 shadow-sm">
                <Globe className="w-6 h-6 text-[#80643d] mx-auto" />
                <div className="text-xs font-bold text-[#292720]">Client UI</div>
                <div className="text-[10px] text-[#625e54] font-mono">
                  {techStackRecord?.frontend || "Next.js + Tailwind"}
                </div>
              </div>

              <div className="hidden md:flex justify-center">
                <ArrowRight className="w-5 h-5 text-[#80643d]" />
              </div>

              <div className="p-4 bg-[#fffdf8] border border-[#c9b99d] text-center space-y-1.5 shadow-sm">
                <Server className="w-6 h-6 text-[#394b3f] mx-auto" />
                <div className="text-xs font-bold text-[#292720]">API Gateway</div>
                <div className="text-[10px] text-[#625e54] font-mono">
                  {techStackRecord?.backend || "FastAPI REST"}
                </div>
              </div>

              <div className="hidden md:flex justify-center">
                <ArrowRight className="w-5 h-5 text-[#394b3f]" />
              </div>

              <div className="p-4 bg-[#e8ede3] border border-[#9cab95] text-center space-y-1.5 shadow-sm">
                <Sparkles className="w-6 h-6 text-[#394b3f] mx-auto" />
                <div className="text-xs font-bold text-[#292720]">AI Orchestrator</div>
                <div className="text-[10px] text-[#394b3f] font-mono">
                  {techStackRecord?.ai_models || "LangGraph + LLM"}
                </div>
              </div>

              <div className="hidden md:flex justify-center">
                <ArrowRight className="w-5 h-5 text-[#80643d]" />
              </div>

              <div className="p-4 bg-[#fffdf8] border border-[#c9b99d] text-center space-y-1.5 shadow-sm">
                <Database className="w-6 h-6 text-[#80643d] mx-auto" />
                <div className="text-xs font-bold text-[#292720]">Persistence</div>
                <div className="text-[10px] text-[#625e54] font-mono">
                  {techStackRecord?.database || "PostgreSQL + Vector"}
                </div>
              </div>
            </div>
          </div>

          {/* Tech Stack & System Components */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-[#fffdf8] border border-[#d8d0c1] shadow-sm">
              <h3
                style={{ fontFamily: "var(--display)" }}
                className="text-2xl font-bold text-[#292720] mb-4 flex items-center gap-2"
              >
                <Server className="w-5 h-5 text-[#394b3f]" /> Recommended Tech Stack
              </h3>
              <div className="space-y-3">
                {Object.entries(techStackRecord).map(([layer, tech]) => (
                  <div
                    key={layer}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-[#f8f5ee] border border-[#dcd4c8] gap-1"
                  >
                    <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#725a36]">
                      {layer.replace("_", " ")}
                    </span>
                    <span className="text-xs font-semibold text-[#292720]">{tech}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 bg-[#fffdf8] border border-[#d8d0c1] shadow-sm">
              <h3
                style={{ fontFamily: "var(--display)" }}
                className="text-2xl font-bold text-[#292720] mb-4 flex items-center gap-2"
              >
                <Cpu className="w-5 h-5 text-[#80643d]" /> System Components
              </h3>
              <div className="space-y-3">
                {(
                  data.architecture_spec?.system_components || [
                    {
                      name: "Editorial Studio Web Client",
                      role: "Next.js 14 interactive UI, live telemetry, and PPTX/TalkScript generator.",
                      technologies: ["Next.js 14", "TypeScript", "Tailwind CSS", "PptxGenJS"],
                    },
                    {
                      name: "LangGraph Multi-Agent Engine",
                      role: "Stateful 4-agent pipeline coordinating Research, Product, Architecture, and Delivery.",
                      technologies: ["Python", "FastAPI", "LangGraph", "Gemini 2.5 Flash"],
                    },
                  ]
                ).map((comp, idx) => (
                  <div key={idx} className="p-3.5 bg-[#f8f5ee] border border-[#dcd4c8]">
                    <div className="font-bold text-sm text-[#292720]">{comp.name}</div>
                    <p className="text-xs text-[#625e54] mt-1">{comp.role}</p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {comp.technologies?.map((t, i) => (
                        <span
                          key={i}
                          className="text-[10px] font-mono px-2 py-0.5 bg-[#eee9df] text-[#725a36] border border-[#c9b99d]"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Database Schema & API Endpoints */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-[#fffdf8] border border-[#d8d0c1] shadow-sm">
              <h3
                style={{ fontFamily: "var(--display)" }}
                className="text-2xl font-bold text-[#292720] mb-4 flex items-center gap-2"
              >
                <Database className="w-5 h-5 text-[#80643d]" /> Database Schema
              </h3>
              <div className="space-y-3">
                {data.architecture_spec?.database_schema?.map((table, idx) => (
                  <div key={idx} className="p-3.5 bg-[#f8f5ee] border border-[#dcd4c8]">
                    <div className="font-mono text-xs font-bold text-[#394b3f]">
                      {table.table_name}
                    </div>
                    {table.description && (
                      <p className="text-xs text-[#625e54] mt-0.5 mb-2">{table.description}</p>
                    )}
                    <div className="space-y-1 mt-1.5">
                      {table.columns?.map((col, i) => (
                        <div
                          key={i}
                          className="text-[11px] font-mono text-[#39372f] bg-[#eee9df] px-2.5 py-1 border border-[#dcd4c8]"
                        >
                          {col}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 bg-[#fffdf8] border border-[#d8d0c1] shadow-sm">
              <h3
                style={{ fontFamily: "var(--display)" }}
                className="text-2xl font-bold text-[#292720] mb-4"
              >
                REST API Endpoints
              </h3>
              <div className="space-y-3">
                {data.architecture_spec?.api_endpoints?.map((ep, idx) => (
                  <div key={idx} className="p-3.5 bg-[#f8f5ee] border border-[#dcd4c8] space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 ${
                          ep.method === "POST"
                            ? "bg-[#394b3f] text-[#fffdf8]"
                            : "bg-[#80643d] text-[#fffdf8]"
                        }`}
                      >
                        {ep.method}
                      </span>
                      <code className="text-xs font-mono text-[#292720] font-bold">{ep.path}</code>
                    </div>
                    <p className="text-xs text-[#625e54]">{ep.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Builder Prompt (Editorial Architectural Parchment Card) */}
      {activeTab === "prompt" && (
        <div className="p-6 sm:p-8 bg-gradient-to-br from-[#f8f5ee] via-[#fffdf8] to-[#f1ecdf] border border-[#d7ccb8] shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#dcd4c8] pb-4">
            <div>
              <h3
                style={{ fontFamily: "var(--display)" }}
                className="text-2xl font-bold text-[#292720] flex items-center gap-2.5"
              >
                <Terminal className="w-5 h-5 text-[#80643d]" /> AI Builder Master Prompt
              </h3>
              <p className="text-xs text-[#625e54] mt-1">
                Copy and paste this comprehensive prompt into any AI coding assistant (Cursor,
                Windsurf, Bolt, v0, Claude) to build the complete working application.
              </p>
            </div>

            <CopyButton
              value={masterPrompt}
              label="Copy Builder Prompt"
              copiedLabel="Prompt Copied!"
              className="px-5 py-2.5 text-xs font-extrabold bg-[#394b3f] text-[#fffdf8] hover:bg-[#4c604f] border-[#394b3f] shadow-md shadow-[#394b3f]/15"
            />
          </div>

          <div className="relative">
            <pre className="p-6 bg-[#f4efe4] border border-[#d5c9b4] text-xs font-mono text-[#292720] overflow-x-auto max-h-[540px] overflow-y-auto whitespace-pre-wrap leading-relaxed select-all shadow-inner">
              {masterPrompt}
            </pre>
          </div>
        </div>
      )}

      {/* Tab 5: TalkScript & PPT Presentation Studio */}
      {activeTab === "talkscript" && (
        <div className="space-y-8" id="talkscript-studio">
          {/* Top Action & Team Size Control Bar */}
          <div className="p-6 bg-[#fffdf8] border border-[#d8d0c1] shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-[#eee9df] border border-[#c9b99d] font-mono text-[10px] uppercase tracking-[0.14em] text-[#725a36] font-bold">
                <Presentation className="w-3.5 h-3.5 text-[#80643d]" /> PITCH DECK &amp; MULTI-SPEAKER TALKSCRIPT
              </div>
              <h3
                style={{ fontFamily: "var(--display)" }}
                className="text-2xl sm:text-3xl font-bold text-[#292720]"
              >
                8-Slide PPT Presentation &amp; {localTeamSize}-Teammate TalkScript
              </h3>
              <p className="text-xs sm:text-sm text-[#625e54]">
                Tailored to your problem statement with automatic slide-by-slide speaker allocation
                and stage handoff cues.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Interactive Teammate Count Adjuster */}
              <div className="flex items-center gap-2 bg-[#f7f4ed] border border-[#cfc4b2] px-3 py-2">
                <Users className="w-4 h-4 text-[#80643d]" />
                <span className="font-mono text-[11px] uppercase tracking-wider text-[#5e5a50] font-bold">
                  Teammates:
                </span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => handleTeamSizeUpdate(n)}
                      className={`w-6 h-6 text-xs font-mono font-bold transition-colors ${
                        localTeamSize === n
                          ? "bg-[#394b3f] text-[#fffdf8]"
                          : "bg-[#fffdf8] text-[#292720] border border-[#d8cfc0] hover:border-[#80643d]"
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={localTeamSize}
                    onChange={(e) => handleTeamSizeUpdate(Number(e.target.value) || 1)}
                    aria-label="Number of teammates"
                    className="w-12 h-6 px-1.5 text-xs font-mono font-bold bg-[#fffdf8] border border-[#c9b99d] text-[#292720] text-center ml-1"
                  />
                </div>
              </div>

              {/* Download PPTX Button */}
              <button
                type="button"
                onClick={handleDownloadPPTX}
                disabled={isExportingPPT}
                className="flex items-center gap-2 px-4 py-2.5 text-xs font-extrabold bg-[#80643d] hover:bg-[#68512f] text-[#fffdf8] shadow-md transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                {isExportingPPT ? "Building PPTX..." : "Download PPT (.pptx)"}
              </button>

              {/* Download TalkScript PDF Button */}
              <button
                type="button"
                onClick={handleExportTalkScriptPDF}
                className="flex items-center gap-2 px-4 py-2.5 text-xs font-extrabold bg-[#394b3f] hover:bg-[#4c604f] text-[#fffdf8] shadow-md transition-all"
              >
                <Printer className="w-3.5 h-3.5" />
                Download TalkScript (.pdf)
              </button>
            </div>
          </div>

          {/* PART 1: Interactive 16:9 Slide Deck Preview */}
          <div className="p-6 sm:p-8 bg-[#eee9df] border border-[#c9b99d] space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#725a36] font-bold">
                  INTERACTIVE SLIDE DECK PREVIEW (16:9 WIDESCREEN)
                </span>
                <h4
                  style={{ fontFamily: "var(--display)" }}
                  className="text-2xl font-bold text-[#292720]"
                >
                  Slide 0{currentSlide.number} of 0{slides.length}: {currentSlide.title}
                </h4>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setActiveSlideIdx((prev) => (prev - 1 + slides.length) % slides.length)
                  }
                  className="px-3 py-1.5 bg-[#fffdf8] border border-[#c9b99d] text-xs font-mono font-bold text-[#292720] hover:bg-[#f7f4ed] inline-flex items-center gap-1"
                >
                  <ChevronLeft className="w-3.5 h-3.5" /> Prev Slide
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSlideIdx((prev) => (prev + 1) % slides.length)}
                  className="px-3 py-1.5 bg-[#292720] text-[#fffdf8] text-xs font-mono font-bold hover:bg-[#394b3f] inline-flex items-center gap-1"
                >
                  Next Slide <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Active 16:9 Slide Canvas */}
            <div className="bg-[#f7f4ed] border-2 border-[#292720] shadow-[0_22px_50px_rgba(41,39,32,0.14)] overflow-hidden">
              {/* Slide Top Header Bar */}
              <div className="bg-[#292720] text-[#fffdf8] px-5 py-2.5 flex flex-wrap items-center justify-between gap-2 font-mono text-[11px]">
                <span>HACKFORGE AI // {currentSlide.kicker}</span>
                <span className="text-[#d4b483] font-bold">
                  PRESENTED BY TEAMMATE {currentSlide.assignedTeammate} OF {localTeamSize} · SLIDE 0
                  {currentSlide.number}/0{slides.length}
                </span>
              </div>

              {/* Slide Body */}
              <div className="p-6 sm:p-10 space-y-6">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-[#d8cfc0] pb-5">
                  <div className="space-y-2 max-w-2xl">
                    <h2
                      style={{ fontFamily: "var(--display)" }}
                      className="text-3xl sm:text-4xl font-bold text-[#292720] leading-tight"
                    >
                      {currentSlide.title}
                    </h2>
                    <p className="text-sm sm:text-base text-[#5e5a50] italic">
                      {currentSlide.subtitle}
                    </p>
                  </div>
                  <div className="px-4 py-2 bg-[#394b3f] text-[#fffdf8] font-mono text-xs font-bold uppercase tracking-wider shrink-0 self-start">
                    {currentSlide.highlightMetric}
                  </div>
                </div>

                {/* Slide Bullet Cards with Cult UI MinimalCard */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentSlide.bullets.map((bullet, idx) => (
                    <MinimalCard
                      key={idx}
                      className="p-4 bg-[#fffdf8] flex items-start gap-3.5 shadow-sm rounded-xl"
                    >
                      <span className="w-6 h-6 bg-[#eee9df] border border-[#c9b99d] text-[#80643d] font-mono text-xs font-bold flex items-center justify-center shrink-0 rounded-md">
                        0{idx + 1}
                      </span>
                      <p className="text-xs sm:text-sm text-[#292720] font-medium leading-relaxed">
                        {bullet}
                      </p>
                    </MinimalCard>
                  ))}
                </div>

                {/* Slide Footer Speaker Notes */}
                <div className="p-3.5 bg-[#eee9df] border border-[#c9b99d] flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2.5 text-xs text-[#725a36] font-mono">
                    <Mic className="w-4 h-4 text-[#80643d] shrink-0" />
                    <span>
                      <strong>SPEAKER CUE (TEAMMATE {currentSlide.assignedTeammate}):</strong>{" "}
                      {currentSlide.speakerNotes}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 8-Slide Thumbnail Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 pt-2">
              {slides.map((s, idx) => (
                <button
                  key={s.number}
                  type="button"
                  onClick={() => setActiveSlideIdx(idx)}
                  className={`p-2.5 text-left border transition-all ${
                    activeSlideIdx === idx
                      ? "bg-[#292720] text-[#fffdf8] border-[#292720] shadow-md"
                      : "bg-[#fffdf8] text-[#292720] border-[#d8d0c1] hover:border-[#80643d]"
                  }`}
                >
                  <div className="flex items-center justify-between font-mono text-[10px] opacity-80">
                    <span>0{s.number}</span>
                    <span>T{s.assignedTeammate}</span>
                  </div>
                  <div className="font-bold text-xs truncate mt-1">{s.title}</div>
                </button>
              ))}
            </div>
          </div>

          {/* PART 2: Multi-Teammate TalkScript Dossier */}
          <div className="p-6 sm:p-8 bg-[#fffdf8] border border-[#d8d0c1] shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#dcd4c8] pb-4">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#394b3f] font-bold">
                  SYNCHRONIZED SPEAKER SCRIPT · {localTeamSize} TEAMMATE
                  {localTeamSize > 1 ? "S" : ""}
                </span>
                <h4
                  style={{ fontFamily: "var(--display)" }}
                  className="text-2xl sm:text-3xl font-bold text-[#292720] mt-0.5"
                >
                  Team Pitch TalkScript &amp; Stage Cues
                </h4>
              </div>

              <div className="flex items-center gap-2.5">
                <CopyButton
                  value={talkScriptFullText}
                  label="Copy Full Script"
                  copiedLabel="Script Copied!"
                  className="px-4 py-2 text-xs font-bold bg-[#eee9df] hover:bg-[#e2dacb] text-[#292720] border border-[#c9b99d]"
                />

                <button
                  type="button"
                  onClick={handleExportTalkScriptPDF}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-extrabold bg-[#394b3f] hover:bg-[#4c604f] text-[#fffdf8] transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Export TalkScript PDF
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5">
              {talkScriptSegments.map((seg) => (
                <div
                  key={seg.teammateNumber}
                  className="p-5 sm:p-6 bg-[#f7f4ed] border border-[#d5c9b4] border-l-4 border-l-[#394b3f] space-y-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e2dacb] pb-3">
                    <div className="flex items-center gap-3">
                      <span className="w-9 h-9 bg-[#394b3f] text-[#fffdf8] font-serif font-bold text-base flex items-center justify-center">
                        T{seg.teammateNumber}
                      </span>
                      <div>
                        <h5 className="font-bold text-base text-[#292720]">
                          Teammate {seg.teammateNumber} — {seg.roleTitle}
                        </h5>
                        <p className="text-xs text-[#725a36] font-mono">{seg.openingHook}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-1 bg-[#fffdf8] border border-[#c9b99d] font-mono text-[11px] font-bold text-[#292720]">
                        Slides: {seg.slideNumbers.map((n) => `#${n}`).join(", ")}
                      </span>
                      <span className="px-2.5 py-1 bg-[#eee9df] border border-[#c9b99d] font-mono text-[11px] font-bold text-[#80643d] inline-flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {seg.durationLabel}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {seg.scriptParagraphs.map((para, pIdx) => (
                      <div
                        key={pIdx}
                        className="p-4 bg-[#fffdf8] border border-[#dcd4c8] text-xs sm:text-sm text-[#292720] leading-relaxed font-medium"
                      >
                        {para}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                    <div className="p-3 bg-[#eee9df]/80 border border-[#d5c9b4] text-xs text-[#514d43]">
                      <strong className="font-mono text-[10px] uppercase tracking-wider text-[#394b3f] block mb-0.5">
                        STAGE &amp; DEMO ACTION CUE
                      </strong>
                      {seg.stageCue}
                    </div>
                    <div className="p-3 bg-[#eee9df]/80 border border-[#d5c9b4] text-xs text-[#514d43]">
                      <strong className="font-mono text-[10px] uppercase tracking-wider text-[#80643d] block mb-0.5">
                        VERBATIM HANDOFF TO NEXT SPEAKER
                      </strong>
                      {seg.handoffLine}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Carousel Tab Navigator */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 px-2 border-t border-[#dcd4c8]">
        <div className="text-xs font-mono text-[#625e54]">
          Viewing Dossier Section{" "}
          <span className="text-[#292720] font-bold">{currentTabIndex + 1}</span> of{" "}
          <span className="text-[#292720] font-bold">{TAB_ORDER.length}</span>:{" "}
          <span className="text-[#725a36] font-bold">{TAB_LABELS[activeTab]}</span>
        </div>
        <CarouselNavigator
          totalSlides={TAB_ORDER.length}
          currentIndex={currentTabIndex}
          onIndexChange={handleCarouselIndexChange}
        />
      </div>
    </div>
  );
};

function buildFallbackPrompt(data: ProjectStateBlueprint): string {
  const title = data.product_spec?.project_name || "Hackathon MVP Application";
  const domain = data.research_data?.domain_category || "Full-Stack Web Application";
  const features =
    data.product_spec?.mvp_features
      ?.map((f) => `- **${f.name || f.title}** (${f.priority}): ${f.description}`)
      .join("\n") || "- Core MVP workflow features";
  const stackObj =
    data.architecture_spec?.recommended_tech_stack ||
    data.architecture_spec?.tech_stack || {};
  const stack = Object.entries(stackObj)
    .map(([k, v]) => `- **${k.replace("_", " ").toUpperCase()}**: ${v}`)
    .join("\n");
  const workflow =
    data.product_spec?.ux_workflow?.map((w, i) => `${i + 1}. ${w}`).join("\n") ||
    "1. User inputs data\n2. System processes and displays results";

  return `# Role & Objective
You are an expert Full-Stack AI Engineer and Systems Architect. Build a complete, production-ready web application called "${title}" (${domain}).

## 1. Project Context & Problem Statement
- **Problem Statement**: ${data.problem_statement}
- **Core Problem**: ${data.research_data?.core_problem || data.problem_statement}
- **Target Audience**: ${data.research_data?.target_audience?.join(", ") || "Developers & End Users"}

## 2. Core MVP Features
${features}

## 3. Tech Stack & System Architecture
${stack}

## 4. Page Layout, UI/UX Guidelines & User Flow
- Modern responsive UI using Tailwind CSS and Lucide Icons.
- Responsive navigation header, main interactive workspace, and structured visual cards.
- **User Workflow**:
${workflow}

## 5. Step-by-Step Build Instructions
1. Initialize the full-stack project directory structure and dependencies.
2. Implement database schema models and API validation schemas.
3. Build REST API routes and business logic handlers.
4. Create the frontend components, forms, and interactive dashboard views.
5. Connect frontend state to backend endpoints with proper loading and error states.`;
}
