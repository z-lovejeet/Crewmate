import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { ChecklistItem } from "../components/clay"

export interface PinNote {
  id: string
  text: string
  tag?: string
  color: string
  pin: string
  date?: string
}

export interface ChannelProfile {
  channelName: string
  creatorName: string
  primaryNiche: string
  secondaryTopics: string
  targetAudience: string
  audienceLevel: string
  contentFormat: string
  creatorTone: string
  subscribers: string
  publishingCadence: string
  minSponsorshipFloor: string
  customDirectives: string
}

export interface PersonalizedIdea {
  id: string
  title: string
  match_score: number
  format: string
  duration: string
  viral_angle: string
  hook_teaser: string
  predicted_views: string
  reasoning: string
}

export interface CalendarEntry {
  id: string
  title: string
  date: string         // YYYY-MM-DD
  day?: string         // "Monday"
  time?: string        // "18:00 EST"
  format: string       // "Long-Form" | "Short" | "Reel" | "Live"
  platform: string     // "YouTube" | "Instagram" | "TikTok"
  category?: string    // "Sponsor" | "Organic" | "Tutorial" | "Community"
  status?: "scheduled" | "in_progress" | "published"
  notes?: string
}

const DEFAULT_PROFILE: ChannelProfile = {
  channelName: "Alex Rivera Tech",
  creatorName: "Alex Rivera",
  primaryNiche: "AI Engineering & Full-Stack Development",
  secondaryTopics: "Autonomous Agents, Gemini 3.7, Cloud Run, Python, React 19",
  targetAudience: "Software Engineers, AI Practitioners, Technical Founders",
  audienceLevel: "Intermediate to Senior Engineers",
  contentFormat: "12-18 Min Deep-Dive Tutorials & Real-World Code Demos",
  creatorTone: "Direct, Punchy, Hands-on, No-Fluff Engineering",
  subscribers: "145,000",
  publishingCadence: "Tuesday & Thursday 6:00 PM EST",
  minSponsorshipFloor: "$8,500 USD",
  customDirectives: "Always emphasize production-grade architectures over toy examples. Do not accept perpetual exclusivity deals.",
}

const DEFAULT_IDEAS: PersonalizedIdea[] = [
  {
    id: "idea_1",
    title: "I Built an Autonomous 14-Agent Dev Team That Tests & Ships PRs",
    match_score: 98,
    format: "Deep-Dive Tutorial",
    duration: "15 Min",
    viral_angle: "Hands-on engineering demo showing 14 specialized Gemini 3.7 Flash agents collaborating in VS Code to test and deploy production code.",
    hook_teaser: "I stopped writing unit tests manually—here is the exact 14-agent swarm currently reviewing and shipping code to my repo.",
    predicted_views: "210K - 280K views",
    reasoning: "Matches your audience preference for deep-dive tutorials on Autonomous Multi-Agent swarms with Gemini 3.7.",
  },
  {
    id: "idea_2",
    title: "3 Predatory Clauses in Sponsor Contracts That Steal Your Code & IP",
    match_score: 95,
    format: "Case Study & Breakdown",
    duration: "10 Min",
    viral_angle: "Actionable legal teardown showing how standard tech sponsorship agreements secretly claim perpetual whitelisting and IP ownership over your projects.",
    hook_teaser: "If you build SaaS tools or AI bots on the weekend, your sponsor might secretly own every single line of that code.",
    predicted_views: "110K - 160K views",
    reasoning: "Aligns with your $8.5K+ deal floor guardrails and creator contract protection directives.",
  },
  {
    id: "idea_3",
    title: "Google ADK vs. LangGraph vs. CrewAI: Which Agent Framework Actually Works?",
    match_score: 92,
    format: "Technical Benchmark",
    duration: "18 Min",
    viral_angle: "No-BS benchmark test solving the same complex full-stack coding challenge across the top 3 agent orchestration frameworks.",
    hook_teaser: "Most AI agent tutorials use toy examples. Today we're stress-testing Google ADK and LangGraph against a real production workload.",
    predicted_views: "140K - 200K views",
    reasoning: "Matches your senior engineer demographic seeking framework performance benchmarks.",
  },
]

