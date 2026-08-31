import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect, useMemo } from "react"
import {
  ActivityFeed,
  AgentStatusCard,
  ClayCard,
  ClayProgressRing,
  ComplianceOrb,
  NotesBoard,
  StatDisplay,
} from "../components/clay"
import Section from "../components/layout/Section"
import { api, AGENTS, FEED } from "../lib/api"
import {
  AGENT_ICON_MAP,
  PencilEdit01Icon,
  ScissorsIcon,
  Satellite01Icon,
  File01Icon,
  CompassIcon,
  ZapIcon,
  Shield01Icon,
} from "../lib/icons"
import { useAuth } from "../context/AuthContext"
import { useStudioStore } from "../store/useStudioStore"
import { LiveContentCalendar } from "../components/calendar/LiveContentCalendar"

const stagger = { animate: { transition: { staggerChildren: 0.03 } } }
const item = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
}

export default function CommandCenter() {
  const { user, profile } = useAuth()
  const {
    dealsCount,
    setContractsList,
    obsStats,
    setObsStats,
    ytChecks,
    igChecks,
    contentCalendar,
    setContentCalendar,
    clearContentCalendar,
    channelProfile,
    disabledAgents,
    toggleAgentEnabled,
  } = useStudioStore()
  const [agents, setAgents] = useState(AGENTS)
  const [tracesFeed, setTracesFeed] = useState<any[]>(FEED)
  const [loadingTraces, setLoadingTraces] = useState(false)

  // Derive compliance score from the same Zustand checklist state as Compliance page
  const complianceScore = useMemo(() => {
    const ytScore = ytChecks.length > 0 ? Math.round((ytChecks.filter(i => i.checked).length / ytChecks.length) * 100) : 100
    const igScore = igChecks.length > 0 ? Math.round((igChecks.filter(i => i.checked).length / igChecks.length) * 100) : 100
    return Math.round((ytScore + igScore) / 2)
  }, [ytChecks, igChecks])

  // Content calendar generation
  const [generatingCalendar, setGeneratingCalendar] = useState(false)

  const handleGenerateCalendar = async () => {
    setGeneratingCalendar(true)
    try {
      const res = await api.generateContentCalendar(
        channelProfile.channelName,
        channelProfile.primaryNiche,
        channelProfile.publishingCadence
      )
      // Try to parse the calendar from the orchestration response
      const raw = res?.executive_synthesis || res?.raw_response || ""
      const jsonMatch = raw.match(/\[[\s\S]*\]/)
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0])
        const today = new Date()
        const entries = parsed.map((item: any, i: number) => {
          const d = new Date(today)
          d.setDate(d.getDate() + i)
          return {
            id: `cal-${i}`,
            day: item.day || d.toLocaleDateString("en-US", { weekday: "long" }),
            date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
            title: item.title || "Untitled",
            format: item.format || "Long-Form",
            platform: item.platform || "YouTube",
            time: item.time || "",
          }
        })
        setContentCalendar(entries)
      } else {
        // Fallback: generate default entries from channel profile
        const days = ["Monday", "Wednesday", "Friday", "Saturday", "Sunday"]
        const fallback = days.map((day, i) => {
          const d = new Date()
          d.setDate(d.getDate() + i)
          return {
            id: `cal-${i}`,
            day,
            date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
            title: `${channelProfile.primaryNiche} - Episode ${i + 1}`,
            format: i % 2 === 0 ? "Long-Form" : "Short",
            platform: i < 3 ? "YouTube" : "Instagram",
            time: "6:00 PM EST",
          }
        })
        setContentCalendar(fallback)
      }
    } catch {
      // Fallback on error
      const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
      const fallback = days.map((day, i) => {
        const d = new Date()
        d.setDate(d.getDate() + i)
        return {
          id: `cal-${i}`,
          day,
          date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          title: `${channelProfile.primaryNiche} Content ${i + 1}`,
          format: i % 2 === 0 ? "Long-Form" : "Short",
          platform: "YouTube",
          time: "6:00 PM EST",
        }
      })
      setContentCalendar(fallback)
    } finally {
      setGeneratingCalendar(false)
    }
  }

  // Captain Orchestration state
  const [missionPrompt, setMissionPrompt] = useState(
    "Audit BrandX $8,500 sponsorship agreement, check FTC & music copyright compliance, and generate a multi-platform distribution strategy."
  )
  const [orchestrating, setOrchestrating] = useState(false)
  const [orchestrationResult, setOrchestrationResult] = useState<any | null>(null)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    // 1. Fetch live agents seamlessly
    try {
      const liveAgents = await api.getAgents()
      if (liveAgents && liveAgents.length > 0) {
        setAgents((prev) =>
          prev.map((a) => {
            const match = liveAgents.find((l: any) => l.id === a.id)
            return match ? { ...a, ...match } : a
          })
        )
      }
    } catch {}

    // 2. Fetch live traces from Firestore
    await refreshTraces()

    // 3. Fetch live telemetry stats
    try {
      const stats = await api.getObservabilityOverview()
      if (stats) setObsStats(stats)
    } catch {}

    // 4. Fetch contracts count
    try {
      const list = await api.getContractsList()
      if (list && list.length > 0) setContractsList(list)
    } catch {}
  }

  const refreshTraces = async () => {
    setLoadingTraces(true)
    try {
      const data = await api.getTraces(15)
      if (data?.traces && data.traces.length > 0) {
        const mapped = data.traces.map((t: any, idx: number) => ({
          id: t.id || `t_${idx}`,
          agent: t.agent_name || t.agent_id,
          agentId: t.agent_id,
          message: `${t.action || t.task_name || 'execution'} — ${Number(t.latency_ms || 180).toFixed(0)}ms (${t.status || 'success'})`,
          timestamp: new Date(t.created_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          tone: t.status === "success" ? "success" : "warning"
        }))
        setTracesFeed(mapped)
      }
    } catch (err) {
      console.error("Traces load error:", err)
    } finally {
      setLoadingTraces(false)
    }
  }

  const handleRunMission = async () => {
    if (!missionPrompt.trim()) return
    setOrchestrating(true)
    setOrchestrationResult(null)
    try {
      const res = await api.orchestrateMission(missionPrompt)
      setOrchestrationResult(res)
      await refreshTraces()
    } catch (err) {
      console.error("Orchestration error:", err)
    } finally {
      setOrchestrating(false)
    }
  }

  const toggle = (id: string) => toggleAgentEnabled(id)

  const creatorName = user?.displayName || profile?.displayName || "Alex Rivera"
  const activeAgentsCount = agents.filter((a) => !disabledAgents.includes(a.id)).length

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto">
      {/* Hero */}
      <div className="pt-2 pb-3">
        <h1 className="text-2xl sm:text-[30px] font-bold text-text-primary tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
          Welcome back, {creatorName}
        </h1>
        <p className="mt-1.5 text-sm sm:text-[15px] text-text-secondary leading-relaxed max-w-2xl">
          Fleet completed <span className="font-semibold text-text-primary">{obsStats.total_traces || 28} operations</span> today with <span className="font-semibold text-emerald-600">{obsStats.success_rate_percent || 100}%</span> success rate · <span className="font-semibold text-text-primary">{activeAgentsCount} autonomous agents</span> active.
        </p>
      </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <ClayCard>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-text-secondary">
                Compliance Shield
              </p>
              <p className="mt-1 text-xs text-text-tertiary">
                FTC & Copyright Protection
              </p>
            </div>
            <ClayProgressRing value={complianceScore} size="md" variant="accent" />
          </div>
        </ClayCard>

        <ClayCard accent="var(--warning)">
          <StatDisplay
            value={dealsCount.toString()}
            label="Sponsorship Deals in Memory"
            trend={12}
            tintColor="transparent"
          />
          <p className="mt-2 text-xs text-text-tertiary">
            +$4,000 avg upside unlocked per counter
          </p>
        </ClayCard>

        <ClayCard accent="var(--accent)">
          <StatDisplay
            value={`${activeAgentsCount}/15`}
            label="Autonomous Agents Active"
            trend={Math.round((activeAgentsCount / 15) * 100)}
            tintColor="transparent"
          />
          <p className="mt-2 text-xs text-text-tertiary">
            Vertex AI Gemini 3.7 Flash & 3.1 Pro
          </p>
        </ClayCard>
      </div>

      {/* Quick-Start Studio Launcher */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <a href="/scripts" className="p-4 rounded-2xl bg-[var(--surface)] clay-sm hover:clay-md transition-all flex flex-col gap-2 border border-[var(--border)] no-underline group">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 text-primary flex items-center justify-center">
            <PencilEdit01Icon size={18} />
          </div>
          <h4 className="font-bold text-text-primary text-xs group-hover:text-primary transition-colors">
            Script & Hook Architect
          </h4>
          <p className="text-[11px] text-text-secondary leading-relaxed">
            Generate 3-second viral hooks and a complete scene-by-scene script teleprompter.
          </p>
        </a>

        <a href="/media" className="p-4 rounded-2xl bg-[var(--surface)] clay-sm hover:clay-md transition-all flex flex-col gap-2 border border-[var(--border)] no-underline group">
          <div className="w-9 h-9 rounded-xl bg-purple-50 text-secondary flex items-center justify-center">
            <ScissorsIcon size={18} />
          </div>
          <h4 className="font-bold text-text-primary text-xs group-hover:text-secondary transition-colors">
            Mini-Clips & Media Studio
          </h4>
          <p className="text-[11px] text-text-secondary leading-relaxed">
            Extract viral 9:16 vertical clips (with limits), Imagen 3 thumbnails, & Lyria music.
          </p>
        </a>

        <a href="/trends" className="p-4 rounded-2xl bg-[var(--surface)] clay-sm hover:clay-md transition-all flex flex-col gap-2 border border-[var(--border)] no-underline group">
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Satellite01Icon size={18} />
          </div>
          <h4 className="font-bold text-text-primary text-xs group-hover:text-amber-600 transition-colors">
            Trend Radar & Channel Ideas
          </h4>
          <p className="text-[11px] text-text-secondary leading-relaxed">
            Personalized video recommendations and breakout niche trend velocity analysis.
          </p>
        </a>

        <a href="/contracts" className="p-4 rounded-2xl bg-[var(--surface)] clay-sm hover:clay-md transition-all flex flex-col gap-2 border border-[var(--border)] no-underline group">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <File01Icon size={18} />
          </div>
          <h4 className="font-bold text-text-primary text-xs group-hover:text-emerald-600 transition-colors">
            Sponsorship Contract Auditor
          </h4>
          <p className="text-[11px] text-text-secondary leading-relaxed">
            Drop your agreement to redline exclusivity traps and negotiate higher sponsorship fees.
          </p>
        </a>

        <a href="/compliance" className="p-4 rounded-2xl bg-[var(--surface)] clay-sm hover:clay-md transition-all flex flex-col gap-2 border border-[var(--border)] no-underline group">
          <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <Shield01Icon size={18} />
          </div>
          <h4 className="font-bold text-text-primary text-xs group-hover:text-rose-600 transition-colors">
            Compliance & Revenue Shield
          </h4>
          <p className="text-[11px] text-text-secondary leading-relaxed">
            FTC disclosure scanner, copyright checker, and sponsorship rate optimizer.
          </p>
        </a>
      </div>

      {/* Captain Multi-Agent Mission Dispatch Studio */}
      <ClayCard accent="var(--secondary)">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-primary flex items-center justify-center">
                <CompassIcon size={20} />
              </span>
              <h3 className="text-base font-bold text-text-primary font-[var(--font-display)]">
                Captain Multi-Agent Mission Command
              </h3>
            </div>
            <span className="text-xs text-text-tertiary">Autonomous 4-Agent Dispatch</span>
          </div>
          <p className="text-xs text-text-secondary">
            Enter any high-level objective. Captain Orchestrator will decompose it, dispatch specialist workers in parallel, and synthesize an executive roadmap.
          </p>

          <div className="flex flex-col sm:flex-row gap-2 mt-1">
            <input
              type="text"
              value={missionPrompt}
              onChange={(e) => setMissionPrompt(e.target.value)}
              placeholder="e.g. Audit BrandX deal and build video distribution package..."
              className="flex-1 px-4 py-2.5 rounded-xl bg-[var(--surface-sunken)] border border-[var(--border)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)] transition"
            />
            <button
              onClick={handleRunMission}
              disabled={orchestrating}
              className="px-5 py-2.5 rounded-xl bg-[var(--primary)] text-white font-bold text-xs hover:brightness-110 active:scale-[0.98] transition cursor-pointer shadow-sm flex items-center justify-center gap-2 disabled:opacity-60 shrink-0"
            >
              {orchestrating ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  <span>Dispatching Fleet...</span>
                </>
              ) : (
                <div className="flex items-center gap-1.5">
                  <ZapIcon size={14} />
                  <span>Dispatch Fleet</span>
                </div>
              )}
            </button>
          </div>

          {/* Real Orchestration Output */}
          <AnimatePresence>
            {orchestrationResult && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 p-4 rounded-xl bg-[var(--surface-sunken)] border border-[var(--border)] text-xs text-[var(--text-primary)] leading-relaxed flex flex-col gap-2.5 overflow-hidden"
              >
                <div className="flex items-center justify-between border-b border-[var(--border)] pb-2">
                  <span className="font-bold text-primary flex items-center gap-1.5">
                    Captain Mission Synthesis Complete
                  </span>
                  <span className="text-[11px] text-text-tertiary">
                    Agents Dispatched: {orchestrationResult.dispatched_agents?.join(", ") || "4 specialist agents"}
                  </span>
                </div>
                <div className="max-h-60 overflow-y-auto pr-2 whitespace-pre-wrap font-sans text-xs text-text-secondary leading-relaxed">
                  {orchestrationResult.executive_synthesis || orchestrationResult.raw_response}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </ClayCard>

      {/* Fleet Overview (15 Agents Grid) */}
      <Section title="Agent Fleet" hint="15 specialized agents continuously operating">
        <motion.div
          variants={stagger}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5"
        >
          {agents.map((a) => (
            <motion.div key={a.id} variants={item}>
              <AgentStatusCard
                agentName={a.name}
                icon={AGENT_ICON_MAP[a.id] || <CompassIcon size={20} />}
                status={a.status}
                taskCount={a.taskCount || 4}
                enabled={!disabledAgents.includes(a.id)}
                model={a.id === "orchestrator" ? "gemini-3.1-pro-preview" : a.id === "thumbnail_generator" ? "gemini-3-pro-image" : a.id === "video_editor" ? "gemini-omni-1.1" : "gemini-3.7-flash"}
                role={a.role || a.description || "Autonomous specialist"}
                onToggle={() => toggle(a.id)}
              />
            </motion.div>
          ))}
        </motion.div>
      </Section>

      {/* ─── Live Content Calendar & Agent A07 Cadence Intelligence ────── */}
      <Section
        title="Live Publishing Calendar"
        hint="Interactive calendar with manual event creation, date inspection & Agent A07 cadence intelligence"
      >
        <LiveContentCalendar />
      </Section>

      {/* ─── Pinned Directives & Pin Board ──────────────────────────────── */}
      <ClayCard>
        <Section title="Pinned Directives & Studio Rulebook" hint="Your creator rules, deal thresholds, and active reminders">
          <NotesBoard />
        </Section>
      </ClayCard>

      {/* Live Observability Feed with Refresh button */}
      <ClayCard>
        <div className="flex items-center justify-between pb-3 border-b border-[var(--border)] mb-3">
          <div>
            <h3
              className="text-base font-bold text-text-primary"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Live Observability Feed
            </h3>
            <p className="text-xs text-text-tertiary">
              Real-time OpenTelemetry traces recorded to Google Cloud Firestore
            </p>
          </div>

          <button
            onClick={refreshTraces}
            disabled={loadingTraces}
            className="px-3 py-1.5 rounded-xl bg-primary-pale text-primary text-xs font-bold hover:brightness-105 transition cursor-pointer"
          >
            {loadingTraces ? "Refreshing..." : "Refresh Live Traces"}
          </button>
        </div>

        <ActivityFeed messages={tracesFeed} maxHeight={340} />
      </ClayCard>
    </div>
  )
}

