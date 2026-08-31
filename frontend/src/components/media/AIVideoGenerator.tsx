import React, { useState, useEffect, useRef } from "react"
import { ClayCard } from "../clay"
import { api } from "../../lib/api"
import {
  SparkleIcon,
  DownloadSquare01Icon,
  ZapIcon,
  VideoAiIcon,
  Shield01Icon,
} from "../../lib/icons"

interface VeoModel {
  id: string
  name: string
  quality: string
  speed: string
  description: string
}

const STYLES = [
  { id: "cinematic", name: "Cinematic 8K", desc: "Volumetric lighting, shallow focus, anamorphic lens" },
  { id: "documentary", name: "Documentary", desc: "Realistic handheld, natural ambient lighting, candid framing" },
  { id: "sci-fi", name: "Sci-Fi Cyber", desc: "Holographic projections, neon contrast, futuristic aesthetic" },
  { id: "nature", name: "Nature Aerial", desc: "Sweeping drone pans, golden hour, wide landscape depth" },
  { id: "product", name: "Commercial Studio", desc: "Macro detail, turntable rotation, clean specular highlights" },
  { id: "abstract", name: "Artistic Motion", desc: "Dynamic light trails, stylized fluid motion, visual elegance" },
]

const DEFAULT_MODELS: Record<string, VeoModel> = {
  "veo-3.1-fast": { id: "veo-3.1-fast-generate-001", name: "Veo 3.1 Fast", quality: "Good", speed: "~60-90s", description: "Best balance of quality and speed" },
  "veo-3.1-lite": { id: "veo-3.1-lite-generate-001", name: "Veo 3.1 Lite", quality: "Standard", speed: "~30-60s", description: "Fastest generation, lighter quality" },
  "veo-3.1": { id: "veo-3.1-generate-001", name: "Veo 3.1", quality: "Highest", speed: "~2-3 min", description: "Maximum quality, cinematic output" },
  "veo-3.0-fast": { id: "veo-3.0-fast-generate-001", name: "Veo 3.0 Fast", quality: "Good", speed: "~60-90s", description: "Previous gen, reliable" },
  "veo-3.0": { id: "veo-3.0-generate-001", name: "Veo 3.0", quality: "High", speed: "~2-3 min", description: "Previous gen, high quality" },
  "veo-2.0": { id: "veo-2.0-generate-001", name: "Veo 2.0", quality: "Good", speed: "~1-2 min", description: "Stable, well-tested model" },
}

