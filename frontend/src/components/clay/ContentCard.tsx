import { motion } from "framer-motion"
import type { ReactNode } from "react"

interface Props {
  title?: string
  subtitle?: string
  children: ReactNode
  footer?: ReactNode
  headerColor?: string
  className?: string
}

export default function ContentCard({
  title,
  subtitle,
  children,
  footer,
  headerColor,
  className = "",
}: Props) {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`clay-md flex flex-col overflow-hidden bg-surface ${className}`}
      style={{
        borderRadius: "var(--r-lg)",
        border: "1px solid rgba(0,0,0,0.04)",
      }}
    >
      {(title || headerColor) && (
        <div
          className="px-5 py-3.5"
          style={{
            background: headerColor ?? "transparent",
            borderBottom: "1px solid rgba(0,0,0,0.04)",
          }}
        >
          {title && (
            <h3
              className="text-sm font-bold"
              style={{
                fontFamily: "var(--font-display)",
                color: headerColor ? "#fff" : "var(--text-primary)",
              }}
            >
              {title}
            </h3>
          )}
          {subtitle && (
            <p
              className="text-xs"
              style={{
                color: headerColor
                  ? "rgba(255,255,255,0.85)"
                  : "var(--text-tertiary)",
              }}
            >
              {subtitle}
            </p>
          )}
        </div>
      )}
      <div className="flex-1 p-5">{children}</div>
      {footer && (
        <div className="border-t border-black/5 px-5 py-3">{footer}</div>
      )}
    </motion.div>
  )
}
