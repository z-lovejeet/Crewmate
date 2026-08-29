import { motion } from "framer-motion"
import { useState } from "react"
import {
  AccordionDrawer,
  ActivityFeed,
  AgentStatusCard,
  ClayCard,
  type DrawerSection,
} from "../components/clay"
import Section from "../components/layout/Section"
import { AGENTS, type FeedMessage } from "../lib/api"
import { AGENT_ICON_MAP, SECTION_ICONS } from "../lib/icons"

const TRACE: FeedMessage[] = [
  {
    id: "t1",
    agent: "orchestrator",
    agentId: "orchestrator",
    message:
      "> route(task=contract_review) → dispatch to contract-analyst [priority=high]",
    timestamp: "12:04:02",
    tone: "info",
  },
  {
    id: "t2",
    agent: "contract-analyst",
    agentId: "contract-analyst",
    message:
      "> parse_clauses(doc=brandx.pdf) → 11 clauses extracted, embedding for risk model",
    timestamp: "12:04:03",
    tone: "info",
  },
  {
    id: "t3",
    agent: "contract-analyst",
    agentId: "contract-analyst",
    message:
      "> risk_score(clause=4) = 0.91 CRITICAL — perpetual exclusivity detected",
    timestamp: "12:04:05",
    tone: "critical",
  },
  {
    id: "t4",
    agent: "revenue",
    agentId: "revenue",
    message:
      "> market_compare(tier=mid, category=tech) → deal 19% below median",
    timestamp: "12:04:06",
    tone: "warning",
  },
  {
    id: "t5",
    agent: "compliance",
    agentId: "compliance",
    message:
      "> scan(platform=youtube) → audio fingerprint match on track 'Neon Skyline'",
    timestamp: "12:04:09",
    tone: "warning",
  },
  {
    id: "t6",
    agent: "copyright",
    agentId: "copyright",
    message:
      "> lyria.generate(style=synthwave, bpm=110) → 2 candidates cleared",
    timestamp: "12:04:12",
    tone: "success",
  },
  {
    id: "t7",
    agent: "memory",
    agentId: "memory",
    message:
      "> store(brand=BrandX, outcome=countered) → wrote to long-term memory",
    timestamp: "12:04:14",
    tone: "info",
  },
]

const MEMORY: DrawerSection[] = [
  {
    id: "brandx",
    icon: SECTION_ICONS.building,
    label: "BrandX History",
    accent: "var(--primary)",
    content: (
      <ul className="flex flex-col gap-1.5 text-[13px]">
        <li>3 prior deals · avg value $9.2K · always negotiates Net-90.</li>
        <li>Previously accepted 90-day exclusivity counter.</li>
        <li>Prefers long-form; disclosure compliance historically strong.</li>
      </ul>
    ),
  },
  {
    id: "brandy",
    icon: SECTION_ICONS.store,
    label: "BrandY History",
    accent: "var(--secondary)",
    content: (
      <p>1 deal · $6K · flagged for late payment. Recommend upfront terms.</p>
    ),
  },
  {
    id: "prefs",
    icon: SECTION_ICONS.star,
    label: "My Preferences",
    accent: "var(--accent)",
    content: (
      <ul className="flex flex-col gap-1.5 text-[13px]">
        <li>Minimum deal floor: $10K.</li>
        <li>Never accept perpetual licensing.</li>
        <li>Publish window: Tue–Thu evenings.</li>
      </ul>
    ),
  },
  {
    id: "patterns",
    icon: SECTION_ICONS.trending,
    label: "Content Patterns",
    accent: "var(--warning)",
    content: (
      <p>
        Tech reviews peak Thursday 6PM (+14% reach). Synthwave BGM recurring
        copyright risk.
      </p>
    ),
  },
]

export default function Fleet() {
  const [agents, setAgents] = useState(AGENTS)
  const toggle = (id: string) =>
    setAgents((a) =>
      a.map((x) => (x.id === id ? { ...x, enabled: !x.enabled } : x)),
    )

  return (
    <div className="flex flex-col gap-6">
      <Section title="Fleet Status" hint="All 9 agents · 99.4% uptime">
        <motion.div
          initial="initial"
          animate="animate"
          variants={{ animate: { transition: { staggerChildren: 0.05 } } }}
          className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5"
        >
          {agents.map((a) => (
            <motion.div
              key={a.id}
              variants={{
                initial: { opacity: 0, y: 12 },
                animate: { opacity: 1, y: 0 },
              }}
            >
              <AgentStatusCard
                agentName={a.name}
                icon={AGENT_ICON_MAP[a.id]}
                status={a.status}
                taskCount={a.taskCount}
                enabled={a.enabled}
                progress={a.progress}
                onToggle={() => toggle(a.id)}
              />
            </motion.div>
          ))}
        </motion.div>
      </Section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[60fr_40fr]">
        <ClayCard hover={false}>
          <Section title="Agent Reasoning Trace" hint="Live decision log">
            <div
              className="clay-inset rounded-2xl p-3"
              style={{ background: "var(--bg-secondary)" }}
            >
              <ActivityFeed messages={TRACE} mono maxHeight={360} />
            </div>
          </Section>
        </ClayCard>

        <ClayCard hover={false}>
          <Section title="Memory Bank" hint="Persistent agent knowledge">
            <AccordionDrawer sections={MEMORY} allowMultiple />
          </Section>
        </ClayCard>
      </div>
    </div>
  )
}
