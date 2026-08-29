import { motion } from "framer-motion"
import type { Note } from "../../lib/api"

interface Props {
  notes: Note[]
}

export default function NotesBoard({ notes }: Props) {
  return (
    <div
      className="clay-inset rounded-2xl p-4"
      style={{ background: "var(--bg-secondary)", borderRadius: "var(--r-lg)" }}
    >
      <div className="columns-2 gap-3 [column-fill:_balance]">
        {notes.map((n, i) => (
          <motion.div
            key={n.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              delay: i * 0.06,
              type: "spring",
              stiffness: 260,
              damping: 20,
            }}
            whileHover={{ rotate: 0, y: -3 }}
            className="clay-sm mb-3 inline-block w-full break-inside-avoid p-3.5"
            style={{
              background: n.color,
              borderRadius: 16,
              rotate: `${(i % 2 === 0 ? -1 : 1) * (1 + (i % 3))}deg`,
            }}
          >
            <span
              className="mb-2 block h-2.5 w-2.5 rounded-full"
              style={{ background: n.pin }}
            />
            <p className="text-[13px] leading-snug text-text-primary">
              {n.text}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
