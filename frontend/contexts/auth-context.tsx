"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  id?: string
  username: string
  firstName: string
  lastName: string
  email: string
  phone: string
  role: "STUDENT" | "ADMIN"
}

interface AuthContextType {
  user: User | null
  login: (userData: User) => void
  logout: () => void
  isAuthenticated: boolean
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in on app start
    try {
      const savedUser = localStorage.getItem("user")
      console.log("🔍 AuthContext - Checking saved user:", savedUser)

      if (savedUser) {
        const parsedUser = JSON.parse(savedUser)
        console.log("✅ AuthContext - Parsed saved user:", parsedUser)
        setUser(parsedUser)
      }
    } catch (error) {
      console.error("❌ AuthContext - Error parsing saved user:", error)
      localStorage.removeItem("user")
    }
    setIsLoading(false)
  }, [])

  const login = (userData: User) => {
    console.log("🔐 AuthContext - Login called with:", userData)
    setUser(userData)
    localStorage.setItem("user", JSON.stringify(userData))
    console.log("💾 AuthContext - User data saved to localStorage")
  }

  const logout = () => {
    console.log("🚪 AuthContext - Logout called")
    setUser(null)
    localStorage.removeItem("user")
  }

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    isLoading,
  }

  console.log("📊 AuthContext - Current state:", {
    user: user ? { ...user, password: "[HIDDEN]" } : null,
    isAuthenticated: !!user,
    isLoading,
  })

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
