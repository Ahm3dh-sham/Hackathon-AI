"use client";

import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Loader2,
  Lightbulb,
  Cpu,
  Globe,
  Layers,
  Server,
  Terminal,
  CheckCircle2,
  Command,
} from "lucide-react";
import { SpotlightCard } from "@/components/react-bits/SpotlightCard";

interface InputFormProps {
  onSubmit: (problemStatement: string) => void;
  isLoading: boolean;
}

const PRESET_IDEAS = [
  {
    title: "AI Medical Triage Agent",
    tag: "HealthTech",
    statement:
      "Emergency room triage queues are overwhelmed. Build an autonomous multi-modal AI agent that ingests patient vitals, symptom descriptions, and medical history to prioritize triage queues and draft doctor preliminary summaries.",
  },
  {
    title: "Autonomous Code Reviewer",
    tag: "DevTools",
    statement:
      "Developers spend 30% of their time reviewing pull requests. Build an autonomous multi-agent platform that automatically checks PRs for security vulnerabilities, memory leaks, and performance bottlenecks, returning inline markdown suggestions.",
  },
  {
    title: "DeFi Micro-Loans for Gig Workers",
    tag: "FinTech / Web3",
    statement:
      "Traditional credit scoring excludes 500M+ gig economy workers. Create an AI-powered decentralized credit scoring protocol that analyzes on-chain earnings, rideshare receipts, and bank transaction data to issue instant micro-collateralized loans.",
  },
  {
    title: "Smart Grid Carbon Optimizer",
    tag: "ClimateAI",
    statement:
      "Data centers consume massive electricity during peak carbon hours. Build a real-time workload scheduling platform that shifts non-urgent AI training and batch compute jobs across regions based on live renewable energy grid telemetry.",
  },
];

const AGENT_STEPS = [
  { name: "Orchestrator", desc: "Decomposing problem statement & context", icon: Cpu },
  { name: "Research Agent", desc: "Analyzing market, personas & competitors", icon: Globe },
  { name: "Product Agent", desc: "Designing MVP features & user journeys", icon: Layers },
  { name: "Architecture Agent", desc: "Mapping stack, DB schema & APIs", icon: Server },
  { name: "Prompt Synthesizer", desc: "Compiling master AI builder prompt", icon: Terminal },
];

export const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading }) => {
  const [problemStatement, setProblemStatement] = useState("");
  const [activeAgentIdx, setActiveAgentIdx] = useState(0);

  useEffect(() => {
    if (!isLoading) {
      setActiveAgentIdx(0);
      return;
    }
    const interval = setInterval(() => {
      setActiveAgentIdx((prev) => (prev < AGENT_STEPS.length - 1 ? prev + 1 : prev));
    }, 4200);
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!problemStatement.trim() || isLoading) return;
    onSubmit(problemStatement.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      if (problemStatement.trim() && !isLoading) {
        onSubmit(problemStatement.trim());
      }
    }
  };

  return (
    <SpotlightCard
      className="p-6 md:p-8 shadow-2xl shadow-indigo-950/30"
      spotlightColor="rgba(99, 102, 241, 0.24)"
    >
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 text-indigo-400 shadow-inner">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Generate Project Blueprint
            </h2>
            <p className="text-sm text-gray-400">
              Describe your hackathon challenge to launch our autonomous 5-node LangGraph pipeline.
            </p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-1.5 text-[11px] font-mono text-gray-400 bg-gray-950/70 border border-gray-800 px-2.5 py-1.5 rounded-lg">
          <Command className="w-3 h-3 text-indigo-400" />
          <span>Ctrl + Enter to run</span>
        </div>
      </div>

      {/* Preset Idea Selector */}
      <div className="mb-6">
        <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2.5 flex items-center gap-1.5">
          <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
          Quick-Start Problem Templates
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {PRESET_IDEAS.map((preset, idx) => {
            const isSelected = problemStatement === preset.statement;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setProblemStatement(preset.statement)}
                className={`group flex items-center justify-between px-3.5 py-2.5 rounded-xl border text-left transition-all duration-200 ${
                  isSelected
                    ? "bg-indigo-600/20 border-indigo-500/60 text-white shadow-lg shadow-indigo-500/10"
                    : "bg-gray-950/60 hover:bg-indigo-950/40 text-gray-300 hover:text-white border-gray-800/90 hover:border-indigo-500/40"
                }`}
              >
                <span className="text-xs font-semibold truncate pr-2">{preset.title}</span>
                <span className="shrink-0 text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 group-hover:bg-indigo-500/20">
                  {preset.tag}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-200">
              Hackathon Problem Statement <span className="text-indigo-400">*</span>
            </label>
            <span className="text-xs font-mono text-gray-500">
              {problemStatement.length} chars
            </span>
          </div>
          <div className="relative">
            <textarea
              required
              rows={5}
              value={problemStatement}
              onChange={(e) => setProblemStatement(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Paste or type your hackathon problem statement here... (e.g. 'Build an autonomous multi-agent platform for developer workflow automation')"
              className="w-full rounded-xl bg-gray-950/90 border border-gray-800 p-4 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-sans leading-relaxed"
            />
          </div>
        </div>

        {/* Live Multi-Agent Progress Stepper when generating */}
        {isLoading && (
          <div className="p-4 rounded-xl bg-gray-950/90 border border-indigo-500/30 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-indigo-300 flex items-center gap-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                Executing LangGraph Multi-Agent Pipeline...
              </span>
              <span className="font-mono text-gray-400">
                Step {activeAgentIdx + 1} of {AGENT_STEPS.length}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
              {AGENT_STEPS.map((step, i) => {
                const Icon = step.icon;
                const isDone = i < activeAgentIdx;
                const isCurrent = i === activeAgentIdx;
                return (
                  <div
                    key={step.name}
                    className={`p-2.5 rounded-lg border text-xs transition-all duration-300 ${
                      isCurrent
                        ? "bg-indigo-600/20 border-indigo-500 text-white shadow-md shadow-indigo-500/10"
                        : isDone
                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                        : "bg-gray-900/50 border-gray-800/80 text-gray-500"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-semibold mb-1">
                      {isDone ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      ) : (
                        <Icon
                          className={`w-3.5 h-3.5 shrink-0 ${
                            isCurrent ? "text-indigo-400 animate-pulse" : "text-gray-500"
                          }`}
                        />
                      )}
                      <span className="truncate">{step.name}</span>
                    </div>
                    <p className="text-[10px] leading-tight opacity-80 line-clamp-2">
                      {step.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading || !problemStatement.trim()}
          className="w-full relative group overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 p-0.5 font-semibold text-white shadow-xl shadow-indigo-600/25 hover:shadow-indigo-600/45 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="w-full bg-[#090d16]/25 group-hover:bg-transparent px-6 py-3.5 rounded-[10px] flex items-center justify-center gap-2.5 transition-all">
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin text-white" />
                <span className="text-white font-semibold">
                  Forging Complete Architecture & Builder Prompt...
                </span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-indigo-200 group-hover:rotate-12 group-hover:scale-110 transition-transform" />
                <span className="text-base tracking-tight">Generate Complete Blueprint</span>
              </>
            )}
          </div>
        </button>
      </form>
    </SpotlightCard>
  );
};
