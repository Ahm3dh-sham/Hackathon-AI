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
  ShieldCheck
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

  const handleDownloadMarkdown = () => {
    const md = generateMarkdown(data);
    const blob = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.replace(/[^a-zA-Z0-9]/g, "_")}_Blueprint.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
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
          <button
            onClick={handleDownloadMarkdown}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            Export Blueprint (.md)
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

      {/* Tab 3: Technical Architecture */}
      {activeTab === "architecture" && (
        <div className="space-y-6">
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
              <Database className="w-4 h-4 text-emerald-400" /> Database Schema
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
