import React, { useState } from "react"
import { NavLink } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { clsx } from "clsx"
import { NAV } from "../../lib/nav"
import {
  NotificationCircleIcon,
  Mic01Icon,
  Settings01Icon,
  MenuSquareIcon,
} from "../../lib/icons"
import { XIcon } from "../../lib/icons"

interface NavbarProps {
  notifications?: number
  onVoice?: () => void
  listening?: boolean
}

export const Navbar: React.FC<NavbarProps> = ({
  notifications = 0,
  onVoice,
  listening = false,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-30 w-full bg-[var(--surface)] clay-md h-16 flex items-center px-4 md:px-8 justify-between">
      {/* Left: Logo */}
      <NavLink
        to="/"
        className="flex items-center gap-3 no-underline outline-none focus-clay rounded-xl px-2 py-1"
      >
        <div className="clay-sm bg-[var(--primary)] text-white font-[var(--font-display)] font-extrabold flex items-center justify-center w-8 h-8 rounded-full text-sm">
          CM
        </div>
        <span className="font-[var(--font-display)] font-extrabold text-[var(--primary)] text-lg tracking-tight hidden sm:block">
          Crewmate
        </span>
      </NavLink>

      {/* Center: Nav Links (Desktop) */}
      <div className="hidden md:flex items-center gap-2">
        {NAV.map((item) => (
          <NavLink
            key={item.key}
            to={item.path}
            className={({ isActive }) =>
              clsx(
                "flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-colors outline-none focus-clay",
                isActive
                  ? "bg-[var(--primary-pale)] text-[var(--primary)] clay-inset"
                  : "text-[var(--text-secondary)] hover:bg-[var(--tertiary)] hover:text-[var(--text-primary)]",
              )
            }
          >
            {item.icon && <item.icon size={18} />}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
          className="relative flex items-center justify-center w-10 h-10 rounded-full clay-sm bg-[var(--surface)] text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors focus-clay"
          aria-label="Notifications"
        >
          <NotificationCircleIcon size={20} />
          {notifications > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full clay-sm">
              {notifications > 9 ? "9+" : notifications}
            </span>
          )}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
          onClick={onVoice}
          className={clsx(
            "flex items-center justify-center w-10 h-10 rounded-full clay-sm transition-colors focus-clay",
            listening
              ? "bg-[var(--primary)] text-white clay-pressed"
              : "bg-[var(--surface)] text-[var(--text-secondary)] hover:text-[var(--primary)]",
          )}
          aria-label="Voice Command"
        >
          <Mic01Icon size={20} />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
          className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full clay-sm bg-[var(--surface)] text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors focus-clay"
          aria-label="Settings"
        >
          <Settings01Icon size={20} />
        </motion.button>

        {/* Mobile Menu Toggle */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl clay-sm bg-[var(--surface)] text-[var(--text-primary)] focus-clay"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <XIcon size={20} /> : <MenuSquareIcon size={20} />}
        </motion.button>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 w-full bg-[var(--surface)] clay-md flex flex-col p-4 md:hidden z-20 rounded-b-[var(--r-md)]"
          >
            {NAV.map((item) => (
              <NavLink
                key={item.key}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  clsx(
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors mb-2 outline-none focus-clay",
                    isActive
                      ? "bg-[var(--primary-pale)] text-[var(--primary)] clay-inset"
                      : "text-[var(--text-secondary)] hover:bg-[var(--tertiary)] hover:text-[var(--text-primary)]",
                  )
                }
              >
                {item.icon && <item.icon size={20} />}
                <span>{item.label}</span>
              </NavLink>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
