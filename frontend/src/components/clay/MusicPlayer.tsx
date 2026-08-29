import { motion } from "framer-motion"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  PlayIcon as PlayData,
  PauseIcon as PauseData,
} from "@hugeicons/core-free-icons"

interface Props {
  trackName: string
  artist: string
  isPlaying: boolean
  onPlayPause: () => void
  variant?: "original" | "alternative"
  badge?: string
}

export default function MusicPlayer({
  trackName,
  artist,
  isPlaying,
  onPlayPause,
  variant = "original",
  badge,
}: Props) {
  const flagged = variant === "original"
  return (
    <div
      className="clay-md flex flex-col items-center gap-3 bg-surface p-5"
      style={{ borderRadius: "var(--r-lg)" }}
    >
      <div
        className="clay-inset flex items-center justify-center rounded-full"
        style={{
          width: 96,
          height: 96,
          background: flagged
            ? "radial-gradient(circle at 30% 30%, #fca5a5, #f97066)"
            : "radial-gradient(circle at 30% 30%, #6ee7b7, #10b981)",
        }}
      >
        <div className="flex h-8 items-end gap-1">
          {[6, 14, 22, 12, 18].map((h, i) => (
            <motion.span
              key={i}
              className="w-1 rounded-full bg-white/90"
              animate={isPlaying ? { height: [h, h * 1.6, h] } : { height: h }}
              transition={{
                repeat: isPlaying ? Infinity : 0,
                duration: 0.7,
                delay: i * 0.1,
              }}
              style={{ height: h }}
            />
          ))}
        </div>
      </div>
      <div className="text-center">
        <div
          className="text-sm font-bold text-text-primary"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {trackName}
        </div>
        <div className="text-xs text-text-tertiary">{artist}</div>
      </div>
      {badge && (
        <span
          className="clay-sm rounded-full px-2.5 py-1 text-[11px] font-bold"
          style={{
            background: flagged ? "var(--warning-pale)" : "var(--accent-pale)",
            color: flagged ? "#b45309" : "#0e8f63",
            fontFamily: "var(--font-display)",
          }}
        >
          {badge}
        </span>
      )}
      <div className="flex w-full items-center gap-3">
        <motion.button
          onClick={onPlayPause}
          whileTap={{ scale: 0.9 }}
          className="clay-sm focus-clay flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white"
          style={{ background: "var(--primary)" }}
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <HugeiconsIcon icon={PauseData} size={18} />
          ) : (
            <HugeiconsIcon icon={PlayData} size={18} />
          )}
        </motion.button>
        <div className="clay-inset h-2 flex-1 overflow-hidden rounded-full">
          <motion.div
            className="h-full rounded-full"
            style={{ background: "linear-gradient(90deg,#a5b4fc,#6366f1)" }}
            animate={{ width: isPlaying ? ["10%", "90%"] : "35%" }}
            transition={{ duration: isPlaying ? 8 : 0.4, ease: "linear" }}
          />
        </div>
      </div>
    </div>
  )
}
