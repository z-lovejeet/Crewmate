import { motion } from "framer-motion"
import type { ReactNode } from "react"

interface Props {
  children: ReactNode
  onClose?: () => void
  asModal?: boolean
}

export default function GlassOverlay({ children, onClose, asModal }: Props) {
  if (asModal) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-center justify-center p-6"
        style={{
          background: "rgba(30,41,59,0.25)",
          backdropFilter: "blur(4px)",
        }}
      >
        <motion.div
          initial={{ scale: 0.92, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.92, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-lg p-6"
          style={{
            background: "rgba(255,255,255,0.75)",
            backdropFilter: "blur(20px)",
            borderRadius: 24,
            border: "1px solid rgba(255,255,255,0.6)",
            boxShadow: "0 24px 60px rgba(0,0,0,0.18)",
          }}
        >
          {children}
        </motion.div>
      </motion.div>
    )
  }
  return (
    <div
      className="p-6"
      style={{
        background: "rgba(255,255,255,0.7)",
        backdropFilter: "blur(20px)",
        borderRadius: 24,
        border: "1px solid rgba(255,255,255,0.6)",
      }}
    >
      {children}
    </div>
  )
}
