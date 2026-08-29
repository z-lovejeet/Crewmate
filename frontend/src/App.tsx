import { useState, useEffect } from "react"
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
import Reports from "./pages/Reports"

interface ToastItem {
  id: number
  text: string
}

export default function App() {
  const location = useLocation()
  const [listening, setListening] = useState(false)
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const isDashboard =
    location.pathname !== "/" && location.pathname !== "/about"
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
      <Navbar notifications={3} onVoice={handleMic} listening={listening} />

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
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <Routes location={location}>
                <Route path="/" element={<Landing />} />
                <Route path="/about" element={<About />} />
                <Route path="/dashboard" element={<CommandCenter />} />
                <Route path="/contracts" element={<Contracts />} />
                <Route path="/compliance" element={<Compliance />} />
                <Route path="/distribution" element={<Distribution />} />
                <Route path="/fleet" element={<Fleet />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="*" element={<Landing />} />
              </Routes>
            </motion.div>
          </AnimatePresence>
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
              className="clay-lg max-w-xs bg-surface px-4 py-3 text-sm font-medium text-text-primary"
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
