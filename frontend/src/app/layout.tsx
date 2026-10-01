import type { Metadata } from "next";
import "./globals.css";
import { Cpu, Zap, Github } from "lucide-react";

export const metadata: Metadata = {
  title: "HackForge AI — Autonomous Multi-Agent Hackathon Blueprint Platform",
  description: "Transform raw hackathon problem statements into complete product specifications and technical architectures powered by LangGraph multi-agent AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#090d16] text-gray-100 antialiased flex flex-col min-h-screen">
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
                  MVP v1.0
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
                <Zap className="w-3.5 h-3.5" />
                <span>LangGraph Multi-Agent Engine Active</span>
              </div>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-gray-800/80 hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
                title="View GitHub Repository"
              >
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>

        {/* Footer */}
        <footer className="border-t border-gray-800/60 py-6 px-6 text-center text-sm text-gray-500">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <p>© {new Date().getFullYear()} HackForge AI Platform. Built with LangGraph, FastAPI & Next.js.</p>
            <div className="flex items-center gap-4 text-xs">
              <span className="text-gray-400">FastAPI Backend</span>
              <span>•</span>
              <span className="text-gray-400">Pydantic & SQLAlchemy</span>
              <span>•</span>
              <span className="text-gray-400">PostgreSQL Vector</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
