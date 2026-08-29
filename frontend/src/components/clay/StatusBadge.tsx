import { motion } from "framer-motion"
import type { ReactNode } from "react"
import { BADGE_ICONS } from "../../lib/icons"

export type BadgeType =
  | "approved"
  | "flagged"
  | "critical"
  | "pending"
  | "info"
  | "success"
  | "completed"
  | "warning"
  | "danger"
  | "error"

type Size = "sm" | "md"

const map: Record<string, { bg: string fg: string icon: ReactNode }> = {
  approved: {
    bg: "var(--accent-pale)",
    fg: "#0e8f63",
    icon: BADGE_ICONS.approved,
  },
  success: {
    bg: "var(--accent-pale)",
    fg: "#0e8f63",
    icon: BADGE_ICONS.approved,
  },
  completed: {
    bg: "var(--accent-pale)",
    fg: "#0e8f63",
    icon: BADGE_ICONS.approved,
  },
  flagged: {
    bg: "var(--warning-pale)",
    fg: "#b45309",
    icon: BADGE_ICONS.flagged,
  },
  warning: {
    bg: "var(--warning-pale)",
    fg: "#b45309",
    icon: BADGE_ICONS.flagged,
  },
  critical: {
    bg: "var(--error-pale)",
    fg: "#dc2626",
    icon: BADGE_ICONS.critical,
  },
  danger: {
    bg: "var(--error-pale)",
    fg: "#dc2626",
    icon: BADGE_ICONS.critical,
  },
  error: {
    bg: "var(--error-pale)",
    fg: "#dc2626",
    icon: BADGE_ICONS.critical,
  },
  pending: {
    bg: "var(--bg-tertiary)",
    fg: "#64748b",
    icon: BADGE_ICONS.pending,
  },
  info: { bg: "var(--primary-pale)", fg: "#4f46e5", icon: BADGE_ICONS.info },
}

interface Props {
  type?: BadgeType
  status?: BadgeType
  text?: string
  label?: string
  size?: Size
  icon?: ReactNode
}

export default function StatusBadge({
  type,
  status,
  text,
  label,
  size = "md",
  icon,
}: Props) {
  const resolvedType = (type || status || "info").toLowerCase()
  const s = map[resolvedType] || map.info
  const displayText = text || label || resolvedType

  return (
    <motion.span
      initial={{ scale: 0 }}
      animate={{ scale: [0, 1.15, 1] }}
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 18,
        duration: 0.4,
      }}
      className={`clay-sm inline-flex items-center gap-1.5 rounded-full font-bold capitalize ${
        size === "sm" ? "px-2.5 py-1 text-[11px]" : "px-3.5 py-1.5 text-xs"
      }`}
      style={{
        background: s.bg,
        color: s.fg,
        fontFamily: "var(--font-display)",
      }}
    >
      <span aria-hidden>{icon ?? s.icon}</span>
      {displayText}
    </motion.span>
  )
}
