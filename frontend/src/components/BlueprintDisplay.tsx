"use client";

import React, { useState } from "react";
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
} from "lucide-react";
import { CarouselNavigator } from "@/components/carousel-navigator";

const TAB_ORDER: Array<"research" | "product" | "architecture" | "prompt"> = [
  "research",
  "product",
  "architecture",
  "prompt",
];

const TAB_LABELS: Record<"research" | "product" | "architecture" | "prompt", string> = {
  research: "Research Analysis",
  product: "Product Specification",
  architecture: "Technical Architecture",
  prompt: "Builder Prompt",
};

export interface ProjectStateBlueprint {
  problem_statement: string;
  research_data: {
    domain_category?: string;
    core_problem?: string;
    target_audience?: string[];
    key_pain_points?: string[];
    competitive_landscape?: string;
    feasibility_score?: number;
  };
  product_spec: {
    project_name?: string;
    mvp_features?: Array<{ name: string; description: string; priority: string }>;
    phase2_features?: Array<{ name: string; description: string; priority: string }>;
    user_stories?: string[];
    ux_workflow?: string[];
  };
  architecture_spec: {
    recommended_tech_stack?: Record<string, string>;
    system_components?: Array<{ name: string; role: string; technologies: string[] }>;
    database_schema?: Array<{ table_name: string; description: string; columns: string[] }>;
    api_endpoints?: Array<{
      method: string;
      path: string;
      description: string;
      request_body?: string;
      response_body?: string;
    }>;
  };
  builderPrompt?: string;
  current_step?: string;
}

interface BlueprintDisplayProps {
  data: ProjectStateBlueprint;
  onReset?: () => void;
}

