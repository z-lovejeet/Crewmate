import { motion } from "framer-motion"
import type { ReactNode } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  CheckmarkSquare03Icon as CheckData,
  Alert02Icon as AlertData,
} from "@hugeicons/core-free-icons"

export interface ChecklistItem {
  id: string
  label: string
  checked: boolean
  warn?: boolean
}

interface Props {
  title: string
  items: ChecklistItem[]
  onToggle: (id: string) => void
  headerRight?: ReactNode
}

export default function ChecklistCard({
  title,
  items,
  onToggle,
  headerRight,
}: Props) {
  const done = items.filter((i) => i.checked).length
  const pct = Math.round((done / items.length) * 100)
  return (
    <div
      className="clay-md flex flex-col gap-3 bg-surface p-5"
      style={{ borderRadius: "var(--r-lg)" }}
    >
      <div className="flex items-center justify-between">
        <h4
          className="text-sm font-bold text-text-primary"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {title}
        </h4>
        {headerRight}
      </div>
      <ul className="flex flex-col gap-2">
        {items.map((it) => (
          <li key={it.id}>
            <button
              onClick={() => onToggle(it.id)}
              className="focus-clay flex w-full items-center gap-3 rounded-xl px-2 py-1.5 text-left hover:bg-bg-secondary"
            >
              <motion.span
                animate={{
                  background: it.checked
                    ? "var(--primary)"
                    : it.warn
                      ? "var(--warning-pale)"
                      : "var(--bg-tertiary)",
                }}
                className="clay-sm flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white"
              >
                {it.checked ? (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: [0, 1.3, 1] }}
                  >
                    <HugeiconsIcon icon={CheckData} size={14} />
                  </motion.span>
                ) : it.warn ? (
                  <span style={{ color: "var(--warning)" }}>
                    <HugeiconsIcon icon={AlertData} size={14} />
                  </span>
                ) : null}
              </motion.span>
              <span
                className={`text-sm ${
                  it.checked ? "text-text-primary" : "text-text-secondary"
                }`}
              >
                {it.label}
              </span>
            </button>
          </li>
        ))}
      </ul>
      <div className="mt-1 flex items-center gap-3">
        <div className="clay-inset h-2 flex-1 overflow-hidden rounded-full">
          <motion.div
            className="h-full rounded-full"
            style={{ background: "linear-gradient(90deg,#6ee7b7,#10b981)" }}
            animate={{ width: `${pct}%` }}
            transition={{ type: "spring", stiffness: 80, damping: 15 }}
          />
        </div>
        <span
          className="text-xs font-bold text-text-secondary"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {pct}%
        </span>
      </div>
    </div>
  )
}
