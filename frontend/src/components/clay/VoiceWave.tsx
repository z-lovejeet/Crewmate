import { motion } from "framer-motion"
import { Mic01Icon } from "../../lib/icons"

interface Props {
  level?: number
  isActive: boolean
  onMicClick: () => void
}

export default function VoiceWave({ isActive, onMicClick }: Props) {
  return (
    <div className="clay-inset flex items-center gap-3 rounded-2xl bg-surface/60 p-3">
      <motion.button
        onClick={onMicClick}
        whileTap={{ scale: 0.9 }}
        animate={
          isActive
            ? { boxShadow: ["0 0 0 0 #6366f155", "0 0 0 8px #6366f100"] }
            : {}
        }
        transition={{ repeat: isActive ? Infinity : 0, duration: 1.4 }}
        className="clay-sm focus-clay flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white"
        style={{ background: isActive ? "var(--secondary)" : "var(--primary)" }}
        aria-label={isActive ? "Stop listening" : "Start voice command"}
        aria-pressed={isActive}
      >
        <Mic01Icon size={20} />
      </motion.button>
      <div className="flex flex-1 items-center gap-1.5">
        {isActive ? (
          <div className="flex h-6 items-center gap-1">
            {[10, 18, 24, 14, 20, 12, 16].map((h, i) => (
              <motion.span
                key={i}
                className="w-1 rounded-full"
                style={{
                  background: "linear-gradient(180deg,#a5b4fc,#6366f1)",
                }}
                animate={{ height: [h * 0.4, h, h * 0.4] }}
                transition={{
                  repeat: Infinity,
                  duration: 0.6,
                  delay: i * 0.08,
                }}
              />
            ))}
          </div>
        ) : (
          <span className="text-xs text-text-tertiary">Tap to speak</span>
        )}
        {isActive && (
          <span className="ml-1 text-xs font-medium text-secondary">
            Listening…
          </span>
        )}
      </div>
    </div>
  )
}
