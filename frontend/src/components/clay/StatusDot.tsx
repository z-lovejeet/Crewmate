import { motion } from "framer-motion"

type Status = "active" | "busy" | "error" | "idle"

const colors: Record<Status, string> = {
  active: "#10b981",
  busy: "#f59e0b",
  error: "#ef4444",
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

export default function StatusDot({ status, pulse = true, size = 11 }: Props) {
  const color = colors[status]
  return (
    <span
      className="relative inline-flex"
      role="img"
      aria-label={labels[status]}
    >
      {pulse && status !== "idle" && (
        <motion.span
          className="absolute inset-0 rounded-full"
          style={{ background: color }}
          animate={{ scale: [1, 2.2], opacity: [0.5, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: "easeOut" }}
        />
      )}
      <span
        className="relative rounded-full"
        style={{
          width: size,
          height: size,
          background: color,
          boxShadow: `0 0 8px ${color}88`,
        }}
      />
    </span>
  )
}
