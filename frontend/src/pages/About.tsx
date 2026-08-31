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
        <motion.div variants={item} className="mb-4 flex items-center justify-center gap-3">
          <img
            src="/logo-icon.png"
            alt="Crewmate Logo"
            className="w-9 h-9 object-contain drop-shadow-sm"
          />
          <span className="clay-sm inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-pale px-4 py-1.5 text-xs font-extrabold uppercase tracking-widest text-primary">
            <span className="h-2 w-2 rounded-full bg-primary" />
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
          platform designed to empower creators with an intelligent fleet of 15
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
                  — The fleet of 15 distinct LLM instances with narrow focus
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
          hint="15 specialized AI agents working in harmony"
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
              { name: "Veo 3", desc: "8s Cinematic Video Generation" },
              { name: "Imagen 3", desc: "CTR Thumbnail Diffusion" },
              { name: "Lyria", desc: "Royalty-Free Music Generation" },
              { name: "Gemma 2", desc: "Edge Safety & Classification" },
              { name: "Firebase", desc: "Auth & Firestore Database" },
              { name: "Cloud Run", desc: "Serverless Container Compute" },
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

      {/* Builders / Team Section */}
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={container}
      >
        <Section
          title="Meet the Builders"
          hint="Engineering & Research Team behind Crewmate"
        >
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {/* Lovejeet Singh */}
            <ClayCard hover={true} accent="var(--primary)">
              <div className="flex flex-col gap-4 p-3">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center font-extrabold text-base shadow-sm shrink-0">
                    LS
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4
                        className="text-base font-extrabold text-text-primary"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        Lovejeet Singh
                      </h4>
                      <span className="px-2 py-0.5 rounded-md bg-primary-pale border border-primary/20 text-[10px] font-extrabold uppercase text-primary">
                        Engineering Lead
                      </span>
                    </div>
                    <p className="text-xs text-text-secondary mt-0.5 font-medium">
                      Lead Full-Stack & Agent Systems Architect
                    </p>
                  </div>
                </div>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Engineered the 15-agent Google ADK multi-agent fleet, Vertex AI & Gemini 3.7 integrations, Veo 3 video & Imagen 3 thumbnail generation engines, FastAPI backend, and 3D Claymorphism frontend.
                </p>
              </div>
            </ClayCard>

            {/* Sahib Babbar */}
            <ClayCard hover={true} accent="var(--accent)">
              <div className="flex flex-col gap-4 p-3">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-accent text-white flex items-center justify-center font-extrabold text-base shadow-sm shrink-0">
                    SB
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4
                        className="text-base font-extrabold text-text-primary"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        Sahib Babbar
                      </h4>
                      <span className="px-2 py-0.5 rounded-md bg-accent-pale border border-accent/20 text-[10px] font-extrabold uppercase text-accent">
                        Research & Docs Lead
                      </span>
                    </div>
                    <p className="text-xs text-text-secondary mt-0.5 font-medium">
                      AI Domain Research & Documentation Lead
                    </p>
                  </div>
                </div>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Authored the comprehensive system architecture, FTC 16 CFR Part 255 and copyright safety policies, creator economy domain research, API contract specifications, and enterprise documentation.
                </p>
              </div>
            </ClayCard>
          </div>

          <div className="mt-8 flex justify-center">
            <Link to="/dashboard">
              <ClayButton label="Back to Command Deck" variant="primary" size="lg" />
            </Link>
          </div>
        </Section>
      </motion.div>
    </div>
  )
}
