import React, { useState, useEffect } from "react"
import { useSearchParams, useLocation } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { ClayCard, StatusBadge } from "../components/clay"
import { api } from "../lib/api"
import {
  PencilEdit01Icon,
  SparkleIcon,
  CheckmarkSquare03Icon,
  VideoAiIcon,
  ViewIcon,
  ZapIcon
} from "../lib/icons"

export default function ScriptsStudio() {
  const [searchParams] = useSearchParams()
  const location = useLocation()

  const [topic, setTopic] = useState(() => {
    return searchParams.get("topic") || (location.state as any)?.topic || "How Autonomous AI Agents Are Transforming Software Engineering"
  })
  const [duration, setDuration] = useState(8)
  const [style, setStyle] = useState("engaging")
  const [formatType, setFormatType] = useState("long_form")
  const [generating, setGenerating] = useState(false)
  const [scriptData, setScriptData] = useState<any | null>(null)
  const [selectedHookId, setSelectedHookId] = useState<string>("h1")
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const passedTopic = searchParams.get("topic") || (location.state as any)?.topic
    if (passedTopic && passedTopic !== topic) {
      setTopic(passedTopic)
    }
  }, [searchParams, location])

  const handleGenerateScript = async () => {
    if (!topic.trim()) return
    setGenerating(true)
    try {
      const data = await api.generateScript(topic, duration, style, formatType)
      setScriptData(data)
      if (data?.hooks?.length > 0) {
        setSelectedHookId(data.hooks[0].id)
      }
    } catch (err) {
      console.error("Script generation error:", err)
    } finally {
      setGenerating(false)
    }
  }

  const handleCopyScript = () => {
    if (!scriptData?.beats) return
    const text = scriptData.beats
      .map((b: any) => `[${b.timestamp_range}] ${b.beat_title}\nVisual: ${b.visual_cue} (${b.camera_angle})\nDialogue: "${b.spoken_dialogue}"\n`)
      .join("\n")
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto">
      {/* Hero */}
      <div className="pt-2 pb-3 flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2 border-b border-[var(--border)]/60">
        <div>
          <h1 className="text-2xl sm:text-[30px] font-bold text-text-primary tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
            Script Architect
          </h1>
          <p className="mt-1.5 text-sm sm:text-[15px] text-text-secondary leading-relaxed">
            Generate 3-second viral hooks, retention curves, and scene teleprompters.
          </p>
        </div>
        <span className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-text-secondary bg-[var(--surface-sunken)] border border-[var(--border)]">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
          <span>Gemini 3.7 Flash</span>
        </span>
      </div>

      {/* Studio Header Card */}
      <ClayCard accent="var(--primary)">
        <div className="flex flex-col gap-5 p-2">

          {/* Form Controls */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-2">
            <div className="md:col-span-6">
              <label className="block text-xs font-semibold text-text-secondary mb-1">
                Video Topic / Core Question
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Why I stopped writing boilerplate code in 2026..."
                className="w-full px-4 py-2.5 rounded-xl bg-[var(--surface-sunken)] border border-[var(--border)] text-xs text-text-primary focus:outline-none focus:border-primary transition"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-text-secondary mb-1">
                Target Length
              </label>
              <select
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-xl bg-[var(--surface-sunken)] border border-[var(--border)] text-xs text-text-primary focus:outline-none focus:border-primary transition cursor-pointer"
              >
                <option value={3}>3 Minutes (Punchy)</option>
                <option value={5}>5 Minutes (Overview)</option>
                <option value={8}>8 Minutes (Standard)</option>
                <option value={12}>12 Minutes (Deep Dive)</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-text-secondary mb-1">
                Tone & Style
              </label>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[var(--surface-sunken)] border border-[var(--border)] text-xs text-text-primary focus:outline-none focus:border-primary transition cursor-pointer"
              >
                <option value="engaging">Engaging & Fast</option>
                <option value="educational">Educational & Clear</option>
                <option value="storytelling">Narrative / Story</option>
                <option value="contrarian">Bold & Contrarian</option>
              </select>
            </div>

            <div className="md:col-span-2 flex items-end">
              <button
                onClick={handleGenerateScript}
                disabled={generating}
                className="w-full py-2.5 px-4 rounded-xl bg-primary text-white font-bold text-xs hover:brightness-110 active:scale-[0.98] transition cursor-pointer shadow-sm flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {generating ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    <span>Writing Script...</span>
                  </>
                ) : (
                  <>
                    <SparkleIcon size={14} />
                    <span>Draft Script</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </ClayCard>

      {/* Script Results */}
      <AnimatePresence>
        {scriptData ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-6"
          >
            {/* 3-Second Viral Hook Selector */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-text-primary font-[var(--font-display)]">
                    3-Second Viral Hook Variations
                  </h3>
                  <p className="text-xs text-text-tertiary">
                    Select your opening hook. Each variation is engineered for maximum first-15-second viewer retention.
                  </p>
                </div>
                <StatusBadge type="approved" text={`Retention Score: ${scriptData.retention_score || 94}/100`} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {scriptData.hooks?.map((hook: any) => {
                  const isSelected = selectedHookId === hook.id
                  return (
                    <div
                      key={hook.id}
                      onClick={() => setSelectedHookId(hook.id)}
                      className={`p-4 rounded-2xl transition-all cursor-pointer flex flex-col justify-between gap-3 border ${
                        isSelected
                          ? "bg-indigo-50/50 border-primary shadow-sm"
                          : "bg-[var(--surface)] border-[var(--border)] hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                          {hook.hook_type}
                        </span>
                        <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                          {hook.predicted_retention}
                        </span>
                      </div>

                      <p className="text-xs font-semibold text-text-primary leading-relaxed italic">
                        "{hook.hook_text}"
                      </p>

                      <div className="pt-2 border-t border-[var(--border)] text-[11px] text-text-secondary flex items-center gap-1.5">
                        <span className="text-text-tertiary">Visual:</span>
                        <span className="truncate">{hook.visual_direction}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Timestamped Scene Teleprompter */}
            <ClayCard>
              <div className="flex flex-col gap-5 p-2">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-[var(--border)]">
                  <div>
                    <h3 className="text-base font-bold text-text-primary font-[var(--font-display)]">
                      Timestamped Video Script Breakdown
                    </h3>
                    <p className="text-xs text-text-tertiary">
                      {scriptData.beats?.length || 0} production beats with spoken audio, camera directions, and B-roll cues
                    </p>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={handleCopyScript}
                      className="px-4 py-1.5 rounded-xl bg-surface border border-[var(--border)] hover:bg-slate-50 text-xs font-semibold text-text-primary transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <CheckmarkSquare03Icon size={14} />
                      <span>{copied ? "Copied Script!" : "Copy Full Script"}</span>
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  {scriptData.beats?.map((beat: any, idx: number) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-[var(--surface-sunken)] border border-[var(--border)] flex flex-col md:flex-row gap-4"
                    >
                      {/* Left: Timing & Camera */}
                      <div className="md:w-56 shrink-0 flex flex-col gap-1.5 justify-between">
                        <div>
                          <span className="px-2.5 py-0.5 rounded-lg bg-indigo-100/70 text-primary font-mono text-[11px] font-bold">
                            {beat.timestamp_range}
                          </span>
                          <h4 className="font-bold text-text-primary text-xs mt-2">
                            {beat.beat_title}
                          </h4>
                        </div>
                        <div className="text-[11px] text-text-tertiary flex flex-col gap-1">
                          <span className="flex items-center gap-1">
                            <VideoAiIcon size={13} />
                            <span>{beat.camera_angle}</span>
                          </span>
                        </div>
                      </div>

                      {/* Right: Dialogue & Visuals */}
                      <div className="flex-1 flex flex-col gap-2.5">
                        <div className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
                          <p className="text-xs font-medium text-text-primary leading-relaxed">
                            "{beat.spoken_dialogue}"
                          </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-[11px] text-text-secondary">
                          <span className="flex items-center gap-1.5 text-text-secondary">
                            <span className="font-bold text-text-tertiary">Visual Cue:</span>
                            <span>{beat.visual_cue}</span>
                          </span>
                          {beat.b_roll_suggestion && (
                            <span className="flex items-center gap-1.5 text-indigo-600">
                              <span className="font-bold text-text-tertiary">B-Roll:</span>
                              <span>{beat.b_roll_suggestion}</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </ClayCard>
          </motion.div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center px-4 bg-[var(--surface)] rounded-3xl border border-[var(--border)]">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-primary flex items-center justify-center mb-3">
              <PencilEdit01Icon size={24} />
            </div>
            <h4 className="font-bold text-text-primary text-sm font-[var(--font-display)]">
              Ready to Draft Your Next Script
            </h4>
            <p className="text-xs text-text-secondary max-w-sm mt-1 leading-relaxed">
              Enter your video topic above and click <b>"Draft Script"</b>. Hook Architect agent will craft 3 retention-optimized hooks and a complete scene-by-scene script.
            </p>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
