import React from "react"

type Status = "active" | "busy" | "error" | "idle"

const colors: Record<Status, string> = {
  active: "#059669",
  busy: "#d97706",
  error: "#dc2626",
  idle: "#94a3b8",
}

const labels: Record<Status, string> = {
  active: "Active",
  busy: "Busy",
  error: "Error",
  idle: "Idle",
}

interface Props {
  status: Status
  pulse?: boolean
  size?: number
}

export default function StatusDot({ status, size = 8 }: Props) {
  const color = colors[status] || colors.idle
  return (
    <span
      className="relative inline-flex items-center justify-center shrink-0"
      role="img"
      aria-label={labels[status]}
    >
      <span
        className="rounded-full transition-colors"
        style={{
          width: size,
          height: size,
          backgroundColor: color,
          boxShadow: `0 0 0 2px ${color}20`,
        }}
      />
    </span>
  )
}
