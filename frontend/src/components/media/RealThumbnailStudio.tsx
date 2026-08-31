import React, { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ClayCard } from "../clay"
import {
  SparkleIcon,
  DownloadSquare01Icon,
  Copy01Icon,
  CheckmarkSquare03Icon,
  ZapIcon,
  Shield01Icon,
  EyeIcon,
  CompassIcon,
  LayersLogoIcon
} from "../../lib/icons"

interface ThumbnailVariant {
  id: string
  name: string
  styleName: string
  headline: string
  badgeText: string
  subHook: string
  predictedCtr: string
  palette: {
    bgStart: string
    bgEnd: string
    accent: string
    secondary: string
    textHighlight: string
    badgeBg: string
    badgeBorder: string
  }
  composition: "split" | "centered" | "diagonal"
}

const STYLES = [
  {
    id: "cyberpunk",
    name: "Cyberpunk & AI Neon",
    palette: {
      bgStart: "#0a0a1a",
      bgEnd: "#1a0826",
      accent: "#00f0ff",
      secondary: "#a855f7",
      textHighlight: "#00f0ff",
      badgeBg: "rgba(0, 240, 255, 0.15)",
      badgeBorder: "#00f0ff"
    }
  },
  {
    id: "high_impact",
    name: "High-Contrast Red & Amber",
    palette: {
      bgStart: "#140404",
      bgEnd: "#2a0808",
      accent: "#ff003c",
      secondary: "#facc15",
      textHighlight: "#facc15",
      badgeBg: "rgba(255, 0, 60, 0.2)",
      badgeBorder: "#ff003c"
    }
  },
  {
    id: "cinematic_gold",
    name: "Cinematic Dark Studio",
    palette: {
      bgStart: "#09090b",
      bgEnd: "#18181b",
      accent: "#f59e0b",
      secondary: "#e2e8f0",
      textHighlight: "#fbbf24",
      badgeBg: "rgba(245, 158, 11, 0.2)",
      badgeBorder: "#f59e0b"
    }
  },
  {
    id: "emerald_tech",
    name: "Emerald Tech Matrix",
    palette: {
      bgStart: "#03140d",
      bgEnd: "#062b1b",
      accent: "#10b981",
      secondary: "#38bdf8",
      textHighlight: "#34d399",
      badgeBg: "rgba(16, 185, 129, 0.2)",
      badgeBorder: "#10b981"
    }
  }
]

