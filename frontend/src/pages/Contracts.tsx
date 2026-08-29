import { AnimatePresence, motion } from "framer-motion"
import { useState } from "react"
import {
  ClayButton,
  ClayCard,
  ClayProgressRing,
  ContentCard,
  GlassOverlay,
  StatusBadge,
} from "../components/clay"
import Section from "../components/layout/Section"
import { CLAUSES } from "../lib/api"
import { ACTION_ICONS, DownloadSquare01Icon } from "../lib/icons"

const TABS = ["Terms", "Rights", "Payment", "Exit"] as const
type Tab = typeof TABS[number]

const CONTRACT_TEXT: Record<Tab, string> = {
  Terms:
    'This Agreement is entered into between BrandX Inc. ("Brand") and the Creator. The Creator agrees to produce and publish the Deliverables described in Schedule A within the Campaign Period of 30 days. All content must align with Brand guidelines and be submitted for approval 72 hours prior to publication.',
  Rights:
    "The Creator grants the Brand a perpetual, worldwide, royalty-free license to use, reproduce, and repurpose all content produced under this Agreement across any medium, including paid advertising, without additional compensation.",
  Payment:
    "Total compensation is $8,500 USD, payable Net-90 following campaign completion. 50% of the fee shall be withheld until all Deliverables are approved and published. Late deliverables incur a 10% penalty per business day.",
  Exit: "Either party may terminate this Agreement with 14 days written notice. Upon termination, the Creator forfeits any unpaid compensation for incomplete Deliverables. The exclusivity and licensing terms survive termination.",
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
  const [uploadPct, setUploadPct] = useState(0)

  const runUpload = () => {
    setDragging(false)
    setUploading(true)
    setUploadPct(0)
    const t = setInterval(() => {
      setUploadPct((p) => {
        if (p >= 100) {
          clearInterval(t)
          setTimeout(() => setUploading(false), 600)
          return 100
        }
        return p + 8
      })
    }, 120)
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[55fr_45fr]">
      {/* left */}
      <div className="flex flex-col gap-5">
        <ClayCard>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3
                className="text-base font-bold text-text-primary"
                style={{ fontFamily: "var(--font-display)" }}
              >
                BrandX Partnership Agreement
              </h3>
              <p className="text-xs text-text-tertiary">
                Uploaded 2 days ago · 6 pages · PDF
              </p>
            </div>
            <StatusBadge type="flagged" text="Under Review" />
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

          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <ContentCard>
                <p className="text-sm leading-relaxed text-text-secondary">
                  {CONTRACT_TEXT[tab]}
                </p>
              </ContentCard>
            </motion.div>
          </AnimatePresence>
        </ClayCard>

        {/* drop zone */}
        <motion.div
          onDragOver={(e) => {
            e.preventDefault()
            setDragging(true)
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault()
            runUpload()
          }}
          animate={dragging ? { scale: 1.01 } : { scale: 1 }}
        >
          <GlassOverlay>
            <button
              onClick={runUpload}
              className="focus-clay flex w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed py-8 text-center"
              style={{
                borderColor: dragging
                  ? "var(--primary)"
                  : "var(--primary-light)",
              }}
            >
              <motion.span
                animate={{ y: [0, 8, 0] }}
                transition={{ repeat: Infinity, duration: 1.4 }}
                className="text-primary flex items-center justify-center"
              >
                <DownloadSquare01Icon size={32} />
              </motion.span>
              <span
                className="text-sm font-bold text-text-primary"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {uploading
                  ? `Analyzing… ${uploadPct}%`
                  : "Drop contract PDF here"}
              </span>
              <span className="text-xs text-text-tertiary">
                or click to browse — PDF, DOCX up to 20MB
              </span>
              {uploading && (
                <div className="clay-inset mt-2 h-2 w-2/3 overflow-hidden rounded-full">
                  <motion.div
                    className="h-full rounded-full"
                    style={{
                      background: "linear-gradient(90deg,#a5b4fc,#6366f1)",
                    }}
                    animate={{ width: `${uploadPct}%` }}
                  />
                </div>
              )}
            </button>
          </GlassOverlay>
        </motion.div>
      </div>

      {/* right analysis */}
      <ClayCard hover={false}>
        <Section title="AI Analysis" hint="Reviewed by Contract Analyst agent">
          <div className="flex justify-center py-2">
            <ClayProgressRing
              value={68}
              label="Risk score"
              size="lg"
              variant="danger"
            />
          </div>

          <div className="flex flex-col gap-3">
            {CLAUSES.map((c) => (
              <ContentCard key={c.id}>
                <div className="mb-1.5 flex items-center justify-between gap-2">
                  <span
                    className="text-sm font-bold text-text-primary"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    §{c.number} · {c.title}
                  </span>
                  <StatusBadge
                    type={badgeType[c.status]}
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
                      Suggested counter-term
                    </p>
                    <p className="text-[13px] text-text-primary">{c.counter}</p>
                  </div>
                )}
              </ContentCard>
            ))}
          </div>

          <div
            className="clay-inset mt-4 flex items-center justify-between rounded-2xl p-4"
            style={{ background: "var(--bg-secondary)" }}
          >
            <div>
              <p className="text-xs font-semibold text-text-secondary">
                Revenue Insight
              </p>
              <p className="text-sm text-text-primary">
                Deal value <b>$8.5K</b> vs market <b>$10.5K</b>
              </p>
            </div>
            <StatusBadge type="critical" text="19% Below Market" size="sm" />
          </div>

          <div className="mt-5 flex flex-wrap gap-2.5">
            <ClayButton
              label="Generate Report"
              variant="primary"
              icon={ACTION_ICONS.file}
            />
            <ClayButton
              label="Counter-Proposal"
              variant="secondary"
              icon={ACTION_ICONS.edit}
            />
            <ClayButton
              label="Approve"
              variant="accent"
              icon={ACTION_ICONS.check}
            />
          </div>
        </Section>
      </ClayCard>
    </div>
  )
}
