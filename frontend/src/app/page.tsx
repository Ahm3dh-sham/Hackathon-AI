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
  Zap,
  Globe,
  Layers,
  Server,
  Terminal,
  FileDown,
  ShieldCheck,
  Sparkles,
  LogOut,
  UserCheck,
} from "lucide-react";

const BENTO_FEATURES = [
  {
    step: "01",
    title: "Market & Competitor Intelligence",
    description:
      "Autonomous Research Agent identifies target user personas, high-severity pain points, and competitive gaps with actionable differentiation strategies.",
    icon: Globe,
    accent: "from-sky-500/20 to-indigo-500/10 text-sky-400 border-sky-500/30",
    spotlight: "rgba(56, 189, 248, 0.2)",
  },
  {
    step: "02",
    title: "Prioritized MVP Product Spec",
    description:
      "Product Agent synthesizes a value proposition, P0/P1/P2 feature roadmap, end-to-end user journeys, and measurable KPI success metrics.",
    icon: Layers,
    accent: "from-purple-500/20 to-indigo-500/10 text-purple-400 border-purple-500/30",
    spotlight: "rgba(168, 85, 247, 0.2)",
  },
  {
    step: "03",
    title: "System Architecture & Schema",
    description:
      "Architecture Agent blueprints your frontend, backend, database entities, REST API contracts, and production deployment topology.",
    icon: Server,
    accent: "from-emerald-500/20 to-teal-500/10 text-emerald-400 border-emerald-500/30",
    spotlight: "rgba(16, 185, 129, 0.2)",
  },
  {
    step: "04",
    title: "One-Click AI Builder Prompt & PDF",
    description:
      "Generates a copy-paste master prompt engineered for AI coding assistants plus a formatted executive PDF blueprint for hackathon judges.",
    icon: Terminal,
    accent: "from-amber-500/20 to-orange-500/10 text-amber-400 border-amber-500/30",
    spotlight: "rgba(245, 158, 11, 0.2)",
  },
];

export default function Home() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [blueprintData, setBlueprintData] = useState<ProjectStateBlueprint | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const heroRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const bentoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Clear legacy unverified key
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

  // GSAP Entrance Animations when authenticated dashboard mounts
  useEffect(() => {
    if (!userEmail) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      if (heroRef.current) {
        tl.fromTo(
          heroRef.current.children,
          { y: 28, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.75, stagger: 0.12 }
        );
      }
      if (statsRef.current) {
        tl.fromTo(
          statsRef.current.children,
          { y: 20, opacity: 0, scale: 0.96 },
          { y: 0, opacity: 1, scale: 1, duration: 0.55, stagger: 0.08 },
          "-=0.4"
        );
      }
      if (formRef.current) {
        tl.fromTo(
          formRef.current,
          { y: 24, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.65 },
          "-=0.35"
        );
      }
      if (bentoRef.current) {
        tl.fromTo(
          bentoRef.current.children,
          { y: 28, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, stagger: 0.1 },
          "-=0.3"
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

  const handleGenerate = async (problemStatement: string) => {
    setIsLoading(true);
    setError(null);

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
      <div className="relative z-10 max-w-5xl mx-auto py-2">
        <LoginPage
          brandName="HackForge AI"
          onLogin={(email) => handleLogin(email)}
        />
      </div>
    );
  }

  return (
    <div className="relative z-10 space-y-10 pb-16">
      {/* Signed-in Session Bar */}
      <div className="max-w-4xl mx-auto flex items-center justify-between px-4 py-2 rounded-xl bg-gray-900/70 border border-gray-800/80 text-xs">
        <div className="flex items-center gap-2 text-gray-300">
          <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>
            Signed in as <strong className="text-white font-mono">{userEmail}</strong>
          </span>
        </div>
        <button
          onClick={handleSignOut}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-colors"
        >
          <LogOut className="w-3 h-3" />
          Sign Out
        </button>
      </div>

      {/* Hero Section */}
      <div ref={heroRef} className="text-center max-w-3xl mx-auto space-y-5 pt-2">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold shadow-lg shadow-indigo-500/10">
          <Zap className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
          <DecryptedText
            text="LangGraph Stateful Multi-Agent Engine"
            speed={24}
            className="font-mono tracking-tight"
          />
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.1]">
          HackForge AI <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-violet-300 to-purple-400">
            Autonomous Project Blueprinting
          </span>
        </h1>
      </div>

      {/* Animated Metrics Ribbon (React Bits + GSAP CountUp) */}
      {!blueprintData && (
        <div
          ref={statsRef}
          className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-3"
        >
          <div className="glass-panel rounded-xl px-4 py-3 border border-gray-800/80 text-center">
            <div className="text-2xl font-extrabold text-white font-mono">
              <CountUp end={5} />
            </div>
            <div className="text-[11px] text-gray-400 font-medium uppercase tracking-wider mt-0.5">
              Autonomous Agents
            </div>
          </div>
          <div className="glass-panel rounded-xl px-4 py-3 border border-gray-800/80 text-center">
            <div className="text-2xl font-extrabold text-indigo-400 font-mono">
              <CountUp end={4} />
            </div>
            <div className="text-[11px] text-gray-400 font-medium uppercase tracking-wider mt-0.5">
              Blueprint Modules
            </div>
          </div>
          <div className="glass-panel rounded-xl px-4 py-3 border border-gray-800/80 text-center">
            <div className="text-2xl font-extrabold text-purple-400 font-mono">
              <CountUp end={100} suffix="%" />
            </div>
            <div className="text-[11px] text-gray-400 font-medium uppercase tracking-wider mt-0.5">
              Schema Validated
            </div>
          </div>
          <div className="glass-panel rounded-xl px-4 py-3 border border-gray-800/80 text-center">
            <div className="text-2xl font-extrabold text-emerald-400 font-mono">
              <CountUp end={1} prefix="< " suffix="m" />
            </div>
            <div className="text-[11px] text-gray-400 font-medium uppercase tracking-wider mt-0.5">
              Idea to Master Prompt
            </div>
          </div>
        </div>
      )}

      {/* Main Container */}
      <div ref={formRef} className="max-w-4xl mx-auto">
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

      {/* Watermelon UI + React Bits Spotlight Bento Grid on Landing Page */}
      {!blueprintData && (
        <section className="max-w-5xl mx-auto pt-4 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 px-1">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-indigo-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> End-to-End Architecture Engine
              </span>
              <h2 className="text-2xl font-bold text-white mt-1">
                Everything You Need to Win the Hackathon
              </h2>
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-400">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gray-900/80 border border-gray-800">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Pydantic Typed
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gray-900/80 border border-gray-800">
                <FileDown className="w-3.5 h-3.5 text-indigo-400" /> PDF & Prompt Export
              </span>
            </div>
          </div>

          <div ref={bentoRef} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {BENTO_FEATURES.map((item) => {
              const Icon = item.icon;
              return (
                <SpotlightCard
                  key={item.step}
                  className="p-6 group"
                  spotlightColor={item.spotlight}
                >
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div
                      className={`p-3 rounded-xl bg-gradient-to-br border ${item.accent}`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="font-mono text-xs font-bold text-gray-500 group-hover:text-indigo-400 transition-colors">
                      NODE // {item.step}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-indigo-200 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    {item.description}
                  </p>
                </SpotlightCard>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
