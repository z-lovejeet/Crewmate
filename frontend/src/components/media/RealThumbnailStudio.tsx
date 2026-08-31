import React, { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ClayCard } from "../clay"
import { api } from "../../lib/api"
import {
  SparkleIcon,
  DownloadSquare01Icon,
  Copy01Icon,
  CheckmarkSquare03Icon,
  ZapIcon,
  ViewIcon,
} from "../../lib/icons"

interface ThumbnailData {
  id: string
  name: string
  style_name: string
  headline: string
  badge_text: string
  sub_hook: string
  predicted_ctr: string
  ai_image_prompt: string
  image_data: string    // base64 data URI
  image_format: string  // "png" | "jpeg"
  palette: {
    bgStart: string
    bgEnd: string
    accent: string
    secondary: string
    textHighlight: string
    badgeBg: string
    badgeBorder: string
  }
}

const STYLES = [
  { id: "cinematic_gold", name: "Cinematic Dark Studio", desc: "Warm amber & gold highlights with moody contrast" },
  { id: "cyberpunk", name: "Cyberpunk Tech Neon", desc: "High-voltage cyan & violet dual tone" },
  { id: "high_impact", name: "High-Contrast Scarlet", desc: "Aggressive red & tungsten edge lighting" },
  { id: "emerald_tech", name: "Emerald Minimalist", desc: "Deep obsidian with crisp green accents" }
]

