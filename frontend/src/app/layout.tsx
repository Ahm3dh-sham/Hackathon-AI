import type { Metadata } from "next";
import "./globals.css";
import { Github } from "lucide-react";
import Announcement3 from "@/components/ui/announcement-3";
import { VantaBackground } from "@/components/VantaBackground";

export const metadata: Metadata = {
  title: "HackForge AI — Turn the prompt into a plan",
  description:
    "Turn a hackathon problem statement into a complete, team-ready project blueprint with HackForge AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        id="top"
        className="bg-[#0a0d13] text-[#f0f2e9] antialiased flex flex-col min-h-screen relative overflow-x-hidden selection:bg-[#d5fa70] selection:text-[#0a0d13]"
      >
        {/* Interactive Vanta 3D WebGL Background (Starred Repo: tengbao/vanta) */}
        <VantaBackground />

        {/* Watermelon UI Top Announcement Banner (Starred Repo: WatermelonCorp/watermelon-platform) */}
        <div className="relative z-50">
          <Announcement3 />
        </div>

        {/* Reference Site Navigation Header */}
        <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0a0d13]/85 backdrop-blur-xl px-6">
          <nav
            className="max-w-7xl mx-auto min-h-[74px] flex items-center justify-between gap-4"
            aria-label="Main navigation"
          >
            <a
              href="#top"
              className="inline-flex items-center gap-3 group"
              aria-label="HackForge AI home"
            >
              <span className="grid w-9 h-9 place-items-center text-[#d5fa70] transition-transform duration-300 group-hover:scale-105">
                <svg viewBox="0 0 36 36" fill="none" className="w-full h-full">
                  <path
                    d="M18 2.8 32.7 11v14L18 33.2 3.3 25V11L18 2.8Z"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  />
                  <path
                    d="m18 9 8 4.5v9L18 27l-8-4.5v-9L18 9Z"
                    fill="currentColor"
                  />
                  <path
                    d="m18 13.2 4.5 2.5v5L18 23.2l-4.5-2.5v-5l4.5-2.5Z"
                    fill="#0a0d13"
                  />
                  <path
                    d="M18 3v6M33 11l-7 3.5M33 25l-7-3.5M18 33v-6M3 25l7-3.5M3 11l7 3.5"
                    stroke="currentColor"
                    strokeWidth="1.2"
                  />
                </svg>
              </span>
              <span className="font-display-grotesk text-sm font-bold tracking-[0.12em] text-white">
                HACKFORGE<span className="ml-1 text-[#d5fa70] text-xs">AI</span>
              </span>
            </a>

            <div className="hidden md:flex items-center gap-8 text-xs font-semibold text-gray-300">
              <a
                href="#workflow"
                className="hover:text-[#d5fa70] transition-colors"
              >
                How it works
              </a>
              <a
                href="#agents"
                className="hover:text-[#d5fa70] transition-colors"
              >
                Agent team
              </a>
              <a
                href="#blueprint"
                className="hover:text-[#d5fa70] transition-colors"
              >
                The blueprint
              </a>
              <a
                href="#forge-studio"
                className="hover:text-[#d5fa70] transition-colors"
              >
                Live AI Studio
              </a>
            </div>

            <div className="flex items-center gap-3">
              <a
                href="#forge-studio"
                className="inline-flex items-center gap-2.5 px-4 py-2.5 bg-[#d5fa70] hover:bg-[#e2ff96] text-[#0a0d13] text-xs font-extrabold tracking-wide transition-all hover:-translate-y-0.5 shadow-lg shadow-[#d5fa70]/15"
              >
                <span>Explore the preview</span>
                <span aria-hidden="true" className="text-sm leading-none">
                  ↗
                </span>
              </a>
              <a
                href="https://github.com/Ahm3dh-sham/Hackathon-AI"
                target="_blank"
                rel="noreferrer"
                className="p-2.5 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-[#d5fa70] transition-colors border border-white/10"
                title="View GitHub Repository"
              >
                <Github className="w-4 h-4" />
              </a>
            </div>
          </nav>
        </header>

        {/* Main Content Area */}
        <main className="relative z-10 flex-1 w-full">{children}</main>

        {/* Reference Site Footer */}
        <footer className="relative z-10 border-t border-white/10 bg-[#080b10]/95 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-6 py-7 flex flex-col sm:flex-row items-center justify-between gap-6">
            <a
              href="#top"
              className="inline-flex items-center gap-2.5"
              aria-label="HackForge AI, back to top"
            >
              <span className="grid w-7 h-7 place-items-center text-[#d5fa70]">
                <svg viewBox="0 0 36 36" fill="none" className="w-full h-full">
                  <path
                    d="M18 2.8 32.7 11v14L18 33.2 3.3 25V11L18 2.8Z"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  />
                  <path
                    d="m18 9 8 4.5v9L18 27l-8-4.5v-9L18 9Z"
                    fill="currentColor"
                  />
                  <path
                    d="m18 13.2 4.5 2.5v5L18 23.2l-4.5-2.5v-5l4.5-2.5Z"
                    fill="#080b10"
                  />
                </svg>
              </span>
              <span className="font-display-grotesk text-xs font-bold tracking-[0.12em] text-white">
                HACKFORGE<span className="ml-1 text-[#d5fa70]">AI</span>
              </span>
            </a>

            <p className="text-xs text-gray-300 text-center">
              Turn the prompt into a plan.{" "}
              <span className="text-gray-500">Built for the build weekend.</span>
            </p>

            <a
              href="#top"
              className="font-dm-mono text-[10px] tracking-[0.14em] text-gray-400 hover:text-[#d5fa70] flex items-center gap-2 transition-colors"
            >
              BACK TO TOP <span className="text-[#d5fa70] text-sm">↑</span>
            </a>
          </div>

          <div className="border-t border-white/5 px-6 py-3.5">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 font-dm-mono text-[10px] tracking-[0.13em] text-gray-500">
              <span>© {new Date().getFullYear()} HackForge AI · Powered by LangGraph, GSAP, React Bits, Vanta 3D & Watermelon UI</span>
              <span>
                ONE BRIEF <i className="text-[#d5fa70] not-italic px-1">·</i> MANY LENSES{" "}
                <i className="text-[#d5fa70] not-italic px-1">·</i> ONE BUILD PLAN
              </span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