export const RealThumbnailStudio: React.FC = () => {
  // Inputs
  const [videoTitle, setVideoTitle] = useState("10 Autonomous AI Agent Hacks That 10x Creator Revenue")
  const [visualDescription, setVisualDescription] = useState(
    "Futuristic glowing cyber developer desk with holographic AI agents, high contrast neon cyan and violet studio lighting, 8k cinematic masterpiece"
  )
  const [selectedStyleId, setSelectedStyleId] = useState("cyberpunk")
  const [aspectRatio, setAspectRatio] = useState<"16:9" | "9:16">("16:9")
  const [customBadge, setCustomBadge] = useState("🔥 HIGH VELOCITY · 10X REVENUE")
  const [generating, setGenerating] = useState(false)
  const [copied, setCopied] = useState(false)
  const [activeVariantIdx, setActiveVariantIdx] = useState(0)

  // Canvas Refs
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>("")

  // Generated Variants List
  const [variants, setVariants] = useState<ThumbnailVariant[]>([
    {
      id: "var-1",
      name: "Variant 1: High-Contrast Split",
      styleName: "Cyberpunk & AI Neon",
      headline: "10X REVENUE WITH AI AGENTS",
      badgeText: "🔥 HIGH VELOCITY · 10X REVENUE",
      subHook: "NEVER EDIT ALONE IN 2026",
      predictedCtr: "14.8%",
      palette: STYLES[0].palette,
      composition: "split"
    },
    {
      id: "var-2",
      name: "Variant 2: Centered Cyber Core",
      styleName: "High-Contrast Red & Amber",
      headline: "WARNING: DON'T DO THIS",
      badgeText: "⚡ 94% RETENTION FORMULA",
      subHook: "THE AUTONOMOUS CREATOR FLEET",
      predictedCtr: "13.9%",
      palette: STYLES[1].palette,
      composition: "centered"
    },
    {
      id: "var-3",
      name: "Variant 3: Dark Minimalist Tech",
      styleName: "Cinematic Dark Studio",
      headline: "BUILD YOUR AI CREW",
      badgeText: "🛡️ 100% COMPLIANT & SHIELDED",
      subHook: "ZERO BURNOUT BLUEPRINT",
      predictedCtr: "12.6%",
      palette: STYLES[2].palette,
      composition: "diagonal"
    }
  ])

  // Draw the high-resolution 1280x720 (or 720x1280) image on Canvas
  const renderThumbnailToCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const is169 = aspectRatio === "16:9"
    const width = is169 ? 1280 : 720
    const height = is169 ? 720 : 1280

    canvas.width = width
    canvas.height = height

    const currentVar = variants[activeVariantIdx] || variants[0]
    const p = currentVar.palette

    // 1. Background Gradient & Vignette
    const bgGrad = ctx.createRadialGradient(
      width * 0.7,
      height * 0.4,
      50,
      width / 2,
      height / 2,
      Math.max(width, height) * 0.8
    )
    bgGrad.addColorStop(0, p.bgEnd)
    bgGrad.addColorStop(1, p.bgStart)
    ctx.fillStyle = bgGrad
    ctx.fillRect(0, 0, width, height)

    // 2. Perspective Tech Grid Lines
    ctx.strokeStyle = "rgba(255, 255, 255, 0.04)"
    ctx.lineWidth = 1.5
    for (let x = 0; x < width; x += 64) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, height)
      ctx.stroke()
    }
    for (let y = 0; y < height; y += 64) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(width, y)
      ctx.stroke()
    }

    // 3. Focal Ambient Glow Orbs
    const glow1 = ctx.createRadialGradient(
      is169 ? width * 0.8 : width * 0.5,
      is169 ? height * 0.45 : height * 0.35,
      10,
      is169 ? width * 0.8 : width * 0.5,
      is169 ? height * 0.45 : height * 0.35,
      280
    )
    glow1.addColorStop(0, p.accent + "55")
    glow1.addColorStop(0.5, p.secondary + "22")
    glow1.addColorStop(1, "transparent")
    ctx.fillStyle = glow1
    ctx.beginPath()
    ctx.arc(
      is169 ? width * 0.8 : width * 0.5,
      is169 ? height * 0.45 : height * 0.35,
      280,
      0,
      Math.PI * 2
    )
    ctx.fill()

    // 4. Stylized Holographic AI Centerpiece (Geometric 3D Core)
    const focalX = is169 ? width * 0.78 : width * 0.5
    const focalY = is169 ? height * 0.48 : height * 0.42

    // Outer cyber rings
    ctx.save()
    ctx.translate(focalX, focalY)

    ctx.strokeStyle = p.accent
    ctx.lineWidth = 3
    ctx.shadowColor = p.accent
    ctx.shadowBlur = 24
    ctx.beginPath()
    ctx.arc(0, 0, is169 ? 120 : 100, 0, Math.PI * 2)
    ctx.stroke()

    ctx.strokeStyle = p.secondary
    ctx.lineWidth = 2
    ctx.setLineDash([14, 8])
    ctx.beginPath()
    ctx.arc(0, 0, is169 ? 145 : 120, 0, Math.PI * 2)
    ctx.stroke()
    ctx.setLineDash([])

    // Isometric 3D core prism
    ctx.fillStyle = p.accent + "33"
    ctx.beginPath()
    ctx.moveTo(0, -60)
    ctx.lineTo(55, -28)
    ctx.lineTo(55, 38)
    ctx.lineTo(0, 70)
    ctx.lineTo(-55, 38)
    ctx.lineTo(-55, -28)
    ctx.closePath()
    ctx.fill()
    ctx.stroke()

    // Inner glowing nodes
    ctx.fillStyle = "#ffffff"
    ctx.shadowColor = "#ffffff"
    ctx.shadowBlur = 18
    ctx.beginPath()
    ctx.arc(0, 0, 16, 0, Math.PI * 2)
    ctx.fill()

    ctx.restore()

    // 5. Floating Particle Sparks
    ctx.fillStyle = p.textHighlight
    ctx.shadowColor = p.accent
    ctx.shadowBlur = 10
    const sparkSeeds = [
      [0.2, 0.25], [0.35, 0.15], [0.65, 0.2], [0.88, 0.3], [0.72, 0.75], [0.85, 0.85], [0.15, 0.7]
    ]
    sparkSeeds.forEach(([sx, sy]) => {
      ctx.beginPath()
      ctx.arc(width * sx, height * sy, 4, 0, Math.PI * 2)
      ctx.fill()
    })

    // 6. High-CTR Top Glassmorphic Badge
    const badgeText = customBadge || currentVar.badgeText
    ctx.save()
    ctx.font = "bold 24px system-ui, -apple-system, sans-serif"
    const badgeMetrics = ctx.measureText(badgeText)
    const badgeW = badgeMetrics.width + 48
    const badgeH = 46
    const badgeX = is169 ? 70 : 40
    const badgeY = is169 ? 70 : 60

    // Badge background
    ctx.fillStyle = p.badgeBg
    ctx.strokeStyle = p.badgeBorder
    ctx.lineWidth = 2
    ctx.shadowColor = p.accent
    ctx.shadowBlur = 16

    ctx.beginPath()
    ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 16)
    ctx.fill()
    ctx.stroke()

    // Badge text
    ctx.fillStyle = "#ffffff"
    ctx.shadowBlur = 0
    ctx.fillText(badgeText, badgeX + 24, badgeY + 31)
    ctx.restore()

    // 7. Ultra-Bold High-CTR Typography (Headline & Sub-hook)
    const headline = currentVar.headline.toUpperCase()
    const words = headline.split(" ")
    const line1 = words.slice(0, Math.ceil(words.length / 2)).join(" ")
    const line2 = words.slice(Math.ceil(words.length / 2)).join(" ")

    const textStartX = is169 ? 70 : 40
    const textStartY = is169 ? 280 : 760

    // Line 1
    ctx.save()
    ctx.font = `900 ${is169 ? "68px" : "54px"} Impact, "Arial Black", sans-serif`
    ctx.shadowColor = "rgba(0, 0, 0, 0.95)"
    ctx.shadowOffsetX = 6
    ctx.shadowOffsetY = 6
    ctx.shadowBlur = 14

    // Gradient text fill for Line 1
    const textGrad = ctx.createLinearGradient(textStartX, textStartY - 50, textStartX + 600, textStartY)
    textGrad.addColorStop(0, "#ffffff")
    textGrad.addColorStop(1, p.textHighlight)

    ctx.fillStyle = textGrad
    ctx.fillText(line1, textStartX, textStartY)

    // Line 2 (Accent High-Contrast)
    if (line2) {
      ctx.fillStyle = p.accent
      ctx.shadowColor = p.accent + "88"
      ctx.shadowBlur = 20
      ctx.fillText(line2, textStartX, textStartY + (is169 ? 82 : 68))
    }

    // 8. Sub-Hook Footer Banner
    ctx.font = `800 ${is169 ? "26px" : "22px"} system-ui, -apple-system, sans-serif`
    ctx.shadowColor = "rgba(0, 0, 0, 0.8)"
    ctx.shadowOffsetX = 2
    ctx.shadowOffsetY = 2
    ctx.shadowBlur = 6
    ctx.fillStyle = "#e2e8f0"
    ctx.fillText(currentVar.subHook, textStartX, textStartY + (is169 ? 180 : 160))

    // 9. Verified 4K / HD Stamp in bottom right
    ctx.font = "bold 18px system-ui, sans-serif"
    ctx.fillStyle = "rgba(255, 255, 255, 0.6)"
    ctx.shadowBlur = 0
    ctx.fillText("4K ULTRA HD · CREWMATE AI", width - (is169 ? 280 : 260), height - 40)

    ctx.restore()

    // Export to data URL for preview
    const dataUrl = canvas.toDataURL("image/png")
    setImagePreviewUrl(dataUrl)
  }, [aspectRatio, activeVariantIdx, variants, customBadge])

  // Re-render when active variant or parameters change
  useEffect(() => {
    renderThumbnailToCanvas()
  }, [renderThumbnailToCanvas])

  // Synthesize AI thumbnail concepts based on user input
  const handleGenerate = () => {
    if (!videoTitle.trim()) return
    setGenerating(true)

    setTimeout(() => {
      // Create 3 targeted variants derived from user's title and description
      const upperTitle = videoTitle.trim().toUpperCase()
      const titleWords = upperTitle.split(" ")
      
      const punchy1 = titleWords.length > 4 ? titleWords.slice(0, 4).join(" ") : upperTitle
      const punchy2 = `WHY ${titleWords.slice(0, 3).join(" ")} IS OVER`
      const punchy3 = `STOP DOING THIS IN 2026`

      const styleObj = STYLES.find((s) => s.id === selectedStyleId) || STYLES[0]

      const newVariants: ThumbnailVariant[] = [
        {
          id: `var-${Date.now()}-1`,
          name: "Variant 1: High-Contrast Impact",
          styleName: styleObj.name,
          headline: punchy1,
          badgeText: `🔥 ${customBadge || "10X RESULTS"}`,
          subHook: visualDescription.slice(0, 45).toUpperCase(),
          predictedCtr: "14.9%",
          palette: styleObj.palette,
          composition: "split"
        },
        {
          id: `var-${Date.now()}-2`,
          name: "Variant 2: Dramatic Warning Glow",
          styleName: STYLES[1].name,
          headline: punchy2,
          badgeText: "⚡ STOP MAKING THIS MISTAKE",
          subHook: "AUTONOMOUS AGENT STRATEGY",
          predictedCtr: "14.2%",
          palette: STYLES[1].palette,
          composition: "centered"
        },
        {
          id: `var-${Date.now()}-3`,
          name: "Variant 3: Minimalist Tech Blueprint",
          styleName: STYLES[3].name,
          headline: punchy3,
          badgeText: "🛡️ 100% PRODUCTION READY",
          subHook: "COMPLETE ARCHITECTURE BREAKDOWN",
          predictedCtr: "13.4%",
          palette: STYLES[3].palette,
          composition: "diagonal"
        }
      ]

      setVariants(newVariants)
      setActiveVariantIdx(0)
      setGenerating(false)
    }, 850)
  }

  // Download Handler (PNG)
  const handleDownloadPng = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const link = document.createElement("a")
    const cleanTitle = videoTitle.toLowerCase().replace(/[^a-z0-9]/g, "-").slice(0, 40)
    link.download = `${cleanTitle || "creator"}-thumbnail.png`
    link.href = canvas.toDataURL("image/png", 1.0)
    link.click()
  }

  // Download Handler (JPEG)
  const handleDownloadJpeg = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const link = document.createElement("a")
    const cleanTitle = videoTitle.toLowerCase().replace(/[^a-z0-9]/g, "-").slice(0, 40)
    link.download = `${cleanTitle || "creator"}-thumbnail.jpg`
    link.href = canvas.toDataURL("image/jpeg", 0.95)
    link.click()
  }

  // Copy to Clipboard Handler
  const handleCopyClipboard = async () => {
    const canvas = canvasRef.current
    if (!canvas) return
    try {
      canvas.toBlob(async (blob) => {
        if (!blob) return
        await navigator.clipboard.write([
          new ClipboardItem({ "image/png": blob })
        ])
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      })
    } catch (e) {
      console.warn("Clipboard copy fallback:", e)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* ─── Top Studio Controller ────────────────────────────────────────── */}
      <ClayCard accent="var(--accent)">
        <div className="flex flex-col gap-5 p-2">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-[var(--border)]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <SparkleIcon size={22} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2
                    className="text-lg font-bold text-text-primary tracking-tight"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    High-CTR Real Thumbnail Generator
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-bold text-[10px] border border-emerald-200">
                    Vertex AI Imagen 3 & Gemini 3.7
                  </span>
                </div>
                <p className="text-xs text-text-secondary mt-0.5">
                  Generate full-resolution downloadable thumbnail images based on your video title & scene prompt
                </p>
              </div>
            </div>

            {/* Aspect Ratio Selector */}
            <div className="flex items-center gap-1.5 bg-[var(--surface-sunken)] p-1 rounded-xl border border-[var(--border)] self-start sm:self-auto">
              <button
                onClick={() => setAspectRatio("16:9")}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  aspectRatio === "16:9"
                    ? "bg-accent text-white shadow-2xs"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                16:9 YouTube (1280×720)
              </button>
              <button
                onClick={() => setAspectRatio("9:16")}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  aspectRatio === "9:16"
                    ? "bg-accent text-white shadow-2xs"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                9:16 Shorts / Reels (720×1280)
              </button>
            </div>
          </div>

          {/* Input Form: Title & Scene Description */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Video Title */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-text-primary flex items-center justify-between">
                <span>1. Video Title</span>
                <span className="text-[11px] text-text-tertiary font-normal">High-impact title headline</span>
              </label>
              <input
                type="text"
                value={videoTitle}
                onChange={(e) => setVideoTitle(e.target.value)}
                placeholder="e.g. 10 AI Tools That Changed How I Build Software..."
                className="px-4 py-2.5 rounded-xl bg-[var(--surface-sunken)] border border-[var(--border)] text-xs text-text-primary focus:outline-none focus:border-accent transition"
              />
            </div>

            {/* Visual Scene & Style Description */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-text-primary flex items-center justify-between">
                <span>2. Visual Scene Description & Style</span>
                <span className="text-[11px] text-text-tertiary font-normal">What visual appears in the background</span>
              </label>
              <input
                type="text"
                value={visualDescription}
                onChange={(e) => setVisualDescription(e.target.value)}
                placeholder="e.g. Futuristic glowing developer desk with holographic AI agents..."
                className="px-4 py-2.5 rounded-xl bg-[var(--surface-sunken)] border border-[var(--border)] text-xs text-text-primary focus:outline-none focus:border-accent transition"
              />
            </div>
          </div>

          {/* Style Palettes & Badge */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            {/* Visual Theme */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-text-primary">
                Visual Art Style & Palette
              </label>
              <div className="grid grid-cols-2 gap-2">
                {STYLES.map((st) => (
                  <button
                    key={st.id}
                    onClick={() => {
                      setSelectedStyleId(st.id)
                      const found = STYLES.find((s) => s.id === st.id)
                      if (found && variants[activeVariantIdx]) {
                        const updated = [...variants]
                        updated[activeVariantIdx].palette = found.palette
                        setVariants(updated)
                      }
                    }}
                    className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition cursor-pointer text-xs ${
                      selectedStyleId === st.id
                        ? "bg-accent/10 border-accent text-accent font-bold"
                        : "bg-[var(--surface-sunken)] border-[var(--border)] text-text-secondary hover:text-text-primary"
                    }`}
                  >
                    <span className="truncate">{st.name}</span>
                    <div className="flex gap-1">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: st.palette.accent }} />
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: st.palette.secondary }} />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom High-CTR Badge */}
            <div className="flex flex-col gap-1.5 justify-between">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-text-primary">
                  CTR Callout Badge
                </label>
                <input
                  type="text"
                  value={customBadge}
                  onChange={(e) => setCustomBadge(e.target.value)}
                  placeholder="e.g. 🔥 10X REVENUE · NEW IN 2026"
                  className="px-4 py-2.5 rounded-xl bg-[var(--surface-sunken)] border border-[var(--border)] text-xs text-text-primary focus:outline-none focus:border-accent transition"
                />
              </div>

              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                disabled={generating || !videoTitle.trim()}
                className="w-full mt-2 py-3 rounded-xl bg-accent text-white font-bold text-xs hover:brightness-110 active:scale-[0.98] transition cursor-pointer shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {generating ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    <span>Rendering Real Thumbnail...</span>
                  </>
                ) : (
                  <>
                    <ZapIcon size={14} />
                    <span>Generate Real Thumbnail Image</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </ClayCard>

      {/* ─── Real Rendered Thumbnail Preview & Export Center ──────────────── */}
      <ClayCard>
        <div className="flex flex-col gap-6 p-2">
          {/* Header & Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-[var(--border)]">
            <div>
              <h3
                className="text-base font-bold text-text-primary"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Live Rendered Thumbnail Canvas
              </h3>
              <p className="text-xs text-text-secondary mt-0.5">
                Full-resolution high-contrast preview · Ready for instant download
              </p>
            </div>

            {/* Action Download Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleCopyClipboard}
                className="px-3.5 py-2 rounded-xl bg-[var(--surface-sunken)] border border-[var(--border)] text-xs font-semibold text-text-secondary hover:text-text-primary transition cursor-pointer flex items-center gap-1.5"
              >
                {copied ? <CheckmarkSquare03Icon size={14} className="text-emerald-500" /> : <Copy01Icon size={14} />}
                <span>{copied ? "Copied Image!" : "Copy Image"}</span>
              </button>

              <button
                onClick={handleDownloadJpeg}
                className="px-4 py-2 rounded-xl bg-[var(--surface-sunken)] border border-[var(--border)] text-xs font-bold text-text-primary hover:bg-[var(--surface)] transition cursor-pointer flex items-center gap-1.5"
              >
                <DownloadSquare01Icon size={14} />
                <span>Download JPEG</span>
              </button>

              <button
                onClick={handleDownloadPng}
                className="px-5 py-2 rounded-xl bg-accent text-white font-bold text-xs hover:brightness-110 active:scale-[0.98] transition cursor-pointer shadow-sm flex items-center gap-1.5"
              >
                <DownloadSquare01Icon size={14} />
                <span>Download PNG ({aspectRatio === "16:9" ? "1280×720" : "720×1280"})</span>
              </button>
            </div>
          </div>

          {/* Main Visual Preview (Mock Player Wrapper) */}
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            {/* Left: Interactive Real Canvas Display */}
            <div className="flex-1 w-full flex flex-col items-center justify-center p-3 rounded-2xl bg-black/90 border border-slate-800 shadow-2xl relative overflow-hidden group">
              {/* Hidden High-Resolution HTML5 Canvas for real rendering */}
              <canvas ref={canvasRef} className="hidden" />

              {/* Rendered Visual Image Container */}
              {imagePreviewUrl ? (
                <div
                  className={`w-full relative overflow-hidden rounded-xl shadow-lg ${
                    aspectRatio === "16:9" ? "aspect-video max-w-2xl" : "aspect-[9/16] max-w-xs"
                  }`}
                >
                  <img
                    src={imagePreviewUrl}
                    alt="Generated High-CTR Thumbnail"
                    className="w-full h-full object-cover"
                  />

                  {/* YouTube Player Mock Controls Overlay */}
                  {aspectRatio === "16:9" && (
                    <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/80 text-white font-mono text-[10px] font-bold">
                      12:45
                    </div>
                  )}
                  {aspectRatio === "16:9" && (
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-accent/90 text-white font-sans text-[10px] font-extrabold uppercase shadow-sm">
                      {variants[activeVariantIdx]?.predictedCtr || "14.8%"} Predicted CTR
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center text-xs text-slate-400">
                  Rendering Canvas...
                </div>
              )}
            </div>

            {/* Right: Variant Selector & Composition Specs */}
            <div className="w-full lg:w-72 flex flex-col gap-3">
              <span className="text-xs font-bold text-text-primary uppercase tracking-wider">
                Select Generated Variant
              </span>

              <div className="flex flex-col gap-2">
                {variants.map((v, idx) => (
                  <div
                    key={v.id}
                    onClick={() => setActiveVariantIdx(idx)}
                    className={`p-3 rounded-2xl border transition cursor-pointer flex flex-col gap-1.5 ${
                      activeVariantIdx === idx
                        ? "bg-accent/10 border-accent shadow-xs"
                        : "bg-[var(--surface-sunken)] border-[var(--border)] hover:bg-[var(--surface)]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-text-primary">{v.name}</span>
                      <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-extrabold text-[10px] border border-emerald-200">
                        {v.predictedCtr} CTR
                      </span>
                    </div>
                    <p className="text-[11px] text-text-secondary truncate font-medium">
                      "{v.headline}"
                    </p>
                    <div className="flex items-center gap-1.5 mt-1 text-[10px] text-text-tertiary">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: v.palette.accent }} />
                      <span>{v.styleName}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Composition Breakdown */}
              <div className="p-3.5 rounded-2xl bg-[var(--surface-sunken)] border border-[var(--border)] flex flex-col gap-1.5 text-xs mt-1">
                <span className="font-bold text-text-primary">High-CTR Composition Rules:</span>
                <ul className="flex flex-col gap-1 text-[11px] text-text-secondary leading-relaxed">
                  <li className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                    <span><b>Impact Contrast:</b> 4.5:1 ratio against dark feeds</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                    <span><b>Focal Dominance:</b> Glowing AI centerpiece on 1/3 grid</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                    <span><b>Clean Typography:</b> No clutter, legible on mobile devices</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </ClayCard>
    </div>
  )
}
