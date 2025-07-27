"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, AlertCircle, CheckCircle } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [backendStatus, setBackendStatus] = useState<"checking" | "online" | "offline">("checking")
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login } = useAuth()

  // Check backend connectivity on component mount
  useEffect(() => {
    checkBackendStatus()
    const message = searchParams.get("message")
    if (message) {
      setSuccessMessage(message)
    }
  }, [searchParams])

  const checkBackendStatus = async () => {
    try {
      console.log("🔍 Checking backend connectivity...")
      // Try a simple GET request to check if backend is running
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "GET",
        mode: "cors",
      })
      console.log("✅ Backend is reachable, status:", response.status)
      setBackendStatus("online")
    } catch (error) {
      console.error("❌ Backend is not reachable:", error)
      setBackendStatus("offline")
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccessMessage("")
    setIsLoading(true)

    if (!formData.email || !formData.password) {
      setError("Please fill in all fields")
      setIsLoading(false)
      return
    }

    // Check backend status before attempting login
    if (backendStatus === "offline") {
      setError("Backend server is not running. Please start your Spring Boot application on port 8080.")
      setIsLoading(false)
      return
    }

    try {
      console.log("🔐 Attempting login with:", { email: formData.email })
      console.log("🌐 Making request to: http://localhost:8080/api/auth/login")

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 15000) // 15 second timeout

      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        mode: "cors",
        credentials: "omit",
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      console.log("📡 Response status:", response.status)
      console.log("📡 Response ok:", response.ok)
      console.log("📡 Response headers:", Object.fromEntries(response.headers.entries()))

      if (response.ok) {
        const userData = await response.json()
        console.log("✅ Raw backend response:", userData)
        console.log("🔍 Response keys:", Object.keys(userData))
        console.log("🔍 Full response structure:", JSON.stringify(userData, null, 2))

        // Handle different possible response formats from Spring Boot
        const actualUserData = userData.data || userData.user || userData

        // More comprehensive role extraction
        let userRole = null

        // Try multiple possible role field names
        const possibleRoleFields = [
          "role",
          "userRole",
          "user_role",
          "authority",
          "authorities",
          "roles",
          "userType",
          "accountType",
        ]

        for (const field of possibleRoleFields) {
          if (actualUserData[field]) {
            userRole = actualUserData[field]
            console.log(`🎭 Found role in field '${field}':`, userRole)
            break
          }
        }

        // Handle array of roles (take first one)
        if (Array.isArray(userRole)) {
          userRole = userRole[0]
          console.log("🎭 Extracted first role from array:", userRole)
        }

        // Handle role objects (common in Spring Security)
        if (typeof userRole === "object" && userRole !== null) {
          userRole = userRole.authority || userRole.name || userRole.role
          console.log("🎭 Extracted role from object:", userRole)
        }

        // Convert role to uppercase and clean it
        if (typeof userRole === "string") {
          userRole = userRole.toUpperCase().trim()
          // Remove common prefixes
          userRole = userRole.replace(/^ROLE_/, "")
          console.log("🎭 Cleaned role:", userRole)
        }

        console.log("🎭 Final processed role:", userRole)

        // Validate role - be more flexible
        if (!userRole || (userRole !== "ADMIN" && userRole !== "STUDENT")) {
          console.warn("⚠️ Invalid or missing role:", userRole)
          // Try to determine role from email or other fields
          if (formData.email.includes("admin") || actualUserData.email?.includes("admin")) {
            userRole = "ADMIN"
            console.log("🎭 Detected ADMIN from email pattern")
          } else {
            userRole = "STUDENT"
            console.log("🎭 Defaulting to STUDENT")
          }
        }

        const normalizedUserData = {
          id: actualUserData.id || actualUserData.userId || actualUserData.user_id || String(Date.now()),
          username:
            actualUserData.username ||
            actualUserData.userName ||
            actualUserData.user_name ||
            actualUserData.email?.split("@")[0] ||
            "user",
          firstName: actualUserData.firstName || actualUserData.first_name || actualUserData.fname || "User",
          lastName: actualUserData.lastName || actualUserData.last_name || actualUserData.lname || "Name",
          email: actualUserData.email || actualUserData.emailAddress || actualUserData.email_address || formData.email,
          phone:
            actualUserData.phone ||
            actualUserData.phoneNumber ||
            actualUserData.phone_number ||
            actualUserData.mobile ||
            "",
          role: userRole as "STUDENT" | "ADMIN",
        }

        console.log("🔄 Normalized user data:", normalizedUserData)
        console.log("👤 Final role for redirect:", normalizedUserData.role)

        // Validate email exists
        if (!normalizedUserData.email) {
          console.error("❌ No email found in response")
          setError("Invalid response from server. No email found.")
          setIsLoading(false)
          return
        }

        // Store user data in context
        console.log("💾 Storing user in context...")
        login(normalizedUserData)

        // Add a delay to ensure context is updated
        setTimeout(() => {
          console.log("🚀 Redirecting based on role:", normalizedUserData.role)

          // Explicit role-based redirect
          if (normalizedUserData.role === "ADMIN") {
            console.log("👑 ADMIN detected - Redirecting to /dashboard/admin")
            router.push("/dashboard/admin")
          } else {
            console.log("🎓 STUDENT detected - Redirecting to /dashboard/student")
            router.push("/dashboard/student")
          }
        }, 500)
      } else {
        const errorText = await response.text()
        console.error("❌ Login failed - Response text:", errorText)
        console.error("❌ Response status:", response.status)
        console.error("❌ Response headers:", Object.fromEntries(response.headers.entries()))

        // Handle specific HTTP status codes
        if (response.status === 403) {
          setError("Access forbidden. This might be a CORS issue. Check your Spring Boot CORS configuration.")
        } else if (response.status === 401) {
          setError("Invalid email or password")
        } else if (response.status === 404) {
          setError("Login endpoint not found. Check if your Spring Boot server is running correctly.")
        } else if (response.status === 500) {
          setError("Server error. Please check your Spring Boot application logs.")
        } else {
          try {
            const errorData = JSON.parse(errorText)
            setError(errorData.message || errorData.error || `Login failed (${response.status})`)
          } catch {
            setError(`Login failed (${response.status}): ${errorText || "Please try again"}`)
          }
        }
      }
    } catch (error: any) {
      console.error("🌐 Network error:", error)

      if (error.name === "AbortError") {
        setError("Request timeout. Please check your backend server and try again.")
      } else if (error.message?.includes("fetch") || error.message?.includes("Failed to fetch")) {
        setError(
          "Cannot connect to backend server. Please ensure your Spring Boot application is running on http://localhost:8080 with CORS enabled.",
        )
        setBackendStatus("offline")
      } else {
        setError(`Network error: ${error.message}`)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleRetryConnection = () => {
    setBackendStatus("checking")
    checkBackendStatus()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Sign In</CardTitle>
          <CardDescription className="text-center">
            Enter your email and password to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Backend Status Indicator */}
          <div className="mb-4 p-3 rounded-lg border">
            <div className="flex items-center gap-2">
              {backendStatus === "checking" && (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                  <span className="text-sm text-blue-600">Checking backend connection...</span>
                </>
              )}
              {backendStatus === "online" && (
                <>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600">Backend server is online</span>
                </>
              )}
              {backendStatus === "offline" && (
                <>
                  <AlertCircle className="h-4 w-4 text-red-500" />
                  <span className="text-sm text-red-600">Backend server is offline</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRetryConnection}
                    className="ml-auto bg-transparent"
                  >
                    Retry
                  </Button>
                </>
              )}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {successMessage && (
              <Alert>
                <AlertDescription>{successMessage}</AlertDescription>
              </Alert>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                placeholder="john@example.com"
                disabled={isLoading || backendStatus === "offline"}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                disabled={isLoading || backendStatus === "offline"}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading || backendStatus === "offline"}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            {"Don't have an account? "}
            <Link href="/auth/register" className="text-blue-600 hover:underline">
              Sign up
            </Link>
          </div>

          {/* Debug info */}
          <div className="mt-4 p-3 bg-gray-100 rounded text-xs">
            <p className="font-semibold mb-1">Debug Info:</p>
            <p>Backend: http://localhost:8080</p>
            <p>Status: {backendStatus}</p>
            <p className="text-red-600 mt-1">If you get 403 error, add CORS configuration to your Spring Boot app!</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
