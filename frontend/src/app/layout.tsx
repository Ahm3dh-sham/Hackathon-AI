import type { Metadata } from "next";
import "./globals.css";
import { Cpu, Zap, Github } from "lucide-react";
import Announcement3 from "@/components/ui/announcement-3";
import { VantaBackground } from "@/components/VantaBackground";

export const metadata: Metadata = {
  title: "HackForge AI — Autonomous Multi-Agent Hackathon Blueprint Platform",
  description:
    "Transform raw hackathon problem statements into complete product specifications, technical architectures, and AI builder prompts powered by LangGraph.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#090d16] text-gray-100 antialiased flex flex-col min-h-screen relative overflow-x-hidden">
        {/* Interactive Vanta 3D WebGL Background */}
        <VantaBackground />

        {/* Watermelon UI Top Announcement Banner */}
        <div className="relative z-50">
          <Announcement3 />
        </div>

        {/* Navigation Header */}
        <header className="sticky top-0 z-50 glass-panel border-b border-gray-800/80 px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white shadow-lg shadow-indigo-500/20">
                <Cpu className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <span className="font-extrabold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-indigo-400">
                  HackForge AI
                </span>
                <span className="ml-2 px-2 py-0.5 text-xs font-semibold rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  MVP v2.0
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
                <Zap className="w-3.5 h-3.5" />
                <span>LangGraph Multi-Agent Engine Active</span>
              </div>
              <a
                href="https://github.com/Ahm3dh-sham/Hackathon-AI"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-gray-800/80 hover:bg-gray-700 text-gray-400 hover:text-white transition-colors border border-gray-700/60"
                title="View GitHub Repository"
              >
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>

        {/* Footer */}
        <footer className="relative z-10 border-t border-gray-800/60 bg-[#090d16]/80 backdrop-blur-md py-6 px-6 text-center text-sm text-gray-500">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <p>
              © {new Date().getFullYear()} HackForge AI Platform. Built with LangGraph, FastAPI & Next.js.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 text-xs">
              <span className="text-indigo-400/90 font-mono">GSAP</span>
              <span>•</span>
              <span className="text-indigo-400/90 font-mono">React Bits</span>
              <span>•</span>
              <span className="text-indigo-400/90 font-mono">Vanta 3D</span>
              <span>•</span>
              <span className="text-indigo-400/90 font-mono">Watermelon UI</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