const DEFAULT_NOTES: PinNote[] = [
  {
    id: "n1",
    tag: "Deal Shield",
    text: "BrandX $8.5K: Exclusivity counter drafted (§2.1 Net-30 required). Awaiting creator sign-off.",
    color: "#eef2ff",
    pin: "#6366f1",
    date: "Today",
  },
  {
    id: "n2",
    tag: "Compliance",
    text: "FTC Warning: Ensure #ad disclosure is within the first 2 lines of YouTube description.",
    color: "#ecfdf5",
    pin: "#10b981",
    date: "Yesterday",
  },
  {
    id: "n3",
    tag: "Growth Idea",
    text: "Trending: 'Autonomous Agentic Coding 2026' has 94/100 velocity. Script Architect ready.",
    color: "#fffbeb",
    pin: "#f59e0b",
    date: "Aug 30",
  },
]

const DEFAULT_YT_CHECKS: ChecklistItem[] = [
  { id: "y1", label: "FTC disclosure present (#ad, #sponsored)", checked: true },
  { id: "y2", label: "Commercial rights verified for all visual assets", checked: true },
  { id: "y3", label: "YouTube Community Guidelines & Advertiser Safety check", checked: true },
  { id: "y4", label: "Paid product placement / sponsorship tag enabled", checked: true },
]

const DEFAULT_IG_CHECKS: ChecklistItem[] = [
  { id: "i1", label: "Paid Partnership label enabled on reel/post", checked: true },
  { id: "i2", label: "Clear disclosure placed above the caption fold", checked: true },
  { id: "i3", label: "Audio cleared for commercial business use", checked: true },
  { id: "i4", label: "Branded hashtag compliance (#sponsored)", checked: true },
]

interface StudioState {
  // Channel Profile DNA
  channelProfile: ChannelProfile
  updateChannelProfile: (profile: Partial<ChannelProfile>) => void

  // Personalized Ideas (Cached for 0s instant load)
  personalizedIdeas: PersonalizedIdea[]
  setPersonalizedIdeas: (ideas: PersonalizedIdea[]) => void

  // Deals & Contracts
  contractsList: any[]
  dealsCount: number
  setContractsList: (list: any[]) => void

  // Pinned Directives
  pinnedNotes: PinNote[]
  addPinnedNote: (note: PinNote) => void
  removePinnedNote: (id: string) => void

  // Telemetry & Traces
  traces: any[]
  obsStats: {
    total_traces: number
    avg_latency_ms: number
    success_rate_percent: number
  }
  setTraces: (traces: any[]) => void
  setObsStats: (stats: any) => void

  // Compliance State
  ytChecks: ChecklistItem[]
  igChecks: ChecklistItem[]
  setYtChecks: (items: ChecklistItem[]) => void
  setIgChecks: (items: ChecklistItem[]) => void
  toggleYtCheck: (id: string) => void
  toggleIgCheck: (id: string) => void

  // Content Calendar
  contentCalendar: CalendarEntry[]
  setContentCalendar: (entries: CalendarEntry[]) => void
  addCalendarEntry: (entry: CalendarEntry) => void
  removeCalendarEntry: (id: string) => void
  updateCalendarEntry: (id: string, updates: Partial<CalendarEntry>) => void
  toggleCalendarStatus: (id: string) => void
  clearContentCalendar: () => void

  // Agent Fleet Toggles (Persisted)
  disabledAgents: string[]
  toggleAgentEnabled: (id: string) => void
}

const DEFAULT_CALENDAR: CalendarEntry[] = [
  {
    id: "cal-1",
    title: "10 Gemini 3.7 Agent Hacks That Blew My Mind",
    date: "2026-08-31",
    day: "Monday",
    time: "18:00 EST",
    format: "Long-Form",
    platform: "YouTube",
    category: "Tutorial",
    status: "published",
    notes: "Deep dive code walkthrough with repo link."
  },
  {
    id: "cal-2",
    title: "Why You Should Never Sign a Net-90 Contract (Redline Breakdown)",
    date: "2026-09-02",
    day: "Wednesday",
    time: "13:00 EST",
    format: "Short",
    platform: "YouTube",
    category: "Organic",
    status: "scheduled",
    notes: "High retention 60s short with contract screenshot."
  },
  {
    id: "cal-3",
    title: "Building an Autonomous Creator Fleet from Scratch",
    date: "2026-09-03",
    day: "Thursday",
    time: "18:00 EST",
    format: "Long-Form",
    platform: "YouTube",
    category: "Sponsor",
    status: "in_progress",
    notes: "Includes BrandX 60s integration (FTC certified)."
  },
  {
    id: "cal-4",
    title: "3 Rules for Creator IP Protection in AI Era",
    date: "2026-09-05",
    day: "Saturday",
    time: "15:00 EST",
    format: "Reel",
    platform: "Instagram",
    category: "Community",
    status: "scheduled",
    notes: "Carousel infographic + audio voiceover."
  }
]

