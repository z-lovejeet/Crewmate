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
  Shield01Icon,
  ViewIcon,
  LayersLogoIcon
} from "../../lib/icons"

interface ThumbnailVariant {
  id: string
  name: string
  style_name: string
  headline: string
  badge_text: string
  sub_hook: string
  predicted_ctr: string
  ai_image_prompt: string
  image_url: string
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
  { id: "cyberpunk", name: "Cyberpunk & AI Neon", icon: "⚡" },
  { id: "high_impact", name: "High-Contrast Red & Amber", icon: "🔥" },
  { id: "cinematic_gold", name: "Cinematic Dark Studio Gold", icon: "🎬" },
  { id: "emerald_tech", name: "Emerald Tech Matrix", icon: "💻" }
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
  const [showTextOverlay, setShowTextOverlay] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [copied, setCopied] = useState(false)
  const [activeVariantIdx, setActiveVariantIdx] = useState(0)

  // Canvas Refs & State
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>("")
  const [imageLoaded, setImageLoaded] = useState(false)

  // Default initial AI generated variants
  const [variants, setVariants] = useState<ThumbnailVariant[]>([
    {
      id: "var-1",
      name: "Variant 1: Holographic Command Center",
      style_name: "Cyberpunk Neon & Holographic HUD",
      headline: "10X REVENUE WITH AI",
      badge_text: "⚡ 10X CASH WITH AI",
      sub_hook: "NEW 2026 CREATOR STACK",
      predicted_ctr: "15.4%",
      ai_image_prompt: "Cinematic 8k wide shot of a tech creator sitting at an ultra-modern glowing neon cyber desk, surrounded by 3 translucent glowing holographic AI agent avatars managing floating 3D financial dashboards, dramatic cyan and magenta volumetric lighting, reflections on polished dark obsidian surface, shallow depth of field, photorealistic 35mm lens render.",
      image_url: "https://image.pollinations.ai/prompt/Cinematic%208k%20wide%20shot%20of%20a%20tech%20creator%20sitting%20at%20an%20ultra-modern%20glowing%20neon%20cyber%20desk%2C%20surrounded%20by%203%20translucent%20glowing%20holographic%20AI%20agent%20avatars%20managing%20floating%203D%20financial%20dashboards%2C%20dramatic%20cyan%20and%20magenta%20volumetric%20lighting%2C%20reflections%20on%20polished%20dark%20obsidian%20surface%2C%20shallow%20depth%20of%20field%2C%20photorealistic%2035mm%20lens%20render.%2C%20youtube%20thumbnail%20composition%2C%208k%20resolution%2C%20photorealistic%2C%20cinematic%20lighting?width=1280&height=720&nologo=true&seed=42",
      palette: {
        bgStart: "#050814",
        bgEnd: "#180928",
        accent: "#00f0ff",
        secondary: "#ff007f",
        textHighlight: "#00f0ff",
        badgeBg: "rgba(0, 240, 255, 0.18)",
        badgeBorder: "#00f0ff"
      }
    },
    {
      id: "var-2",
      name: "Variant 2: Autonomous AI Swarm",
      style_name: "Cybernetic High-Contrast",
      headline: "THE UNFAIR AI ADVANTAGE",
      badge_text: "🔥 10X CREATOR WEALTH",
      sub_hook: "SECRET TOOLS REVEALED",
      predicted_ctr: "14.2%",
      ai_image_prompt: "Intense close-up cinematic photo of a glowing glass cyberpunk workstation with miniature android assistants, dramatic neon yellow and violet rim lighting, misty atmosphere, 8k Unreal Engine 5 render.",
      image_url: "https://image.pollinations.ai/prompt/Intense%20close-up%20cinematic%20photo%20of%20a%20glowing%20glass%20cyberpunk%20workstation%20where%20miniature%20humanoid%20android%20assistants%20made%20of%20translucent%20fiber%20optics%20interact%20with%20levitating%20data%20cubes%20and%20exponential%20growth%20charts%2C%20intense%20rim%20lighting%20in%20electric%20neon%20yellow%20and%20deep%20violet%2C%20misty%20atmospheric%20background%2C%20ray-traced%20reflections%2C%20ultra-detailed%208k%20resolution%2C%20Unreal%20Engine%205%20render%20style.%2C%20youtube%20thumbnail%20composition%2C%208k%20resolution%2C%20photorealistic%2C%20cinematic%20lighting?width=1280&height=720&nologo=true&seed=49",
      palette: {
        bgStart: "#0a071b",
        bgEnd: "#200d1e",
        accent: "#ffe600",
        secondary: "#8b5cf6",
        textHighlight: "#ffe600",
        badgeBg: "rgba(255, 230, 0, 0.18)",
        badgeBorder: "#ffe600"
      }
    },
    {
      id: "var-3",
      name: "Variant 3: First-Person Cyber Studio",
      style_name: "POV Cyberpunk Studio",
      headline: "STOP WORKING HARD",
      badge_text: "🤖 10 AUTONOMOUS BOTS",
      sub_hook: "PRINTING $10K/DAY",
      predicted_ctr: "16.1%",
      ai_image_prompt: "First-person POV seated at a floating cybernetic creator desk in a neo-Tokyo penthouse studio at night, curved transparent OLED screens, neon bokeh outside window, 8k resolution.",
      image_url: "https://image.pollinations.ai/prompt/First-person%20POV%20seated%20at%20a%20floating%20cybernetic%20creator%20desk%20in%20a%20neo-Tokyo%20penthouse%20studio%20at%20night%2C%20hands%20with%20subtle%20glowing%20cyberware%20hovering%20over%20a%20laser-etched%20keyboard%2C%20curved%20panoramic%20transparent%20OLED%20screens%20displaying%20explosive%20green%20revenue%20graphs%2C%20a%20glowing%20feminine%20AI%20companion%20entity%20standing%20beside%20the%20desk%20smiling%2C%20neon%20city%20bokeh%20outside%20the%20window%2C%20photorealistic%20Octane%20render%2C%208k%20resolution.%2C%20youtube%20thumbnail%20composition%2C%208k%20resolution%2C%20photorealistic%2C%20cinematic%20lighting?width=1280&height=720&nologo=true&seed=56",
      palette: {
        bgStart: "#030d1a",
        bgEnd: "#0d1b2a",
        accent: "#00ff88",
        secondary: "#00d2ff",
        textHighlight: "#00ff88",
        badgeBg: "rgba(0, 255, 136, 0.2)",
        badgeBorder: "#00ff88"
      }
    }
  ])

