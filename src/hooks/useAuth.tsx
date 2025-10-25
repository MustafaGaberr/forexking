"use client"

import { useState, useEffect, createContext, useContext, type ReactNode } from "react"
import { authAPI, type User } from "@/services/api"

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (name: string, email: string, password: string, phoneNumber: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // ✅ استرجاع المستخدم من localStorage عند تحميل الصفحة
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    } else {
      const currentUser = authAPI.getCurrentUser()
      if (currentUser) {
        setUser(currentUser)
        localStorage.setItem("user", JSON.stringify(currentUser))
      }
    }
    setLoading(false)
  }, [])

  const signIn = async (email: string, password: string) => {
    setLoading(true)
    try {
      const user = await authAPI.signIn({ email, password })
      // ✅ خزن بيانات المستخدم
      localStorage.setItem("user", JSON.stringify(user))
      setUser(user)
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (name: string, email: string, password: string, phoneNumber: string) => {
    setLoading(true)
    try {
      const user = await authAPI.signUp({ name, email, password, phoneNumber })
      // ✅ خزن بيانات المستخدم
      localStorage.setItem("user", JSON.stringify(user))
      setUser(user)
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      await authAPI.signOut() // سيقوم بحذف التوكن
      localStorage.removeItem("user")
      localStorage.removeItem("forexking_token")
      setUser(null)
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
