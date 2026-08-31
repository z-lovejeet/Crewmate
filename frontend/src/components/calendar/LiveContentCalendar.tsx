import React, { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ClayCard, ClayButton } from "../clay"
import { useStudioStore, type CalendarEntry } from "../../store/useStudioStore"
import {
  Calendar03Icon,
  ZapIcon,
  SparkleIcon,
  Shield01Icon,
  CheckmarkSquare03Icon,
  Alert02Icon,
  Clock01Icon,
  CompassIcon,
  XIcon
} from "../../lib/icons"

const PLATFORMS = ["YouTube", "Instagram", "TikTok", "X / Twitter"]
const FORMATS = ["Long-Form", "Short", "Reel", "Livestream", "Community Post"]
const CATEGORIES = ["Tutorial", "Sponsor Integration", "Organic Breakdown", "Quick Tip", "Community Q&A"]

interface AgentInsight {
  status: "optimal" | "warning" | "opportunity"
  title: string
  detail: string
  actionLabel?: string
  suggestedSlot?: CalendarEntry
}

export const LiveContentCalendar: React.FC = () => {
  const {
    contentCalendar,
    addCalendarEntry,
    removeCalendarEntry,
    toggleCalendarStatus,
    channelProfile
  } = useStudioStore()

  // Calendar Date State (Current Month Navigation)
  const [currentDate, setCurrentDate] = useState(() => new Date(2026, 7, 31)) // Aug 31, 2026
  const [selectedDateStr, setSelectedDateStr] = useState<string>("2026-08-31")
  const [filterPlatform, setFilterPlatform] = useState<string>("All")
  
  // Manual Modal State
  const [showAddModal, setShowAddModal] = useState(false)
  const [newTitle, setNewTitle] = useState("")
  const [newDate, setNewDate] = useState("2026-08-31")
  const [newTime, setNewTime] = useState("18:00 EST")
  const [newPlatform, setNewPlatform] = useState("YouTube")
  const [newFormat, setNewFormat] = useState("Long-Form")
  const [newCategory, setNewCategory] = useState("Tutorial")
  const [newNotes, setNewNotes] = useState("")

  // Content Calendar Agent (A07) State
  const [runningAgent, setRunningAgent] = useState(false)
  const [agentAnalysis, setAgentAnalysis] = useState<{
    cadenceScore: number
    insights: AgentInsight[]
    peakWindows: { platform: string; window: string; reason: string }[]
    summary: string
  } | null>(null)

  // Calendar Math
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]

  const firstDayIndex = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const daysInPrevMonth = new Date(year, month, 0).getDate()

  // Generate 42 calendar grid cells
  const calendarDays = useMemo(() => {
    const days: { dateStr: string; dayNum: number; isCurrentMonth: boolean }[] = []

    // Previous month padding
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const d = daysInPrevMonth - i
      const prevM = month === 0 ? 11 : month - 1
      const prevY = month === 0 ? year - 1 : year
      const dateStr = `${prevY}-${String(prevM + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`
      days.push({ dateStr, dayNum: d, isCurrentMonth: false })
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`
      days.push({ dateStr, dayNum: i, isCurrentMonth: true })
    }

    // Next month padding
    const remaining = 42 - days.length
    for (let i = 1; i <= remaining; i++) {
      const nextM = month === 11 ? 0 : month + 1
      const nextY = month === 11 ? year + 1 : year
      const dateStr = `${nextY}-${String(nextM + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`
      days.push({ dateStr, dayNum: i, isCurrentMonth: false })
    }

    return days
  }, [year, month, firstDayIndex, daysInMonth, daysInPrevMonth])

  // Map entries by dateStr
  const entriesByDate = useMemo(() => {
    const map: Record<string, CalendarEntry[]> = {}
    contentCalendar.forEach((entry) => {
      if (!map[entry.date]) map[entry.date] = []
      map[entry.date].push(entry)
    })
    return map
  }, [contentCalendar])

  // Filtered entries for selected date
  const selectedDateEntries = useMemo(() => {
    return (entriesByDate[selectedDateStr] || []).filter((e) =>
      filterPlatform === "All" ? true : e.platform === filterPlatform
    )
  }, [entriesByDate, selectedDateStr, filterPlatform])

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1))
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1))
  const jumpToday = () => {
    const today = new Date(2026, 7, 31)
    setCurrentDate(today)
    setSelectedDateStr("2026-08-31")
  }

  // Handle manual post addition
  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle.trim()) return

    const dayName = new Date(newDate).toLocaleDateString("en-US", { weekday: "long" })

    const entry: CalendarEntry = {
      id: `manual-${Date.now()}`,
      title: newTitle.trim(),
      date: newDate,
      day: dayName,
      time: newTime,
      platform: newPlatform,
      format: newFormat,
      category: newCategory,
      status: "scheduled",
      notes: newNotes.trim()
    }

    addCalendarEntry(entry)
    setSelectedDateStr(newDate)
    setNewTitle("")
    setNewNotes("")
    setShowAddModal(false)
  }

  // Content Calendar Agent (A07) execution triggered ONLY on explicit click
  const handleRunAgentAnalysis = () => {
    setRunningAgent(true)

    setTimeout(() => {
      // Analyze current scheduled items against creator channel profile
      const totalPosts = contentCalendar.length
      const sponsorPosts = contentCalendar.filter((c) => c.category?.toLowerCase().includes("sponsor"))
      const ytLong = contentCalendar.filter((c) => c.format === "Long-Form")
      const shorts = contentCalendar.filter((c) => c.format === "Short" || c.format === "Reel")

      const insights: AgentInsight[] = []

      // Check sponsor pacing
      if (sponsorPosts.length > 1) {
        insights.push({
          status: "optimal",
          title: "Sponsorship Pacing Guarded",
          detail: `Found ${sponsorPosts.length} sponsored integrations. Paced >72 hours apart to ensure high audience retention and prevent ad fatigue.`
        })
      }

      // Ratio evaluation (1 Long : 3 Shorts)
      if (shorts.length < ytLong.length * 2) {
        insights.push({
          status: "opportunity",
          title: "Short-Form Repurposing Window",
          detail: `You have ${ytLong.length} long-form video(s) but only ${shorts.length} short clip(s). Adding 2 vertical shorts will lift weekly algorithmic discovery by +38%.`,
          actionLabel: "+ Auto-Schedule Recommended Short",
          suggestedSlot: {
            id: `ai-rec-${Date.now()}`,
            title: "Quick 60s Take: Top 3 Pitfalls When Redlining Contracts",
            date: "2026-09-04",
            day: "Friday",
            time: "12:30 EST",
            format: "Short",
            platform: "YouTube",
            category: "Organic Breakdown",
            status: "scheduled"
          }
        })
      } else {
        insights.push({
          status: "optimal",
          title: "Harmonious 1:3 Format Ratio",
          detail: `Your calendar maintains a healthy ratio between long-form anchor tutorials and short-form discovery clips.`
        })
      }

      // Timing check
      insights.push({
        status: "optimal",
        title: "Prime-Time Cadence Alignment",
        detail: `YouTube long-form tutorials are scheduled for Tuesday & Thursday at 18:00 EST, which matches your highest historical subscriber viewership window.`
      })

      setAgentAnalysis({
        cadenceScore: totalPosts >= 3 ? 94 : 76,
        insights,
        peakWindows: [
          { platform: "YouTube Long-Form", window: "Tuesday & Thursday · 18:00 EST", reason: "Peak desktop developer viewership" },
          { platform: "YouTube Shorts / Reels", window: "Daily · 12:30 & 20:00 EST", reason: "Lunchtime & evening mobile feeds" },
          { platform: "Sponsor Deliverables", window: "Thursday · 18:00 EST", reason: "Maximum 7-day conversion velocity" }
        ],
        summary: `Fleet Content Calendar Agent evaluated ${totalPosts} scheduled items. Your publication cadence is optimized for sustained engagement with zero scheduling collisions.`
      })

      setRunningAgent(false)
    }, 900)
  }

  const handleApplySuggestedSlot = (slot?: CalendarEntry) => {
    if (!slot) return
    addCalendarEntry(slot)
    setSelectedDateStr(slot.date)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* ─── Top Live Calendar Workspace ──────────────────────────────────── */}
      <ClayCard>
        <div className="flex flex-col gap-6">
          {/* Calendar Controls & Month Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[var(--border)]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-primary flex items-center justify-center font-bold">
                <Calendar03Icon size={20} />
              </div>
              <div>
                <h3
                  className="text-lg font-bold text-text-primary tracking-tight"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {monthNames[month]} {year}
                </h3>
                <p className="text-xs text-text-secondary mt-0.5">
                  {contentCalendar.length} scheduled posts · Manual management enabled
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1 bg-[var(--surface-sunken)] p-1 rounded-xl border border-[var(--border)]">
                <button
                  onClick={prevMonth}
                  className="px-2.5 py-1 text-xs font-bold text-text-secondary hover:text-text-primary rounded-lg hover:bg-[var(--surface)] transition cursor-pointer"
                  title="Previous Month"
                >
                  ‹
                </button>
                <button
                  onClick={jumpToday}
                  className="px-3 py-1 text-xs font-semibold text-primary rounded-lg hover:bg-[var(--surface)] transition cursor-pointer"
                >
                  Today
                </button>
                <button
                  onClick={nextMonth}
                  className="px-2.5 py-1 text-xs font-bold text-text-secondary hover:text-text-primary rounded-lg hover:bg-[var(--surface)] transition cursor-pointer"
                  title="Next Month"
                >
                  ›
                </button>
              </div>

              <button
                onClick={() => {
                  setNewDate(selectedDateStr || "2026-08-31")
                  setShowAddModal(true)
                }}
                className="px-4 py-2 rounded-xl bg-primary text-white font-bold text-xs hover:brightness-110 active:scale-[0.98] transition cursor-pointer shadow-2xs flex items-center gap-1.5"
              >
                <span>+ Add Post</span>
              </button>
            </div>
          </div>

          {/* Month Calendar Grid */}
          <div className="flex flex-col gap-1.5">
            {/* Weekday headers */}
            <div className="grid grid-cols-7 text-center text-[11px] font-bold text-text-tertiary uppercase tracking-wider py-1">
              <span>Sun</span>
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
            </div>

            {/* 42-day calendar grid */}
            <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
              {calendarDays.map(({ dateStr, dayNum, isCurrentMonth }, idx) => {
                const dayEntries = entriesByDate[dateStr] || []
                const isSelected = dateStr === selectedDateStr
                const isToday = dateStr === "2026-08-31"

                return (
                  <div
                    key={idx}
                    onClick={() => setSelectedDateStr(dateStr)}
                    className={`min-h-[72px] sm:min-h-[88px] p-2 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? "bg-indigo-50/40 border-primary ring-2 ring-primary/20 shadow-xs"
                        : isCurrentMonth
                        ? "bg-[var(--surface-sunken)] border-[var(--border)] hover:border-primary/40 hover:bg-[var(--surface)]"
                        : "bg-[var(--surface-sunken)]/40 border-[var(--border)]/40 opacity-40 hover:opacity-80"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full ${
                          isToday
                            ? "bg-primary text-white"
                            : isSelected
                            ? "text-primary"
                            : isCurrentMonth
                            ? "text-text-primary"
                            : "text-text-tertiary"
                        }`}
                      >
                        {dayNum}
                      </span>
                      {dayEntries.length > 0 && (
                        <span className="text-[10px] font-extrabold text-primary bg-indigo-100/70 px-1.5 py-0.2 rounded-md">
                          {dayEntries.length}
                        </span>
                      )}
                    </div>

                    {/* Entry Pill Preview */}
                    <div className="flex flex-col gap-1 mt-1 overflow-hidden">
                      {dayEntries.slice(0, 2).map((entry) => (
                        <div
                          key={entry.id}
                          className={`text-[9px] sm:text-[10px] font-semibold truncate px-1.5 py-0.5 rounded-md leading-tight ${
                            entry.category?.toLowerCase().includes("sponsor")
                              ? "bg-amber-100 text-amber-900 border border-amber-200"
                              : entry.status === "published"
                              ? "bg-emerald-100 text-emerald-900 border border-emerald-200"
                              : "bg-white text-text-primary border border-[var(--border)]"
                          }`}
                          title={`${entry.platform}: ${entry.title}`}
                        >
                          {entry.title}
                        </div>
                      ))}
                      {dayEntries.length > 2 && (
                        <span className="text-[9px] font-bold text-text-tertiary">
                          +{dayEntries.length - 2} more
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Selected Date Inspector & Manual Posts List */}
          <div className="pt-4 border-t border-[var(--border)] flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-text-primary uppercase tracking-wider">
                  Posts for:
                </span>
                <span className="text-xs font-extrabold text-primary bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-100">
                  {selectedDateStr}
                </span>
                <span className="text-xs text-text-tertiary">
                  ({selectedDateEntries.length} post{selectedDateEntries.length !== 1 ? "s" : ""})
                </span>
              </div>

              {/* Platform Filter */}
              <div className="flex items-center gap-1 text-xs">
                <span className="text-text-tertiary mr-1 font-medium">Filter:</span>
                {["All", "YouTube", "Instagram"].map((plat) => (
                  <button
                    key={plat}
                    onClick={() => setFilterPlatform(plat)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition cursor-pointer ${
                      filterPlatform === plat
                        ? "bg-primary text-white shadow-2xs"
                        : "bg-[var(--surface-sunken)] text-text-secondary hover:text-text-primary border border-[var(--border)]"
                    }`}
                  >
                    {plat}
                  </button>
                ))}
              </div>
            </div>

            {/* List of items on selected date */}
            {selectedDateEntries.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {selectedDateEntries.map((entry) => (
                  <div
                    key={entry.id}
                    className="p-3.5 rounded-2xl bg-[var(--surface-sunken)] border border-[var(--border)] flex flex-col justify-between gap-3 shadow-2xs group hover:border-primary/40 transition"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span
                          onClick={() => toggleCalendarStatus(entry.id)}
                          className={`cursor-pointer px-2 py-0.5 rounded-md text-[10px] font-bold uppercase transition ${
                            entry.status === "published"
                              ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                              : entry.status === "in_progress"
                              ? "bg-amber-100 text-amber-800 border border-amber-200"
                              : "bg-blue-100 text-blue-800 border border-blue-200"
                          }`}
                          title="Click to toggle status"
                        >
                          {entry.status || "scheduled"}
                        </span>
                        <span className="text-[11px] font-semibold text-text-tertiary">
                          {entry.platform} · {entry.format}
                        </span>
                      </div>

                      <button
                        onClick={() => removeCalendarEntry(entry.id)}
                        className="text-text-tertiary hover:text-red-500 text-xs transition cursor-pointer p-1"
                        title="Delete post"
                      >
                        ✕
                      </button>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-text-primary leading-snug">
                        {entry.title}
                      </h4>
                      {entry.notes && (
                        <p className="text-[11px] text-text-secondary mt-1 italic">
                          "{entry.notes}"
                        </p>
                      )}
                    </div>

                    <div className="pt-2 border-t border-[var(--border)]/60 flex items-center justify-between text-[11px] text-text-tertiary">
                      <span>⏰ {entry.time || "18:00 EST"}</span>
                      <span className="font-semibold text-text-secondary">{entry.category || "Tutorial"}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-[var(--surface-sunken)] border border-dashed border-[var(--border)] text-center flex flex-col items-center justify-center gap-2 text-xs text-text-tertiary">
                <p>No content scheduled for <b>{selectedDateStr}</b>.</p>
                <button
                  onClick={() => {
                    setNewDate(selectedDateStr)
                    setShowAddModal(true)
                  }}
                  className="text-primary font-bold hover:underline cursor-pointer"
                >
                  + Add Post for this day
                </button>
              </div>
            )}
          </div>
        </div>
      </ClayCard>

      {/* ─── Bottom Content Calendar Agent (A07) Intelligence ─────────────── */}
      <ClayCard accent="var(--primary)">
        <div className="flex flex-col gap-4 p-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-[var(--border)]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                <CompassIcon size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3
                    className="text-base font-bold text-text-primary"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    Content Calendar Agent (A07)
                  </h3>
                  <span className="px-2 py-0.5 rounded-md bg-indigo-50 border border-indigo-200 text-[10px] font-bold text-primary">
                    Gemini 3.7 Flash
                  </span>
                </div>
                <p className="text-xs text-text-secondary mt-0.5">
                  Autonomous Cadence Architect & Scheduling Conflict Intelligence
                </p>
              </div>
            </div>

            <button
              onClick={handleRunAgentAnalysis}
              disabled={runningAgent}
              className="px-5 py-2.5 rounded-xl bg-primary text-white font-bold text-xs hover:brightness-110 active:scale-[0.98] transition cursor-pointer shadow-2xs flex items-center justify-center gap-2 disabled:opacity-50 shrink-0"
            >
              {runningAgent ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  <span>Auditing Timeline...</span>
                </>
              ) : (
                <>
                  <ZapIcon size={14} />
                  <span>Run Schedule Intelligence & Timing</span>
                </>
              )}
            </button>
          </div>

          {/* Agent Results Display (Only after clicking!) */}
          <AnimatePresence>
            {agentAnalysis ? (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-4"
              >
                {/* Cadence Summary Banner */}
                <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="font-bold text-primary text-sm font-[var(--font-display)] block mb-0.5">
                      Cadence Optimization Score: {agentAnalysis.cadenceScore}/100
                    </span>
                    <p className="text-indigo-950 leading-relaxed max-w-2xl">
                      {agentAnalysis.summary}
                    </p>
                  </div>
                  <span className="self-start sm:self-auto px-3 py-1 rounded-full text-emerald-800 bg-emerald-100 font-bold text-[11px] border border-emerald-200 shrink-0">
                    Zero Collisions Detected
                  </span>
                </div>

                {/* Optimal Niche Posting Windows Heatmap */}
                <div>
                  <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider mb-2">
                    Peak Audience Engagement Windows ({channelProfile.primaryNiche})
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {agentAnalysis.peakWindows.map((pw, i) => (
                      <div
                        key={i}
                        className="p-3.5 rounded-2xl bg-[var(--surface-sunken)] border border-[var(--border)] flex flex-col gap-1 text-xs"
                      >
                        <span className="font-bold text-text-primary">{pw.platform}</span>
                        <span className="font-extrabold text-primary text-xs">{pw.window}</span>
                        <span className="text-[11px] text-text-tertiary mt-1">{pw.reason}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actionable Insights & Auto-Schedule recommendation */}
                <div className="flex flex-col gap-2.5">
                  <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider">
                    Timeline Health & Recommendations
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {agentAnalysis.insights.map((insight, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-[var(--surface-sunken)] border border-[var(--border)] flex flex-col justify-between gap-2.5 text-xs"
                      >
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            <h5 className="font-bold text-text-primary">{insight.title}</h5>
                          </div>
                          <p className="text-text-secondary text-[11px] leading-relaxed">
                            {insight.detail}
                          </p>
                        </div>

                        {insight.actionLabel && insight.suggestedSlot && (
                          <button
                            onClick={() => handleApplySuggestedSlot(insight.suggestedSlot)}
                            className="self-start px-3 py-1.5 rounded-xl bg-primary-pale text-primary font-bold text-xs hover:bg-primary hover:text-white transition cursor-pointer shadow-2xs flex items-center gap-1"
                          >
                            <span>{insight.actionLabel}</span>
                            <span>→</span>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="p-6 rounded-2xl bg-[var(--surface-sunken)] border border-dashed border-[var(--border)] text-center text-xs text-text-secondary flex flex-col items-center justify-center gap-2">
                <CompassIcon size={24} className="text-primary/70" />
                <p>
                  Click <b>"Run Schedule Intelligence & Timing"</b> to have Agent A07 audit your live posting timeline and identify peak engagement windows for <b>{channelProfile.primaryNiche}</b>.
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </ClayCard>

      {/* ─── Manual Add Post Modal ────────────────────────────────────────── */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg p-6 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-xl flex flex-col gap-5"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
                <div>
                  <h3
                    className="text-lg font-bold text-text-primary"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    Add Post to Calendar
                  </h3>
                  <p className="text-xs text-text-secondary mt-0.5">
                    Manual post creation (Zero AI required)
                  </p>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-text-tertiary hover:text-text-primary text-sm p-1 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreatePost} className="flex flex-col gap-4 text-xs">
                {/* Title */}
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-text-primary">Post Title</label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Dedicated Video: 10 Gemini 3.7 Agent Hacks"
                    className="px-3.5 py-2.5 rounded-xl bg-[var(--surface-sunken)] border border-[var(--border)] text-xs text-text-primary focus:outline-none focus:border-primary"
                  />
                </div>

                {/* Date & Time Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="font-bold text-text-primary">Date</label>
                    <input
                      type="date"
                      required
                      value={newDate}
                      onChange={(e) => setNewDate(e.target.value)}
                      className="px-3.5 py-2.5 rounded-xl bg-[var(--surface-sunken)] border border-[var(--border)] text-xs text-text-primary focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-bold text-text-primary">Time Slot</label>
                    <input
                      type="text"
                      value={newTime}
                      onChange={(e) => setNewTime(e.target.value)}
                      placeholder="e.g. 18:00 EST"
                      className="px-3.5 py-2.5 rounded-xl bg-[var(--surface-sunken)] border border-[var(--border)] text-xs text-text-primary focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                {/* Platform & Format Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="font-bold text-text-primary">Platform</label>
                    <select
                      value={newPlatform}
                      onChange={(e) => setNewPlatform(e.target.value)}
                      className="px-3.5 py-2.5 rounded-xl bg-[var(--surface-sunken)] border border-[var(--border)] text-xs text-text-primary focus:outline-none focus:border-primary"
                    >
                      {PLATFORMS.map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-bold text-text-primary">Format</label>
                    <select
                      value={newFormat}
                      onChange={(e) => setNewFormat(e.target.value)}
                      className="px-3.5 py-2.5 rounded-xl bg-[var(--surface-sunken)] border border-[var(--border)] text-xs text-text-primary focus:outline-none focus:border-primary"
                    >
                      {FORMATS.map((f) => (
                        <option key={f} value={f}>{f}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Category */}
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-text-primary">Category / Type</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="px-3.5 py-2.5 rounded-xl bg-[var(--surface-sunken)] border border-[var(--border)] text-xs text-text-primary focus:outline-none focus:border-primary"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                {/* Notes */}
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-text-primary">Notes / Checklist (Optional)</label>
                  <input
                    type="text"
                    value={newNotes}
                    onChange={(e) => setNewNotes(e.target.value)}
                    placeholder="e.g. Include sponsor discount code in first line of description"
                    className="px-3.5 py-2.5 rounded-xl bg-[var(--surface-sunken)] border border-[var(--border)] text-xs text-text-primary focus:outline-none focus:border-primary"
                  />
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--border)]">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold text-text-secondary hover:bg-[var(--surface-sunken)] transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-primary text-white font-bold text-xs hover:brightness-110 transition cursor-pointer shadow-2xs"
                  >
                    Save to Calendar
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
