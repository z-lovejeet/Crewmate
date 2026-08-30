import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ClayCard, StatusBadge } from "../components/clay"
import { api } from "../lib/api"
import { useStudioStore } from "../store/useStudioStore"
import { useNavigate } from "react-router-dom"
import {
  Satellite01Icon,
  SparkleIcon,
  UserGroup03Icon,
  Calendar03Icon,
  CheckmarkSquare03Icon,
  ZapIcon,
  PencilEdit01Icon,
  Settings01Icon,
} from "../lib/icons"

export default function Distribution() {
  const navigate = useNavigate()
  const { channelProfile, personalizedIdeas, setPersonalizedIdeas } = useStudioStore()

  const [niche, setNiche] = useState(channelProfile.primaryNiche || "AI Coding & Tech Tutorials")
  const [scanningTrends, setScanningTrends] = useState(false)
  const [trendData, setTrendData] = useState<any | null>(null)
  const [loadingPersonalized, setLoadingPersonalized] = useState(false)

  const handleFetchPersonalized = async () => {
    setLoadingPersonalized(true)
    try {
      const data = await api.getPersonalizedIdeas(channelProfile.creatorName, channelProfile.primaryNiche)
      if (data?.ideas && data.ideas.length > 0) {
        setPersonalizedIdeas(data.ideas)
      }
    } catch (err) {
      console.error("Personalized ideas error:", err)
    } finally {
      setLoadingPersonalized(false)
    }
  }

  const handleScanTrends = async () => {
    setScanningTrends(true)
    try {
      const data = await api.scanTrends(niche, "youtube")
      setTrendData(data)
    } catch (err) {
      console.error("Trend scan error:", err)
    } finally {
      setScanningTrends(false)
    }
  }

  const handleDraftScript = (ideaTitle: string) => {
    if (!ideaTitle) {
      navigate("/scripts")
      return
    }
    navigate(`/scripts?topic=${encodeURIComponent(ideaTitle)}`, { state: { topic: ideaTitle } })
  }

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto">
      {/* Hero */}
      <div className="pt-1 pb-2">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-[28px] font-bold text-text-primary tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
              Trends & Strategy
            </h1>
            <p className="mt-1.5 text-[15px] text-text-secondary max-w-xl">
              Content ideas personalized for <span className="font-semibold text-text-primary">{channelProfile.channelName}</span> based on
              your niche, audience, and past performance.
            </p>
          </div>
          <button
            onClick={() => navigate("/channel")}
            className="mt-1 px-3 py-1.5 rounded-lg text-xs font-medium text-text-tertiary hover:text-primary border border-transparent hover:border-[var(--border)] transition cursor-pointer shrink-0"
          >
            Edit profile →
          </button>
        </div>
      </div>

      {/* ─── 1. Personalized Ideas Tailored to Creator ──────────────────── */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <SparkleIcon size={22} />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-text-primary tracking-tight font-[var(--font-display)]">
                Personalized Content Recommendations
              </h2>
              <p className="text-xs text-text-tertiary">
                Agent 10 & 09 · Tailored to your channel history, viewer demographics, and highest-retention formats
              </p>
            </div>
          </div>
          <button
            onClick={handleFetchPersonalized}
            disabled={loadingPersonalized}
            className="px-4 py-2 rounded-xl bg-surface border border-[var(--border)] hover:bg-slate-50 text-xs font-semibold text-text-primary transition flex items-center gap-1.5 cursor-pointer self-start sm:self-auto shadow-2xs"
          >
            <SparkleIcon size={14} />
            <span>{loadingPersonalized ? "Refreshing Ideas..." : "Refresh Channel Ideas"}</span>
          </button>
        </div>

        {/* Clean, Modern 3-Column Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {personalizedIdeas.map((idea, idx) => {
            const matchScore = idea.match_score || (idea as any).creator_match_score || 95
            const title = idea.title || (idea as any).topic || "Autonomous Agent Architecture"
            const format = idea.format || "Deep-Dive Tutorial"
            const duration = idea.duration || "15 Min"
            const viralAngle = idea.viral_angle || "Actionable technical breakdown"
            const hookTeaser = idea.hook_teaser || "Here is the exact framework to build autonomous agents."
            const predictedViews = idea.predicted_views || (idea as any).predicted_reach || "150K+ views"

            return (
              <div
                key={idea.id || idx}
                className="p-5 rounded-3xl bg-[var(--surface)] border border-[var(--border)] hover:border-primary/40 transition-all shadow-xs flex flex-col justify-between gap-4 group"
              >
                <div className="flex flex-col gap-3">
                  {/* Top Badge Bar with clean separation */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-1 rounded-lg text-[11px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 shrink-0">
                      {matchScore}% Match
                    </span>
                    <span className="text-[11px] font-semibold text-text-tertiary truncate max-w-[170px] text-right">
                      {duration} · {format}
                    </span>
                  </div>

                  {/* Title & Viral Angle */}
                  <div>
                    <h4 className="font-bold text-text-primary text-sm font-[var(--font-display)] leading-snug group-hover:text-primary transition-colors line-clamp-2">
                      {title}
                    </h4>
                    <p className="text-xs text-text-secondary mt-2 leading-relaxed">
                      <span className="font-bold text-text-tertiary">Viral Angle:</span> {viralAngle}
                    </p>
                  </div>

                  {/* Opening Hook Teaser */}
                  <div className="p-3.5 rounded-2xl bg-[var(--surface-sunken)] border border-[var(--border)] flex flex-col gap-1 text-[11px]">
                    <span className="font-bold text-primary flex items-center gap-1">
                      <PencilEdit01Icon size={12} />
                      <span>Opening Hook Teaser:</span>
                    </span>
                    <p className="text-text-primary italic leading-relaxed">"{hookTeaser}"</p>
                  </div>
                </div>

                {/* Footer with Views & Action Button */}
                <div className="pt-3 border-t border-[var(--border)] flex items-center justify-between gap-2">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-text-tertiary font-medium">Est. Reach</span>
                    <span className="text-xs font-bold text-text-primary">{predictedViews}</span>
                  </div>

                  <button
                    onClick={() => handleDraftScript(title)}
                    className="px-3.5 py-1.5 rounded-xl bg-primary-pale text-primary text-xs font-bold hover:bg-primary hover:text-white transition cursor-pointer flex items-center gap-1 shadow-2xs"
                  >
                    <span>Draft Script</span>
                    <span>→</span>
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ─── 2. Breakout Trend Radar Scanner ────────────────────────────── */}
      <ClayCard>
        <div className="flex flex-col gap-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-[var(--border)]">
            <div>
              <h3 className="text-base font-bold text-text-primary font-[var(--font-display)] flex items-center gap-2">
                <Satellite01Icon size={18} />
                <span>Niche Breakout Trend Radar</span>
              </h3>
              <p className="text-xs text-text-tertiary">
                Agent 10 · Live algorithmic search velocity scanning across YouTube tech keywords
              </p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                placeholder="Enter your content niche..."
                className="px-3.5 py-1.5 rounded-xl bg-[var(--surface-sunken)] border border-[var(--border)] text-xs text-text-primary focus:outline-none focus:border-primary"
              />
              <button
                onClick={handleScanTrends}
                disabled={scanningTrends}
                className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:brightness-110 disabled:opacity-60 transition cursor-pointer flex items-center gap-1.5 shrink-0 shadow-xs"
              >
                {scanningTrends ? (
                  <>
                    <span className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    <span>Scanning Radar...</span>
                  </>
                ) : (
                  <>
                    <ZapIcon size={13} />
                    <span>Scan Velocity</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {(() => {
            const rawList = trendData?.briefs || trendData?.topics || []
            if (!rawList || rawList.length === 0) {
              return (
                <div className="p-8 rounded-2xl bg-[var(--surface-sunken)] border border-dashed border-[var(--border)] text-center text-xs text-text-tertiary flex flex-col items-center justify-center gap-2">
                  <Satellite01Icon size={24} className="text-primary/60" />
                  <p>
                    Click <b>"Scan Velocity"</b> to run Gemini 3.7 Flash trend discovery across <b>{niche}</b>.
                  </p>
                </div>
              )
            }

            return (
              <div className="flex flex-col gap-4">
                {trendData.trend_summary && (
                  <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-100 text-xs text-indigo-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <p className="leading-relaxed">
                      <strong className="font-bold text-primary">Strategic Niche Outlook:</strong> {trendData.trend_summary}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {rawList.map((t: any, idx: number) => {
                    const title = t.title_concept || t.topic || "Breakout Trend Concept"
                    const velocity = t.velocity_score || 92
                    const saturation = t.saturation_score || t.saturation || "Low"
                    const formatRec = t.format || t.format_rec || "Long-Form Video"
                    const hook = t.viral_hook || t.hook || ""

                    return (
                      <div
                        key={idx}
                        className="p-5 rounded-2xl bg-[var(--surface-sunken)] border border-[var(--border)] hover:border-primary/40 transition flex flex-col justify-between gap-3 shadow-2xs group"
                      >
                        <div className="flex flex-col gap-2.5">
                          <div className="flex items-center justify-between gap-1">
                            <span className="px-2 py-0.5 rounded-md bg-indigo-100/80 text-primary text-[10px] font-extrabold border border-indigo-200 shrink-0">
                              Velocity: {velocity}/100
                            </span>
                            <span className="text-[10px] font-semibold text-text-tertiary truncate max-w-[150px] text-right">
                              {saturation}
                            </span>
                          </div>

                          <h4 className="text-xs font-bold text-text-primary leading-snug group-hover:text-primary transition-colors">
                            {title}
                          </h4>

                          {hook && (
                            <div className="p-2.5 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-[11px] text-text-secondary leading-relaxed italic">
                              "{hook}"
                            </div>
                          )}
                        </div>

                        <div className="pt-2.5 border-t border-[var(--border)] flex items-center justify-between text-[11px] text-text-tertiary gap-2">
                          <span className="truncate text-[10px] font-medium">{formatRec}</span>
                          <button
                            onClick={() => handleDraftScript(title)}
                            className="px-2.5 py-1 rounded-lg bg-primary-pale text-primary font-bold hover:bg-primary hover:text-white transition cursor-pointer shrink-0 text-xs flex items-center gap-1 shadow-2xs"
                          >
                            <span>Script Hook</span>
                            <span>→</span>
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })()}
        </div>
      </ClayCard>
    </div>
  )
}
