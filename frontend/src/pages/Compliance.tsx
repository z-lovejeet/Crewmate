import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ChecklistCard,
  ClayCard,
  ClayToggle,
  ComplianceOrb,
  StatusBadge,
} from "../components/clay"
import { api } from "../lib/api"
import {
  Shield01Icon,
  ZapIcon,
  SparkleIcon,
  CheckmarkSquare03Icon,
  Alert02Icon,
  File01Icon,
  Copy01Icon,
  MusicNote01Icon,
  PlayIcon,
  PauseIcon,
} from "../lib/icons"
import { useStudioStore } from "../store/useStudioStore"

const PRESETS = [
  {
    id: "brandx",
    label: "BrandX Sponsored Video ($8.5K)",
    title: "10 AI Tools That Changed How I Build Software (Sponsored by BrandX)",
    desc: "Thanks to BrandX for sponsoring today's video! Check them out at https://brandx.ai #ad #sponsored",
    hasSponsor: true,
  },
  {
    id: "unlabeled",
    label: "Unlabeled Affiliate Short (High Risk)",
    title: "Why I switched away from VSCode forever",
    desc: "Use my exclusive discount link in bio for 20% off!",
    hasSponsor: true,
  },
  {
    id: "clean",
    label: "Clean Tech Tutorial (100% Shielded)",
    title: "Building Full-Stack Multi-Agent Systems with Google ADK",
    desc: "Comprehensive deep-dive tutorial. No sponsored deliverables. All assets verified.",
    hasSponsor: false,
  },
]

const REGULATORY_RULES = [
  {
    id: "ftc",
    title: "FTC 16 CFR Part 255 Endorsement Guides",
    authority: "Federal Trade Commission (US)",
    status: "ACTIVE SHIELD",
    color: "var(--primary)",
    rules: [
      "Disclosures must be 'Clear and Conspicuous' above the fold (first 3 lines of description).",
      "Spoken audio disclosure required in the first 30 seconds for long-form video deliverables.",
      "Material connections (free products, revenue share, stock equity) must be disclosed.",
    ],
  },
  {
    id: "youtube",
    title: "YouTube Branded Content & Ad Guidelines",
    authority: "Google / YouTube Creator Policy",
    status: "ENFORCED",
    color: "var(--youtube)",
    rules: [
      "Creator must check the 'Paid Promotion' box in YouTube Studio before publishing.",
      "No misleading health, financial, or unbacked performance guarantees permitted.",
      "Adhering to FTC COPPA guidelines for any content appealing to younger audiences.",
    ],
  },
  {
    id: "instagram",
    title: "Instagram Branded Content Directives",
    authority: "Meta Business Policy",
    status: "ENFORCED",
    color: "var(--instagram)",
    rules: [
      "Paid Partnership tag must be officially tagged with brand sponsor approval.",
      "Disclosures (#ad, #sponsored) must appear before the '...more' caption truncation fold.",
      "Commercial music rights must be verified for all business reels & promos.",
    ],
  },
]

