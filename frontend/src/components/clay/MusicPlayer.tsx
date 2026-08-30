import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  PlayIcon as PlayData,
  PauseIcon as PauseData,
  VolumeHighIcon as VolumeData,
  VolumeMute01Icon as MuteData,
  CheckmarkSquare03Icon as CheckData,
  DownloadSquare01Icon as DownloadData,
} from "@hugeicons/core-free-icons"

interface Props {
  trackName: string
  artist: string
  isPlaying: boolean
  onPlayPause: () => void
  onApply?: () => void
  isApplied?: boolean
  variant?: "original" | "alternative"
  badge?: string
  durationSec?: number
}

export default function MusicPlayer({
  trackName,
  artist,
  isPlaying,
  onPlayPause,
  onApply,
  isApplied = false,
  variant = "original",
  badge,
  durationSec = 45,
}: Props) {
  const flagged = variant === "original"
  const audioCtxRef = useRef<AudioContext | null>(null)
  const intervalRef = useRef<any>(null)
  const [progressSec, setProgressSec] = useState(0)
  const [muted, setMuted] = useState(false)
  const [downloaded, setDownloaded] = useState(false)

  // Real Web Audio API synthesizer for interactive audio
  useEffect(() => {
    if (isPlaying) {
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
        if (AudioCtx) {
          const ctx = new AudioCtx()
          audioCtxRef.current = ctx

          const notes = flagged
            ? [130.81, 155.56, 174.61, 196.00] // Dark C minor gritty
            : [261.63, 329.63, 392.00, 523.25] // Uplifting C major Lyria

          let noteIdx = Math.floor(progressSec * 2)
          const playNote = () => {
            if (ctx.state === "closed" || muted) return
            const osc = ctx.createOscillator()
            const gain = ctx.createGain()

            osc.type = flagged ? "sawtooth" : "sine"
            osc.frequency.setValueAtTime(notes[noteIdx % notes.length], ctx.currentTime)

            gain.gain.setValueAtTime(0.08, ctx.currentTime)
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45)

            osc.connect(gain)
            gain.connect(ctx.destination)

            osc.start()
            osc.stop(ctx.currentTime + 0.45)
            noteIdx++
            setProgressSec((p) => (p >= durationSec ? 0 : p + 0.5))
          }

          playNote()
          intervalRef.current = setInterval(playNote, 500)
        }
      } catch (e) {
        console.warn("Audio synthesis notice:", e)
      }
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (audioCtxRef.current && audioCtxRef.current.state !== "closed") {
        audioCtxRef.current.close().catch(() => {})
      }
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (audioCtxRef.current && audioCtxRef.current.state !== "closed") {
        audioCtxRef.current.close().catch(() => {})
      }
    }
  }, [isPlaying, flagged, muted, durationSec])

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const newProgress = Math.max(0, Math.min(1, clickX / rect.width)) * durationSec
    setProgressSec(Math.round(newProgress))
  }

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60)
    const s = Math.floor(secs % 60)
    return `${m}:${s < 10 ? "0" : ""}${s}`
  }

  const handleDownload = () => {
    setDownloaded(true)
    setTimeout(() => setDownloaded(false), 2500)
  }

  const progressPercent = Math.min(100, Math.max(0, (progressSec / durationSec) * 100))

  return (
    <div
      className={`flex flex-col justify-between p-5 rounded-2xl bg-[var(--surface)] border transition-all shadow-xs ${
        isApplied ? "border-emerald-500 ring-2 ring-emerald-200" : "border-[var(--border)]"
      }`}
    >
      <div>
        {/* Visual Disk Orb with Waveform Animation */}
        <div className="flex items-center justify-between mb-3">
          <div
            className="clay-inset flex items-center justify-center rounded-2xl p-3 shadow-inner"
            style={{
              width: 56,
              height: 56,
              background: flagged
                ? "radial-gradient(circle at 30% 30%, #fca5a5, #f97066)"
                : "radial-gradient(circle at 30% 30%, #6ee7b7, #10b981)",
            }}
          >
            <div className="flex h-6 items-end gap-0.5">
              {[4, 10, 18, 8, 14].map((h, i) => (
                <motion.span
                  key={i}
                  className="w-1 rounded-full bg-white/90"
                  animate={isPlaying ? { height: [h, Math.min(22, h * 1.8), h] } : { height: h }}
                  transition={{
                    repeat: isPlaying ? Infinity : 0,
                    duration: 0.5,
                    delay: i * 0.08,
                  }}
                  style={{ height: h }}
                />
              ))}
            </div>
          </div>

          <div className="flex flex-col items-end gap-1">
            {badge && (
              <span
                className="px-2.5 py-0.5 rounded-full text-[10px] font-bold"
                style={{
                  background: flagged ? "var(--warning-pale)" : "var(--accent-pale)",
                  color: flagged ? "#b45309" : "#0e8f63",
                  fontFamily: "var(--font-display)",
                }}
              >
                {badge}
              </span>
            )}
            <button
              onClick={() => setMuted(!muted)}
              className="text-text-tertiary hover:text-text-primary text-xs p-1 transition cursor-pointer"
              title={muted ? "Unmute" : "Mute"}
            >
              <HugeiconsIcon icon={muted ? MuteData : VolumeData} size={15} />
            </button>
          </div>
        </div>

        {/* Track info */}
        <div className="flex flex-col gap-0.5 mb-3">
          <h4
            className="text-sm font-bold text-text-primary line-clamp-1"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {trackName}
          </h4>
          <p className="text-xs text-text-tertiary line-clamp-1">{artist}</p>
        </div>

        {/* Playback Controls & Interactive Scrubber */}
        <div className="flex items-center gap-3 mb-2">
          <motion.button
            onClick={onPlayPause}
            whileTap={{ scale: 0.92 }}
            className="focus-clay flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white cursor-pointer transition shadow-xs"
            style={{ background: flagged ? "#ef4444" : "var(--primary)" }}
            aria-label={isPlaying ? "Pause" : "Play"}
            title={isPlaying ? "Pause audio track" : "Play audio sample"}
          >
            {isPlaying ? (
              <HugeiconsIcon icon={PauseData} size={16} />
            ) : (
              <HugeiconsIcon icon={PlayData} size={16} />
            )}
          </motion.button>

          <div className="flex-1 flex flex-col gap-1">
            <div
              onClick={handleSeek}
              className="clay-inset h-2 w-full overflow-hidden rounded-full bg-[var(--surface-sunken)] cursor-pointer relative"
              title="Click to seek"
            >
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: flagged
                    ? "linear-gradient(90deg,#fca5a5,#ef4444)"
                    : "linear-gradient(90deg,#6ee7b7,#10b981)",
                }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.2, ease: "linear" }}
              />
            </div>
            <div className="flex items-center justify-between text-[10px] text-text-tertiary font-mono">
              <span>{formatTime(progressSec)}</span>
              <span>{formatTime(durationSec)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-2 border-t border-[var(--border)] flex items-center justify-between gap-2 mt-2">
        {!flagged ? (
          <button
            onClick={onApply}
            className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              isApplied
                ? "bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold"
                : "bg-primary-pale text-primary hover:bg-primary hover:text-white"
            }`}
          >
            {isApplied ? (
              <>
                <HugeiconsIcon icon={CheckData} size={13} />
                <span>Applied to Video</span>
              </>
            ) : (
              <span>Apply as Audio Shield</span>
            )}
          </button>
        ) : (
          <span className="text-[11px] text-red-500 font-semibold">
            Strike Risk: Content ID Match
          </span>
        )}

        <button
          onClick={handleDownload}
          className="p-1.5 rounded-xl border border-[var(--border)] text-text-secondary hover:text-primary transition cursor-pointer"
          title="Export Royalty-Free Audio File (.wav)"
        >
          <HugeiconsIcon icon={DownloadData} size={14} />
        </button>
      </div>
    </div>
  )
}

