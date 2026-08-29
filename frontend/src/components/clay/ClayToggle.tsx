import { motion } from "framer-motion"

interface Props {
  checked: boolean
  onChange: (v: boolean) => void
  label?: string
  disabled?: boolean
}

export default function ClayToggle({
  checked,
  onChange,
  label,
  disabled,
}: Props) {
  return (
    <label
      className={`inline-flex items-center gap-2.5 ${
        disabled ? "opacity-50" : "cursor-pointer"
      }`}
    >
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className="clay-inset focus-clay relative flex items-center rounded-full transition-colors"
        style={{
          width: 48,
          height: 28,
          padding: 3,
          justifyContent: checked ? "flex-end" : "flex-start",
          background: checked ? "var(--primary)" : "var(--bg-tertiary)",
        }}
      >
        <motion.span
          layout
          transition={{ type: "spring", stiffness: 400, damping: 22 }}
          className="clay-sm block rounded-full bg-surface"
          style={{ width: 22, height: 22 }}
        />
      </button>
      {label && (
        <span className="text-sm font-medium text-text-secondary">{label}</span>
      )}
    </label>
  )
}
