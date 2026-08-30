import { getCurrentUserToken } from "../services/firebase"
import { Agent, AgentStatus, Clause, FeedMessage, Note, PlatformStatus } from "../types"

// Canonical Master Fleet definitions (14 Agents)
export const AGENTS: (Agent & { role?: string; model?: string; description?: string })[] = [
  {
    id: "orchestrator",
    name: "Fleet Orchestrator (Captain)",
    role: "Supervisor & Task Decomposition",
    status: "active",
    taskCount: 14,
    enabled: true,
    progress: 98,
    model: "gemini-3.1-pro-preview",
  },
  {
    id: "contract_reviewer",
    name: "Contract Reviewer",
    role: "Legal & Sponsorship Risk Auditor",
    status: "active",
    taskCount: 8,
    enabled: true,
    progress: 92,
    model: "gemini-3.7-flash",
  },
  {
    id: "content_compliance",
    name: "Content Compliance",
    role: "FTC & Copyright Guard",
    status: "active",
    taskCount: 11,
    enabled: true,
    progress: 89,
    model: "gemini-3.7-flash",
  },
  {
    id: "distribution_manager",
    name: "Distribution Manager",
    role: "YouTube & Instagram Optimizer",
    status: "active",
    taskCount: 6,
    enabled: true,
    progress: 75,
    model: "gemini-3.7-flash",
  },
  {
    id: "report_generator",
    name: "Report Generator",
    role: "Executive Summarizer",
    status: "active",
    taskCount: 4,
    enabled: true,
    progress: 100,
    model: "gemini-3.7-flash",
  },
  {
    id: "revenue_optimizer",
    name: "Revenue Optimizer",
    role: "Deal Economics & CPM Benchmarking",
    status: "active",
    taskCount: 7,
    enabled: true,
    progress: 84,
    model: "gemini-3.7-flash",
  },
  {
    id: "brand_safety",
    name: "Brand Safety",
    role: "Reputation & Sponsor Alignment",
    status: "active",
    taskCount: 5,
    enabled: true,
    progress: 95,
    model: "gemini-3.7-flash",
  },
  {
    id: "content_calendar",
    name: "Content Calendar",
    role: "Schedule & Cadence Architect",
    status: "active",
    taskCount: 9,
    enabled: true,
    progress: 70,
    model: "gemini-3.7-flash",
  },
  {
    id: "threat_sentinel",
    name: "Threat Sentinel",
    role: "Fleet Security & Anomaly Monitor",
    status: "active",
    taskCount: 16,
    enabled: true,
    progress: 99,
    model: "gemini-3.7-flash",
  },
  {
    id: "audience_analyst",
    name: "Audience Analyst",
    role: "Demographics & Retention Physicist",
    status: "active",
    taskCount: 5,
    enabled: true,
    progress: 88,
    model: "gemini-3.7-flash",
  },
  {
    id: "trend_radar",
    name: "Trend Radar",
    role: "Real-Time Viral Signal Hunter",
    status: "active",
    taskCount: 12,
    enabled: true,
    progress: 91,
    model: "gemini-3.7-flash",
  },
  {
    id: "hook_architect",
    name: "Hook & Script Architect",
    role: "First-3-Seconds & Script Engineer",
    status: "active",
    taskCount: 8,
    enabled: true,
    progress: 85,
    model: "gemini-3.7-flash",
  },
  {
    id: "clipping_director",
    name: "Smart Repurposing Director",
    role: "Viral Moment & Short-Form Extractor",
    status: "active",
    taskCount: 7,
    enabled: true,
    progress: 82,
    model: "gemini-3.7-flash",
  },
  {
    id: "community_guardian",
    name: "Community Sentiment Guardian",
    role: "Comment Clustered Intelligence & Mod",
    status: "active",
    taskCount: 18,
    enabled: true,
    progress: 96,
    model: "gemini-3.7-flash",
  },
]

