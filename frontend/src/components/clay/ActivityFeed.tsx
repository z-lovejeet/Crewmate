import { AnimatePresence, motion } from "framer-motion"
import { useState } from "react"
import type { FeedMessage } from "../../lib/api"
import { FEED_AGENT_ICON, CompassIcon } from "../../lib/icons"

const toneColor: Record<string, string> = {
  info: "var(--primary)",
  success: "var(--accent)",
  warning: "var(--warning)",
  critical: "var(--error)",
}

interface Props {
  messages: (FeedMessage | any)[]
  mono?: boolean
  maxHeight?: number
}

export default function ActivityFeed({
  messages = [],
  mono,
  maxHeight = 320,
}: Props) {
  const [paused, setPaused] = useState(false)

  const safeMessages = Array.isArray(messages) ? messages : []

  return (
    <div
      aria-live="polite"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="flex flex-col gap-2.5 overflow-y-auto pr-1"
      style={{ maxHeight, scrollBehavior: paused ? "auto" : "smooth" }}
    >
      <AnimatePresence initial={false}>
        {safeMessages.map((m, idx) => {
          const agentKey = typeof m.agentId === "string" ? m.agentId : typeof m.agent === "string" ? m.agent : "Orchestrator"
          const icon = FEED_AGENT_ICON[agentKey] || <CompassIcon size={16} />
          const tone = (typeof m.tone === "string" && toneColor[m.tone]) ? toneColor[m.tone] : "var(--primary)"
          const agentName = typeof m.agent === "string" ? m.agent : typeof m.agentId === "string" ? m.agentId : "Fleet Agent"
          const time = typeof m.timestamp === "string" ? m.timestamp : "Just now"
          const text = typeof m.message === "string" ? m.message : (typeof m.action === "string" ? m.action : "Agent task processed successfully.")
          const key = m.id || `feed_${idx}`

          return (
            <motion.div
              key={key}
              layout
              initial={{ opacity: 0, y: -12, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ type: "spring", stiffness: 320, damping: 24 }}
              className="clay-sm flex items-start gap-3 bg-surface p-3"
              style={{ borderRadius: 16 }}
            >
              <span
                className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ background: tone }}
              />
              <span className="flex items-center text-primary shrink-0">{icon}</span>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <span
                    className="text-[13px] font-bold text-text-primary truncate"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {agentName}
                  </span>
                  <span className="shrink-0 text-[11px] text-text-tertiary">
                    {time}
                  </span>
                </div>
                <p
                  className="mt-0.5 text-[13px] text-text-secondary leading-relaxed"
                  style={
                    mono
                      ? { fontFamily: "var(--font-mono)", fontSize: 12 }
                      : undefined
                  }
                >
                  {text}
                </p>
              </div>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
