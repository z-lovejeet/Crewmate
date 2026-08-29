import { useState } from "react"
import { motion, AnimatePresence, type Variants } from "framer-motion"
import { Link } from "react-router-dom"
import {
  FEATURE_ICONS,
  Rocket01Icon,
  Shield01Icon,
  ZapIcon,
  LayersLogoIcon,
  GlobeIcon,
  AiBrain01Icon,
  Scroll01Icon,
  Cash02Icon,
  UserGroup03Icon,
  CheckmarkSquare03Icon,
  Alert02Icon,
  VideoAiIcon,
  Calendar03Icon,
  AiSearch01Icon,
  PencilEdit01Icon,
  ScissorsIcon,
  Comment01Icon,
  BotIconComp,
  PlayIcon,
  PauseIcon,
  Mic01Icon,
  MusicNote01Icon,
} from "../lib/icons"
import {
  ClayCard,
  ClayButton,
  ClayProgressRing,
  StatusBadge,
  MusicPlayer,
  VoiceWave,
} from "../components/clay"

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
}

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
}

// ─── Interactive Workflow Simulator Data ─────────────────────────────────────
const SIMULATOR_SCENARIOS = [
  {
    id: "deal",
    title: "Brand Deal Contract Review",
    subtitle: "$8,500 BrandX Sponsorship",
    tag: "Legal & Revenue",
    summary:
      "Creator received a 12-page PDF agreement from BrandX with hidden perpetual exclusivity and Net-90 terms.",
    pipeline: [
      {
        agent: "Fleet Orchestrator",
        action:
          "Decomposing contract into legal clause risk & rate benchmarking tasks",
        status: "completed",
        time: "0.2s",
      },
      {
        agent: "Contract Reviewer",
        action:
          "Flagged Clause 4: 12-month category lock without compensation (Risk 0.91 CRITICAL)",
        status: "critical",
        time: "1.4s",
      },
      {
        agent: "Revenue Optimizer",
        action:
          "Deal is 19% under median tier rate. Drafted $11,200 counter-proposal + Net-30 terms",
        status: "success",
        time: "0.8s",
      },
      {
        agent: "Report Generator",
        action:
          "Generated executive PDF summary with annotated markup ready to forward to brand",
        status: "success",
        time: "0.5s",
      },
    ],
  },
  {
    id: "video",
    title: "Long-Form Video Repurposing",
    subtitle: "18-Min YouTube Tech Deep Dive",
    tag: "Growth & Creative",
    summary:
      "A 4K YouTube review is uploaded. The fleet analyzes transcript energy and automatically creates vertical short-form assets.",
    pipeline: [
      {
        agent: "Clipping Director",
        action:
          "Identified 4 high-energy standalone segments (Humor spike at 03:14, revelation at 11:20)",
        status: "success",
        time: "2.1s",
      },
      {
        agent: "Hook Architect",
        action:
          "Engineered 3 high-retention hooks ('Nobody noticed this secret...') for 9:16 vertical crop",
        status: "success",
        time: "1.1s",
      },
      {
        agent: "Content Compliance",
        action:
          "Verified FTC sponsorship disclosures and cleared audio rights via Lyria replacement",
        status: "completed",
        time: "0.7s",
      },
      {
        agent: "Distribution Manager",
        action:
          "Formatted and queued 4 Instagram Reels + 4 YouTube Shorts across the optimal weekly calendar",
        status: "success",
        time: "0.4s",
      },
    ],
  },
  {
    id: "community",
    title: "Community Intelligence & Feedback",
    subtitle: "850 Comments on Latest Release",
    tag: "Audience & Safety",
    summary:
      "A flood of viewer reactions arrives. The guardian clusters feedback, filters toxicity, and feeds ideas into the next video brief.",
    pipeline: [
      {
        agent: "Community Guardian",
        action:
          "Scored 850 comments with Gemma: 78% Positive, 19% Constructive, 3% Toxic Spam blocked",
        status: "success",
        time: "0.9s",
      },
      {
        agent: "Trend Radar",
        action:
          "Detected top viewer demand cluster: 'Cover AI coding tools next' (Signal strength: 94/100)",
        status: "success",
        time: "0.6s",
      },
      {
        agent: "Brand Safety",
        action:
          "Audited controversial keywords to ensure sponsor brand guidelines remain 100% compliant",
        status: "completed",
        time: "0.3s",
      },
      {
        agent: "Fleet Orchestrator",
        action:
          "Auto-generated next week's Content Brief and queued 5 creator-voice reply drafts",
        status: "success",
        time: "0.5s",
      },
    ],
  },
]