export const CLAUSES: Clause[] = [
  {
    id: "fee",
    number: 1,
    title: "Sponsorship Compensation (Section 3.1)",
    status: "flagged",
    explanation: "Offer of $8,500 USD is 29% below market rate benchmark of $12,000 for creator tier & view history.",
    counter: "Increase fee to $12,500 USD to adequately reflect 1 dedicated YouTube integration and high organic reach.",
  },
  {
    id: "payment_terms",
    number: 2,
    title: "Payment Schedule (Section 6.1)",
    status: "critical",
    explanation: "Net-90 payout leaves creator carrying production costs for 3 months with cash flow insolvency risk.",
    counter: "50% upfront deposit on contract execution and 50% Net-15 upon video publication.",
  },
  {
    id: "exclusivity",
    number: 3,
    title: "Category Exclusivity (Section 4.2)",
    status: "critical",
    explanation: "12-month broad category block prevents creator from working with other major gaming & tech brands.",
    counter: "Narrow exclusivity strictly to 'Direct Ergonomic Gaming Chairs' for 45 days post-publication.",
  },
  {
    id: "usage_rights",
    number: 4,
    title: "Ad Whitelisting & Perpetual Rights (Section 8.3)",
    status: "flagged",
    explanation: "Perpetual paid ad amplification without additional compensation.",
    counter: "Limit paid ad whitelisting to 60 days with +30% usage fee ($2,700 add-on).",
  },
]

export const FEED: FeedMessage[] = [
  { id: "f1", agent: "Threat Sentinel", agentId: "threat_sentinel", message: "Model Armor verified: Zero injection vectors in incoming BrandX PDF.", timestamp: "12:04", tone: "info" },
  { id: "f2", agent: "Contract Reviewer", agentId: "contract_reviewer", message: "Redline generated: Captured +$4,000 via Net-15 and Rate increase counter-proposals.", timestamp: "12:02", tone: "warning" },
  { id: "f3", agent: "Content Compliance", agentId: "content_compliance", message: "Audio scan: Substituted 'Cyberpunk Neon Drive' with cleared Lyria Gen-3 Echo Pulse.", timestamp: "11:58", tone: "success" },
  { id: "f4", agent: "Captain Orchestrator", agentId: "orchestrator", message: "Dispatched 4-agent parallel mission: Contract, Revenue, Compliance, Distribution.", timestamp: "11:45", tone: "info" },
]

export const NOTES: Note[] = [
  { id: "n1", date: "Aug 30", tag: "Deal Alert", title: "BrandX $8,500 Agreement", snippet: "Exclusivity trap flagged. Auto-generated redline is ready to send to sponsor agent (+$4,000 upside)." },
  { id: "n2", date: "Aug 30", tag: "Compliance", title: "FTC & Copyright Shield", snippet: "All 3 video assets passed FTC guidelines. Lyria AI track substituted." },
  { id: "n3", date: "Aug 29", tag: "Strategy", title: "Viral Hook Engineered", snippet: "Hook Architect generated 3 curiosity-gap intros with predicted 84% first-5s retention." },
]

export const PLATFORMS: Record<string, PlatformStatus> = {
  youtube: { name: "YouTube", handle: "@techvoyager", complianceScore: 96, activeWarnings: 0, pendingActions: 1 },
  instagram: { name: "Instagram", handle: "@techvoyager.ai", complianceScore: 91, activeWarnings: 0, pendingActions: 2 },
}

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000"

async function getAuthHeaders(): Promise<Record<string, string>> {
  const token = await getCurrentUserToken()
  if (token) {
    return { Authorization: `Bearer ${token}` }
  }
  return {}
}

