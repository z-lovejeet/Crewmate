import { AnimatePresence, motion } from "framer-motion"
import { useState } from "react"
import type { FeedMessage } from "../../lib/api"
import { FEED_AGENT_ICON } from "../../lib/icons"

const toneColor: Record<FeedMessage["tone"], string> = {
  info: "var(--primary)",
  success: "var(--accent)",
  warning: "var(--warning)",
  critical: "var(--error)",
}

interface Props {
  messages: FeedMessage[]
  mono?: boolean
  maxHeight?: number
}

export default function ActivityFeed({
  messages,
  mono,
  maxHeight = 320,
}: Props) {
  const [paused, setPaused] = useState(false)
  return (
    <div
      aria-live="polite"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="flex flex-col gap-2.5 overflow-y-auto pr-1"
      style={{ maxHeight, scrollBehavior: paused ? "auto" : "smooth" }}
    >
      <AnimatePresence initial={false}>
        {messages.map((m) => {
          const icon = FEED_AGENT_ICON[m.agentId] || FEED_AGENT_ICON[m.agent]
          return (
            <motion.div
              key={m.id}
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
                style={{ background: toneColor[m.tone] }}
              />
              {icon && (
                <span className="flex items-center text-primary">{icon}</span>
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <span
                    className="text-[13px] font-bold text-text-primary"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {m.agent}
                  </span>
                  <span className="shrink-0 text-[11px] text-text-tertiary">
                    {m.timestamp}
                  </span>
                </div>
                <p
                  className="mt-0.5 text-[13px] text-text-secondary"
                  style={
                    mono
                      ? { fontFamily: "var(--font-mono)", fontSize: 12 }
                      : undefined
                  }
                >
                  {m.message}
                </p>
              </div>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
