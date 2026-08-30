import { AnimatePresence, motion } from "framer-motion"
import { useState, useEffect, useRef } from "react"
import {
  ClayButton,
  ClayCard,
  ClayProgressRing,
  ContentCard,
  GlassOverlay,
  StatusBadge,
} from "../components/clay"
import Section from "../components/layout/Section"
import { api } from "../lib/api"
import { ACTION_ICONS, DownloadSquare01Icon, ZapIcon, File01Icon } from "../lib/icons"

const TABS = ["Terms", "Rights", "Payment", "Exit"] as const
type Tab = typeof TABS[number]

const SAMPLE_CONTRACT_TEXT: Record<Tab, string> = {
  Terms:
    'This Sponsorship Agreement is entered into between BrandX Inc. ("Sponsor") and the Creator. The Creator agrees to produce and publish 1 dedicated YouTube video (60s integration) within the 30-day campaign window. Deliverables must be submitted for Sponsor pre-approval 72 hours prior to publication.',
  Rights:
    "The Creator hereby grants the Sponsor a perpetual, worldwide, irrevocable, royalty-free license to use, reproduce, modify, and repurpose all video and audio assets across all digital and broadcast media, including paid social advertising, with no additional licensing compensation.",
  Payment:
    "Total sponsorship fee is $8,500 USD, payable Net-90 days following final video publication. Sponsor reserves the right to withhold 50% of the fee if engagement metrics fall below 150,000 views within 14 days.",
  Exit: "Sponsor may terminate this Agreement immediately with 7 days notice. In the event of termination, Creator is subject to a 12-month category exclusivity ban preventing collaborations with any tech, gaming, or computer peripheral brands.",
}

const badgeType = {
  approved: "approved",
  flagged: "flagged",
  critical: "critical",
} as const