export const AIVideoGenerator: React.FC = () => {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [selectedStyle, setSelectedStyle] = useState("cinematic")
  const [aspectRatio, setAspectRatio] = useState<"16:9" | "9:16">("16:9")
  const [selectedModelKey, setSelectedModelKey] = useState("veo-3.1-fast")
  const [models, setModels] = useState<Record<string, VeoModel>>(DEFAULT_MODELS)

  const [generating, setGenerating] = useState(false)
  const [jobId, setJobId] = useState<string | null>(null)
  const [status, setStatus] = useState<"idle" | "processing" | "completed" | "failed">("idle")
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [promptUsed, setPromptUsed] = useState("")
  const [errorMsg, setErrorMsg] = useState("")
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [modelUsedName, setModelUsedName] = useState("")

  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)

  // Fetch available models on mount
  useEffect(() => {
    api.getVideoModels().then((data) => {
      if (data?.models) setModels(data.models)
    }).catch(() => {})
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current)
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  const handleGenerate = async () => {
    if (!title.trim()) return

    setGenerating(true)
    setStatus("processing")
    setVideoUrl(null)
    setErrorMsg("")
    setPromptUsed("")
    setElapsedSeconds(0)

    // Start elapsed timer
    timerRef.current = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1)
    }, 1000)

    try {
      const resp = await api.generateVideo(title, description, selectedStyle, aspectRatio, selectedModelKey)

      if (resp?.job_id) {
        setJobId(resp.job_id)
        setModelUsedName(resp.model_name || models[selectedModelKey]?.name || "")

        let consecutiveErrors = 0

        // Start polling
        pollingRef.current = setInterval(async () => {
          try {
            const statusResp = await api.getVideoStatus(resp.job_id)
            consecutiveErrors = 0

            if (statusResp?.status === "completed") {
              if (pollingRef.current) clearInterval(pollingRef.current)
              if (timerRef.current) clearInterval(timerRef.current)
              pollingRef.current = null
              timerRef.current = null

              setStatus("completed")
              setVideoUrl(api.getVideoDownloadUrl(resp.job_id))
              setPromptUsed(statusResp.prompt_used || "")
              setGenerating(false)
            } else if (statusResp?.status === "failed") {
              if (pollingRef.current) clearInterval(pollingRef.current)
              if (timerRef.current) clearInterval(timerRef.current)
              pollingRef.current = null
              timerRef.current = null

              setStatus("failed")
              setErrorMsg(statusResp.error || "Video generation failed")
              setGenerating(false)
            }
          } catch (e: any) {
            consecutiveErrors++
            if (consecutiveErrors >= 6) {
              if (pollingRef.current) clearInterval(pollingRef.current)
              if (timerRef.current) clearInterval(timerRef.current)
              pollingRef.current = null
              timerRef.current = null

              setStatus("failed")
              setErrorMsg(e?.message || "Connection to video service lost. Please retry.")
              setGenerating(false)
            }
          }
        }, 5000)
      }
    } catch (err: any) {
      if (timerRef.current) clearInterval(timerRef.current)
      timerRef.current = null
      setStatus("failed")
      setErrorMsg(err?.message || "Failed to start video generation")
      setGenerating(false)
    }
  }

  const handleDownload = () => {
    if (!videoUrl) return
    const link = document.createElement("a")
    link.href = videoUrl
    link.download = `${title.toLowerCase().replace(/[^a-z0-9]/g, "-").slice(0, 40) || "video"}.mp4`
    link.click()
  }

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60)
    const secs = s % 60
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`
  }

  const currentModel = models[selectedModelKey] || DEFAULT_MODELS["veo-3.1-fast"]

  return (
    <div className="flex flex-col gap-6">
      {/* ─── Input Studio ──────────────────────────────────────────────── */}
      <ClayCard accent="var(--accent)">
        <div className="flex flex-col gap-5 p-2">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-[var(--border)]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center font-bold">
                <VideoAiIcon size={22} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-text-primary tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
                    AI Video Generator
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-md bg-violet-50 text-violet-700 font-bold text-[10px] border border-violet-200">
                    Google Veo 3.1
                  </span>
                </div>
                <p className="text-xs text-text-secondary mt-0.5">
                  Generate 10-second high-definition video clips from scratch using Google's Veo foundation models
                </p>
              </div>
            </div>

            {/* Aspect Ratio */}
            <div className="flex items-center gap-1.5 bg-[var(--surface-sunken)] p-1 rounded-xl border border-[var(--border)] self-start sm:self-auto">
              <button
                onClick={() => setAspectRatio("16:9")}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  aspectRatio === "16:9" ? "bg-accent text-white shadow-2xs" : "text-text-secondary hover:text-text-primary"
                }`}
              >
                16:9 YouTube Widescreen
              </button>
              <button
                onClick={() => setAspectRatio("9:16")}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  aspectRatio === "9:16" ? "bg-accent text-white shadow-2xs" : "text-text-secondary hover:text-text-primary"
                }`}
              >
                9:16 Vertical Shorts
              </button>
            </div>
          </div>

          {/* Title & Description */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-text-primary uppercase tracking-wider">Video Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter title or main theme..."
                className="px-4 py-2.5 rounded-xl bg-[var(--surface-sunken)] border border-[var(--border)] text-xs text-text-primary focus:outline-none focus:border-accent transition"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-text-primary uppercase tracking-wider">Visual Scene Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe camera movement, environment, subject action, and lighting..."
                rows={2}
                className="px-4 py-2 rounded-xl bg-[var(--surface-sunken)] border border-[var(--border)] text-xs text-text-primary focus:outline-none focus:border-accent transition resize-none"
              />
            </div>
          </div>

          {/* Style Selector */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-text-primary uppercase tracking-wider">Visual Style Preset</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {STYLES.map((st) => (
                <button
                  key={st.id}
                  onClick={() => setSelectedStyle(st.id)}
                  className={`p-2.5 rounded-xl border text-left transition cursor-pointer flex flex-col gap-0.5 ${
                    selectedStyle === st.id
                      ? "bg-accent/10 border-accent text-accent font-bold"
                      : "bg-[var(--surface-sunken)] border-[var(--border)] text-text-secondary hover:text-text-primary"
                  }`}
                >
                  <div className="text-xs font-bold text-text-primary truncate">{st.name}</div>
                  <div className="text-[10px] text-text-tertiary truncate leading-tight">{st.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Model Selector */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-text-primary uppercase tracking-wider">Model Architecture & Speed Tier</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {Object.entries(models).map(([key, model]) => (
                <button
                  key={key}
                  onClick={() => setSelectedModelKey(key)}
                  className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                    selectedModelKey === key
                      ? "bg-violet-50 border-violet-400 shadow-xs"
                      : "bg-[var(--surface-sunken)] border-[var(--border)] hover:bg-[var(--surface)]"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-xs font-bold ${selectedModelKey === key ? "text-violet-700" : "text-text-primary"}`}>
                      {model.name}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold border ${
                        model.quality === "Highest" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                        model.quality === "High" ? "bg-blue-50 text-blue-700 border-blue-200" :
                        "bg-slate-50 text-slate-600 border-slate-200"
                      }`}>
                        {model.quality}
                      </span>
                      <span className="text-[9px] text-text-tertiary font-mono">{model.speed}</span>
                    </div>
                  </div>
                  <p className="text-[10px] text-text-secondary">{model.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={generating || !title.trim()}
            className="w-full py-3.5 rounded-xl bg-violet-600 text-white font-bold text-xs hover:bg-violet-700 active:scale-[0.98] transition cursor-pointer shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {generating ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                <span>Generating with {modelUsedName || currentModel.name}...</span>
              </>
            ) : (
              <>
                <ZapIcon size={14} />
                <span>Generate 10-Second AI Video Clip</span>
              </>
            )}
          </button>
        </div>
      </ClayCard>

      {/* ─── Processing State ──────────────────────────────────────────── */}
      {status === "processing" && (
        <ClayCard>
          <div className="flex flex-col items-center justify-center py-12 gap-5">
            {/* Animated spinner */}
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-3 border-violet-100 border-t-violet-600 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <VideoAiIcon size={24} className="text-violet-600" />
              </div>
            </div>

            <div className="text-center">
              <h3 className="text-base font-bold text-text-primary" style={{ fontFamily: "var(--font-display)" }}>
                Rendering Video Clip
              </h3>
              <p className="text-xs text-text-secondary mt-1">
                {modelUsedName || currentModel.name} is synthesizing video frames on Vertex AI
              </p>
            </div>

            {/* Progress info */}
            <div className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-violet-50 border border-violet-100 max-w-sm w-full">
              <div className="flex items-center justify-between w-full text-xs">
                <span className="text-violet-700 font-bold">Elapsed Time</span>
                <span className="font-mono text-violet-900 font-bold">{formatTime(elapsedSeconds)}</span>
              </div>
              <div className="flex items-center justify-between w-full text-xs">
                <span className="text-violet-700 font-bold">Expected Time</span>
                <span className="font-mono text-violet-600">{currentModel.speed}</span>
              </div>
              <div className="w-full bg-violet-200 rounded-full h-1.5 mt-1">
                <div
                  className="bg-violet-500 h-1.5 rounded-full transition-all duration-1000"
                  style={{ width: `${Math.min(95, (elapsedSeconds / 100) * 100)}%` }}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1 text-[11px] text-text-tertiary text-center font-mono">
              <span>Stage 1: Prompt engineered via Gemini 3.7 Flash</span>
              <span>Stage 2: {modelUsedName || "Veo 3.1"} rendering video frames on us-central1</span>
              <span>Polling status every 5 seconds</span>
            </div>
          </div>
        </ClayCard>
      )}

      {/* ─── Error State ───────────────────────────────────────────────── */}
      {status === "failed" && (
        <ClayCard>
          <div className="flex flex-col items-center justify-center py-10 gap-4">
            <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600 font-bold text-sm">
              !
            </div>
            <div className="text-center">
              <h3 className="text-base font-bold text-text-primary">Generation Incomplete</h3>
              <p className="text-xs text-red-500 mt-1 max-w-md">{errorMsg}</p>
              <p className="text-[11px] text-text-tertiary mt-2">Veo preview operations may occasionally require a retry.</p>
            </div>
            <button
              onClick={() => { setStatus("idle"); setGenerating(false); }}
              className="px-6 py-2 rounded-xl bg-accent text-white text-xs font-bold hover:brightness-110 transition cursor-pointer"
            >
              Retry Generation
            </button>
          </div>
        </ClayCard>
      )}

      {/* ─── Completed — Video Player & Download ───────────────────────── */}
      {status === "completed" && videoUrl && (
        <ClayCard>
          <div className="flex flex-col gap-5 p-2">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-[var(--border)]">
              <div>
                <h3 className="text-base font-bold text-text-primary" style={{ fontFamily: "var(--font-display)" }}>
                  Generated Video Clip
                </h3>
                <p className="text-xs text-text-secondary mt-0.5">
                  Completed in {formatTime(elapsedSeconds)} via {modelUsedName}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => { setStatus("idle"); setVideoUrl(null); setGenerating(false); }}
                  className="px-4 py-2 rounded-xl bg-[var(--surface-sunken)] border border-[var(--border)] text-xs font-bold text-text-secondary hover:text-text-primary transition cursor-pointer"
                >
                  New Generation
                </button>
                <button
                  onClick={handleDownload}
                  className="px-5 py-2 rounded-xl bg-violet-600 text-white font-bold text-xs hover:bg-violet-700 active:scale-[0.98] transition cursor-pointer shadow-sm flex items-center gap-1.5"
                >
                  <DownloadSquare01Icon size={14} />
                  <span>Download MP4</span>
                </button>
              </div>
            </div>

            {/* Video Player */}
            <div className="flex flex-col lg:flex-row gap-6 items-start">
              <div className="flex-1 w-full flex items-center justify-center p-3 rounded-2xl bg-black border border-slate-800 shadow-2xl">
                <div className={`w-full relative overflow-hidden rounded-xl ${
                  aspectRatio === "16:9" ? "aspect-video max-w-2xl" : "aspect-[9/16] max-w-xs"
                }`}>
                  <video
                    ref={videoRef}
                    src={videoUrl}
                    controls
                    autoPlay
                    loop
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>
              </div>

              {/* Info Panel */}
              <div className="w-full lg:w-72 flex flex-col gap-3">
                <div className="p-3 rounded-2xl bg-[var(--surface-sunken)] border border-[var(--border)] flex flex-col gap-2">
                  <span className="text-xs font-bold text-text-primary uppercase tracking-wider text-[10px]">Generation Metrics</span>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-text-secondary">Model</span>
                    <span className="font-bold text-text-primary">{modelUsedName}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-text-secondary">Clip Duration</span>
                    <span className="font-bold text-text-primary">10.0 seconds</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-text-secondary">Aspect Ratio</span>
                    <span className="font-bold text-text-primary">{aspectRatio}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-text-secondary">Render Time</span>
                    <span className="font-bold font-mono text-text-primary">{formatTime(elapsedSeconds)}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-text-secondary">Container</span>
                    <span className="font-bold text-text-primary">ISO MP4 (H.264)</span>
                  </div>
                </div>

                {promptUsed && (
                  <div className="p-3 rounded-2xl bg-[var(--surface-sunken)] border border-[var(--border)] flex flex-col gap-1.5">
                    <span className="text-xs font-bold text-text-primary uppercase tracking-wider text-[10px]">Cinematic Prompt</span>
                    <p className="text-[11px] text-text-secondary font-mono leading-relaxed max-h-32 overflow-y-auto">
                      "{promptUsed}"
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </ClayCard>
      )}

      {/* ─── Empty State ───────────────────────────────────────────────── */}
      {status === "idle" && !generating && (
        <ClayCard>
          <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-violet-50 flex items-center justify-center">
              <VideoAiIcon size={26} className="text-violet-600" />
            </div>
            <div>
              <h3 className="text-base font-bold text-text-primary" style={{ fontFamily: "var(--font-display)" }}>
                AI Video Synthesis
              </h3>
              <p className="text-xs text-text-secondary mt-1 max-w-md">
                Enter your video title and visual scene description to generate a real 10-second cinematic video clip using Google Veo foundation models.
              </p>
            </div>
          </div>
        </ClayCard>
      )}
    </div>
  )
}
