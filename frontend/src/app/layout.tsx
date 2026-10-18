import type { Metadata } from "next";
import "./globals.css";
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
    <html lang="en">
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>

        {/* Interactive Vanta 3D Background in Aged Brass & Heritage Green */}
        <VantaBackground />

        {/* Top Watermelon UI Announcement Banner */}
        <div className="relative z-50">
          <Announcement3 />
        </div>

        {/* Exact Reference Site Header */}
        <header className="site-header">
          <nav className="nav-shell" aria-label="Main navigation">
            <a className="brand" href="#top" aria-label="HackForge AI home">
              <span className="brand-mark" aria-hidden="true">
                <svg viewBox="0 0 36 36" fill="none">
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
                    fill="#f7f4ed"
                  />
                  <path
                    d="M18 3v6M33 11l-7 3.5M33 25l-7-3.5M18 33v-6M3 25l7-3.5M3 11l7 3.5"
                    stroke="currentColor"
                    strokeWidth="1.2"
                  />
                </svg>
              </span>
              <span className="brand-word">
                HACKFORGE<span className="brand-ai">AI</span>
              </span>
            </a>

            <div className="nav-links" id="primary-links">
              <a href="#workflow">How it works</a>
              <a href="#agents">Agent team</a>
              <a href="#blueprint">The blueprint</a>
              <a href="#talkscript">TalkScript</a>
              <a className="nav-cta" href="#product">
                Open Blueprint Studio <span aria-hidden="true">↗</span>
              </a>
            </div>
          </nav>
        </header>

        <main id="main" className="relative z-10">
          {children}
        </main>

        {/* Exact Reference Site Footer */}
        <footer className="site-footer relative z-10">
          <div className="footer-shell section-wrap">
            <a
              className="brand footer-brand"
              href="#top"
              aria-label="HackForge AI, back to top"
            >
              <span className="brand-mark" aria-hidden="true">
                <svg viewBox="0 0 36 36" fill="none">
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
                    fill="#f7f4ed"
                  />
                </svg>
              </span>
              <span className="brand-word">
                HACKFORGE<span className="brand-ai">AI</span>
              </span>
            </a>
            <p>
              Turn the prompt into a plan. <span>Built for the build weekend.</span>
            </p>
            <a className="back-to-top" href="#top">
              BACK TO TOP <span aria-hidden="true">↑</span>
            </a>
          </div>
          <div className="footer-bottom section-wrap">
            <span>© 2026 HackForge AI concept</span>
            <span>
              ONE BRIEF <i>·</i> MANY LENSES <i>·</i> ONE BUILD PLAN
            </span>
          </div>
        </footer>
      </body>
    </html>
  );
}
