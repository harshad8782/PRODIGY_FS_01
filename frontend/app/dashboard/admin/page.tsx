"use client"

import { useAuth } from "@/contexts/auth-context"
import { ProtectedRoute } from "@/components/protected-route"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { Users, Settings, Shield, BarChart3 } from "lucide-react"

export default function AdminDashboard() {
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <ProtectedRoute allowedRoles={["ADMIN"]}>
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-1">Welcome back, {user?.firstName}!</p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="destructive" className="px-3 py-1">
                <Shield className="w-4 h-4 mr-1" />
                ADMIN
              </Badge>
              <Button onClick={handleLogout} variant="outline">
                Logout
              </Button>
            </div>
          </div>

          {/* User Info Card */}
          <Card className="mb-8 border-red-200">
            <CardHeader className="bg-red-50">
              <CardTitle className="text-red-800">Administrator Profile</CardTitle>
              <CardDescription>Your account information and privileges</CardDescription>
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

          {/* Admin Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow border-red-200">
              <CardHeader className="text-center">
                <Users className="w-12 h-12 mx-auto text-red-600 mb-2" />
                <CardTitle className="text-red-800">User Management</CardTitle>
                <CardDescription>Manage student and admin accounts</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-red-600 hover:bg-red-700">Manage Users</Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border-red-200">
              <CardHeader className="text-center">
                <BarChart3 className="w-12 h-12 mx-auto text-red-600 mb-2" />
                <CardTitle className="text-red-800">Analytics</CardTitle>
                <CardDescription>View system analytics and reports</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-red-600 hover:bg-red-700">View Analytics</Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border-red-200">
              <CardHeader className="text-center">
                <Settings className="w-12 h-12 mx-auto text-red-600 mb-2" />
                <CardTitle className="text-red-800">System Settings</CardTitle>
                <CardDescription>Configure system preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-red-600 hover:bg-red-700">System Settings</Button>
              </CardContent>
            </Card>
          </div>

          {/* Admin Privileges Notice */}
          <Card className="mt-8 border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Shield className="w-6 h-6 text-red-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-red-800 mb-2">Administrator Privileges</h3>
                  <ul className="text-sm text-red-700 space-y-1">
                    <li>• Full access to user management</li>
                    <li>• System configuration and settings</li>
                    <li>• Analytics and reporting dashboard</li>
                    <li>• Security and access control management</li>
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
