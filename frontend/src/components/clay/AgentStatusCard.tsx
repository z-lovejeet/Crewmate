import { motion } from "framer-motion"
import type { ReactNode } from "react"
import StatusDot from "./StatusDot"
import ClayToggle from "./ClayToggle"

type Status = "active" | "busy" | "error" | "idle"

interface Props {
  agentName: string
  icon: ReactNode
  status: Status
  taskCount: number
  enabled: boolean
  progress?: number
  onToggle: (v: boolean) => void
}

export default function AgentStatusCard({
  agentName,
  icon,
  status,
  taskCount,
  enabled,
  progress,
  onToggle,
}: Props) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="clay-md flex flex-col gap-2.5 bg-surface p-4"
      style={{
        borderRadius: "var(--r-md)",
        border: "1px solid rgba(0,0,0,0.04)",
      }}
      aria-label={`${agentName}, ${status}, ${taskCount} tasks`}
    >
      <div className="flex items-start justify-between">
        <span className="flex items-center text-primary">{icon}</span>
        <StatusDot status={status} />
      </div>
      <div className="flex flex-col gap-0.5">
        <span
          className="text-sm font-bold text-text-primary"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {agentName}
        </span>
        <span className="clay-inset w-fit rounded-full px-2 py-0.5 text-[11px] font-semibold text-text-secondary">
          {taskCount} {taskCount === 1 ? "task" : "tasks"}
        </span>
      </div>
      {progress !== undefined && (
        <div className="clay-inset h-1.5 w-full overflow-hidden rounded-full">
          <motion.div
            className="h-full rounded-full"
            style={{ background: "linear-gradient(90deg,#a5b4fc,#6366f1)" }}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ type: "spring", stiffness: 60, damping: 15 }}
          />
        </div>
      )}
      <div className="mt-0.5">
        <ClayToggle checked={enabled} onChange={onToggle} label="" />
      </div>
    </motion.div>
  )
}
