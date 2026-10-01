"use client";

import React, { useState } from "react";
import {
  FileText,
  Layers,
  Cpu,
  CheckCircle2,
  AlertTriangle,
  Download,
  Copy,
  Check,
  Server,
  Database,
  Sparkles,
  Printer,
  Globe,
  ArrowRight
} from "lucide-react";

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
  current_step?: string;
}

interface BlueprintDisplayProps {
  data: ProjectStateBlueprint;
  onReset?: () => void;
}

export const BlueprintDisplay: React.FC<BlueprintDisplayProps> = ({ data, onReset }) => {
  const [activeTab, setActiveTab] = useState<"research" | "product" | "architecture">("research");
  const [copied, setCopied] = useState(false);

  const title = data.product_spec?.project_name || "Hackathon Project Blueprint";

  const handleCopyMarkdown = () => {
    const md = generateMarkdown(data);
    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportPDF = () => {
    // Open print window configured specifically for PDF export
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Please allow popups to generate the PDF file.");
      return;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${title} - HackForge AI Blueprint</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 40px;
            color: #1f2937;
            background: #ffffff;
            line-height: 1.6;
          }
          .header {
            border-bottom: 3px solid #4f46e5;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .badge {
            display: inline-block;
            background: #e0e7ff;
            color: #3730a3;
            padding: 4px 12px;
            border-radius: 9999px;
            font-size: 12px;
            font-weight: 700;
            text-transform: uppercase;
          }
          h1 {
            color: #111827;
            margin: 10px 0 5px 0;
            font-size: 28px;
          }
          .subtitle {
            color: #6b7280;
            font-size: 14px;
          }
          .section {
            margin-bottom: 35px;
            page-break-inside: avoid;
          }
          .section-title {
            font-size: 18px;
            font-weight: 700;
            color: #4f46e5;
            border-bottom: 1px solid #e5e7eb;
            padding-bottom: 8px;
            margin-bottom: 15px;
          }
          .card {
            background: #f9fafb;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 16px;
            margin-bottom: 15px;
          }
          .grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
          }
          .diagram-box {
            background: #0f172a;
            color: #f8fafc;
            padding: 20px;
            border-radius: 12px;
            text-align: center;
            margin: 20px 0;
          }
          .diagram-flow {
            display: flex;
            align-items: center;
            justify-content: space-around;
            margin-top: 15px;
          }
          .node {
            background: #1e293b;
            border: 1px solid #38bdf8;
            color: #38bdf8;
            padding: 10px 15px;
            border-radius: 8px;
            font-size: 12px;
            font-weight: bold;
          }
          .arrow {
            color: #94a3b8;
            font-size: 18px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
          }
          th, td {
            border: 1px solid #e5e7eb;
            padding: 10px;
            text-align: left;
            font-size: 13px;
          }
          th {
            background: #f3f4f6;
            font-weight: 700;
          }
          .footer {
            margin-top: 50px;
            text-align: center;
            font-size: 11px;
            color: #9ca3af;
            border-top: 1px solid #e5e7eb;
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

        <!-- Section 1: Research Analysis -->
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

        <!-- Visual Architecture Diagram -->
        <div class="section">
          <div class="section-title">2. System Architecture Workflow Diagram</div>
          <div class="diagram-box">
            <div style="font-size: 14px; font-weight: bold; margin-bottom: 10px; color: #a5b4fc;">
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

        <!-- Section 3: Product Specification -->
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
                  <td><span class="badge">${f.priority}</span></td>
                </tr>
              `
                )
                .join("") || ""}
            </tbody>
          </table>
        </div>

        <!-- Section 4: Technical Architecture & DB Schema -->
        <div class="section">
          <div class="section-title">4. Technical Architecture & Database Schemas</div>
          <div class="card">
            <strong>Recommended Tech Stack:</strong>
            <ul>
              ${Object.entries(data.architecture_spec?.recommended_tech_stack || {})
                .map(([k, v]) => `<li><strong>${k.replace("_", " ")}:</strong> ${v}</li>`)
                .join("")}
            </ul>
          </div>

          <strong>Database Tables:</strong>
          ${data.architecture_spec?.database_schema
            ?.map(
              (tbl) => `
            <div class="card">
              <strong>Table: <code>${tbl.table_name}</code></strong> - ${tbl.description}
              <div style="margin-top: 8px; font-family: monospace; font-size: 12px; color: #4b5563;">
                ${tbl.columns?.map((c) => `<div>• ${c}</div>`).join("")}
              </div>
            </div>
          `
            )
            .join("")}
        </div>

        <!-- Footer -->
        <div class="footer">
          Generated by <strong>HackForge AI Platform</strong> — Autonomous LangGraph Multi-Agent Engine
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
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="glass-panel rounded-2xl p-6 border border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              {data.research_data?.domain_category || "AI Platform"}
            </span>
            <span className="text-xs text-emerald-400 font-medium">
              Feasibility Score: {data.research_data?.feasibility_score || 92}/100
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">{title}</h1>
          <p className="text-sm text-gray-400 line-clamp-1 mt-1">{data.problem_statement}</p>
        </div>

        <div className="flex items-center gap-2">
          {onReset && (
            <button
              onClick={onReset}
              className="px-3.5 py-2 text-xs font-medium rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors"
            >
              New Blueprint
            </button>
          )}
          <button
            onClick={handleCopyMarkdown}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? "Copied!" : "Copy MD"}
          </button>
          
          {/* PDF Export Button */}
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-lg shadow-indigo-600/20 transition-all border border-indigo-500/30"
          >
            <Printer className="w-3.5 h-3.5" />
            Export Blueprint (.pdf)
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-gray-800 gap-2">
        <button
          onClick={() => setActiveTab("research")}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-all ${
            activeTab === "research"
              ? "border-indigo-500 text-indigo-400 bg-indigo-500/5"
              : "border-transparent text-gray-400 hover:text-gray-200"
          }`}
        >
          <FileText className="w-4 h-4" /> Research Analysis
        </button>

        <button
          onClick={() => setActiveTab("product")}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-all ${
            activeTab === "product"
              ? "border-indigo-500 text-indigo-400 bg-indigo-500/5"
              : "border-transparent text-gray-400 hover:text-gray-200"
          }`}
        >
          <Layers className="w-4 h-4" /> Product Specification
        </button>

        <button
          onClick={() => setActiveTab("architecture")}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-all ${
            activeTab === "architecture"
              ? "border-indigo-500 text-indigo-400 bg-indigo-500/5"
              : "border-transparent text-gray-400 hover:text-gray-200"
          }`}
        >
          <Cpu className="w-4 h-4" /> Technical Architecture
        </button>
      </div>

      {/* Tab 1: Research Analysis */}
      {activeTab === "research" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-panel p-6 rounded-2xl border border-gray-800 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" /> Core Problem & Market Analysis
            </h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              {data.research_data?.core_problem}
            </p>

            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 pt-2">
              Competitive Landscape
            </h4>
            <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-800/40 text-sm text-indigo-200">
              {data.research_data?.competitive_landscape}
            </div>
          </div>

          <div className="space-y-6">
            <div className="glass-panel p-6 rounded-2xl border border-gray-800">
              <h3 className="text-base font-bold text-white mb-3">Target Audience</h3>
              <ul className="space-y-2">
                {data.research_data?.target_audience?.map((user, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-sm text-gray-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{user}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-gray-800">
              <h3 className="text-base font-bold text-white mb-3">Key Pain Points</h3>
              <ul className="space-y-2">
                {data.research_data?.key_pain_points?.map((pain, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-sm text-gray-300">
                    <span className="w-2 h-2 rounded-full bg-rose-400 shrink-0 mt-2" />
                    <span>{pain}</span>
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
          <div className="glass-panel p-6 rounded-2xl border border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" /> Hackathon MVP Core Features
              </h3>
              <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
                MVP Scope
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {data.product_spec?.mvp_features?.map((feat, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-gray-900/80 border border-gray-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-white">{feat.name}</span>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                      {feat.priority}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed">{feat.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-panel p-6 rounded-2xl border border-gray-800 space-y-3">
              <h3 className="text-base font-bold text-white">User Stories</h3>
              <div className="space-y-2.5">
                {data.product_spec?.user_stories?.map((story, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-gray-900/60 border border-gray-800/80 text-xs text-gray-300 italic">
                    "{story}"
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-gray-800 space-y-3">
              <h3 className="text-base font-bold text-white">UX Workflow</h3>
              <div className="space-y-2">
                {data.product_spec?.ux_workflow?.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-xs text-gray-300">
                    <div className="w-5 h-5 rounded-full bg-indigo-600/30 text-indigo-300 flex items-center justify-center font-bold text-[10px] shrink-0">
                      {idx + 1}
                    </div>
                    <span className="pt-0.5">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Technical Architecture & Visual Diagrams */}
      {activeTab === "architecture" && (
        <div className="space-y-6">
          {/* Visual Architecture Flowchart Diagram */}
          <div className="glass-panel p-6 rounded-2xl border border-gray-800 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Globe className="w-4 h-4 text-indigo-400" /> Visual System Architecture Flowchart
            </h3>

            <div className="p-6 rounded-xl bg-gray-950 border border-gray-800">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center">
                <div className="p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 w-full sm:w-auto">
                  <span className="text-xs font-bold text-indigo-300 block">User Web App</span>
                  <span className="text-[10px] text-gray-400">Next.js 14 UI</span>
                </div>
                <ArrowRight className="w-5 h-5 text-indigo-400 hidden sm:block" />
                <div className="p-3.5 rounded-xl bg-violet-500/10 border border-violet-500/30 w-full sm:w-auto">
                  <span className="text-xs font-bold text-violet-300 block">FastAPI Server</span>
                  <span className="text-[10px] text-gray-400">API Gateway & Routes</span>
                </div>
                <ArrowRight className="w-5 h-5 text-violet-400 hidden sm:block" />
                <div className="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/30 w-full sm:w-auto">
                  <span className="text-xs font-bold text-purple-300 block">LangGraph Engine</span>
                  <span className="text-[10px] text-gray-400">Multi-Agent Workflow</span>
                </div>
                <ArrowRight className="w-5 h-5 text-purple-400 hidden sm:block" />
                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 w-full sm:w-auto">
                  <span className="text-xs font-bold text-emerald-300 block">PostgreSQL / LLM</span>
                  <span className="text-[10px] text-gray-400">State Persistence</span>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-gray-800">
            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <Server className="w-4 h-4 text-indigo-400" /> Recommended Tech Stack
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(data.architecture_spec?.recommended_tech_stack || {}).map(([key, val]) => (
                <div key={key} className="p-3.5 rounded-xl bg-gray-900/80 border border-gray-800">
                  <span className="text-[10px] font-bold uppercase text-indigo-400 tracking-wider block mb-1">
                    {key.replace("_", " ")}
                  </span>
                  <span className="text-xs font-medium text-gray-200">{val}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-gray-800 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-400" /> Database Schema & Entity Relational Design
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.architecture_spec?.database_schema?.map((tbl, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-gray-950 border border-gray-800 space-y-2">
                  <div className="flex items-center justify-between border-b border-gray-800 pb-2">
                    <span className="font-mono font-bold text-sm text-indigo-300">{tbl.table_name}</span>
                    <span className="text-[10px] text-gray-500">{tbl.description}</span>
                  </div>
                  <div className="space-y-1 pt-1">
                    {tbl.columns?.map((col, cIdx) => (
                      <div key={cIdx} className="text-xs font-mono text-gray-400 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-600" />
                        {col}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-gray-800 space-y-4">
            <h3 className="text-base font-bold text-white">REST API Endpoints</h3>
            <div className="space-y-3">
              {data.architecture_spec?.api_endpoints?.map((ep, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-gray-900/80 border border-gray-800 space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300">
                      {ep.method}
                    </span>
                    <span className="font-mono text-sm font-semibold text-white">{ep.path}</span>
                  </div>
                  <p className="text-xs text-gray-400">{ep.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

function generateMarkdown(data: ProjectStateBlueprint): string {
  return `# ${data.product_spec?.project_name || "Hackathon Blueprint"}

## Problem Statement
${data.problem_statement}

## 1. Research Data
- **Domain**: ${data.research_data?.domain_category}
- **Core Problem**: ${data.research_data?.core_problem}
- **Feasibility Score**: ${data.research_data?.feasibility_score}/100

### Target Audience
${data.research_data?.target_audience?.map((t) => `- ${t}`).join("\n")}

### Key Pain Points
${data.research_data?.key_pain_points?.map((p) => `- ${p}`).join("\n")}

## 2. Product Specification
### MVP Features
${data.product_spec?.mvp_features?.map((f) => `- **${f.name}**: ${f.description}`).join("\n")}

### User Stories
${data.product_spec?.user_stories?.map((s) => `- ${s}`).join("\n")}

## 3. Architecture Specification
### Recommended Tech Stack
${Object.entries(data.architecture_spec?.recommended_tech_stack || {})
  .map(([k, v]) => `- **${k}**: ${v}`)
  .join("\n")}

### Database Schema
${data.architecture_spec?.database_schema
  ?.map((tbl) => `#### Table: \`${tbl.table_name}\`\nColumns:\n${tbl.columns.map((c) => `- \`${c}\``).join("\n")}`)
  .join("\n\n")}

### REST API Endpoints
${data.architecture_spec?.api_endpoints
  ?.map((ep) => `\`${ep.method} ${ep.path}\`: ${ep.description}`)
  .join("\n")}
`;
}
