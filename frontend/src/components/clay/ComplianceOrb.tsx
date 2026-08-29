import { motion } from "framer-motion"

interface Platform {
  name: string
  color: string
}

interface Props {
  platforms: Platform[]
  isScanning?: boolean
  score?: number
  size?: number
}

export default function ComplianceOrb({
  platforms,
  isScanning = true,
  score = 84,
  size = 260,
}: Props) {
  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      {/* radar pings */}
      {isScanning &&
        [0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="absolute rounded-full border-2"
            style={{
              borderColor: "var(--primary-light)",
              width: size * 0.5,
              height: size * 0.5,
            }}
            animate={{ scale: [0.6, 1.9], opacity: [0.5, 0] }}
            transition={{
              repeat: Infinity,
              duration: 2.6,
              delay: i * 0.85,
              ease: "easeOut",
            }}
          />
        ))}

      {/* concentric rings */}
      {[1, 0.78, 0.56].map((s, i) => (
        <div
          key={i}
          className={
            i === 0
              ? "clay-lg absolute rounded-full bg-surface"
              : "clay-inset absolute rounded-full"
          }
          style={{
            width: size * s,
            height: size * s,
            background: i === 0 ? undefined : "var(--bg-secondary)",
          }}
        />
      ))}

      <div className="relative flex flex-col items-center gap-1">
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            fontSize: size * 0.2,
          }}
        >
          {score}
          <span
            className="text-text-tertiary"
            style={{ fontSize: size * 0.09 }}
          >
            %
          </span>
        </span>
        <span className="text-xs font-medium text-text-secondary">
          compliant
        </span>
      </div>

      {/* platform dots orbiting */}
      {platforms.map((p, i) => {
        const angle = (i / platforms.length) * Math.PI * 2 - Math.PI / 2
        const rad = size * 0.42
        return (
          <motion.span
            key={p.name}
            className="clay-sm absolute flex h-9 w-9 items-center justify-center rounded-full bg-surface text-[10px] font-bold"
            style={{
              left: size / 2 + Math.cos(angle) * rad - 18,
              top: size / 2 + Math.sin(angle) * rad - 18,
            }}
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ repeat: Infinity, duration: 2, delay: i * 0.3 }}
            title={p.name}
          >
            <span
              className="h-3 w-3 rounded-full"
              style={{ background: p.color }}
            />
          </motion.span>
        )
      })}
    </div>
  )
}
