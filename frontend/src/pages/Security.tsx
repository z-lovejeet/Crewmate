import React from "react"
import { ClayCard } from "../components/clay"
import { Shield01Icon, CompassIcon, SparkleIcon, ZapIcon } from "../lib/icons"

export default function Security() {
  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto py-4">
      {/* Hero */}
      <div className="pt-2 pb-3 border-b border-[var(--border)]/60">
        <h1
          className="text-2xl sm:text-[30px] font-bold text-text-primary tracking-tight"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Security & GEAP Architecture
        </h1>
        <p className="mt-1.5 text-sm sm:text-[15px] text-text-secondary leading-relaxed max-w-2xl">
          Fortified Enterprise Fleet implementation adhering to Google's Gemini Enterprise Agent Platform (GEAP) standards.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <ClayCard>
          <div className="flex flex-col gap-3 p-2">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-primary flex items-center justify-center font-bold">
              <Shield01Icon size={20} />
            </div>
            <h3 className="font-bold text-base text-text-primary font-[var(--font-display)]">
              Model Armor & Input Sanitization
            </h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Every prompt dispatched through the Captain Orchestrator undergoes rigorous sanitization to prevent prompt injection, jailbreak attempts, and accidental leakage of confidential financial data.
            </p>
          </div>
        </ClayCard>

        <ClayCard>
          <div className="flex flex-col gap-3 p-2">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <CompassIcon size={20} />
            </div>
            <h3 className="font-bold text-base text-text-primary font-[var(--font-display)]">
              Zero-Trust Agent Identity & RBAC
            </h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              All 14 autonomous agents execute under least-privilege role-based access control. The Contract Reviewer cannot modify video distribution parameters, and Community Guardian cannot alter deal pricing floors.
            </p>
          </div>
        </ClayCard>

        <ClayCard>
          <div className="flex flex-col gap-3 p-2">
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <ZapIcon size={20} />
            </div>
            <h3 className="font-bold text-base text-text-primary font-[var(--font-display)]">
              OpenTelemetry Reason Traces
            </h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Every agent execution generates structured OpenTelemetry spans logged immutably to Google Cloud Firestore with precise millisecond latencies, tool call signatures, and model audit records.
            </p>
          </div>
        </ClayCard>

        <ClayCard>
          <div className="flex flex-col gap-3 p-2">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <SparkleIcon size={20} />
            </div>
            <h3 className="font-bold text-base text-text-primary font-[var(--font-display)]">
              Google Cloud Run Hardening
            </h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Containerized serverless backend secured with TLS 1.3, strict CORS origins, non-root container execution, and Secret Manager environment isolation on Google Cloud Platform.
            </p>
          </div>
        </ClayCard>
      </div>

      <div className="p-6 rounded-3xl bg-[var(--surface-sunken)] border border-[var(--border)] text-xs text-text-secondary leading-relaxed">
        <h4 className="font-bold text-text-primary text-sm font-[var(--font-display)] mb-2">
          7-Layer GEAP Verification
        </h4>
        <p>
          1. Agent Registry · 2. Agent Runtime · 3. Memory Bank · 4. Agent Identity · 5. Agent Gateway · 6. Model Armor · 7. Agent Observability. Tested and verified on Google Cloud Run.
        </p>
      </div>
    </div>
  )
}
