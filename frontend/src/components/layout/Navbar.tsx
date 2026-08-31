import React, { useState } from "react"
import { NavLink, useLocation } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { clsx } from "clsx"
import { NAV } from "../../lib/nav"
import {
  MenuSquareIcon,
  XIcon,
  SparkleIcon,
} from "../../lib/icons"
import { useAuth } from "../../context/AuthContext"
import { AuthModal } from "../auth/AuthModal"
import { useStudioStore } from "../../store/useStudioStore"

interface NavbarProps {
  notifications?: number
}

// Compact labels for high-end horizontal dock
const SHORT_LABELS: Record<string, string> = {
  command: "Command",
  channel: "Channel DNA",
  trends: "Trends",
  scripts: "Scripts",
  media: "Media",
  contracts: "Contracts",
  compliance: "Compliance",
  fleet: "Fleet",
}

export const Navbar: React.FC<NavbarProps> = () => {
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user, isAuthenticated, logout, openAuthModal } = useAuth()
  const { disabledAgents } = useStudioStore()
  const activeCount = Math.max(0, 15 - (disabledAgents?.length || 0))

  return (
    <nav className="sticky top-0 z-40 w-full bg-[var(--surface)]/95 backdrop-blur-md border-b border-[var(--border)] h-16 flex items-center justify-between px-3 sm:px-6 lg:px-8 transition-all">
      {/* ─── 1. Left: Brand Logo & Version ─────────────────────────────── */}
      <div className="flex items-center gap-3 shrink-0">
        <NavLink
          to="/"
          className="flex items-center gap-2.5 no-underline outline-none group py-1"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-50 to-primary/10 border border-primary/20 flex items-center justify-center p-1 shadow-2xs transition-transform duration-200 group-hover:scale-105">
            <img
              src="/logo-icon.png"
              alt="Crewmate Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex items-center gap-1.5">
            <span
              className="font-extrabold text-[var(--text-primary)] text-lg tracking-tight leading-none"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Crew<span className="text-[var(--primary)]">mate</span>
            </span>
          </div>
        </NavLink>
      </div>

      {/* ─── 2. Center: Segmented Studio Dock (Desktop) ────────────────── */}
      <div className="hidden lg:flex items-center p-1 rounded-2xl bg-[var(--surface-sunken)] border border-[var(--border)] shadow-xs">
        {NAV.map((item) => {
          const isActive = location.pathname === item.path
          const shortLabel = SHORT_LABELS[item.key] || item.label

          return (
            <NavLink
              key={item.key}
              to={item.path}
              className={clsx(
                "relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-150 outline-none no-underline",
                isActive
                  ? "bg-[var(--surface)] text-[var(--primary)] shadow-xs font-bold"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface)]/50"
              )}
            >
              {item.icon && (
                <span
                  className={clsx(
                    "flex items-center justify-center transition-colors",
                    isActive ? "text-[var(--primary)]" : "text-[var(--text-tertiary)]"
                  )}
                >
                  <item.icon size={15} />
                </span>
              )}
              <span>{shortLabel}</span>

              {/* Subtle active indicator pip */}
              {isActive && (
                <motion.span
                  layoutId="nav-active-pill"
                  className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-3 h-0.5 rounded-full bg-[var(--primary)]"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </NavLink>
          )
        })}
      </div>

      {/* ─── 3. Right: Fleet Status, Operations Drawer, Profile & Menu ──────────── */}
      <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
        {/* Live Fleet Status Pill (Desktop) */}
        <NavLink
          to="/fleet"
          className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/60 text-emerald-700 text-xs font-semibold hover:bg-emerald-100/60 transition no-underline"
          title={`${activeCount} of 15 Autonomous Agents Active on Vertex AI`}
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>{activeCount} Online</span>
        </NavLink>

        {/* User Profile / Sign In */}
        {isAuthenticated && user ? (
          <div className="flex items-center gap-2 pl-2 pr-1.5 py-1 rounded-xl bg-[var(--surface)] border border-[var(--border)] shadow-xs">
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName || "User"}
                referrerPolicy="no-referrer"
                crossOrigin="anonymous"
                onError={(e) => {
                  e.currentTarget.style.display = "none"
                  const parent = e.currentTarget.parentElement
                  if (parent && !parent.querySelector(".fallback-avatar")) {
                    const fallback = document.createElement("div")
                    fallback.className = "fallback-avatar w-6 h-6 rounded-lg bg-gradient-to-tr from-indigo-500 to-primary text-white text-[10px] font-bold flex items-center justify-center"
                    fallback.innerText = (user.displayName || user.email || "U")[0].toUpperCase()
                    parent.prepend(fallback)
                  }
                }}
                className="w-6 h-6 rounded-lg object-cover border border-white/20 shadow-2xs"
              />
            ) : (
              <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-indigo-500 to-primary text-white text-[10px] font-bold flex items-center justify-center shadow-2xs">
                {(user.displayName || user.email || "U")[0].toUpperCase()}
              </div>
            )}
            <span className="hidden sm:inline text-xs font-semibold text-[var(--text-primary)] max-w-[100px] truncate">
              {user.displayName || user.email?.split("@")[0]}
            </span>
            <button
              onClick={logout}
              className="text-[11px] text-[var(--text-tertiary)] hover:text-red-500 font-medium px-1.5 py-0.5 rounded transition cursor-pointer"
              title="Sign Out"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            onClick={openAuthModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary text-white text-xs font-bold hover:brightness-110 transition cursor-pointer shadow-xs"
          >
            <SparkleIcon size={13} />
            <span>Sign In</span>
          </motion.button>
        )}

        {/* Mobile Menu Hamburger Button */}
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden flex items-center justify-center w-9 h-9 rounded-xl bg-[var(--surface)] text-[var(--text-primary)] border border-[var(--border)] focus-clay cursor-pointer"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <XIcon size={18} /> : <MenuSquareIcon size={18} />}
        </motion.button>
      </div>

      {/* Auth Modal Trigger */}
      <AuthModal />

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 w-full bg-[var(--surface)]/98 backdrop-blur-xl border-b border-[var(--border)] flex flex-col p-4 lg:hidden z-50 shadow-xl"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {NAV.map((item) => {
                const isActive = location.pathname === item.path
                return (
                  <NavLink
                    key={item.key}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={clsx(
                      "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all no-underline border",
                      isActive
                        ? "bg-primary-pale text-primary border-primary/30 font-bold"
                        : "text-[var(--text-secondary)] border-[var(--border)] hover:bg-[var(--tertiary)] hover:text-[var(--text-primary)]"
                    )}
                  >
                    {item.icon && (
                      <span className={isActive ? "text-primary" : "text-[var(--text-tertiary)]"}>
                        <item.icon size={18} />
                      </span>
                    )}
                    <div className="flex flex-col">
                      <span className="text-xs">{item.label}</span>
                      <span className="text-[10px] text-[var(--text-tertiary)] font-normal truncate">
                        {item.kicker}
                      </span>
                    </div>
                  </NavLink>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
