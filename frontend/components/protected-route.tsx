"use client"

import type React from "react"

import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Loader2 } from "lucide-react"

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: ("STUDENT" | "ADMIN")[]
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    console.log("🛡️ ProtectedRoute - Auth state:", {
      isLoading,
      isAuthenticated,
      user: user ? { ...user, password: "[HIDDEN]" } : null,
      allowedRoles,
    })

    if (!isLoading) {
      if (!isAuthenticated) {
        console.log("🚫 ProtectedRoute - Not authenticated, redirecting to login")
        router.push("/auth/login")
        return
      }

      if (allowedRoles && user) {
        console.log("🔍 ProtectedRoute - Checking role access:", {
          userRole: user.role,
          allowedRoles,
          hasAccess: allowedRoles.includes(user.role),
        })

        if (!allowedRoles.includes(user.role)) {
          console.log("🚫 ProtectedRoute - Role not allowed, redirecting to unauthorized")
          router.push("/unauthorized")
          return
        } else {
          console.log("✅ ProtectedRoute - Access granted for role:", user.role)
        }
      }
    }
  }, [isAuthenticated, isLoading, user, allowedRoles, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p>Redirecting to login...</p>
        </div>
      </div>
    )
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p>Checking permissions...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
