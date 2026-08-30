import { initializeApp, getApps, getApp } from "firebase/app"
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut as fbSignOut,
  onAuthStateChanged,
  type User
} from "firebase/auth"

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "crewmate-507013.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "crewmate-507013",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "crewmate-507013.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "285381944529",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:285381944529:web:8e15cd8e0507ec8e6dd1f0",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-5S3X1WK9DH"
}

// Initialize Firebase singleton
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig)
export const auth = getAuth(app)

export const googleProvider = new GoogleAuthProvider()
googleProvider.addScope("email")
googleProvider.addScope("profile")
googleProvider.setCustomParameters({ prompt: "select_account" })

export async function signInWithGoogle(): Promise<User> {
  const result = await signInWithPopup(auth, googleProvider)
  return result.user
}

export async function signInWithEmail(email: string, pass: string): Promise<User> {
  const result = await signInWithEmailAndPassword(auth, email, pass)
  return result.user
}

export async function signUpWithEmail(email: string, pass: string, displayName: string): Promise<User> {
  const result = await createUserWithEmailAndPassword(auth, email, pass)
  if (displayName && result.user) {
    await updateProfile(result.user, { displayName })
  }
  return result.user
}

export async function logOut(): Promise<void> {
  await fbSignOut(auth)
}

export async function getCurrentUserToken(): Promise<string | null> {
  if (!auth.currentUser) return null
  return await auth.currentUser.getIdToken()
}

export { onAuthStateChanged, type User }
