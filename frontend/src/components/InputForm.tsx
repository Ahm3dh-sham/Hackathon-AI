"use client";

import React, { useState } from "react";
import { Sparkles, Loader2, Lightbulb } from "lucide-react";

interface InputFormProps {
  onSubmit: (problemStatement: string) => void;
  isLoading: boolean;
}

const PRESET_IDEAS = [
  {
    title: "AI Medical Triage Agent",
    statement: "Emergency room triage queues are overwhelmed. Build an autonomous multi-modal AI agent that ingests patient vitals, symptom descriptions, and medical history to prioritize triage queues and draft doctor preliminary summaries."
  },
  {
    title: "Autonomous Code Reviewer",
    statement: "Developers spend 30% of their time reviewing pull requests. Build an autonomous multi-agent platform that automatically checks PRs for security vulnerabilities, memory leaks, and performance bottlenecks, returning inline markdown suggestions."
  },
  {
    title: "DeFi Micro-Loans for Gig Workers",
    statement: "Traditional credit scoring excludes 500M+ gig economy workers. Create an AI-powered decentralized credit scoring protocol that analyzes on-chain earnings, rideshare receipts, and bank transaction data to issue instant micro-collateralized loans."
  }
];

export const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading }) => {
  const [problemStatement, setProblemStatement] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!problemStatement.trim()) return;
    onSubmit(problemStatement.trim());
  };

  return (
    <div className="glass-panel rounded-2xl p-6 md:p-8 border border-gray-800 shadow-2xl relative overflow-hidden">
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Generate Project Blueprint</h2>
          <p className="text-sm text-gray-400">
            Submit your hackathon problem statement to trigger the 4-agent stateful graph.
          </p>
        </div>
      </div>

      {/* Preset Idea Selector */}
      <div className="mb-6">
        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2 flex items-center gap-1.5">
          <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
          Example Problem Statements
        </label>
        <div className="flex flex-wrap gap-2">
          {PRESET_IDEAS.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setProblemStatement(preset.statement)}
              className="text-xs px-3 py-1.5 rounded-lg bg-gray-800/80 hover:bg-indigo-900/40 text-gray-300 hover:text-indigo-200 border border-gray-700/60 hover:border-indigo-500/40 transition-all text-left"
            >
              {preset.title}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">
            Hackathon Problem Statement <span className="text-indigo-400">*</span>
          </label>
          <textarea
            required
            rows={5}
            value={problemStatement}
            onChange={(e) => setProblemStatement(e.target.value)}
            placeholder="Paste or type your hackathon problem statement here... (e.g. 'Build an autonomous multi-agent platform for developer workflow automation')"
            className="w-full rounded-xl bg-gray-950/80 border border-gray-800 p-4 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-sans"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !problemStatement.trim()}
          className="w-full relative group overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 p-0.5 font-semibold text-white shadow-xl shadow-indigo-600/20 hover:shadow-indigo-600/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="w-full bg-[#090d16]/30 hover:bg-transparent px-6 py-3.5 rounded-[10px] flex items-center justify-center gap-2 transition-all">
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin text-indigo-300" />
                <span className="text-indigo-200 font-medium">Running Agent Graph (Orchestrator → Research → Product → Architecture)...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-indigo-300 group-hover:scale-110 transition-transform" />
                <span className="text-base">Generate Complete Blueprint</span>
              </>
            )}
          </div>
        </button>
      </form>
    </div>
  );
};
