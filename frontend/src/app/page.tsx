"use client";

import React, { useState } from "react";
import { InputForm } from "@/components/InputForm";
import { BlueprintDisplay, ProjectStateBlueprint } from "@/components/BlueprintDisplay";
import { Sparkles, ArrowLeft, Zap } from "lucide-react";

export default function Home() {
  const [blueprintData, setBlueprintData] = useState<ProjectStateBlueprint | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (problemStatement: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Send POST request directly to backend at http://localhost:8000/api/generate (with local proxy fallback)
      let response: Response | null = null;
      try {
        response = await fetch("http://localhost:8000/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ problem_statement: problemStatement }),
        });
      } catch (directErr) {
        // Fallback to Next.js API route proxy if direct CORS fetch fails
        response = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ problem_statement: problemStatement }),
        });
      }

      if (!response || !response.ok) {
        throw new Error("Backend generation failed. Please verify FastAPI server is running on http://localhost:8000.");
      }

      const data: ProjectStateBlueprint = await response.json();
      setBlueprintData(data);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred while running the agent graph.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto space-y-4 pt-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
          <Zap className="w-3.5 h-3.5 text-indigo-400" />
          LangGraph Stateful Multi-Agent Engine
        </div>

        <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-tight">
          HackForge AI <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-violet-300 to-purple-400">
            Autonomous Project Blueprinting
          </span>
        </h1>

        <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
          Input your hackathon problem statement to trigger Orchestrator $\rightarrow$ Research $\rightarrow$ Product $\rightarrow$ Architecture agents.
        </p>
      </div>

      {/* Main Container */}
      <div className="max-w-4xl mx-auto">
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm flex items-center justify-between">
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
              className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Forge Another Blueprint
            </button>
            <BlueprintDisplay data={blueprintData} onReset={() => setBlueprintData(null)} />
          </div>
        ) : (
          <InputForm onSubmit={handleGenerate} isLoading={isLoading} />
        )}
      </div>
    </div>
  );
}