export const BlueprintDisplay: React.FC<BlueprintDisplayProps> = ({ data, onReset }) => {
  const [activeTab, setActiveTab] = useState<"research" | "product" | "architecture" | "prompt">(
    "research"
  );
  const [promptCopied, setPromptCopied] = useState(false);

  const currentTabIndex = TAB_ORDER.indexOf(activeTab);
  const handleCarouselIndexChange = (index: number) => {
    const nextTab = TAB_ORDER[index];
    if (nextTab) setActiveTab(nextTab);
  };

  const title = data.product_spec?.project_name || "Hackathon Project Blueprint";
  const masterPrompt = data.builderPrompt || buildFallbackPrompt(data);

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(masterPrompt);
    setPromptCopied(true);
    setTimeout(() => setPromptCopied(false), 2000);
  };

  const handleExportPDF = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Please allow pop-ups to export the Blueprint PDF.");
      return;
    }

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
          .diagram-box {
            background: #eee9df;
            color: #292720;
            padding: 24px;
            border: 1px solid #c9b99d;
            margin: 16px 0;
            text-align: center;
          }
          .diagram-flow {
            display: flex;
            align-items: center;
            justify-content: space-around;
            margin-top: 15px;
            flex-wrap: wrap;
            gap: 10px;
          }
          .node {
            background: #fffdf8;
            border: 2px solid #80643d;
            padding: 12px 18px;
            font-weight: bold;
            font-size: 13px;
            color: #292720;
          }
          .arrow {
            color: #80643d;
            font-size: 20px;
            font-weight: bold;
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
            .no-print { display: none; }
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
            <strong>Feasibility Score:</strong> ${data.research_data?.feasibility_score || 92}/100
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
                ${data.research_data?.key_pain_points?.map((p) => `<li>${p}</li>`).join("") || "<li>Manual overhead & friction</li>"}
              </ul>
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">2. System Architecture Workflow Diagram</div>
          <div class="diagram-box">
            <div style="font-size: 14px; font-weight: bold; margin-bottom: 10px; color: #725a36;">
              System Topology & Data Flow
            </div>
            <div class="diagram-flow">
              <div class="node">User Web Portal</div>
              <div class="arrow">➔</div>
              <div class="node">FastAPI Gateway</div>
              <div class="arrow">➔</div>
              <div class="node">LangGraph Multi-Agent Engine</div>
              <div class="arrow">➔</div>
              <div class="node">PostgreSQL & LLM</div>
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">3. Product Specification & MVP Features</div>
          <table>
            <thead>
              <tr>
                <th>Feature Name</th>
                <th>Description</th>
                <th>Priority</th>
              </tr>
            </thead>
            <tbody>
              ${data.product_spec?.mvp_features
                ?.map(
                  (f) => `
                <tr>
                  <td><strong>${f.name}</strong></td>
                  <td>${f.description}</td>
                  <td>${f.priority}</td>
                </tr>
              `
                )
                .join("") || ""}
            </tbody>
          </table>
        </div>

        <div class="section">
          <div class="section-title">4. Technical Stack & API Endpoints</div>
          <div class="card">
            <strong>Recommended Tech Stack:</strong>
            <ul>
              ${Object.entries(data.architecture_spec?.recommended_tech_stack || {})
                .map(([k, v]) => `<li><strong>${k.toUpperCase()}:</strong> ${v}</li>`)
                .join("")}
            </ul>
          </div>
          <table>
            <thead>
              <tr>
                <th>Method</th>
                <th>Endpoint</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              ${data.architecture_spec?.api_endpoints
                ?.map(
                  (ep) => `
                <tr>
                  <td><strong>${ep.method}</strong></td>
                  <td><code>${ep.path}</code></td>
                  <td>${ep.description}</td>
                </tr>
              `
                )
                .join("") || ""}
            </tbody>
          </table>
        </div>

        <div class="section">
          <div class="section-title">5. AI Builder Master Prompt</div>
          <div class="prompt-box">${masterPrompt.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</div>
        </div>

        <div class="footer">
          Generated by HackForge AI — Autonomous Multi-Agent Hackathon Blueprint Platform
        </div>

        <script>
          window.onload = function() {
            window.print();
          };
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  return (
    <div className="space-y-6 text-[#292720]">
      {/* Editorial Project Header Banner */}
      <div className="p-6 sm:p-8 bg-gradient-to-br from-[#f8f5ee] via-[#fffdf8] to-[#f1ecdf] border border-[#d7ccb8] shadow-[0_12px_36px_rgba(61,51,37,0.08)] flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] px-3 py-1 bg-[#eee9df] text-[#725a36] border border-[#c9b99d]">
              {data.research_data?.domain_category || "AI Platform"}
            </span>
            <span className="font-mono text-[11px] text-[#394b3f] font-semibold px-2.5 py-0.5 bg-[#e8ede3] border border-[#9cab95]">
              Feasibility Score: {data.research_data?.feasibility_score || 92}/100
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

        <div className="flex items-center gap-3 shrink-0">
          {onReset && (
            <button
              onClick={onReset}
              className="px-4 py-2.5 text-xs font-bold bg-[#eee9df] hover:bg-[#e5dfd4] text-[#302d25] border border-[#d3cbbd] transition-colors"
            >
              New Blueprint
            </button>
          )}

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
              {data.research_data?.competitive_landscape}
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
                {data.research_data?.key_pain_points?.map((point, idx) => (
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
              <Sparkles className="w-5 h-5 text-[#80643d]" /> Core MVP Features (Hackathon Scope)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {data.product_spec?.mvp_features?.map((feat, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-[#f8f5ee] border border-[#dcd4c8] hover:border-[#80643d] transition-colors flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <h4 className="font-bold text-[#292720] text-sm">{feat.name}</h4>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-[#394b3f] text-[#fffdf8]">
                        {feat.priority}
                      </span>
                    </div>
                    <p className="text-xs text-[#625e54] leading-relaxed">{feat.description}</p>
                  </div>
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
              <ul className="space-y-2.5">
                {data.product_spec?.user_stories?.map((story, idx) => (
                  <li
                    key={idx}
                    className="p-3.5 bg-[#f8f5ee] border border-[#dcd4c8] text-xs text-[#39372f] leading-relaxed"
                  >
                    &ldquo;{story}&rdquo;
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-6 bg-[#fffdf8] border border-[#d8d0c1] shadow-sm">
              <h3
                style={{ fontFamily: "var(--display)" }}
                className="text-2xl font-bold text-[#292720] mb-3"
              >
                End-to-End UX Workflow
              </h3>
              <ol className="space-y-3">
                {data.product_spec?.ux_workflow?.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-xs text-[#514d43]">
                    <span className="w-6 h-6 rounded-full bg-[#394b3f] text-[#fffdf8] font-mono font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <span className="pt-1 leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Technical Architecture & Visual Diagram */}
      {activeTab === "architecture" && (
        <div className="space-y-6">
          {/* Interactive Visual System Architecture Diagram */}
          <div className="p-6 bg-gradient-to-br from-[#f1ecdf] via-[#f8f5ee] to-[#fffdf8] border border-[#d7ccb8] shadow-sm">
            <h3
              style={{ fontFamily: "var(--display)" }}
              className="text-2xl font-bold text-[#292720] mb-4 flex items-center gap-2"
            >
              <Globe className="w-5 h-5 text-[#80643d]" /> Visual System Topology &amp; Agent
              Dataflow
            </h3>
            <div className="p-6 bg-[#eee9df]/70 border border-[#d8d0c1]">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex-1 p-4 bg-[#fffdf8] border border-[#c9b99d] text-center shadow-sm w-full">
                  <div className="font-mono text-[10px] font-bold text-[#80643d] uppercase">
                    Client Layer
                  </div>
                  <div className="text-sm font-bold text-[#292720] mt-1">Next.js 14 Web UI</div>
                  <div className="text-[11px] text-[#625e54] mt-1">
                    {data.architecture_spec?.recommended_tech_stack?.frontend ||
                      "React + Tailwind CSS"}
                  </div>
                </div>

                <ArrowRight className="w-5 h-5 text-[#80643d] rotate-90 md:rotate-0 shrink-0" />

                <div className="flex-1 p-4 bg-[#fffdf8] border border-[#9cab95] text-center shadow-sm w-full">
                  <div className="font-mono text-[10px] font-bold text-[#526a56] uppercase">
                    API Gateway
                  </div>
                  <div className="text-sm font-bold text-[#292720] mt-1">FastAPI REST Engine</div>
                  <div className="text-[11px] text-[#625e54] mt-1">
                    {data.architecture_spec?.recommended_tech_stack?.backend ||
                      "Python 3.11 + Pydantic"}
                  </div>
                </div>

                <ArrowRight className="w-5 h-5 text-[#526a56] rotate-90 md:rotate-0 shrink-0" />

                <div className="flex-1 p-4 bg-[#fffdf8] border border-[#b9a784] text-center shadow-sm w-full">
                  <div className="font-mono text-[10px] font-bold text-[#725a36] uppercase">
                    AI Orchestration
                  </div>
                  <div className="text-sm font-bold text-[#292720] mt-1">LangGraph Multi-Agent</div>
                  <div className="text-[11px] text-[#625e54] mt-1">
                    {data.architecture_spec?.recommended_tech_stack?.ai_engine ||
                      "Orchestrator → Agents"}
                  </div>
                </div>

                <ArrowRight className="w-5 h-5 text-[#725a36] rotate-90 md:rotate-0 shrink-0" />

                <div className="flex-1 p-4 bg-[#fffdf8] border border-[#a39b8b] text-center shadow-sm w-full">
                  <div className="font-mono text-[10px] font-bold text-[#4d5147] uppercase">
                    Persistence
                  </div>
                  <div className="text-sm font-bold text-[#292720] mt-1">Database &amp; Vector</div>
                  <div className="text-[11px] text-[#625e54] mt-1">
                    {data.architecture_spec?.recommended_tech_stack?.database ||
                      "PostgreSQL + pgvector"}
                  </div>
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
                <Server className="w-5 h-5 text-[#526a56]" /> Recommended Tech Stack
              </h3>
              <div className="space-y-3">
                {Object.entries(data.architecture_spec?.recommended_tech_stack || {}).map(
                  ([layer, tech]) => (
                    <div
                      key={layer}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-[#f8f5ee] border border-[#dcd4c8] gap-1"
                    >
                      <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#725a36]">
                        {layer.replace("_", " ")}
                      </span>
                      <span className="text-xs font-semibold text-[#292720]">{tech}</span>
                    </div>
                  )
                )}
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
                {data.architecture_spec?.system_components?.map((comp, idx) => (
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
                    <p className="text-xs text-[#625e54] mt-0.5 mb-2">{table.description}</p>
                    <div className="space-y-1">
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

            <button
              onClick={handleCopyPrompt}
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-extrabold bg-[#394b3f] hover:bg-[#4c604f] text-[#fffdf8] shadow-md shadow-[#394b3f]/15 transition-all shrink-0 self-start sm:self-auto"
            >
              {promptCopied ? (
                <>
                  <Check className="w-4 h-4 text-[#d5fa70]" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Prompt</span>
                </>
              )}
            </button>
          </div>

          <div className="relative">
            <pre className="p-6 bg-[#f4efe4] border border-[#d5c9b4] text-xs font-mono text-[#292720] overflow-x-auto max-h-[540px] overflow-y-auto whitespace-pre-wrap leading-relaxed select-all shadow-inner">
              {masterPrompt}
            </pre>
          </div>
        </div>
      )}

      {/* Bottom Carousel Tab Navigator */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 px-2 border-t border-[#dcd4c8]">
        <div className="text-xs font-mono text-[#625e54]">
          Viewing Dossier Section <span className="text-[#292720] font-bold">{currentTabIndex + 1}</span> of{" "}
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
      ?.map((f) => `- **${f.name}** (${f.priority}): ${f.description}`)
      .join("\n") || "- Core MVP workflow features";
  const stack = Object.entries(data.architecture_spec?.recommended_tech_stack || {})
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