export const useStudioStore = create<StudioState>()(
  persist(
    (set, get) => ({
      // Channel Profile
      channelProfile: DEFAULT_PROFILE,
      updateChannelProfile: (updated) =>
        set((state) => ({
          channelProfile: { ...state.channelProfile, ...updated },
        })),

      // Ideas
      personalizedIdeas: DEFAULT_IDEAS,
      setPersonalizedIdeas: (personalizedIdeas) => set({ personalizedIdeas }),

      // Deals
      contractsList: [
        { id: "c1", brand_name: "BrandX", offer_amount: "$8,500", risk_level: "FLAGGED" },
        { id: "c2", brand_name: "Google Cloud", offer_amount: "$15,000", risk_level: "APPROVED" },
        { id: "c3", brand_name: "Nike Vision", offer_amount: "$12,000", risk_level: "APPROVED" },
        { id: "c4", brand_name: "TechCorp AI", offer_amount: "$9,500", risk_level: "FLAGGED" },
        { id: "c5", brand_name: "Notion Pro", offer_amount: "$10,000", risk_level: "APPROVED" },
      ],
      dealsCount: 5,
      setContractsList: (list) => {
        const count = list && list.length > 0 ? list.length : 5
        set({ contractsList: list, dealsCount: count })
      },

      // Pinned Directives
      pinnedNotes: DEFAULT_NOTES,
      addPinnedNote: (note) =>
        set((state) => ({ pinnedNotes: [note, ...state.pinnedNotes] })),
      removePinnedNote: (id) =>
        set((state) => ({
          pinnedNotes: state.pinnedNotes.filter((n) => n.id !== id),
        })),

      // Telemetry
      traces: [],
      obsStats: {
        total_traces: 28,
        avg_latency_ms: 245.5,
        success_rate_percent: 100,
      },
      setTraces: (traces) => set({ traces }),
      setObsStats: (stats) =>
        set((state) => ({ obsStats: { ...state.obsStats, ...stats } })),

      // Compliance
      ytChecks: DEFAULT_YT_CHECKS,
      igChecks: DEFAULT_IG_CHECKS,
      setYtChecks: (ytChecks) => set({ ytChecks }),
      setIgChecks: (igChecks) => set({ igChecks }),
      toggleYtCheck: (id) =>
        set((state) => ({
          ytChecks: state.ytChecks.map((it) =>
            it.id === id ? { ...it, checked: !it.checked, warn: it.checked } : it
          ),
        })),
      toggleIgCheck: (id) =>
        set((state) => ({
          igChecks: state.igChecks.map((it) =>
            it.id === id ? { ...it, checked: !it.checked, warn: it.checked } : it
          ),
        })),

      // Content Calendar
      contentCalendar: DEFAULT_CALENDAR,
      setContentCalendar: (contentCalendar) => set({ contentCalendar }),
      addCalendarEntry: (entry) =>
        set((state) => ({ contentCalendar: [...state.contentCalendar, entry] })),
      removeCalendarEntry: (id) =>
        set((state) => ({
          contentCalendar: state.contentCalendar.filter((e) => e.id !== id),
        })),
      updateCalendarEntry: (id, updates) =>
        set((state) => ({
          contentCalendar: state.contentCalendar.map((e) =>
            e.id === id ? { ...e, ...updates } : e
          ),
        })),
      toggleCalendarStatus: (id) =>
        set((state) => ({
          contentCalendar: state.contentCalendar.map((e) => {
            if (e.id !== id) return e
            const nextStatus: "scheduled" | "in_progress" | "published" =
              e.status === "scheduled"
                ? "in_progress"
                : e.status === "in_progress"
                ? "published"
                : "scheduled"
            return { ...e, status: nextStatus }
          }),
        })),
      clearContentCalendar: () => set({ contentCalendar: [] }),

      // Agent Fleet Toggles
      disabledAgents: [],
      toggleAgentEnabled: (id) =>
        set((state) => ({
          disabledAgents: state.disabledAgents.includes(id)
            ? state.disabledAgents.filter((aId) => aId !== id)
            : [...state.disabledAgents, id],
        })),
    }),
    {
      name: "crewmate_studio_store",
    }
  )
)