// ─── 3 Operational Pillars Data ──────────────────────────────────────────────
const PILLARS = [
  {
    title: "Growth & Creative Engine",
    kicker: "Pillar 01",
    accent: "var(--primary)",
    desc: "Autonomous trend discovery, retention-maximized scripting, and multi-platform short-form clipping.",
    agents: [
      {
        icon: <AiSearch01Icon size={20} />,
        name: "Trend Radar (A10)",
        role: "Scans search velocity and spots surging topics before market saturation.",
      },
      {
        icon: <PencilEdit01Icon size={20} />,
        name: "Hook & Script Architect (A11)",
        role: "Engineers 0-3s verbal/visual hooks and retention-optimized video beats.",
      },
      {
        icon: <ScissorsIcon size={20} />,
        name: "Clipping Director (A12)",
        role: "Extracts 30-60s viral moments from long-form YouTube into Reels & Shorts.",
      },
      {
        icon: <Comment01Icon size={20} />,
        name: "Community Guardian (A13)",
        role: "Clusters comment feedback, isolates toxic remarks, and drafts replies in your voice.",
      },
      {
        icon: <UserGroup03Icon size={20} />,
        name: "Audience Analyst (A09)",
        role: "Evaluates demographic retention curves and pinpoints peak posting windows.",
      },
    ],
  },
  {
    title: "Operations & Legal Commerce",
    kicker: "Pillar 02",
    accent: "var(--warning)",
    desc: "Protecting creator revenue, negotiating brand deals, and organizing distribution.",
    agents: [
      {
        icon: <Scroll01Icon size={20} />,
        name: "Contract Reviewer (A01)",
        role: "Extracts clauses, highlights red flags (perpetual IP rights, Net-90), and scores risk.",
      },
      {
        icon: <Cash02Icon size={20} />,
        name: "Revenue Optimizer (A05)",
        role: "Benchmarks industry sponsor rates and drafts data-backed counter-offers.",
      },
      {
        icon: <Calendar03Icon size={20} />,
        name: "Content Calendar (A07)",
        role: "Manages publishing cadence, resolves schedule conflicts, and syncs platforms.",
      },
      {
        icon: <VideoAiIcon size={20} />,
        name: "Report Generator (A04)",
        role: "Compiles brand compliance reports, PDF dossiers, and Veo AI video summaries.",
      },
      {
        icon: <GlobeIcon size={20} />,
        name: "Distribution Manager (A03)",
        role: "Optimizes algorithmic titles, descriptions, and hashtag metadata per platform.",
      },
    ],
  },
  {
    title: "Safety & Fleet Security",
    kicker: "Pillar 03",
    accent: "var(--accent)",
    desc: "Enterprise governance, copyright defense, Model Armor screening, and fleet orchestration.",
    agents: [
      {
        icon: <Shield01Icon size={20} />,
        name: "Content Compliance (A02)",
        role: "Real-time FTC disclosure audits and Lyria royalty-free music swap recommendations.",
      },
      {
        icon: <CheckmarkSquare03Icon size={20} />,
        name: "Brand Safety (A06)",
        role: "Verifies sponsor guidelines and protects advertiser brand alignment across channels.",
      },
      {
        icon: <Shield01Icon size={20} />,
        name: "Threat Sentinel (A08)",
        role: "Model Armor prompt injection filtering, anomaly detection, and circuit breakers.",
      },
      {
        icon: <BotIconComp size={20} />,
        name: "Fleet Orchestrator (A00)",
        role: "Hierarchical supervisor managing goal decomposition and ADK multi-agent execution.",
      },
    ],
  },
]

// ─── Niche Profiles Data ─────────────────────────────────────────────────────
const NICHE_PROFILES = [
  {
    id: "tech",
    name: "Tech & Software Reviewers",
    focus: "Product testing, sponsored gadgets, code demos",
    topAgents: ["Contract Reviewer", "Clipping Director", "Trend Radar"],
    benefit:
      "Auto-generates code snippet Reels and protects against strict OEM exclusivity clauses.",
  },
  {
    id: "lifestyle",
    name: "Lifestyle & Vlogs",
    focus: "Daily routines, travel sponsorships, aesthetic Reels",
    topAgents: ["Content Compliance", "Hook Architect", "Community Guardian"],
    benefit:
      "Ensures FTC #ad compliance across Instagram Stories and drafts conversational comment replies.",
  },
  {
    id: "gaming",
    name: "Gaming & Live Streamers",
    focus: "Long gameplay sessions, esports highlights, hardware deals",
    topAgents: [
      "Clipping Director",
      "Content Compliance (Lyria)",
      "Revenue Optimizer",
    ],
    benefit:
      "Extracts funniest stream moments into Shorts and replaces DMCA music with Lyria audio.",
  },
  {
    id: "finance",
    name: "Finance & Business Educators",
    focus: "Market analysis, fintech sponsorships, disclaimer heavy",
    topAgents: ["Brand Safety", "Threat Sentinel", "Report Generator"],
    benefit:
      "Enforces strict financial disclaimer compliance and prevents harmful crypto sponsor deals.",
  },
]

// ─── FAQ Items ───────────────────────────────────────────────────────────────
const FAQS = [
  {
    q: "Are these real autonomous agents or just simple prompt wrappers?",
    a: "Every agent in Crewmate is a true autonomous agent operating inside Google ADK (Agent Development Kit) and Antigravity SDK. Each agent has defined ReAct reasoning loops, concrete tool calling capabilities, strict Pydantic input/output schemas, persistent Firestore memory bank access, and fault-tolerant circuit breakers.",
  },
  {
    q: "How does Crewmate help a solo YouTuber or Instagrammer?",
    a: "Solo creators spend over 60% of their time on uncompensated operations: reviewing legal contracts, checking FTC compliance, worrying about copyright strikes, chopping videos for Shorts, and reading thousands of comments. Crewmate automates these repetitive workflows 24/7 so creators can focus purely on creativity.",
  },
  {
    q: "How does the platform handle security and brand protection?",
    a: "Crewmate integrates Google Cloud Model Armor to sanitize all incoming prompts and outgoing LLM responses against prompt injection, data exfiltration, and toxic outputs. Furthermore, every agent has granular Firestore RBAC permissions and isolated execution sandboxes.",
  },
  {
    q: "What Google technologies power Crewmate?",
    a: "Crewmate uses 12+ Google Cloud and AI technologies: Google ADK for multi-agent choreography, Gemini 3.7 Flash for reasoning, Gemma 2 for on-device/edge sentiment classification, Veo for AI video summaries, Lyria for copyright-safe music, Firebase Firestore for real-time state, and Cloud Run for serverless deployment.",
  },
]

