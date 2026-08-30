import type { ComponentType } from "react"
import { NAV_ICONS } from "./icons"

export type RouteKey = "command" | "channel" | "trends" | "scripts" | "media" | "contracts" | "compliance" | "fleet"

export interface NavItem {
  key: RouteKey
  icon: ComponentType<{ size?: number }>
  label: string
  kicker: string
  title: string
  subtitle: string
  badgeText: string
  badgeTone: "success" | "info" | "warning" | "accent" | "primary"
  path: string
}

export const NAV: NavItem[] = [
  {
    key: "command",
    icon: NAV_ICONS.command,
    label: "Command Center",
    kicker: "Autonomous Multi-Agent Fleet",
    title: "Command Center",
    subtitle: "Real-time fleet operations, active agent tasks, and instant telemetry",
    badgeText: "14 Agents Online · 99.8% Health",
    badgeTone: "success",
    path: "/dashboard",
  },
  {
    key: "channel",
    icon: NAV_ICONS.channel,
    label: "Channel DNA",
    kicker: "Memory Bank & Agent Tuning",
    title: "Channel DNA & Audience Persona Studio",
    subtitle: "Teach all 14 agents about your niche, content style, audience demographics, and deal rules",
    badgeText: "Memory Bank v2.4",
    badgeTone: "primary",
    path: "/channel",
  },
  {
    key: "trends",
    icon: NAV_ICONS.trends,
    label: "Ideation & Trends",
    kicker: "Agent 10 & 09 Strategy",
    title: "Trend Radar & Channel Ideas",
    subtitle: "Personalized content recommendations and breakout trend velocity analysis",
    badgeText: "3 New Concepts",
    badgeTone: "primary",
    path: "/trends",
  },
  {
    key: "scripts",
    icon: NAV_ICONS.scripts,
    label: "Scripts & Hooks",
    kicker: "Agent 11 Retention Engineering",
    title: "Retention Hook & Video Script Architect",
    subtitle: "3-second viral hook variations and scene-by-scene script teleprompter",
    badgeText: "Gemini 3.7 Flash",
    badgeTone: "info",
    path: "/scripts",
  },
  {
    key: "media",
    icon: NAV_ICONS.media,
    label: "Media & Clips",
    kicker: "Multimodal Creator Studio",
    title: "Mini-Clips, Thumbnails & Lyria Music",
    subtitle: "Viral short-form clip extractor, Imagen 3 thumbnails, and royalty-free audio",
    badgeText: "Multimodal Suite",
    badgeTone: "accent",
    path: "/media",
  },
  {
    key: "contracts",
    icon: NAV_ICONS.contracts,
    label: "Contracts",
    kicker: "Agent 01 Legal Review",
    title: "Sponsorship Contract Auditor",
    subtitle: "AI clause extraction, risk assessment, and smart counter-proposals",
    badgeText: "Deal Shield Active",
    badgeTone: "warning",
    path: "/contracts",
  },
  {
    key: "compliance",
    icon: NAV_ICONS.compliance,
    label: "Compliance",
    kicker: "Agent 02 Safety Guard",
    title: "Compliance Shield & FTC Radar",
    subtitle: "FTC disclosures, copyright audio matching with Lyria, and platform policies",
    badgeText: "Shield Active",
    badgeTone: "success",
    path: "/compliance",
  },
  {
    key: "fleet",
    icon: NAV_ICONS.fleet,
    label: "Agent Fleet",
    kicker: "Observability & Traces",
    title: "Agent Fleet Monitor",
    subtitle: "Live ReAct reasoning spans, Firestore memory bank, and execution traces",
    badgeText: "14 Nodes · OpenTelemetry",
    badgeTone: "info",
    path: "/fleet",
  },
]
