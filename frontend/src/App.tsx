import React, { useState, useEffect, Component, type ErrorInfo, type ReactNode } from "react"
import { Routes, Route, useLocation } from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion"
import { Navbar } from "./components/layout/Navbar"
import { Footer } from "./components/layout/Footer"
import { PageHeader } from "./components/layout/PageHeader"
import { NAV } from "./lib/nav"

import Landing from "./pages/Landing"
import About from "./pages/About"
import CommandCenter from "./pages/CommandCenter"
import Contracts from "./pages/Contracts"
import Compliance from "./pages/Compliance"
import Distribution from "./pages/Distribution"
import Fleet from "./pages/Fleet"
import ScriptsStudio from "./pages/ScriptsStudio"
import MediaStudio from "./pages/MediaStudio"
import ChannelProfile from "./pages/ChannelProfile"
import { useAuth } from "./context/AuthContext"
import { Navigate } from "react-router-dom"

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, loading, openAuthModal } = useAuth()
  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-5 h-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    )
  }
  if (!isAuthenticated) {
    // Trigger auth modal and redirect to landing
    setTimeout(() => openAuthModal(), 100)
    return <Navigate to="/" replace />
  }
  return <>{children}</>
}

interface ToastItem {
  id: number
  text: string
}

interface ErrorBoundaryProps {
  children: ReactNode
  locationKey?: string
}
interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Studio Page Error Boundary caught an error:", error, errorInfo)
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    if (prevProps.locationKey !== this.props.locationKey && this.state.hasError) {
      this.setState({ hasError: false, error: null })
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
          <div className="p-6 rounded-3xl bg-[var(--surface)] border border-[var(--border)] max-w-md shadow-sm">
            <h3 className="font-bold text-base text-text-primary mb-2 font-[var(--font-display)]">
              Workspace Temporarily Reset
            </h3>
            <p className="text-xs text-text-secondary leading-relaxed mb-4">
              {this.state.error?.message || "An unexpected display issue occurred in this studio tab. Click below to reload cleanly."}
            </p>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="px-5 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:brightness-110 transition cursor-pointer"
            >
              Reload Workspace
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

export default function App() {
  const location = useLocation()
  const [listening, setListening] = useState(false)
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const isDashboard = location.pathname !== "/" && location.pathname !== "/about"
  const currentNav = NAV.find((n) => n.path === location.pathname)

  useEffect(() => {
    if (currentNav) {
      document.title = `Crewmate — ${currentNav.title}`
    } else if (location.pathname === "/") {
      document.title = "Crewmate — Enterprise AI for Creators"
    } else if (location.pathname === "/about") {
      document.title = "Crewmate — About"
    }
  }, [location.pathname, currentNav])

  const pushToast = (text: string) => {
    const id = Date.now()
    setToasts((t) => [...t, { id, text }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 5000)
  }

  const handleMic = () => {
    setListening((v) => !v)
    if (!listening) {
      pushToast("Listening... speak your command")
      setTimeout(() => {
        setListening(false)
        pushToast("Orchestrator: running compliance scan now.")
      }, 2800)
    }
  }

  return (
    <div
      className="flex min-h-screen flex-col"
      style={{ background: "var(--bg-app)" }}
    >
      <Navbar notifications={3} />

      <main className="flex flex-1 flex-col">
        {isDashboard && currentNav && (
          <header className="px-4 pt-8 sm:px-6 md:px-10">
            <PageHeader
              icon={currentNav.icon}
              kicker={currentNav.kicker}
              title={currentNav.title}
              subtitle={currentNav.subtitle}
              badgeText={currentNav.badgeText}
              badgeTone={currentNav.badgeTone}
            />
          </header>
        )}

        <div className="flex-1 px-4 pb-12 sm:px-6 md:px-10">
          <ErrorBoundary key={location.pathname} locationKey={location.pathname}>
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <Routes location={location}>
                  <Route path="/" element={<Landing />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/dashboard" element={<CommandCenter />} />
                  <Route path="/trends" element={<Distribution />} />
                  <Route path="/scripts" element={<ScriptsStudio />} />
                  <Route path="/media" element={<MediaStudio />} />
                  <Route path="/contracts" element={<Contracts />} />
                  <Route path="/compliance" element={<Compliance />} />
                  <Route path="/fleet" element={<Fleet />} />
                  <Route path="/channel" element={<ChannelProfile />} />
                  <Route path="/profile" element={<ChannelProfile />} />

                  {/* Backward-compatibility aliases */}
                  <Route path="/distribution" element={<Distribution />} />
                  <Route path="/reports" element={<MediaStudio />} />

                  <Route path="*" element={<Landing />} />
                </Routes>
              </motion.div>
            </AnimatePresence>
          </ErrorBoundary>
        </div>
      </main>

      <Footer />

      {/* Toast stack */}
      <div className="fixed right-6 top-6 z-50 flex flex-col gap-3">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 60 }}
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
              className="clay-lg max-w-xs bg-surface px-4 py-3 text-sm font-medium text-text-primary border border-[var(--border)]"
              style={{ borderRadius: 16 }}
            >
              {t.text}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
