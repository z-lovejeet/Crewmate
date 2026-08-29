import { TrendingUp, TrendingDown } from "lucide-react"

interface Props {
  value: string
  label: string
  trend?: number
  tintColor?: string
}

export default function StatDisplay({ value, label, trend, tintColor }: Props) {
  const up = (trend ?? 0) >= 0
  return (
    <div
      className="clay-sm flex flex-col gap-1 rounded-2xl p-5"
      style={{
        background: tintColor ?? "var(--surface)",
        borderRadius: "var(--r-md)",
      }}
    >
      <div className="flex items-end gap-2">
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            fontSize: 40,
            lineHeight: 1,
          }}
        >
          {value}
        </span>
        {trend !== undefined && (
          <span
            className="mb-1 text-sm font-bold flex items-center gap-1"
            style={{
              color: up ? "var(--accent)" : "var(--error)",
              fontFamily: "var(--font-display)",
            }}
          >
            {up ? <TrendingUp size={16} /> : <TrendingDown size={16} />}{" "}
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      <span className="text-sm font-medium text-text-secondary">{label}</span>
    </div>
  )
}
