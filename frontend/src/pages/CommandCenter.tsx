import { motion } from "framer-motion"
import { useState } from "react"
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
import { AGENTS, FEED, NOTES } from "../lib/api"
import { AGENT_ICON_MAP } from "../lib/icons"

const stagger = { animate: { transition: { staggerChildren: 0.05 } } }
const item = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
}

export default function CommandCenter() {
  const [agents, setAgents] = useState(AGENTS)
  const toggle = (id: string) =>
    setAgents((a) =>
      a.map((x) => (x.id === id ? { ...x, enabled: !x.enabled } : x)),
    )

  return (
    <div className="flex flex-col gap-8">
      {/* Welcome Banner Card */}
      <ClayCard accent="var(--primary)">
        <div className="flex flex-col gap-3 py-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2
              className="text-xl font-extrabold text-text-primary sm:text-2xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Good afternoon, Creator
            </h2>
            <p className="mt-1 text-sm text-text-secondary">
              Your autonomous agent fleet handled{" "}
              <span className="font-bold text-primary">27 tasks</span> and
              resolved{" "}
              <span className="font-bold text-accent">3 critical items</span>{" "}
              while you were away.
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <span className="clay-sm rounded-full bg-primary-pale px-3.5 py-1.5 text-xs font-bold text-primary">
              Fleet Autonomous
            </span>
          </div>
        </div>
      </ClayCard>

      {/* hero stats */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <ClayCard>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-text-secondary">
                Compliance Score
              </p>
              <p className="mt-1 text-xs text-text-tertiary">
                Across all active platforms
              </p>
            </div>
            <ClayProgressRing value={84} size="md" variant="accent" />
          </div>
        </ClayCard>
        <ClayCard accent="var(--warning)">
          <StatDisplay
            value="3"
            label="Contracts pending review"
            trend={-2}
            tintColor="transparent"
          />
          <p className="mt-2 text-xs text-text-tertiary">
            1 flagged as critical risk
          </p>
        </ClayCard>
        <ClayCard accent="var(--accent)">
          <StatDisplay
            value="$12K"
            label="Revenue this month"
            trend={15}
            tintColor="transparent"
          />
          <p className="mt-2 text-xs text-text-tertiary">
            Best month yet — up from $10.4K
          </p>
        </ClayCard>
      </div>

      {/* fleet */}
      <Section title="Agent Fleet" hint="9 specialized agents working for you">
        <motion.div
          variants={stagger}
          initial="initial"
          animate="animate"
          className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5"
        >
          {agents.map((a) => (
            <motion.div key={a.id} variants={item}>
              <AgentStatusCard
                agentName={a.name}
                icon={AGENT_ICON_MAP[a.id]}
                status={a.status}
                taskCount={a.taskCount}
                enabled={a.enabled}
                onToggle={() => toggle(a.id)}
              />
            </motion.div>
          ))}
        </motion.div>
      </Section>

      {/* orb + notes */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <ClayCard>
          <Section
            title="Compliance Radar"
            hint="Continuously scanning your channels"
          >
            <div className="flex items-center justify-center py-4">
              <ComplianceOrb
                score={84}
                size={220}
                platforms={[
                  { name: "YouTube", color: "var(--youtube)" },
                  { name: "Instagram", color: "var(--instagram)" },
                ]}
              />
            </div>
          </Section>
        </ClayCard>
        <ClayCard>
          <Section title="Pinned Alerts" hint="Needs your attention">
            <NotesBoard notes={NOTES} />
          </Section>
        </ClayCard>
      </div>

      {/* feed */}
      <ClayCard>
        <Section title="Live Activity" hint="Real-time agent actions">
          <ActivityFeed messages={FEED} maxHeight={340} />
        </Section>
      </ClayCard>
    </div>
  )
}