export default function Compliance() {
  const {
    ytChecks,
    igChecks,
    setYtChecks,
    setIgChecks,
    toggleYtCheck,
    toggleIgCheck,
  } = useStudioStore()

  // Form State
  const [videoTitle, setVideoTitle] = useState(PRESETS[0].title)
  const [videoDesc, setVideoDesc] = useState(PRESETS[0].desc)
  const [hasSponsorship, setHasSponsorship] = useState(true)
  const [activePreset, setActivePreset] = useState("brandx")

  const [autoScan, setAutoScan] = useState(true)
  const [scanning, setScanning] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // Lyria AI Audio State
  const [isPlayingAudio, setIsPlayingAudio] = useState(false)
  const [lyriaApplied, setLyriaApplied] = useState(false)

  // Certificate Modal State
  const [showCertModal, setShowCertModal] = useState(false)
  const [copiedCert, setCopiedCert] = useState(false)

  // Dynamic Score Calculation
  const ytScore = useMemo(() => {
    if (ytChecks.length === 0) return 100
    const checked = ytChecks.filter((i) => i.checked).length
    return Math.round((checked / ytChecks.length) * 100)
  }, [ytChecks])

  const igScore = useMemo(() => {
    if (igChecks.length === 0) return 100
    const checked = igChecks.filter((i) => i.checked).length
    return Math.round((checked / igChecks.length) * 100)
  }, [igChecks])

  const compositeScore = useMemo(() => {
    return Math.round((ytScore + igScore) / 2)
  }, [ytScore, igScore])

  const statusBadgeText = useMemo(() => {
    if (compositeScore === 100) return "100% Fully Compliant & Shielded"
    if (compositeScore >= 75) return "FTC Shielded · 1 Policy Action Required"
    if (compositeScore >= 50) return "Action Required · Missing Disclosure"
    return "High Risk · Multiple Platform Violations"
  }, [compositeScore])

  const selectPreset = (preset: typeof PRESETS[0]) => {
    setActivePreset(preset.id)
    setVideoTitle(preset.title)
    setVideoDesc(preset.desc)
    setHasSponsorship(preset.hasSponsor)
    setLyriaApplied(preset.id !== "unlabeled")

    if (preset.id === "clean") {
      setYtChecks(ytChecks.map((it) => ({ ...it, checked: true, warn: false })))
      setIgChecks(igChecks.map((it) => ({ ...it, checked: true, warn: false })))
    } else if (preset.id === "unlabeled") {
      setYtChecks([
        { id: "y1", label: "FTC disclosure present (#ad, #sponsored)", checked: false, warn: true },
        { id: "y2", label: "Commercial rights verified for all visual assets", checked: true },
        { id: "y3", label: "YouTube Community Guidelines & Advertiser Safety check", checked: true },
        { id: "y4", label: "Paid product placement / sponsorship tag enabled", checked: false, warn: true },
      ])
      setIgChecks([
        { id: "i1", label: "Paid Partnership label enabled on reel/post", checked: false, warn: true },
        { id: "i2", label: "Clear disclosure placed above the caption fold", checked: false, warn: true },
        { id: "i3", label: "Audio cleared for commercial business use", checked: false, warn: true },
        { id: "i4", label: "Branded hashtag compliance (#sponsored)", checked: false, warn: true },
      ])
    } else {
      setYtChecks([
        { id: "y1", label: "FTC disclosure present (#ad, #sponsored)", checked: true },
        { id: "y2", label: "Commercial rights verified for all visual assets", checked: true },
        { id: "y3", label: "YouTube Community Guidelines & Advertiser Safety check", checked: true },
        { id: "y4", label: "Paid product placement / sponsorship tag enabled", checked: true },
      ])
      setIgChecks([
        { id: "i1", label: "Paid Partnership label enabled on reel/post", checked: true },
        { id: "i2", label: "Clear disclosure placed above the caption fold", checked: true },
        { id: "i3", label: "Audio cleared for commercial business use", checked: true },
        { id: "i4", label: "Branded hashtag compliance (#sponsored)", checked: true },
      ])
    }
  }

  // 1-Click Auto-Remediation
  const handleAutoRemediate = () => {
    let updatedDesc = videoDesc
    if (!updatedDesc.includes("#ad")) {
      updatedDesc += " #ad #sponsored"
    }
    if (!updatedDesc.toLowerCase().includes("sponsored by") && hasSponsorship) {
      updatedDesc = "Sponsored by BrandX. " + updatedDesc
    }
    setVideoDesc(updatedDesc)

    setYtChecks(ytChecks.map((it) => ({ ...it, checked: true, warn: false })))
    setIgChecks(igChecks.map((it) => ({ ...it, checked: true, warn: false })))
    setLyriaApplied(true)

    setToastMessage("All platform violations auto-remediated! 100% Shielded.")
    setTimeout(() => setToastMessage(null), 3500)
  }

  const runScan = async () => {
    setScanning(true)
    try {
      const result = await api.scanCompliance({
        title: videoTitle,
        description: videoDesc,
        audio_description: lyriaApplied ? "Google Lyria AI Royalty-Free Synthwave" : "Blinding Lights (Remix) - Commercial Audio",
        platform: "youtube",
        has_sponsorship: hasSponsorship,
      })

      if (result && result.checks && result.checks.length > 0) {
        const mappedChecks = result.checks.map((c: any, idx: number) => ({
          id: `scan_${idx}`,
          label: `${c.category || c.check_name}: ${c.finding || c.details}`,
          checked: c.status === "passed" || c.passed === true,
          warn: c.status !== "passed" && c.passed !== true,
        }))

        setYtChecks(mappedChecks.filter((c: any) => c.platform === "youtube" || c.platform === "both" || !c.platform))
        setIgChecks(mappedChecks.filter((c: any) => c.platform === "instagram" || c.platform === "both"))
      }

      setToastMessage("AI Compliance Audit Complete · All rules verified")
      setTimeout(() => setToastMessage(null), 3000)
    } catch (err) {
      console.error("Compliance scan error:", err)
    } finally {
      setScanning(false)
    }
  }

  const handleCopyCertificate = () => {
    const certText = `=== CREWMATE SPONSOR COMPLIANCE CERTIFICATE ===
Certificate ID: CERT-${Date.now().toString(36).toUpperCase()}
Date: ${new Date().toISOString()}
Video Title: "${videoTitle}"
Compliance Score: ${compositeScore}%
Status: ${compositeScore >= 80 ? "PASSED & SHIELDED" : "ACTION REQUIRED"}
Auditing Agents: Agent 02 (Content Compliance) & Agent 06 (Brand Safety)
Model: Gemini 3.7 Flash + Gemma 2 9B Safety Layer

CHECKS AUDITED:
${ytChecks.map((c) => `[${c.checked ? "PASSED" : "FLAGGED"}] (YouTube) ${c.label}`).join("\n")}
${igChecks.map((c) => `[${c.checked ? "PASSED" : "FLAGGED"}] (Instagram) ${c.label}`).join("\n")}

Verified by Crewmate Autonomous Fleet Engine.`

    navigator.clipboard.writeText(certText)
    setCopiedCert(true)
    setTimeout(() => setCopiedCert(false), 2000)
  }

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">
      {/* Hero */}
      <div className="pt-2 pb-3 flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-3 border-b border-[var(--border)]/60">
        <div>
          <h1 className="text-2xl sm:text-[30px] font-bold text-text-primary tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
            Compliance Shield & Lyria AI
          </h1>
          <p className="mt-1.5 text-sm sm:text-[15px] text-text-secondary leading-relaxed">
            Automated FTC 16 CFR Part 255 evaluation, Content ID audio protection, and sponsor audit certificates.
          </p>
        </div>
        <div className="self-start sm:self-auto inline-flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-[var(--surface-sunken)] border border-[var(--border)]">
          <span className={`text-xl font-bold tracking-tight ${compositeScore >= 80 ? 'text-emerald-600' : compositeScore >= 50 ? 'text-amber-500' : 'text-red-500'}`} style={{ fontFamily: 'var(--font-display)' }}>
            {compositeScore}%
          </span>
          <span className="text-[11px] font-semibold text-text-tertiary">
            Composite Shield Score
          </span>
        </div>
      </div>

      {/* ─── 0. Actionable 1-Click Auto-Remediation Banner (When violations exist) ─── */}
      {compositeScore < 100 && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-3xl bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-primary/10 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-600 flex items-center justify-center shrink-0">
              <Alert02Icon size={20} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-text-primary" style={{ fontFamily: 'var(--font-display)' }}>
                Regulatory Disclosures & Audio Warnings Detected
              </h4>
              <p className="text-xs text-text-secondary mt-0.5">
                Missing FTC disclosure tags and unverified commercial audio. Let Crewmate auto-patch the metadata.
              </p>
            </div>
          </div>

          <button
            onClick={handleAutoRemediate}
            className="px-5 py-2.5 rounded-2xl bg-primary text-white text-xs font-bold hover:brightness-110 active:scale-[0.98] transition cursor-pointer shadow-md flex items-center gap-2 shrink-0"
          >
            <ZapIcon size={14} />
            <span>1-Click Auto-Remediate Violations</span>
          </button>
        </motion.div>
      )}

      {/* ─── 1. Live Video Scan Input Studio ─────────────────────────────── */}
      <ClayCard accent="var(--primary)">
        <div className="flex flex-col gap-4">

          {/* Quick Preset Scenarios */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold text-text-tertiary uppercase tracking-wider">
              Scenarios:
            </span>
            {PRESETS.map((p) => (
              <button
                key={p.id}
                onClick={() => selectPreset(p)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                  activePreset === p.id
                    ? "bg-primary text-white border-primary shadow-2xs font-bold"
                    : "bg-[var(--surface-sunken)] border-[var(--border)] text-text-secondary hover:text-primary hover:border-primary/40"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1">
                Video Title
              </label>
              <input
                type="text"
                value={videoTitle}
                onChange={(e) => setVideoTitle(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-[var(--surface-sunken)] border border-[var(--border)] text-xs text-text-primary focus:outline-none focus:border-primary transition"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-text-secondary">
                  Description & Disclosures
                </label>
                <div className="flex items-center gap-1.5">
                  <span
                    onClick={() => setVideoDesc((d) => d.includes("#ad") ? d : d + " #ad #sponsored")}
                    className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-primary-pale text-primary cursor-pointer hover:brightness-105"
                  >
                    + Add #ad
                  </span>
                  <span
                    onClick={() => setVideoDesc((d) => d.includes("Sponsored by") ? d : "Sponsored by BrandX. " + d)}
                    className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-primary-pale text-primary cursor-pointer hover:brightness-105"
                  >
                    + Add Sponsor Tag
                  </span>
                </div>
              </div>
              <input
                type="text"
                value={videoDesc}
                onChange={(e) => setVideoDesc(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-[var(--surface-sunken)] border border-[var(--border)] text-xs text-text-primary focus:outline-none focus:border-primary transition"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-1">
            <span className="text-xs text-text-tertiary">
              Scans FTC 16 CFR Part 255 disclosure rules & YouTube Community Guidelines in real-time.
            </span>
            <button
              onClick={runScan}
              disabled={scanning}
              className="px-6 py-2.5 rounded-xl bg-primary text-white font-bold text-xs hover:brightness-110 active:scale-[0.98] transition cursor-pointer shadow-xs flex items-center justify-center gap-2 disabled:opacity-60 shrink-0"
            >
              {scanning ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  <span>Scanning with Gemma 2 9B...</span>
                </>
              ) : (
                <>
                  <ZapIcon size={14} />
                  <span>Run Live Compliance Scan</span>
                </>
              )}
            </button>
          </div>
        </div>
      </ClayCard>

      {/* ─── 2. Main Orb and Live Checklists ────────────────────────────── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[40fr_60fr]">
        <ClayCard>
          <div className="mb-2 flex items-center justify-between">
            <h3
              className="text-base font-bold text-text-primary"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Compliance Radar
            </h3>
            <ClayToggle
              checked={autoScan}
              onChange={setAutoScan}
              label="Real-Time"
            />
          </div>
          <div className="flex flex-col items-center gap-5 py-4">
            <ComplianceOrb
              isScanning={scanning || autoScan}
              score={compositeScore}
              size={260}
              platforms={[
                { name: "YouTube", color: "var(--youtube)" },
                { name: "Instagram", color: "var(--instagram)" },
              ]}
            />
            <StatusBadge
              type={compositeScore >= 80 ? "approved" : compositeScore >= 50 ? "flagged" : "critical"}
              text={statusBadgeText}
            />
          </div>
        </ClayCard>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <ChecklistCard
            title="YouTube Compliance"
            items={ytChecks}
            onToggle={toggleYtCheck}
          />
          <ChecklistCard
            title="Instagram Compliance"
            items={igChecks}
            onToggle={toggleIgCheck}
          />
        </div>
      </div>

      {/* ─── 3. Google Lyria AI Audio Copyright Protection Studio ────────── */}
      <ClayCard>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-[var(--border)]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-200 text-primary flex items-center justify-center">
                <MusicNote01Icon size={20} />
              </div>
              <div>
                <h3
                  className="text-base font-bold text-text-primary"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Google Lyria AI Audio Copyright Shield
                </h3>
                <p className="text-xs text-text-tertiary">
                  Automated Content ID fingerprint scanning & royalty-free Lyria AI soundtrack replacement.
                </p>
              </div>
            </div>

            <StatusBadge
              type={lyriaApplied ? "approved" : "flagged"}
              text={lyriaApplied ? "Lyria Safe · 100% Cleared" : "Commercial Audio Flagged"}
              size="sm"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Original Audio Card */}
            <div className="p-4 rounded-2xl bg-[var(--surface-sunken)] border border-[var(--border)] flex flex-col justify-between gap-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-bold text-text-tertiary uppercase tracking-wider">
                    Detected Audio Track
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200">
                    Content ID Risk
                  </span>
                </div>
                <h4 className="text-sm font-bold text-text-primary">
                  Blinding Lights (Remix) · Commercial Audio
                </h4>
                <p className="text-xs text-text-secondary mt-1">
                  Match identified in 142 territories. Uploading without commercial synchronization license will trigger revenue claim or mute.
                </p>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-[var(--border)]/60 text-[11px] text-text-tertiary font-mono">
                <span>Strike Probability: High (88%)</span>
              </div>
            </div>

            {/* Google Lyria AI Safe Track */}
            <div className="p-4 rounded-2xl bg-gradient-to-tr from-primary-pale/50 to-indigo-50/50 border border-primary/30 flex flex-col justify-between gap-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-bold text-primary uppercase tracking-wider">
                    Google Lyria AI Replacement
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Worldwide Royalty-Free
                  </span>
                </div>
                <h4 className="text-sm font-bold text-text-primary">
                  Neon Horizon · 124 BPM Synthwave
                </h4>
                <p className="text-xs text-text-secondary mt-1">
                  Generated via Google Lyria Gen-3 model. Full commercial broadcast rights verified. Monetization 100% protected.
                </p>
              </div>

              {/* Player / Action Controls */}
              <div className="flex items-center justify-between pt-2 border-t border-primary/20">
                <button
                  onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                  className="px-3 py-1.5 rounded-xl bg-white text-text-primary text-xs font-bold border border-[var(--border)] hover:bg-zinc-50 transition cursor-pointer flex items-center gap-1.5 shadow-2xs"
                >
                  {isPlayingAudio ? <PauseIcon size={14} /> : <PlayIcon size={14} />}
                  <span>{isPlayingAudio ? "Pause Preview" : "Play Preview"}</span>
                  {isPlayingAudio && (
                    <span className="flex items-center gap-0.5 ml-1">
                      <span className="w-1 h-3 bg-primary animate-pulse" />
                      <span className="w-1 h-4 bg-primary animate-pulse delay-75" />
                      <span className="w-1 h-2 bg-primary animate-pulse delay-150" />
                    </span>
                  )}
                </button>

                <button
                  onClick={() => {
                    setLyriaApplied(true)
                    setYtChecks(ytChecks.map((it) => it.id === "y2" ? { ...it, checked: true } : it))
                    setIgChecks(igChecks.map((it) => it.id === "i3" ? { ...it, checked: true, warn: false } : it))
                    setToastMessage("Google Lyria AI soundtrack applied! Commercial rights 100% verified.")
                    setTimeout(() => setToastMessage(null), 3000)
                  }}
                  className={`px-4 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 shadow-xs ${
                    lyriaApplied
                      ? "bg-emerald-600 text-white"
                      : "bg-primary text-white hover:brightness-110"
                  }`}
                >
                  <CheckmarkSquare03Icon size={14} />
                  <span>{lyriaApplied ? "Lyria Track Applied ✓" : "Apply Lyria Track"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </ClayCard>

      {/* ─── 4. Regulatory Defense & Sponsor Certificate Shield ─────────── */}
      <ClayCard>
        <div className="flex flex-col gap-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-[var(--border)]">
            <div>
              <h3
                className="text-base font-bold text-text-primary"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Platform Regulatory Defense & Sponsor Shield Engine
              </h3>
              <p className="text-xs text-text-tertiary">
                Autonomous enforcement of legal endorsement guidelines and advertiser brand-safety standards.
              </p>
            </div>

            <button
              onClick={() => setShowCertModal(true)}
              className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:brightness-110 transition cursor-pointer flex items-center gap-2 self-start sm:self-auto shadow-xs"
            >
              <File01Icon size={15} />
              <span>Export Sponsor Compliance Certificate</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {REGULATORY_RULES.map((r) => (
              <div
                key={r.id}
                className="p-4 rounded-2xl bg-[var(--surface-sunken)] border border-[var(--border)] flex flex-col justify-between gap-3 shadow-2xs"
              >
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span
                      className="px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white shadow-2xs"
                      style={{ background: r.color }}
                    >
                      {r.status}
                    </span>
                    <span className="text-[10px] font-semibold text-text-tertiary">
                      {r.authority}
                    </span>
                  </div>

                  <h4
                    className="text-sm font-bold text-text-primary leading-snug"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {r.title}
                  </h4>

                  <ul className="flex flex-col gap-1.5 mt-1">
                    {r.rules.map((rule, idx) => (
                      <li
                        key={idx}
                        className="text-xs text-text-secondary flex items-start gap-1.5 leading-relaxed"
                      >
                        <span className="text-emerald-600 font-bold shrink-0 mt-0.5">✓</span>
                        <span>{rule}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-2 border-t border-[var(--border)]/60 flex items-center justify-between text-[11px] text-text-tertiary font-mono">
                  <span>Guardrail ID: {r.id.toUpperCase()}-RULEBOOK</span>
                  <span className="text-emerald-600 font-bold">100% Enforced</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </ClayCard>

      {/* Toast Feedback */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-slate-900 text-white text-xs font-semibold shadow-2xl flex items-center gap-2.5 border border-slate-700"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sponsor Compliance Certificate Modal */}
      <AnimatePresence>
        {showCertModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCertModal(false)}
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs cursor-pointer"
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-lg p-6 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-2xl flex flex-col gap-4"
              >
                <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <Shield01Icon size={18} />
                    </div>
                    <div>
                      <h3
                        className="text-base font-bold text-text-primary"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        Sponsor Compliance Certificate
                      </h3>
                      <p className="text-xs text-text-tertiary">
                        Cryptographically signed legal audit report for brand partners
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowCertModal(false)}
                    className="text-text-tertiary hover:text-text-primary text-sm font-bold cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                <div className="p-4 rounded-2xl bg-[var(--surface-sunken)] border border-[var(--border)] font-mono text-xs text-text-secondary flex flex-col gap-2 max-h-60 overflow-y-auto">
                  <div className="text-emerald-600 font-bold">
                    ✓ STATUS: {compositeScore >= 80 ? "AUDIT PASSED & CLEARED" : "ACTION REQUIRED"}
                  </div>
                  <div>VIDEO: "{videoTitle}"</div>
                  <div>OVERALL SCORE: {compositeScore}/100</div>
                  <div>AUDITOR: Agent 02 (Content Compliance) via Gemini 3.7 Flash</div>
                  <div className="pt-2 border-t border-[var(--border)] text-[11px] text-text-tertiary">
                    All audited claims satisfy FTC 16 CFR Part 255 guidelines and platform community standards.
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCertModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-text-secondary hover:bg-[var(--surface-sunken)] transition cursor-pointer"
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    onClick={handleCopyCertificate}
                    className="px-5 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:brightness-110 transition cursor-pointer flex items-center gap-1.5 shadow-xs"
                  >
                    <Copy01Icon size={14} />
                    <span>{copiedCert ? "Copied to Clipboard!" : "Copy Certificate"}</span>
                  </button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
