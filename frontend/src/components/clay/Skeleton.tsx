import { motion } from "framer-motion"

interface Props {
  className?: string
  rounded?: number
}

export default function Skeleton({ className = "", rounded = 16 }: Props) {
  return (
    <motion.div
      className={`clay-inset ${className}`}
      style={{ borderRadius: rounded, background: "var(--bg-secondary)" }}
      animate={{ opacity: [0.4, 0.7, 0.4] }}
      transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}
    />
  )
}
