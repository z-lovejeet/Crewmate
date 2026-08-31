import { motion } from "framer-motion"
import type { ReactNode } from "react"
import StatusDot from "./StatusDot"
import ClayToggle from "./ClayToggle"
import { clsx } from "clsx"

type Status = "active" | "busy" | "error" | "idle"

interface Props {
  agentName: string
  icon: ReactNode
  status: Status
  taskCount: number
  enabled: boolean
  progress?: number
  model?: string
  role?: string
  isSelected?: boolean
  onToggle: (v: boolean) => void
  onClick?: () => void
}

export default function AgentStatusCard({
  agentName,
  icon,
  status,
  taskCount,
  enabled,
  progress,
  model = "gemini-3.7-flash",
  role,
  isSelected = false,
  onToggle,
  onClick,
}: Props) {
  const displayModel = model.includes("3.1")
    ? "Gemini 3.1 Pro"
    : model.includes("3-pro-image")
    ? "Gemini 3 Image"
    : model.includes("omni")
    ? "Gemini Omni 1.1"
    : model.includes("gemma")
    ? "Gemma 2 9B"
    : "Gemini 3.7 Flash"

  return (
    <motion.div
      layout="position"
      whileHover={{ y: -2 }}
      transition={{ duration: 0.15 }}
      onClick={onClick}
      className={clsx(
        "flex flex-col justify-between p-4 rounded-2xl border transition-all cursor-pointer shadow-xs min-h-[148px] select-none",
        !enabled
          ? "bg-[var(--surface-sunken)]/60 border-dashed border-[var(--border)] opacity-60 grayscale-[25%]"
          : isSelected
          ? "bg-primary-pale/10 border-primary ring-2 ring-primary/20 shadow-sm"
          : "bg-[var(--surface)] border-[var(--border)] hover:border-primary/40 hover:shadow-sm"
      )}
      aria-label={`${agentName}, ${enabled ? status : "disabled"}, ${taskCount} tasks`}
    >
      <div>
        {/* Top bar: Icon, Model pill & Status dot */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2">
            <span className={clsx(
              "w-8 h-8 rounded-xl flex items-center justify-center transition-colors",
              enabled ? "bg-primary/10 text-primary" : "bg-zinc-200/60 text-zinc-500"
            )}>
              {icon}
            </span>
            <span className="px-2 py-0.5 rounded-md bg-[var(--surface-sunken)] border border-[var(--border)] text-[10px] font-bold text-text-secondary">
              {displayModel}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className={clsx(
              "w-2 h-2 rounded-full",
              !enabled
                ? "bg-zinc-400"
                : status === "busy"
                ? "bg-amber-500 animate-ping"
                : "bg-emerald-500"
            )} />
            <span className={clsx(
              "text-[10px] font-semibold capitalize",
              !enabled ? "text-zinc-400" : "text-text-tertiary"
            )}>
              {!enabled ? "Disabled" : status === "busy" ? "Busy" : "Online"}
            </span>
          </div>
        </div>

        {/* Title & Role */}
        <div className="flex flex-col gap-0.5">
          <h4
            className={clsx(
              "text-sm font-bold leading-tight line-clamp-1 transition-colors",
              enabled ? "text-text-primary" : "text-text-secondary line-through opacity-80"
            )}
            style={{ fontFamily: "var(--font-display)" }}
          >
            {agentName}
          </h4>
          {role && (
            <p className="text-[11px] text-text-tertiary line-clamp-1 leading-snug">
              {role}
            </p>
          )}
        </div>
      </div>

      {/* Bottom bar: Task count, Mini progress & Toggle */}
      <div className="mt-3 pt-2.5 border-t border-[var(--border)] flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="px-2 py-0.5 rounded-full bg-[var(--surface-sunken)] text-[10px] font-bold text-text-secondary">
            {taskCount} {taskCount === 1 ? "task" : "tasks"}
          </span>
        </div>

        <div onClick={(e) => e.stopPropagation()}>
          <ClayToggle checked={enabled} onChange={onToggle} label="" />
        </div>
      </div>
    </motion.div>
  )
}

