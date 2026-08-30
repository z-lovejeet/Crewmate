import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ClayCard, StatusBadge } from "../components/clay"
import { useStudioStore, type ChannelProfile as ProfileType } from "../store/useStudioStore"
import { api } from "../lib/api"
import {
  AiBrain01Icon,
  SparkleIcon,
  CheckmarkSquare03Icon,
  Settings01Icon,
  UserGroup03Icon,
  Cash02Icon,
  VideoAiIcon,
  Satellite01Icon,
  PencilEdit01Icon,
  DocumentAttachmentIcon,
} from "../lib/icons"
import { useNavigate } from "react-router-dom"

export default function ChannelProfile() {
  const navigate = useNavigate()
  const { channelProfile, updateChannelProfile, setPersonalizedIdeas } = useStudioStore()

  const [form, setForm] = useState<ProfileType>(channelProfile)
  const [saving, setSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  const handleChange = (field: keyof ProfileType, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setSaveSuccess(false)
    setSaveError(null)

    try {
      // 1. Update persistent local Zustand store
      updateChannelProfile(form)

      // 2. Sync with Firestore Memory Bank
      await api.updateMemory({
        creator_preferences: {
          channel_name: form.channelName,
          creator_name: form.creatorName,
          primary_niche: form.primaryNiche,
          target_audience: form.targetAudience,
          audience_level: form.audienceLevel,
          creator_tone: form.creatorTone,
          deal_floor: form.minSponsorshipFloor,
          cadence: form.publishingCadence,
          custom_rules: form.customDirectives,
        },
      })

      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 6000)

      // 3. Fetch fresh ideas in background (non-blocking)
      api.getPersonalizedIdeas(form.creatorName, form.primaryNiche)
        .then((ideasRes) => {
          if (ideasRes?.ideas) setPersonalizedIdeas(ideasRes.ideas)
        })
        .catch(() => {})
    } catch (err) {
      console.error("Save profile error:", err)
      setSaveError("Failed to sync with Fleet Memory. Your local changes are saved — try again to sync with cloud.")
      setTimeout(() => setSaveError(null), 8000)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto">
      {/* Hero */}
      <div className="pt-1 pb-2">
        <h1 className="text-[28px] font-bold text-text-primary tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
          Channel DNA
        </h1>
        <p className="mt-1.5 text-[15px] text-text-secondary">
          Define your niche, audience, and deal rules — all 14 agents adapt to this profile.
        </p>
      </div>

      {/* Save Feedback */}
      <AnimatePresence>
        {saveSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-between shadow-xs"
          >
            <div className="flex items-center gap-2">
              <CheckmarkSquare03Icon size={16} />
              <span>Channel DNA synced to all 14 Fleet Agents in Google Cloud Firestore!</span>
            </div>
            <button
              onClick={() => navigate("/trends")}
              className="px-3 py-1 rounded-xl bg-emerald-600 text-white font-bold hover:brightness-110 transition cursor-pointer"
            >
              View Trends →
            </button>
          </motion.div>
        )}
        {saveError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2 shadow-xs"
          >
            <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
            <span>{saveError}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSave} className="flex flex-col gap-6">
        {/* Section 1: Channel DNA & Core Focus */}
        <ClayCard>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 pb-2 border-b border-[var(--border)]">
              <VideoAiIcon size={18} className="text-primary" />
              <h3
                className="text-base font-bold text-text-primary"
                style={{ fontFamily: "var(--font-display)" }}
              >
                1. Channel Core DNA & Brand Identity
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1">
                  Channel Name
                </label>
                <input
                  type="text"
                  value={form.channelName}
                  onChange={(e) => handleChange("channelName", e.target.value)}
                  placeholder="e.g. Alex Rivera Tech"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface-sunken)] border border-[var(--border)] text-xs text-text-primary focus:outline-none focus:border-primary transition"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1">
                  Creator / Host Name
                </label>
                <input
                  type="text"
                  value={form.creatorName}
                  onChange={(e) => handleChange("creatorName", e.target.value)}
                  placeholder="e.g. Alex Rivera"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface-sunken)] border border-[var(--border)] text-xs text-text-primary focus:outline-none focus:border-primary transition"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1">
                  Primary Niche
                </label>
                <input
                  type="text"
                  value={form.primaryNiche}
                  onChange={(e) => handleChange("primaryNiche", e.target.value)}
                  placeholder="e.g. AI Engineering & Software Architecture"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface-sunken)] border border-[var(--border)] text-xs text-text-primary focus:outline-none focus:border-primary transition"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1">
                  Subscribers / Community Size
                </label>
                <input
                  type="text"
                  value={form.subscribers}
                  onChange={(e) => handleChange("subscribers", e.target.value)}
                  placeholder="e.g. 145,000"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface-sunken)] border border-[var(--border)] text-xs text-text-primary focus:outline-none focus:border-primary transition"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-text-secondary mb-1">
                  Secondary Topics & Core Technologies
                </label>
                <input
                  type="text"
                  value={form.secondaryTopics}
                  onChange={(e) => handleChange("secondaryTopics", e.target.value)}
                  placeholder="e.g. Autonomous Agents, Gemini 3.7, Cloud Run, Python, React 19"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface-sunken)] border border-[var(--border)] text-xs text-text-primary focus:outline-none focus:border-primary transition"
                />
              </div>
            </div>
          </div>
        </ClayCard>

        {/* Section 2: Audience Demographics & Content Tone */}
        <ClayCard>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 pb-2 border-b border-[var(--border)]">
              <UserGroup03Icon size={18} className="text-amber-500" />
              <h3
                className="text-base font-bold text-text-primary"
                style={{ fontFamily: "var(--font-display)" }}
              >
                2. Target Audience Demographics & Content Tone
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1">
                  Target Audience Persona
                </label>
                <input
                  type="text"
                  value={form.targetAudience}
                  onChange={(e) => handleChange("targetAudience", e.target.value)}
                  placeholder="e.g. Software Engineers, Technical Founders, AI Practitioners"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface-sunken)] border border-[var(--border)] text-xs text-text-primary focus:outline-none focus:border-primary transition"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1">
                  Audience Technical Skill Level
                </label>
                <select
                  value={form.audienceLevel}
                  onChange={(e) => handleChange("audienceLevel", e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface-sunken)] border border-[var(--border)] text-xs text-text-primary focus:outline-none focus:border-primary transition cursor-pointer"
                >
                  <option value="Beginner (Zero to Hello World)">Beginner (Zero to Hello World)</option>
                  <option value="Intermediate (Full-Stack & APIs)">Intermediate (Full-Stack & APIs)</option>
                  <option value="Intermediate to Senior Engineers">Intermediate to Senior Engineers</option>
                  <option value="Senior Staff & Tech Architects">Senior Staff & Tech Architects</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1">
                  Creator Presentation Tone
                </label>
                <input
                  type="text"
                  value={form.creatorTone}
                  onChange={(e) => handleChange("creatorTone", e.target.value)}
                  placeholder="e.g. Direct, Punchy, Hands-on, No-Fluff Engineering"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface-sunken)] border border-[var(--border)] text-xs text-text-primary focus:outline-none focus:border-primary transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1">
                  Preferred Video Formats & Length
                </label>
                <input
                  type="text"
                  value={form.contentFormat}
                  onChange={(e) => handleChange("contentFormat", e.target.value)}
                  placeholder="e.g. 12-18 Min Deep-Dive Tutorials & Real-World Code Demos"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface-sunken)] border border-[var(--border)] text-xs text-text-primary focus:outline-none focus:border-primary transition"
                />
              </div>
            </div>
          </div>
        </ClayCard>

        {/* Section 3: Monetization & Deal Floor Guardrails */}
        <ClayCard>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 pb-2 border-b border-[var(--border)]">
              <Cash02Icon size={18} className="text-emerald-600" />
              <h3
                className="text-base font-bold text-text-primary"
                style={{ fontFamily: "var(--font-display)" }}
              >
                3. Sponsorship Deal Floor & Publishing Guardrails
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1">
                  Minimum Sponsorship Rate Floor
                </label>
                <input
                  type="text"
                  value={form.minSponsorshipFloor}
                  onChange={(e) => handleChange("minSponsorshipFloor", e.target.value)}
                  placeholder="e.g. $8,500 USD"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface-sunken)] border border-[var(--border)] text-xs text-text-primary focus:outline-none focus:border-primary transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1">
                  Publishing Cadence
                </label>
                <input
                  type="text"
                  value={form.publishingCadence}
                  onChange={(e) => handleChange("publishingCadence", e.target.value)}
                  placeholder="e.g. Tuesday & Thursday 6:00 PM EST"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface-sunken)] border border-[var(--border)] text-xs text-text-primary focus:outline-none focus:border-primary transition"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-text-secondary mb-1">
                  Custom Directives & Redline Rules (Injected into Fleet Prompt)
                </label>
                <textarea
                  rows={3}
                  value={form.customDirectives}
                  onChange={(e) => handleChange("customDirectives", e.target.value)}
                  placeholder="e.g. Never accept perpetual exclusivity. Reject all contracts attempting Net-90 payment terms."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface-sunken)] border border-[var(--border)] text-xs text-text-primary focus:outline-none focus:border-primary transition"
                />
              </div>
            </div>
          </div>
        </ClayCard>

        {/* Section 4: Live Fleet Alignment Preview */}
        <ClayCard>
          <div className="flex flex-col gap-3">
            <h3
              className="text-base font-bold text-text-primary"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Live Fleet Tuning Alignment Preview
            </h3>
            <p className="text-xs text-text-tertiary">
              Here is how your Channel DNA configures the prompt context across your autonomous agents:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3.5 rounded-2xl bg-[var(--surface-sunken)] border border-[var(--border)] flex flex-col gap-1.5">
                <div className="flex items-center gap-2 text-primary font-bold text-xs">
                  <Satellite01Icon size={15} />
                  <span>Agent 10 (Trend Radar)</span>
                </div>
                <p className="text-[11px] text-text-secondary leading-relaxed">
                  Scanning YouTube for high-velocity topics strictly in <b>{form.primaryNiche}</b> matching {form.audienceLevel}.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[var(--surface-sunken)] border border-[var(--border)] flex flex-col gap-1.5">
                <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs">
                  <PencilEdit01Icon size={15} />
                  <span>Agent 11 (Hook Architect)</span>
                </div>
                <p className="text-[11px] text-text-secondary leading-relaxed">
                  Engineering 3-second hooks tuned to <b>"{form.creatorTone}"</b> for {form.contentFormat}.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[var(--surface-sunken)] border border-[var(--border)] flex flex-col gap-1.5">
                <div className="flex items-center gap-2 text-amber-600 font-bold text-xs">
                  <DocumentAttachmentIcon size={15} />
                  <span>Agent 01 (Contract Reviewer)</span>
                </div>
                <p className="text-[11px] text-text-secondary leading-relaxed">
                  Enforcing minimum rate of <b>{form.minSponsorshipFloor}</b> and auto-flagging clauses violating custom directives.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[var(--surface-sunken)] border border-[var(--border)] flex flex-col gap-1.5">
                <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs">
                  <UserGroup03Icon size={15} />
                  <span>Agent 09 (Audience Analyst)</span>
                </div>
                <p className="text-[11px] text-text-secondary leading-relaxed">
                  Modeling viewership curves for <b>{form.subscribers}</b> subscribers ({form.targetAudience}).
                </p>
              </div>
            </div>
          </div>
        </ClayCard>

        {/* Save CTA */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={() => navigate("/trends")}
            className="px-5 py-2.5 rounded-xl border border-[var(--border)] text-xs font-semibold text-text-secondary hover:bg-[var(--surface-sunken)] transition cursor-pointer"
          >
            ← Back to Trend Radar
          </button>

          <div className="flex items-center gap-3">
            <AnimatePresence>
              {saveSuccess && (
                <motion.span
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="text-xs font-semibold text-emerald-600 flex items-center gap-1.5"
                >
                  <CheckmarkSquare03Icon size={14} />
                  Synced ✓
                </motion.span>
              )}
              {saveError && (
                <motion.span
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="text-xs font-semibold text-red-500"
                >
                  Sync failed — saved locally
                </motion.span>
              )}
            </AnimatePresence>
            <button
              type="submit"
              disabled={saving}
              className={`px-8 py-3 rounded-xl font-bold text-xs transition cursor-pointer shadow-md flex items-center gap-2 disabled:opacity-60 active:scale-[0.98] ${
                saveSuccess
                  ? "bg-emerald-600 text-white"
                  : saveError
                  ? "bg-red-500 text-white"
                  : "bg-primary text-white hover:brightness-110"
              }`}
            >
              {saving ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  <span>Syncing...</span>
                </>
              ) : saveSuccess ? (
                <>
                  <CheckmarkSquare03Icon size={16} />
                  <span>Saved & Synced</span>
                </>
              ) : (
                <>
                  <CheckmarkSquare03Icon size={16} />
                  <span>Save & Sync to Fleet Memory</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
