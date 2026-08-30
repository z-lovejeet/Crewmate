import React, { createContext, useContext, useEffect, useState } from "react"
import {
  auth,
  signInWithGoogle as fbSignInGoogle,
  signInWithEmail as fbSignInEmail,
  signUpWithEmail as fbSignUpEmail,
  logOut as fbLogOut,
  onAuthStateChanged,
  type User
} from "../services/firebase"

export interface CreatorProfile {
  uid: string
  displayName: string
  email: string
  photoURL?: string
  tier: "Emerging" | "Established" | "Enterprise"
  niche: string
  subscribers: string
}

interface AuthContextType {
  user: User | null
  profile: CreatorProfile | null
  isAuthenticated: boolean
  loading: boolean
  signInWithGoogle: () => Promise<void>
  signInWithEmail: (email: string, pass: string) => Promise<void>
  signUpWithEmail: (email: string, pass: string, name: string) => Promise<void>
  logout: () => Promise<void>
  openAuthModal: () => void
  closeAuthModal: () => void
  isAuthModalOpen: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<CreatorProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
      setUser(fbUser)
      if (fbUser) {
        setProfile({
          uid: fbUser.uid,
          displayName: fbUser.displayName || fbUser.email?.split("@")[0] || "TechVoyager",
          email: fbUser.email || "",
          photoURL: fbUser.photoURL || undefined,
          tier: "Enterprise",
          niche: "AI & Tech Creation",
          subscribers: "185K+"
        })
      } else {
        setProfile(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const signInWithGoogle = async () => {
    setLoading(true)
    try {
      const u = await fbSignInGoogle()
      setUser(u)
      setIsAuthModalOpen(false)
    } finally {
      setLoading(false)
    }
  }

  const signInWithEmail = async (email: string, pass: string) => {
    setLoading(true)
    try {
      const u = await fbSignInEmail(email, pass)
      setUser(u)
      setIsAuthModalOpen(false)
    } finally {
      setLoading(false)
    }
  }

  const signUpWithEmail = async (email: string, pass: string, name: string) => {
    setLoading(true)
    try {
      const u = await fbSignUpEmail(email, pass, name)
      setUser(u)
      setIsAuthModalOpen(false)
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    setLoading(true)
    try {
      await fbLogOut()
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isAuthenticated: !!user,
        loading,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        logout,
        openAuthModal: () => setIsAuthModalOpen(true),
        closeAuthModal: () => setIsAuthModalOpen(false),
        isAuthModalOpen
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
