import { motion } from "framer-motion"
import type { ReactNode } from "react"

type Variant = "primary" | "secondary" | "danger" | "accent" | "ghost"
type Size = "sm" | "md" | "lg"

interface ClayButtonProps {
  label: string
  onClick?: () => void
  icon?: ReactNode
  variant?: Variant
  size?: Size
  isLoading?: boolean
  disabled?: boolean
  className?: string
  type?: "button" | "submit"
}

const sizes: Record<Size, string> = {
  sm: "text-[13px] px-3.5 py-2 gap-1.5",
  md: "text-sm px-5 py-2.5 gap-2",
  lg: "text-[15px] px-7 py-3.5 gap-2.5",
}

const variantStyle: Record<Variant, {
  cls: string
  style?: React.CSSProperties
}> = {
  primary: {
    cls: "text-white clay-md",
    style: { background: "linear-gradient(145deg, #7c7ff5, #5457e8)" },
  },
  accent: {
    cls: "text-white clay-md",
    style: { background: "linear-gradient(145deg, #16c98d, #0ea472)" },
  },
  danger: {
    cls: "text-white clay-md",
    style: { background: "linear-gradient(145deg, #f8837a, #e35c52)" },
  },
  secondary: {
    cls: "bg-surface text-primary clay-md",
  },
  ghost: {
    cls: "bg-transparent text-text-secondary hover:text-text-primary",
  },
}

export default function ClayButton({
  label,
  onClick,
  icon,
  variant = "primary",
  size = "md",
  isLoading,
  disabled,
  className = "",
  type = "button",
}: ClayButtonProps) {
  const v = variantStyle[variant]
  const isDisabled = disabled || isLoading
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      whileHover={isDisabled ? undefined : { scale: 1.02, y: -1 }}
      whileTap={isDisabled ? undefined : { scale: 0.96 }}
      transition={{ type: "spring", stiffness: 400, damping: 15 }}
      className={`focus-clay inline-flex items-center justify-center font-semibold whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed ${sizes[size]} ${v.cls} ${className}`}
      style={{
        borderRadius: 16,
        fontFamily: "var(--font-display)",
        ...v.style,
      }}
    >
      {isLoading ? (
        <span className="flex items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="inline-block h-1.5 w-1.5 rounded-full bg-current"
              animate={{ y: [0, -4, 0] }}
              transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.12 }}
            />
          ))}
        </span>
      ) : (
        <>
          {icon && <span className="flex items-center">{icon}</span>}
          {label}
        </>
      )}
    </motion.button>
  )
}