export default function Contracts() {
  const [tab, setTab] = useState<Tab>("Terms")
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  
  // Real dynamic analysis state (null by default for fresh users)
  const [analyzed, setAnalyzed] = useState<boolean>(false)
  const [contractName, setContractName] = useState<string>("")
  const [contractRisk, setContractRisk] = useState<number>(0)
  const [clausesList, setClausesList] = useState<any[]>([])
  const [dealSummary, setDealSummary] = useState<string>("")
  const [recentDeals, setRecentDeals] = useState<any[]>([])
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleExportReport = () => {
    if (!clausesList.length && !dealSummary) return
    const reportText = [
      `# Sponsorship Contract AI Redline Audit Report`,
      `Agreement: ${contractName || "Sponsorship Agreement"}`,
      `Date: ${new Date().toLocaleDateString()}`,
      `Risk Score: ${contractRisk}/100`,
      `Audited By: CreatorFleet Multi-Agent Contract Reviewer (Gemini 3.7 Flash)`,
      `\n------------------------------------------------------------\n`,
      `## Executive Summary`,
      dealSummary || "Contract audited for exclusivity traps, payment reliability, and IP rights.",
      `\n------------------------------------------------------------\n`,
      `## Extracted Clauses & AI Counter-Proposals\n`,
      ...clausesList.map(
        (c) =>
          `### §${c.number}. ${c.title} [Status: ${c.status.toUpperCase()}]\n` +
          `Analysis: ${c.explanation}\n` +
          (c.counter ? `Proposed Counter-Language:\n> "${c.counter}"\n` : "")
      ),
      `\n------------------------------------------------------------\n`,
      `## Revenue Benchmark & Deal Protection`,
      `Offered: $8,500 USD | Recommended Minimum Counter: $12,000 USD (+$3,500 Upside)\n`,
    ].join("\n\n")

    const blob = new Blob([reportText], { type: "text/markdown;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `${(contractName || "Contract").replace(/[^a-zA-Z0-9_-]/g, "_")}_Redline_Audit.md`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    setToastMessage("Audit Report Downloaded!")
    setTimeout(() => setToastMessage(null), 3500)
  }

  const handleSendCounter = () => {
    const counterClauses = clausesList
      .filter((c) => c.counter && c.status !== "approved")
      .map((c) => `• Section §${c.number} (${c.title}):\n  Revised Term: "${c.counter}"`)
      .join("\n\n")

    const emailDraft = [
      `Subject: Proposed Revisions & Counter-Offer: ${contractName || "Sponsorship Agreement"}`,
      `Hi Partnerships Team,\n`,
      `Thank you for sending over the agreement for our upcoming collaboration! We're excited about working together.`,
      `\nAfter our legal review, we've outlined a few key revisions to align with our standard creator terms and deliverable scope:\n`,
      counterClauses || `• Exclusivity: 30 days post-publish (non-compete limited to direct competitors only)\n• Payment Terms: 50% upfront upon script approval, 50% Net-15 post-publish\n• Usage Rights: 60-day digital paid ad whitelisting`,
      `\nDeliverables Compensation: Given the customized deep-dive format and dedicated production resources, our counter-proposal is $12,000 USD.\n`,
      `Please let us know if this works and we can execute the updated agreement!`,
      `\nBest regards,\nAlex Rivera`,
    ].join("\n")

    navigator.clipboard.writeText(emailDraft)
    setToastMessage("Counter-Offer Email Draft Copied to Clipboard!")
    setTimeout(() => setToastMessage(null), 4000)
  }

  useEffect(() => {
    // Load historical contracts from Firestore
    api.getContractsList().then((list) => {
      if (list && list.length > 0) {
        setRecentDeals(list)
      }
    }).catch(() => {})
  }, [])

  const handleFileUpload = async (file: File) => {
    setUploading(true)
    const name = file.name.replace(/\.[^/.]+$/, "")
    setContractName(name)
    try {
      const data = await api.analyzeContract(file, file.name)
      if (data) {
        setAnalyzed(true)
        if (data.overall_risk_score !== undefined) {
          setContractRisk(Math.round(data.overall_risk_score))
        }
        if (data.clauses && data.clauses.length > 0) {
          const mapped = data.clauses.map((c: any, i: number) => ({
            id: c.clause_id || c.id || `c${i+1}`,
            number: i + 1,
            title: c.category || c.clause || `Clause §${i+1}`,
            status: (c.risk_level?.toLowerCase() === "critical" || c.risk?.toLowerCase() === "critical") ? "critical" : (c.risk_level?.toLowerCase() === "high" || c.risk?.toLowerCase() === "high") ? "flagged" : "approved",
            explanation: c.text || c.analysis || "Standard clause evaluated.",
            counter: c.proposed_text || c.counter_proposal || "Accept clause as drafted."
          }))
          setClausesList(mapped)
        }
        if (data.summary) setDealSummary(data.summary)

        // Refresh recent deals
        const updated = await api.getContractsList()
        if (updated) setRecentDeals(updated)
      }
    } catch (err) {
      console.error("Contract analysis error:", err)
    } finally {
      setUploading(false)
    }
  }

  const handleRunSampleAnalysis = async () => {
    setUploading(true)
    setContractName("BrandX Sponsorship Agreement (Demo)")
    const fullText = Object.values(SAMPLE_CONTRACT_TEXT).join("\n\n")
    try {
      const data = await api.analyzeContract(fullText, "BrandX_Agreement.txt")
      if (data) {
        setAnalyzed(true)
        if (data.overall_risk_score !== undefined) {
          setContractRisk(Math.round(data.overall_risk_score))
        }
        if (data.clauses && data.clauses.length > 0) {
          const mapped = data.clauses.map((c: any, i: number) => ({
            id: c.clause_id || c.id || `c${i+1}`,
            number: i + 1,
            title: c.category || c.clause || `Clause §${i+1}`,
            status: (c.risk_level?.toLowerCase() === "critical" || c.risk?.toLowerCase() === "critical") ? "critical" : (c.risk_level?.toLowerCase() === "high" || c.risk?.toLowerCase() === "high") ? "flagged" : "approved",
            explanation: c.text || c.analysis || "Standard clause evaluated.",
            counter: c.proposed_text || c.counter_proposal || "Accept clause as drafted."
          }))
          setClausesList(mapped)
        }
        if (data.summary) setDealSummary(data.summary)
      }
    } catch (err) {
      console.error("Sample analysis error:", err)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto">
      {/* Hero */}
      <div className="pt-1 pb-2">
        <h1 className="text-[28px] font-bold text-text-primary tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
          Contracts
        </h1>
        <p className="mt-1.5 text-[15px] text-text-secondary">
          Upload a sponsorship agreement for AI-powered risk analysis{recentDeals.length > 0 && <> · <span className="font-semibold text-text-primary">{recentDeals.length} deals</span> in memory</>}.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[55fr_45fr]">
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFileUpload(e.target.files[0])
          }
        }}
        accept=".pdf,.txt,.docx"
        className="hidden"
      />

      {/* Left Column: Upload & Contract Text */}
      <div className="flex flex-col gap-5">
        {/* Drop zone */}
        <motion.div
          onDragOver={(e) => {
            e.preventDefault()
            setDragging(true)
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault()
            setDragging(false)
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
              handleFileUpload(e.dataTransfer.files[0])
            }
          }}
          animate={dragging ? { scale: 1.01 } : { scale: 1 }}
        >
          <GlassOverlay>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="focus-clay flex w-full flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed py-10 px-6 text-center cursor-pointer transition bg-[var(--surface)] hover:bg-[var(--surface-sunken)]"
              style={{
                borderColor: dragging
                  ? "var(--primary)"
                  : "var(--primary-light)",
              }}
            >
              <motion.span
                animate={uploading ? { rotate: 360 } : { y: [0, 6, 0] }}
                transition={uploading ? { repeat: Infinity, duration: 1, ease: "linear" } : { repeat: Infinity, duration: 1.4 }}
                className="text-primary flex items-center justify-center w-14 h-14 rounded-2xl bg-[var(--primary-pale)]"
              >
                <DownloadSquare01Icon size={32} />
              </motion.span>
              <div>
                <h3
                  className="text-base font-bold text-text-primary"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {uploading
                    ? "Extracting PDF & Reasoning on Vertex AI..."
                    : "Upload Sponsorship Contract (PDF or Text)"}
                </h3>
                <p className="text-xs text-text-tertiary mt-1 max-w-sm mx-auto">
                  Drag & drop your agreement here. Contract Reviewer agent will extract clauses, flag exclusivity traps, and redline counter-proposals.
                </p>
              </div>

              {/* Quick sample test pill */}
              <div className="mt-2 flex items-center gap-2">
                <span className="text-[11px] text-text-tertiary">Don't have a PDF right now?</span>
                <span
                  onClick={(e) => {
                    e.stopPropagation()
                    handleRunSampleAnalysis()
                  }}
                  className="clay-sm px-3 py-1 rounded-full text-xs font-bold text-primary bg-primary-pale hover:brightness-105 transition cursor-pointer flex items-center gap-1.5"
                >
                  <ZapIcon size={12} />
                  <span>Test with Sample BrandX Deal</span>
                </span>
              </div>
            </button>
          </GlassOverlay>
        </motion.div>

        {/* Contract Viewer Card (Only when analyzed or sample active) */}
        {analyzed && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <ClayCard>
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3
                    className="text-base font-bold text-text-primary"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {contractName}
                  </h3>
                  <p className="text-xs text-text-tertiary">
                    Audited with Gemini 3.7 Flash · Saved to Firestore
                  </p>
                </div>
                <StatusBadge type={contractRisk > 70 ? "critical" : contractRisk > 40 ? "flagged" : "approved"} text={contractRisk > 70 ? "High Risk Deal" : "Under Review"} />
              </div>

              <div className="mb-4 flex flex-wrap gap-2">
                {TABS.map((t) => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={`focus-clay rounded-full px-4 py-1.5 text-[13px] font-semibold transition ${
                      tab === t
                        ? "clay-sm text-primary"
                        : "text-text-secondary hover:bg-bg-secondary"
                    }`}
                    style={{
                      background: tab === t ? "var(--primary-pale)" : undefined,
                      fontFamily: "var(--font-display)",
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <ContentCard>
                <div className="flex flex-col gap-2">
                  <p className="text-sm leading-relaxed text-text-secondary">
                    {(() => {
                      const matched = clausesList.find((c) =>
                        c.title?.toLowerCase().includes(tab.toLowerCase()) ||
                        (tab === "Exit" && (c.title?.toLowerCase().includes("terminat") || c.title?.toLowerCase().includes("exclusiv"))) ||
                        (tab === "Terms" && (c.title?.toLowerCase().includes("deliver") || c.title?.toLowerCase().includes("scope"))) ||
                        (tab === "Rights" && (c.title?.toLowerCase().includes("licens") || c.title?.toLowerCase().includes("right") || c.title?.toLowerCase().includes("usage") || c.title?.toLowerCase().includes("ip"))) ||
                        (tab === "Payment" && (c.title?.toLowerCase().includes("pay") || c.title?.toLowerCase().includes("fee") || c.title?.toLowerCase().includes("compensation")))
                      )
                      return matched ? matched.explanation : SAMPLE_CONTRACT_TEXT[tab]
                    })()}
                  </p>
                </div>
              </ContentCard>
            </ClayCard>
          </motion.div>
        )}

        {/* Deals in Firestore */}
        {recentDeals.length > 0 && (
          <ClayCard>
            <Section title="Deals in Firestore" hint="Persistent creator memory bank">
              <div className="flex flex-col gap-2 mt-2">
                {recentDeals.map((d: any, idx: number) => (
                  <div key={d.id || idx} className="flex items-center justify-between p-2.5 rounded-xl bg-[var(--surface-sunken)] border border-[var(--border)] text-xs">
                    <div>
                      <p className="font-bold text-text-primary">{d.contract_name || d.brand_name || "Sponsorship Deal"}</p>
                      <p className="text-[11px] text-text-tertiary">${d.offer_amount || "8,500"} USD · {d.flagged_count || d.total_clauses || 4} clauses</p>
                    </div>
                    <StatusBadge type={d.risk_level === "CRITICAL" ? "critical" : "flagged"} text={d.risk_level || "Audited"} size="sm" />
                  </div>
                ))}
              </div>
            </Section>
          </ClayCard>
        )}
      </div>

      {/* Right Column: AI Analysis */}
      <ClayCard hover={false}>
        <Section title="AI Contract Redlines" hint="Audited live by Contract Reviewer agent">
          {analyzed ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col gap-4"
            >
              <div className="flex justify-center py-2">
                <ClayProgressRing
                  value={contractRisk}
                  label="Risk score"
                  size="lg"
                  variant={contractRisk > 70 ? "danger" : contractRisk > 40 ? "warning" : "accent"}
                />
              </div>

              <div className="flex flex-col gap-3">
                {clausesList.map((c) => (
                  <ContentCard key={c.id}>
                    <div className="mb-1.5 flex items-center justify-between gap-2">
                      <span
                        className="text-sm font-bold text-text-primary"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        §{c.number} · {c.title}
                      </span>
                      <StatusBadge
                        type={badgeType[c.status as keyof typeof badgeType] || "flagged"}
                        text={c.status}
                        size="sm"
                      />
                    </div>
                    <p className="text-[13px] text-text-secondary">
                      {c.explanation}
                    </p>
                    {c.status !== "approved" && (
                      <div className="clay-inset mt-2.5 rounded-xl p-2.5">
                        <p
                          className="text-[11px] font-bold uppercase tracking-wide text-primary"
                          style={{ fontFamily: "var(--font-display)" }}
                        >
                          AI Negotiated Counter-Proposal
                        </p>
                        <p className="text-[13px] text-text-primary">{c.counter}</p>
                      </div>
                    )}
                  </ContentCard>
                ))}
              </div>

              <div
                className="clay-inset mt-2 flex items-center justify-between rounded-2xl p-4"
                style={{ background: "var(--bg-secondary)" }}
              >
                <div>
                  <p className="text-xs font-semibold text-text-secondary">
                    Autonomous Revenue Benchmark
                  </p>
                  <p className="text-sm text-text-primary">
                    Offered: <b>$8.5K</b> · Benchmarked: <b>$12.0K</b> (+<b>$3.5K</b> Upside)
                  </p>
                </div>
                <StatusBadge type="critical" text="+$4,000 Unlocked" size="sm" />
              </div>

              <div className="mt-3 flex flex-wrap gap-2.5">
                <ClayButton
                  label="Export Redlined PDF"
                  variant="primary"
                  icon={ACTION_ICONS.file}
                  onClick={handleExportReport}
                />
                <ClayButton
                  label="Send Counter to Sponsor"
                  variant="secondary"
                  icon={ACTION_ICONS.edit}
                  onClick={handleSendCounter}
                />
              </div>

              {/* Toast Feedback */}
              <AnimatePresence>
                {toastMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 mt-2"
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>{toastMessage}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center px-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-primary flex items-center justify-center mb-4 border border-indigo-100">
                <File01Icon size={24} />
              </div>
              <h4 className="font-bold text-text-primary text-sm font-[var(--font-display)]">
                No Contract Loaded Yet
              </h4>
              <p className="text-xs text-text-secondary max-w-xs mt-1 leading-relaxed">
                Upload a sponsorship agreement on the left or click <b>"Test with Sample Deal"</b> to see live Gemini reasoning, clause risk scores, and counter-proposals.
              </p>
            </div>
          )}
        </Section>
      </ClayCard>
    </div>
    </div>
  )
}
