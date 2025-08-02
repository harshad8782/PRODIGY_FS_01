"use client"

import { useAuth } from "@/contexts/auth-context"
import { ProtectedRoute } from "@/components/protected-route"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { BookOpen, User, Calendar, Award } from "lucide-react"

export default function StudentDashboard() {
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <ProtectedRoute allowedRoles={["STUDENT"]}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Student Dashboard</h1>
              <p className="text-gray-600 mt-1">Welcome back, {user?.firstName}!</p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="px-3 py-1 bg-blue-100 text-blue-800">
                <BookOpen className="w-4 h-4 mr-1" />
                STUDENT
              </Badge>
              <Button onClick={handleLogout} variant="outline">
                Logout
              </Button>
            </div>
          </div>

          {/* User Info Card */}
          <Card className="mb-8 border-blue-200">
            <CardHeader className="bg-blue-50">
              <CardTitle className="text-blue-800">Student Profile</CardTitle>
              <CardDescription>Your account information and academic details</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Full Name</p>
                  <p className="text-lg">
                    {user?.firstName} {user?.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p className="text-lg">{user?.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Username</p>
                  <p className="text-lg">{user?.username}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Phone</p>
                  <p className="text-lg">{user?.phone || "Not provided"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Student Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="hover:shadow-lg transition-shadow border-blue-200">
              <CardHeader className="text-center">
                <BookOpen className="w-12 h-12 mx-auto text-blue-600 mb-2" />
                <CardTitle className="text-blue-800">My Courses</CardTitle>
                <CardDescription>View and manage your enrolled courses</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">View Courses</Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border-blue-200">
              <CardHeader className="text-center">
                <Calendar className="w-12 h-12 mx-auto text-blue-600 mb-2" />
                <CardTitle className="text-blue-800">Schedule</CardTitle>
                <CardDescription>Check your class schedule and assignments</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">View Schedule</Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border-blue-200">
              <CardHeader className="text-center">
                <Award className="w-12 h-12 mx-auto text-blue-600 mb-2" />
                <CardTitle className="text-blue-800">Grades</CardTitle>
                <CardDescription>View your academic performance</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">View Grades</Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border-blue-200">
              <CardHeader className="text-center">
                <User className="w-12 h-12 mx-auto text-blue-600 mb-2" />
                <CardTitle className="text-blue-800">Profile Settings</CardTitle>
                <CardDescription>Manage your account information</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={() => router.push("/profile")}>
                  Manage Profile
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Student Resources */}
          <Card className="mt-8 border-blue-200 bg-blue-50">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <User className="w-6 h-6 text-blue-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-blue-800 mb-2">Student Resources</h3>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Access to course materials and assignments</li>
                    <li>• Online library and research resources</li>
                    <li>• Academic calendar and important dates</li>
                    <li>• Student support and counseling services</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  )
}
