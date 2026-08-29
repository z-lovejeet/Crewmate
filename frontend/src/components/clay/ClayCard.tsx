import { motion } from "framer-motion"
import type { ReactNode } from "react"

interface ClayCardProps {
  children: ReactNode
  accent?: string
  accentSide?: "left" | "top"
  onClick?: () => void
  isSelected?: boolean
  className?: string
  hover?: boolean
}

export default function ClayCard({
  children,
  accent,
  accentSide = "left",
  onClick,
  isSelected,
  className = "",
  hover = true,
}: ClayCardProps) {
  const interactive = Boolean(onClick)
  return (
    <motion.div
      onClick={onClick}
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
      onKeyDown={
        interactive
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault()
                onClick?.()
              }
            }
          : undefined
      }
      whileHover={hover ? { y: -4 } : undefined}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`clay-lg focus-clay relative overflow-hidden bg-surface p-6 ${
        interactive ? "cursor-pointer" : ""
      } ${isSelected ? "ring-2 ring-primary" : ""} ${className}`}
      style={{
        borderRadius: "var(--r-lg)",
        border: "1px solid rgba(0,0,0,0.04)",
      }}
    >
      {accent && (
        <span
          aria-hidden
          className="absolute"
          style={
            accentSide === "left"
              ? { left: 0, top: 0, bottom: 0, width: 4, background: accent }
              : { left: 0, right: 0, top: 0, height: 4, background: accent }
          }
        />
      )}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-16"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.6), transparent)",
        }}
      />
      <div className="relative">{children}</div>
    </motion.div>
  )
}
