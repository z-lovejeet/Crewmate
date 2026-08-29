import React from "react"
import { Link } from "react-router-dom"

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[var(--bg-secondary)] border-t border-[rgba(0,0,0,0.05)] px-6 py-8 mt-auto flex-shrink-0">
      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Column 1: Brand */}
          <div className="flex flex-col gap-2">
            <h3 className="font-[var(--font-display)] font-extrabold text-[var(--primary)] text-xl tracking-tight">
              Crewmate
            </h3>
            <p className="font-[var(--font-body)] text-[var(--text-secondary)] text-sm leading-relaxed max-w-xs">
              Enterprise AI agent fleet for content creators.
            </p>
            <p className="font-[var(--font-body)] text-[var(--text-tertiary)] text-xs mt-2">
              v1.0
            </p>
          </div>

          {/* Column 2: Tech Stack */}
          <div className="flex flex-col gap-3">
            <h4 className="font-[var(--font-display)] font-bold text-[var(--text-primary)] text-sm uppercase tracking-wider">
              Built With
            </h4>
            <div className="flex flex-wrap gap-2">
              {[
                "Google ADK",
                "Gemini 3.7 Flash",
                "Firebase",
                "Veo",
                "Lyria",
                "Gemma",
              ].map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 rounded-full clay-sm bg-[var(--surface)] text-[var(--text-secondary)] text-xs font-medium"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Column 3: Links */}
          <div className="flex flex-col gap-3">
            <h4 className="font-[var(--font-display)] font-bold text-[var(--text-primary)] text-sm uppercase tracking-wider">
              Links
            </h4>
            <nav className="flex flex-col gap-2">
              <Link
                to="/dashboard"
                className="text-sm text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors focus-clay w-fit rounded"
              >
                Dashboard
              </Link>
              <Link
                to="/about"
                className="text-sm text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors focus-clay w-fit rounded"
              >
                About
              </Link>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="text-sm text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors focus-clay w-fit rounded"
              >
                GitHub
              </a>
            </nav>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-6 border-t border-[rgba(0,0,0,0.05)] text-center md:text-left">
          <p className="font-[var(--font-body)] text-[var(--text-tertiary)] text-xs">
            Built for All Things Agentic Hackathon 2026
          </p>
        </div>
      </div>
    </footer>
  )
}