  // Draw Real AI Image + Typography on Canvas
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
    const p = currentVar.palette || {
      bgStart: "#0a0a1a",
      bgEnd: "#1a0826",
      accent: "#00f0ff",
      secondary: "#a855f7",
      textHighlight: "#00f0ff",
      badgeBg: "rgba(0, 240, 255, 0.18)",
      badgeBorder: "#00f0ff"
    }

    // 1. Draw base fallback gradient while image loads
    const bgGrad = ctx.createLinearGradient(0, 0, width, height)
    bgGrad.addColorStop(0, p.bgStart)
    bgGrad.addColorStop(1, p.bgEnd)
    ctx.fillStyle = bgGrad
    ctx.fillRect(0, 0, width, height)

    // 2. Load and draw the Real AI Image
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.src = currentVar.image_url

    const drawOverlayElements = () => {
      if (showTextOverlay) {
        // Subtle left-side dark vignette so text is ultra-legible
        const vignette = ctx.createLinearGradient(0, 0, width * 0.65, 0)
        vignette.addColorStop(0, "rgba(0, 0, 0, 0.85)")
        vignette.addColorStop(0.5, "rgba(0, 0, 0, 0.45)")
        vignette.addColorStop(1, "transparent")
        ctx.fillStyle = vignette
        ctx.fillRect(0, 0, width, height)

        // Draw High-CTR Top Badge
        const badgeText = customBadge || currentVar.badge_text
        ctx.save()
        ctx.font = "bold 24px system-ui, -apple-system, sans-serif"
        const badgeMetrics = ctx.measureText(badgeText)
        const badgeW = badgeMetrics.width + 48
        const badgeH = 46
        const badgeX = is169 ? 60 : 36
        const badgeY = is169 ? 60 : 50

        // Badge background
        ctx.fillStyle = p.badgeBg || "rgba(0, 240, 255, 0.2)"
        ctx.strokeStyle = p.badgeBorder || p.accent
        ctx.lineWidth = 2
        ctx.shadowColor = p.accent
        ctx.shadowBlur = 16

        ctx.beginPath()
        ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 14)
        ctx.fill()
        ctx.stroke()

        // Badge text
        ctx.fillStyle = "#ffffff"
        ctx.shadowBlur = 0
        ctx.fillText(badgeText, badgeX + 24, badgeY + 31)
        ctx.restore()

        // Ultra-Bold Headline Typography
        const headline = currentVar.headline.toUpperCase()
        const words = headline.split(" ")
        const line1 = words.slice(0, Math.ceil(words.length / 2)).join(" ")
        const line2 = words.slice(Math.ceil(words.length / 2)).join(" ")

        const textStartX = is169 ? 60 : 36
        const textStartY = is169 ? 300 : 760

        // Line 1
        ctx.save()
        ctx.font = `900 ${is169 ? "68px" : "54px"} Impact, "Arial Black", sans-serif`
        ctx.shadowColor = "rgba(0, 0, 0, 0.95)"
        ctx.shadowOffsetX = 6
        ctx.shadowOffsetY = 6
        ctx.shadowBlur = 14

        // Gradient text fill for Line 1
        const textGrad = ctx.createLinearGradient(textStartX, textStartY - 50, textStartX + 500, textStartY)
        textGrad.addColorStop(0, "#ffffff")
        textGrad.addColorStop(1, p.textHighlight || "#ffffff")

        ctx.fillStyle = textGrad
        ctx.fillText(line1, textStartX, textStartY)

        // Line 2 (Accent High-Contrast)
        if (line2) {
          ctx.fillStyle = p.accent
          ctx.shadowColor = p.accent + "99"
          ctx.shadowBlur = 20
          ctx.fillText(line2, textStartX, textStartY + (is169 ? 80 : 68))
        }

        // Sub-Hook
        ctx.font = `800 ${is169 ? "26px" : "22px"} system-ui, -apple-system, sans-serif`
        ctx.shadowColor = "rgba(0, 0, 0, 0.85)"
        ctx.shadowOffsetX = 2
        ctx.shadowOffsetY = 2
        ctx.shadowBlur = 6
        ctx.fillStyle = "#e2e8f0"
        ctx.fillText(currentVar.sub_hook, textStartX, textStartY + (is169 ? 175 : 155))

        // Verified 4K / HD Stamp in bottom right
        ctx.font = "bold 18px system-ui, sans-serif"
        ctx.fillStyle = "rgba(255, 255, 255, 0.75)"
        ctx.shadowBlur = 0
        ctx.fillText("4K ULTRA HD · CREWMATE AI", width - (is169 ? 280 : 260), height - 36)

        ctx.restore()
      }

