import React from "react"
import { Link } from "react-router-dom"
import { Shield01Icon, CompassIcon, SparkleIcon } from "../../lib/icons"

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[var(--surface-sunken)] border-t border-[var(--border)] px-4 sm:px-8 py-12 mt-auto flex-shrink-0">
      <div className="max-w-7xl mx-auto flex flex-col gap-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Column 1 & 2: Brand & Mission */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-50 to-primary/10 border border-primary/20 flex items-center justify-center p-1 shadow-2xs">
                <img
                  src="/logo-icon.png"
                  alt="Crewmate Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <span
                className="font-extrabold text-[var(--text-primary)] text-xl tracking-tight leading-none"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Crew<span className="text-[var(--primary)]">mate</span>
              </span>
            </div>

            <p className="text-xs sm:text-[13px] text-text-secondary leading-relaxed max-w-sm">
              Autonomous AI agent fleet for content creators. Powered by Google ADK, Vertex AI Gemini 3.7 Flash, and the 7-Layer GEAP Enterprise Architecture.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/60 text-emerald-700 text-[11px] font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>15 Agents Operational</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--surface)] border border-[var(--border)] text-text-secondary text-[11px] font-semibold shadow-2xs">
                <Shield01Icon size={12} className="text-primary" />
                <span>Model Armor Protected</span>
              </span>
            </div>
          </div>

          {/* Column 3: Studio Workspaces */}
          <div className="flex flex-col gap-3">
            <h4
              className="text-xs font-bold text-text-primary uppercase tracking-wider"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Studio Workspaces
            </h4>
            <nav className="flex flex-col gap-2 text-xs">
              <Link to="/dashboard" className="text-text-secondary hover:text-primary transition-colors no-underline">
                Command Center
              </Link>
              <Link to="/channel" className="text-text-secondary hover:text-primary transition-colors no-underline">
                Channel DNA
              </Link>
              <Link to="/trends" className="text-text-secondary hover:text-primary transition-colors no-underline">
                Trends & Strategy
              </Link>
              <Link to="/scripts" className="text-text-secondary hover:text-primary transition-colors no-underline">
                Script Architect
              </Link>
              <Link to="/media" className="text-text-secondary hover:text-primary transition-colors no-underline">
                Media Studio
              </Link>
              <Link to="/contracts" className="text-text-secondary hover:text-primary transition-colors no-underline">
                Contract Auditor
              </Link>
              <Link to="/compliance" className="text-text-secondary hover:text-primary transition-colors no-underline">
                Compliance Shield
              </Link>
              <Link to="/fleet" className="text-text-secondary hover:text-primary transition-colors no-underline">
                Fleet Command
              </Link>
            </nav>
          </div>

          {/* Column 4: GEAP Architecture */}
          <div className="flex flex-col gap-3">
            <h4
              className="text-xs font-bold text-text-primary uppercase tracking-wider"
              style={{ fontFamily: "var(--font-display)" }}
            >
              GEAP Architecture
            </h4>
            <ul className="flex flex-col gap-2 text-xs text-text-secondary">
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                <span>Agent Registry & RBAC</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                <span>Firestore Memory Bank</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                <span>OpenTelemetry Traces</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                <span>Model Armor Guardrails</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                <span>Google Cloud Run</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                <span>FastAPI Gateway</span>
              </li>
            </ul>
          </div>

          {/* Column 5: Trust & Legal */}
          <div className="flex flex-col gap-3">
            <h4
              className="text-xs font-bold text-text-primary uppercase tracking-wider"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Trust & Legal
            </h4>
            <nav className="flex flex-col gap-2 text-xs">
              <Link to="/privacy" className="text-text-secondary hover:text-primary transition-colors no-underline font-medium">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-text-secondary hover:text-primary transition-colors no-underline font-medium">
                Terms of Service
              </Link>
              <Link to="/security" className="text-text-secondary hover:text-primary transition-colors no-underline font-medium">
                Security & GEAP
              </Link>
              <Link to="/about" className="text-text-secondary hover:text-primary transition-colors no-underline font-medium">
                About & System Specs
              </Link>
              <a
                href="https://github.com/z-lovejeet/Crewmate"
                target="_blank"
                rel="noreferrer"
                className="text-text-secondary hover:text-primary transition-colors no-underline flex items-center gap-1"
              >
                <span>GitHub Repository</span>
                <span>↗</span>
              </a>
            </nav>
          </div>
        </div>

        {/* Bottom Credits & Built With */}
        <div className="pt-6 border-t border-[var(--border)]/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-tertiary">
          <div className="flex flex-wrap items-center gap-2">
            <span>Built for <strong>All Things Agentic Hackathon 2026</strong></span>
            <span>·</span>
            <span>Google ADK · Gemini 3.7 · Vertex AI</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <Link to="/privacy" className="hover:text-text-primary transition-colors no-underline">
              Privacy
            </Link>
            <Link to="/terms" className="hover:text-text-primary transition-colors no-underline">
              Terms
            </Link>
            <Link to="/security" className="hover:text-text-primary transition-colors no-underline">
              Security
            </Link>
            <span>© 2026 Crewmate</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
