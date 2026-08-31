import React from "react"
import { motion } from "framer-motion"
import { ClayCard } from "../components/clay"
import { Shield01Icon, CheckmarkSquare03Icon, SparkleIcon, Alert02Icon } from "../lib/icons"

export default function Privacy() {
  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto py-4">
      {/* Hero */}
      <div className="pt-2 pb-3 border-b border-[var(--border)]/60">
        <h1
          className="text-2xl sm:text-[30px] font-bold text-text-primary tracking-tight"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Privacy & Data Protection
        </h1>
        <p className="mt-1.5 text-sm sm:text-[15px] text-text-secondary leading-relaxed max-w-2xl">
          Enterprise-grade zero-trust data protection for creators. Your channel data, contracts, and creative IP remain 100% confidential.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <ClayCard>
          <div className="flex flex-col gap-3 p-2">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Shield01Icon size={20} />
            </div>
            <h3 className="font-bold text-base text-text-primary font-[var(--font-display)]">
              Zero-Data Training Guarantee
            </h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Crewmate processes all video transcripts, uploaded PDF agreements, and Channel DNA directives via dedicated Google Vertex AI enterprise instances. Your confidential information is <strong>never used</strong> to train foundational Gemini or public LLM models.
            </p>
          </div>
        </ClayCard>

        <ClayCard>
          <div className="flex flex-col gap-3 p-2">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-primary flex items-center justify-center font-bold">
              <SparkleIcon size={20} />
            </div>
            <h3 className="font-bold text-base text-text-primary font-[var(--font-display)]">
              Model Armor & PII Scrubbing
            </h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Sensitive financial terms, sponsor payout structures, bank routing details, and personal contact info are sanitized through our pre-execution Model Armor guardrails before being parsed by autonomous specialist agents.
            </p>
          </div>
        </ClayCard>

        <ClayCard>
          <div className="flex flex-col gap-3 p-2">
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <CheckmarkSquare03Icon size={20} />
            </div>
            <h3 className="font-bold text-base text-text-primary font-[var(--font-display)]">
              Encrypted Firestore Memory Bank
            </h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Creator preferences, past sponsor precedents, and redline negotiation histories are encrypted at rest using AES-256 and in transit via TLS 1.3 within Google Cloud Firestore. Only your authenticated user profile has read access.
            </p>
          </div>
        </ClayCard>

        <ClayCard>
          <div className="flex flex-col gap-3 p-2">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Alert02Icon size={20} />
            </div>
            <h3 className="font-bold text-base text-text-primary font-[var(--font-display)]">
              1-Click Data Purge & Export
            </h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              You maintain sovereign ownership over your fleet memory. You can clear your Channel DNA, reset OpenTelemetry trace logs, or permanently delete audited contract files at any time with zero retention remnants.
            </p>
          </div>
        </ClayCard>
      </div>

      <div className="p-6 rounded-3xl bg-[var(--surface-sunken)] border border-[var(--border)] text-xs text-text-secondary leading-relaxed">
        <h4 className="font-bold text-text-primary text-sm font-[var(--font-display)] mb-2">
          Regulatory Compliance & Certifications
        </h4>
        <p>
          Crewmate complies with Google Cloud enterprise security guidelines, SOC 2 Type II data handling principles, and FTC 16 CFR Part 255 commercial disclosure transparency frameworks. Last updated: August 2026.
        </p>
      </div>
    </div>
  )
}
