import { motion, type Variants } from "framer-motion"
import { Link } from "react-router-dom"
import { AGENTS } from "../lib/api"
import { AGENT_ICON_MAP } from "../lib/icons"
import { ClayCard, ClayButton } from "../components/clay"
import Section from "../components/layout/Section"

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
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

export default function About() {
  return (
    <div className="mx-auto flex min-h-screen max-w-5xl flex-col gap-12 px-4 py-8">
      {/* Hero */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={container}
        className="text-center"
      >
        <motion.div variants={item} className="mb-4 flex justify-center">
          <span className="clay-sm inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-pale px-4 py-1.5 text-xs font-extrabold uppercase tracking-widest text-primary">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            System Architecture & Fleet Specs
          </span>
        </motion.div>
        <motion.h1
          variants={item}
          className="mb-4 text-4xl font-extrabold tracking-tight text-text-primary sm:text-5xl lg:text-6xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          About Crewmate
        </motion.h1>
        <motion.p
          variants={item}
          className="mx-auto max-w-2xl text-base font-normal leading-relaxed text-text-secondary sm:text-lg"
        >
          Built for the All Things Agentic Hackathon 2026. A comprehensive
          platform designed to empower creators with an intelligent fleet of 13
          specialized AI agents managing compliance, contracts, content
          distribution, and audience growth.
        </motion.p>
      </motion.div>

      {/* Architecture */}
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={container}
      >
        <Section title="7-Layer Architecture">
          <ClayCard>
            <div className="flex flex-col gap-4 p-2 text-sm leading-relaxed text-text-secondary">
              <p>
                The system is built on a resilient 7-layer hexagonal
                architecture designed for enterprise-grade autonomous
                operations:
              </p>
              <ul className="flex list-disc flex-col gap-2 pl-5">
                <li>
                  <strong className="text-text-primary">
                    L1: Application Layer
                  </strong>{" "}
                  — React + Tailwind 3D claymorphism interface
                </li>
                <li>
                  <strong className="text-text-primary">L2: API Gateway</strong>{" "}
                  — Secure routing and rate limiting
                </li>
                <li>
                  <strong className="text-text-primary">
                    L3: Agent Orchestrator
                  </strong>{" "}
                  — Google ADK powered task routing and state management
                </li>
                <li>
                  <strong className="text-text-primary">
                    L4: Specialized Agents
                  </strong>{" "}
                  — The fleet of 13 distinct LLM instances with narrow focus
                </li>
                <li>
                  <strong className="text-text-primary">
                    L5: Memory & Context
                  </strong>{" "}
                  — Long-term persistent memory for brand interactions
                </li>
                <li>
                  <strong className="text-text-primary">
                    L6: Tool & Skill Registry
                  </strong>{" "}
                  — Action execution environment (API calls, webhooks)
                </li>
                <li>
                  <strong className="text-text-primary">
                    L7: Infrastructure Layer
                  </strong>{" "}
                  — Cloud Run, Firebase, and Pub/Sub events
                </li>
              </ul>
            </div>
          </ClayCard>
        </Section>
      </motion.div>

      {/* Agents Grid */}
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={container}
      >
        <Section
          title="The Agent Fleet"
          hint="13 specialized AI agents working in harmony"
        >
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {AGENTS.map((agent) => (
              <motion.div key={agent.id} variants={item}>
                <ClayCard hover={true}>
                  <div className="flex items-start gap-4">
                    <div
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl"
                      style={{ background: "var(--primary-pale)" }}
                    >
                      <span className="flex items-center justify-center text-primary [&>svg]:h-6 [&>svg]:w-6">
                        {AGENT_ICON_MAP[agent.id]}
                      </span>
                    </div>
                    <div>
                      <h4
                        className="font-bold text-text-primary"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        {agent.name}
                      </h4>
                      <p className="mt-1 text-xs text-text-secondary">
                        Specialized in handling {agent.name.toLowerCase()} tasks
                        across the platform.
                      </p>
                    </div>
                  </div>
                </ClayCard>
              </motion.div>
            ))}
          </div>
        </Section>
      </motion.div>

      {/* Tech Stack */}
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={container}
      >
        <Section title="Technologies Used">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { name: "Google ADK", desc: "Agent Orchestration" },
              { name: "Gemini 3.7 Flash", desc: "Core Reasoning" },
              { name: "Veo", desc: "Video Summarization" },
              { name: "Lyria", desc: "Music Generation" },
              { name: "Gemma", desc: "Local Classification" },
              { name: "Firebase", desc: "Auth & Database" },
              { name: "Cloud Run", desc: "Serverless Compute" },
              { name: "React + Tailwind", desc: "Frontend UI" },
            ].map((tech) => (
              <motion.div key={tech.name} variants={item}>
                <ClayCard>
                  <div className="py-2 text-center">
                    <p className="text-sm font-bold text-text-primary">
                      {tech.name}
                    </p>
                    <p className="mt-1 text-[11px] text-text-tertiary">
                      {tech.desc}
                    </p>
                  </div>
                </ClayCard>
              </motion.div>
            ))}
          </div>
        </Section>
      </motion.div>

      {/* Builder */}
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={container}
      >
        <ClayCard accent="var(--accent)">
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <h3
              className="mb-2 text-xl font-bold text-text-primary"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Solo Builder
            </h3>
            <p className="mb-6 text-sm text-text-secondary">
              Designed and developed by one person for the All Things Agentic
              Hackathon 2026.
            </p>
            <Link to="/dashboard">
              <ClayButton label="Back to Dashboard" variant="primary" />
            </Link>
          </div>
        </ClayCard>
      </motion.div>
    </div>
  )
}