export default function Landing() {
  const [activeScenario, setActiveScenario] = useState(0)
  const [activeNiche, setActiveNiche] = useState(0)
  const [videoCount, setVideoCount] = useState(4)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [voiceActive, setVoiceActive] = useState(false)
  const [voiceText, setVoiceText] = useState("")
  const [musicPlaying, setMusicPlaying] = useState(false)

  const [heroTab, setHeroTab] =
    useState<"contract" | "compliance" | "repurpose">("contract")

  const hoursSaved = videoCount * 9.5
  const revenueUnlocked = videoCount * 850
  const clipsGenerated = videoCount * 4

  const testVoiceCommand = (cmd: string) => {
    setVoiceActive(true)
    setVoiceText(cmd)
    setTimeout(() => {
      setVoiceActive(false)
    }, 2400)
  }

  const HERO_SCENARIOS = {
    contract: {
      tabTitle: "Sponsorship Contract Audit",
      tabIcon: <Scroll01Icon size={16} />,
      taskTitle: "BrandX $8,500 Sponsorship PDF",
      taskMeta: "12-page PDF agreement • Scanned in 1.4s",
      badgeText: "Critical Risk (0.91)",
      badgeTone: "danger" as const,
      activeAgents: [
        {
          name: "Contract Reviewer (A1)",
          role: "Clause Extraction",
          icon: <Scroll01Icon size={14} />,
        },
        {
          name: "Revenue Optimizer (A5)",
          role: "Rate Benchmark",
          icon: <Cash02Icon size={14} />,
        },
      ],
      findingTitle: "Flagged Clause 4.2: 12-Month Worldwide Exclusivity",
      findingDesc:
        "BrandX attempts to lock your channel out of ALL hardware and AI sponsorships for 12 months with zero compensation for lost deals.",
      actionTitle: "Smart Counter-Proposal Ready",
      actionDesc:
        "Cut exclusivity to 30 days & adjusted fee to $11,200 (+31% market rate match) with Net-30 payment terms.",
      metricBadge: "+$2,700 Unlocked",
    },
    compliance: {
      tabTitle: "Copyright & FTC Shield",
      tabIcon: <Shield01Icon size={16} />,
      taskTitle: "Ep. 42 — AI Workspace Tour.mp4",
      taskMeta: "YouTube 4K & Instagram Reels • Pre-upload scan",
      badgeText: "100% Cleared · Lyria",
      badgeTone: "success" as const,
      activeAgents: [
        {
          name: "Content Compliance (A2)",
          role: "FTC & Policy Scanner",
          icon: <Shield01Icon size={14} />,
        },
        {
          name: "Lyria Audio Guard",
          role: "Royalty-Free AI Music",
          icon: <MusicNote01Icon size={14} />,
        },
      ],
      findingTitle: "Copyright Audio Detected at 04:12",
      findingDesc:
        "Flagged 18s background song. Lyria AI synthesized an acoustic, copyright-safe substitute with identical tempo and chill vibe.",
      actionTitle: "FTC Transparency Tag Auto-Injected",
      actionDesc:
        "Inserted mandatory #ad disclosure within top 2 lines of video description for both YouTube and Instagram guidelines.",
      metricBadge: "Zero Strike Risk",
    },
    repurpose: {
      tabTitle: "1-Click Shorts Extraction",
      tabIcon: <ScissorsIcon size={16} />,
      taskTitle: "18-Min Tech Breakdown",
      taskMeta: "Transcript energy & pacing analysis complete",
      badgeText: "4 Viral Clips Ready",
      badgeTone: "info" as const,
      activeAgents: [
        {
          name: "Clipping Director (A12)",
          role: "Viral Moment Extractor",
          icon: <ScissorsIcon size={14} />,
        },
        {
          name: "Hook Architect (A11)",
          role: "3s Retention Hooks",
          icon: <PencilEdit01Icon size={14} />,
        },
      ],
      findingTitle: "4 High-Retention 9:16 Clips Extracted",
      findingDesc:
        "Identified humor and revelation peaks at 03:14 and 11:20 with retention-tested hook ('Nobody talks about this bug...').",
      actionTitle: "Formatted for Reels & Shorts",
      actionDesc:
        "Generated vertical 9:16 crops with animated word-by-word captions and platform-specific hashtags.",
      metricBadge: "4x Audience Reach",
    },
  }

  const currentHero = HERO_SCENARIOS[heroTab]

  return (
    <div className="min-h-screen bg-bg-app">
      {/* ─── 1. HERO SECTION ────────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-6 pt-16 pb-20 sm:pt-24 sm:pb-28 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial="hidden"
            animate="show"
            variants={container}
            className="mx-auto max-w-4xl text-center"
          >
            {/* Human Tagline Pill */}
            <motion.div variants={item} className="mb-6 flex justify-center">
              <span className="clay-sm inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-pale px-4 py-1.5 text-xs font-extrabold uppercase tracking-widest text-primary">
                <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                The AI Backstage Crew for Solo Creators
              </span>
            </motion.div>

            {/* Main Headline with Human Directness */}
            <motion.h1
              variants={item}
              className="text-4xl font-extrabold tracking-tight text-text-primary sm:text-6xl lg:text-7xl leading-[1.08]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Make great videos.
              <br />
              <span className="bg-gradient-to-r from-primary via-indigo-600 to-accent bg-clip-text text-transparent">
                Let your crew handle the rest.
              </span>
            </motion.h1>

            {/* Subhead */}
            <motion.p
              variants={item}
              className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-text-secondary leading-relaxed font-normal"
            >
              Your 24/7 autonomous backstage crew for YouTube & Instagram. 14
              specialized AI agents that spot predatory contracts, swap copyright
              audio with Lyria, and extract 4 viral Shorts from every upload.
            </motion.p>

            {/* Hero CTAs */}
            <motion.div
              variants={item}
              className="mt-8 flex flex-col items-center justify-center gap-3.5 sm:flex-row sm:gap-4"
            >
              <Link to="/dashboard">
                <ClayButton
                  label="Launch Command Deck"
                  variant="primary"
                  size="lg"
                  icon={<Rocket01Icon size={20} />}
                />
              </Link>
              <Link to="/about">
                <ClayButton
                  label="Explore 14 Crew Agents"
                  variant="secondary"
                  size="lg"
                  icon={<LayersLogoIcon size={20} />}
                />
              </Link>
            </motion.div>

            {/* Quick Proof Pills */}
            <motion.div
              variants={item}
              className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-medium text-text-tertiary"
            >
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                14 Google ADK Agents
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                Gemini 3.7 Flash Reasoning
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                Model Armor Threat Guard
              </span>
            </motion.div>
          </motion.div>

          {/* ─── Hero Interactive Live Studio Deck ─────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.55 }}
            className="mt-12"
          >
            {/* Interactive Task Tabs */}
            <div className="mb-4 flex flex-wrap justify-center gap-2 sm:gap-3">
              {(
                Object.keys(HERO_SCENARIOS) as Array<
                  keyof typeof HERO_SCENARIOS
                >
              ).map((key) => {
                const sc = HERO_SCENARIOS[key]
                const isActive = heroTab === key
                return (
                  <button
                    key={key}
                    onClick={() => setHeroTab(key)}
                    className={`clay-sm flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-extrabold cursor-pointer transition-all ${
                      isActive
                        ? "bg-primary text-white scale-102 shadow-md"
                        : "bg-surface text-text-primary hover:bg-bg-secondary"
                    }`}
                  >
                    {sc.tabIcon}
                    <span>{sc.tabTitle}</span>
                  </button>
                )
              })}
            </div>

            {/* Live Studio Cockpit Card */}
            <ClayCard accent="var(--primary)">
              <AnimatePresence mode="wait">
                <motion.div
                  key={heroTab}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col gap-5 p-2 sm:p-4"
                >
                  {/* Top Deck Status Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/[0.06] pb-4">
                    <div className="flex items-center gap-3">
                      <div className="clay-sm flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-pale text-primary">
                        {currentHero.tabIcon}
                      </div>
                      <div>
                        <h4 className="text-sm font-extrabold text-text-primary sm:text-base">
                          {currentHero.taskTitle}
                        </h4>
                        <p className="text-xs text-text-tertiary">
                          {currentHero.taskMeta}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <StatusBadge
                        type={currentHero.badgeTone}
                        text={currentHero.badgeText}
                      />
                      <span className="clay-sm rounded-full bg-primary-pale px-3 py-1 text-xs font-extrabold text-primary">
                        {currentHero.metricBadge}
                      </span>
                    </div>
                  </div>

                  {/* Active Agents Presence Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-text-tertiary">
                        Active Crewmates on Job:
                      </span>
                      <div className="flex flex-wrap items-center gap-2">
                        {currentHero.activeAgents.map((ag, i) => (
                          <div
                            key={i}
                            className="clay-sm flex items-center gap-1.5 rounded-full bg-bg-app px-3 py-1 text-xs font-bold text-text-primary"
                          >
                            <span className="text-primary">{ag.icon}</span>
                            <span>{ag.name}</span>
                            <span className="text-[11px] font-normal text-text-tertiary">
                              ({ag.role})
                            </span>
                            <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
                          </div>
                        ))}
                      </div>
                    </div>

                    <span className="text-[11px] font-mono text-text-tertiary">
                      ADK Reasoning Chain · Active
                    </span>
                  </div>

                  {/* Insight & Action Split Grid */}
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {/* Left: What the Agent Found */}
                    <div className="clay-sm rounded-2xl bg-bg-app p-4">
                      <div className="flex items-center gap-2">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-100 text-amber-600 text-xs font-extrabold">
                          !
                        </span>
                        <h5 className="text-xs font-extrabold uppercase tracking-wider text-text-primary">
                          Fleet Detection
                        </h5>
                      </div>
                      <p className="mt-2 text-sm font-bold text-text-primary">
                        {currentHero.findingTitle}
                      </p>
                      <p className="mt-1 text-xs text-text-secondary leading-relaxed">
                        {currentHero.findingDesc}
                      </p>
                    </div>

                    {/* Right: What the Agent Did About It */}
                    <div className="clay-sm rounded-2xl bg-accent-pale/60 border border-accent/20 p-4">
                      <div className="flex items-center gap-2">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent text-white text-xs font-extrabold">
                          ✓
                        </span>
                        <h5 className="text-xs font-extrabold uppercase tracking-wider text-accent">
                          Autonomous Resolution
                        </h5>
                      </div>
                      <p className="mt-2 text-sm font-bold text-text-primary">
                        {currentHero.actionTitle}
                      </p>
                      <p className="mt-1 text-xs text-text-secondary leading-relaxed">
                        {currentHero.actionDesc}
                      </p>
                    </div>
                  </div>

                  {/* Bottom Studio Action Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <div className="flex items-center gap-2 text-xs font-medium text-text-secondary">
                      <span className="h-2 w-2 rounded-full bg-accent" />
                      <span>
                        Simulated live on Google ADK Supervisor · Memory Bank
                        updated
                      </span>
                    </div>

                    <Link to="/dashboard">
                      <button className="clay-sm focus-clay cursor-pointer rounded-xl bg-primary px-4 py-2 text-xs font-extrabold text-white transition-all hover:opacity-95">
                        Open in Command Deck →
                      </button>
                    </Link>
                  </div>
                </motion.div>
              </AnimatePresence>
            </ClayCard>
          </motion.div>
        </div>
      </section>

      {/* ─── 2. KEY IMPACT METRICS ───────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          variants={container}
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
        >
          {[
            {
              metric: "14 Agents",
              title: "Autonomous Fleet",
              desc: "1 Hub Supervisor + 13 domain specialists covering legal, growth, and compliance.",
              color: "var(--primary)",
            },
            {
              metric: "10x",
              title: "Repurposing Reach",
              desc: "Turns 1 long-form YouTube video into 4+ viral Instagram Reels and Shorts instantly.",
              color: "var(--accent)",
            },
            {
              metric: "100%",
              title: "Safety & Policy Shield",
              desc: "Automated FTC verification, Lyria music swaps, and Model Armor prompt defense.",
              color: "var(--warning)",
            },
            {
              metric: "24/7",
              title: "Active Governance",
              desc: "Real-time circuit breakers, Firestore memory bank, and OpenTelemetry traces.",
              color: "var(--info)",
            },
          ].map((stat, i) => (
            <motion.div key={i} variants={item}>
              <ClayCard hover={true}>
                <div className="py-4 text-center">
                  <span
                    className="text-3xl font-extrabold sm:text-4xl"
                    style={{
                      color: stat.color,
                      fontFamily: "var(--font-display)",
                    }}
                  >
                    {stat.metric}
                  </span>
                  <h4
                    className="mt-2 text-base font-bold text-text-primary"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {stat.title}
                  </h4>
                  <p className="mt-1 text-xs text-text-secondary leading-relaxed">
                    {stat.desc}
                  </p>
                </div>
              </ClayCard>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ─── 3. INTERACTIVE ROI & TIME SAVED CALCULATOR ──────────────────── */}
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          variants={container}
        >
          <div className="mb-10 text-center">
            <span className="clay-sm inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-pale px-3.5 py-1 text-xs font-extrabold uppercase tracking-widest text-primary">
              Creator ROI Calculator
            </span>
            <h2
              className="mt-4 text-3xl font-extrabold text-text-primary sm:text-4xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              How Much Time & Money Can Your Fleet Save?
            </h2>
            <p className="mx-auto mt-2 max-w-2xl text-sm text-text-secondary">
              Slide to select your monthly production volume and see the
              estimated operational impact.
            </p>
          </div>

          <ClayCard accent="var(--primary)">
            <div className="p-4 sm:p-6">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-1 flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-bold text-text-primary">
                      Monthly Long-Form Videos:
                    </label>
                    <span className="clay-sm rounded-xl bg-primary px-4 py-1 text-base font-extrabold text-white">
                      {videoCount} videos/month
                    </span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={12}
                    step={1}
                    value={videoCount}
                    onChange={(e) => setVideoCount(Number(e.target.value))}
                    className="h-3 w-full cursor-pointer appearance-none rounded-lg bg-bg-secondary accent-primary"
                  />
                  <div className="flex justify-between text-[11px] font-bold text-text-tertiary">
                    <span>1 (Casual)</span>
                    <span>4 (Weekly)</span>
                    <span>8 (Bi-weekly)</span>
                    <span>12 (Heavy)</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:gap-4">
                  <div className="clay-sm rounded-2xl bg-bg-app p-4 text-center">
                    <p className="text-2xl font-extrabold text-primary sm:text-3xl">
                      ~{hoursSaved} hrs
                    </p>
                    <p className="mt-1 text-xs font-semibold text-text-secondary">
                      Admin Time Saved
                    </p>
                  </div>
                  <div className="clay-sm rounded-2xl bg-bg-app p-4 text-center">
                    <p className="text-2xl font-extrabold text-accent sm:text-3xl">
                      +${revenueUnlocked.toLocaleString()}
                    </p>
                    <p className="mt-1 text-xs font-semibold text-text-secondary">
                      Unlocked Brand Revenue
                    </p>
                  </div>
                  <div className="clay-sm col-span-2 rounded-2xl bg-bg-app p-4 text-center sm:col-span-1">
                    <p className="text-2xl font-extrabold text-indigo-600 sm:text-3xl">
                      {clipsGenerated}
                    </p>
                    <p className="mt-1 text-xs font-semibold text-text-secondary">
                      Auto Shorts & Reels
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </ClayCard>
        </motion.div>
      </section>

      {/* ─── 4. THE 3 OPERATIONAL PILLARS ────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={container}
        >
          <div className="mb-14 text-center">
            <span className="clay-sm inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-pale px-3.5 py-1 text-xs font-extrabold uppercase tracking-widest text-primary">
              Fleet Architecture
            </span>
            <h2
              className="mt-4 text-3xl font-extrabold text-text-primary sm:text-4xl lg:text-5xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              The 3 Operational Pillars
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-base text-text-secondary">
              A balanced division of labor engineered to scale creator
              businesses without burnout or legal risk.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {PILLARS.map((pillar, i) => (
              <motion.div key={i} variants={item} className="flex flex-col">
                <ClayCard accent={pillar.accent} hover={true}>
                  <div className="flex flex-col gap-5 py-2">
                    <div>
                      <span className="text-xs font-extrabold uppercase tracking-widest text-primary/80">
                        {pillar.kicker}
                      </span>
                      <h3
                        className="mt-1 text-2xl font-bold text-text-primary"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        {pillar.title}
                      </h3>
                      <p className="mt-2 text-xs text-text-secondary leading-relaxed">
                        {pillar.desc}
                      </p>
                    </div>

                    <div className="flex flex-col gap-3 border-t border-black/[0.06] pt-4">
                      {pillar.agents.map((ag, j) => (
                        <div
                          key={j}
                          className="clay-sm flex items-start gap-3 rounded-xl bg-bg-app p-3"
                        >
                          <div
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-primary"
                            style={{ background: "var(--primary-pale)" }}
                          >
                            {ag.icon}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-text-primary">
                              {ag.name}
                            </p>
                            <p className="mt-0.5 text-[11px] text-text-secondary leading-normal">
                              {ag.role}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </ClayCard>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ─── 5. INTERACTIVE MULTI-AGENT SIMULATOR ────────────────────────── */}
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          variants={container}
        >
          <div className="mb-10 text-center">
            <span className="clay-sm inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-pale px-3.5 py-1 text-xs font-extrabold uppercase tracking-widest text-primary">
              Live Interactive Simulator
            </span>
            <h2
              className="mt-4 text-3xl font-extrabold text-text-primary sm:text-4xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              See the Multi-Agent Fleet in Action
            </h2>
            <p className="mx-auto mt-2 max-w-2xl text-sm text-text-secondary">
              Select a real-world creator challenge to observe the autonomous
              multi-step delegation and ReAct reasoning chains.
            </p>
          </div>

          {/* Scenario Selector Buttons */}
          <div className="mb-8 flex flex-wrap justify-center gap-3">
            {SIMULATOR_SCENARIOS.map((sc, idx) => (
              <button
                key={sc.id}
                onClick={() => setActiveScenario(idx)}
                className={`clay-sm cursor-pointer rounded-2xl px-5 py-3 text-left transition-all ${
                  activeScenario === idx
                    ? "bg-primary text-white shadow-md scale-102"
                    : "bg-surface text-text-primary hover:bg-bg-secondary"
                }`}
              >
                <p className="text-xs font-bold uppercase opacity-80">
                  {sc.tag}
                </p>
                <p className="mt-0.5 text-sm font-extrabold">{sc.title}</p>
              </button>
            ))}
          </div>

          {/* Active Scenario Pipeline Execution Display */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeScenario}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <ClayCard accent="var(--primary)">
                <div className="p-2 sm:p-4">
                  <div className="mb-6 flex flex-col gap-2 border-b border-black/[0.06] pb-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <span className="text-xs font-extrabold uppercase tracking-widest text-primary">
                        {SIMULATOR_SCENARIOS[activeScenario].subtitle}
                      </span>
                      <h4
                        className="text-xl font-bold text-text-primary"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        {SIMULATOR_SCENARIOS[activeScenario].title}
                      </h4>
                      <p className="mt-1 text-xs text-text-secondary">
                        {SIMULATOR_SCENARIOS[activeScenario].summary}
                      </p>
                    </div>
                    <span className="clay-sm self-start rounded-full bg-accent-pale px-3 py-1 text-xs font-bold text-accent sm:self-auto">
                      ADK Parallel Pipeline
                    </span>
                  </div>

                  {/* Reasoning Steps Sequence */}
                  <div className="flex flex-col gap-3">
                    {SIMULATOR_SCENARIOS[activeScenario].pipeline.map(
                      (step, sIdx) => (
                        <div
                          key={sIdx}
                          className="clay-sm flex flex-col gap-2 rounded-xl bg-bg-app p-4 sm:flex-row sm:items-center sm:justify-between"
                        >
                          <div className="flex items-start gap-3">
                            <div className="clay-sm flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-surface text-xs font-extrabold text-primary">
                              {sIdx + 1}
                            </div>
                            <div>
                              <p className="text-xs font-bold text-text-primary">
                                {step.agent}
                              </p>
                              <p className="mt-0.5 text-xs text-text-secondary leading-normal">
                                {step.action}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 self-end sm:self-auto">
                            <span className="font-mono text-[11px] text-text-tertiary">
                              {step.time}
                            </span>
                            <StatusBadge
                              type={
                                step.status as
                                  | "approved"
                                  | "flagged"
                                  | "critical"
                                  | "pending"
                                  | "info"
                              }
                              text={step.status}
                            />
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              </ClayCard>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </section>

      {/* ─── 6. MULTIMODAL AI SHOWCASE (VOICE + AUDIO + VIDEO) ──────────── */}
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          variants={container}
        >
          <div className="mb-10 text-center">
            <span className="clay-sm inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-pale px-3.5 py-1 text-xs font-extrabold uppercase tracking-widest text-primary">
              Multimodal Superpowers
            </span>
            <h2
              className="mt-4 text-3xl font-extrabold text-text-primary sm:text-4xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Voice, Vision & Audio Intelligence
            </h2>
            <p className="mx-auto mt-2 max-w-2xl text-sm text-text-secondary">
              Experience seamless voice commands, Lyria copyright audio swaps,
              and Veo video briefings.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Interactive Voice Command Demo */}
            <ClayCard accent="var(--primary)">
              <div className="flex flex-col gap-4 p-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="clay-sm flex h-8 w-8 items-center justify-center rounded-xl bg-primary-pale text-primary">
                      <Mic01Icon size={18} />
                    </span>
                    <h4 className="text-base font-bold text-text-primary">
                      Voice Commander Testbed
                    </h4>
                  </div>
                  <span className="text-xs font-bold text-text-tertiary">
                    Try Clicking a Preset
                  </span>
                </div>

                <div className="flex flex-col items-center justify-center py-4">
                  <VoiceWave
                    isActive={voiceActive}
                    onMicClick={() => testVoiceCommand("Run compliance scan")}
                  />
                  <p className="mt-3 text-xs font-medium text-text-secondary">
                    {voiceActive
                      ? `Processing: "${voiceText}"`
                      : "Tap a voice preset below to simulate spoken commands"}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {[
                    "Run full compliance scan",
                    "Analyze BrandX contract",
                    "Extract clips for Instagram",
                  ].map((preset) => (
                    <button
                      key={preset}
                      onClick={() => testVoiceCommand(preset)}
                      className="clay-sm rounded-xl bg-bg-app px-3 py-1.5 text-xs font-bold text-text-primary hover:bg-primary-pale hover:text-primary transition-all"
                    >
                      "{preset}"
                    </button>
                  ))}
                </div>
              </div>
            </ClayCard>

            {/* Lyria Audio Shield Demo */}
            <ClayCard accent="var(--accent)">
              <div className="flex flex-col gap-4 p-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="clay-sm flex h-8 w-8 items-center justify-center rounded-xl bg-accent-pale text-accent">
                      <Shield01Icon size={18} />
                    </span>
                    <h4 className="text-base font-bold text-text-primary">
                      Lyria Copyright Shield
                    </h4>
                  </div>
                  <span className="clay-sm rounded-full bg-accent-pale px-2.5 py-0.5 text-[11px] font-bold text-accent">
                    Cleared Track
                  </span>
                </div>

                <p className="text-xs text-text-secondary">
                  When a flagged copyrighted track is detected, Lyria
                  automatically generates an authentic, royalty-free acoustic
                  match.
                </p>

                <div className="flex flex-col gap-2">
                  <MusicPlayer
                    trackName="Acoustic Chill Beats (Lyria Clean)"
                    artist="Royalty-Free Replacement"
                    isPlaying={musicPlaying}
                    onPlayPause={() => setMusicPlaying((p) => !p)}
                    variant="alternative"
                    badge="Cleared · Lyria"
                  />
                </div>
              </div>
            </ClayCard>
          </div>
        </motion.div>
      </section>

      {/* ─── 7. CREATOR NICHES SHOWCASE ─────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          variants={container}
        >
          <div className="mb-10 text-center">
            <span className="clay-sm inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-pale px-3.5 py-1 text-xs font-extrabold uppercase tracking-widest text-primary">
              Tailored for Your Niche
            </span>
            <h2
              className="mt-4 text-3xl font-extrabold text-text-primary sm:text-4xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              How the Fleet Adapts to Your Channel
            </h2>
          </div>

          {/* Niche Tabs */}
          <div className="mb-6 flex flex-wrap justify-center gap-2">
            {NICHE_PROFILES.map((np, idx) => (
              <button
                key={np.id}
                onClick={() => setActiveNiche(idx)}
                className={`clay-sm cursor-pointer rounded-xl px-4 py-2 text-xs font-extrabold transition-all ${
                  activeNiche === idx
                    ? "bg-primary text-white shadow-sm"
                    : "bg-surface text-text-primary hover:bg-bg-secondary"
                }`}
              >
                {np.name}
              </button>
            ))}
          </div>

          <ClayCard accent="var(--primary)">
            <div className="p-3 sm:p-5">
              <h3 className="text-lg font-bold text-text-primary sm:text-xl">
                {NICHE_PROFILES[activeNiche].name}
              </h3>
              <p className="mt-1 text-xs text-text-secondary">
                <strong className="text-text-primary">Content Focus:</strong>{" "}
                {NICHE_PROFILES[activeNiche].focus}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className="text-xs font-bold text-text-tertiary">
                  Top Co-Pilot Agents:
                </span>
                {NICHE_PROFILES[activeNiche].topAgents.map((ag) => (
                  <span
                    key={ag}
                    className="clay-sm rounded-full bg-primary-pale px-3 py-1 text-xs font-bold text-primary"
                  >
                    {ag}
                  </span>
                ))}
              </div>

              <div className="clay-sm mt-4 rounded-xl bg-bg-app p-4">
                <p className="text-xs text-text-secondary leading-relaxed">
                  <strong className="text-primary font-bold">
                    Fleet Edge:{" "}
                  </strong>
                  {NICHE_PROFILES[activeNiche].benefit}
                </p>
              </div>
            </div>
          </ClayCard>
        </motion.div>
      </section>

      {/* ─── 8. ENTERPRISE GEAP ARCHITECTURE ─────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={container}
        >
          <div className="mb-14 text-center">
            <span className="clay-sm inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-pale px-3.5 py-1 text-xs font-extrabold uppercase tracking-widest text-primary">
              Enterprise Grade
            </span>
            <h2
              className="mt-4 text-3xl font-extrabold text-text-primary sm:text-4xl lg:text-5xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Built on Google GEAP Standards
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-base text-text-secondary">
              Designed with the same rigorous architectural governance required
              by Fortune 500 multi-agent deployments.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                Icon: FEATURE_ICONS.rocket,
                title: "Google ADK Orchestration",
                desc: "Hierarchical Supervisor pattern using SequentialAgent and ParallelAgent for complex multi-agent delegation.",
              },
              {
                Icon: FEATURE_ICONS.shield,
                title: "Model Armor Security",
                desc: "Dual-layer prompt injection filters and data exfiltration screening on all inbound & outbound agent I/O.",
              },
              {
                Icon: FEATURE_ICONS.brain,
                title: "Memory Bank Context",
                desc: "Cross-session Firestore memory bank preserving historical brand interactions, rates, and creator preferences.",
              },
              {
                Icon: FEATURE_ICONS.zap,
                title: "Fault-Tolerant Circuit Breakers",
                desc: "Automatic 30-second timeout isolation and graceful fallback degradation if any specialist worker degrades.",
              },
              {
                Icon: FEATURE_ICONS.layers,
                title: "7-Layer Hexagonal Separation",
                desc: "Decoupled domain layers ensuring business logic, LLM reasoning, and Firebase storage remain modular.",
              },
              {
                Icon: FEATURE_ICONS.globe,
                title: "OpenTelemetry Cloud Trace",
                desc: "End-to-end distributed tracing capturing every LLM token invocation, tool execution, and latency metric.",
              },
            ].map((feat, i) => (
              <motion.div key={i} variants={item}>
                <ClayCard hover={true}>
                  <div className="flex flex-col gap-4 py-2">
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-2xl text-primary"
                      style={{ background: "var(--primary-pale)" }}
                    >
                      <feat.Icon size={26} />
                    </div>
                    <h3
                      className="text-lg font-bold text-text-primary"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {feat.title}
                    </h3>
                    <p className="text-xs text-text-secondary leading-relaxed">
                      {feat.desc}
                    </p>
                  </div>
                </ClayCard>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ─── 9. COMPARISON: BEFORE VS AFTER ──────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={container}
        >
          <div className="mb-10 text-center">
            <span className="clay-sm inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-pale px-3.5 py-1 text-xs font-extrabold uppercase tracking-widest text-primary">
              The Creator Transformation
            </span>
            <h2
              className="mt-4 text-3xl font-extrabold text-text-primary sm:text-4xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Why Solo Creators Need a Fleet
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Without Fleet */}
            <ClayCard accent="var(--error)">
              <div className="p-2">
                <span className="text-xs font-extrabold uppercase tracking-widest text-error">
                  Without Crewmate
                </span>
                <h4 className="mt-1 text-xl font-bold text-text-primary">
                  The Exhausted Solo Creator
                </h4>
                <ul className="mt-4 flex flex-col gap-3 text-xs text-text-secondary">
                  <li className="flex items-start gap-2">
                    <span className="text-error font-bold">✕</span>
                    15+ hours/week lost manually reviewing brand deal legal PDFs
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-error font-bold">✕</span>
                    Constant anxiety over FTC fines and copyright audio strikes
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-error font-bold">✕</span>
                    Long-form videos die without short-form repurposing
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-error font-bold">✕</span>
                    Underpriced brand deals with perpetual exploitation rights
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-error font-bold">✕</span>
                    Mental fatigue reading hundreds of unmoderated comments
                  </li>
                </ul>
              </div>
            </ClayCard>

            {/* With Fleet */}
            <ClayCard accent="var(--accent)">
              <div className="p-2">
                <span className="text-xs font-extrabold uppercase tracking-widest text-accent">
                  With Crewmate
                </span>
                <h4 className="mt-1 text-xl font-bold text-text-primary">
                  The Empowered Media Empire
                </h4>
                <ul className="mt-4 flex flex-col gap-3 text-xs text-text-secondary">
                  <li className="flex items-start gap-2">
                    <span className="text-accent font-bold">✓</span>
                    Instant clause extraction and risk scores in under 5 seconds
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent font-bold">✓</span>
                    100% automated FTC checks & Lyria royalty-free music swaps
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent font-bold">✓</span>1 long-form
                    video automatically generates 4+ Shorts & Reels
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent font-bold">✓</span>
                    Data-backed rate benchmarks unlocking +20-35% revenue
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent font-bold">✓</span>
                    Gemma-powered toxic filtering and authentic voice replies
                  </li>
                </ul>
              </div>
            </ClayCard>
          </div>
        </motion.div>
      </section>

      {/* ─── 10. TECH STACK BADGES ───────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={container}
          className="text-center"
        >
          <motion.h3
            variants={item}
            className="mb-8 text-base font-extrabold uppercase tracking-widest text-text-secondary"
          >
            Powered by Google AI & Cloud Technologies
          </motion.h3>
          <motion.div
            variants={item}
            className="flex flex-wrap justify-center gap-3"
          >
            {[
              "Google ADK",
              "Gemini 3.7 Flash",
              "Firebase Firestore",
              "Google Cloud Run",
              "Model Armor",
              "Gemma 2 (Edge)",
              "Veo (Video AI)",
              "Lyria (Music AI)",
              "Google Cloud Pub/Sub",
              "OpenTelemetry Trace",
            ].map((tech) => (
              <span
                key={tech}
                className="clay-sm rounded-full bg-surface px-4 py-2 text-xs font-bold text-text-primary shadow-xs"
              >
                {tech}
              </span>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ─── 11. FREQUENTLY ASKED QUESTIONS ──────────────────────────────── */}
      <section className="mx-auto max-w-4xl px-6 py-16 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={container}
        >
          <div className="mb-10 text-center">
            <span className="clay-sm inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-pale px-3.5 py-1 text-xs font-extrabold uppercase tracking-widest text-primary">
              Got Questions?
            </span>
            <h2
              className="mt-4 text-3xl font-extrabold text-text-primary"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Frequently Asked Questions
            </h2>
          </div>

          <div className="flex flex-col gap-4">
            {FAQS.map((faq, idx) => (
              <div key={idx}>
                <ClayCard hover={true}>
                  <div
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="flex cursor-pointer items-center justify-between py-2"
                  >
                    <h4 className="text-sm font-bold text-text-primary sm:text-base">
                      {faq.q}
                    </h4>
                    <span className="clay-sm flex h-7 w-7 items-center justify-center rounded-full bg-bg-app text-xs font-bold text-primary">
                      {openFaq === idx ? "−" : "+"}
                    </span>
                  </div>
                  {openFaq === idx && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="border-t border-black/[0.06] pt-3 text-xs text-text-secondary leading-relaxed sm:text-sm"
                    >
                      {faq.a}
                    </motion.p>
                  )}
                </ClayCard>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ─── 12. FINAL CALL TO ACTION ────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={container}
        >
          <ClayCard accent="var(--primary)">
            <div className="py-12 px-4 text-center sm:py-16 sm:px-8">
              <span className="clay-sm inline-flex items-center gap-2 rounded-full bg-primary-pale px-4 py-1 text-xs font-extrabold uppercase tracking-widest text-primary">
                Instant Access
              </span>
              <motion.h2
                variants={item}
                className="mt-4 mb-4 text-3xl font-extrabold text-text-primary sm:text-5xl"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Ready to Deploy Your Fleet?
              </motion.h2>
              <motion.p
                variants={item}
                className="mx-auto mb-8 max-w-xl text-sm font-normal text-text-secondary sm:text-base"
              >
                Join solo creators automating legal reviews, compliance checks,
                script drafting, and distribution with 14 specialized AI agents.
              </motion.p>
              <motion.div variants={item}>
                <Link to="/dashboard">
                  <ClayButton
                    label="Launch Live Dashboard"
                    variant="primary"
                    icon={<Rocket01Icon size={20} />}
                  />
                </Link>
              </motion.div>
            </div>
          </ClayCard>
        </motion.div>
      </section>
    </div>
  )
}
