import { AnimatePresence, motion } from "framer-motion"
import { useState } from "react"
import type { ReactNode } from "react"
import { CaretLineRightIcon } from "@phosphor-icons/react"

export interface DrawerSection {
  id: string
  icon: ReactNode
  label: string
  accent?: string
  content: ReactNode
}

interface Props {
  sections: DrawerSection[]
  allowMultiple?: boolean
}

export default function AccordionDrawer({
  sections,
  allowMultiple = false,
}: Props) {
  const [open, setOpen] = useState<string[]>(
    sections[0] ? [sections[0].id] : [],
  )

  const toggle = (id: string) =>
    setOpen((cur) =>
      cur.includes(id)
        ? cur.filter((x) => x !== id)
        : allowMultiple
          ? [...cur, id]
          : [id],
    )

  return (
    <div className="flex flex-col gap-3">
      {sections.map((s) => {
        const isOpen = open.includes(s.id)
        return (
          <div
            key={s.id}
            className="clay-sm overflow-hidden bg-surface"
            style={{ borderRadius: "var(--r-md)" }}
          >
            <button
              onClick={() => toggle(s.id)}
              aria-expanded={isOpen}
              className="focus-clay flex w-full items-center gap-3 px-4 py-3.5 text-left"
              style={
                isOpen && s.accent
                  ? { borderLeft: `4px solid ${s.accent}` }
                  : { borderLeft: "4px solid transparent" }
              }
            >
              <span className="flex items-center text-text-secondary">
                {s.icon}
              </span>
              <span
                className="flex-1 text-sm font-bold text-text-primary"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {s.label}
              </span>
              <motion.span
                animate={{ rotate: isOpen ? 90 : 0 }}
                className="text-text-tertiary flex items-center"
              >
                <CaretLineRightIcon size={16} />
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 26 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 pt-1 text-sm text-text-secondary">
                    {s.content}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}
