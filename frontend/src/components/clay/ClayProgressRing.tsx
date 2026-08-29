import { motion } from "framer-motion"

type Variant = "primary" | "warning" | "danger" | "accent"
type Size = "sm" | "md" | "lg"

interface Props {
  value: number
  label?: string
  size?: Size
  variant?: Variant
  suffix?: string
}

const dims: Record<Size, { px: number stroke: number font: number }> = {
  sm: { px: 80, stroke: 8, font: 20 },
  md: { px: 120, stroke: 11, font: 30 },
  lg: { px: 180, stroke: 15, font: 46 },
}

const grads: Record<Variant, [string, string]> = {
  primary: ["#a5b4fc", "#6366f1"],
  warning: ["#fcd34d", "#f59e0b"],
  danger: ["#fca5a5", "#ef4444"],
  accent: ["#6ee7b7", "#10b981"],
}

export default function ClayProgressRing({
  value,
  label,
  size = "md",
  variant = "primary",
  suffix = "%",
}: Props) {
  const { px, stroke, font } = dims[size]
  const r = (px - stroke) / 2 - 6
  const c = 2 * Math.PI * r
  const [from, to] = grads[variant]
  const gid = `ring-${variant}-${size}`

  return (
    <div
      className="flex flex-col items-center gap-3"
      role="img"
      aria-label={`${label ?? "Progress"}: ${value}${suffix}`}
    >
      <div
        className="clay-md relative flex items-center justify-center rounded-full bg-surface"
        style={{ width: px, height: px }}
      >
        <svg width={px} height={px} className="-rotate-90">
          <defs>
            <linearGradient id={gid} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={from} />
              <stop offset="100%" stopColor={to} />
            </linearGradient>
          </defs>
          <circle
            cx={px / 2}
            cy={px / 2}
            r={r}
            fill="none"
            stroke="#eceaf3"
            strokeWidth={stroke}
          />
          <motion.circle
            cx={px / 2}
            cy={px / 2}
            r={r}
            fill="none"
            stroke={`url(#${gid})`}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={c}
            initial={{ strokeDashoffset: c }}
            animate={{ strokeDashoffset: c - (value / 100) * c }}
            transition={{
              type: "spring",
              stiffness: 60,
              damping: 15,
              duration: 1.2,
            }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: font,
            }}
          >
            {value}
            <span
              style={{ fontSize: font * 0.5 }}
              className="text-text-tertiary"
            >
              {suffix}
            </span>
          </span>
        </div>
      </div>
      {label && (
        <span
          className="text-sm font-medium text-text-secondary"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {label}
        </span>
      )}
    </div>
  )
}