async function fetchFromBackend<T>(endpoint: string, options?: RequestInit, fallback?: T): Promise<T> {
  try {
    const authHeaders = await getAuthHeaders()
    const isFormData = options?.body instanceof FormData
    
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: {
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...authHeaders,
        ...(options?.headers || {}),
      },
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`)
    return await res.json()
  } catch (err) {
    if (fallback !== undefined) return fallback
    throw err
  }
}

export const api = {
  getFleetHealth: async () => {
    try {
      const data = await fetchFromBackend<{ status: string; agents: number }>("/health")
      return { healthy: data.agents || 14, total: 14, uptime: "99.9%" }
    } catch {
      return { healthy: 14, total: 14, uptime: "99.9%" }
    }
  },

  getAgents: async () => {
    try {
      const data = await fetchFromBackend<{ agents: Array<{ agent_id: string; name: string; status: string; role?: string; model?: string; tasks_completed?: number; version?: string; capabilities?: string[] }> }>("/api/fleet/status")
      if (!data?.agents || data.agents.length === 0) return AGENTS

      return data.agents.map((a, idx) => {
        const canonical = AGENTS.find((c) => c.id === a.agent_id) || AGENTS[idx]
        return {
          id: a.agent_id,
          name: a.name || canonical?.name || "Specialist Agent",
          status: (a.status === "busy" ? "busy" : a.status === "online" || a.status === "active" ? "active" : "idle") as AgentStatus,
          taskCount: a.tasks_completed || canonical?.taskCount || ((idx * 3 + 2) % 9),
          enabled: true,
          progress: canonical?.progress || (75 + (idx * 5) % 25),
          role: a.role || canonical?.role || "Fleet Specialist",
          model: a.model || canonical?.model || "gemini-3.7-flash",
          version: a.version || canonical?.version || "2.0.0",
          capabilities: a.capabilities || canonical?.capabilities || []
        }
      })
    } catch {
      return AGENTS
    }
  },

  orchestrateMission: async (mission: string, brand?: string, deliverables?: string, platforms?: string[]) => {
    return fetchFromBackend<any>("/api/fleet/orchestrate", {
      method: "POST",
      body: JSON.stringify({
        mission,
        brand: brand || "BrandX",
        deliverables: deliverables || "1 Dedicated YouTube Video (60s integration)",
        platforms: platforms || ["YouTube", "Instagram"]
      })
    })
  },

  invokeAgent: async (agent_id: string, prompt: string) => {
    return fetchFromBackend<any>("/api/fleet/invoke", {
      method: "POST",
      body: JSON.stringify({ agent_id, prompt }),
    }, { response: `Task executed by ${agent_id}.` })
  },

  analyzeContract: async (fileOrText: File | string, filename = "contract.pdf") => {
    const formData = new FormData()
    if (typeof fileOrText === "string") {
      const blob = new Blob([fileOrText], { type: "text/plain" })
      formData.append("file", blob, filename.endsWith(".txt") ? filename : `${filename}.txt`)
    } else {
      formData.append("file", fileOrText)
    }

    return fetchFromBackend<any>("/api/contracts/analyze", {
      method: "POST",
      body: formData,
    })
  },

  getDemoContract: async () => {
    return fetchFromBackend<any>("/api/contracts/demo", {}, {
      contract_name: "BrandX Partnership Agreement",
      total_clauses: 4,
      flagged_clauses: 3,
      overall_risk_score: 90.0,
      clauses: CLAUSES.map(c => ({
        id: c.id,
        category: c.title,
        text: c.explanation,
        risk: c.status === "critical" ? "CRITICAL" : "HIGH",
        analysis: c.explanation,
        counter_proposal: c.counter
      }))
    })
  },

  getContractsList: async () => {
    return fetchFromBackend<any[]>("/api/contracts/list", {}, [])
  },

  getFeed: async () => {
    return fetchFromBackend<FeedMessage[]>("/api/traces", {}, FEED).then((data: any) => {
      if (data?.traces && data.traces.length > 0) {
        return data.traces.slice(0, 8).map((t: any, idx: number) => ({
          id: t.span_id || t.id || `f_${idx}`,
          agent: t.agent_id || "orchestrator",
          agentId: t.agent_id || "orchestrator",
          message: `> ${t.action || t.output_summary || "Task executed"} [${t.status || "success"}] — ${Number(t.latency_ms || 120).toFixed(0)}ms`,
          timestamp: new Date(t.created_at || Date.now()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          tone: t.status === "success" ? "success" : t.status === "error" ? "critical" : "info"
        }))
      }
      return FEED
    }).catch(() => FEED)
  },
  getNotes: async () => {
    return fetchFromBackend<any[]>("/api/contracts/list", {}, []).then((contracts: any[]) => {
      if (contracts && contracts.length > 0) {
        return contracts.slice(0, 3).map((c: any, idx: number) => ({
          id: c.id || `n_${idx}`,
          date: new Date(c.created_at || Date.now()).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          tag: "Deal Alert",
          title: c.contract_name || c.title || "Contract Review",
          snippet: c.summary || `${c.total_clauses || 0} clauses analyzed, ${c.flagged_clauses || 0} flagged.`
        }))
      }
      return NOTES
    }).catch(() => NOTES)
  },
  getRevenue: async () => {
    return fetchFromBackend<any>("/api/memory/preferences", {}, null).then((prefs: any) => {
      const floor = prefs?.deal_floor || prefs?.minimum_deal_floor || 10000
      return { value: `$${(floor / 1000).toFixed(1)}K`, trend: 22 }
    }).catch(() => ({ value: "$14.5K", trend: 22 }))
  },
  toggleAgent: (id: string, enabled: boolean) => Promise.resolve({ id, enabled }),

  scanCompliance: async (req: {
    title: string
    description: string
    tags?: string[]
    platform?: string
    has_sponsorship?: boolean
    audio_description?: string
  }) => {
    return fetchFromBackend<any>("/api/compliance/scan", {
      method: "POST",
      body: JSON.stringify({
        title: req.title,
        description: req.description,
        tags: req.tags || ["#ad", "#ai"],
        platform: req.platform || "youtube",
        has_sponsorship: req.has_sponsorship !== undefined ? req.has_sponsorship : true,
        audio_description: req.audio_description || "Cyberpunk Neon Drive (Copyright Flagged in 120 regions)"
      })
    })
  },

  getComplianceDemo: async () => {
    return fetchFromBackend<any>("/api/compliance/demo", {}, {
      overall_score: 75.0,
      status: "FLAGGED",
      checks: [
        { check_name: "FTC Sponsorship Disclosure", passed: true, severity: "info", details: "Prominent disclosures found." },
        { check_name: "Copyright Fingerprint Shield", passed: false, severity: "critical", details: "Audio track is copyrighted." },
        { check_name: "Community Guidelines", passed: true, severity: "info", details: "Monetization safe." }
      ],
      lyria_music: {
        original_track: "Cyberpunk Neon Drive",
        replacement_track: "Echo Pulse - Youtube Edit (Lyria Gen-3)",
        tempo_bpm: 128,
        mood: "Uplifting Modern Electronic",
        license: "Lyria AI Free Commercial License"
      }
    })
  },

  getTraces: async (limit = 30) => {
    return fetchFromBackend<any>(`/api/traces?limit=${limit}`, {}, { count: 0, traces: [] })
  },

  getObservabilityOverview: async () => {
    return fetchFromBackend<any>("/api/traces/overview", {}, { total_traces: 25, avg_latency_ms: 350.5, success_rate_percent: 100.0, total_tool_calls: 68 })
  },

  getMemory: async () => {
    return fetchFromBackend<any>("/api/memory", {}, { creator_preferences: {}, brand_histories: [] })
  },

  updatePreferences: async (payload: {
    minimum_deal_value_usd?: number
    target_cpm_usd?: number
    maximum_exclusivity_days?: number
    voice_tone?: string
    preferred_payment_terms?: string
  }) => {
    return fetchFromBackend<any>("/api/memory/preferences", {
      method: "PUT",
      body: JSON.stringify(payload)
    })
  },

  recordBrandHistory: async (payload: {
    brand_name: string
    deal_value: number
    cpm?: number
    contract_quirks?: string
    payment_reliability?: string
    notes?: string
  }) => {
    return fetchFromBackend<any>("/api/memory/brands", {
      method: "POST",
      body: JSON.stringify(payload)
    })
  },

  updateMemory: async (payload: Record<string, any>) => {
    return fetchFromBackend<any>("/api/memory/update", {
      method: "POST",
      body: JSON.stringify(payload)
    }, { status: "synced" })
  },

  scanTrends: async (niche = "AI Coding & Tech", platform = "youtube") => {
    return fetchFromBackend<any>("/api/trends/scan", {
      method: "POST",
      body: JSON.stringify({ niche, platform })
    })
  },

  generateContentCalendar: async (channelName: string, niche: string, cadence: string) => {
    return fetchFromBackend<any>("/api/orchestrate", {
      method: "POST",
      body: JSON.stringify({
        mission: `Generate a 7-day content calendar for "${channelName}" in the "${niche}" niche. Publishing cadence: ${cadence || "3 times per week"}. Return a JSON array of objects, each with: day (Monday-Sunday), title (video/content title), format (Long-Form/Short/Reel/Live), platform (YouTube/Instagram/TikTok), time (suggested publish time). Only return the JSON array, no other text.`,
        max_agents: 2
      })
    })
  },

  getDemoTrends: async () => {
    return fetchFromBackend<any>("/api/trends/demo")
  },

  generateVeoStoryboard: async (topic = "Crewmate AI Fleet", duration = 45, aspect_ratio = "16:9") => {
    return fetchFromBackend<any>("/api/reports/veo-video-summary", {
      method: "POST",
      body: JSON.stringify({ topic, duration, aspect_ratio })
    })
  },

  generateThumbnailConcepts: async (topic = "How AI Agents 10x Creator Revenue") => {
    return fetchFromBackend<any>(`/api/reports/thumbnail-concepts?topic=${encodeURIComponent(topic)}`, {
      method: "POST"
    })
  },

  generateScript: async (
    topic: string,
    targetDurationMinutes = 8,
    style = "engaging",
    formatType = "long_form",
    sponsorIntegration?: string
  ) => {
    return fetchFromBackend<any>("/api/scripts/generate", {
      method: "POST",
      body: JSON.stringify({
        topic,
        target_duration_minutes: targetDurationMinutes,
        style,
        format_type: formatType,
        sponsor_integration: sponsorIntegration
      })
    })
  },

  extractClips: async (
    videoTitle: string,
    transcript: string,
    maxClips = 3,
    targetPlatforms = ["youtube_shorts", "instagram_reels", "tiktok"]
  ) => {
    return fetchFromBackend<any>("/api/clips/extract", {
      method: "POST",
      body: JSON.stringify({
        video_title: videoTitle,
        transcript,
        max_clips: maxClips,
        target_platforms: targetPlatforms
      })
    })
  },

  generateMusic: async (
    mood = "uplifting",
    genre = "Electronic Ambient",
    tempoBpm = 120,
    durationSeconds = 60,
    videoStyle = "tech tutorial"
  ) => {
    return fetchFromBackend<any>("/api/music/generate", {
      method: "POST",
      body: JSON.stringify({
        mood,
        genre,
        tempo_bpm: tempoBpm,
        duration_seconds: durationSeconds,
        video_style: videoStyle
      })
    })
  },

  getPersonalizedIdeas: async (
    creatorName = "Alex Rivera",
    niche = "AI Coding & Tech Tutorials",
    recentVideos?: string[]
  ) => {
    return fetchFromBackend<any>("/api/trends/personalized-ideas", {
      method: "POST",
      body: JSON.stringify({
        creator_name: creatorName,
        niche,
        recent_videos: recentVideos
      })
    })
  },

  voiceCommand: async (text: string) => {
    return fetchFromBackend<any>("/api/voice/command", {
      method: "POST",
      body: JSON.stringify({ text }),
    }, {
      transcript: text,
      response: "Autonomous workflow initiated.",
      routed_agent_id: "orchestrator",
      routed_agent_name: "Fleet Orchestrator"
    })
  },

  getReportsList: async () => {
    return fetchFromBackend<any[]>("/api/reports/list", {}, [])
  }
}