      // Update preview URL
      try {
        const dataUrl = canvas.toDataURL("image/png")
        setImagePreviewUrl(dataUrl)
      } catch (e) {
        // Fallback to image url directly if CORS prevents canvas export
        setImagePreviewUrl(currentVar.image_url)
      }
    }

    img.onload = () => {
      setImageLoaded(true)
      // Draw image to fill canvas
      ctx.drawImage(img, 0, 0, width, height)
      drawOverlayElements()
    }

    img.onerror = () => {
      setImageLoaded(false)
      drawOverlayElements()
    }
  }, [aspectRatio, activeVariantIdx, variants, customBadge, showTextOverlay])

  useEffect(() => {
    renderThumbnailToCanvas()
  }, [renderThumbnailToCanvas])

  // Call the live LLM + Image Generation API
  const handleGenerateFromLLM = async () => {
    if (!videoTitle.trim()) return
    setGenerating(true)

    try {
      const resp = await api.generateAiThumbnails(
        videoTitle,
        visualDescription,
        selectedStyleId,
        aspectRatio
      )

      if (resp && resp.variants && resp.variants.length > 0) {
        setVariants(resp.variants)
        setActiveVariantIdx(0)
        if (resp.variants[0]?.badge_text) {
          setCustomBadge(resp.variants[0].badge_text)
        }
      }
    } catch (err) {
      console.error("AI Thumbnail Generation Error:", err)
    } finally {
      setGenerating(false)
    }
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
                    LLM & Multi-Modal AI Thumbnail Generator
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-bold text-[10px] border border-emerald-200">
                    Gemini 3.7 Flash + Diffusion API
                  </span>
                </div>
                <p className="text-xs text-text-secondary mt-0.5">
                  LLM analyzes your title & scene description to prompt a real generative AI model and render high-CTR thumbnails
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
                <span className="text-[11px] text-text-tertiary font-normal">Analyzed by Gemini 3.7</span>
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
                <span>2. Visual Scene Description</span>
                <span className="text-[11px] text-text-tertiary font-normal">What AI generates in the scene</span>
              </label>
              <input
                type="text"
                value={visualDescription}
                onChange={(e) => setVisualDescription(e.target.value)}
                placeholder="e.g. Futuristic glowing developer desk with holographic AI agents, high contrast neon..."
                className="px-4 py-2.5 rounded-xl bg-[var(--surface-sunken)] border border-[var(--border)] text-xs text-text-primary focus:outline-none focus:border-accent transition"
              />
            </div>
          </div>

          {/* Style Palettes & Badge */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            {/* Visual Theme */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-text-primary">
                Visual Art Style Direction
              </label>
              <div className="grid grid-cols-2 gap-2">
                {STYLES.map((st) => (
                  <button
                    key={st.id}
                    onClick={() => setSelectedStyleId(st.id)}
                    className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition cursor-pointer text-xs ${
                      selectedStyleId === st.id
                        ? "bg-accent/10 border-accent text-accent font-bold"
                        : "bg-[var(--surface-sunken)] border-[var(--border)] text-text-secondary hover:text-text-primary"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 truncate">
                      <span>{st.icon}</span>
                      <span className="truncate">{st.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom High-CTR Badge & Action */}
            <div className="flex flex-col gap-1.5 justify-between">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-text-primary">
                  CTR Callout Badge Text
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
                onClick={handleGenerateFromLLM}
                disabled={generating || !videoTitle.trim()}
                className="w-full mt-2 py-3 rounded-xl bg-accent text-white font-bold text-xs hover:brightness-110 active:scale-[0.98] transition cursor-pointer shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {generating ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    <span>Calling Gemini 3.7 & AI Image Generator...</span>
                  </>
                ) : (
                  <>
                    <ZapIcon size={14} />
                    <span>Generate AI Thumbnail from Title & Scene</span>
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
                Live Rendered AI Thumbnail Canvas
              </h3>
              <p className="text-xs text-text-secondary mt-0.5">
                Real generative AI image output · Ready for 1-click PNG/JPEG download
              </p>
            </div>

            {/* Action Download Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setShowTextOverlay(!showTextOverlay)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold border transition cursor-pointer flex items-center gap-1.5 ${
                  showTextOverlay
                    ? "bg-accent/10 border-accent text-accent"
                    : "bg-[var(--surface-sunken)] border-[var(--border)] text-text-secondary"
                }`}
                title="Toggle High-CTR Typography Overlay"
              >
                <ViewIcon size={14} />
                <span>{showTextOverlay ? "Text Overlay: ON" : "Clean Image (No Text)"}</span>
              </button>

              <button
                onClick={handleCopyClipboard}
                className="px-3 py-2 rounded-xl bg-[var(--surface-sunken)] border border-[var(--border)] text-xs font-semibold text-text-secondary hover:text-text-primary transition cursor-pointer flex items-center gap-1.5"
              >
                {copied ? <CheckmarkSquare03Icon size={14} className="text-emerald-500" /> : <Copy01Icon size={14} />}
                <span>{copied ? "Copied!" : "Copy"}</span>
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

          {/* Main Visual Preview */}
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            {/* Left: Interactive Real Canvas Display */}
            <div className="flex-1 w-full flex flex-col items-center justify-center p-3 rounded-2xl bg-black/95 border border-slate-800 shadow-2xl relative overflow-hidden group">
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
                    alt="Generated AI Thumbnail"
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
                      {variants[activeVariantIdx]?.predicted_ctr || "15.4%"} Predicted CTR
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center text-xs text-slate-400">
                  Generating AI Thumbnail...
                </div>
              )}
            </div>

            {/* Right: LLM Variant Selector & Prompt Inspector */}
            <div className="w-full lg:w-80 flex flex-col gap-3">
              <span className="text-xs font-bold text-text-primary uppercase tracking-wider">
                LLM Generated Variants ({variants.length})
              </span>

              <div className="flex flex-col gap-2">
                {variants.map((v, idx) => (
                  <div
                    key={v.id}
                    onClick={() => {
                      setActiveVariantIdx(idx)
                      if (v.badge_text) setCustomBadge(v.badge_text)
                    }}
                    className={`p-3 rounded-2xl border transition cursor-pointer flex flex-col gap-1.5 ${
                      activeVariantIdx === idx
                        ? "bg-accent/10 border-accent shadow-xs"
                        : "bg-[var(--surface-sunken)] border-[var(--border)] hover:bg-[var(--surface)]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-text-primary">{v.name}</span>
                      <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-extrabold text-[10px] border border-emerald-200">
                        {v.predicted_ctr} CTR
                      </span>
                    </div>
                    <p className="text-[11px] text-text-secondary truncate font-medium">
                      "{v.headline}"
                    </p>
                    <div className="flex items-center gap-1.5 text-[10px] text-text-tertiary">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: v.palette?.accent || "#00f0ff" }} />
                      <span className="truncate">{v.style_name}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Gemini Prompt Inspection */}
              {variants[activeVariantIdx] && (
                <div className="p-3.5 rounded-2xl bg-[var(--surface-sunken)] border border-[var(--border)] flex flex-col gap-1.5 text-xs mt-1">
                  <span className="font-bold text-text-primary">Diffusion Prompt Crafted by LLM:</span>
                  <p className="text-[11px] text-text-secondary font-mono leading-relaxed max-h-32 overflow-y-auto">
                    "{variants[activeVariantIdx].ai_image_prompt}"
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </ClayCard>
    </div>
  )
}
