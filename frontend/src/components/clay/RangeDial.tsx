import { useRef, useState } from "react"

interface Props {
  value: number
  min?: number
  max?: number
  onChange: (v: number) => void
  label?: string
}

export default function RangeDial({
  value,
  min = 0,
  max = 100,
  onChange,
  label,
}: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [drag, setDrag] = useState(false)
  const pct = ((value - min) / (max - min)) * 100

  const setFromClientX = (x: number) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const ratio = Math.min(1, Math.max(0, (x - rect.left) / rect.width))
    onChange(Math.round(min + ratio * (max - min)))
  }

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <div className="flex justify-between text-xs">
          <span className="font-medium text-text-secondary">{label}</span>
          <span
            className="font-bold text-text-primary"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {value}
          </span>
        </div>
      )}
      <div
        ref={ref}
        className="clay-inset relative h-4 cursor-pointer rounded-full"
        role="slider"
        aria-valuenow={value}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-label={label}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") onChange(Math.min(max, value + 1))
          if (e.key === "ArrowLeft") onChange(Math.max(min, value - 1))
        }}
        onPointerDown={(e) => {
          setDrag(true)
          setFromClientX(e.clientX)
        }}
        onPointerMove={(e) => drag && setFromClientX(e.clientX)}
        onPointerUp={() => setDrag(false)}
        onPointerLeave={() => setDrag(false)}
      >
        <div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            width: `${pct}%`,
            background: "linear-gradient(90deg,#a5b4fc,#6366f1)",
          }}
        />
        <div
          className="clay-sm absolute top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full bg-surface"
          style={{ left: `${pct}%` }}
        >
          {drag && (
            <span
              className="clay-sm absolute -top-8 left-1/2 -translate-x-1/2 rounded-full bg-primary px-2 py-0.5 text-[11px] font-bold text-white"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {value}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