export const RealThumbnailStudio: React.FC = () => {
  const [videoTitle, setVideoTitle] = useState("")
  const [visualDescription, setVisualDescription] = useState("")
  const [selectedStyleId, setSelectedStyleId] = useState("cinematic_gold")
  const [aspectRatio, setAspectRatio] = useState<"16:9" | "9:16">("16:9")
  const [customBadge, setCustomBadge] = useState("")
  const [showTextOverlay, setShowTextOverlay] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [copied, setCopied] = useState(false)
  const [generationTime, setGenerationTime] = useState<number | null>(null)
  const [thumbnail, setThumbnail] = useState<ThumbnailData | null>(null)

  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>("")

  // ─── Draw thumbnail on canvas ─────────────────────────────────────────
  const renderThumbnailToCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas || !thumbnail?.image_data) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const is169 = aspectRatio === "16:9"
    const width = is169 ? 1376 : 768
    const height = is169 ? 768 : 1376
    canvas.width = width
    canvas.height = height

    const p = thumbnail.palette

    // Base gradient fallback
    const bgGrad = ctx.createLinearGradient(0, 0, width, height)
    bgGrad.addColorStop(0, p.bgStart)
    bgGrad.addColorStop(1, p.bgEnd)
    ctx.fillStyle = bgGrad
    ctx.fillRect(0, 0, width, height)

    const img = new Image()
    img.src = thumbnail.image_data

    const drawOverlay = () => {
      if (showTextOverlay) {
        // Vignette for text legibility
        const vignette = ctx.createLinearGradient(0, 0, width * 0.68, 0)
        vignette.addColorStop(0, "rgba(0, 0, 0, 0.88)")
        vignette.addColorStop(0.5, "rgba(0, 0, 0, 0.45)")
        vignette.addColorStop(1, "transparent")
        ctx.fillStyle = vignette
        ctx.fillRect(0, 0, width, height)

        // Badge
        const badgeText = customBadge || thumbnail.badge_text
        ctx.save()
        ctx.font = "bold 22px system-ui, -apple-system, sans-serif"
        const badgeMetrics = ctx.measureText(badgeText)
        const badgeW = badgeMetrics.width + 44
        const badgeH = 44
        const badgeX = is169 ? 64 : 40
        const badgeY = is169 ? 64 : 54

        ctx.fillStyle = p.badgeBg || "rgba(0, 240, 255, 0.2)"
        ctx.strokeStyle = p.badgeBorder || p.accent
        ctx.lineWidth = 2
        ctx.shadowColor = p.accent
        ctx.shadowBlur = 14
        ctx.beginPath()
        ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 12)
        ctx.fill()
        ctx.stroke()

        ctx.fillStyle = "#ffffff"
        ctx.shadowBlur = 0
        ctx.fillText(badgeText, badgeX + 22, badgeY + 29)
        ctx.restore()

        // Headline
        const headline = thumbnail.headline.toUpperCase()
        const words = headline.split(" ")
        const line1 = words.slice(0, Math.ceil(words.length / 2)).join(" ")
        const line2 = words.slice(Math.ceil(words.length / 2)).join(" ")
        const textStartX = is169 ? 64 : 40
        const textStartY = is169 ? 320 : 800

        ctx.save()
        ctx.font = `900 ${is169 ? "72px" : "56px"} Impact, "Arial Black", sans-serif`
        ctx.shadowColor = "rgba(0, 0, 0, 0.95)"
        ctx.shadowOffsetX = 6
        ctx.shadowOffsetY = 6
        ctx.shadowBlur = 16

        const textGrad = ctx.createLinearGradient(textStartX, textStartY - 50, textStartX + 500, textStartY)
        textGrad.addColorStop(0, "#ffffff")
        textGrad.addColorStop(1, p.textHighlight || "#ffffff")
        ctx.fillStyle = textGrad
        ctx.fillText(line1, textStartX, textStartY)

        if (line2) {
          ctx.fillStyle = p.accent
          ctx.shadowColor = p.accent + "99"
          ctx.shadowBlur = 22
          ctx.fillText(line2, textStartX, textStartY + (is169 ? 84 : 70))
        }

        ctx.font = `800 ${is169 ? "26px" : "22px"} system-ui, -apple-system, sans-serif`
        ctx.shadowColor = "rgba(0, 0, 0, 0.85)"
        ctx.shadowOffsetX = 2
        ctx.shadowOffsetY = 2
        ctx.shadowBlur = 6
        ctx.fillStyle = "#e2e8f0"
        ctx.fillText(thumbnail.sub_hook, textStartX, textStartY + (is169 ? 180 : 160))

        ctx.font = "bold 18px system-ui, sans-serif"
        ctx.fillStyle = "rgba(255, 255, 255, 0.75)"
        ctx.shadowBlur = 0
        ctx.fillText("CREWMATE MASTER PRODUCTION", width - (is169 ? 340 : 310), height - 38)
        ctx.restore()
      }

      try {
        const dataUrl = canvas.toDataURL("image/png")
        setImagePreviewUrl(dataUrl)
      } catch {
        setImagePreviewUrl(thumbnail.image_data)
      }
    }

    img.onload = () => {
      ctx.drawImage(img, 0, 0, width, height)
      drawOverlay()
    }
    img.onerror = () => drawOverlay()
  }, [aspectRatio, thumbnail, customBadge, showTextOverlay])

  useEffect(() => {
    renderThumbnailToCanvas()
  }, [renderThumbnailToCanvas])

  // ─── Call the Master AI generation pipeline ───────────────────────────
  const handleGenerate = async () => {
    if (!videoTitle.trim()) return
    setGenerating(true)
    setGenerationTime(null)
    const t0 = Date.now()

    try {
      const resp = await api.generateAiThumbnails(
        videoTitle,
        visualDescription,
        selectedStyleId,
        aspectRatio
      )

      const resultThumb = resp?.thumbnail || (resp?.variants && resp.variants[0])
      if (resultThumb) {
        setThumbnail(resultThumb)
        if (resultThumb.badge_text) {
          setCustomBadge(resultThumb.badge_text)
        }
      }
    } catch (err) {
      console.error("AI Master Thumbnail Generation Error:", err)
    } finally {
      setGenerating(false)
      setGenerationTime(Math.round((Date.now() - t0) / 1000))
    }
  }

  // ─── Download handlers ────────────────────────────────────────────────
  const handleDownloadPng = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const link = document.createElement("a")
    link.download = `${videoTitle.toLowerCase().replace(/[^a-z0-9]/g, "-").slice(0, 40) || "thumbnail"}.png`
    link.href = canvas.toDataURL("image/png", 1.0)
    link.click()
  }

  const handleDownloadJpeg = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const link = document.createElement("a")
    link.download = `${videoTitle.toLowerCase().replace(/[^a-z0-9]/g, "-").slice(0, 40) || "thumbnail"}.jpg`
    link.href = canvas.toDataURL("image/jpeg", 0.95)
    link.click()
  }

  const handleCopyClipboard = async () => {
    const canvas = canvasRef.current
    if (!canvas) return
    try {
      canvas.toBlob(async (blob) => {
        if (!blob) return
        await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })])
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      })
    } catch (e) {
      console.warn("Clipboard copy fallback:", e)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* ─── Input Studio ──────────────────────────────────────────────── */}
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
                    AI Master Thumbnail Studio
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-bold text-[10px] border border-emerald-200">
                    Gemini 3 Pro Image (1376x768)
                  </span>
                </div>
                <p className="text-xs text-text-secondary mt-0.5">
                  Synthesizes title, scene description, and composition parameters to render the single optimal thumbnail
                </p>
              </div>
            </div>

            {/* Aspect Ratio */}
            <div className="flex items-center gap-1.5 bg-[var(--surface-sunken)] p-1 rounded-xl border border-[var(--border)] self-start sm:self-auto">
              <button
                onClick={() => setAspectRatio("16:9")}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  aspectRatio === "16:9"
                    ? "bg-accent text-white shadow-2xs"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                16:9 YouTube Widescreen
              </button>
              <button
                onClick={() => setAspectRatio("9:16")}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  aspectRatio === "9:16"
                    ? "bg-accent text-white shadow-2xs"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                9:16 Vertical
              </button>
            </div>
          </div>

          {/* Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-text-primary uppercase tracking-wider">
                Video Title
              </label>
              <input
                type="text"
                value={videoTitle}
                onChange={(e) => setVideoTitle(e.target.value)}
                placeholder="Enter your video title or main headline..."
                className="px-4 py-2.5 rounded-xl bg-[var(--surface-sunken)] border border-[var(--border)] text-xs text-text-primary focus:outline-none focus:border-accent transition"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-text-primary uppercase tracking-wider">
                Visual Scene Description
              </label>
              <input
                type="text"
                value={visualDescription}
                onChange={(e) => setVisualDescription(e.target.value)}
                placeholder="Describe key subjects, mood, environment, and focal elements..."
                className="px-4 py-2.5 rounded-xl bg-[var(--surface-sunken)] border border-[var(--border)] text-xs text-text-primary focus:outline-none focus:border-accent transition"
              />
            </div>
          </div>

          {/* Style & Generate */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-text-primary uppercase tracking-wider">
                Cinematic Visual Direction
              </label>
              <div className="grid grid-cols-2 gap-2">
                {STYLES.map((st) => (
                  <button
                    key={st.id}
                    onClick={() => setSelectedStyleId(st.id)}
                    className={`p-3 rounded-xl border text-left transition cursor-pointer flex flex-col gap-0.5 ${
                      selectedStyleId === st.id
                        ? "bg-accent/10 border-accent text-accent font-bold"
                        : "bg-[var(--surface-sunken)] border-[var(--border)] text-text-secondary hover:text-text-primary"
                    }`}
                  >
                    <span className="text-xs font-bold text-text-primary">{st.name}</span>
                    <span className="text-[10px] text-text-tertiary truncate">{st.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-1.5 justify-between">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-text-primary uppercase tracking-wider">
                  Badge Text (Optional)
                </label>
                <input
                  type="text"
                  value={customBadge}
                  onChange={(e) => setCustomBadge(e.target.value)}
                  placeholder="e.g. HIGH VELOCITY | EXCLUSIVE"
                  className="px-4 py-2.5 rounded-xl bg-[var(--surface-sunken)] border border-[var(--border)] text-xs text-text-primary focus:outline-none focus:border-accent transition"
                />
              </div>

              <button
                onClick={handleGenerate}
                disabled={generating || !videoTitle.trim()}
                className="w-full mt-2 py-3 rounded-xl bg-accent text-white font-bold text-xs hover:brightness-110 active:scale-[0.98] transition cursor-pointer shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {generating ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    <span>Rendering with Gemini 3 Pro Image...</span>
                  </>
                ) : (
                  <>
                    <ZapIcon size={14} />
                    <span>Generate Master Thumbnail</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Generation progress indicator */}
          {generating && (
            <div className="flex flex-col gap-2 p-4 rounded-2xl bg-accent/5 border border-accent/20">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <span className="text-xs font-bold text-accent">Generating single master image...</span>
              </div>
              <div className="flex flex-col gap-1 text-[11px] text-text-secondary">
                <span>Stage 1: Gemini 3.7 Flash synthesizing master prompt & color balance</span>
                <span>Stage 2: Gemini 3 Pro Image rendering 1376x768 master image</span>
                <span className="text-text-tertiary">Estimated completion: ~5 to 8 seconds</span>
              </div>
            </div>
          )}

          {generationTime !== null && !generating && (
            <div className="text-[11px] text-text-tertiary text-right font-mono">
              Rendered in {generationTime}s via Gemini 3 Pro Image (Vertex AI Global)
            </div>
          )}
        </div>
      </ClayCard>

      {/* ─── Results ───────────────────────────────────────────────────── */}
      {thumbnail && (
        <ClayCard>
          <div className="flex flex-col gap-6 p-2">
            {/* Header & Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-[var(--border)]">
              <div>
                <h3
                  className="text-base font-bold text-text-primary"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Master Thumbnail Output
                </h3>
                <p className="text-xs text-text-secondary mt-0.5">
                  Rendered at native 1376x768 widescreen resolution with Gemini 3 Pro Image
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setShowTextOverlay(!showTextOverlay)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold border transition cursor-pointer flex items-center gap-1.5 ${
                    showTextOverlay
                      ? "bg-accent/10 border-accent text-accent"
                      : "bg-[var(--surface-sunken)] border-[var(--border)] text-text-secondary"
                  }`}
                >
                  <ViewIcon size={14} />
                  <span>{showTextOverlay ? "Overlay: ON" : "Clean Image"}</span>
                </button>

                <button
                  onClick={handleCopyClipboard}
                  className="px-3 py-2 rounded-xl bg-[var(--surface-sunken)] border border-[var(--border)] text-xs font-semibold text-text-secondary hover:text-text-primary transition cursor-pointer flex items-center gap-1.5"
                >
                  {copied ? <CheckmarkSquare03Icon size={14} className="text-emerald-500" /> : <Copy01Icon size={14} />}
                  <span>{copied ? "Copied" : "Copy"}</span>
                </button>

                <button
                  onClick={handleDownloadJpeg}
                  className="px-4 py-2 rounded-xl bg-[var(--surface-sunken)] border border-[var(--border)] text-xs font-bold text-text-primary hover:bg-[var(--surface)] transition cursor-pointer flex items-center gap-1.5"
                >
                  <DownloadSquare01Icon size={14} />
                  <span>JPEG</span>
                </button>

                <button
                  onClick={handleDownloadPng}
                  className="px-5 py-2 rounded-xl bg-accent text-white font-bold text-xs hover:brightness-110 active:scale-[0.98] transition cursor-pointer shadow-sm flex items-center gap-1.5"
                >
                  <DownloadSquare01Icon size={14} />
                  <span>Download PNG (1376x768)</span>
                </button>
              </div>
            </div>

            {/* Preview + Telemetry */}
            <div className="flex flex-col lg:flex-row gap-6 items-start">
              {/* Canvas Preview */}
              <div className="flex-1 w-full flex flex-col items-center justify-center p-3 rounded-2xl bg-black/95 border border-slate-800 shadow-2xl relative overflow-hidden">
                <canvas ref={canvasRef} className="hidden" />

                {imagePreviewUrl ? (
                  <div
                    className={`w-full relative overflow-hidden rounded-xl shadow-lg ${
                      aspectRatio === "16:9" ? "aspect-video max-w-3xl" : "aspect-[9/16] max-w-xs"
                    }`}
                  >
                    <img
                      src={imagePreviewUrl}
                      alt="Generated AI Thumbnail"
                      className="w-full h-full object-cover"
                    />
                    {aspectRatio === "16:9" && (
                      <>
                        <div className="absolute bottom-2 right-2 px-2.5 py-1 rounded-md bg-black/80 text-white font-mono text-[11px] font-bold">
                          10:24
                        </div>
                        <div className="absolute top-2 right-2 px-2.5 py-1 rounded-md bg-accent/90 text-white font-sans text-[10px] font-extrabold uppercase shadow-sm">
                          {thumbnail.predicted_ctr || "15.6%"} Predicted CTR
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="h-64 flex items-center justify-center text-xs text-slate-400">
                    Generate thumbnail to view preview
                  </div>
                )}
              </div>

              {/* Master Telemetry Panel */}
              <div className="w-full lg:w-80 flex flex-col gap-3">
                <div className="p-3.5 rounded-2xl bg-[var(--surface-sunken)] border border-[var(--border)] flex flex-col gap-2.5 text-xs">
                  <span className="font-bold text-text-primary uppercase tracking-wider text-[10px]">
                    Production Metadata
                  </span>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-text-secondary">Model</span>
                    <span className="font-bold text-text-primary">Gemini 3 Pro Image</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-text-secondary">Resolution</span>
                    <span className="font-bold font-mono text-text-primary">1376 x 768 px</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-text-secondary">Predicted CTR</span>
                    <span className="font-bold text-emerald-600 font-mono">{thumbnail.predicted_ctr}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-text-secondary">Visual Style</span>
                    <span className="font-bold text-text-primary">{thumbnail.style_name}</span>
                  </div>
                </div>

                {/* Prompt Inspector */}
                <div className="p-3.5 rounded-2xl bg-[var(--surface-sunken)] border border-[var(--border)] flex flex-col gap-1.5 text-xs">
                  <span className="font-bold text-text-primary uppercase tracking-wider text-[10px]">
                    Master Prompt (Gemini 3 Pro)
                  </span>
                  <p className="text-[11px] text-text-secondary font-mono leading-relaxed max-h-36 overflow-y-auto">
                    "{thumbnail.ai_image_prompt}"
                  </p>
                </div>
              </div>
            </div>
          </div>
        </ClayCard>
      )}

      {/* Empty State */}
      {!thumbnail && !generating && (
        <ClayCard>
          <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center">
              <SparkleIcon size={26} className="text-accent" />
            </div>
            <div>
              <h3 className="text-base font-bold text-text-primary" style={{ fontFamily: "var(--font-display)" }}>
                Generate Master Thumbnail
              </h3>
              <p className="text-xs text-text-secondary mt-1 max-w-md">
                Enter your video title and visual scene description above to generate the single definitive, high-CTR master thumbnail with Google Gemini 3 Pro Image.
              </p>
            </div>
          </div>
        </ClayCard>
      )}
    </div>
  )
}
